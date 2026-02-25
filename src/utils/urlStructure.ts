import type { Device as DomainDevice } from '@/types/device';
import type { Manufacturer as DomainManufacturer } from '@/types/manufacturer';
import type { Device as SupabaseDevice, Manufacturer as SupabaseManufacturer } from '@/hooks/useSupabaseData';
import type { Article as DomainArticle } from '@/types/domain'; // Or article type file if created
import type { Article as SupabaseArticle } from '@/hooks/useSupabaseData';
import { SITE_CONFIG } from '@/config/site';
import { buildBreadcrumb } from '@/lib/breadcrumb';
import { addLanguagePrefix, removeLanguagePrefix } from '@/utils/multilingualRoutes';
import { SupportedLanguage } from '@/config/language';
import i18next from 'i18next';

// Function to generate device slug
export const generateDeviceSlug = (deviceName: string, manufacturerName?: string): string => {
  const baseName = typeof deviceName === 'string' ? deviceName : '';
  // 1. Basic cleanup with safety guards
  let slug = baseName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  // 2. Handle common device name patterns
  slug = slug
    .replace(/^(ge|siemens|philips|united-imaging|neusoft)-?/, '') // Remove manufacturer prefix
    .replace(/-(ct|mri|scanner)$/, '') // Remove device type suffix
    .replace(/\b(model|series|system)\b/g, '') // Remove generic words
    .replace(/-+/g, '-') // Clean up hyphens again
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

  // 3. If slug is too short or empty, supplement with manufacturer name
  if (slug.length < 3 && typeof manufacturerName === 'string' && manufacturerName.trim()) {
    const manufacturerSlug = manufacturerName.toLowerCase().replace(/[^a-z0-9]/g, '');
    slug = `${manufacturerSlug}-${slug}`;
  }

  // 4. Ensure slug is not empty
  if (!slug) {
    slug = 'device-' + Math.random().toString(36).substr(2, 9);
  }

  return slug;
};

