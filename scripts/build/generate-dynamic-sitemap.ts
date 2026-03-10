#!/usr/bin/env node

/**
 * 动态站点地图生成器
 * 自动从数据源生成完整的 sitemap
 * 支持增量更新 - 仅在内容变化时更新
 * 
 * 运行: npx tsx scripts/generate-dynamic-sitemap.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { LANGUAGES } from '../../src/config/language';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.SITE_URL || 'https://chinactscanner.org';
const BASE_URL_NORMALIZED = BASE_URL.replace(/\/+$/, '');
const SUPPORTED_LANGUAGES = LANGUAGES.map(l => l.code);

// ==================== Interfaces ====================

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: number;
}

interface AlternateLink {
  hreflang: string;
  href: string;
}

interface Device {
  slug: string;
  type: string;
  featured: boolean;
  name: string;
  model?: string;
  manufacturerId: string;
  brand: string;
  image?: string;
  canonical: string;
}

interface Manufacturer {
  slug: string;
  country: string;
  featured: boolean;
  name: string;
  englishName: string;
}

interface SitemapData {
  devices: Device[];
  manufacturers: Manufacturer[];
  brands: string[];
  language: string;
}

// ==================== 数据源配置 ====================

const canonicalManufacturerSlug = (id: string) => {
  if (!id) return '';
  if (id === 'mingfeng-medical') return 'minfound';
  if (id === 'anke-medical') return 'anke';
  return id.replace(/-medical$/, '');
};

/**
 * 市场分析报告 (静态配置)
 */
const MARKET_REPORTS = [
  { slug: 'china-ct-market-2024' },
  { slug: 'global-mri-trends-2024' },
];

/**
 * 知识文章 (静态配置)
 */
const KNOWLEDGE_ARTICLES = [
  { slug: 'ct-scanner-timeline' },
  { slug: 'ct-scanner-invention' },
  { slug: 'ct-scanner-history' },
  { slug: 'mri-development-history' },
  { slug: 'mri-development-china' },
  { slug: 'pet-ct-development-history' },
  { slug: 'china-ct-market-battle' },
];

/**
 * 从 snapshots 读取设备列表
 */
const readDeviceSnapshots = () => {
  const dir = path.join(__dirname, '..', 'src', 'data', 'snapshots', 'en', 'content', 'devices');
  const devices: Device[] = [];
  try {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
    for (const f of files) {
      const full = path.join(dir, f);
      try {
        const json = JSON.parse(fs.readFileSync(full, 'utf-8'));
        const slug: string = json.slug || f.replace(/\.json$/, '');
        const fm = json.frontMatter || {};
        const title: string = fm.title || slug;
        const seo = fm.seo || {};
        const canonical: string = seo.canonical || `/devices/${slug}`;
        const image: string | undefined = seo.image;
        const tags: string[] = Array.isArray(fm.tags) ? fm.tags : [];
        const featured = tags.includes('high-end');
        const brand = slug.split('-')[0] || '';
        const type = canonical.includes('/mri-scanners/') ? 'MRI' : 'CT';
        devices.push({
          slug,
          type,
          featured,
          name: title,
          manufacturerId: brand,
          brand,
          image,
          canonical
        });
      } catch {
        // ignore malformed file
      }
    }
  } catch {
    // ignore if directory missing
  }
  return devices;
};

/**
 * 从 snapshots 读取制造商列表
 */
const readManufacturerSnapshots = () => {
  const dir = path.join(__dirname, '..', 'src', 'data', 'snapshots', 'en', 'content', 'manufacturers');
  const manufacturers: Manufacturer[] = [];
  try {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
    for (const f of files) {
      const slug = f.replace(/\.json$/, '');
      manufacturers.push({
        slug: canonicalManufacturerSlug(slug),
        country: '',
        featured: false,
        name: slug,
        englishName: slug
      });
    }
  } catch {
    // ignore if directory missing
  }
  return manufacturers;
};

/**
 * 加载数据源（snapshots）
 * @param {string} lang - 语言代码 ('en' | 'zh')
 */
