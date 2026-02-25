import { TFunction } from 'i18next';
import { addLanguagePrefix } from '@/utils/multilingualRoutes';
import { SupportedLanguage } from '@/config/language';
import { generateBreadcrumbSchema } from '@/lib/structuredData';

export type BreadcrumbItem = { label: string; href: string };

type Key =
  | 'home'
  | 'reports'
  | 'reports.market'
  | 'reports.expert'
  | 'resources'
  | 'resources.guides'
  | 'technology'
  | 'devices'
  | 'manufacturers'
  | 'compare'
  | 'pricing'
  | 'about'
  | 'contact'
  | 'glossary';

const map: Record<Key, { key: string; path: string }> = {
  home: { key: 'common.home', path: '/' },
  reports: { key: 'reports.hero.title', path: '/reports' },
  'reports.market': { key: 'marketAnalysis.title', path: '/reports/market' },
  'reports.expert': { key: 'expertAnalysis.title', path: '/reports/expert' },
  resources: { key: 'common.resources', path: '/resources' },
  'resources.guides': { key: 'guides.title', path: '/resources/guides' },
  technology: { key: 'header.technology', path: '/resources/technology' },
  devices: { key: 'header.devices', path: '/devices' },
  manufacturers: { key: 'header.manufacturers', path: '/manufacturers' },
  compare: { key: 'header.compare', path: '/compare' },
  pricing: { key: 'header.pricing', path: '/pricing' },
  about: { key: 'header.about', path: '/about' },
  contact: { key: 'header.contact', path: '/contact' },
  glossary: { key: 'glossary.title', path: '/glossary' }
};

export function resolveItem(t: TFunction, lang: SupportedLanguage, key: Key): BreadcrumbItem {
  const { key: labelKey, path } = map[key];
  return { label: t(labelKey), href: addLanguagePrefix(path, lang) };
}

export function buildBreadcrumb(
  t: TFunction,
  lang: SupportedLanguage,
  trail: Array<Key | BreadcrumbItem>
): BreadcrumbItem[] {
  return trail.map((item) =>
    typeof item === 'string' ? resolveItem(t, lang, item as Key) : { label: item.label, href: addLanguagePrefix(item.href, lang) }
  );
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return generateBreadcrumbSchema(items);
}
