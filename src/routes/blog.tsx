import { createFileRoute, defer } from '@tanstack/react-router';
import React, { lazy, Suspense } from 'react';
import { z } from 'zod';
import { PageLoader } from '@/components/molecules/LazyComponents';
import { getLanguageFromPath } from '@/utils/multilingualRoutes';
import { fetchArticlesAll } from '@/hooks/useSupabaseData';
import { markdownContentManager } from '@/lib/markdown';
import { buildPageHead } from '@/utils/seo';
import i18n from '@/lib/i18n';

const BlogPage = lazy(() => import('@/pages/BlogPage').then(m => ({ default: (m as unknown as Record<string, React.ComponentType<unknown>>).BlogPage })));

const blogSearchSchema = z.object({
  category: z.string().default('all').optional(),
});

export const Route = createFileRoute('/blog')({
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <BlogPage />
    </Suspense>
  ),
  loader: async ({ context, location }) => {
    const { queryClient } = context as { queryClient: import('@tanstack/react-query').QueryClient };
    const locale = getLanguageFromPath((location as { pathname?: string } | undefined)?.pathname || '/') || 'en';
    return {
      prefetch: defer(queryClient.ensureQueryData({
        queryKey: ['supabase', 'articles', 'all', locale],
        queryFn: async () => {
          const { data } = await fetchArticlesAll();
          return Array.isArray(data) ? data : [];
        },
        staleTime: 5 * 60_000,
      })),
    };
  },
  loaderDeps: ({ search }) => ({
    category: search.category || 'all',
  }),
  head: () => buildPageHead('/blog', i18n.language, {
    title: i18n.language === 'zh' ? '博客' : 'Blog',
    description: i18n.t('blog.description') as string
  }),
  validateSearch: blogSearchSchema,
});
