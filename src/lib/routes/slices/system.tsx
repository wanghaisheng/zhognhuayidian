import React from 'react';
import type { AnyRoute } from '@tanstack/react-router';
import { createRoute } from '@tanstack/react-router';
import Dashboard from '@/pages/Dashboard';
import AdminAuthGuard from '@/components/auth/AdminAuthGuard';
import AdminDashboard from '@/pages/admin/Dashboard';
import SettingsPage from '@/pages/admin/SettingsPage';
import ContentManagementPage from '@/pages/ContentManagementPage';
import i18n from '@/lib/i18n';
import { generateCanonicalUrl, optimizeDescription } from '@/utils/seo';

export const systemRoutes = (rootRoute: AnyRoute) => [
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/dashboard',
    component: () => <Dashboard />,
    head: () => {
      const title = (i18n.language === 'zh' ? '数据面板' : 'Dashboard');
      const descriptionBase = (i18n.language === 'zh'
        ? '查看询价趋势、客户转化与设备偏好概览'
        : 'View inquiry trends, customer conversions and device preferences overview');
      const description = optimizeDescription(descriptionBase, i18n.language);
      const canonical = generateCanonicalUrl('/dashboard', i18n.language);
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
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/admin',
    component: () => <AdminAuthGuard><AdminDashboard /></AdminAuthGuard>,
    head: () => {
      const title = (i18n.t('admin.dashboard') as string) || (i18n.language === 'zh' ? '管理后台' : 'Admin');
      const descriptionBase = (i18n.language === 'zh'
        ? '内容管理系统的概览与系统健康状态'
        : 'Overview of the content management system and system health status');
      const description = optimizeDescription(descriptionBase, i18n.language);
      const canonical = generateCanonicalUrl('/admin', i18n.language);
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
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/admin/settings',
    component: () => <AdminAuthGuard><SettingsPage /></AdminAuthGuard>,
    head: () => {
      const title = (i18n.t('admin.settings') as string) || (i18n.language === 'zh' ? '系统设置' : 'Settings');
      const descriptionBase = (i18n.language === 'zh'
        ? '管理系统配置与内容管理参数'
        : 'Manage system configurations and content management parameters');
      const description = optimizeDescription(descriptionBase, i18n.language);
      const canonical = generateCanonicalUrl('/admin/settings', i18n.language);
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
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/content-management',
    component: () => <ContentManagementPage />,
    head: () => {
      const title = (i18n.t('contentManagement.title') as string) || (i18n.language === 'zh' ? '内容管理' : 'Content Management');
      const descriptionBase = (i18n.language === 'zh'
        ? '查看内容概览、验证结果与系统状态'
        : 'View content overview, validation results and system status');
      const description = optimizeDescription(descriptionBase, i18n.language);
      const canonical = generateCanonicalUrl('/content-management', i18n.language);
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
  }),
];
