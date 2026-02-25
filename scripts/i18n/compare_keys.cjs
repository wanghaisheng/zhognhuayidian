const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const projectRoot = path.resolve(__dirname, '..', '..');
const localesRoot = path.resolve(projectRoot, 'src', 'locales');
const enRoot = path.resolve(localesRoot, 'en', 'labels');
const zhRoot = path.resolve(localesRoot, 'zh', 'labels');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

function extractKeys(content) {
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

  function getExportedObjectLiterals(sf) {
    /** @type {ts.ObjectLiteralExpression[]} */
    const objects = [];
    // export default ...
    sf.forEachChild(node => {
      if (ts.isExportAssignment(node)) {
        const unwrapped = unwrapExpression(node.expression);
        if (unwrapped && ts.isObjectLiteralExpression(unwrapped)) objects.push(unwrapped);
        else if (unwrapped && ts.isIdentifier(unwrapped)) {
          const obj = findInitializerObjectForIdentifier(sf, unwrapped.text);
          if (obj) objects.push(obj);
        }
      }
    });
    // export const foo = { ... }
    sf.forEachChild(node => {
      if (!ts.isVariableStatement(node)) return;
      const isExported = node.modifiers && node.modifiers.some(m => m.kind === ts.SyntaxKind.ExportKeyword);
      if (!isExported) return;
      for (const decl of node.declarationList.declarations) {
        const init = decl.initializer ? unwrapExpression(decl.initializer) : undefined;
        if (!init) continue;
        if (ts.isObjectLiteralExpression(init)) {
          objects.push(init);
        } else if (ts.isIdentifier(init)) {
          const obj = findInitializerObjectForIdentifier(sf, init.text);
          if (obj) objects.push(obj);
        }
      }
    });
    return objects;
  }

  const sf = ts.createSourceFile('x.ts', content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const keys = new Set();
  const exportedObjects = getExportedObjectLiterals(sf);
  if (exportedObjects.length === 0) return keys;
  const visitObj = (o, prefix = []) => {
    for (const prop of o.properties) {
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
      }
    }
  };
  for (const obj of exportedObjects) visitObj(obj);
  return keys;
}

let hasDiscrepancies = false;
console.log('Starting comparison for label files: src/locales/en/labels vs src/locales/zh/labels...\n');

if (!fs.existsSync(enRoot) || !fs.existsSync(zhRoot)) {
  console.error('Missing locale roots. Expected:', enRoot, 'and', zhRoot);
  process.exit(1);
}

const enFiles = getAllFiles(enRoot).filter(f => f.endsWith('.ts'));
for (const enFile of enFiles) {
  const relativePath = path.relative(enRoot, enFile);
  if (relativePath === 'home.ts') continue;
  const zhFile = path.join(zhRoot, relativePath);

  if (!fs.existsSync(zhFile)) {
    console.log(`[MISSING FILE] ${relativePath} exists in EN but not in ZH`);
    hasDiscrepancies = true;
    continue;
  }

  const enContent = fs.readFileSync(enFile, 'utf8');
  const zhContent = fs.readFileSync(zhFile, 'utf8');

  const enKeys = extractKeys(enContent);
  const zhKeys = extractKeys(zhContent);

  const missingInZh = [...enKeys].filter(x => !zhKeys.has(x));
  const extraInZh = [...zhKeys].filter(x => !enKeys.has(x));

  if (missingInZh.length || extraInZh.length) {
    hasDiscrepancies = true;
    console.log(`[DISCREPANCY] ${relativePath}`);
    if (missingInZh.length) console.log(`  Missing in ZH (${missingInZh.length}): ${missingInZh.join(', ')}`);
    if (extraInZh.length) console.log(`  Extra in ZH (${extraInZh.length}): ${extraInZh.join(', ')}`);
    console.log('');
  }
}

// Also check for files present in ZH but not in EN
const zhFiles = getAllFiles(zhRoot).filter(f => f.endsWith('.ts'));
for (const zhFile of zhFiles) {
  const relativePath = path.relative(zhRoot, zhFile);
  if (relativePath === 'home.ts') continue;
  const enFile = path.join(enRoot, relativePath);
  if (!fs.existsSync(enFile)) {
    console.log(`[MISSING FILE] ${relativePath} exists in ZH but not in EN`);
    hasDiscrepancies = true;
  }
}

if (!hasDiscrepancies) {
  console.log('No discrepancies found. All keys match across EN/ZH!');
} else {
  console.log('Comparison complete.');
  process.exit(1);
}
