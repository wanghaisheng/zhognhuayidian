import React, { lazy } from 'react';
import type { AnyRoute } from '@tanstack/react-router';
import { componentRoutes } from '@/lib/routes/builders';
import i18n from '@/lib/i18n';
import { generateCanonicalUrl, optimizeDescription } from '@/utils/seo';

const pricingCalculatorSearchSchema = (search: Record<string, unknown>) => {
  return {
    spec: typeof search.spec === 'string' ? search.spec : undefined,
    manufacturer: typeof search.manufacturer === 'string' ? search.manufacturer : undefined,
    condition: typeof search.condition === 'string' ? search.condition : undefined,
    region: typeof search.region === 'string' ? search.region : undefined,
  };
};

export const pricingRoutes = (
  rootRoute: AnyRoute,
  wrap: (el: React.ReactNode) => React.ReactNode
) => [
  ...componentRoutes(
    rootRoute,
    '/pricing',
    React.createElement(lazy(() => import('@/pages/DynamicPricingPage').then(m => ({ default: m.default || m })) )),
    wrap,
    () => {
      const title = i18n.t('header.pricing') + ' - CT Scanner Compass';
      const descBase = i18n.t('premiumReports.meta.description');
      const desc = optimizeDescription(descBase, i18n.language);
      const canonical = generateCanonicalUrl('/pricing', i18n.language);
      const ogImage = `${canonical.replace(/\/+$/, '')}/placeholder.svg`;
      return {
        title,
        meta: [
          { name: 'description', content: desc },
          { property: 'og:title', content: title },
          { property: 'og:description', content: desc },
          { property: 'og:type', content: 'website' },
          { property: 'og:url', content: canonical },
          { property: 'og:image', content: ogImage },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: title },
          { name: 'twitter:description', content: desc },
          { name: 'twitter:image', content: ogImage },
        ],
        links: [],
      };
    },
    pricingCalculatorSearchSchema
  ),
  ...componentRoutes(
    rootRoute,
    '/pricing/:priceType',
    React.createElement(lazy(() => import('@/pages/DynamicPricingPage').then(m => ({ default: m.default || m })) )),
    wrap,
    (ctx?: unknown) => {
      const c = (ctx || {}) as { params?: Record<string, string> };
      const model = String(c?.params?.priceType || '').trim();
      const path = model ? `/pricing/${model}` : '/pricing';
      const title = (i18n.language === 'zh'
        ? '价格行情 - CT/MRI'
        : 'Pricing - CT/MRI');
      const descBase = i18n.t('premiumReports.meta.description');
      const canonical = generateCanonicalUrl(path, i18n.language);
      const desc = optimizeDescription(descBase, i18n.language);
      const ogImage = `${canonical.replace(/\/+$/, '')}/placeholder.svg`;
      return {
        title,
        meta: [
          { name: 'description', content: desc },
          { property: 'og:title', content: title },
          { property: 'og:description', content: desc },
          { property: 'og:type', content: 'website' },
          { property: 'og:url', content: canonical },
          { property: 'og:image', content: ogImage },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: title },
          { name: 'twitter:description', content: desc },
          { name: 'twitter:image', content: ogImage },
        ],
        links: [],
      };
    },
    pricingCalculatorSearchSchema
  ),
];
