import * as React from 'react';
import { createFileRoute, defer } from '@tanstack/react-router';
import { z } from 'zod';
import { getLocalizedSEOConfig, generateCanonicalUrl, optimizeDescription } from '@/utils/seo';
import i18n from '@/lib/i18n';
import { Suspense, lazy } from 'react';
import { PageLoader } from '@/components/molecules/LazyComponents';
import { getLanguageFromPath } from '@/utils/multilingualRoutes';
import { markdownContentManager } from '@/lib/markdown';

const GlossaryPage = lazy(() => import('@/pages/GlossaryPage'));

const glossarySearchSchema = z.object({
  search: z.string().optional(),
});

export const Route = createFileRoute('/glossary')({
  loader: async ({ context, location }) => {
    const { queryClient } = context as { queryClient: import('@tanstack/react-query').QueryClient };
    const locale = getLanguageFromPath((location as { pathname?: string } | undefined)?.pathname || '/') || 'en';
    return {
      prefetch: defer(queryClient.ensureQueryData({
        queryKey: ['markdown', 'glossary', 'list', locale],
        queryFn: async () => await markdownContentManager.getContentList('glossary', locale),
        staleTime: 15 * 60_000,
      })),
    };
  },
  loaderDeps: ({ search }) => ({
    search: search.search || '',
  }),
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <GlossaryPage />
    </Suspense>
  ),
  head: () => {
    const basePath = '/glossary';
    const localized = getLocalizedSEOConfig(i18n.language, basePath) || null;
    const title = (localized?.title as string) || (i18n.t('glossary.seo.title') as string) || (i18n.language === 'zh' ? '术语表' : 'Glossary');
    const descriptionBase = (localized?.description as string) || (i18n.t('glossary.seo.description') as string) || '';
    const description = optimizeDescription(descriptionBase, i18n.language);
    const canonical = generateCanonicalUrl(basePath, i18n.language);
    const ogImage = `${canonical.replace(/\/+$/, '')}/placeholder.svg`;
    return {
      title,
      meta: [
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
      links: [],
    };
  },
  validateSearch: glossarySearchSchema,
});
