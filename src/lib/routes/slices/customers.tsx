import React, { lazy } from 'react';
import type { AnyRoute } from '@tanstack/react-router';
import { componentRoutes, componentRoutesWithLoader } from '@/lib/routes/builders';
import i18n from '@/lib/i18n';
import { generateCanonicalUrl, optimizeDescription } from '@/utils/seo';
import { db } from '@/lib/supabase';
import { getLanguageFromPath } from '@/utils/multilingualRoutes';
import { mapCustomer, type Customer } from '@/hooks/useSupabaseData';
import type { Tables } from '@/integrations/supabase/types';

const customerSearchSchema = (search: Record<string, unknown>) => {
  return {
    manufacturer: typeof search.manufacturer === 'string' ? search.manufacturer : undefined,
    country: typeof search.country === 'string' ? search.country : undefined,
    type: typeof search.type === 'string' ? search.type : undefined,
    size: typeof search.size === 'string' ? search.size : undefined,
    search: typeof search.search === 'string' ? search.search : undefined,
  };
};

export const customersRoutes = (
  rootRoute: AnyRoute,
  wrap: (el: React.ReactNode) => React.ReactNode
) => [
  ...componentRoutesWithLoader(
    rootRoute,
    '/customers',
    React.createElement(lazy(() => import('@/pages/Customers'))),
    async ({ queryClient }, params, location) => {
      const locale = getLanguageFromPath(location?.pathname || '/') || 'en';
      await queryClient.ensureQueryData({
        queryKey: ['supabase', 'customers', 'all', locale],
        queryFn: async () => {
           const { data } = await db.customers.getAll();
           if (!data) return [];
           return data.map((item: Tables<'customers'>) => mapCustomer(item, locale));
        },
      });
    },
    wrap,
    () => {
      const title = (i18n.language === 'zh' ? '客户列表' : 'Customer List');
      const descriptionBase = (i18n.t('customers.pageDescription') as string) || (i18n.t('customers.browseDescription') as string) || '';
      const description = optimizeDescription(descriptionBase, i18n.language);
      const canonical = generateCanonicalUrl('/customers', i18n.language);
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
    customerSearchSchema
  ),
  ...componentRoutes(
    rootRoute,
    '/customers/:id',
    React.createElement(lazy(() => import('@/pages/CustomerDetail'))),
    wrap,
    (ctx?: unknown) => {
      const c = (ctx || {}) as { params?: Record<string, string> };
      const id = String(c?.params?.id || '').trim();
      const path = id ? `/customers/${id}` : '/customers';
      const title = (i18n.language === 'zh' ? '客户详情' : 'Customer Detail');
      const descriptionBase = (i18n.language === 'zh'
        ? '查看医疗机构基本信息、设备采购历史与合作厂商'
        : 'View institution details, equipment purchase history and cooperating manufacturers');
      const description = optimizeDescription(descriptionBase, i18n.language);
      const canonical = generateCanonicalUrl(path, i18n.language);
      const ogImage = `${canonical.replace(/\/+$/, '')}/placeholder.svg`;
      return {
        title,
        meta: [
          { name: 'description', content: description },
          { property: 'og:title', content: title },
          { property: 'og:description', content: description },
          { property: 'og:type', content: 'profile' },
          { property: 'og:url', content: canonical },
          { property: 'og:image', content: ogImage },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: title },
          { name: 'twitter:description', content: description },
          { name: 'twitter:image', content: ogImage },
        ],
        links: [],
      };
    }
  ),
  ...componentRoutes(
    rootRoute,
    '/customers/map',
    React.createElement(lazy(() => import('@/pages/CustomerMap'))),
    wrap,
    () => {
      const title = (i18n.t('customers.mapTitle') as string) || (i18n.language === 'zh' ? '全球客户地图' : 'Global Customer Map');
      const descriptionBase = (i18n.t('customers.mapDescription') as string) || '';
      const description = optimizeDescription(descriptionBase, i18n.language);
      const canonical = generateCanonicalUrl('/customers/map', i18n.language);
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
    }
  ),
];
