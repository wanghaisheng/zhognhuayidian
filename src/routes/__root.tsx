import * as React from 'react';
import { createRootRoute } from '@tanstack/react-router';
import App from '@/App';
import { getLanguageFromPath, removeLanguagePrefix } from '@/utils/multilingualRoutes';
import { generateCanonicalUrl, generateHreflangLinks, getSectionFallbackSEO, optimizeDescription } from '@/utils/seo';
import { DEFAULT_LANGUAGE } from '@/config/language';

export const Route = createRootRoute({
  component: () => <App />,
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
