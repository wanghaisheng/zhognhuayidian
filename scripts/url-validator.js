const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const https = require('https');

class URLValidator {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.errors = [];
        this.warnings = [];
        this.checkedUrls = new Set();
    }

    async validateURL(url) {
        if (this.checkedUrls.has(url)) return;
        this.checkedUrls.add(url);

        return new Promise((resolve) => {
            const request = https.get(url, (response) => {
                // 检查重定向
                if (response.statusCode >= 300 && response.statusCode < 400) {
                    this.warnings.push(`网页会自动重定向: ${url} -> ${response.headers.location}`);
                }
                // 检查 404
                else if (response.statusCode === 404) {
                    this.errors.push(`未找到(404): ${url}`);
                }
                // 检查服务器错误
                else if (response.statusCode >= 500) {
                    this.errors.push(`服务器错误: ${url} (${response.statusCode})`);
                }
                // 检查 noindex 标记
                const robotsHeader = response.headers['x-robots-tag'];
                if (robotsHeader && robotsHeader.includes('noindex')) {
                    this.warnings.push(`页面包含 noindex 标记: ${url}`);
                }

                resolve();
            });

            request.on('error', (error) => {
                this.errors.push(`无法访问页面: ${url} (${error.message})`);
                resolve();
            });

            request.setTimeout(5000, () => {
                this.errors.push(`页面响应超时: ${url}`);
                request.destroy();
                resolve();
            });
        });
    }

    async validateHTML(filePath) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const $ = cheerio.load(content);
        const relativePath = path.relative(process.cwd(), filePath);

        // 检查重要的 meta 标签
        if (!$('meta[name="robots"]').length) {
            this.warnings.push(`${relativePath}: 缺少 robots meta 标签`);
        }

        // 检查规范链接
        const canonical = $('link[rel="canonical"]');
        if (!canonical.length) {
            this.warnings.push(`${relativePath}: 缺少规范链接标签`);
        } else {
            const canonicalHref = canonical.attr('href');
            if (!canonicalHref.startsWith(this.baseUrl)) {
                this.warnings.push(`${relativePath}: 规范链接不匹配当前域名`);
            }
        }

        // 检查所有链接
        const links = new Set();
        $('a[href]').each((_, element) => {
            const href = $(element).attr('href');
            if (href.startsWith('/') || href.startsWith(this.baseUrl)) {
                links.add(href.startsWith('/') ? `${this.baseUrl}${href}` : href);
            }
        });

        // 验证所有内部链接
        for (const link of links) {
            await this.validateURL(link);
        }
    }

    async validateDirectory(dir) {
        const htmlFiles = this.findHtmlFiles(dir);
        for (const file of htmlFiles) {
            await this.validateHTML(file);
        }

        // 检查必要的文件
        const requiredFiles = ['robots.txt', 'sitemap.xml'];
        for (const file of requiredFiles) {
            const filePath = path.join(dir, file);
            if (!fs.existsSync(filePath)) {
                this.errors.push(`缺少必要文件: ${file}`);
            }
        }

        return {
            errors: this.errors,
            warnings: this.warnings,
            success: this.errors.length === 0
        };
    }

    findHtmlFiles(dir) {
        // ... 保持原有的 findHtmlFiles 实现 ...
    }
}

module.exports = URLValidator;