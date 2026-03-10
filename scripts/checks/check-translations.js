#!/usr/bin/env node
/**
 * 翻译完整性检查脚本（解析 src/locales/index.ts 的 localeResources）
 * - 依据实际资源聚合入口，构建各语言的翻译键集合
 * - 校验不同 locale 之间的键一致性（默认仅比较 en 与 zh）
 */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const fs = require('fs');
const path = require('path');
import { fileURLToPath } from 'url';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const localesIndexPath = path.resolve(projectRoot, 'src', 'locales', 'index.ts');

function unwrapExpression(expr) {
  let cur = expr;
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
      // skip non-relative imports
      return;
    }
    const candidates = [
      abs + '.ts',
      abs + '.tsx',
      path.join(abs, 'index.ts'),
      path.join(abs, 'index.tsx'),
    ];
    const found = candidates.find(p => fs.existsSync(p));
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
  const content = fs.readFileSync(filePath, 'utf-8');
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
  if (!langInit || !ts.isObjectLiteralExpression(langInit)) return { lang: langName, keys: result };
  // translation property
  for (const p of langInit.properties) {
    if (!ts.isPropertyAssignment(p)) continue;
    const pName = getPropertyNameText(p.name);
    if (pName !== 'translation') continue;
    const tInit = p.initializer ? unwrapExpression(p.initializer) : undefined;
    if (ts.isIdentifier(tInit)) {
      const filePath = importMap.get(tInit.text);
      if (filePath) {
        const keys = extractKeysFromIdentifier(filePath, tInit.text);
        keys.forEach(k => result.add(k));
      }
    } else if (ts.isObjectLiteralExpression(tInit)) {
      for (const tProp of tInit.properties) {
        if (ts.isSpreadAssignment(tProp)) {
          const expr = unwrapExpression(tProp.expression);
          if (expr && ts.isIdentifier(expr)) {
            const filePath = importMap.get(expr.text);
            if (filePath) {
              const keys = extractKeysFromIdentifier(filePath, expr.text);
              keys.forEach(k => result.add(k));
            }
          }
        } else if (ts.isPropertyAssignment(tProp)) {
          const name = getPropertyNameText(tProp.name);
          const init = tProp.initializer ? unwrapExpression(tProp.initializer) : undefined;
          if (init && ts.isIdentifier(init)) {
            const filePath = importMap.get(init.text);
            if (filePath) {
              const keys = extractKeysFromIdentifier(filePath, init.text, name || '');
              keys.forEach(k => result.add(k));
            }
          } else if (init && ts.isObjectLiteralExpression(init)) {
            const keys = extractLeafKeysFromObjectLiteral(init, name ? [name] : []);
            keys.forEach(k => result.add(k));
          }
        }
      }
    }
  }
  return { lang: langName, keys: result };
}

function checkTranslations() {
  if (!fs.existsSync(localesIndexPath)) {
    console.error('❌ 未找到 src/locales/index.ts:', localesIndexPath);
    process.exit(1);
  }
  const content = fs.readFileSync(localesIndexPath, 'utf-8');
  const sf = ts.createSourceFile(localesIndexPath, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const importMap = resolveImportMap(sf, path.dirname(localesIndexPath));

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
    if (ts.isExportDeclaration(node)) {
      // ignore
    }
  });
  if (!resourcesObj) {
    console.error('❌ 未找到 localeResources 导出');
    process.exit(1);
  }

  const langReports = [];
  for (const langProp of resourcesObj.properties) {
    if (!ts.isPropertyAssignment(langProp)) continue;
    const built = buildLangKeys(sf, importMap, langProp);
    langReports.push(built);
  }

  const targetLangs = langReports.filter(r => r.lang === 'en' || r.lang === 'zh');
  if (targetLangs.length < 2) {
    console.error('❌ 仅找到以下语言:', langReports.map(r => r.lang).join(', '));
    process.exit(1);
  }

  console.log('📊 语言键统计:');
  for (const r of targetLangs) {
    console.log(`   ${r.lang}: ${r.keys.size} 个键`);
  }

  const allKeys = new Set();
  targetLangs.forEach(r => { for (const k of r.keys) allKeys.add(k); });

  let hasIssues = false;
  for (const r of targetLangs) {
    const missing = [...allKeys].filter(k => !r.keys.has(k));
    if (missing.length) {
      hasIssues = true;
      console.log(`\n🚩 ${r.lang} 缺失的键 (${missing.length}):`);
      missing.slice(0, 100).forEach(k => console.log(`   - ${k}`));
      if (missing.length > 100) console.log(`   ... 其余 ${missing.length - 100} 个省略`);
    }
  }

  if (!hasIssues) {
    console.log('\n✅ en 与 zh 键集合一致');
    process.exit(0);
  } else {
    console.log('\n❌ 键不一致，请同步翻译键');
    process.exit(1);
  }
}

console.log('开始检查翻译完整性（解析 localeResources）...\n');
checkTranslations();
console.log('\n检查完成。');
