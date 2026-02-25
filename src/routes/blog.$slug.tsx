import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { getLanguageFromPath } from '@/utils/multilingualRoutes';
import {
  getArticlesAllQueryKey,
  fetchArticlesAll,
  getArticlesByCategoryQueryKey,
  fetchArticlesByCategory,
  fetchArticleBySlug,
  getArticleBySlugQueryKey,
  mapLocalizedFields,
} from '@/hooks/useSupabaseData';
import { buildArticleHead } from '@/utils/seo';
import i18n from '@/lib/i18n';
import { Suspense, lazy } from 'react';
import { PageLoader } from '@/components/molecules/LazyComponents';

const BlogPostPage = lazy(() => import('@/pages/BlogPostPage'));

export const Route = createFileRoute('/blog/$slug')({
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <BlogPostPage />
    </Suspense>
  ),
  loader: async ({ context, params, location }) => {
    const { queryClient } = context as { queryClient: import('@tanstack/react-query').QueryClient };
    const locale = getLanguageFromPath((location as { pathname?: string } | undefined)?.pathname || '/');
    const slug = params.slug;
    const article = await queryClient.ensureQueryData({
      queryKey: getArticleBySlugQueryKey(slug, locale),
      queryFn: async () => {
        const { data } = await fetchArticleBySlug(slug);
        if (!data) {
          return null;
        }
        return mapLocalizedFields(data as Record<string, unknown>, locale);
      },
    });
    const data = article as Record<string, unknown> | null;
    const category = ((data?.category as string) || '').toLowerCase();
    const validCats = new Set(['analysis', 'history', 'technology', 'market', 'guide']);
    if (validCats.has(category)) {
      queryClient.prefetchQuery({
        queryKey: getArticlesByCategoryQueryKey(category, locale),
        queryFn: async () => (await fetchArticlesByCategory(category)).data || [],
        staleTime: 5 * 60_000,
      });
    } else {
      queryClient.prefetchQuery({
        queryKey: getArticlesAllQueryKey(locale),
        queryFn: async () => (await fetchArticlesAll()).data || [],
        staleTime: 5 * 60_000,
      });
    }
    const title = (data?.title as string) || '';
    const descriptionBase = (data?.excerpt as string) || '';
    const image = (data?.featured_image as string) || '';
    const canonical = `/blog/${slug}`;
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
    const canonicalPath = (data.canonical as string) || (data.slug ? `/blog/${String(data.slug)}` : '/blog');
    const lang = (data.locale as string) || i18n.language;
    return buildArticleHead(canonicalPath, lang, { title, description, image: data.image as string | undefined });
  },
});