export const generateManufacturerSlug = (name: string): string => {
  const base = typeof name === 'string' ? name : '';
  if (!base.trim()) return 'manufacturer';
  return base
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

// Example slug generation
const DEVICE_SLUG_EXAMPLES = {
  'GE Revolution Apex Expert': 'revolution-apex-expert',
  'Siemens SOMATOM Drive': 'somatom-drive',
  'Philips Ingenia Elition X': 'ingenia-elition-x',
  'United Imaging uCT 960+': 'uct-960-plus',
  'Neusoft NeuViz Epoch': 'neuviz-epoch',
  'Canon AQUILION PRIME TSX': 'aquilion-prime-tsx',
  'Anke ANATOM 64 FIT': 'anatom-64-fit',
  'Mingfeng Scintcare M650': 'scintcare-m650'
};

type DeviceLike = DomainDevice | SupabaseDevice;
type ManufacturerLike = DomainManufacturer | SupabaseManufacturer;

// Complete device URL generation function
export const generateDeviceURL = (device: DeviceLike) => {
  const isCT = (device.type && device.type.toLowerCase() === 'ct') || (device.category && device.category.toLowerCase() === 'ct');
  const categoryPath = isCT ? 'ct-scanners' : 'mri-scanners';

  // Get device specification path
  const specification = getDeviceSpecification(device);

  if (specification) {
    // URL with specification: /devices/ct-scanners/128-slice/ge-revolution-apex/
    const manufacturerName =
      'manufacturer' in device && (device as SupabaseDevice).manufacturer
        ? (device as SupabaseDevice).manufacturer?.name
        : (device as DomainDevice).manufacturerName;
    const slug = device.slug || generateDeviceSlug(device.name, manufacturerName);
    return `/devices/${categoryPath}/${specification}/${slug}/`;
  } else {
    // URL without specific specification: /devices/ct-scanners/ge-revolution-apex/
    const manufacturerName =
      'manufacturer' in device && (device as SupabaseDevice).manufacturer
        ? (device as SupabaseDevice).manufacturer?.name
        : (device as DomainDevice).manufacturerName;
    const slug = device.slug || generateDeviceSlug(device.name, manufacturerName);
    return `/devices/${categoryPath}/${slug}/`;
  }
};

export const generateSpecificationURL = (category: 'ct' | 'mri', specification: string) => {
  const categoryPath = category === 'ct' ? 'ct-scanners' : 'mri-scanners';
  return `/devices/${categoryPath}/${specification}/`;
};

export const generateCategoryURL = (category: 'ct' | 'mri') => {
  const categoryPath = category === 'ct' ? 'ct-scanners' : 'mri-scanners';
  return `/devices/${categoryPath}/`;
};

export const generateConditionURL = (category: 'ct' | 'mri', condition: 'used' | 'refurbished') => {
  const categoryPath = category === 'ct' ? 'ct-scanners' : 'mri-scanners';
  return `/devices/${condition}-${categoryPath}/`;
};

// Generate specification path based on device specifications
interface DeviceSpecs {
  sliceCount?: number;
  slices?: number;
  type?: string;
  fieldStrength?: number;
  designType?: string;
  [key: string]: unknown;
}

export const getDeviceSpecification = (device: DeviceLike): string | null => {
  const specs = device.specifications as DeviceSpecs | null;
  if (!specs) return null;
  
  if (device.category === 'ct' || device.type?.toLowerCase() === 'ct') {
    // CT specification determination
    if (specs.sliceCount === 128 || specs.slices === 128) return '128-slice';
    if (specs.sliceCount === 64 || specs.slices === 64) return '64-slice';
    if (specs.type === 'mobile') return 'mobile';
    if (specs.type === 'dual-energy') return 'dual-energy';
    if (specs.type === 'portable') return 'portable';
  } else if (device.category === 'mri' || device.type?.toLowerCase() === 'mri') {
    // MRI specification determination
    if (specs.fieldStrength === 3.0) return '3t';
    if (specs.fieldStrength === 1.5) return '1.5t';
    if (specs.designType === 'open') return 'open';
    if (specs.designType === 'wide-bore') return 'wide-bore';
  }

  return null;
};

// Generate breadcrumbs for specification collection pages
export const generateSpecificationBreadcrumbs = (category: string, specification: string, locale: string = 'en') => {
  const breadcrumbs = [
    { label: locale === 'zh' ? '首页' : 'Home', href: generateLocalizedURL('/', locale) },
    { label: locale === 'zh' ? '设备' : 'Devices', href: generateLocalizedURL('/devices/', locale) }
  ];

  // Add category breadcrumb
  const categoryLabel = category === 'ct-scanners'
    ? (locale === 'zh' ? 'CT扫描仪' : 'CT Scanners')
    : (locale === 'zh' ? 'MRI扫描仪' : 'MRI Scanners');

  breadcrumbs.push({
    label: categoryLabel,
    href: generateLocalizedURL(`/devices/${category}/`, locale)
  });

  // Add specification breadcrumb
  const specificationLabel = formatSpecificationLabel(specification, locale);
  breadcrumbs.push({
    label: specificationLabel,
    href: generateLocalizedURL(`/devices/${category}/${specification}/`, locale)
  });

  return breadcrumbs;
};

// Format specification labels
export const formatSpecificationLabel = (specification: string, locale: string = 'en'): string => {
  const labels: { [key: string]: { en: string; zh: string } } = {
    '128-slice': { en: '128-Slice', zh: '128层' },
    '64-slice': { en: '64-Slice', zh: '64层' },
    'mobile': { en: 'Mobile', zh: '移动式' },
    'dual-energy': { en: 'Dual-Energy', zh: '双能' },
    'portable': { en: 'Portable', zh: '便携式' },
    '3t': { en: '3.0T', zh: '3.0T' },
    '1.5t': { en: '1.5T', zh: '1.5T' },
    'open': { en: 'Open', zh: '开放式' },
    'wide-bore': { en: 'Wide-Bore', zh: '宽孔径' },
    'used': { en: 'Used', zh: '二手' },
    'refurbished': { en: 'Refurbished', zh: '翻新' }
  };

  return labels[specification]?.[locale] || specification;
};

export const generateManufacturerURL = (manufacturer: ManufacturerLike) => {
  const name = (manufacturer as unknown as { name?: string })?.name;
  const slug = manufacturer.slug || (typeof name === 'string' && name.trim() ? generateManufacturerSlug(name) : '');
  return slug ? `/manufacturers/${slug}/` : `/manufacturers/`;
};

type ArticleLike = DomainArticle | SupabaseArticle;
export const generateArticleURL = (article: ArticleLike) => {
  const slug = article.slug || generateDeviceSlug(article.title);
  return `/blog/${slug}/`;
};

export const generateDeviceTypeURL = (category: 'ct' | 'mri', typeSlug: string) => {
  const categoryPath = category === 'ct' ? 'ct-scanners' : 'mri-scanners';
  return `/devices/${categoryPath}/${typeSlug}/`;
};

export const generateCompareURL = (category: 'ct' | 'mri') => {
  const categoryPath = category === 'ct' ? 'ct-scanners' : 'mri-scanners';
  return `/compare/${categoryPath}/`;
};

export const generateHistoryURL = (slug: string) => {
  return `/history/${slug}/`;
};

export const generateLearnURL = (slug: string) => {
  return `/learn/${slug}/`;
};

// Multilingual URL helpers
export const generateLocalizedURL = (path: string, locale: string = 'en') => {
  if (locale === 'en') return path;
  return `/${locale}${path}`;
};

// Breadcrumb generation
export const generateBreadcrumbs = (path: string, locale: string = 'en') => {
  const lang = locale as SupportedLanguage;
  const clean = removeLanguagePrefix(path);
  const tFn = i18next.getFixedT(lang);
  // Known routes: use unified breadcrumb builder
  if (clean === '/') {
    return buildBreadcrumb(tFn, lang, ['home']).map(i => ({ label: i.label, href: addLanguagePrefix(i.href, lang) }));
  }
  if (clean === '/reports') {
    return buildBreadcrumb(tFn, lang, ['home', 'reports']).map(i => ({ label: i.label, href: addLanguagePrefix(i.href, lang) }));
  }
  if (clean.startsWith('/reports/market')) {
    const parts = clean.split('/').filter(Boolean);
    if (parts.length === 3) {
      // /reports/market
      return buildBreadcrumb(tFn, lang, ['home', 'reports', 'reports.market']).map(i => ({ label: i.label, href: addLanguagePrefix(i.href, lang) }));
    }
    if (parts.length >= 4) {
      // /reports/market/:slug
      const slug = parts[3];
      return buildBreadcrumb(tFn, lang, [
        'home',
        'reports',
        'reports.market',
        { label: slug.replace(/-/g, ' ').replace(/\b\w/g, s => s.toUpperCase()), href: `/reports/market/${slug}` }
      ]).map(i => ({ label: i.label, href: addLanguagePrefix(i.href, lang) }));
    }
  }
  if (clean === '/reports/expert') {
    return buildBreadcrumb(tFn, lang, ['home', 'reports', 'reports.expert']).map(i => ({ label: i.label, href: addLanguagePrefix(i.href, lang) }));
  }
  if (clean === '/resources') {
    return buildBreadcrumb(tFn, lang, ['home', 'resources']).map(i => ({ label: i.label, href: addLanguagePrefix(i.href, lang) }));
  }
  if (clean === '/devices') {
    return buildBreadcrumb(tFn, lang, ['home', 'devices']).map(i => ({ label: i.label, href: addLanguagePrefix(i.href, lang) }));
  }
  if (clean === '/manufacturers') {
    return buildBreadcrumb(tFn, lang, ['home', 'manufacturers']).map(i => ({ label: i.label, href: addLanguagePrefix(i.href, lang) }));
  }
  if (clean === '/compare') {
    return buildBreadcrumb(tFn, lang, ['home', 'compare']).map(i => ({ label: i.label, href: addLanguagePrefix(i.href, lang) }));
  }
  if (clean === '/pricing') {
    return buildBreadcrumb(tFn, lang, ['home', 'pricing']).map(i => ({ label: i.label, href: addLanguagePrefix(i.href, lang) }));
  }
  if (clean === '/about') {
    return buildBreadcrumb(tFn, lang, ['home', 'about']).map(i => ({ label: i.label, href: addLanguagePrefix(i.href, lang) }));
  }
  if (clean === '/contact') {
    return buildBreadcrumb(tFn, lang, ['home', 'contact']).map(i => ({ label: i.label, href: addLanguagePrefix(i.href, lang) }));
  }
  if (clean === '/glossary') {
    return buildBreadcrumb(tFn, lang, ['home', 'glossary']).map(i => ({ label: i.label, href: addLanguagePrefix(i.href, lang) }));
  }
  if (clean === '/resources/technology') {
    const items = buildBreadcrumb(tFn, lang, ['home', 'resources', 'technology']).map(i => ({ label: i.label, href: addLanguagePrefix(i.href, lang) }));
    const last = items[items.length - 1];
    if (last) last.href = addLanguagePrefix('/resources/technology', lang);
    return items;
  }
  // Fallback to heuristic builder for other routes
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs = [{ label: locale === 'zh' ? '首页' : 'Home', href: generateLocalizedURL('/', locale) }];
  let currentPath = '';
  segments.forEach((segment, index) => {
    if (index === 0 && ['zh', 'en', 'de', 'pt', 'es', 'fr', 'ru', 'ar'].includes(segment)) {
      return;
    }
    currentPath += `/${segment}`;
    let label = segment;
    switch (segment) {
      case 'devices':
        label = locale === 'zh' ? '设备' : 'Devices';
        break;
      case 'ct-scanners':
        label = locale === 'zh' ? 'CT扫描仪' : 'CT Scanners';
        break;
      case 'mri-scanners':
        label = locale === 'zh' ? 'MRI扫描仪' : 'MRI Scanners';
        break;
      case 'manufacturers':
        label = locale === 'zh' ? '制造商' : 'Manufacturers';
        break;
      case 'blog':
        label = locale === 'zh' ? '博客' : 'Blog';
        break;
      case 'history':
        label = locale === 'zh' ? '历史' : 'History';
        break;
      case 'learn':
        label = locale === 'zh' ? '学习' : 'Learn';
        break;
      case 'compare':
        label = locale === 'zh' ? '对比' : 'Compare';
        break;
      case 'reports':
        label = locale === 'zh' ? '报告' : 'Reports';
        break;
      case 'resources':
        label = locale === 'zh' ? '资源' : 'Resources';
        break;
      default: {
        const specLabel = formatSpecificationLabel(segment, locale);
        if (specLabel !== segment) {
          label = specLabel;
        } else {
          label = segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        }
        break;
      }
    }
    breadcrumbs.push({ label, href: generateLocalizedURL(currentPath, locale) });
  });
  return breadcrumbs;
};

// SEO helpers
export const generateMetaTags = (
  title: string,
  description: string,
  path: string,
  locale: string = 'en',
  image?: string
) => {
  const baseUrl = SITE_CONFIG.url;
  const url = `${baseUrl}${generateLocalizedURL(path, locale)}`;

  return {
    title,
    description,
    canonical: url,
    openGraph: {
      title,
      description,
      url,
      siteName: locale === 'zh' ? 'China CT Scanner - 医疗设备目录' : 'China CT Scanner - Medical Equipment Directory',
      images: image ? [{ url: image, width: 1200, height: 630 }] : [],
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
  };
};

// Route matching helpers
export const matchDeviceRoute = (path: string) => {
  const match = path.match(/^\/(?:zh\/)?devices\/(ct-scanners|mri-scanners)\/([^/]+)\/?$/);
  if (match) {
    return {
      category: match[1] === 'ct-scanners' ? 'ct' as const : 'mri' as const,
      slug: match[2]
    };
  }
  return null;
};

export const matchManufacturerRoute = (path: string) => {
  const match = path.match(/^\/(?:zh\/)?manufacturers\/([^/]+)\/?$/);
  if (match) {
    return { slug: match[1] };
  }
  return null;
};

export const matchArticleRoute = (path: string) => {
  const match = path.match(/^\/(?:zh\/)?blog\/([^/]+)\/?$/);
  if (match) {
    return { slug: match[1] };
  }
  return null;
};