const listManufacturerSlugs = () => {
  const dir = path.join(__dirname, '..', 'content', 'manufacturers', 'en');
  try {
    const files = fs.readdirSync(dir);
    return files.filter(f => f.endsWith('.md')).map(f => f.replace(/\.md$/, ''));
  } catch {
    return [];
  }
};

const loadData = (lang = 'en') => {
    const devices = readDeviceSnapshots();
    const manufacturersList = readManufacturerSnapshots();
    const brands = [...new Set(devices.map(d => d.brand).filter(Boolean))];
    return { devices, manufacturers: manufacturersList, brands, language: lang };
};

/**
 * 静态页面配置
 */
const STATIC_PAGES = [
  // 核心页面 (高优先级)
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/devices', priority: 0.9, changefreq: 'daily' },
  { path: '/manufacturers', priority: 0.9, changefreq: 'weekly' },
  { path: '/blog', priority: 0.8, changefreq: 'daily' },

  // 客户相关
  { path: '/customers', priority: 0.7, changefreq: 'weekly' },

  // 定价（高优先级）
  { path: '/pricing', priority: 0.9, changefreq: 'daily' },
  { path: '/premium-reports', priority: 0.75, changefreq: 'weekly' },

  // 历史
  { path: '/history', priority: 0.75, changefreq: 'weekly' },

  // 分析报告
  { path: '/reports', priority: 0.8, changefreq: 'daily' },
  { path: '/reports/market', priority: 0.9, changefreq: 'daily' },
  { path: '/reports/expert', priority: 0.8, changefreq: 'weekly' },

  // 指南
  // 资源中心
  { path: '/resources', priority: 0.6, changefreq: 'monthly' },

  // 其他页面
  { path: '/about', priority: 0.5, changefreq: 'monthly' },
  { path: '/contact', priority: 0.5, changefreq: 'monthly' },
  { path: '/privacy', priority: 0.4, changefreq: 'monthly' },
  { path: '/terms', priority: 0.4, changefreq: 'monthly' },
  { path: '/glossary', priority: 0.5, changefreq: 'monthly' },
];

// ==================== 增量更新支持 ====================

/**
 * 计算内容哈希值
 */
const calculateHash = (content: string) => {
  return crypto.createHash('md5').update(content).digest('hex');
};

/**
 * 读取现有sitemap的哈希值
 */
const loadExistingHash = (filePath: string) => {
  try {
    const hashPath = filePath + '.hash';
    if (fs.existsSync(hashPath)) {
      return fs.readFileSync(hashPath, 'utf8').trim();
    }
  } catch (error) {
    // 忽略错误
  }
  return null;
};

/**
 * 保存哈希值
 */
const saveHash = (filePath: string, hash: string) => {
  const hashPath = filePath + '.hash';
  fs.writeFileSync(hashPath, hash, 'utf8');
};

/**
 * 检查是否需要更新
 */
const needsUpdate = (filePath: string, newContent: string) => {
  const newHash = calculateHash(newContent);
  const existingHash = loadExistingHash(filePath);
  return { needsUpdate: existingHash !== newHash, hash: newHash };
};

// ==================== URL生成函数 ====================

const normalizePathname = (input: string) => {
  let p = String(input || '/').trim();
  if (!p.startsWith('/')) p = `/${p}`;
  p = p.split('?')[0].split('#')[0];
  p = p.replace(/\/+/g, '/');
  if (p !== '/' && p.endsWith('/')) p = p.slice(0, -1);
  return p;
};

const stripLanguagePrefix = (pathname: string) => {
  const p = normalizePathname(pathname);
  for (const lang of LANGUAGES) {
    if (!lang.prefix) continue;
    if (p === lang.prefix) return '/';
    if (p.startsWith(`${lang.prefix}/`)) {
      const rest = p.slice(lang.prefix.length) || '/';
      return normalizePathname(rest);
    }
  }
  return p;
};

