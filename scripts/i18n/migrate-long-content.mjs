#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import vm from 'vm';

const ROOT = path.resolve(process.cwd());
const DRY_RUN = process.argv.includes('--dry-run');
const CHECK = process.argv.includes('--check');
const LANGS = ['en', 'zh'];
const ONLY_ARG = (() => {
  const idx = process.argv.findIndex(a => a === '--only');
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1];
  return null;
})();
const LANG_ARG = (() => {
  const idx = process.argv.findIndex(a => a === '--lang');
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1];
  return null;
})();

const FILES = {
  glossary: (lang) => path.join(ROOT, 'src', 'locales', lang, 'labels', 'pages', 'glossary.ts'),
  technology: (lang) => path.join(ROOT, 'src', 'locales', lang, 'labels', 'pages', 'technology.ts'),
};

const OUT = {
  glossary: (lang) => path.join(ROOT, 'src', 'data', 'snapshots', lang, 'pages', 'glossary.json'),
  technology: (lang) => path.join(ROOT, 'src', 'data', 'snapshots', lang, 'pages', 'technology.json'),
};

function readFileSafe(p) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch {
    return '';
  }
}

function ensureDir(p) {
  const dir = path.dirname(p);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function evaluateExportedObject(source, exportName, filename) {
  if (!source) return undefined;
  const replaced = source.replace(
    new RegExp(`export\\s+const\\s+${exportName}\\s*=\\s*`),
    `var ${exportName} = `
  ) + `\n;globalThis.__exported = ${exportName};`;

  const context = vm.createContext({ globalThis: {}, console: { log() {} } });
  try {
    const script = new vm.Script(replaced, { filename, timeout: 1500 });
    script.runInContext(context, { timeout: 1500 });
    return context.globalThis.__exported;
  } catch (e) {
    console.error(`[migrate] Failed to evaluate ${filename}: ${e.message}`);
    return undefined;
  }
}

function readJsonSafe(p, fallback = {}) {
  try {
    if (!fs.existsSync(p)) return fallback;
    const txt = fs.readFileSync(p, 'utf8');
    return JSON.parse(txt);
  } catch {
    return fallback;
  }
}

function writeJson(p, data) {
  ensureDir(p);
  const txt = JSON.stringify(data, null, 2);
  if (DRY_RUN) {
    console.log(`[dry-run] write ${p}\n${txt.slice(0, 300)}${txt.length > 300 ? '…' : ''}`);
  } else {
    fs.writeFileSync(p, txt, 'utf8');
    console.log(`[migrate] wrote ${p}`);
  }
}

function dedupByKey(arr, key = 'term') {
  const seen = new Set();
  const out = [];
  for (const item of arr) {
    const k = (item?.[key] ?? '').toString().trim().toLowerCase();
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(item);
  }
  return out;
}

function migrateGlossary(lang) {
  const srcPath = FILES.glossary(lang);
  const src = readFileSafe(srcPath);
  if (!src) {
    console.warn(`[migrate] glossary source missing for ${lang}: ${srcPath}`);
    return;
  }
  const obj = evaluateExportedObject(src, 'glossary', `glossary.${lang}.ts`);
  if (!obj?.categories) {
    console.warn(`[migrate] glossary categories not found for ${lang}`);
    return;
  }

  const result = { categories: {} };
  for (const [catKey, catVal] of Object.entries(obj.categories)) {
    const terms = [];
    const termDict = catVal?.terms || {};
    for (const [_, t] of Object.entries(termDict)) {
      const item = {
        term: t.term,
        english: t.english,
        definition: t.definition,
        tags: t.tags || [],
        aliases: t.aliases || [],
        why: t.why,
        choose: t.choose,
        mistakes: t.mistakes,
      };
      if (item.definition && typeof item.definition === 'string' && item.definition.length >= 10) {
        terms.push(item);
      }
    }
    if (terms.length) result.categories[catKey] = terms;
  }

  const outPath = OUT.glossary(lang);
  const existing = readJsonSafe(outPath, { categories: {} });
  const merged = { categories: {} };

  const allCats = new Set([
    ...Object.keys(existing.categories || {}),
    ...Object.keys(result.categories || {}),
  ]);
  for (const key of allCats) {
    const a = Array.isArray(existing.categories?.[key]) ? existing.categories[key] : [];
    const b = Array.isArray(result.categories?.[key]) ? result.categories[key] : [];
    merged.categories[key] = dedupByKey([...a, ...b], 'term');
  }

  if (CHECK) {
    const existingStr = JSON.stringify(existing);
    const newStr = JSON.stringify(merged);
    if (existingStr !== newStr) {
      console.error(`[migrate][check] ${outPath} is outdated and would be updated.`);
      process.exitCode = 1;
    } else {
      console.log(`[migrate][check] ${outPath} is up-to-date.`);
    }
    return;
  }
  writeJson(outPath, merged);
}

function migrateTechnology(lang) {
  const srcPath = FILES.technology(lang);
  const src = readFileSafe(srcPath);
  if (!src) {
    console.warn(`[migrate] technology source missing for ${lang}: ${srcPath}`);
    return;
  }
  const obj = evaluateExportedObject(src, 'technology', `technology.${lang}.ts`);
  if (!obj) {
    console.warn(`[migrate] technology object not found for ${lang}`);
    return;
  }

  const partial = {
    hub: {
      title: obj?.hub?.title,
      description: obj?.hub?.description,
    },
    detail: {
      takeaways: Array.isArray(obj?.detail?.takeaways) ? obj.detail.takeaways : undefined,
    },
  };

  const outPath = OUT.technology(lang);
  const existing = readJsonSafe(outPath, {});

  const merged = {
    hub: {
      ...((existing && existing.hub) || {}),
      ...(partial.hub || {}),
    },
    detail: {
      ...((existing && existing.detail) || {}),
      ...(partial.detail || {}),
    },
  };

  if (merged.hub && merged.hub.title === undefined) delete merged.hub.title;
  if (merged.hub && merged.hub.description === undefined) delete merged.hub.description;
  if (merged.detail && merged.detail.takeaways === undefined) delete merged.detail.takeaways;

  if (CHECK) {
    const existingStr = JSON.stringify(existing);
    const newStr = JSON.stringify(merged);
    if (existingStr !== newStr) {
      console.error(`[migrate][check] ${outPath} is outdated and would be updated.`);
      process.exitCode = 1;
    } else {
      console.log(`[migrate][check] ${outPath} is up-to-date.`);
    }
    return;
  }
  writeJson(outPath, merged);
}

function main() {
  console.log(`[migrate] start${DRY_RUN ? ' (dry-run)' : ''}${CHECK ? ' (check)' : ''}`);
  const targets = ONLY_ARG ? [ONLY_ARG] : ['glossary', 'technology'];
  const langs = LANG_ARG ? [LANG_ARG] : LANGS;
  for (const lang of langs) {
    if (targets.includes('glossary')) migrateGlossary(lang);
    if (targets.includes('technology')) migrateTechnology(lang);
  }
  console.log('[migrate] done');
}

main();

