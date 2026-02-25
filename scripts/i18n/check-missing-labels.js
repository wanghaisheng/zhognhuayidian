#!/usr/bin/env node

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..', '..');

const srcRoot = join(projectRoot, 'src');
const localesRoot = join(srcRoot, 'locales');
const localesIndexPath = join(localesRoot, 'index.ts');

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

function hasExportModifier(node) {
  return Array.isArray(node.modifiers) && node.modifiers.some(m => m.kind === ts.SyntaxKind.ExportKeyword);
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

function getDefaultExportObjectLiteralFromSourceFile(sf) {
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

function extractLeafKeyPathsFromObject(o, prefixArr = []) {
  const keys = new Set();
  const visitObj = (obj, prefix = []) => {
    for (const prop of obj.properties) {
      if (ts.isPropertyAssignment(prop)) {
        const name = getPropertyNameText(prop.name);
        if (!name) continue;
        const init = prop.initializer ? unwrapExpression(prop.initializer) : undefined;
        if (init && ts.isObjectLiteralExpression(init)) {
          visitObj(init, [...prefix, name]);
        } else {
          keys.add([...prefix, name].join('.'));
        }
      } else if (ts.isShorthandPropertyAssignment(prop)) {
        keys.add([...prefix, prop.name.text].join('.'));
      } else if (ts.isMethodDeclaration(prop) || ts.isGetAccessorDeclaration(prop) || ts.isSetAccessorDeclaration(prop)) {
        const name = getPropertyNameText(prop.name);
        if (!name) continue;
        keys.add([...prefix, name].join('.'));
      }
    }
  };
  visitObj(o, prefixArr);
  return keys;
}

function extractLeafKeyPaths(content, fileName = 'x.ts') {
  const sf = ts.createSourceFile(fileName, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const importMap = resolveImportMap(sf, dirname(fileName));
  const keys = new Set();
  const defaultObj = getDefaultExportObjectLiteralFromSourceFile(sf);
  if (defaultObj) {
    for (const k of extractLeafKeyPathsFromObject(defaultObj)) keys.add(k);
  }
  sf.forEachChild(node => {
    if (ts.isVariableStatement(node) && hasExportModifier(node)) {
      for (const decl of node.declarationList.declarations) {
        if (ts.isIdentifier(decl.name)) {
          const init = decl.initializer ? unwrapExpression(decl.initializer) : undefined;
          if (init && ts.isObjectLiteralExpression(init)) {
            const prefix = [decl.name.text];
            for (const k of extractLeafKeyPathsFromObject(init, prefix)) keys.add(k);
          } else if (init && ts.isIdentifier(init)) {
            // Handle alias like: export const resourceCenter = resources;
            const target = importMap.get(init.text);
            if (target) {
              try {
                const tContent = readFileSync(target, 'utf-8');
                const tSf = ts.createSourceFile(target, tContent, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
                const aliasedObj = findInitializerObjectForIdentifier(tSf, init.text);
                if (aliasedObj && ts.isObjectLiteralExpression(aliasedObj)) {
                  const aliasedKeys = extractLeafKeyPathsFromObject(aliasedObj, [decl.name.text]);
                  for (const k of aliasedKeys) keys.add(k);
                }
              } catch {}
            }
          }
        }
      }
    }
  });
  return keys;
}

function listLanguages() {
  const langs = [];
  try {
    const entries = readdirSync(localesRoot, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) langs.push(entry.name);
    }
  } catch {}
  // 仅检查 EN 与 ZH 的一致性
  return langs.filter(l => l === 'en' || l === 'zh').sort();
}

function collectLabelLeafKeysForLanguage(lang) {
  const baseDir = join(localesRoot, lang, 'labels');
  const keys = new Set();
  function walk(dir) {
    try {
      const entries = readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(full);
        } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
          try {
            const content = readFileSync(full, 'utf-8');
            const leaf = extractLeafKeyPaths(content, full);
            for (const k of leaf) keys.add(k);
          } catch {}
        }
      }
    } catch {}
  }
  walk(baseDir);
  return keys;
}

