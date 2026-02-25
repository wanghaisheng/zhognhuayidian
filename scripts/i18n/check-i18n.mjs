/**
 * Input: translation files under `src/locales/<lang>`.
 * Output: Console report of missing, extra, or empty translation keys.
 * Pos: Build-time / Pre-commit Validation Script.
 */

import fs from 'fs';
import path from 'path';
import process from 'node:process';
import ts from 'typescript';

const projectRoot = path.resolve();
const srcRoot = path.resolve(projectRoot, 'src');
const i18nFilePath = path.resolve(srcRoot, 'i18n.ts');

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

function getDefaultExportObjectLiteral(content, fileName) {
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

function resolveImportMap(sf, baseDir) {
  const importMap = new Map();
  sf.forEachChild(node => {
    if (!ts.isImportDeclaration(node)) return;
    if (!ts.isStringLiteral(node.moduleSpecifier)) return;
    const spec = node.moduleSpecifier.text;
    let abs = spec;
    if (spec.startsWith('./') || spec.startsWith('../')) {
      abs = path.resolve(baseDir, spec);
    } else {
      // ignore external modules
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
    // default import
    if (node.importClause?.name) {
      importMap.set(node.importClause.name.text, found);
    }
    // named imports
    const named = node.importClause?.namedBindings;
    if (named && ts.isNamedImports(named)) {
      for (const el of named.elements) {
        importMap.set(el.name.text, found);
      }
    }
  });
  return importMap;
}

function listTsFiles(dirPath) {
  /** @type {string[]} */
  const out = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dirPath, e.name);
    if (e.isDirectory()) out.push(...listTsFiles(full));
    else if (e.isFile() && e.name.endsWith('.ts')) out.push(full);
  }
  return out;
}

function extractLeafKeyValuesFromObject(obj, fileName) {
  /** @type {Map<string, { value?: string }>} */
  const out = new Map();
  if (!obj) return out;
  const visitObj = (o, prefixParts = []) => {
    for (const prop of o.properties) {
      if (!ts.isPropertyAssignment(prop)) continue;
      const name = getPropertyNameText(prop.name);
      if (!name) continue;
      const init = prop.initializer ? unwrapExpression(prop.initializer) : undefined;
      const nextPrefix = [...prefixParts, name];
      if (init && ts.isObjectLiteralExpression(init)) {
        visitObj(init, nextPrefix);
        continue;
      }
      let value;
      if (init && ts.isStringLiteral(init)) value = init.text;
      else if (init && ts.isNoSubstitutionTemplateLiteral(init)) value = init.text;
      out.set(nextPrefix.join('.'), { value });
    }
  };
  visitObj(obj);
  return out;
}

function extractLeafKeyValuesByIdentifier(content, fileName, ident) {
  const sf = ts.createSourceFile(fileName, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  let obj = findInitializerObjectForIdentifier(sf, ident);
  if (!obj) {
    // fallback to default export object
    obj = getDefaultExportObjectLiteral(content, fileName);
  }
  return extractLeafKeyValuesFromObject(obj, fileName);
}

function parseI18nResourceSpec() {
  if (!fs.existsSync(i18nFilePath)) {
    console.error('❌ src/i18n.ts not found at:', i18nFilePath);
    process.exit(1);
  }

  const content = fs.readFileSync(i18nFilePath, 'utf-8');
  const sf = ts.createSourceFile(i18nFilePath, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

  /** @type {Map<string, string>} */
  const importMap = resolveImportMap(sf, path.dirname(i18nFilePath));

  let resourcesInit;
  function findResources(node) {
    if (resourcesInit) return;
    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (ts.isIdentifier(decl.name) && decl.name.text === 'resources') {
          const init = decl.initializer ? unwrapExpression(decl.initializer) : undefined;
          if (init && ts.isObjectLiteralExpression(init)) resourcesInit = init;
          return;
        }
      }
    }
    ts.forEachChild(node, findResources);
  }
  ts.forEachChild(sf, findResources);

  if (!resourcesInit) {
    console.error('❌ Could not locate `const resources = {...}` in src/i18n.ts');
    process.exit(1);
  }

  /** @type {Record<string, { translation: string[], namespaces: Record<string, string> }>} */
  const spec = {};

  for (const langProp of resourcesInit.properties) {
    if (!ts.isPropertyAssignment(langProp)) continue;
    const lang = getPropertyNameText(langProp.name);
    if (!lang) continue;
    const langInit = langProp.initializer ? unwrapExpression(langProp.initializer) : undefined;
    if (!langInit || !ts.isObjectLiteralExpression(langInit)) continue;

    /** @type {string[]} */
    const translationIdents = [];
    /** @type {Record<string, string>} */
    const namespaces = {};

    for (const nsProp of langInit.properties) {
      if (!ts.isPropertyAssignment(nsProp)) continue;
      const nsName = getPropertyNameText(nsProp.name);
      if (!nsName) continue;
      const nsInit = nsProp.initializer ? unwrapExpression(nsProp.initializer) : undefined;
      if (nsName === 'translation') {
        if (nsInit && ts.isObjectLiteralExpression(nsInit)) {
          for (const tProp of nsInit.properties) {
            if (ts.isSpreadAssignment(tProp)) {
              const expr = unwrapExpression(tProp.expression);
              if (expr && ts.isIdentifier(expr)) translationIdents.push(expr.text);
            }
          }
        }
      } else {
        if (nsInit && ts.isIdentifier(nsInit)) namespaces[nsName] = nsInit.text;
      }
    }

    spec[lang] = { translation: translationIdents, namespaces };
  }

  return { spec, importMap };
}

