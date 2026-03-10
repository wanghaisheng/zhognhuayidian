#!/usr/bin/env node

/**
 * Prerender Route Generator
 * Generates all routes to be prerendered based on content structure.
 * 
 * Run: node scripts/generate-prerender-routes.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Locale prefix map (default en has no prefix)
const getLocalePrefix = (locale) => (locale === 'en' ? '' : `/${locale}`);

// Load supported languages and their prefixes from src/config/language.ts
const loadLanguagePrefixes = () => {
  const langFile = path.join(__dirname, '../src/config/language.ts');
  const prefixes = new Map();
  try {
    const src = fs.readFileSync(langFile, 'utf-8');
    const arrMatch = src.match(/export\s+const\s+LANGUAGES[^=]*=\s*\[([\s\S]*?)\]\s*;/);
    if (arrMatch) {
      const body = arrMatch[1];
      const objRegex = /(^|\n)\s*\{\s*([\s\S]*?)\}/gm;
      let m;
      while ((m = objRegex.exec(body)) !== null) {
        const obj = m[2];
        const objStartIndex = m.index + (m[1] ? m[1].length : 0);
        const lineStart = body.lastIndexOf('\n', objStartIndex) + 1;
        const line = body.slice(lineStart, objStartIndex).trim();
        if (line.startsWith('//')) continue;
        const codeMatch = obj.match(/code:\s*'([^']+)'/);
        const prefixMatch = obj.match(/prefix:\s*'([^']*)'/);
        if (codeMatch) {
          const code = codeMatch[1];
          const prefix = prefixMatch ? prefixMatch[1] : (code === 'en' ? '' : `/${code}`);
          prefixes.set(code, prefix);
        }
      }
    }
  } catch (e) {
    // Fallback to en/zh only
    prefixes.set('en', '');
    prefixes.set('zh', '/zh');
  }
  if (!prefixes.size) {
    prefixes.set('en', '');
    prefixes.set('zh', '/zh');
  }
  return prefixes;
};

// Helper: list locales available for a given content category
const getLocalesForCategory = (category) => {
  const snapshotsRoot = path.join(__dirname, '../src/data/snapshots');
  if (!fs.existsSync(snapshotsRoot)) return [];
  return fs.readdirSync(snapshotsRoot).filter((locale) => {
    const candidate = path.join(snapshotsRoot, locale, 'content', category);
    try {
      return fs.statSync(candidate).isDirectory();
    } catch {
      return false;
    }
  });
};

// Helper to get slugs from snapshots/<locale>/content/<category>/*.json
const getSnapshotSlugs = (category, locale) => {
  const dirPath = path.join(__dirname, `../src/data/snapshots/${locale}/content/${category}`);
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath)
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.replace(/\.json$/i, ''));
};

// Load base static routes from src/utils/multilingualRoutes.ts to avoid duplication
const loadBaseRoutesFromConfig = () => {
  const file = path.join(__dirname, '../src/utils/multilingualRoutes.ts');
  try {
    const src = fs.readFileSync(file, 'utf-8');
    const arrMatch = src.match(/export\s+const\s+baseRoutes\s*=\s*\[([\s\S]*?)\]\s*;/);
    if (!arrMatch) return ['/'];
    const body = arrMatch[1];
    const routeRegex = /['"]([^'"]+)['"]/g;
    const routes = [];
    let m;
    while ((m = routeRegex.exec(body)) !== null) {
      routes.push(m[1]);
    }
    // Ensure root exists
    if (!routes.includes('/')) routes.unshift('/');
    return routes;
  } catch {
    return ['/'];
  }
};

// Scan route slices to discover static base routes
const scanSlicesForRoutes = () => {
  const dir = path.join(__dirname, '../src/lib/routes/slices');
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));
  const routes = new Set(['/']);
  const add = (p) => {
    if (!p) return;
    if (p.includes(':') || p.includes('$')) return;
    routes.add(p);
  };
  for (const f of files) {
    const src = fs.readFileSync(path.join(dir, f), 'utf-8');
    // componentRoutes / componentRoutesWithLoader
    const crRegex = /componentRoutes(?:WithLoader)?\s*\([\s\S]*?,\s*['"]([^'"]+)['"]/g;
    let m;
    while ((m = crRegex.exec(src)) !== null) add(m[1]);
    // createRoute({ path: '/...' })
    const pathRegex = /createRoute\s*\(\s*\{\s*[\s\S]*?path:\s*['"]([^'"]+)['"]/g;
    while ((m = pathRegex.exec(src)) !== null) add(m[1]);
  }
  return Array.from(routes);
};

const readJsonSafe = (p) => {
  try {
    if (!fs.existsSync(p)) return null;
    const raw = fs.readFileSync(p, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const getBookEntries = (locale) => {
  const idx = readJsonSafe(path.join(__dirname, `../src/data/snapshots/${locale}/books.json`));
  const items = Array.isArray(idx?.items) ? idx.items : [];
  const contentDir = path.join(__dirname, `../src/data/snapshots/${locale}/content/books`);
  const contentSlugs = fs.existsSync(contentDir)
    ? fs.readdirSync(contentDir).filter(f => f.endsWith('.json')).map(f => f.replace(/\.json$/i, ''))
    : [];
  const bySlug = new Map(items.map(it => [it.slug, it]));
  contentSlugs.forEach(slug => {
    if (!bySlug.has(slug)) {
      bySlug.set(slug, { slug, category: '' });
    }
  });
  return Array.from(bySlug.values());
};

const detectBookCategory = (locale, slug, fallback) => {
  const p = path.join(__dirname, `../src/data/snapshots/${locale}/content/books/${slug}.json`);
  const js = readJsonSafe(p);
  const fm = js?.frontMatter || {};
  const tags = Array.isArray(fm.tags) ? fm.tags.map(t => String(t).toLowerCase()) : [];
  const cat = String(fm.category || fm.type || fallback || '').toLowerCase();
  const slugLower = String(slug).toLowerCase();
  
  // 中医古籍分类逻辑
  if (cat.includes('medical-classics') || tags.some(t => t.includes('medical-classics'))) return 'medical-classics';
  if (cat.includes('pharmacology') || tags.some(t => t.includes('pharmacology'))) return 'pharmacology';
  if (cat.includes('formulas') || tags.some(t => t.includes('formulas'))) return 'formulas';
  if (cat.includes('symptoms') || tags.some(t => t.includes('symptoms'))) return 'symptoms';
  if (cat.includes('prescriptions') || tags.some(t => t.includes('prescriptions'))) return 'prescriptions';
  
  return String(fallback || '').toLowerCase() || 'medical-classics';
};

const detectBookSpec = (locale, slug, category) => {
  const p = path.join(__dirname, `../src/data/snapshots/${locale}/content/books/${slug}.json`);
  const js = readJsonSafe(p);
  const fm = js?.frontMatter || {};
  const tags = Array.isArray(fm.tags) ? fm.tags.map(t => String(t).toLowerCase()) : [];
  
  // 中医古籍特殊分类
  const dynasty = fm.dynasty || fm.era || fm.period;
  if (dynasty) {
    const dynastyLower = String(dynasty).toLowerCase();
    if (dynastyLower.includes('qing') || dynastyLower.includes('清朝')) return 'qing';
    if (dynastyLower.includes('ming') || dynastyLower.includes('明朝')) return 'ming';
    if (dynastyLower.includes('yuan') || dynastyLower.includes('元朝')) return 'yuan';
    if (dynastyLower.includes('song') || dynastyLower.includes('宋朝')) return 'song';
    if (dynastyLower.includes('tang') || dynastyLower.includes('唐朝')) return 'tang';
  }
  
  return null; // 书籍通常不需要特殊规格分类
};

const generateRoutes = () => {
  // ===== Static Core Routes =====
  const baseRoutesRaw = Array.from(new Set([
    ...loadBaseRoutesFromConfig(),
    ...scanSlicesForRoutes(),
  ]));
  const baseRoutes = baseRoutesRaw.filter((r) => !r.includes(':') && !r.includes('$'));

  console.log(`📊 Generating routes...`);

  // Generate localized routes for all static pages
  const staticRoutes = [];
  const languagePrefixes = loadLanguagePrefixes(); // Map<code, prefix>
  baseRoutes.forEach(route => {
    for (const [, prefix] of languagePrefixes.entries()) {
      if (route === '/') {
        staticRoutes.push(prefix || '/');
      } else {
        staticRoutes.push(`${prefix}${route}`);
      }
    }
  });

  // ===== Dynamic Content Routes from Markdown (filtered by per-locale existence) =====
// 从content分析哪些是markdown目录
  const categories = ['blog', 'glossary', 'learn', 'guides', 'history', 'comparisons', 'education'];
  
  // Blog
  const blogLocales = getLocalesForCategory('blog');
  const blogRoutes = blogLocales.flatMap((locale) => {
    const prefix = getLocalePrefix(locale);
    const slugs = getSnapshotSlugs('blog', locale);
    return slugs.map((slug) => `${prefix}/blog/${slug}`);
  });

  // Glossary
  const glossaryLocales = getLocalesForCategory('glossary');
  const glossaryRoutes = glossaryLocales.flatMap((locale) => {
    const prefix = getLocalePrefix(locale);
    const slugs = getSnapshotSlugs('glossary', locale);
    return slugs.map((slug) => `${prefix}/glossary/${slug}`);
  });

  // Learn
  const learnLocales = getLocalesForCategory('learn');
  const learnRoutes = learnLocales.flatMap((locale) => {
    const prefix = getLocalePrefix(locale);
    const slugs = getSnapshotSlugs('learn', locale);
    return slugs.map((slug) => `${prefix}/learn/${slug}`);
  });

  // Guides
  const guidesLocales = getLocalesForCategory('guides');
  const guidesRoutes = guidesLocales.flatMap((locale) => {
    const prefix = getLocalePrefix(locale);
    const slugs = getSnapshotSlugs('guides', locale);
    return slugs.map((slug) => `${prefix}/learn/${slug}`);
  });

  // History
  const historyLocales = getLocalesForCategory('history');
  const historyRoutes = historyLocales.flatMap((locale) => {
    const prefix = getLocalePrefix(locale);
    const slugs = getSnapshotSlugs('history', locale);
    return slugs.map((slug) => `${prefix}/history/${slug}`);
  });

  // Reports → /reports/market/:slug
  const reportsLocales = getLocalesForCategory('reports');
  const reportRoutes = reportsLocales.flatMap((locale) => {
    const prefix = getLocalePrefix(locale);
    const slugs = getSnapshotSlugs('reports', locale);
    return slugs.map((slug) => `${prefix}/reports/market/${slug}`);
  });

  // Manufacturers → /manufacturers/:slug
  const manufacturersLocales = getLocalesForCategory('manufacturers');
  const manufacturerRoutes = manufacturersLocales.flatMap((locale) => {
    const prefix = getLocalePrefix(locale);
    const slugs = getSnapshotSlugs('manufacturers', locale);
    return slugs.map((slug) => `${prefix}/manufacturers/${slug}`);
  });

  // Comparisons → /compare/:slug
  const comparisonLocales = getLocalesForCategory('comparisons');
  const comparisonRoutes = comparisonLocales.flatMap((locale) => {
    const prefix = getLocalePrefix(locale);
    const slugs = getSnapshotSlugs('comparisons', locale);
    return slugs.map((slug) => `${prefix}/compare/${slug}`);
  });

  // Education (Pricing only) → /pricing/:model where file is pricing-<model>.md
  const educationLocales = getLocalesForCategory('education');
  const pricingRoutes = educationLocales.flatMap((locale) => {
    const prefix = getLocalePrefix(locale);
    const slugs = getSnapshotSlugs('education', locale);
    return slugs
      .filter((slug) => slug.startsWith('pricing-'))
      .map((slug) => {
        const model = slug.replace(/^pricing-/, '');
        return `${prefix}/pricing/${model}`;
      });
  });

  // ===== Combine All Routes =====
  const bookRoutes = [];
  const bookSpecRoutes = [];
  for (const [locale, prefix] of languagePrefixes.entries()) {
    const entries = getBookEntries(locale);
    entries.forEach((book) => {
      const contentPath = path.join(__dirname, `../src/data/snapshots/${locale}/content/books/${book.slug}.json`);
      if (!fs.existsSync(contentPath)) return;
      const category = detectBookCategory(locale, book.slug, book.category);
      const base = `${prefix}/library/${book.slug}`;
      bookRoutes.push(base);
      const spec = detectBookSpec(locale, book.slug, category);
      if (spec) {
        bookRoutes.push(`${prefix}/library/${category}/${spec}/${book.slug}`);
        bookSpecRoutes.push(`${prefix}/library/${category}/${spec}`);
      }
    });
    // Add category index pages if the locale has at least one book in that category
    const hasMedicalClassics = entries.some(b => detectBookCategory(locale, b.slug, b.category) === 'medical-classics');
    const hasPharmacology = entries.some(b => detectBookCategory(locale, b.slug, b.category) === 'pharmacology');
    const hasFormulas = entries.some(b => detectBookCategory(locale, b.slug, b.category) === 'formulas');
    if (hasMedicalClassics) bookRoutes.push(`${prefix}/library/medical-classics`);
    if (hasPharmacology) bookRoutes.push(`${prefix}/library/pharmacology`);
    if (hasFormulas) bookRoutes.push(`${prefix}/library/formulas`);
  }

  const allRoutes = [
    ...staticRoutes,
    ...blogRoutes,
    ...glossaryRoutes,
    ...learnRoutes,
    ...guidesRoutes,
    ...historyRoutes,
    ...reportRoutes,
    ...manufacturerRoutes,
    ...comparisonRoutes,
    ...pricingRoutes,
    ...bookRoutes,
    ...bookSpecRoutes
  ];

  // Deduplicate
  const uniqueRoutes = [...new Set(allRoutes)];

  return {
    routes: uniqueRoutes,
    stats: {
      static: staticRoutes.length,
      blog: blogRoutes.length,
      glossary: glossaryRoutes.length,
      learn: learnRoutes.length,
      guides: guidesRoutes.length,
      history: historyRoutes.length,
      reports: reportRoutes.length,
      manufacturers: manufacturerRoutes.length,
      comparisons: comparisonRoutes.length,
      pricing: pricingRoutes.length,
      books: bookRoutes.length,
      bookSpecs: bookSpecRoutes.length,
      total: uniqueRoutes.length
    }
  };
};

const main = () => {
  console.log('🚀 Starting route generation...\n');
  
  const { routes, stats } = generateRoutes();
  
  console.log('\n📋 Route Statistics:');
  console.log(`   - Static Routes: ${stats.static}`);
  console.log(`   - Blog: ${stats.blog}`);
  console.log(`   - Glossary: ${stats.glossary}`);
  console.log(`   - Learn: ${stats.learn}`);
  console.log(`   - Guides: ${stats.guides}`);
  console.log(`   - History: ${stats.history}`);
  console.log(`   - Reports: ${stats.reports}`);
  console.log(`   - Manufacturers: ${stats.manufacturers}`);
  console.log(`   - Comparisons: ${stats.comparisons}`);
  console.log(`   - Pricing: ${stats.pricing}`);
  console.log(`   - Books: ${stats.books}`);
  console.log(`   - Total: ${stats.total} routes\n`);
  
  // Write to file
  const outputPath = path.join(__dirname, '../prerender-routes.json');
  fs.writeFileSync(outputPath, JSON.stringify(routes, null, 2));
  console.log(`✅ Route list saved: ${outputPath}\n`);
};

main();

export {};
