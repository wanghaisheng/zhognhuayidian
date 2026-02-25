import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { getLocalizedSEOConfig, generateCanonicalUrl, optimizeDescription } from '@/utils/seo';
import i18n from '@/lib/i18n';
import { Suspense, lazy } from 'react';
import { PageLoader } from '@/components/molecules/LazyComponents';

const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));

export const Route = createFileRoute('/privacy')({
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <PrivacyPage />
    </Suspense>
  ),
  head: () => {
    const basePath = '/privacy';
    const localized = getLocalizedSEOConfig(i18n.language, basePath) || null;
    const title = (localized?.title as string) || (i18n.t('privacy.seo.title') as string) || (i18n.language === 'zh' ? '隐私政策' : 'Privacy Policy');
    const descriptionBase = (localized?.description as string) || (i18n.t('privacy.seo.description') as string) || '';
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
