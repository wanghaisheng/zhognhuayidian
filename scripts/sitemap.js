const fs = require('fs');
const path = require('path');

// Load and validate config.json
const configPath = path.resolve(__dirname, 'config.json');
let config;
try {
    const configData = fs.readFileSync(configPath, 'utf-8');
    config = JSON.parse(configData);
} catch (error) {
    console.error('Error reading or parsing config.json:', error.message);
    process.exit(1);
}

// ========== 融合方案：多语言 json 配置驱动 + 静态 html 文件检测 ==========
// 1. 只检测 locale/ 下的 json 文件，自动生成所有语言前缀
// 2. 只检测 app/ 目录下实际存在的 html 页面（无需多语言物理目录）
// 3. 首页只保留 / 和 /zh（等多语言前缀），不输出 /index.html
// 4. 其它静态页面（如 privacy, terms, intro-en 等）自动收录多语言版本

const localeDir = path.resolve(__dirname, `../${config.localepath || 'locale'}`);
let locales = ['']; // 默认无 locale
try {
    if (fs.existsSync(localeDir)) {
        const detectedLocaleDirs = fs.readdirSync(localeDir)
            .filter(f => fs.statSync(path.join(localeDir, f)).isDirectory());
        locales = [''].concat(detectedLocaleDirs); // Correctly gets ['','en','zh'] etc.
    }
} catch (e) {
    console.warn('Warning: Unable to read locale directory for i18n detection:', e.message);
}

const baseDir = path.dirname(__dirname);

// ========== 修正：彻底杜绝绝对路径拼接 & 首页与默认语言映射 ==========
// 1. 只用相对路径拼接 URL，绝不拼接物理绝对路径（如 D:\...）
// 2. config.defaultLang 作为默认首页语言，/ 映射到 /en（如 defaultLang=en）
// 3. 首页只输出 /（等价于 /en），/zh，/index.html 不输出
// 4. 其它静态页面自动收录多语言版本

const appDir = path.join(baseDir, 'app');
const appPages = fs.existsSync(appDir)
    ? fs.readdirSync(appDir).filter(f => f.endsWith('.html'))
    : [];
const staticPages = fs.readdirSync(baseDir)
    .filter(f => f.endsWith('.html'));

const defaultLang = config.defaultLang || 'en';
const urlMap = new Map();
const currentDate = new Date().toISOString().split('T')[0];

locales.forEach(locale => {
    const prefix = locale ? `/${locale}` : '';
    // app 目录页面
    appPages.forEach(page => {
        const pageName = page.replace(/\.html$/, '');
        if (pageName === 'index') {
            // 首页映射：如果 locale==defaultLang 或 locale==''，都映射到 /
            if (locale === defaultLang || (!locale && defaultLang === 'en')) {
                urlMap.set('/', {
                    loc: '/',
                    lastmod: getLastModifiedDate(path.join(appDir, 'index.html')),
                    changefreq: 'daily',
                    priority: '1.0',
                });
            } else {
                urlMap.set(prefix, {
                    loc: prefix,
                    lastmod: getLastModifiedDate(path.join(appDir, 'index.html')),
                    changefreq: 'daily',
                    priority: '1.0',
                });
            }
        } else {
            // 只输出无前缀版本（默认语言），其它语言输出带前缀
            if (locale === defaultLang || (!locale && defaultLang === 'en')) {
                urlMap.set(`/app/${pageName}`.replace(/\/+/g, '/'), {
                    loc: `/app/${pageName}`.replace(/\/+/g, '/'),
                    lastmod: getLastModifiedDate(path.join(appDir, page)),
                    changefreq: 'weekly',
                    priority: '0.9',
                });
            } else if (locale) {
                urlMap.set(`${prefix}/app/${pageName}`.replace(/\/+/g, '/'), {
                    loc: `${prefix}/app/${pageName}`.replace(/\/+/g, '/'),
                    lastmod: getLastModifiedDate(path.join(appDir, page)),
                    changefreq: 'weekly',
                    priority: '0.9',
                });
            }
        }
    });
    // 根目录静态页面
    staticPages.forEach(page => {
        if (page === 'index.html') return; // 首页已处理
        const pageName = page.replace(/\.html$/, '');
        if (locale === defaultLang || (!locale && defaultLang === 'en')) {
            urlMap.set(`/${pageName}`.replace(/\/+/g, '/'), {
                loc: `/${pageName}`.replace(/\/+/g, '/'),
                lastmod: getLastModifiedDate(path.join(baseDir, page)),
                changefreq: 'weekly',
                priority: '0.9',
            });
        } else if (locale) {
            urlMap.set(`${prefix}/${pageName}`.replace(/\/+/g, '/'), {
                loc: `${prefix}/${pageName}`.replace(/\/+/g, '/'),
                lastmod: getLastModifiedDate(path.join(baseDir, page)),
                changefreq: 'weekly',
                priority: '0.9',
            });
        }
    });
});

