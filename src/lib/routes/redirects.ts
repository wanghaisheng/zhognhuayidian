import { createRoute, redirect } from '@tanstack/react-router';
import type { AnyRoute } from '@tanstack/react-router';
import { addLangPath } from './langPaths';

export const redirectRoutes = (
  rootRoute: AnyRoute,
  from: string,
  to: string
) =>
  addLangPath(from).map(path =>
    createRoute({
      getParentRoute: () => rootRoute,
      path: path.replace(/:([a-zA-Z]+)/g, '$$$1'),
      beforeLoad: () => {
        throw redirect({ to: to.replace(/:([a-zA-Z]+)/g, '$$$1') });
      },
      component: () => null,
    })
  );
