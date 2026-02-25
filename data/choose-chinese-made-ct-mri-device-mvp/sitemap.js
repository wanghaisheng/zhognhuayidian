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

const locales = ['', 'fr', 'zh', 'es', 'de'];
const baseDir = path.join(__dirname, '/');
const baseUrl = config.baseUrl || 'https://default-url.com';
const ignoreFolders = ['node_modules', 'assets', 'temp'];

function listHtmlFiles(dir) {
    return fs.readdirSync(dir).reduce((files, file) => {
        const filePath = path.join(dir, file);
        const isDirectory = fs.statSync(filePath).isDirectory();
        if (isDirectory && ignoreFolders.includes(file)) {
            return files;
        }
        if (isDirectory) {
            return files.concat(listHtmlFiles(filePath));
        }
        if (path.extname(file) === '.html') {
            return files.concat([filePath]);
        }
        return files;
    }, []);
}

const allHtmlFiles = locales.flatMap(locale => {
    const localeDir = path.join(baseDir, locale);
    if (!fs.existsSync(localeDir)) return [];
    return listHtmlFiles(localeDir).map(file =>
        path.join(locale, path.relative(localeDir, file)).replace(/\\+/g, '/')
    );
});

const uniqueUrls = Array.from(new Set(allHtmlFiles));

const sitemap = [
    { loc: '/', changefreq: 'daily', priority: '1.0' },
    ...uniqueUrls.map(file => {
        const fileWithoutExtension = file.replace('.html', '');
        const loc = fileWithoutExtension.endsWith('index')
            ? `/${fileWithoutExtension.split('/').slice(0, -1).join('/')}`
            : `/${fileWithoutExtension}`;
        return {
            loc,
            changefreq: 'weekly',
            priority: '0.9',
        };
    })
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitemap.map(item => `    <url>
        <loc>${baseUrl}${item.loc}</loc>
        <changefreq>${item.changefreq}</changefreq>
        <priority>${item.priority}</priority>
    </url>`).join('\n')}
</urlset>`;

fs.writeFileSync('sitemap.xml', sitemapXml);
console.log('Sitemap has been generated and saved to sitemap.xml');

const csvContent = ['URL,Changefreq,Priority']
    .concat(sitemap.map(item => `${baseUrl}${item.loc},${item.changefreq},${item.priority}`))
    .join('\n');

fs.writeFileSync('urls.csv', csvContent);
console.log('Found URLs have been saved to urls.csv');
