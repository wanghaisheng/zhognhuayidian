import React from 'react';
import { RouterProvider } from '@tanstack/react-router';
import { createAppRouter } from './router.create';

export const AppRouterProvider = () => {
  const router = React.useMemo(() => createAppRouter(), []);
  return <RouterProvider router={router} />;
};

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}