// 扫描源代码文件，找出所有 t('xxx') 的使用
function findLabelUsages() {
  const scanRoots = [
    join(projectRoot, 'src', 'pages'),
    join(projectRoot, 'src', 'hooks'),
    join(projectRoot, 'src', 'components')
  ];
  const labelUsages = new Map();
  
  function scanDirectory(dir) {
    try {
      const entries = readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        
        // 跳过 node_modules, dist, 等目录
        if (entry.isDirectory()) {
          const skipDirs = ['node_modules', 'dist', '.git', 'coverage', '.next', 'locales', 'scripts', 'public'];
          if (!skipDirs.includes(entry.name)) {
            scanDirectory(fullPath);
          }
        } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
          const content = readFileSync(fullPath, 'utf-8');

          const relFile = relative(projectRoot, fullPath).replace(/\\/g, '/');
          if (relFile === 'src/components/system/Analytics.tsx') continue;
          if (content.includes('[DEPRECATED]')) continue;

          // Infer per-file namespace: useTranslation('about') => about
          // If not present, assume defaultNS (translation)
          let inferredNs;
          const nsMatch = content.match(/useTranslation\s*\(\s*['"`]([^'"`]+)['"`]/);
          if (nsMatch && nsMatch[1]) inferredNs = nsMatch[1];
          if (!inferredNs) {
            const nsArrayMatch = content.match(/useTranslation\s*\(\s*\[\s*['"`]([^'"`]+)['"`]/);
            if (nsArrayMatch && nsArrayMatch[1]) inferredNs = nsArrayMatch[1];
          }
          
          const patterns = [
            // 支持 t('x') 与 t('x', {...}) 形式，提取首个参数作为 key
            /t\s*\(\s*['"`]([\w\.\-:]+)['"`]/g
          ];
          
          const usages = new Set();
          const hardcoded = new Set();
          for (const pattern of patterns) {
            let match;
            while ((match = pattern.exec(content)) !== null) {
              const rawKey = match[1];
              if (!rawKey) continue;
              if (!/[A-Za-z0-9\u4e00-\u9fff]/.test(rawKey)) continue;
              let normalized = rawKey.includes(':') ? String(rawKey).replace(':', '.') : rawKey;
              if (!normalized.includes('.') && inferredNs && inferredNs !== 'translation') {
                normalized = `${inferredNs}.${normalized}`;
              }
              usages.add(normalized);
            }
          }
          const jsxTextPattern = />[^<>{}]+</g;
          let m;
          while ((m = jsxTextPattern.exec(content)) !== null) {
            const raw = m[0].slice(1, -1).trim();
            if (!raw) continue;
            if (/^(?:\s|[0-9\.\-_,;:]+)$/.test(raw)) continue;
            if (/https?:\/\//i.test(raw)) continue;
            if (/{{.*}}/.test(raw)) continue;
            if (raw.length < 3) continue;
            if (/[A-Za-z\u4e00-\u9fff]/.test(raw)) {
              hardcoded.add(raw);
            }
          }
          const propTextPattern = /\b(title|label|placeholder|aria-label|alt|children|text|subtitle|desc|description)\s*=\s*['"`]([^'"`]{3,})['"`]/g;
          while ((m = propTextPattern.exec(content)) !== null) {
            const raw = m[2].trim();
            if (!raw) continue;
            if (/https?:\/\//i.test(raw)) continue;
            if (/[A-Za-z\u4e00-\u9fff]/.test(raw)) {
              hardcoded.add(raw);
            }
          }
          
          if (usages.size > 0) {
            labelUsages.set(relative(projectRoot, fullPath), { keys: usages, hardcoded });
          } else if (hardcoded.size > 0) {
            labelUsages.set(relative(projectRoot, fullPath), { keys: new Set(), hardcoded });
          }
        }
      }
    } catch (err) {
    }
  }
  
  for (const root of scanRoots) {
    scanDirectory(root);
  }
  return labelUsages;
}

// 主函数
function main() {
  console.log('🔍 以 EN 为基准检查多语言 key 完备性...\n');
  
  console.log('📖 构建各语言 labels 可用键...');
  const langs = listLanguages();
  if (!langs.includes('en')) {
    console.error('❌ 未找到 EN 目录：src/locales/en');
    process.exit(1);
  }

  /** @type {Record<string, Set<string>>} */
  const availableByLang = {};
  for (const lang of langs) {
    availableByLang[lang] = collectLabelLeafKeysForLanguage(lang);
    console.log(`   ${lang.toUpperCase()}: ${availableByLang[lang].size} 个键`);
  }
  console.log('');
  
  // 找出所有使用
  console.log('🔎 扫描源代码文件...');
  const usages = findLabelUsages();
  console.log(`   扫描了 ${usages.size} 个文件\n`);
  
  const enKeys = availableByLang['en'];
  const missingProperties = new Map(); // file -> Map<lang, Set<string>>
  let totalMissing = 0;
  const upperLangs = langs.map(l => l.toUpperCase());

  for (const [file, usage] of usages.entries()) {
    const missingByLang = new Map();
    for (const ul of upperLangs) missingByLang.set(ul, new Set());
    for (const prop of usage.keys) {
      // 不再跳过未在 EN 基准中出现的使用键
      // 对于所有使用到的键，逐语言检查其是否存在，若不存在则报告
      for (const lang of langs) {
        const avail = availableByLang[lang];
        if (avail.has(prop)) continue;
        missingByLang.get(lang.toUpperCase()).add(prop);
        totalMissing++;
      }
    }
    const hasAnyMissing = [...missingByLang.values()].some(s => s.size > 0);
    if (hasAnyMissing) missingProperties.set(file, missingByLang);
  }
  
  // 输出结果
  if (missingProperties.size === 0) {
    console.log('✅ 没有发现缺失的属性！所有使用的 EN 基准属性在各语言中均已完备。\n');
    // 仍输出潜在硬编码，便于清理
    let hardCount = 0;
    for (const [file, usage] of usages.entries()) {
      const hard = Array.from(usage.hardcoded || []);
      if (hard.length) {
        hardCount += hard.length;
        console.log(`📄 ${file}`);
        console.log('   🔎 潜在硬编码:');
        for (const h of hard) console.log(`     • ${h}`);
        console.log('');
      }
    }
    process.exit(0);
  } else {
    console.log(`❌ 发现 ${totalMissing} 个缺失的属性，分布在 ${missingProperties.size} 个文件中：\n`);
    
    // 按文件分组显示
    for (const [file, missingByLang] of missingProperties.entries()) {
      console.log(`📄 ${file}`);
      for (const [lang, props] of missingByLang.entries()) {
        if (props.size === 0) continue;
        for (const prop of Array.from(props).sort()) {
          console.log(`   ❌ [${lang}] ${prop}`);
        }
      }
      console.log('');
    }
    
    // 同时输出潜在硬编码，避免在失败时丢失这部分线索
    let hardCount = 0;
    for (const [file, usage] of usages.entries()) {
      const hard = Array.from(usage.hardcoded || []);
      if (hard.length) {
        hardCount += hard.length;
        console.log(`📄 ${file}`);
        console.log('   🔎 潜在硬编码:');
        for (const h of hard) console.log(`     • ${h}`);
        console.log('');
      }
    }
    
    // 汇总所有缺失的属性
    const allMissing = new Set();
    for (const missingByLang of missingProperties.values()) {
      for (const props of missingByLang.values()) {
        for (const prop of props) allMissing.add(prop);
      }
    }
    
    console.log(`\n📊 汇总：共 ${allMissing.size} 个不同的缺失属性：`);
    console.log(Array.from(allMissing).sort().join(', '));
    console.log('');
    
    process.exit(1);
  }
}

main();