// 移除 /index.html, /en/index.html, /zh/index.html
['', ...locales].forEach(locale => {
    const idx = locale ? `/${locale}/index.html` : '/index.html';
    urlMap.delete(idx);
});

// ========== 保证首页只输出 /（等价于 /en）、/zh ==========
if (!urlMap.has('/')) {
    urlMap.set('/', {
        loc: '/',
        lastmod: currentDate,
        changefreq: 'daily',
        priority: '1.0'
    });
}
locales.forEach(locale => {
    if (!locale || locale === defaultLang) return;
    const homepage = `/${locale}`;
    if (!urlMap.has(homepage)) {
        urlMap.set(homepage, {
            loc: homepage,
            lastmod: currentDate,
            changefreq: 'daily',
            priority: '1.0'
        });
    }
});

// ========== 保持 sitemap/robots/urls.csv 生成逻辑不变 ==========

const baseUrl = config.baseUrl || 'https://default-url.com';
const ignoreFolders = ['node_modules','template', 'assets', 'temp','docs'];

function getLastModifiedDate(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return stats.mtime.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    } catch (error) {
        return new Date().toISOString().split('T')[0]; // Use current date if error
    }
}

// Convert Map to array
const sitemap = Array.from(urlMap.values());

// 生成 urls.json
const urlsOnly = sitemap.map(item => item.loc)
  .map(url => url.replace(/\/+/g, '/'))
  .filter((url, idx, arr) => {
    // 只保留 /，不保留 /index 或 /index.html
    if (url === '/index' || url === '/index.html') return false;
    // 多语言下 /en/index.html 也过滤
    if (/^\/[a-z]{2,}(\/)?index(\.html)?$/.test(url)) return false;
    // 保证 / 只出现一次
    if (url === '/' && arr.indexOf('/') !== idx) return false;
    return true;
  });

// ========== 修正 urls.json 中 langs 不再包含空字符串 ==========
const langsNoEmpty = locales.filter(l => l && l.trim());

const urlsJson = {
  defaultLang,
  langs: langsNoEmpty,
  urls: urlsOnly.map(url => url === '' ? '/' : url)
};
fs.writeFileSync(path.resolve(__dirname, 'urls.json'), JSON.stringify(urlsJson, null, 2));

