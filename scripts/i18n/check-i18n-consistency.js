#!/usr/bin/env node
/**
 * 检查多语言内容和调用的一致性（页面级分组）
 * 
 * 更新点：
 * - 直接解析 src/locales/index.ts 的 localeResources，构建各语言的完整键集合
 * - 扫描 src/hooks 中的 t('...') 使用，按命名空间（首段或冒号前）分组报告缺失键
 * - 保留硬编码中文文本的检测
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..', '..');

const localesRoot = join(projectRoot, 'src', 'locales');
const localesIndexPath = join(localesRoot, 'index.ts');
const hooksRoot = join(projectRoot, 'src', 'hooks');
const languages = ['en', 'zh'];

// 命名空间同义映射（历史别名兼容）
const NS_SYNONYMS = new Map([
  ['resources', 'resourceCenter'],
  ['resourceCenter', 'resources'],
]);

// 当应用把所有翻译都挂在单一的 "translation" 命名空间下时，禁用基于点号的命名空间推断
let SINGLE_NAMESPACE_MODE = false;

function unwrapExpression(expr) {
  let cur = expr;
  while (cur) {
    if (ts.isParenthesizedExpression(cur)) {
      cur = cur.expression;
      continue;
    }
    if (ts.isAsExpression(cur)) {
      cur = cur.expression;
      continue;
    }
    if (ts.isNonNullExpression(cur)) {
      cur = cur.expression;
      continue;
    }
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
      abs = join(baseDir, spec);
    } else {
      return;
    }
    const candidates = [
      abs + '.ts',
      abs + '.tsx',
      join(abs, 'index.ts'),
      join(abs, 'index.tsx')
    ];
    const found = candidates.find(p => existsSync(p));
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

function getDefaultExportObjectLiteral(content, fileName = 'x.ts') {
  const sf = ts.createSourceFile(fileName, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  let exportExpr;
  sf.forEachChild(node => {
    if (ts.isExportAssignment(node)) exportExpr = node.expression;
  });
  if (!exportExpr) return undefined;
  const unwrapped = unwrapExpression(exportExpr);
  if (unwrapped && ts.isObjectLiteralExpression(unwrapped)) return unwrapped;
  if (unwrapped && ts.isIdentifier(unwrapped)) return findInitializerObjectForIdentifier(sf, unwrapped.text);
  return undefined;
}

function findInitializerExpressionForIdentifier(sf, ident) {
  let found;
  function visit(node) {
    if (found) return;
    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (ts.isIdentifier(decl.name) && decl.name.text === ident) {
          const init = decl.initializer ? unwrapExpression(decl.initializer) : undefined;
          if (init) {
            found = init;
            return;
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  ts.forEachChild(sf, visit);
  return found;
}

function extractAllKeyPathsFromDefaultExport(content, fileName = 'x.ts') {
  const obj = getDefaultExportObjectLiteral(content, fileName);
  const keys = new Set();
  if (!obj) return keys;
  const visitObj = (o, prefix = []) => {
    for (const prop of o.properties) {
      if (ts.isPropertyAssignment(prop)) {
        const name = getPropertyNameText(prop.name);
        if (!name) continue;
        const nextPrefix = [...prefix, name];
        keys.add(nextPrefix.join('.'));
        const init = prop.initializer ? unwrapExpression(prop.initializer) : undefined;
        if (init && ts.isObjectLiteralExpression(init)) visitObj(init, nextPrefix);
      } else if (ts.isShorthandPropertyAssignment(prop)) {
        const name = prop.name.text;
        keys.add([...prefix, name].join('.'));
      } else if (ts.isMethodDeclaration(prop) || ts.isGetAccessorDeclaration(prop) || ts.isSetAccessorDeclaration(prop)) {
        const name = getPropertyNameText(prop.name);
        if (!name) continue;
        keys.add([...prefix, name].join('.'));
      }
    }
  };
  visitObj(obj);
  return keys;
}

// 解析 src/locales/index.ts 的 localeResources，构建各语言键集合
function extractLeafKeysFromObjectLiteral(obj, prefixParts = [], importResolver) {
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
        } else if (init && ts.isIdentifier(init) && typeof importResolver === 'function') {
          const filePath = importResolver(init.text);
          if (filePath) {
            const nested = extractKeysFromIdentifier(filePath, init.text, nextPrefix.join('.'));
            for (const k of nested) keys.add(k);
          } else {
            keys.add(nextPrefix.join('.'));
          }
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
  const content = readFileSync(filePath, 'utf-8');
  const sf = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const obj = findInitializerObjectForIdentifier(sf, ident);
  const importMap = resolveImportMap(sf, dirname(filePath));
  const resolver = (name) => importMap.get(name);
  let keys = new Set();
  if (obj && ts.isObjectLiteralExpression(obj)) {
    // Direct object literal export
    keys = extractLeafKeysFromObjectLiteral(obj, [], resolver);
  } else {
    // Handle alias exports like: export const resourceCenter = resources;
    const initExpr = findInitializerExpressionForIdentifier(sf, ident);
    if (initExpr && ts.isIdentifier(initExpr)) {
      const aliased = initExpr.text;
      // Try local definition first
      const localObj = findInitializerObjectForIdentifier(sf, aliased);
      if (localObj && ts.isObjectLiteralExpression(localObj)) {
        keys = extractLeafKeysFromObjectLiteral(localObj, [], resolver);
      } else {
        // Fallback to imported source
        const importedPath = importMap.get(aliased);
        if (importedPath) {
          keys = extractKeysFromIdentifier(importedPath, aliased, '');
        } else {
          // Could not resolve, return the alias name as a leaf to avoid total loss
          keys = new Set([aliased]);
        }
      }
    } else if (initExpr && ts.isObjectLiteralExpression(initExpr)) {
      keys = extractLeafKeysFromObjectLiteral(initExpr, [], resolver);
    }
  }
  if (!prefix) return keys;
  return new Set([...keys].map(k => `${prefix}.${k}`));
}

function buildLangKeys(indexSf, importMap, langProp) {
  const langName = getPropertyNameText(langProp.name);
  const result = new Set();
  const langInit = langProp.initializer ? unwrapExpression(langProp.initializer) : undefined;
  if (!langInit || !ts.isObjectLiteralExpression(langInit)) return { lang: langName, keys: result };
  for (const p of langInit.properties) {
    if (!ts.isPropertyAssignment(p)) continue;
    const pName = getPropertyNameText(p.name);
    if (pName !== 'translation') continue;
    const tInit = p.initializer ? unwrapExpression(p.initializer) : undefined;
    if (!tInit) continue;
    if (ts.isIdentifier(tInit)) {
      const filePath = resolveImportMap(indexSf, dirname(localesIndexPath)).get(tInit.text);
      if (filePath) {
        const keys = extractKeysFromIdentifier(filePath, tInit.text);
        keys.forEach(k => result.add(k));
      }
    } else if (ts.isObjectLiteralExpression(tInit)) {
      for (const tProp of tInit.properties) {
        if (ts.isSpreadAssignment(tProp)) {
          const expr = unwrapExpression(tProp.expression);
          if (expr && ts.isIdentifier(expr)) {
            const filePath = resolveImportMap(indexSf, dirname(localesIndexPath)).get(expr.text);
            if (filePath) {
              const keys = extractKeysFromIdentifier(filePath, expr.text);
              keys.forEach(k => result.add(k));
            }
          }
        } else if (ts.isPropertyAssignment(tProp)) {
          const name = getPropertyNameText(tProp.name);
          const init = tProp.initializer ? unwrapExpression(tProp.initializer) : undefined;
          if (init && ts.isIdentifier(init)) {
            const filePath = resolveImportMap(indexSf, dirname(localesIndexPath)).get(init.text);
            if (filePath) {
              const keys = extractKeysFromIdentifier(filePath, init.text, name || '');
              keys.forEach(k => result.add(k));
            }
          } else if (init && ts.isObjectLiteralExpression(init)) {
            const resolver = (ident) => resolveImportMap(indexSf, dirname(localesIndexPath)).get(ident);
            const keys = extractLeafKeysFromObjectLiteral(init, name ? [name] : [], resolver);
            keys.forEach(k => result.add(k));
          }
        }
      }
    }
  }
  return { lang: langName, keys: result };
}

// 检查组件/上下文中的硬编码中文文本
function checkHooksUsage() {
  const scanDirs = [
    hooksRoot,
    join(projectRoot, 'src', 'components'),
    join(projectRoot, 'src', 'pages')
  ];
  const issues = [];
  
  function scanDirectory(dir) {
    try {
      const entries = readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        
        if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
          const content = readFileSync(fullPath, 'utf-8');
          
          // 检查是否有硬编码的中文文本
          const chinesePattern = /[\u4e00-\u9fa5]+/g;
          const chineseMatches = content.match(chinesePattern);
          
          // 检查是否使用了 useGlobalUILabels
          const usesLabels = /t\(['"`][\w\.\-]+['"`]\)/g.test(content);
          
          if (chineseMatches && !usesLabels && !entry.name.includes('test')) {
            // 过滤掉注释和字符串中的中文
            const filtered = chineseMatches.filter(m => {
              // 简单的启发式：如果中文出现在引号中，可能是硬编码
              const index = content.indexOf(m);
              const before = content.substring(Math.max(0, index - 20), index);
              const after = content.substring(index, Math.min(content.length, index + m.length + 20));
              return /["']/.test(before) || /["']/.test(after);
            });
            
            if (filtered.length > 0) {
              issues.push({
                file: relative(projectRoot, fullPath),
                type: 'hardcoded-text',
                chineseCount: filtered.length
              });
            }
          }
        }
      }
    } catch (err) {
      // 忽略错误
    }
  }
  
  for (const d of scanDirs) {
    if (existsSync(d) && statSync(d).isDirectory()) {
      scanDirectory(d);
    }
  }
  return issues;
}

// 扫描源码中的 t('...') 使用，并按命名空间归类
function findHookLabelUsages() {
  const scanDirs = [
    hooksRoot,
    join(projectRoot, 'src', 'components'),
    join(projectRoot, 'src', 'pages')
  ];
  const labelUsages = new Map(); // file -> Set of property names (namespaced with inferred ns)
  function scanDirectory(dir) {
    try {
      const entries = readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
          scanDirectory(fullPath);
        } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
          const content = readFileSync(fullPath, 'utf-8');
          const relFile = relative(projectRoot, fullPath).replace(/\\/g, '/');
          // Support multiple namespaces: useTranslation(['ns1','ns2']) or single 'ns'
          const inferredNs = new Set();
          const singleNs = content.match(/useTranslation\s*\(\s*['"`]([^'"`]+)['"`]/);
          if (singleNs && singleNs[1]) inferredNs.add(singleNs[1]);
          const arrayNsMatch = content.match(/useTranslation\s*\(\s*\[([^\]]+)\]\s*\)/);
          if (arrayNsMatch && arrayNsMatch[1]) {
            const reStr = /['"]([^'"]+)['"]/g;
            let m;
            while ((m = reStr.exec(arrayNsMatch[1])) !== null) {
              inferredNs.add(m[1]);
            }
          }
          const patterns = [/t\s*\(\s*['"`]([\w\.\-:]+)['"`]\s*\)/g];
          const usages = new Set();
          for (const pattern of patterns) {
            let match;
            while ((match = pattern.exec(content)) !== null) {
              const rawKey = match[1];
              if (!rawKey) continue;
              if (!/[A-Za-z0-9\u4e00-\u9fff]/.test(rawKey)) continue;
              if (rawKey.includes(':')) {
                usages.add(rawKey);
              } else if (inferredNs.size > 0) {
                for (const ns of inferredNs) {
                  if (ns && ns !== 'translation') usages.add(`${ns}:${rawKey}`);
                }
                // also include rawKey to reflect defaultNS usage
                usages.add(rawKey);
              } else {
                usages.add(rawKey);
              }
            }
          }
          if (usages.size > 0) labelUsages.set(relFile, usages);
        }
      }
    } catch {
      // ignore
    }
  }
  for (const d of scanDirs) {
    if (existsSync(d) && statSync(d).isDirectory()) {
      scanDirectory(d);
    }
  }
  return labelUsages;
}

function groupByNamespace(keys) {
  const groups = new Map(); // ns -> Set(keys)
  for (const k of keys) {
    let ns = 'translation';
    let keyBody = String(k);
    if (keyBody.includes(':')) {
      ns = keyBody.split(':')[0];
      keyBody = keyBody.split(':').slice(1).join(':');
    } else if (!SINGLE_NAMESPACE_MODE && keyBody.includes('.')) {
      // 仅在非单命名空间模式下，才用点号首段作为“命名空间”展示
      ns = keyBody.split('.')[0];
    }
    if (!groups.has(ns)) groups.set(ns, new Set());
    groups.get(ns).add(k);
  }
  return groups;
}

// 主函数
function main() {
  console.log('🌐 检查多语言内容和调用的一致性（页面级分组）...\n');
  if (!statSync(localesRoot).isDirectory() || !existsSync(localesIndexPath)) {
    console.error('❌ src/locales/index.ts 未找到:', localesIndexPath);
    process.exit(1);
  }

  let inconsistencies = 0;

  // 1. 解析 localeResources 并构建 en/zh 键集合
  console.log('📋 1. 构建 en/zh 键集合（来自 src/locales/index.ts）...');
  const indexContent = readFileSync(localesIndexPath, 'utf-8');
  const indexSf = ts.createSourceFile(localesIndexPath, indexContent, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const importMap = resolveImportMap(indexSf, dirname(localesIndexPath));
  let resourcesObj;
  indexSf.forEachChild(node => {
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
    console.error('❌ 未找到 localeResources');
    process.exit(1);
  }
  const langReports = [];
  let onlyTranslationNamespace = true;
  for (const langProp of resourcesObj.properties) {
    if (!ts.isPropertyAssignment(langProp)) continue;
    const built = buildLangKeys(indexSf, importMap, langProp);
    langReports.push(built);
    // 检测是否存在除 "translation" 之外的命名空间
    const init = langProp.initializer ? unwrapExpression(langProp.initializer) : undefined;
    if (init && ts.isObjectLiteralExpression(init)) {
      for (const p of init.properties) {
        if (ts.isPropertyAssignment(p)) {
          const n = getPropertyNameText(p.name);
          if (n && n !== 'translation') {
            onlyTranslationNamespace = false;
          }
        }
      }
    }
  }
  SINGLE_NAMESPACE_MODE = onlyTranslationNamespace;
  const enReport = langReports.find(r => r.lang === 'en');
  const zhReport = langReports.find(r => r.lang === 'zh');
  if (!enReport || !zhReport) {
    console.error('❌ 缺少 en 或 zh 的资源定义');
    process.exit(1);
  }
  console.log(`   EN 键数: ${enReport.keys.size}`);
  console.log(`   ZH 键数: ${zhReport.keys.size}\n`);

  // 2. 比较 en/zh 键集合，按命名空间分组报告
  console.log('📑 2. 比较 en/zh 键集合（按页面命名空间分组）...');
  const enOnly = [...enReport.keys].filter(k => !zhReport.keys.has(k));
  const zhOnly = [...zhReport.keys].filter(k => !enReport.keys.has(k));
  if (enOnly.length === 0 && zhOnly.length === 0) {
    console.log('   ✅ en 与 zh 键集合一致\n');
  } else {
    inconsistencies++;
    if (enOnly.length) {
      console.log(`   ⚠️ ZH 缺失的键（${enOnly.length}）分组：`);
      const groups = groupByNamespace(enOnly);
      for (const [ns, set] of groups.entries()) {
        console.log(`     - ${ns}: ${set.size}`);
        const preview = [...set].slice(0, 10);
        preview.forEach(k => console.log(`       · ${k}`));
        if (set.size > 10) console.log(`       ... 其余 ${set.size - 10} 省略`);
      }
    }
    if (zhOnly.length) {
      console.log(`   ⚠️ EN 缺失的键（${zhOnly.length}）分组：`);
      const groups = groupByNamespace(zhOnly);
      for (const [ns, set] of groups.entries()) {
        console.log(`     - ${ns}: ${set.size}`);
        const preview = [...set].slice(0, 10);
        preview.forEach(k => console.log(`       · ${k}`));
        if (set.size > 10) console.log(`       ... 其余 ${set.size - 10} 省略`);
      }
    }
    console.log('');
  }

  // 2. 检查 hooks/组件中的硬编码文本
  console.log('🔍 2. 检查 hooks/组件中的硬编码文本...');
  const hookIssues = checkHooksUsage();
  
  if (hookIssues.length === 0) {
    console.log('   ✅ 未发现明显的硬编码中文文本\n');
  } else {
    console.log(`   ⚠️  发现 ${hookIssues.length} 个可能的问题文件：\n`);
    hookIssues.slice(0, 10).forEach(issue => {
      console.log(`   📄 ${issue.file} (${issue.chineseCount} 处中文文本)`);
    });
    if (hookIssues.length > 10) {
      console.log(`   ... 还有 ${hookIssues.length - 10} 个文件\n`);
    } else {
      console.log('');
    }
  }
  // 3. 检查 hooks 中 t('...') 使用的键在 en/zh 中是否都存在（按命名空间分组）
  console.log('🧭 3. 检查 hooks 中 t(...) 使用的键（按命名空间分组）...');
  const usages = findHookLabelUsages();
  let usageMissingCount = 0;
  for (const [file, keys] of usages.entries()) {
    // 将同一“键体”（去掉命名空间）合并，避免 ns:key 与 rawKey 同时出现导致的误报
    const families = new Map(); // body -> Set(candidate forms)
    for (const k of keys) {
      const s = String(k);
      // 取冒号后的部分作为键体；若无冒号，则整个字符串作为键体
      const body = s.includes(':') ? s.split(':').slice(1).join(':') : s;
      if (!families.has(body)) families.set(body, new Set());
      families.get(body).add(s);
      // 同时加入点号规范化形态，便于匹配
      if (s.includes(':')) families.get(body).add(s.replace(':', '.'));
    }
    const missingEn = [];
    const missingZh = [];
    for (const [body, forms] of families.entries()) {
      // 针对每种语言，只要任一 candidate 存在，即视为不缺失
      let hasEnAny = false;
      let hasZhAny = false;
      const tryCandidates = new Set(forms);
      // 为每个 candidate 追加同义命名空间形态
      for (const f of [...forms]) {
        const parts = f.includes(':') ? f.split(':') : f.split('.');
        const hasNs = parts.length > 1;
        const ns = hasNs ? parts[0] : undefined;
        const rest = hasNs ? parts.slice(1).join('.') : parts[0];
        if (ns && NS_SYNONYMS.has(ns)) {
          const altNs = NS_SYNONYMS.get(ns);
          tryCandidates.add(`${altNs}:${rest}`);
          tryCandidates.add(`${altNs}.${rest}`);
        }
        // 默认命名空间兼容：当组件未显式传入 useTranslation('translation') 时，
        // 同时尝试附加 'translation' 作为命名空间前缀
        if (!f.includes(':')) {
          tryCandidates.add(`translation:${f}`);
          tryCandidates.add(`translation.${f}`);
        }
      }
      // 追加“无命名空间”的键体与其同义形态
      const bodyParts = body.split('.');
      const bodyNs = bodyParts[0];
      const bodyRest = bodyParts.slice(1).join('.');
      if (NS_SYNONYMS.has(bodyNs) && bodyRest) {
        const altNs = NS_SYNONYMS.get(bodyNs);
        tryCandidates.add(`${altNs}:${bodyRest}`);
        tryCandidates.add(`${altNs}.${bodyRest}`);
      }
      for (const f of tryCandidates) {
        const fDot = f.includes(':') ? f.replace(':', '.') : f;
        // 同时构造默认命名空间形态，最大化匹配稳定性
        const fWithDefaultNsDot = f.includes(':') ? f : `translation.${f}`;
        const fWithDefaultNsColon = f.includes(':') ? f : `translation:${f}`;
        if (
          enReport.keys.has(f) ||
          enReport.keys.has(fDot) ||
          enReport.keys.has(fWithDefaultNsDot) ||
          enReport.keys.has(fWithDefaultNsColon) ||
          enReport.keys.has(body) ||
          enReport.keys.has(body.replace(':', '.'))
        ) {
          hasEnAny = true;
        }
        if (
          zhReport.keys.has(f) ||
          zhReport.keys.has(fDot) ||
          zhReport.keys.has(fWithDefaultNsDot) ||
          zhReport.keys.has(fWithDefaultNsColon) ||
          zhReport.keys.has(body) ||
          zhReport.keys.has(body.replace(':', '.'))
        ) {
          hasZhAny = true;
        }
        if (hasEnAny && hasZhAny) break;
      }
      if (!hasEnAny) missingEn.push(body);
      if (!hasZhAny) missingZh.push(body);
    }
    if (missingEn.length || missingZh.length) {
      usageMissingCount += missingEn.length + missingZh.length;
      console.log(`   📄 ${file}`);
      if (missingEn.length) {
        console.log(`     ❌ [EN 缺失] (${missingEn.length}) 分组：`);
        const groups = groupByNamespace(missingEn);
        for (const [ns, set] of groups.entries()) {
          console.log(`       - ${ns}: ${set.size}`);
          [...set].slice(0, 8).forEach(k => console.log(`         · ${k}`));
          if (set.size > 8) console.log(`         ...`);
        }
      }
      if (missingZh.length) {
        console.log(`     ❌ [ZH 缺失] (${missingZh.length}) 分组：`);
        const groups = groupByNamespace(missingZh);
        for (const [ns, set] of groups.entries()) {
          console.log(`       - ${ns}: ${set.size}`);
          [...set].slice(0, 8).forEach(k => console.log(`         · ${k}`));
          if (set.size > 8) console.log(`         ...`);
        }
      }
    }
  }
  if (usageMissingCount === 0) {
    console.log('   ✅ hooks 中 t(...) 使用的键在 en/zh 中均可用\n');
  } else {
    console.log('   ℹ️ 上述为使用键的对照信息，仅供参考，不计入 en/zh 一致性结果\n');
    console.log('');
  }
  console.log('');
  
  const hasIssues = inconsistencies > 0 || hookIssues.length > 0;
  
  if (!hasIssues) {
    console.log('✅ 多语言系统检查通过！');
    process.exit(0);
  }
  console.log('⚠️  发现一些不一致，请检查上述问题。');
  process.exit(1);
}

main();
