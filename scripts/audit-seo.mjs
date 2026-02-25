import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const args = new Set(process.argv.slice(2));
const strict = args.has('--strict');

const DIST_DIR = path.resolve('dist/client');

// Ensure dist exists
if (!fs.existsSync(DIST_DIR)) {
  console.log('dist directory not found. Running npm run build...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
  } catch (e) {
    console.error('Build failed.');
    process.exit(1);
  }
}

const SITEMAPS_DIR = DIST_DIR;
const INDEX_HTML_PATH = path.join(DIST_DIR, 'index.html');
const MANIFEST_PATH = path.join(DIST_DIR, 'manifest.json');
const ROBOTS_PATH = path.join(DIST_DIR, 'robots.txt');
const SITEMAP_INDEX_PATH = path.join(DIST_DIR, 'sitemap.xml');
const LLMS_PATH = path.join(DIST_DIR, 'llms.txt');

// Pearl Coach 项目特定的路径配置
const SEO_COMPONENT_PATHS = [
  path.resolve('components/SEOHead.tsx'),
  path.resolve('components/DefaultSEO.tsx'),
  path.resolve('components/SEO.tsx'),
];
const SEO_UTIL_PATH = path.resolve('src/utils/seo.ts');
const SITE_CONFIG_PATH = path.resolve('src/config/site.ts');
const LANGUAGE_CONFIG_PATH = path.resolve('src/config/language.ts');
const EXPECTED_DOMAIN = (process.env.SITE_URL ? String(process.env.SITE_URL) : 'https://chinactscanner.org').replace(/\/+$/, '');
const REDIRECT_FILES = [
  path.join(DIST_DIR, '_redirects'),
  path.join(DIST_DIR, 'redirects'),
  path.join(DIST_DIR, 'f_redirects'),
];

const readText = (filePath) => {
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, 'utf8');
};

