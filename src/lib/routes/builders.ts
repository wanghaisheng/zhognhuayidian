import React from 'react';
import { createRoute } from '@tanstack/react-router';
import type { AnyRoute } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
import { addLangPath } from './langPaths';

type HeadConfig = {
  title?: string;
  meta?: Array<Record<string, unknown>>;
  links?: Array<Record<string, unknown>>;
  styles?: Array<Record<string, unknown>>;
  scripts?: Array<Record<string, unknown>>;
};

type LoaderDepsContext = {
  params?: Record<string, string>;
  location?: { pathname?: string };
};

export const defaultLoaderDeps = ({ params, location }: LoaderDepsContext) => ({
  pathname: location?.pathname || '/',
  params: params || {},
});

export const componentRoutes = (
  rootRoute: AnyRoute,
  basePath: string,
  component: React.ReactNode,
  wrap: (el: React.ReactNode) => React.ReactNode,
  head?: (ctx?: unknown) => HeadConfig,
  validateSearch?: (search: Record<string, unknown>) => Record<string, unknown>
) =>
  addLangPath(basePath).map(path =>
    createRoute({
      getParentRoute: () => rootRoute,
      path: path.replace(/:([a-zA-Z]+)/g, '$$$1'),
      component: () => wrap(component),
      head,
      validateSearch,
    })
  );

export const componentRoutesWithLoader = (
  rootRoute: AnyRoute,
  basePath: string,
  component: React.ReactNode,
  loader: (ctx: { queryClient: QueryClient }, params: Record<string, string>, location?: { pathname: string }) => Promise<unknown> | unknown,
  wrap: (el: React.ReactNode) => React.ReactNode,
  head?: (ctx?: unknown) => HeadConfig,
  validateSearch?: (search: Record<string, unknown>) => Record<string, unknown>,
  loaderDeps?: (ctx: { params: Record<string, string>; location?: { pathname: string } }) => unknown
) =>
  addLangPath(basePath).map(path =>
    createRoute({
      getParentRoute: () => rootRoute,
      path: path.replace(/:([a-zA-Z]+)/g, '$$$1'),
      loader: async ({ context, params, location }) => {
        await loader(
          context as unknown as { queryClient: QueryClient },
          params as Record<string, string>,
          location as { pathname: string }
        );
      },
      loaderDeps: ({ params, location }) =>
        (loaderDeps || defaultLoaderDeps)({
          params: params as Record<string, string>,
          location: location as { pathname?: string },
        }),
      component: () => wrap(component),
      head,
      validateSearch,
    })
  );
