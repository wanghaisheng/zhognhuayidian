#!/usr/bin/env node

/**
 * Split Sitemap Generator
 * Generates split sitemaps for blog to support progressive indexing.
 * Also generates a separate sitemap for Glossary.
 * 
 * Run: node scripts/generate-split-sitemap.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = (process.env.SITE_URL ? String(process.env.SITE_URL) : 'https://chinactscanner.org').replace(/\/+$/, '');
const BATCH_SIZE = Number(process.env.BATCH_SIZE || 500);

const MAX_VISIBLE_BATCHES = Number(process.env.MAX_VISIBLE_BATCHES || 500);

// ==================== Utils ====================

const escapeXml = (text) => {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
};

const calculateHash = (content) => {
  return crypto.createHash('md5').update(content).digest('hex');
};

const loadExistingHash = (filePath) => {
  try {
    const hashPath = filePath + '.hash';
    if (fs.existsSync(hashPath)) {
      return fs.readFileSync(hashPath, 'utf8').trim();
    }
  } catch {}
  return null;
};

const saveHash = (filePath, hash) => {
  const hashPath = filePath + '.hash';
  fs.writeFileSync(hashPath, hash, 'utf8');
};

const writeFileIfChanged = (filePath, content, label) => {
  const newHash = calculateHash(content);
  const existingHash = loadExistingHash(filePath);
  const shouldUpdate = existingHash !== newHash;
  if (shouldUpdate) {
    fs.writeFileSync(filePath, content, 'utf8');
    saveHash(filePath, newHash);
    console.log(`✅ ${label} updated`);
    return true;
  } else {
    console.log(`⏭️  ${label} unchanged, skipped`);
    return false;
  }
};

const generateHreflangLinks = (pagePath) => {
  const enUrl = pagePath === '/' ? `${BASE_URL}/` : `${BASE_URL}${pagePath}/`;
  const zhUrl = pagePath === '/' ? `${BASE_URL}/zh/` : `${BASE_URL}/zh${pagePath}/`;

  return [
    { hreflang: 'en', href: enUrl },
    { hreflang: 'zh', href: zhUrl },
    { hreflang: 'x-default', href: zhUrl } // Default to zh
  ];
};

const generateUrlEntry = (url, alternates = []) => {
    let xml = `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority.toFixed(1)}</priority>`;

    alternates.forEach(alt => {
        xml += `
    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${escapeXml(alt.href)}" />`;
    });

    xml += `
  </url>`;
    return xml;
};

// ==================== Data Loading ====================

const getSlugsFromDir = (dir) => {
    const dirPath = path.join(__dirname, '../src/content/zh', dir);
    if (!fs.existsSync(dirPath)) return [];
    return fs.readdirSync(dirPath)
        .filter(file => file.endsWith('.ts') && file !== 'index.ts')
        .map(file => file.replace('.ts', ''));
};

// ==================== Sitemap Generation ====================

const generateSitemapXML = (urls) => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`;
};

const generateSitemapIndex = (sitemaps) => {
    const lastmod = new Date().toISOString().split('T')[0];
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    sitemaps.forEach(sitemap => {
        xml += `
  <sitemap>
    <loc>${BASE_URL}/${sitemap}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`;
    });

    xml += `
</sitemapindex>`;
    return xml;
};

// ==================== Main ====================

const normalizePathname = (p) => {
  let s = String(p || '/').trim();
  if (!s.startsWith('/')) s = `/${s}`;
  if (s !== '/' && s.endsWith('/')) s = s.slice(0, -1);
  return s;
};

const stripLangPrefix = (p) => {
  const s = normalizePathname(p);
  const m = s.match(/^\/([a-z]{2})(\/|$)/i);
  if (m) {
    const lang = m[1].toLowerCase();
    return { clean: s.replace(new RegExp(`^/${lang}`), '' ) || '/', lang };
  }
  return { clean: s, lang: 'en' };
};

const loadPrerenderRoutes = (routesPath) => {
  const resolved = routesPath ? path.resolve(routesPath) : path.join(__dirname, '../prerender-routes.json');
  if (!fs.existsSync(resolved)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(resolved, 'utf-8'));
    return Array.isArray(parsed) ? parsed.map(normalizePathname) : [];
  } catch {
    return [];
  }
};

const STATIC_PAGES = [{ path: '/', priority: 1.0, changefreq: 'daily' }];

const main = (outputDir, prerenderListPath) => {
    console.log('🚀 Starting sitemap generation...\n');

    const targetDir = outputDir || path.join(__dirname, '../public');
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    const lastmodNow = new Date().toISOString().split('T')[0];
    const generatedFiles = [];

    const prerenderRoutes = loadPrerenderRoutes(prerenderListPath);
    console.log(`ℹ Using ${prerenderRoutes.length} routes from prerender-routes.json`);

    const variantsMap = new Map();
    for (const r of prerenderRoutes) {
      const { clean, lang } = stripLangPrefix(r);
      if (clean === '/404') continue;
      if (clean.startsWith('/admin') || clean.startsWith('/api')) continue;
      const entry = variantsMap.get(clean) || { langs: new Set() };
      entry.langs.add(lang);
      variantsMap.set(clean, entry);
    }

    if (variantsMap.size === 0) {
      for (const p of STATIC_PAGES) {
        const entry = variantsMap.get(p.path) || { langs: new Set() };
        entry.langs.add('en');
        entry.langs.add('zh');
        variantsMap.set(p.path, entry);
      }
    }

    const CORE_SEGMENTS = new Set(['', 'devices', 'manufacturers', 'pricing', 'compare', 'reports', 'about', 'contact', 'privacy', 'terms', 'resources']);
    const subCounts = new Map();
    for (const clean of variantsMap.keys()) {
      const parts = clean.split('/').filter(Boolean);
      const first = (parts[0] || '').toLowerCase();
      const second = (parts[1] || '').toLowerCase();
      if (!first || CORE_SEGMENTS.has(first)) continue;
      const set = subCounts.get(first) || new Set();
      if (second) set.add(second);
      subCounts.set(first, set);
    }
    const dynamicCategories = new Set();
    for (const [first, set] of subCounts.entries()) {
      if ((set?.size || 0) >= 5) dynamicCategories.add(first);
    }

    const contentRoot = path.join(__dirname, '../content');
    const resolveSourceFile = (lang, clean) => {
      const parts = clean.split('/').filter(Boolean);
      if (parts.length < 2) return null;
      const category = (parts[0] || '').toLowerCase();
      const slug = (parts[1] || '').toLowerCase();
      const p = path.join(contentRoot, category, lang, `${slug}.md`);
      if (fs.existsSync(p)) return p;
      return null;
    };
    const resolveSourceDir = (lang, clean) => {
      const parts = clean.split('/').filter(Boolean);
      if (parts.length < 1) return null;
      const category = (parts[0] || '').toLowerCase();
      const dir = path.join(contentRoot, category, lang);
      if (fs.existsSync(dir)) return dir;
      return null;
    };
    const getLastmod = (lang, clean) => {
      const file = resolveSourceFile(lang, clean);
      if (file) {
        try {
          const s = fs.statSync(file);
          const d = new Date(s.mtime);
          return d.toISOString().split('T')[0];
        } catch {}
      }
      const dir = resolveSourceDir(lang, clean);
      if (dir) {
        try {
          const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
          let latest = 0;
          for (const f of files) {
            const fp = path.join(dir, f);
            const st = fs.statSync(fp);
            const mt = new Date(st.mtime).getTime();
            if (mt > latest) latest = mt;
          }
          if (latest > 0) {
            return new Date(latest).toISOString().split('T')[0];
          }
        } catch {}
      }
      return lastmodNow;
    };

    const byCategory = new Map();
    const coreEntries = []; // xml entries
    const allEntries = [];
    const langsPriority = (lang) => (lang === 'zh' ? 0.8 : 0.8);

    for (const [clean, entry] of variantsMap.entries()) {
      const langs = Array.from(entry.langs);
      const alternates = langs.map((l) => ({
        hreflang: l.toLowerCase(),
        href: `${BASE_URL}${l === 'en' ? '' : `/${l}`}${clean}/`
      }));
      const xDefault = langs.includes('zh') ? 'zh' : 'en';
      alternates.push({
        hreflang: 'x-default',
        href: `${BASE_URL}${xDefault === 'en' ? '' : `/${xDefault}`}${clean}/`
      });

      const parts = clean.split('/').filter(Boolean);
      const firstSeg = (parts[0] || '').toLowerCase();
      const category = dynamicCategories.has(firstSeg) ? firstSeg : null;

      for (const l of langs) {
        const loc = `${BASE_URL}${l === 'en' ? '' : `/${l}`}${clean}/`;
        const xml = generateUrlEntry({
          loc,
          lastmod: getLastmod(l, clean),
          changefreq: 'weekly',
          priority: langsPriority(l)
        }, alternates);
        allEntries.push(xml);
        if (category) {
          const arr = byCategory.get(category) || [];
          arr.push(xml);
          byCategory.set(category, arr);
        } else {
          coreEntries.push(xml);
        }
      }
    }

    const sortedEntries = allEntries;

    // 1) Core sitemap (non-category)
    const coreBatches = [];
    for (let i = 0; i < coreEntries.length; i += BATCH_SIZE) {
      coreBatches.push(coreEntries.slice(i, i + BATCH_SIZE));
    }
    let coreFiles = [];
    if (coreBatches.length === 0 && STATIC_PAGES.length) {
      const homepage = generateUrlEntry({ loc: `${BASE_URL}/`, lastmod: lastmodNow, changefreq: 'daily', priority: 1.0 }, [
        { hreflang: 'en', href: `${BASE_URL}/` },
        { hreflang: 'zh', href: `${BASE_URL}/zh/` },
        { hreflang: 'x-default', href: `${BASE_URL}/zh/` }
      ]);
      coreBatches.push([homepage]);
    }
    for (let i = 0; i < coreBatches.length; i++) {
      const filename = coreBatches.length === 1 ? `sitemap-core.xml` : `sitemap-core-${i + 1}.xml`;
      const content = generateSitemapXML(coreBatches[i]);
      writeFileIfChanged(path.join(targetDir, filename), content, filename);
      coreFiles.push(filename);
      generatedFiles.push(filename);
    }

    // 2) Category sitemaps + category indices（仅一级分类）
    const categoryIndexFiles = [];
    for (const [cat, entries] of byCategory.entries()) {
      const batches = [];
      for (let i = 0; i < entries.length; i += BATCH_SIZE) {
        batches.push(entries.slice(i, i + BATCH_SIZE));
      }
      const visibleCount = Math.min(MAX_VISIBLE_BATCHES, batches.length);
      const catFiles = [];
      for (let i = 0; i < visibleCount; i++) {
        const filename = `sitemap-${cat}-${i + 1}.xml`;
        const content = generateSitemapXML(batches[i]);
        writeFileIfChanged(path.join(targetDir, filename), content, filename);
        catFiles.push(filename);
        generatedFiles.push(filename);
      }
      // Category-level index referencing category batches
      const catIndexName = `sitemap-${cat}-index.xml`;
      const catIndexContent = generateSitemapIndex(catFiles);
      writeFileIfChanged(path.join(targetDir, catIndexName), catIndexContent, catIndexName);
      categoryIndexFiles.push(catIndexName);
      generatedFiles.push(catIndexName);
    }

    // 3) Global sitemap-index.xml listing core and category indices
    const globalIndexName = 'sitemap-index.xml';
    const globalIndexContent = generateSitemapIndex([
      ...coreFiles,
      ...categoryIndexFiles
    ]);
    writeFileIfChanged(path.join(targetDir, globalIndexName), globalIndexContent, globalIndexName);
    generatedFiles.push(globalIndexName);

    // 4) Root sitemap.xml referencing global index + category indices + core sitemaps
    const rootIndex = generateSitemapIndex([
      globalIndexName
    ]);
    writeFileIfChanged(path.join(targetDir, 'sitemap.xml'), rootIndex, 'sitemap.xml');
    console.log(`\n✅ Generated hierarchical sitemap.xml with ${categoryIndexFiles.length} category indices and ${coreFiles.length} core files.`);

    console.log('\n✨ Split Sitemap Generation Complete!');
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const outputDir = process.argv[2];
    const prerenderListPath = process.argv[3];
    main(outputDir, prerenderListPath);
}

export { main as generateSplitSitemap };