const readJson = (filePath) => {
  const raw = readText(filePath);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const parseXmlLocs = (xml) => {
  const locs = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let match;
  while ((match = re.exec(xml)) !== null) {
    locs.push(String(match[1]).trim());
  }
  return locs;
};

const extractDomainFromSiteConfig = (tsSource) => {
  if (!tsSource) return null;
  return EXPECTED_DOMAIN;
};

const stripComments = (source) => {
  if (!source) return '';
  const withoutBlock = source.replace(/\/\*[\s\S]*?\*\//g, '');
  return withoutBlock.replace(/^\s*\/\/.*$/gm, '');
};

const parseLanguageConfigs = (tsSource) => {
  if (!tsSource) return [];
  const clean = stripComments(tsSource);
  const arrayMatch = clean.match(/export\s+const\s+LANGUAGES\s*=\s*\[([\s\S]*?)\]\s*;/);
  if (!arrayMatch) return [];
  const raw = arrayMatch[1];
  const objects = raw.match(/\{[\s\S]*?\}/g) || [];
  const langs = [];
  for (const obj of objects) {
    const codeMatch = obj.match(/code:\s*['"]([^'"]+)['"]/);
    if (!codeMatch) continue;
    const prefixMatch = obj.match(/prefix:\s*['"]([^'"]*)['"]/);
    const hreflangMatch = obj.match(/hreflang:\s*['"]([^'"]+)['"]/);
    langs.push({
      code: String(codeMatch[1]).trim(),
      prefix: prefixMatch ? String(prefixMatch[1]).trim() : '',
      hreflang: hreflangMatch ? String(hreflangMatch[1]).trim() : null,
    });
  }
  return langs;
};

const normalizeHreflang = (code, hreflang) => {
  if (code === 'en') return 'en';
  if (code === 'zh') return 'zh-Hans';
  return hreflang || code;
};

const extractLocalesFromLanguageConfig = (tsSource) => {
  const languages = parseLanguageConfigs(tsSource);
  if (languages.length === 0) return { defaultLocale: null, locales: [], hreflangByCode: {} };
  const defaultLang = languages.find((l) => l.prefix === '') || languages[0];
  const locales = languages.map((l) => l.code);
  const hreflangByCode = Object.fromEntries(
    languages.map((l) => [l.code, normalizeHreflang(l.code, l.hreflang)])
  );
  return { defaultLocale: defaultLang?.code || null, locales, hreflangByCode };
};

const normalizeDomain = (input) => String(input || '').trim().replace(/\/$/, '');

const stripDomain = (url, expectedDomain) => {
  const u = String(url || '').trim();
  if (!expectedDomain) return u;
  if (u === expectedDomain) return '/';
  if (u.startsWith(`${expectedDomain}/`)) return `/${u.slice((expectedDomain + '/').length)}`;
  return u;
};

const normalizePath = (p) => {
  const raw = String(p || '').trim();
  if (!raw) return '/';
  if (/^https?:\/\//.test(raw)) return raw;
  if (!raw.startsWith('/')) return `/${raw}`;
  return raw;
};

const parseRedirectRules = (text) => {
  if (!text) return [];
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'));

  const rules = [];
  for (const line of lines) {
    const parts = line.split(/\s+/).filter(Boolean);
    if (parts.length < 3) continue;
    const from = normalizePath(parts[0]);
    const to = normalizePath(parts[1]);
    const status = Number(parts[2]);
    if (!Number.isFinite(status)) continue;
    rules.push({ from, to, status });
  }
  return rules;
};

const parseHtmlCanonical = (html) => {
  if (!html) return null;
  const re = /<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']([^"']+)["'][^>]*>/i;
  const m = html.match(re);
  return m ? String(m[1]).trim() : null;
};

const parseHtmlCanonicals = (html) => {
  if (!html) return [];
  const re = /<link\b[^>]*\brel=["']canonical["'][^>]*>/gi;
  const tags = String(html).match(re) || [];
  const hrefRe = /\bhref=["']([^"']+)["']/i;
  return tags
    .map((tag) => {
      const m = String(tag).match(hrefRe);
      return m ? String(m[1]).trim() : null;
    })
    .filter(Boolean);
};

const parseHtmlHreflangLinks = (html) => {
  if (!html) return [];
  const re = /<link\b[^>]*\brel=["']alternate["'][^>]*>/gi;
  const tags = String(html).match(re) || [];
  return tags
    .map((tag) => {
      const href = String(tag).match(/\bhref=["']([^"']+)["']/i)?.[1];
      const hreflang = String(tag).match(/\bhreflang=["']([^"']+)["']/i)?.[1];
      if (!href || !hreflang) return null;
      return { href: String(href).trim(), hreflang: String(hreflang).trim() };
    })
    .filter(Boolean);
};

const parseHtmlTitle = (html) => {
  if (!html) return null;
  const m = String(html).match(/<title[^>]*>([^<]*)<\/title>/i);
  return m ? String(m[1]).trim() : null;
};

const parseHtmlMetaContent = (html, name) => {
  if (!html) return null;
  const safe = String(name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`<meta\\b[^>]*(?:name|property)=["']${safe}["'][^>]*content=["']([^"']+)["'][^>]*>`, 'i');
  const m = String(html).match(re);
  return m ? String(m[1]).trim() : null;
};

const hasJsonLd = (html) => {
  if (!html) return false;
  return /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>/i.test(String(html));
};

const countMissingImgAlt = (html) => {
  if (!html) return 0;
  const src = String(html);
  const imgTags = src.match(/<img\b[^>]*>/gi) || [];
  let missing = 0;
  for (const tag of imgTags) {
    // Skip images marked as decorative (aria-hidden="true")
    if (/aria-hidden=["']true["']/i.test(tag)) continue;

    if (!/\balt=/.test(tag)) missing += 1;
    else {
      const m = tag.match(/\balt=["']([^"']*)["']/i);
      if (!m || String(m[1]).trim().length === 0) missing += 1;
    }
  }
  return missing;
};

const isZhRoute = (routePath) => /^\/zh(\/|$)/.test(String(routePath || ''));

const checkTextLength = ({ kind, text, isZh, rel }) => {
  const value = String(text || '').trim();
  if (!value) return { level: 'missing' };

  const len = value.length;
  if (kind === 'title') {
    if (isZh) {
      if (len < 15) return { level: 'warn', msg: `Title 过短（建议 20-30 字符）：dist/${rel}` };
      if (len > 35) return { level: 'warn', msg: `Title 过长（建议 20-30 字符）：dist/${rel}` };
    } else {
      if (len < 30) return { level: 'warn', msg: `Title 过短（建议 50-60 chars）：dist/${rel}` };
      if (len > 70) return { level: 'warn', msg: `Title 过长（建议 50-60 chars）：dist/${rel}` };
    }
  }

  if (kind === 'description') {
    if (isZh) {
      if (len < 50) return { level: 'warn', msg: `Description 过短（建议 70-80 字符）：dist/${rel}` };
      if (len > 120) return { level: 'warn', msg: `Description 过长（建议 70-80 字符）：dist/${rel}` };
    } else {
      if (len < 80) return { level: 'warn', msg: `Description 过短（建议 150-160 chars）：dist/${rel}` };
      if (len > 200) return { level: 'warn', msg: `Description 过长（建议 150-160 chars）：dist/${rel}` };
    }
  }
  return { level: 'ok' };
};

const isMetaRefreshRedirect = (html) => {
  if (!html) return false;
  return /<meta\b[^>]*http-equiv=["']refresh["'][^>]*content=["'][^"']*url=/i.test(String(html));
};

const report = {
  errors: [],
  warnings: [],
  infos: [],
};

const error = (msg) => report.errors.push(msg);
const warn = (msg) => report.warnings.push(msg);
const info = (msg) => report.infos.push(msg);

const main = () => {
  const siteConfigText = readText(SITE_CONFIG_PATH);
  const languageConfigText = readText(LANGUAGE_CONFIG_PATH);
  const siteDomain = extractDomainFromSiteConfig(siteConfigText);
  const { defaultLocale, locales: localesFromConfig, hreflangByCode } = extractLocalesFromLanguageConfig(languageConfigText);
  const expectedDomainFromArg = Array.from(args)
    .find((a) => a.startsWith('--domain='))
    ?.slice('--domain='.length);
  const expectedDomain = normalizeDomain(expectedDomainFromArg || siteDomain);

  if (!expectedDomain) {
    warn('无法从 src/config/site.ts 解析站点 URL，建议传入 --domain=https://example.com');
  }

  const activeDefaultLocale = defaultLocale || 'en';
  const activeLocales = localesFromConfig.length > 0 ? localesFromConfig : [activeDefaultLocale];
  const expectedHreflangs = activeLocales
    .map((code) => hreflangByCode?.[code] || normalizeHreflang(code, null))
    .filter(Boolean);
  if (expectedHreflangs.length > 0) expectedHreflangs.push('x-default');

  const robots = readText(ROBOTS_PATH);
  if (!robots) {
    error('dist/robots.txt 不存在（需由 generate-seo.mjs 生成）');
  } else {
    const sitemapLine = robots
      .split('\n')
      .map((l) => l.trim())
      .find((l) => /^Sitemap:\s+/i.test(l));
    if (!sitemapLine) {
      error('robots.txt 缺少 Sitemap: 行');
    } else if (expectedDomain && !sitemapLine.includes(`${expectedDomain}/sitemap.xml`)) {
      warn(`robots.txt 的 Sitemap: 不是 ${expectedDomain}/sitemap.xml`);
    }
  }

  const redirectRules = [];
  for (const filePath of REDIRECT_FILES) {
    const t = readText(filePath);
    if (!t) continue;
    const rules = parseRedirectRules(t);
    rules.forEach((r) => redirectRules.push({ ...r, filePath }));
  }
  const redirectOnly = redirectRules.filter((r) => [301, 302, 307, 308].includes(r.status));
  const rewriteOnly = redirectRules.filter((r) => ![301, 302, 307, 308].includes(r.status));
  if (rewriteOnly.some((r) => r.to === '/index.html')) {
    info('检测到 SPA rewrite 规则（正常）：/* -> /index.html 200');
  }
  if (activeDefaultLocale === 'en') {
    const hasEnCollapseRedirect = redirectOnly.some((r) => /^\/en(\/|$)/.test(r.from) && !/^\/en(\/|$)/.test(r.to));
    if (!hasEnCollapseRedirect) {
      warn('未检测到 /en 前缀收敛的 301/308 重定向规则（可能导致 /en/* 与 /* 重复收录）');
    }
  }

  const sitemapIndexXml = readText(SITEMAP_INDEX_PATH);
  if (!sitemapIndexXml) {
    error('dist/sitemap.xml 不存在');
  }

  const llmsText = readText(LLMS_PATH);
  if (!llmsText) {
    warn('dist/llms.txt 不存在（建议由 generate-seo.mjs 生成）');
  } else {
    if (expectedDomain && !llmsText.startsWith(`# ${expectedDomain}`)) {
      warn(`llms.txt 头部域名不是 ${expectedDomain}`);
    }
    if (activeDefaultLocale === 'en' && /https?:\/\/[\s\S]+\/en(\/|$)/.test(llmsText)) {
      warn('llms.txt 中检测到默认语言 /en 前缀链接（建议移除）');
    }
  }

  const manifest = readJson(MANIFEST_PATH);
  if (!manifest) {
    warn('dist/manifest.json 缺失或不是有效 JSON（PWA 安装可能不可用）');
  } else {
    if (!manifest.name || !manifest.short_name) warn('manifest.json 缺少 name/short_name');
    if (!manifest.start_url) warn('manifest.json 缺少 start_url');
    if (!manifest.icons || !Array.isArray(manifest.icons) || manifest.icons.length === 0) {
      warn('manifest.json 缺少 icons 数组');
    } else {
      const sizes = new Set(manifest.icons.map((i) => i?.sizes).filter(Boolean));
      if (!sizes.has('192x192')) warn('manifest.json icons 未包含 192x192');
      if (!sizes.has('512x512')) warn('manifest.json icons 未包含 512x512');
      const externalIcons = manifest.icons
        .map((i) => i?.src)
        .filter((src) => typeof src === 'string' && /^https?:\/\//.test(src));
      if (externalIcons.length > 0) {
        warn(`manifest.json icons 使用了外链资源（建议改为站内静态资源）：${externalIcons.join(', ')}`);
      }
    }
  }

  const indexHtml = readText(INDEX_HTML_PATH);
  if (!indexHtml) {
    warn('index.html 不存在（异常）');
  } else {
    if (!/<meta\s+name=["']viewport["']/.test(indexHtml)) warn('index.html 缺少 viewport meta');
    if (!/<link\s+rel=["']manifest["']/.test(indexHtml)) warn('index.html 未链接 manifest.json（缺少 rel="manifest"）');
    if (!/<meta\s+name=["']theme-color["']/.test(indexHtml)) warn('index.html 缺少 theme-color meta');
  }

  if (sitemapIndexXml && fs.existsSync(SITEMAPS_DIR)) {
    const sitemapLocs = parseXmlLocs(sitemapIndexXml);
    if (sitemapLocs.length === 0) warn('sitemap.xml 未解析到任何 <loc>');

    const expectedPrefix = expectedDomain ? `${expectedDomain}/` : null;
    const sitemapFiles = [];
    sitemapLocs.forEach((loc) => {
      if (expectedPrefix && !loc.startsWith(expectedPrefix)) {
        warn(`sitemap.xml 中的 sitemap loc 不以 ${expectedPrefix} 开头：${loc}`);
      }
      const fileName = loc.split('/').pop();
      if (!fileName) return;
      const filePath = path.join(SITEMAPS_DIR, fileName);
      sitemapFiles.push({ loc, fileName, filePath });
      if (!fs.existsSync(filePath)) {
        error(`sitemap.xml 引用的文件不存在：${fileName}`);
      }
    });

    const allPageUrls = [];
    sitemapFiles.forEach((s) => {
      const xml = readText(s.filePath);
      if (!xml) return;
      const locs = parseXmlLocs(xml);
      locs.forEach((u) => allPageUrls.push({ url: u, source: s.fileName }));
    });

    const redirectFromSet = new Set(redirectOnly.map((r) => r.from));

    const urlSet = new Set();
    const dup = new Set();
    allPageUrls.forEach(({ url }) => {
      const key = url;
      if (urlSet.has(key)) dup.add(key);
      urlSet.add(key);
    });
    if (dup.size > 0) {
      error(`sitemap 中存在重复 URL：${Array.from(dup).slice(0, 20).join(', ')}${dup.size > 20 ? '...' : ''}`);
    }

    allPageUrls.forEach(({ url, source }) => {
      if (!/^https:\/\//.test(url)) error(`非 https URL（${source}）：${url}`);
      if (expectedDomain && !url.startsWith(`${expectedDomain}/`) && url !== `${expectedDomain}`) {
        warn(`URL 不在站点主域名下（${source}）：${url}`);
      }
      if (/[?#]/.test(url)) warn(`URL 含 query/hash（${source}）：${url}`);
      if (activeDefaultLocale === 'en' && /\/en(\/|$)/.test(url)) {
        warn(`URL 含默认语言 /en 前缀（${source}）：${url}`);
      }

      const p = stripDomain(url, expectedDomain);
      const normalizedPath = normalizePath(p);
      if (redirectFromSet.has(normalizedPath) || redirectFromSet.has(`${normalizedPath}/`)) {
        error(`Sitemap 包含会自动重定向的 URL（${source}）：${url}`);
      }
    });

    const hasBlogSitemap = sitemapFiles.some((s) => s.fileName.includes('sitemap-blog'));
    const hasShowcaseSitemap = sitemapFiles.some((s) => s.fileName.includes('sitemap-showcase'));

    const containsBlogUrls = allPageUrls.some(({ url }) => /\/blog(\/|$)/.test(url) || /\/zh\/blog(\/|$)/.test(url));
    const containsShowcaseUrls = allPageUrls.some(({ url }) => /\/showcase(\/|$)/.test(url) || /\/zh\/showcase(\/|$)/.test(url));

    if (!hasBlogSitemap && containsBlogUrls) {
      warn('Sitemap Index 未包含 blog sitemap，但 sitemap 中出现 blog URL（可能违反 staged exposure）');
    }
    if (!hasShowcaseSitemap && containsShowcaseUrls) {
      warn('Sitemap Index 未包含 showcase sitemap，但 sitemap 中出现 showcase URL（可能违反 staged exposure）');
    }

    if (robots) {
      const disallowBlog = /Disallow:\s*\/blog\b/.test(robots) || /Disallow:\s*\/zh\/blog\b/.test(robots);
      if (disallowBlog && containsBlogUrls) error('robots.txt 禁止 /blog 但 sitemap 仍包含 blog URL（矛盾信号）');

      const disallowShowcase = /Disallow:\s*\/showcase\b/.test(robots) || /Disallow:\s*\/zh\/showcase\b/.test(robots);
      if (disallowShowcase && containsShowcaseUrls) error('robots.txt 禁止 /showcase 但 sitemap 仍包含 showcase URL（矛盾信号）');
    }
  } else if (sitemapIndexXml && !fs.existsSync(SITEMAPS_DIR)) {
    error('dist/ 目录不存在');
  }

  const seoComponents = SEO_COMPONENT_PATHS.map(readText).filter(Boolean);
  const seoUtil = readText(SEO_UTIL_PATH);
  if (seoComponents.length === 0 && !seoUtil) {
    warn('未找到 SEO 组件/工具（src/components/molecules/SEOHead.tsx 或 src/utils/seo.ts），无法执行 hreflang/canonical 规则检查');
  } else {
    const combined = `${seoComponents.join('\n')}\n${seoUtil || ''}`;
    if (/<meta\b[^>]*\bname=["']keywords["']/i.test(combined)) {
      warn('SEO 组件包含 meta keywords（建议移除；现代搜索引擎不使用该信号）');
    }
    if (!/hreflang\s*:\s*['"]x-default['"]/.test(combined)) {
      warn('未检测到 x-default hreflang（国际化 SEO 规范要求）');
    }
  }

  if (fs.existsSync(DIST_DIR)) {
    const htmlFiles = [];
    const walk = (dir) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) walk(full);
        else if (e.isFile() && full.endsWith('.html')) htmlFiles.push(full);
      }
    };
    walk(DIST_DIR);

    const nonIndexHtmlFiles = htmlFiles.filter((f) => path.relative(DIST_DIR, f).replace(/\\/g, '/') !== 'index.html');
    if (nonIndexHtmlFiles.length === 0) {
      warn('dist/ 中未发现多页面 HTML（可能未运行 prerender），无法全面检测 canonical 覆盖率');
    } else {
      const canonMap = new Map();
      const noCanonical = [];

      for (const filePath of htmlFiles) {
        const rel = path.relative(DIST_DIR, filePath).replace(/\\/g, '/');
        const html = readText(filePath);
        const routePath = rel === 'index.html' ? '/' : `/${rel.replace(/\/index\.html$/, '').replace(/\.html$/, '')}`;
        const isZh = isZhRoute(routePath);

        if (isMetaRefreshRedirect(html)) {
          warn(`发现 meta refresh 重定向页面（不建议收录）：dist/${rel}`);
        }
        if (/<meta\b[^>]*\bname=["']keywords["']/i.test(html || '')) {
          warn(`页面包含 meta keywords（建议移除）：dist/${rel}`);
        }
        if (/(href=["']#\/|\/#\/)/i.test(html || '')) {
          warn(`页面疑似使用 Hash 路由（URL 含 #/，对 SEO 不友好）：dist/${rel}`);
        }

        const title = parseHtmlTitle(html);
        const titleCheck = checkTextLength({ kind: 'title', text: title, isZh, rel });
        if (titleCheck.level === 'missing') warn(`页面缺少 <title>：dist/${rel}`);
        if (titleCheck.level === 'warn') warn(titleCheck.msg);

        const desc = parseHtmlMetaContent(html, 'description');
        const descCheck = checkTextLength({ kind: 'description', text: desc, isZh, rel });
        if (descCheck.level === 'missing') warn(`页面缺少 meta description：dist/${rel}`);
        if (descCheck.level === 'warn') warn(descCheck.msg);

        const ogTitle = parseHtmlMetaContent(html, 'og:title');
        const ogDesc = parseHtmlMetaContent(html, 'og:description');
        const ogImage = parseHtmlMetaContent(html, 'og:image');
        if (!ogTitle || !ogDesc || !ogImage) {
          warn(`页面 Open Graph 标签不完整（og:title/og:description/og:image）：dist/${rel}`);
        }

        const twCard = parseHtmlMetaContent(html, 'twitter:card');
        const twTitle = parseHtmlMetaContent(html, 'twitter:title');
        const twDesc = parseHtmlMetaContent(html, 'twitter:description');
        if (!twCard || !twTitle || !twDesc) {
          warn(`页面 Twitter Card 标签不完整（twitter:card/twitter:title/twitter:description）：dist/${rel}`);
        }

        if ((/\/(docs|blog)(\/|$)/.test(routePath) || /\/(pricing|about|contact)(\/|$)/.test(routePath)) && !hasJsonLd(html)) {
          warn(`页面缺少 JSON-LD 结构化数据（建议至少添加 WebPage/Article）：dist/${rel}`);
        }

        const missingAlt = countMissingImgAlt(html);
        if (missingAlt > 0) {
          warn(`页面存在缺少 alt 的图片（数量=${missingAlt}）：dist/${rel}`);
        }

        const h1Count = (html || '').match(/<h1\b/gi)?.length ?? 0;
        if (h1Count === 0) warn(`页面缺少 H1（可见性/语义弱）：dist/${rel}`);
        if (h1Count > 1) warn(`页面存在多个 H1（建议仅保留一个主标题）：dist/${rel}`);

        const canonicalList = parseHtmlCanonicals(html);
        const canonical = canonicalList[0] || null;
        if (!canonical) {
          noCanonical.push(rel);
          continue;
        }
        if (canonicalList.length > 1) {
          error(`页面存在多个 canonical 标签：dist/${rel}`);
        }

        if (expectedDomain && !canonical.startsWith(`${expectedDomain}/`) && canonical !== expectedDomain) {
          warn(`canonical 不在主域名下：dist/${rel} -> ${canonical}`);
        }

        const list = canonMap.get(canonical) || [];
        list.push(rel);
        canonMap.set(canonical, list);

        const hreflangLinks = parseHtmlHreflangLinks(html);
        if (activeLocales.length > 1 && hreflangLinks.length === 0) {
          warn(`页面缺少 hreflang 链接（多语言页面建议完整输出）：dist/${rel}`);
        }
        if (hreflangLinks.length > 0) {
          const hreflangMap = new Map();
          hreflangLinks.forEach((l) => {
            const list = hreflangMap.get(l.hreflang) || [];
            list.push(l.href);
            hreflangMap.set(l.hreflang, list);
          });
          for (const [hreflang, hrefs] of hreflangMap.entries()) {
            if (hrefs.length > 1) {
              error(`页面 hreflang 重复（${hreflang}）：dist/${rel} -> ${hrefs.slice(0, 4).join(', ')}${hrefs.length > 4 ? '...' : ''}`);
            }
          }
          if (expectedHreflangs.length > 0) {
            const missing = expectedHreflangs.filter((h) => !hreflangMap.has(h));
            if (missing.length > 0) {
              warn(`页面缺少 hreflang：dist/${rel} -> ${missing.join(', ')}`);
            }
          }
          const hrefSet = new Set(hreflangLinks.map((l) => l.href));
          if (!hrefSet.has(canonical)) {
            warn(`canonical 未包含在 hreflang 列表中：dist/${rel} -> ${canonical}`);
          }
        }

        if (expectedDomain) {
          const canonicalPath = stripDomain(canonical, expectedDomain);
          if (isZh && !/^\/zh(\/|$)/.test(canonicalPath)) {
            warn(`中文页面 canonical 未包含 /zh 前缀：dist/${rel} -> ${canonical}`);
          }
          if (!isZh && /^\/zh(\/|$)/.test(canonicalPath)) {
            warn(`非中文页面 canonical 包含 /zh 前缀：dist/${rel} -> ${canonical}`);
          }
        }
      }

      if (noCanonical.length > 0) {
        warn(`存在未声明 rel=canonical 的页面（可能触发“重复网页，用户未选定规范网页”）：${noCanonical.slice(0, 20).join(', ')}${noCanonical.length > 20 ? '...' : ''}`);
      }

      const duplicateCanonicals = [];
      for (const [canonical, pages] of canonMap.entries()) {
        if (pages.length <= 1) continue;
        duplicateCanonicals.push({ canonical, pages });
      }
      if (duplicateCanonicals.length > 0) {
        const sample = duplicateCanonicals.slice(0, 10).map((d) => `${d.canonical} <= ${d.pages.slice(0, 4).join(', ')}${d.pages.length > 4 ? '...' : ''}`);
        warn(`多个页面共享同一个 canonical（可能触发重复内容归类）：${sample.join(' | ')}${duplicateCanonicals.length > 10 ? '...' : ''}`);
      }
    }
  }

  info(`errors=${report.errors.length} warnings=${report.warnings.length}`);

  if (report.infos.length > 0) {
    console.log('ℹ️ SEO Audit');
    report.infos.forEach((m) => console.log(` - ${m}`));
  }

  if (report.warnings.length > 0) {
    console.log('⚠️ Warnings');
    report.warnings.forEach((m) => console.log(` - ${m}`));
  }

  if (report.errors.length > 0) {
    console.error('🚩 Errors');
    report.errors.forEach((m) => console.error(` - ${m}`));
    process.exitCode = 1;
  } else if (strict && report.warnings.length > 0) {
    process.exitCode = 1;
  } else {
    console.log('✅ SEO Audit Passed');
  }
};

main();
