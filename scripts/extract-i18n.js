const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Load urls-full.json
const urlsFullPath = path.join(__dirname, 'urls-full.json');
const urlsData = JSON.parse(fs.readFileSync(urlsFullPath, 'utf8'));
const urls = urlsData.urls;

// Helper to get local HTML path from URL path
function urlToHtmlPath(urlPath) {
  if (urlPath === '/' || urlPath === '' || urlPath === '/index.html') return 'index.html';
  // Remove leading slash
  let cleanPath = urlPath.replace(/^\//, '');
  // If already ends with .html, use as is, else add .html
  if (!cleanPath.endsWith('.html')) cleanPath += '.html';
  return cleanPath;
}

// Helper to parse language and page path from URL path, with defaultLang logic
function parseLangAndPageWithDefault(urlPath, defaultLang) {
  const parts = urlPath.split('/').filter(Boolean); // remove empty
  let lang = null;
  let pagePath = urlPath;

  if (parts.length > 0 && (parts[0] === 'zh' || parts[0] === 'en')) {
    lang = parts[0];
    pagePath = '/' + parts.slice(1).join('/');
    if (!pagePath || pagePath === '/') pagePath = '/index.html';
  } else {
    lang = defaultLang;
    pagePath = urlPath;
  }

  // Special handling for root and index.html
  if (urlPath === '/' || urlPath === '' || urlPath === `/${defaultLang}` || urlPath === '/index.html') {
    lang = defaultLang;
    pagePath = '/index.html';
  }
  if (urlPath === '/zh' || urlPath === '/zh/index.html') {
    lang = 'zh';
    pagePath = '/index.html';
  }
  return { lang, pagePath };
}

// Helper to get the path part from a full URL
function getPathFromUrl(fullUrl) {
  // e.g. https://visionboard.heymanifestation.com/app/home -> /app/home
  const url = new URL(fullUrl);
  return url.pathname;
}

const defaultLang = urlsData.defaultLang || 'en';

// Now process all URLs, supporting language-prefixed ones and defaultLang for root
urls.forEach(fullUrl => {
  const urlPath = getPathFromUrl(fullUrl);
  const { lang, pagePath } = parseLangAndPageWithDefault(urlPath, defaultLang);
  if (!lang) return;

  const htmlFile = urlToHtmlPath(pagePath);
  const htmlPath = path.join(__dirname, '..', htmlFile);
  const outputPath = (function() {
    if (pagePath === '/index.html') {
      return path.join('..', 'locale', lang, 'index.json');
    }
    let cleanPath = pagePath.replace(/^\//, '');
    if (cleanPath.endsWith('.html')) cleanPath = cleanPath.slice(0, -5); // remove .html
    return path.join('..', 'locale', lang, cleanPath + '.json');
  })();

  if (!fs.existsSync(htmlPath)) {
    console.warn('HTML file not found:', htmlPath);
    return;
  }

  // Read and extract i18n keys as before
  const html = fs.readFileSync(htmlPath, 'utf8');
  const $ = cheerio.load(html);
  const i18nKeys = {};

  $('[data-i18n]').each((_, el) => {
    const key = $(el).attr('data-i18n');
    let value = $(el).text().trim();
    if (!value) value = $(el).attr('placeholder') || $(el).attr('title') || '';
    i18nKeys[key] = value;
  });

  $('[data-i18n-placeholder]').each((_, el) => {
    const key = $(el).attr('data-i18n-placeholder');
    const value = $(el).attr('placeholder') || '';
    i18nKeys[key] = value;
  });

  $('[data-i18n-title]').each((_, el) => {
    const key = $(el).attr('data-i18n-title');
    const value = $(el).attr('title') || '';
    i18nKeys[key] = value;
  });

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(i18nKeys, null, 2), 'utf8');
  console.log(`[${lang}] Extracted i18n keys to`, outputPath);
});
