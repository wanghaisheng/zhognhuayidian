#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import vm from 'vm';

const ROOT = path.resolve(process.cwd());
const LANG = (() => {
  const idx = process.argv.findIndex(a => a === '--lang');
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1];
  return null;
})();
const THRESH = (() => {
  const idx = process.argv.findIndex(a => a === '--threshold');
  if (idx >= 0 && process.argv[idx + 1]) return parseInt(process.argv[idx + 1], 10) || 120;
  return 120;
})();
const OUT = (() => {
  const idx = process.argv.findIndex(a => a === '--out');
  if (idx >= 0 && process.argv[idx + 1]) return path.resolve(process.argv[idx + 1]);
  return null;
})();

function lsPages(lang) {
  const dir = path.join(ROOT, 'src', 'locales', lang, 'labels', 'pages');
  try {
    return fs.readdirSync(dir).filter(f => f.endsWith('.ts')).map(f => path.join(dir, f));
  } catch {
    return [];
  }
}

function evalAllExports(source, filename) {
  if (!source) return {};
  const replaced = source.replace(/export\s+const\s+([A-Za-z0-9_]+)\s*=\s*/g, (_, name) => {
    return `globalThis.__exports = (globalThis.__exports||{}); globalThis.__exports['${name}'] = `;
  }) + `\n;`;
  const context = vm.createContext({ globalThis: {}, console: { log(){} } });
  try {
    const script = new vm.Script(replaced, { filename, timeout: 1500 });
    script.runInContext(context, { timeout: 1500 });
    return context.globalThis.__exports || {};
  } catch {
    return {};
  }
}

function walk(obj, pred, pathKeys = []) {
  const hits = [];
  if (typeof obj === 'string') {
    if (pred(obj)) hits.push({ path: pathKeys.join('.'), length: obj.length, sample: obj.slice(0, 80) });
  } else if (Array.isArray(obj)) {
    obj.forEach((v, i) => {
      hits.push(...walk(v, pred, pathKeys.concat(`[${i}]`)));
    });
  } else if (obj && typeof obj === 'object') {
    Object.entries(obj).forEach(([k, v]) => {
      hits.push(...walk(v, pred, pathKeys.concat(k)));
    });
  }
  return hits;
}

function scanFile(file) {
  const src = fs.readFileSync(file, 'utf8');
  const exports = evalAllExports(src, path.basename(file));
  const fileHits = [];
  Object.entries(exports).forEach(([name, obj]) => {
    const hits = walk(obj, (s) => typeof s === 'string' && s.trim().length >= THRESH);
    if (hits.length) fileHits.push({ export: name, hits });
  });
  return { file, results: fileHits };
}

function ensureDir(p) {
  const dir = path.dirname(p);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function main() {
  const langs = LANG ? [LANG] : ['en', 'zh'];
  const all = [];
  langs.forEach((l) => {
    const files = lsPages(l);
    files.forEach((f) => {
      const r = scanFile(f);
      if (r.results.length) all.push({ lang: l, ...r });
    });
  });
  const output = { threshold: THRESH, items: all };
  const text = JSON.stringify(output, null, 2);
  console.log(text);
  if (OUT) {
    ensureDir(OUT);
    fs.writeFileSync(OUT, text, 'utf8');
  }
}

main();