// Generate XML with proper formatting and lastmod dates
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap.map(item => {
    const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
    const cleanLoc = item.loc === '/' ? '' : item.loc;
    
    return `    <url>
        <loc>${cleanBaseUrl}${cleanLoc}</loc>
        <lastmod>${item.lastmod}</lastmod>
        <changefreq>${item.changefreq}</changefreq>
        <priority>${item.priority}</priority>
    </url>`;
}).join('\n')}
</urlset>`;

// Always overwrite sitemap.xml
const sitemapPath = path.join(path.dirname(__dirname), 'sitemap.xml');
fs.writeFileSync(sitemapPath, sitemapXml);
console.log(`Sitemap has been generated and saved to ${sitemapPath}`);

const robotsbasePath = path.dirname(__dirname);

// Always generate robots.txt (overwrite if exists)
// Modify the robots.txt generation part
const robotsContent = [];

// Add allowed bots
if (config.robots?.allowedBots) {
    config.robots.allowedBots.forEach(bot => {
        robotsContent.push(`User-agent: ${bot}`);
    });
    robotsContent.push('Allow: /\n');
}

// Add blocked bots
if (config.robots?.blockedBots) {
    config.robots.blockedBots.forEach(bot => {
        robotsContent.push(`User-agent: ${bot}`);
    });
    robotsContent.push('Disallow: /\n');
}

// --- AI Scraper bots special handling ---
const aiRobotsPath = path.join(__dirname, 'ai-robots.txt');
let aiBots = [];
if (fs.existsSync(aiRobotsPath)) {
    const aiLines = fs.readFileSync(aiRobotsPath, 'utf-8').split(/\r?\n/);
    aiBots = aiLines
        .map(line => line.trim())
        .filter(line => line.toLowerCase().startsWith('user-agent:'))
        .map(line => line.split(':')[1].trim())
        .filter(Boolean);
}
// 获取 config 里已允许的 bot（忽略大小写）
const allowedBotsSet = new Set(
    (config.robots?.allowedBots || []).map(bot => bot.toLowerCase())
);
if (aiBots.length > 0) {
    aiBots.forEach(bot => {
        if (allowedBotsSet.has(bot.toLowerCase())) return; // 如果已允许则跳过
        robotsContent.push(`User-agent: ${bot}`);
        // 多语言 llms.txt 允许
        locales.forEach(locale => {
            if (!locale || locale === defaultLang) {
                robotsContent.push('Allow: /llms.txt');
            } else {
                robotsContent.push(`Allow: /llms-${locale}.txt`);
            }
        });
        robotsContent.push('Disallow: /\n');
    });
}
// --- End AI Scraper bots special handling ---

// Add general rules
robotsContent.push('User-agent: *');
if (config.robots?.allowedPaths) {
    config.robots.allowedPaths.forEach(path => {
        robotsContent.push(`Allow: ${path}`);
    });
}
// 新增：blockedPaths 支持
if (config.robots?.blockedPaths) {
    config.robots.blockedPaths.forEach(path => {
        robotsContent.push(`Disallow: ${path}`);
    });
}
// Add sitemap
robotsContent.push(`Sitemap: ${baseUrl}/sitemap.xml`);

// Write robots.txt
const robotsPath = path.join(robotsbasePath, 'robots.txt');
fs.writeFileSync(robotsPath, robotsContent.join('\n'));
console.log(`robots.txt has been ${fs.existsSync(robotsPath) ? 'overwritten' : 'generated'} at ${robotsPath}`);

// 补全所有 index.html 路径（如 /index.html, /zh/index.html）
const indexVariants = urlsOnly
  .filter(url => url === '/' || /^\/[a-z]{2}\/?$/.test(url))
  .map(url => url.replace(/\/$/, '') + '/index.html');
const urlsOnlyFull = Array.from(new Set([...urlsOnly, ...indexVariants]));

// 生成带多语言和默认语言的结构
const urlsJsonFull = {
  defaultLang: config.defaultLang || 'en',
  langs: locales.sort((a, b) => a.localeCompare(b)),
  urls: urlsOnlyFull.map(url => `${baseUrl}${url}`)
};
const urlsJsonPath = path.join(__dirname, 'urls-full.json');
fs.writeFileSync(urlsJsonPath, JSON.stringify(urlsJsonFull, null, 2));
console.log(`Found URLs have been saved to ${urlsJsonPath}`);

// Generate CSV with lastmod dates
const csvContent = ['URL,Lastmod,Changefreq,Priority']
    .concat(sitemap.map(item => `${baseUrl}${item.loc},${item.lastmod},${item.changefreq},${item.priority}`))
    .join('\n');

// Always overwrite urls.csv
const csvPath = path.join(__dirname, 'urls.csv');
fs.writeFileSync(csvPath, csvContent);
console.log(`Found URLs have been saved to ${csvPath}`);
