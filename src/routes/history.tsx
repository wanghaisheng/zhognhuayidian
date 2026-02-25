import * as React from 'react';
import { createFileRoute, defer } from '@tanstack/react-router';
import { buildPageHead } from '@/utils/seo';
import { getLanguageFromPath } from '@/utils/multilingualRoutes';
import { markdownContentManager } from '@/lib/markdown';
import i18n from '@/lib/i18n';
import { Suspense, lazy } from 'react';
import { PageLoader } from '@/components/molecules/LazyComponents';

const HistoryPage = lazy(() => import('@/pages/HistoryPage').then(m => ({ default: (m as unknown as Record<string, React.ComponentType<unknown>>).HistoryPage })));

export const Route = createFileRoute('/history')({
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <HistoryPage />
    </Suspense>
  ),
  loader: async ({ context, location }) => {
    const { queryClient } = context as { queryClient: import('@tanstack/react-query').QueryClient };
    const locale = getLanguageFromPath((location as { pathname?: string } | undefined)?.pathname || '/');
    return {
      prefetch: defer(queryClient.ensureQueryData({
        queryKey: ['markdown', 'history', 'list', locale],
        queryFn: async () => await markdownContentManager.getContentList('history', locale),
      })),
    };
  },
  head: (ctx) => {
    const pathname = ((ctx as unknown as { location?: { pathname?: string } })?.location?.pathname) || '/';
    const lang = getLanguageFromPath(pathname);
    return buildPageHead('/history', lang, {
      title: i18n.t('history.ctDevelopment') as string,
      description: i18n.t('history.description') as string,
    });
  },
});