function buildLangIndex(lang, specForLang, importMap) {
  /** @type {Map<string, { value?: string }>} */
  const flat = new Map();
  /** @type {string[]} */
  const emptyKeys = [];

  // defaultNS translation (no namespace prefix)
  for (const ident of specForLang.translation) {
    const filePath = importMap.get(ident);
    if (!filePath || !fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf-8');
    const kv = extractLeafKeyValuesByIdentifier(content, filePath, ident);
    for (const [k, v] of kv.entries()) {
      flat.set(k, v);
      if (typeof v.value === 'string' && v.value.trim() === '') emptyKeys.push(k);
    }
  }

  // other namespaces as ns:keyPath
  for (const [nsName, ident] of Object.entries(specForLang.namespaces)) {
    const filePath = importMap.get(ident);
    if (!filePath || !fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf-8');
    const kv = extractLeafKeyValuesByIdentifier(content, filePath, ident);
    for (const [k, v] of kv.entries()) {
      const fullKey = `${nsName}:${k}`;
      flat.set(fullKey, v);
      if (typeof v.value === 'string' && v.value.trim() === '') emptyKeys.push(fullKey);
    }
  }

  return { flat, emptyKeys };
}

function main() {
  console.log('🔍 Starting i18n Integrity Check (src/locales)...');

  const { spec, importMap } = parseI18nResourceSpec();
  const languages = Object.keys(spec).sort();
  console.log(`🌐 Detected languages: ${languages.join(', ')}`);

  /** @type {Record<string, { flat: Map<string, {value?: string}>, emptyKeys: string[] }>} */
  const indices = {};
  for (const lang of languages) indices[lang] = buildLangIndex(lang, spec[lang], importMap);

  const allKeys = new Set();
  for (const lang of languages) {
    for (const k of indices[lang].flat.keys()) allKeys.add(k);
  }

  let hasErrors = false;
  for (const lang of languages) {
    const missingKeys = [];
    const keys = new Set(indices[lang].flat.keys());

    for (const k of allKeys) {
      if (!keys.has(k)) missingKeys.push(k);
    }
    const emptyKeys = indices[lang].emptyKeys;
    if (missingKeys.length || emptyKeys.length) {
      hasErrors = true;
      console.log(`\n🚩 Issues found in [${lang.toUpperCase()}]:`);
      if (missingKeys.length) {
        console.log('   Missing Keys:');
        missingKeys.forEach(k => console.log(`   - ${k}`));
      }
      if (emptyKeys.length) {
        console.log('   Empty Values:');
        emptyKeys.forEach(k => console.log(`   - ${k}`));
      }
    }
  }

  if (!hasErrors) {
    console.log('\n✅ i18n Check Passed: All keys are synchronized and populated!');
    process.exit(0);
  }

  console.log('\n❌ i18n Check Failed: Please synchronize your translations.');
  process.exit(1);
}

main();
