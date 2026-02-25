import { SITE_CONFIG } from '@/config/site';
import { LANGUAGES, DEFAULT_LANGUAGE, getLanguagePrefix, SupportedLanguage } from '@/config/language';
import { removeLanguagePrefix } from '@/utils/multilingualRoutes';

/**
 * Generates a canonical URL for a given path and language.
 * Ensures:
 * 1. HTTPS
 * 2. No WWW (or follows config)
 * 3. No trailing slashes
 * 4. Correct language prefix
 * 5. Strips query parameters (unless specifically handled, but usually canonicals shouldn't have them)
 */
export const generateCanonicalUrl = (path: string, lang?: string): string => {
  // 1. Get the base URL from config (stripping trailing slash just in case)
  // Ensure HTTPS and remove www if present (standardizing on non-www based on SITE_CONFIG.url)
  // If SITE_CONFIG.url has www, we keep it. The replace logic below standardizes to SITE_CONFIG.url's preference.
  // Actually, let's just use SITE_CONFIG.url as the authority.
  let baseUrl: string = SITE_CONFIG.url;
  
  // Ensure no trailing slash on baseUrl
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
  }

  // 2. Normalize input path: strip query/hash, ensure leading slash, remove existing language prefix
  const rawPath = String(path || '');
  const pathOnly = rawPath.split('?')[0].split('#')[0] || '/';
  const normalizedPath = pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`;
  const cleanPath = removeLanguagePrefix(normalizedPath);
  
  // 3. Determine target language prefix
  // If lang is not provided, try to infer or default
  const targetLang = lang || DEFAULT_LANGUAGE.code;
  
  // Find the language config to get the correct prefix
  const langConfig = LANGUAGES.find(l => l.code === targetLang) || DEFAULT_LANGUAGE;
  const prefix = langConfig.prefix;

  // 4. Construct the full path
  // If cleanPath is just '/', and we have a prefix, it becomes '/prefix'
  // If cleanPath is '/foo', and we have a prefix, it becomes '/prefix/foo'
  // If no prefix, it stays '/foo' or '/'
  let finalPath = '';
  
  if (cleanPath === '/') {
    finalPath = prefix || '/';
  } else {
    finalPath = prefix ? `${prefix}${cleanPath}` : cleanPath;
  }

  // 5. Construct full URL
  let fullUrl = `${baseUrl}${finalPath}`;

  // 6. Remove trailing slash if it exists (and if it's not just the root domain, though root usually has implicit slash)
  // Standard SEO practice: pick one (trailing or non-trailing) and stick to it.
  // We'll go with NO trailing slash for consistency, except for root.
  if (fullUrl !== baseUrl && fullUrl.endsWith('/')) {
    fullUrl = fullUrl.slice(0, -1);
  }

  return fullUrl;
};

/**
 * Generates hreflang links for a given path.
 * Ensures consistent bidirectional linking across all language versions.
 */
export const generateHreflangLinks = (path: string): Array<{ href: string; hreflang: string }> => {
  const rawPath = String(path || '');
  const pathOnly = rawPath.split('?')[0].split('#')[0] || '/';
  const normalizedPath = pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`;
  const cleanPath = removeLanguagePrefix(normalizedPath);
  // Base URL logic same as generateCanonicalUrl
  let baseUrl: string = SITE_CONFIG.url;
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
  }
  
  const links: Array<{ href: string; hreflang: string }> = [];
  
  // Generate links for each supported language
  LANGUAGES.forEach(lang => {
    const prefix = lang.prefix;
    let finalPath = '';
    
    if (cleanPath === '/') {
      finalPath = prefix || '/';
    } else {
      finalPath = prefix ? `${prefix}${cleanPath}` : cleanPath;
    }
    
    let fullUrl = `${baseUrl}${finalPath}`;
    if (fullUrl !== baseUrl && fullUrl.endsWith('/')) {
      fullUrl = fullUrl.slice(0, -1);
    }
    
    const normalizedHreflang = (() => {
      if (lang.code === 'en') return 'en';
      if (lang.code === 'zh') return 'zh-Hans';
      return lang.hreflang;
    })();
    links.push({ href: fullUrl, hreflang: normalizedHreflang });
  });
  
  // Add x-default pointing to default language (English)
  const defaultLang = DEFAULT_LANGUAGE;
  const defaultPrefix = defaultLang.prefix;
  let defaultPath = '';
  
  if (cleanPath === '/') {
    defaultPath = defaultPrefix || '/';
  } else {
    defaultPath = defaultPrefix ? `${defaultPrefix}${cleanPath}` : cleanPath;
  }
  
  let defaultUrl = `${baseUrl}${defaultPath}`;
  if (defaultUrl !== baseUrl && defaultUrl.endsWith('/')) {
    defaultUrl = defaultUrl.slice(0, -1);
  }
  
  links.push({
    href: defaultUrl,
    hreflang: 'x-default'
  });
  
  return links;
};

