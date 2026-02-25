import React from 'react';
import type { AnyRoute } from '@tanstack/react-router';
import { componentRoutes } from '@/lib/routes/builders';
import i18n from '@/lib/i18n';
import { buildPageHead } from '@/utils/seo';
import Index from '@/pages/Index';

export const homeRoutes = (
  rootRoute: AnyRoute,
  wrap: (el: React.ReactNode) => React.ReactNode
) => [
  ...componentRoutes(
    rootRoute,
    '/',
    React.createElement(Index),
    wrap,
    () => buildPageHead('/', i18n.language)
  ),
];
