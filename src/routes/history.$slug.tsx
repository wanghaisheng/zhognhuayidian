import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { markdownContentManager } from '@/lib/markdown';
import { getLanguageFromPath } from '@/utils/multilingualRoutes';
import { buildArticleHead } from '@/utils/seo';
import i18n from '@/lib/i18n';
import { Suspense, lazy } from 'react';
import { PageLoader } from '@/components/molecules/LazyComponents';

const HistoryDetailPage = lazy(() => import('@/pages/HistoryDetailPage').then(m => ({ default: (m as unknown as Record<string, React.ComponentType<unknown>>).HistoryDetailPage })));

export const Route = createFileRoute('/history/$slug')({
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <HistoryDetailPage />
    </Suspense>
  ),
  loader: async ({ context, params, location }) => {
    const { queryClient } = context as { queryClient: import('@tanstack/react-query').QueryClient };
    const locale = getLanguageFromPath((location as { pathname?: string } | undefined)?.pathname || '/');
    const slug = params.slug;
    const content = await queryClient.ensureQueryData({
      queryKey: ['markdown', 'history', slug, locale],
      queryFn: async () => await markdownContentManager.getContent('history', slug, locale),
    });
    queryClient.prefetchQuery({
      queryKey: ['markdown', 'history', 'list', locale],
      queryFn: async () => await markdownContentManager.getContentList('history', locale),
    });
    const md = content as Awaited<ReturnType<typeof markdownContentManager.getContent>>;
    const fm = md?.frontMatter;
    const seo = (fm?.seo || {}) as Record<string, unknown>;
    const title = (seo.title as string) || (fm?.title as string) || '';
    const descriptionBase = (seo.description as string) || (fm?.description as string) || '';
    const image = (seo.image as string) || '';
    const canonical = `/history/${slug}`;
    return {
      seo: {
        title,
        description: descriptionBase,
        image,
        canonical,
        slug,
        locale,
      },
    };
  },
  head: (ctx) => {
    const data = ((ctx as unknown as { loaderData?: unknown })?.loaderData as { seo?: Record<string, unknown> } | undefined)?.seo ?? {} as Record<string, unknown>;
    const title = (data.title as string) || '';
    const description = (data.description as string) || '';
    const canonicalPath = (data.canonical as string) || (data.slug ? `/history/${String(data.slug)}` : '/history');
    const lang = (data.locale as string) || i18n.language;
    return buildArticleHead(canonicalPath, lang, { title, description, image: data.image as string | undefined });
  },
});