export const inferKeywordsFromPath = (path: string, locale: string = 'en'): string[] => {
  const clean = removeLanguagePrefix(path).replace(/\/+$/, '') || '/';
  const parts = clean.split('/').filter(Boolean);
  const tokens: string[] = [];
  if (parts[0]) {
    tokens.push(parts[0]);
  }
  const slug = parts[parts.length - 1] || '';
  slug.split(/[-_]/).forEach(t => tokens.push(t));
  const mapEn: Record<string, string> = {
    mri: 'MRI', ct: 'CT', scanners: 'scanners', specifications: 'specifications', pricing: 'pricing', terms: 'terms', privacy: 'privacy',
  };
  const mapZh: Record<string, string> = {
    mri: 'MRI', ct: 'CT', scanners: '扫描仪', specifications: '招标参数', pricing: '价格', terms: '条款', privacy: '隐私',
  };
  const mapper = locale === 'zh' ? mapZh : mapEn;
  const normalized = Array.from(new Set(tokens.map(s => s.toLowerCase())))
    .map(s => {
      if (/^\d+t$/.test(s)) return s.toUpperCase().replace('T', locale === 'zh' ? 'T' : 'T');
      if (/^\d+\.?\d*t$/.test(s)) return s.toUpperCase();
      return mapper[s] || s;
    })
    .filter(Boolean);
  return normalized.slice(0, 8);
};

export const optimizeDescription = (base: string, locale: string = 'en'): string => {
  let desc = String(base || '').replace(/\s+/g, ' ').trim();
  const max = 180;
  if (desc.length > max) {
    desc = desc.slice(0, max).replace(/\s+\S*$/, '');
  }
  return desc;
};

const MIN_DESCRIPTION_LENGTH = 50;

const normalizePathname = (pathname: string) => {
  return pathname.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
};

const inferPathFromLocaleFile = (locale: string, file: string) => {
  const re = new RegExp(`^/src/locales/${locale}/seo/(.+)\\.(ts|json)$`);
  const m = file.match(re);
  if (!m) return null;
  const raw = m[1];
  let path = raw.replace(/index$/i, '');
  path = path.replace(/\/+/g, '/').replace(/\/$/, '');
  if (!path.startsWith('/')) path = `/${path}`;
  return normalizePathname(path || '/');
};

export const getLocalizedSEOConfig = (locale: string, pathname: string): { title?: string; description?: string; structuredData?: object } | null => {
  try {
    const normalized = normalizePathname(removeLanguagePrefix(pathname));
    const tsMods = import.meta.glob('/src/locales/**/seo/**/*.ts', { eager: true }) as Record<string, unknown>;
    const jsonMods = import.meta.glob('/src/locales/**/seo/**/*.json', { eager: true }) as Record<string, unknown>;
    const mods = { ...tsMods, ...jsonMods };
    for (const [file, mod] of Object.entries(mods)) {
      if (!file.includes(`/src/locales/${locale}/seo/`)) continue;
      const path = inferPathFromLocaleFile(locale, file);
      if (!path) continue;
      if (path === normalized || `${path}/` === normalized || path === `${normalized}/`) {
        const data = (mod as { default?: unknown }).default ?? mod;
        const obj = data as { title?: string; description?: string; structuredData?: object };
        return obj || null;
      }
    }
    return null;
  } catch {
    return null;
  }
};

