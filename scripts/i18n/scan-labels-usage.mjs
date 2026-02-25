#!/usr/bin/env node
/**
 * 扫描 labels 目录，输出：
 * 1) 未使用翻译键清单（基于静态 t('...') / i18n.t('...') 检测，含 returnObjects 前缀推断）
 * 2) 重复文件清单（同内容的 labels 文件，按对象字面量近似归一化比对）
 * 3) data/* 内容型数据候选（长文本/问答结构等）提示
 *
 * 注意：静态分析可能有误差（动态键、条件路径等），报告仅作参考。
 */
import fs from 'fs';
import path from 'path';
import ts from 'typescript';

const ROOT = path.resolve(process.cwd());
const LOCALES_INDEX = path.join(ROOT, 'src', 'locales', 'index.ts');
const SRC_DIR = path.join(ROOT, 'src');
const LABELS_DIR = path.join(ROOT, 'src', 'locales');

const read = (p) => fs.readFileSync(p, 'utf8');
const exists = (p) => fs.existsSync(p);
const walk = (dir, filter = () => true) => {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p, filter));
    else if (filter(p)) out.push(p);
  }
  return out;
};

function unwrapExpression(expr) {
  let cur = expr;
  // @ts-ignore
  while (cur) {
    if (ts.isParenthesizedExpression(cur)) { cur = cur.expression; continue; }
    if (ts.isAsExpression(cur)) { cur = cur.expression; continue; }
    if (ts.isNonNullExpression(cur)) { cur = cur.expression; continue; }
    return cur;
  }
  return cur;
}
function getPropertyNameText(name) {
  if (!name) return undefined;
  if (ts.isIdentifier(name)) return name.text;
  if (ts.isStringLiteral(name)) return name.text;
  if (ts.isNumericLiteral(name)) return name.text;
  return undefined;
}
function resolveImportMap(sf, baseDir) {
  const importMap = new Map();
  sf.forEachChild(node => {
    if (!ts.isImportDeclaration(node)) return;
    if (!ts.isStringLiteral(node.moduleSpecifier)) return;
    const spec = node.moduleSpecifier.text;
    const named = node.importClause?.namedBindings;
    if (!named || !ts.isNamedImports(named)) return;
    let abs = spec;
    if (spec.startsWith('./') || spec.startsWith('../')) {
      abs = path.resolve(baseDir, spec);
    } else {
      return;
    }
    const candidates = [
      abs + '.ts',
      abs + '.tsx',
      path.join(abs, 'index.ts'),
      path.join(abs, 'index.tsx'),
    ];
    const found = candidates.find(p => exists(p));
    if (!found) return;
    for (const el of named.elements) {
      const ident = el.name.text;
      importMap.set(ident, found);
    }
  });
  return importMap;
}
function findInitializerObjectForIdentifier(sf, ident) {
  let found;
  function visit(node) {
    if (found) return;
    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (ts.isIdentifier(decl.name) && decl.name.text === ident) {
          const init = decl.initializer ? unwrapExpression(decl.initializer) : undefined;
          if (init && ts.isObjectLiteralExpression(init)) found = init;
          return;
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  ts.forEachChild(sf, visit);
  return found;
}
function extractLeafKeysFromObjectLiteral(obj, prefixParts = []) {
  const keys = new Set();
  const visitObj = (o, prefix = []) => {
    for (const prop of o.properties) {
      if (ts.isPropertyAssignment(prop)) {
        const name = getPropertyNameText(prop.name);
        if (!name) continue;
        const init = prop.initializer ? unwrapExpression(prop.initializer) : undefined;
        const nextPrefix = [...prefix, name];
        if (init && ts.isObjectLiteralExpression(init)) {
          visitObj(init, nextPrefix);
        } else {
          keys.add(nextPrefix.join('.'));
        }
      } else if (ts.isShorthandPropertyAssignment(prop)) {
        keys.add([...prefix, prop.name.text].join('.'));
      }
    }
  };
  visitObj(obj, prefixParts);
  return keys;
}
function extractKeysFromIdentifier(filePath, ident, prefix = '') {
  const content = read(filePath);
  const sf = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const obj = findInitializerObjectForIdentifier(sf, ident);
  const keys = extractLeafKeysFromObjectLiteral(obj || ts.factory.createObjectLiteralExpression(), []);
  if (!prefix) return keys;
  return new Set([...keys].map(k => `${prefix}.${k}`));
}
function buildLangKeys(indexSf, importMap, langProp) {
  const langName = getPropertyNameText(langProp.name);
  const result = new Set();
  const langInit = langProp.initializer ? unwrapExpression(langProp.initializer) : undefined;
  if (!langInit || !ts.isObjectLiteralExpression(langInit)) return { lang: langName, keys: result, keyToFile: new Map() };
  const keyToFile = new Map();
  const addKeys = (filePath, ident, prefix) => {
    const ks = extractKeysFromIdentifier(filePath, ident, prefix);
    ks.forEach(k => {
      result.add(k);
      keyToFile.set(k, filePath);
    });
  };
  for (const p of langInit.properties) {
    if (!ts.isPropertyAssignment(p)) continue;
    const pName = getPropertyNameText(p.name);
    if (pName !== 'translation') continue;
    const tInit = p.initializer ? unwrapExpression(p.initializer) : undefined;
    if (ts.isIdentifier(tInit)) {
      const filePath = importMap.get(tInit.text);
      if (filePath) addKeys(filePath, tInit.text, '');
    } else if (ts.isObjectLiteralExpression(tInit)) {
      for (const tProp of tInit.properties) {
        if (ts.isSpreadAssignment(tProp)) {
          const expr = unwrapExpression(tProp.expression);
          if (expr && ts.isIdentifier(expr)) {
            const filePath = importMap.get(expr.text);
            if (filePath) addKeys(filePath, expr.text, '');
          }
        } else if (ts.isPropertyAssignment(tProp)) {
          const name = getPropertyNameText(tProp.name);
          const init = tProp.initializer ? unwrapExpression(tProp.initializer) : undefined;
          if (init && ts.isIdentifier(init)) {
            const filePath = importMap.get(init.text);
            if (filePath) addKeys(filePath, init.text, name || '');
          } else if (init && ts.isObjectLiteralExpression(init)) {
            const keys = extractLeafKeysFromObjectLiteral(init, name ? [name] : []);
            keys.forEach(k => {
              result.add(k);
              keyToFile.set(k, LOCALES_INDEX);
            });
          }
        }
      }
    }
  }
  return { lang: langName, keys: result, keyToFile };
}

function collectUsageKeys() {
  const files = walk(SRC_DIR, (p) => (p.endsWith('.ts') || p.endsWith('.tsx')) && !p.includes(path.sep + 'locales' + path.sep));
  const used = new Set();
  const usedPrefixes = new Set();
  const reSimple = /(?:^|[^\w])(?:i18n\.)?t\(\s*['"]([^'"]+)['"]/g;
  const reReturnObjects = /(?:^|[^\w])(?:i18n\.)?t\(\s*['"]([^'"]+)['"]\s*,\s*\{[^}]*returnObjects\s*:\s*true/gs;
  const reUseTranslation = /useTranslation\(\s*(\[[^\]]+\]|['"][^'"]+['"])?\s*\)/g;
  const reNsString = /['"]([^'"]+)['"]/g;
  for (const f of files) {
    const txt = read(f);
    // detect inferred namespaces from useTranslation(...)
    const inferredNs = new Set();
    let ut;
    while ((ut = reUseTranslation.exec(txt)) !== null) {
      const arg = ut[1];
      if (!arg) continue;
      if (arg.startsWith('[')) {
        // array form: extract simple string literals
        let sm;
        while ((sm = reNsString.exec(arg)) !== null) {
          inferredNs.add(sm[1]);
        }
      } else if (arg.startsWith("'") || arg.startsWith('"')) {
        inferredNs.add(arg.slice(1, -1));
      }
    }
    // collect t('...') and expand with inferred namespaces if present
    let m;
    while ((m = reSimple.exec(txt)) !== null) {
      const raw = m[1];
      used.add(raw);
      if (!raw.includes(':') && inferredNs.size > 0) {
        for (const ns of inferredNs) {
          used.add(`${ns}.${raw}`);
          // keep colon form for reference as well
          used.add(`${ns}:${raw}`);
        }
      }
    }
    while ((m = reReturnObjects.exec(txt)) !== null) {
      const raw = m[1];
      usedPrefixes.add(raw);
      if (!raw.includes(':') && inferredNs.size > 0) {
        for (const ns of inferredNs) {
          usedPrefixes.add(`${ns}.${raw}`);
          usedPrefixes.add(`${ns}:${raw}`);
        }
      }
    }
  }
  return { used, usedPrefixes };
}

function startsWithKey(key, prefix) {
  return key === prefix || key.startsWith(prefix + '.');
}

function normalizeFileContentForDup(content) {
  // remove comments
  const noBlock = content.replace(/\/\*[\s\S]*?\*\//g, '');
  const noLine = noBlock.replace(/^\s*\/\/.*$/gm, '');
  // collapse whitespace
  return noLine.replace(/\s+/g, '');
}

function scanDuplicateFiles() {
  const files = walk(LABELS_DIR, (p) => p.endsWith('.ts') && p.includes(path.sep + 'labels' + path.sep));
  const groups = new Map(); // lang|hash -> [file]
  for (const f of files) {
    const txt = read(f);
    // naive normalization
    const norm = normalizeFileContentForDup(txt);
    const segs = f.split(path.sep);
    const langIdx = segs.findIndex(s => s === 'locales') + 1;
    const lang = segs[langIdx] || 'unknown';
    const key = `${lang}|${norm}`;
    const arr = groups.get(key) || [];
    arr.push(f);
    groups.set(key, arr);
  }
  const dups = [...groups.values()].filter(arr => arr.length > 1);
  return dups;
}

function scanContentLikeData() {
  const files = walk(LABELS_DIR, (p) => p.endsWith('.ts') && p.includes(path.sep + 'labels' + path.sep + 'data' + path.sep));
  const suspects = [];
  for (const f of files) {
    const txt = read(f);
    // heuristics
    const longStrings = (txt.match(/['"][^'"]{120,}['"]/g) || []).length;
    const hasQnA = /(question|answer)\s*:\s*['"]/.test(txt);
    const paragraphs = /[\u3002.!?][\s\n]['"]?/.test(txt);
    const score = (hasQnA ? 2 : 0) + (paragraphs ? 1 : 0) + Math.min(longStrings, 3);
    if (score >= 2) {
      suspects.push({ file: f, longStrings, hasQnA, paragraphs });
    }
  }
  return suspects;
}

function scanContentLikePages() {
  const files = walk(LABELS_DIR, (p) => p.endsWith('.ts') && p.includes(path.sep + 'labels' + path.sep + 'pages' + path.sep));
  const suspects = [];
  for (const f of files) {
    const txt = read(f);
    // loosely flag pages files with many long strings or paragraphs (likely content)
    const longStrings = (txt.match(/['"][^'"]{160,}['"]/g) || []).length;
    const paragraphs = /[\u3002.!?][\s\n]['"]?/.test(txt);
    const hasSectional = /(##|#|\*{2,})/.test(txt);
    const score = (paragraphs ? 1 : 0) + (hasSectional ? 1 : 0) + Math.min(longStrings, 3);
    if (score >= 2) {
      suspects.push({ file: f, longStrings, paragraphs, hasSectional });
    }
  }
  return suspects;
}

function main() {
  if (!exists(LOCALES_INDEX)) {
    console.error('未找到 locales 入口：', LOCALES_INDEX);
    process.exit(1);
  }
  const sf = ts.createSourceFile(LOCALES_INDEX, read(LOCALES_INDEX), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const importMap = resolveImportMap(sf, path.dirname(LOCALES_INDEX));
  // build keys for en & zh
  let resourcesObj;
  sf.forEachChild(node => {
    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (ts.isIdentifier(decl.name) && decl.name.text === 'localeResources') {
          const init = decl.initializer ? unwrapExpression(decl.initializer) : undefined;
          if (init && ts.isObjectLiteralExpression(init)) resourcesObj = init;
        }
      }
    }
  });
  if (!resourcesObj) {
    console.error('未找到 localeResources 导出');
    process.exit(1);
  }
  const langReports = [];
  for (const langProp of resourcesObj.properties) {
    if (!ts.isPropertyAssignment(langProp)) continue;
    const built = buildLangKeys(sf, importMap, langProp);
    langReports.push(built);
  }
  const en = langReports.find(r => r.lang === 'en');
  const zh = langReports.find(r => r.lang === 'zh');
  const base = en || zh;
  if (!base) {
    console.error('未找到 en/zh 键集合');
    process.exit(1);
  }

  const { used, usedPrefixes } = collectUsageKeys();
  const allKeys = new Set([...(en?.keys || []), ...(zh?.keys || [])]);
  const usedKeys = new Set();
  for (const k of allKeys) {
    if (used.has(k)) { usedKeys.add(k); continue; }
    // treat namespace usage: any used key starting with `${k}.`
    const kDot = k + '.';
    let matched = false;
    for (const u of used) {
      if (u === k || u.startsWith(kDot)) { matched = true; break; }
    }
    if (matched) { usedKeys.add(k); continue; }
    for (const p of usedPrefixes) {
      if (startsWithKey(k, p) || p.startsWith(kDot) || p === k) { matched = true; break; }
    }
    if (matched) usedKeys.add(k);
  }
  const unused = [...allKeys].filter(k => !usedKeys.has(k)).sort();

  const dups = scanDuplicateFiles();
  const suspects = scanContentLikeData();
  const pageSuspects = scanContentLikePages();

  // Report
  console.log('=== I18N Labels Usage Report ===');
  console.log(`Total keys (en|zh union): ${allKeys.size}`);
  console.log(`Used keys (static detection): ${usedKeys.size}`);
  console.log(`Unused keys (static detection): ${unused.length}`);
  console.log('');
  console.log('Top 60 unused keys (preview):');
  unused.slice(0, 60).forEach(k => console.log(` - ${k}`));
  if (unused.length > 60) console.log(` ... 其余 ${unused.length - 60} 个省略`);

  console.log('\n=== Duplicate Label Files (content-equal, naive) ===');
  if (dups.length === 0) {
    console.log('No duplicates detected by naive normalization.');
  } else {
    dups.forEach((arr, idx) => {
      console.log(`Group #${idx + 1} (${arr.length} files):`);
      arr.forEach(f => console.log(` - ${path.relative(ROOT, f)}`));
    });
  }

  console.log('\n=== data/* Content-like Candidates ===');
  if (suspects.length === 0) {
    console.log('No content-like candidates detected.');
  } else {
    for (const s of suspects) {
      console.log(` - ${path.relative(ROOT, s.file)}  | longStrings:${s.longStrings}  q&a:${s.hasQnA}  paragraphs:${s.paragraphs}`);
    }
    console.log('\n建议：将上述文件的“长段落/问答内容”改为 snapshots 内容源，labels 中仅保留可翻译的短标签/字段名。');
  }

  console.log('\n=== pages/* Content-like Candidates ===');
  if (pageSuspects.length === 0) {
    console.log('No content-like candidates detected.');
  } else {
    for (const s of pageSuspects) {
      console.log(` - ${path.relative(ROOT, s.file)}  | longStrings:${s.longStrings}  paragraphs:${s.paragraphs}  sectional:${s.hasSectional}`);
    }
    console.log('\n建议：上述 pages 下的词条疑似承载内容数据，优先迁移到 snapshots，保留短标题/按钮等 UI 标签在 i18n。');
  }
}

main();
