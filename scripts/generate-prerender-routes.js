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

const getDeviceEntries = (locale) => {
  const idx = readJsonSafe(path.join(__dirname, `../src/data/snapshots/${locale}/devices.json`));
  const items = Array.isArray(idx?.items) ? idx.items : [];
  const contentDir = path.join(__dirname, `../src/data/snapshots/${locale}/content/devices`);
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

const detectDeviceCategory = (locale, slug, fallback) => {
  const p = path.join(__dirname, `../src/data/snapshots/${locale}/content/devices/${slug}.json`);
  const js = readJsonSafe(p);
  const fm = js?.frontMatter || {};
  const tags = Array.isArray(fm.tags) ? fm.tags.map(t => String(t).toLowerCase()) : [];
  const cat = String(fm.category || fm.type || fallback || '').toLowerCase();
  const slugLower = String(slug).toLowerCase();
  if (slugLower.includes('mri')) return 'mri';
  if (slugLower.includes('ct')) return 'ct';
  if (cat.includes('mri')) return 'mri';
  if (cat.includes('ct')) return 'ct';
  if (tags.some(t => t.includes('mri'))) return 'mri';
  if (tags.some(t => t.includes('ct'))) return 'ct';
  return (String(fallback || '').toLowerCase() === 'mri') ? 'mri' : 'ct';
};

const detectDeviceSpec = (locale, slug, category) => {
  const p = path.join(__dirname, `../src/data/snapshots/${locale}/content/devices/${slug}.json`);
  const js = readJsonSafe(p);
  const fm = js?.frontMatter || {};
  const tags = Array.isArray(fm.tags) ? fm.tags.map(t => String(t).toLowerCase()) : [];
  if (category === 'ct') {
    const slices = fm.sliceCount ?? fm.slices ?? fm.slice ?? fm.detectorSlices;
    if (slices === 128 || String(slices) === '128') return '128-slice';
    if (slices === 64 || String(slices) === '64') return '64-slice';
    const type = String(fm.type || '').toLowerCase();
    if (type.includes('mobile') || tags.includes('mobile')) return 'mobile';
    if (type.includes('dual') || tags.includes('dual-energy')) return 'dual-energy';
    if (type.includes('portable') || tags.includes('portable')) return 'portable';
  } else {
    const fsVal = fm.fieldStrength ?? fm.field_strength ?? fm.b0;
    if (fsVal === 3 || fsVal === 3.0 || String(fsVal).toLowerCase() === '3t') return '3t';
    if (fsVal === 1.5 || String(fsVal).toLowerCase() === '1.5t') return '1.5t';
    const design = String(fm.designType || fm.design || '').toLowerCase();
    if (design.includes('open') || tags.includes('open')) return 'open';
    if (design.includes('wide') || tags.includes('wide-bore')) return 'wide-bore';
  }
  return null;
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
  const deviceRoutes = [];
  const deviceSpecRoutes = [];
  for (const [locale, prefix] of languagePrefixes.entries()) {
    const entries = getDeviceEntries(locale);
    entries.forEach((d) => {
      const contentPath = path.join(__dirname, `../src/data/snapshots/${locale}/content/devices/${d.slug}.json`);
      if (!fs.existsSync(contentPath)) return;
      const category = detectDeviceCategory(locale, d.slug, d.category);
      const categoryPath = category === 'mri' ? 'mri-scanners' : 'ct-scanners';
      const base = `${prefix}/devices/${categoryPath}/${d.slug}`;
      deviceRoutes.push(base);
      const spec = detectDeviceSpec(locale, d.slug, category);
      if (spec) {
        deviceRoutes.push(`${prefix}/devices/${categoryPath}/${spec}/${d.slug}`);
        deviceSpecRoutes.push(`${prefix}/devices/${categoryPath}/${spec}`);
      }
    });
    // Add category index pages if the locale has at least one device in that category
    const hasCT = entries.some(d => detectDeviceCategory(locale, d.slug, d.category) === 'ct');
    const hasMRI = entries.some(d => detectDeviceCategory(locale, d.slug, d.category) === 'mri');
    if (hasCT) deviceRoutes.push(`${prefix}/devices/ct-scanners`);
    if (hasMRI) deviceRoutes.push(`${prefix}/devices/mri-scanners`);
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
    ...deviceRoutes,
    ...deviceSpecRoutes
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
      comparisons: comparisonRoutes.length,
      pricing: pricingRoutes.length,
      devices: deviceRoutes.length,
      deviceSpecs: deviceSpecRoutes.length,
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
  console.log(`   - Comparisons: ${stats.comparisons}`);
  console.log(`   - Pricing: ${stats.pricing}`);
  console.log(`   - Total: ${stats.total} routes\n`);
  
  // Write to file
  const outputPath = path.join(__dirname, '../prerender-routes.json');
  fs.writeFileSync(outputPath, JSON.stringify(routes, null, 2));
  console.log(`✅ Route list saved: ${outputPath}\n`);
};

main();

export {};