export const getSectionFallbackSEO = (pathname: string, locale: string = 'en'): { title: string; description: string } => {
  const normalized = normalizePathname(removeLanguagePrefix(pathname));
  const parts = normalized.split('/').filter(Boolean);
  const head = parts[0] || '';
  const slug = parts[parts.length - 1] || '';
  const humanize = (s: string) => String(s || '').replace(/-/g, ' ').trim();
  const siteZh = '中国CT扫描仪网';
  const siteEn = 'China CT Scanner';
  const zhMap: Record<string, { t: (s: string) => string; d: (s: string) => string }> = {
    '': { t: () => `${siteZh} - 全球医学影像设备名录`, d: () => '专业的医学影像设备信息平台，提供CT/MRI设备对比、价格分析、制造商信息及采购指南。' },
    learn: { t: () => '学习中心 | 买方视角指南', d: (s) => {
      const name = humanize(s);
      if (name) return `买方视角的 ${name} 学习与采购指南：规格解析、成本与维保、流程优化与患者体验。`;
      return '面向采购与临床的学习资源：规格解析、成本与维保、流程与患者体验。';
    } },
    compare: { t: (s) => `${s ? s.replace(/-/g, ' ').toUpperCase() : '设备对比'} | 选型分析`, d: (s) => `设备对比与选型分析：${s ? s.replace(/-/g, ' ') : '关键配置'} 的差异、架构与重建、维保与长期成本。` },
    devices: { t: () => '设备目录 | CT/MRI', d: () => '按类别浏览CT/MRI设备与规格档案，支持参数对比与清单协同。' },
    manufacturers: { t: () => '制造商对比 | 服务与生态', d: () => '对比制造商的产品组合、维保网络与升级策略，支持不同场景选型。' },
    pricing: { t: () => '价格与议价 | 采购成本分析', d: (s) => {
      const name = humanize(s);
      if (name) return `${name} 的价格与议价：内部价区间、隐性成本与采购策略。`;
      return '价格与议价指南：设备内部价、隐性成本与采购策略。';
    } },
    guides: { t: () => '采购指南 | 进口与维保', d: () => '采购/进口/融资/维保的合规与清单，支持落地执行。' },
    history: { t: () => '影像史 | 技术与应用演进', d: () => '梳理CT/MRI/PET-CT的技术演进与应用扩展，映射到采购决策。' },
    blog: { t: () => '行业洞察 | 技术与市场', d: () => '行业洞察与技术趋势，帮助买方理解长期价值与风险。' },
    glossary: { t: () => '术语表 | 规格与技术', d: () => '统一术语与规格释义，支持跨品牌与代际的对照理解。' },
    customers: { t: () => '客户案例 | 场景落地', d: () => '不同科室与机构的落地案例与流程优化经验。' },
    contact: { t: () => '联系与咨询', d: () => '联系专家团队获取设备选型与采购支持。' },
  };
  const enMap: Record<string, { t: (s: string) => string; d: (s: string) => string }> = {
    '': { t: () => `${siteEn} - Global Medical Imaging Directory`, d: () => 'Professional platform for CT/MRI comparisons, pricing analysis, manufacturer data and procurement guides.' },
    learn: { t: () => 'Learning Center | Buyer-Oriented Guides', d: (s) => {
      const name = humanize(s);
      if (name) return `Buyer-oriented ${name} learning & procurement guide: specifications, cost & maintenance, workflow and patient experience.`;
      return 'Buyer-oriented resources: specifications, cost & maintenance, workflows and patient experience.';
    } },
    compare: { t: (s) => `${s ? s.replace(/-/g, ' ').toUpperCase() : 'Device Comparisons'} | Selection Analysis`, d: (s) => `Comparisons and selection analysis: ${s ? s.replace(/-/g, ' ') : 'key configurations'}, architecture & reconstruction, service and lifetime cost.` },
    devices: { t: () => 'Devices Catalog | CT/MRI', d: () => 'Browse CT/MRI devices and specification profiles, with parameter comparison and bundle support.' },
    manufacturers: { t: () => 'Manufacturers | Portfolio & Service', d: () => 'Compare portfolios, service networks and upgrade strategies to support selection.' },
    pricing: { t: () => 'Pricing & Negotiation | Cost Analysis', d: (s) => {
      const name = humanize(s);
      if (name) return `${name} pricing & negotiation: insider ranges, hidden costs and procurement strategies.`;
      return 'Pricing and negotiation guides: insider prices, hidden costs and procurement strategies.';
    } },
    guides: { t: () => 'Procurement Guides | Import & Service', d: () => 'Compliance checklists for import/financing/service to support execution.' },
    history: { t: () => 'Imaging History | Technology & Applications', d: () => 'Timeline of CT/MRI/PET-CT evolution mapped to buyer decisions.' },
    blog: { t: () => 'Industry Insights | Technology & Market', d: () => 'Insights and trends to understand long-term value and risks.' },
    glossary: { t: () => 'Glossary | Specs & Technology', d: () => 'Unified terminology for cross-brand, cross-generation specification understanding.' },
    customers: { t: () => 'Customers | Use Cases', d: () => 'Department and institution case studies and workflow optimization.' },
    contact: { t: () => 'Contact & Consultation', d: () => 'Contact experts for equipment selection and procurement support.' },
  };
  const map = locale === 'zh' ? zhMap : enMap;
  const key = head in map ? head : '';
  const title = map[key].t(slug);
  const description = map[key].d(slug);
  return { title, description };
};

