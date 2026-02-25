import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { getLocalizedSEOConfig, generateCanonicalUrl, optimizeDescription } from '@/utils/seo';
import i18n from '@/lib/i18n';
import { Suspense, lazy } from 'react';
import { PageLoader } from '@/components/molecules/LazyComponents';

const TermsPage = lazy(() => import('@/pages/TermsPage'));

export const Route = createFileRoute('/terms')({
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <TermsPage />
    </Suspense>
  ),
  head: () => {
    const basePath = '/terms';
    const localized = getLocalizedSEOConfig(i18n.language, basePath) || null;
    const title = (localized?.title as string) || (i18n.t('terms.seo.title') as string) || (i18n.language === 'zh' ? '服务条款' : 'Terms');
    const descriptionBase = (localized?.description as string) || (i18n.t('terms.seo.description') as string) || '';
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
});
