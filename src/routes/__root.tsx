import * as React from 'react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import App from '@/App';
import { getLanguageFromPath, removeLanguagePrefix } from '@/utils/multilingualRoutes';
import { generateCanonicalUrl, generateHreflangLinks, getSectionFallbackSEO, optimizeDescription } from '@/utils/seo';
import { DEFAULT_LANGUAGE } from '@/config/language';
import { useTranslation } from 'react-i18next';

// 404页面组件
const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          {t('common.pageNotFound', 'Page Not Found')}
        </h2>
        <p className="text-gray-600 mb-8">
          {t('common.pageNotFoundDesc', 'The page you are looking for does not exist or has been moved.')}
        </p>
        <a 
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t('common.goHome', 'Go Home')}
        </a>
      </div>
    </div>
  );
};

export const Route = createRootRoute({
  component: () => <App />,
  notFoundComponent: NotFound,
  head: (ctx?: unknown) => {
    const anyCtx = (ctx || {}) as Record<string, unknown>;
    const routerInst = anyCtx.router as unknown;
    const routerPath = (routerInst && (routerInst as { state?: { location?: { pathname?: string } } }).state?.location?.pathname) as string | undefined;
    const ctxPath = (anyCtx.location as { pathname?: string } | undefined)?.pathname;
    const pathname = routerPath || ctxPath || '/';
    const cleanPath = removeLanguagePrefix(pathname);
    const legacyMap: Record<string, string> = {
      '/brands': '/manufacturers',
      '/knowledge': '/resources',
      '/knowledge/history': '/history',
      '/guides': '/resources',
      '/tags': '/devices',
      '/manufacturers-old': '/manufacturers',
    };
    const mappedBasePath = legacyMap[cleanPath] || cleanPath;
    const locale = getLanguageFromPath(pathname) || 'en';
    const canonical = generateCanonicalUrl(mappedBasePath, locale);
    const allAlternates = generateHreflangLinks(mappedBasePath);
    const filtered = (locale === DEFAULT_LANGUAGE.code) ? allAlternates : allAlternates.filter(l => l.hreflang !== 'x-default');
    const zhAlias = locale !== 'zh' ? filtered.filter(l => String(l.hreflang).toLowerCase() === 'zh-hans').map(l => ({ href: l.href, hreflang: 'zh' })) : [];
    const alternates = [...filtered, ...zhAlias];
    const sectionSEO = getSectionFallbackSEO(mappedBasePath, locale as 'en' | 'zh');
    const title = sectionSEO.title;
    const description = optimizeDescription(sectionSEO.description, locale as 'en' | 'zh');
    const ogImage = `${canonical.replace(/\/+$/, '')}/placeholder.svg`;
    return {
      title,
      meta: [
        { name: 'description', content: description },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
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
  }
});
