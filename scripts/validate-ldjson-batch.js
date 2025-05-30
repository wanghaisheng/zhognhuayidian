const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const xml2js = require('xml2js');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf-8'));
const baseDir = path.dirname(__dirname);
const ldjsonRoot = path.join(__dirname, 'ldjson');
const locales = ['', 'fr', 'zh', 'es', 'de'];

function parseSitemapXml(sitemapPath) {
  if (!fs.existsSync(sitemapPath)) return [];
  const xml = fs.readFileSync(sitemapPath, 'utf-8');
  let urls = [];
  xml2js.parseString(xml, {trim: true}, (err, result) => {
    if (err) return;
    const urlset = result.urlset && result.urlset.url ? result.urlset.url : [];
    urls = urlset.map(u => {
      let loc = u.loc[0];
      let rel = loc.replace(config.baseUrl, '').replace(/^\//, '');
      if (!rel.endsWith('.html')) rel += '.html';
      return rel;
    });
  });
  return urls;
}

function listAllHtmlFiles(dir) {
  let files = [];
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      files = files.concat(listAllHtmlFiles(filePath));
    } else if (file.endsWith('.html')) {
      files.push(path.relative(baseDir, filePath).replace(/\\/g, '/'));
    }
  });
  return files;
}

function getAllHtmlPages() {
  const sitemapPages = parseSitemapXml(path.join(baseDir, 'sitemap.xml'));
  let allPages = new Set(sitemapPages);
  // 递归扫描所有 html 文件
  locales.forEach(locale => {
    const localeDir = path.join(baseDir, locale);
    if (fs.existsSync(localeDir)) {
      listAllHtmlFiles(localeDir).forEach(p => allPages.add(p));
    }
  });
  // 根目录 html
  listAllHtmlFiles(baseDir).forEach(p => allPages.add(p));
  return Array.from(allPages);
}

function extractLangAndPageName(relPath) {
  const parts = relPath.split('/');
  let lang = '';
  let pageName = '';
  if (parts.length === 2 && locales.includes(parts[0])) {
    lang = parts[0];
    pageName = path.basename(parts[1], '.html').toLowerCase();
  } else {
    lang = config.defaultLang || 'en';
    pageName = path.basename(parts[parts.length - 1], '.html').toLowerCase();
  }
  return {lang, pageName};
}

function analyzePageType(html, relPath) {
  const lower = relPath.toLowerCase();
  if (/<article/i.test(html) || lower.includes('/blog/') || lower.includes('/posts/')) return 'article';
  if (/<div[^>]*class=["'][^"']*faq-question[^"']*["'][^>]*>/i.test(html) || lower.includes('faq')) return 'faqpage';
  if (lower.includes('product')) return 'product';
  if (lower.includes('game')) return 'game';
  if (lower.includes('about')) return 'about';
  return 'app';
}

function extractPageData(html) {
  const $ = cheerio.load(html);
  const title = $('title').text() || '';
  const author = $('meta[name="author"]').attr('content') || '';
  const image = $('meta[property="og:image"]').attr('content') || '';
  const desc = $('meta[name="description"]').attr('content') || '';
  const rating = $('meta[itemprop="ratingValue"]').attr('content') || '';
  return {title, author, image, desc, rating};
}

function extractFAQ(html) {
  const $ = cheerio.load(html);
  let faqs = [];
  $('.faq-question').each((i, el) => {
    const q = $(el).text().trim();
    const a = $(el).next('.faq-answer').text().trim();
    if (q && a) faqs.push({question: q, answer: a});
  });
  return faqs;
}

function genSchemas(type, data, lang) {
  const schemas = [];
  if (type === 'article') {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": data.title,
      "author": {"@type": "Person", "name": data.author},
      "image": data.image,
      "description": data.desc,
      "inLanguage": lang,
      "datePublished": "",
      "dateModified": ""
    });
  }
  if (type === 'faqpage') {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": data.faqs.map(f => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": {"@type": "Answer", "text": f.answer}
      })),
      "inLanguage": lang
    });
  }
  if (type === 'product') {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Product",
      "name": data.title,
      "description": data.desc,
      "image": data.image,
      "aggregateRating": data.rating ? {"@type": "AggregateRating", "ratingValue": data.rating} : undefined,
      "inLanguage": lang
    });
  }
  if (type === 'app' || type === 'about') {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": config.website?.name || config.business?.name || data.title,
      "url": config.baseUrl,
      "inLanguage": lang
    });
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": config.business?.name || data.title,
      "url": config.baseUrl,
      "logo": config.business?.image || data.image,
      "contactPoint": [{"@type": "ContactPoint", "email": config.email || "", "contactType": "customer support"}],
      "inLanguage": lang
    });
  }
  // 通用面包屑
  schemas.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type": "ListItem", "position": 1, "name": "Home", "item": config.baseUrl},
      {"@type": "ListItem", "position": 2, "name": data.title, "item": config.baseUrl + '/' + data.title}
    ],
    "inLanguage": lang
  });
  return schemas;
}

function saveSchemas(schemas, outDir) {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive: true});
  schemas.forEach(schema => {
    const type = schema['@type'].toLowerCase();
    fs.writeFileSync(path.join(outDir, `${type}.json`), JSON.stringify(schema, null, 2), 'utf-8');
  });
}

function main() {
  const pages = getAllHtmlPages();
  pages.forEach(relPath => {
    const absPath = path.join(baseDir, relPath);
    if (!fs.existsSync(absPath)) return;
    const html = fs.readFileSync(absPath, 'utf-8');
    const {lang, pageName} = extractLangAndPageName(relPath);
    const type = analyzePageType(html, relPath);
    const data = extractPageData(html);
    if (type === 'faqpage') data.faqs = extractFAQ(html);
    const schemas = genSchemas(type, data, lang);
    const outDir = path.join(ldjsonRoot, pageName);
    saveSchemas(schemas, outDir);
    console.log(`Generated ld+json for ${relPath} -> ${outDir}`);
  });
}

if (require.main === module) main();