const buildLocalizedPath = (cleanPath: string, languageCode: string) => {
  const p = normalizePathname(cleanPath);
  const lang = LANGUAGES.find(l => l.code === languageCode) || LANGUAGES[0];
  if (!lang.prefix) return p;
  if (p === '/') return lang.prefix;
  return normalizePathname(`${lang.prefix}${p}`);
};

const toAbsoluteUrl = (pathname: string) => {
  const p = normalizePathname(pathname);
  return p === '/' ? BASE_URL_NORMALIZED : `${BASE_URL_NORMALIZED}${p}`;
};

const generateHreflangLinks = (cleanPath: string) => {
  const links: AlternateLink[] = LANGUAGES.map(lang => ({
    hreflang: lang.hreflang,
    href: toAbsoluteUrl(buildLocalizedPath(cleanPath, lang.code)),
  }));

  const defaultLang = LANGUAGES.find(l => l.prefix === '') || LANGUAGES[0];
  links.push({
    hreflang: 'x-default',
    href: toAbsoluteUrl(buildLocalizedPath(cleanPath, defaultLang.code)),
  });

  return links;
};

const loadPrerenderRoutes = () => {
  const routesPath = path.join(__dirname, '../prerender-routes.json');
  if (!fs.existsSync(routesPath)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(routesPath, 'utf-8'));
    if (!Array.isArray(parsed)) return [];
    return parsed.map(String).filter(Boolean);
  } catch {
    return [];
  }
};

/**
 * 转义 XML 特殊字符
 */