export const buildPageHead = (
  basePath: string,
  lang: string,
  opts?: { title?: string; description?: string; image?: string }
) => {
  const localized = getLocalizedSEOConfig(lang, basePath) || null;
  const section = getSectionFallbackSEO(basePath, lang as SupportedLanguage);
  const title = (localized?.title as string) || (opts?.title as string) || section.title;
  const localizedDescription = localized?.description as string | undefined;
  const headDescription = opts?.description as string | undefined;
  let descriptionBase = localizedDescription || headDescription || section.description;
  const source = localizedDescription ? 'localized' : headDescription ? 'head' : 'section';
  const normalized = String(descriptionBase || '').replace(/\s+/g, ' ').trim();
  if (source !== 'section' && normalized.length > 0 && normalized.length < MIN_DESCRIPTION_LENGTH) {
    console.warn(`[SEO] Description too short (<${MIN_DESCRIPTION_LENGTH}) for ${lang}:${basePath}. Falling back to section default. Please update locale SEO data.`);
    descriptionBase = section.description;
  }
  const description = optimizeDescription(descriptionBase, lang);
  const canonical = generateCanonicalUrl(basePath, lang);
  const ogImage = opts?.image || `${canonical.replace(/\/+$/, '')}/placeholder.svg`;
  return {
    title,
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: canonical },
      { property: 'og:image', content: ogImage },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage },
    ],
    // canonical & hreflang are centralized at root head; do not emit here
    links: [],
  };
};

export const buildArticleHead = (
  canonicalPath: string,
  lang: string,
  data?: { title?: string; description?: string; image?: string }
) => {
  const title = data?.title || '';
  const descriptionBase = data?.description || '';
  const description = optimizeDescription(descriptionBase, lang);
  const canonical = generateCanonicalUrl(canonicalPath, lang);
  const ogImage = data?.image || `${canonical.replace(/\/+$/, '')}/placeholder.svg`;
  const allAlternates = generateHreflangLinks(canonicalPath);
  const filtered = lang === DEFAULT_LANGUAGE.code ? allAlternates : allAlternates.filter(l => l.hreflang !== 'x-default');
  const zhAlias = lang !== 'zh' ? filtered.filter(l => String(l.hreflang).toLowerCase() === 'zh-hans').map(l => ({ href: l.href, hreflang: 'zh' })) : [];
  const alternates = [...filtered, ...zhAlias];
  return {
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: canonical },
      { property: 'og:image', content: ogImage },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage },
    ],
    links: [
      { rel: 'canonical', href: canonical },
      ...alternates.map(l => ({ rel: 'alternate', href: l.href, hreflang: l.hreflang })),
    ],
  };
};
