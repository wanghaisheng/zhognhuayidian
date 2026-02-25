const fs = require('fs');
const path = require('path');
function readRaw(p) {
  return fs.readFileSync(p, 'utf8');
}
function readText(p) {
  return fs.readFileSync(p, 'utf8');
}
function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}
function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function parsePrice(text) {
  const t = String(text || '').trim().replace(/,/g, '');
  if (!t) return null;
  const wangRange = t.match(/(\d+(?:\.\d+)?)\s*万[^0-9~]*~\s*(\d+(?:\.\d+)?)\s*万/);
  if (wangRange) return { currency: 'CNY', unit: '万元', min: parseFloat(wangRange[1]), max: parseFloat(wangRange[2]), originalText: t };
  const wangSingle = t.match(/(\d+(?:\.\d+)?)\s*万元/);
  if (wangSingle) return { currency: 'CNY', unit: '万元', min: parseFloat(wangSingle[1]), max: parseFloat(wangSingle[1]), originalText: t };
  const yuanRange = t.match(/(\d+(?:\.\d+)?)\s*to\s*(\d+(?:\.\d+)?)\s*yuan/i);
  if (yuanRange) return { currency: 'CNY', unit: 'yuan', min: parseFloat(yuanRange[1]), max: parseFloat(yuanRange[2]), originalText: t };
  return { currency: 'CNY', unit: 'unknown', originalText: t };
}
function modelSlugFromName(s) {
  return slugify(String(s).replace(/\+/g, ' plus '));
}
function parseMarkdownPrices(mdText) {
  const lines = mdText.split(/\r?\n/);
  let currentBrand = null;
  const priceMap = { '*': {} };
  for (const line of lines) {
    const brandMatch = line.match(/^\*\*\s*\d+\.\s*(.+?)\s*\*\*/);
    if (brandMatch) {
      currentBrand = brandMatch[1].trim();
      continue;
    }
    if (!currentBrand) continue;
    const itemMatch = line.match(/^\*\s+(.*?)\s*:\s*(.*)$/) || line.match(/^\*\s+\*\s+(.*?)\s*:\s*(.*)$/);
    if (itemMatch) {
      const name = itemMatch[1].trim();
      const info = itemMatch[2].trim();
      if (/No Specific Price Listed/i.test(info)) continue;
      const p = parsePrice(info);
      if (!p) continue;
      const slug = modelSlugFromName(name);
      if (!priceMap[currentBrand]) priceMap[currentBrand] = {};
      priceMap[currentBrand][slug] = p;
      priceMap['*'][slug] = p;
    }
  }
  return priceMap;
}
function writeMd(dir, slug, payload) {
  const p = path.join(dir, `${slug}.md`);
  if (fs.existsSync(p)) {
    const content = readText(p);
    if (content.includes('\nprice:\n')) return;
    if (!payload.price) return;
    const lines = content.split('\n');
    let idx = lines.findIndex(l => /^  image: /.test(l));
    if (idx === -1) idx = lines.findIndex(l => /^seo:/.test(l));
    const insert = [
      'price:',
      `  currency: "${payload.price.currency}"`,
      payload.price && typeof payload.price.min === 'number' ? `  min: ${payload.price.min}` : null,
      payload.price && typeof payload.price.max === 'number' ? `  max: ${payload.price.max}` : null,
      payload.price && payload.price.unit ? `  unit: "${payload.price.unit}"` : null,
      payload.price && payload.price.originalText ? `  originalText: "${payload.price.originalText}"` : null
    ].filter(Boolean);
    if (idx !== -1) {
      lines.splice(idx + 1, 0, ...insert);
      fs.writeFileSync(p, lines.join('\n'), 'utf8');
    }
    return;
  }
  const front = [
    '---',
    `title: "${payload.title}"`,
    `description: "${payload.description}"`,
    `slug: "${slug}"`,
    `category: "devices"`,
    `tags: ${JSON.stringify(payload.tags)}`,
    `publishedAt: "${payload.publishedAt}"`,
    `updatedAt: "${payload.updatedAt}"`,
    `author: "${payload.author}"`,
    `status: "published"`,
    'seo:',
    `  title: "${payload.seo.title}"`,
    `  description: "${payload.seo.description}"`,
    `  keywords: "${payload.seo.keywords}"`,
    `  canonical: "${payload.seo.canonical}"`,
    `  image: "${payload.seo.image}"`,
    payload.price ? 'price:' : null,
    payload.price ? `  currency: "${payload.price.currency}"` : null,
    payload.price && typeof payload.price.min === 'number' ? `  min: ${payload.price.min}` : null,
    payload.price && typeof payload.price.max === 'number' ? `  max: ${payload.price.max}` : null,
    payload.price && payload.price.unit ? `  unit: "${payload.price.unit}"` : null,
    payload.price && payload.price.originalText ? `  originalText: "${payload.price.originalText}"` : null,
    `featuresNote: "${payload.featuresNote}"`,
    `specsNote: "${payload.specsNote}"`,
    '---',
    ''
  ].filter(Boolean).join('\n');
  const body = payload.body || '';
  fs.writeFileSync(p, `${front}\n${body}\n`, 'utf8');
}
function main() {
  const root = process.cwd();
  const pricesMdPath = path.join(root, 'data', 'rawdata', 'prices.md');
  const pricesText = readText(pricesMdPath);
  const priceMap = parseMarkdownPrices(pricesText);
  const outDir = path.join(root, 'content', 'devices', 'en');
  ensureDir(outDir);
  const ctIndexPath = path.join(root, 'src', 'locales', 'en', 'data', 'ct', 'index.ts');
  const mriIndexPath = path.join(root, 'src', 'locales', 'en', 'data', 'mri', 'index.ts');
  const ctIdx = readText(ctIndexPath);
  const mriIdx = readText(mriIndexPath);
  const ctSlugs = Array.from(ctIdx.matchAll(/'([a-z0-9-]+)':/g)).map(m => m[1]);
  const mriSlugs = Array.from(mriIdx.matchAll(/'([a-z0-9-]+)':/g)).map(m => m[1]);
  const brandMap = {
    ge: 'GE (General Electric)',
    siemens: 'Siemens',
    philips: 'Philips',
    uih: 'United Imaging (联影医疗)',
    neusoft: 'Neusoft Medical (东软医疗)',
    wandong: 'Wandong Medical (万东医疗)',
    anke: 'Anke (安科)',
    mingfeng: 'Mingfeng(明峰)',
    canon: 'Canon/Toshiba (佳能/东芝)',
    health: 'Health-care (航卫通用电气)'
  };
  function findPriceBySearch(text, name) {
    const lines = text.split(/\r?\n/);
    const variants = [name, name.replace(/\+/g, ' plus '), name.replace(/\s+/g, ' ')];
    for (const line of lines) {
      const lower = line.toLowerCase();
      if (variants.some(v => lower.includes(String(v).toLowerCase()))) {
        const p = parsePrice(line);
        if (p) return p;
      }
    }
    return null;
  }
  function payloadFor(slug, type) {
    const parts = slug.split('-');
    const prefix = parts[0];
    const brandName = brandMap[prefix] || prefix;
    const modelSlug = parts.slice(1).join('-');
    const modelName = parts.slice(1).join(' ');
    const brandPrices = priceMap[brandName] || {};
    let price = brandPrices[modelSlug] || priceMap['*'][modelSlug] || null;
    const title = slug.replace(/-/g, ' ').replace(/\b\w/g, s => s.toUpperCase());
    const description = type === 'ct' ? 'CT device content entry' : 'MRI device content entry';
    const tags = [type + '-scanner', prefix];
    const now = new Date().toISOString().slice(0, 10);
    const canonicalBase = type === 'ct' ? '/devices/ct-scanners/' : '/devices/mri-scanners/';
    const image = `/images/devices/${slug}.webp`;
    if (!price) price = findPriceBySearch(pricesText, modelName);
    return {
      title,
      description,
      tags,
      publishedAt: now,
      updatedAt: now,
      author: 'Editorial Team',
      seo: {
        title,
        description,
        keywords: type.toUpperCase() + ', ' + title,
        canonical: canonicalBase + slug,
        image
      },
      price,
      featuresNote: type === 'ct' ? 'This CT entry includes operational context notes.' : 'This MRI entry includes operational context notes.',
      specsNote: 'Structured specifications remain authoritative in DB.',
      body: ''
    };
  }
  ctSlugs.forEach(slug => writeMd(outDir, slug, payloadFor(slug, 'ct')));
  mriSlugs.forEach(slug => writeMd(outDir, slug, payloadFor(slug, 'mri')));
}
main();
