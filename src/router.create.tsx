import { createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import { routeTree } from './routeTree.gen';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './lib/i18n';

export type CreateAppRouterOptions = {
  history?: NonNullable<Parameters<typeof createRouter>[0]>['history'];
};

export function createAppRouter(opts?: CreateAppRouterOptions) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
      },
    },
  });
  const router = createRouter({
    routeTree,
    history: opts?.history,
    context: { queryClient },
    defaultPreload: 'intent',
    defaultPreloadDelay: 100,
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
    // 临时禁用SSR以解决hydration问题
    dehydrate: () => undefined,
    hydrate: () => {},
    Wrap: ({ children }) => (
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </I18nextProvider>
    ),
  });
  setupRouterSsrQueryIntegration({
    router,
    queryClient,
    wrapQueryClient: false,
  });
  return router;
}
