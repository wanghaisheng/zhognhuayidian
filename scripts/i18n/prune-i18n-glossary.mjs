#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(process.cwd());
const LANGS = (() => {
  const idx = process.argv.findIndex(a => a === '--lang');
  if (idx >= 0 && process.argv[idx + 1]) return [process.argv[idx + 1]];
  return ['en', 'zh'];
})();
const DRY = process.argv.includes('--dry-run');

function readJSON(p, fallback = {}) {
  try {
    const txt = fs.readFileSync(p, 'utf8');
    return JSON.parse(txt);
  } catch {
    return fallback;
  }
}

function pruneTermsForLang(lang) {
  const i18nPath = path.join(ROOT, 'src', 'locales', lang, 'labels', 'pages', 'glossary.ts');
  if (!fs.existsSync(i18nPath)) {
    console.warn(`[prune] missing ${i18nPath}`);
    return;
  }
  const snapPath = path.join(ROOT, 'src', 'data', 'snapshots', lang, 'pages', 'glossary.json');
  const snapshot = readJSON(snapPath, { categories: {} });
  const catKeys = Object.keys(snapshot.categories || {});
  if (!catKeys.length) {
    console.log(`[prune] no snapshot categories for ${lang}, skip`);
    return;
  }
  let text = fs.readFileSync(i18nPath, 'utf8');

  const categoriesIdx = text.indexOf('categories:');
  if (categoriesIdx < 0) {
    console.warn(`[prune] categories not found in ${i18nPath}`);
    return;
  }

  function replaceTerms(catKey) {
    const keyIdx = text.indexOf(`${catKey}:`, categoriesIdx);
    if (keyIdx < 0) return false;
    const blockStartIdx = text.indexOf('{', keyIdx);
    if (blockStartIdx < 0) return false;
    const termsLabelIdx = text.indexOf('terms', blockStartIdx);
    if (termsLabelIdx < 0) return false;
    const colonIdx = text.indexOf(':', termsLabelIdx);
    if (colonIdx < 0) return false;
    const braceIdx = text.indexOf('{', colonIdx);
    if (braceIdx < 0) return false;
    // find matching closing brace for terms object
    let i = braceIdx;
    let depth = 0;
    for (; i < text.length; i++) {
      const ch = text[i];
      if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) {
          // replace content between braceIdx and i with {}
          const before = text.slice(0, braceIdx);
          const after = text.slice(i + 1);
          text = `${before}{}${after}`;
          return true;
        }
      }
    }
    return false;
  }

  let changed = false;
  for (const k of catKeys) {
    if (replaceTerms(k)) {
      console.log(`[prune] ${lang}:${k} terms -> {}`);
      changed = true;
    }
  }
  if (changed) {
    if (DRY) {
      console.log(`[dry-run] would write ${i18nPath}`);
    } else {
      fs.writeFileSync(i18nPath, text, 'utf8');
      console.log(`[prune] wrote ${i18nPath}`);
    }
  } else {
    console.log(`[prune] no changes for ${lang}`);
  }
}

for (const lang of LANGS) {
  pruneTermsForLang(lang);
}

