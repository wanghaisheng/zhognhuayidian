// Multilingual routing utility functions - based on dynamic configuration
import { 
  LANGUAGES, 
  DEFAULT_LANGUAGE, 
  LANGUAGE_CONFIG,
  SupportedLanguage, 
  getLanguagePrefix, 
  isDefaultLanguage,
  getNonDefaultPrefixes,
  getLanguageConfig
} from '@/config/language';
import { SITE_CONFIG } from '@/config/site';

export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  children?: RouteConfig[];
}

// Base route configuration (without language prefix)
export const baseRoutes = [
  '/',
  '/devices',
  '/devices/:id',
  '/manufacturers',
  '/manufacturers/:id',
  '/customers',
  '/customers/:id',
  '/resources',
  '/resources/technology',
  '/reports',
  '/reports/market', 
  '/reports/expert',
  '/about',
  '/contact',
  '/glossary'
];

// Generate all language versions for each base route
export const generateMultilingualRoutes = (routes: string[]): string[] => {
  const multilingualRoutes: string[] = [];
  
  routes.forEach(route => {
    LANGUAGES.forEach(lang => {
      if (lang.prefix === '') {
        // Default language without prefix
        multilingualRoutes.push(route);
      } else if (route === '/') {
        // Language version of homepage
        multilingualRoutes.push(lang.prefix);
      } else {
        // Other pages with language prefix
        multilingualRoutes.push(`${lang.prefix}${route}`);
      }
    });
  });
  
  return multilingualRoutes;
};

// Get language version from current path
export const getLanguageFromPath = (pathname: string): SupportedLanguage => {
  const segments = pathname.split('/').filter(Boolean);
  const nonDefaultPrefixes = getNonDefaultPrefixes();
  
  // Check if path starts with any non-default language prefix
  if (segments.length > 0 && nonDefaultPrefixes.includes(segments[0])) {
    const lang = LANGUAGES.find(l => l.prefix === `/${segments[0]}`);
    if (lang) {
      return lang.code as SupportedLanguage;
    }
  }
  
  // Default to default language
  return DEFAULT_LANGUAGE.code as SupportedLanguage;
};

// Remove language prefix from path
export const removeLanguagePrefix = (pathname: string): string => {
  const segments = pathname.split('/').filter(Boolean);
  const nonDefaultPrefixes = getNonDefaultPrefixes();
  
  // If first segment is language prefix, remove it
  if (segments.length > 0 && nonDefaultPrefixes.includes(segments[0])) {
    return '/' + segments.slice(1).join('/') || '/';
  }
  
  return pathname;
};

// Add language prefix to path
export const addLanguagePrefix = (pathname: string, language: SupportedLanguage): string => {
  const cleanPath = removeLanguagePrefix(pathname);
  const prefix = getLanguagePrefix(language);
  
  // Default language has no prefix
  if (prefix === '') {
    return cleanPath;
  }
  
  // Other languages add prefix
  return `${prefix}${cleanPath === '/' ? '' : cleanPath}`;
};

// Get all language versions of a path
export const getAlternateLanguagePaths = (pathname: string): Record<string, string> => {
  const cleanPath = removeLanguagePrefix(pathname);
  const result: Record<string, string> = {};
  
  LANGUAGES.forEach(lang => {
    if (lang.prefix === '') {
      result[lang.code] = cleanPath;
    } else {
      result[lang.code] = `${lang.prefix}${cleanPath === '/' ? '' : cleanPath}`;
    }
  });
  
  return result;
};

// Backward compatibility: get alternate language versions of path (zh and en only)
export const getAlternateLanguagePath = (pathname: string): { zh: string; en: string } => {
  const paths = getAlternateLanguagePaths(pathname);
  return {
    zh: paths.zh || pathname,
    en: paths.en || pathname
  };
};

// Generate hreflang links (with full URLs)
export const generateHreflangLinks = (pathname: string, baseUrl: string = SITE_CONFIG.url): Array<{ href: string; hreflang: string }> => {
  const alternates = getAlternateLanguagePaths(pathname);
  
  const links = LANGUAGES.map(lang => ({
    href: `${baseUrl}${alternates[lang.code]}`,
    hreflang: lang.hreflang
  }));
  
  // Add x-default pointing to default language
  links.push({
    href: `${baseUrl}${alternates[DEFAULT_LANGUAGE.code]}`,
    hreflang: 'x-default'
  });
  
  return links;
};

// Detect old URL format (/en/*) and return new URL
export const migrateOldEnUrl = (pathname: string): string | null => {
  const segments = pathname.split('/').filter(Boolean);
  // Detect old /en/* format (since en is now default language without prefix)
  if (segments.length > 0 && segments[0] === 'en') {
    // Remove /en prefix, return new URL without prefix
    const newPath = '/' + segments.slice(1).join('/') || '/';
    return newPath;
  }
  return null;
};

// Generate all language version route paths for a single route path
export const generateLanguageRoutePaths = (basePath: string): string[] => {
  return LANGUAGES.map(lang => {
    if (lang.prefix === '') {
      return basePath;
    }
    return basePath === '/' ? lang.prefix : `${lang.prefix}${basePath}`;
  });
};