const escapeXml = (text: string) => {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

/**
 * 生成 URL XML 条目
 */
const generateUrlEntry = (url: SitemapUrl, alternates: AlternateLink[] = []) => {
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

/**
 * 生成设备详情页URL
 */
const generateDevicePages = (devices: Device[]) => {
  return devices.map(device => ({
    path: device.canonical || `/devices/${device.slug}`,
    priority: device.featured ? 0.8 : 0.65,
    changefreq: 'weekly'
  }));
};

/**
 * 生成制造商详情页URL
 */
const generateManufacturerPages = (manufacturers: Manufacturer[]) => {
  return manufacturers.map(manufacturer => ({
    path: `/manufacturers/${manufacturer.slug}`,
    priority: manufacturer.featured ? 0.8 : 0.65,
    changefreq: 'weekly'
  }));
};

/**
 * 生成市场报告详情页URL
 */
const generateMarketReportPages = () => {
  return MARKET_REPORTS.map(report => ({
    path: `/reports/market/${report.slug}`,
    priority: 0.7,
    changefreq: 'monthly'
  }));
};

/**
 * 生成知识文章详情页URL
 */
const generateKnowledgePages = () => {
  return KNOWLEDGE_ARTICLES.map(article => ({
    path: `/history/${article.slug}`,
    priority: 0.65,
    changefreq: 'monthly'
  }));
};

/**
 * 生成设备规格 landing 页面 (如 /devices/ct-scanners/128-slice)
 */
const generateSpecificationPages = () => {
  const specs = [
    { cat: 'ct-scanners', spec: '128-slice' },
    { cat: 'ct-scanners', spec: '64-slice' },
    { cat: 'mri-scanners', spec: '3t' },
    { cat: 'mri-scanners', spec: '1.5t' }
  ];
  return specs.map(({ cat, spec }) => ({
    path: `/devices/${cat}/${spec}`,
    priority: 0.8,
    changefreq: 'weekly'
  }));
};

/**
 * 生成条件分类 landing 页面 (如 /devices/used-ct-scanners)
 */
const generateConditionPages = () => {
  const conditions = [
    { cat: 'ct-scanners', cond: 'used' },
    { cat: 'ct-scanners', cond: 'refurbished' },
    { cat: 'mri-scanners', cond: 'used' },
    { cat: 'mri-scanners', cond: 'refurbished' }
  ];
  return conditions.map(({ cat, cond }) => ({
    path: `/devices/${cond}-${cat}`,
    priority: 0.85,
    changefreq: 'daily'
  }));
};

/**
 * 生成主站点地图（包含所有语言）
 * CRITICAL: hreflang 必须双向一致 - 所有语言版本包含完全相同的 hreflang 集合
 * 这是解决 GSC "重复网页，用户未选定规范网页" 的关键
 */
const generateMainSitemap = (data: SitemapData) => {
  const lastmod = new Date().toISOString().split('T')[0];
  const urls: string[] = [];
  const locSet = new Set<string>();

  const cleanPaths = new Set<string>();
  const prerenderRoutes = loadPrerenderRoutes();

  for (const r of prerenderRoutes) {
    const normalized = normalizePathname(r);
    const clean = stripLanguagePrefix(normalized);
    if (clean === '/404') continue;
    if (clean.startsWith('/admin') || clean.startsWith('/api')) continue;
    cleanPaths.add(clean);
  }

  if (cleanPaths.size === 0) {
    const fallbackPages = [
      ...STATIC_PAGES,
      ...generateDevicePages(data.devices),
      ...generateManufacturerPages(data.manufacturers),
      ...generateMarketReportPages(),
      ...generateKnowledgePages(),
      ...generateSpecificationPages(),
      ...generateConditionPages(),
    ];
    for (const p of fallbackPages) cleanPaths.add(normalizePathname(p.path));
  }

  const resolveMeta = (cleanPath: string) => {
    const p = normalizePathname(cleanPath);
    const fromStatic = STATIC_PAGES.find(s => normalizePathname(s.path) === p);
    if (fromStatic) return { priority: fromStatic.priority, changefreq: fromStatic.changefreq };
    if (p.startsWith('/devices/') || p.startsWith('/manufacturers/')) return { priority: 0.65, changefreq: 'weekly' };
    if (p.startsWith('/learn/')) return { priority: 0.7, changefreq: 'monthly' };
    if (p.startsWith('/reports/market/')) return { priority: 0.7, changefreq: 'monthly' };
    if (p.startsWith('/reports/')) return { priority: 0.7, changefreq: 'weekly' };
    if (p.startsWith('/history/')) return { priority: 0.65, changefreq: 'monthly' };
    return { priority: 0.6, changefreq: 'weekly' };
  };

  Array.from(cleanPaths)
    .sort((a, b) => a.localeCompare(b))
    .forEach((cleanPath) => {
      const alternates = generateHreflangLinks(cleanPath);
      const meta = resolveMeta(cleanPath);
      const defaultLang = LANGUAGES.find(l => l.prefix === '') || LANGUAGES[0];
      const loc = toAbsoluteUrl(buildLocalizedPath(cleanPath, defaultLang.code));
      if (locSet.has(loc)) return;
      locSet.add(loc);
      urls.push(
        generateUrlEntry(
          {
            loc,
            lastmod,
            changefreq: meta.changefreq,
            priority: meta.priority,
          },
          alternates,
        ),
      );
    });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`;
};

/**
 * 生成语言特定站点地图
 */
const generateLanguageSitemap = (data: SitemapData, language: string) => {
  const lastmod = new Date().toISOString().split('T')[0];
  const urls: string[] = [];
  const locSet = new Set<string>();

  const cleanPaths = new Set<string>();
  const prerenderRoutes = loadPrerenderRoutes();

  for (const r of prerenderRoutes) {
    const normalized = normalizePathname(r);
    const clean = stripLanguagePrefix(normalized);
    if (clean === '/404') continue;
    if (clean.startsWith('/admin') || clean.startsWith('/api')) continue;
    cleanPaths.add(clean);
  }

  if (cleanPaths.size === 0) {
    const fallbackPages = [
      ...STATIC_PAGES,
      ...generateDevicePages(data.devices),
      ...generateManufacturerPages(data.manufacturers),
      ...generateMarketReportPages(),
      ...generateKnowledgePages(),
      ...generateSpecificationPages(),
      ...generateConditionPages(),
    ];
    for (const p of fallbackPages) cleanPaths.add(normalizePathname(p.path));
  }

  const resolveMeta = (cleanPath: string) => {
    const p = normalizePathname(cleanPath);
    const fromStatic = STATIC_PAGES.find(s => normalizePathname(s.path) === p);
    if (fromStatic) return { priority: fromStatic.priority, changefreq: fromStatic.changefreq };
    if (p.startsWith('/devices/') || p.startsWith('/manufacturers/')) return { priority: 0.65, changefreq: 'weekly' };
    if (p.startsWith('/learn/')) return { priority: 0.7, changefreq: 'monthly' };
    if (p.startsWith('/reports/market/')) return { priority: 0.7, changefreq: 'monthly' };
    if (p.startsWith('/reports/')) return { priority: 0.7, changefreq: 'weekly' };
    if (p.startsWith('/history/')) return { priority: 0.65, changefreq: 'monthly' };
    return { priority: 0.6, changefreq: 'weekly' };
  };

  Array.from(cleanPaths)
    .sort((a, b) => a.localeCompare(b))
    .forEach((cleanPath) => {
      const meta = resolveMeta(cleanPath);
      const loc = toAbsoluteUrl(buildLocalizedPath(cleanPath, language));
      if (locSet.has(loc)) return;
      locSet.add(loc);
      urls.push(
        generateUrlEntry({
          loc,
          lastmod,
          changefreq: meta.changefreq,
          priority: meta.priority,
        }),
      );
    });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
};

/**
 * 生成图片站点地图
 */
const generateImageSitemap = (data: SitemapData) => {
  const lastmod = new Date().toISOString().split('T')[0];
  const urls: string[] = [];

  const prerenderRoutes = loadPrerenderRoutes();
  const cleanPaths = new Set<string>();
  for (const r of prerenderRoutes) {
    const normalized = normalizePathname(r);
    const clean = stripLanguagePrefix(normalized);
    if (clean === '/404') continue;
    if (clean.startsWith('/admin') || clean.startsWith('/api')) continue;
    cleanPaths.add(clean);
  }

  const devicePathBySlug = new Map<string, string>();
  for (const cleanPath of cleanPaths) {
    if (!cleanPath.startsWith('/devices/')) continue;
    const parts = cleanPath.split('/').filter(Boolean);
    const slug = parts[parts.length - 1] || '';
    if (!slug) continue;
    if (!devicePathBySlug.has(slug)) devicePathBySlug.set(slug, cleanPath);
  }

  // 首页OG图片
  urls.push(`  <url>
    <loc>${BASE_URL}/</loc>
    <image:image>
      <image:loc>${BASE_URL}/assets/og-home.jpg</image:loc>
      <image:caption>China CT Scanner - Medical Imaging Equipment Export Platform</image:caption>
      <image:title>China CT Scanner Homepage</image:title>
    </image:image>
    <lastmod>${lastmod}</lastmod>
  </url>`);

  data.devices.slice(0, 200).forEach(device => {
    if (!device.image) return;
    const devicePath = devicePathBySlug.get(device.slug);
    if (!devicePath) return;

    urls.push(`  <url>
    <loc>${escapeXml(toAbsoluteUrl(devicePath))}</loc>
    <image:image>
      <image:loc>${escapeXml(device.image)}</image:loc>
      <image:caption>${escapeXml(device.name || '')}</image:caption>
      <image:title>${escapeXml(device.model || device.name || '')}</image:title>
    </image:image>
    <lastmod>${lastmod}</lastmod>
  </url>`);
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join('\n')}
</urlset>`;
};

/**
 * 生成站点地图索引
 */
const generateSitemapIndex = () => {
  const lastmod = new Date().toISOString().split('T')[0];

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-images.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
</sitemapindex>`;
};

/**
 * 生成 robots.txt
 */
const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /

# 站点地图
Sitemap: ${BASE_URL}/sitemap-index.xml
Sitemap: ${BASE_URL}/sitemap.xml
Sitemap: ${BASE_URL}/sitemap-images.xml

# AI 爬虫支持
User-agent: GPTBot
User-agent: ChatGPT-User
User-agent: Claude-Web
User-agent: anthropic-ai
User-agent: Google-Extended
Allow: /

# 爬取延迟
Crawl-delay: 1

# 禁止访问的目录
Disallow: /admin/
Disallow: /api/
Disallow: *.json$
Disallow: /tmp/
`;
};

/**
 * 写入文件（支持增量更新）
 */
const writeFileIfChanged = (filePath: string, content: string, fileName: string) => {
  const { needsUpdate: shouldUpdate, hash } = needsUpdate(filePath, content);

  if (shouldUpdate) {
    fs.writeFileSync(filePath, content, 'utf8');
    saveHash(filePath, hash);
    console.log(`✅ ${fileName} 已更新`);
    return true;
  } else {
    console.log(`⏭️  ${fileName} 无变化，跳过`);
    return false;
  }
};

/**
 * 主函数
 */
const main = () => {
  console.log('🚀 开始生成动态站点地图...\n');

  // 加载数据
  const data = loadData('en');

  const prerenderRoutes = loadPrerenderRoutes();
  const cleanPaths = new Set<string>();
  for (const r of prerenderRoutes) cleanPaths.add(stripLanguagePrefix(normalizePathname(r)));

  console.log('📊 页面统计:');
  console.log(`   - prerender 路由条目: ${prerenderRoutes.length}`);
  console.log(`   - 去语言前缀后的唯一页面: ${cleanPaths.size}`);
  console.log(`   - 支持语言: ${SUPPORTED_LANGUAGES.join(', ')}\n`);

  const publicDir = path.join(__dirname, '../public');

  // 确保 public 目录存在
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  let updatedCount = 0;

  try {
    console.log('📝 检查文件更新...\n');

    // 生成主站点地图
    if (writeFileIfChanged(
      path.join(publicDir, 'sitemap.xml'),
      generateMainSitemap(data),
      'sitemap.xml (主站点地图)'
    )) updatedCount++;

    // 生成图片站点地图
    if (writeFileIfChanged(
      path.join(publicDir, 'sitemap-images.xml'),
      generateImageSitemap(data),
      'sitemap-images.xml (图片站点地图)'
    )) updatedCount++;

    // 生成站点地图索引
    if (writeFileIfChanged(
      path.join(publicDir, 'sitemap-index.xml'),
      generateSitemapIndex(),
      'sitemap-index.xml (站点地图索引)'
    )) updatedCount++;

    // 注意：不覆盖 robots.txt，因为可能有手动编辑
    const robotsPath = path.join(publicDir, 'robots.txt');
    if (!fs.existsSync(robotsPath)) {
      fs.writeFileSync(robotsPath, generateRobotsTxt(), 'utf8');
      console.log('✅ robots.txt 已创建');
      updatedCount++;
    }

    // 统计 URL 数量
    const mainSitemap = fs.readFileSync(path.join(publicDir, 'sitemap.xml'), 'utf-8');
    const urlCount = (mainSitemap.match(/<url>/g) || []).length;

    console.log('\n🎉 Sitemap生成完成！');
    console.log(`📈 主站点地图包含 ${urlCount} 个 URL 条目`);
    console.log(`🔄 本次更新了 ${updatedCount} 个文件\n`);

    console.log('📍 生成的文件:');
    console.log('   - public/sitemap.xml (主站点地图，包含多语言链接)');
    console.log('   - public/sitemap-images.xml (图片站点地图)');
    console.log('   - public/sitemap-index.xml (站点地图索引)');
    console.log('   - public/robots.txt (爬虫规则)');

  } catch (error) {
    console.error('❌ 生成站点地图时出错：', error);
    process.exit(1);
  }
};

// 如果直接运行此脚本
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

export {
  main as generateDynamicSitemap,
  generateMainSitemap,
  generateLanguageSitemap,
  generateImageSitemap,
  generateDevicePages,
  generateManufacturerPages,
  STATIC_PAGES
};
