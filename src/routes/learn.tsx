import * as React from 'react';
import { createFileRoute, defer } from '@tanstack/react-router';
import { buildPageHead } from '@/utils/seo';
import i18n from '@/lib/i18n';
import { Suspense, lazy } from 'react';
import { PageLoader } from '@/components/molecules/LazyComponents';
import { getLanguageFromPath } from '@/utils/multilingualRoutes';
import { markdownContentManager } from '@/lib/markdown';

const LearnCenterPage = lazy(() => import('@/pages/LearnCenterPage'));

export const Route = createFileRoute('/learn')({
  loader: async ({ context, location }) => {
    const { queryClient } = context as { queryClient: import('@tanstack/react-query').QueryClient };
    const locale = getLanguageFromPath((location as { pathname?: string } | undefined)?.pathname || '/') || 'en';
    return {
      prefetch: defer(queryClient.ensureQueryData({
        queryKey: ['markdown', 'learn', 'list', locale],
        queryFn: async () => await markdownContentManager.getContentList('learn', locale),
        staleTime: 5 * 60_000,
      })),
    };
  },
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <LearnCenterPage />
    </Suspense>
  ),
  head: () => buildPageHead('/learn', i18n.language, {
    title: i18n.language === 'zh' ? '学习中心' : 'Learn',
    description: i18n.language === 'zh'
      ? '买方视角的 CT/MRI 学习资源：规格解析、总拥有成本与维保、流程优化与患者体验。'
      : 'Buyer-focused CT/MRI learning resources: specs, total cost, service and workflow.'
  }),
});
