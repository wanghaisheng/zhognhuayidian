import { hydrateRoot, createRoot } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import './index.css';
import i18n from './lib/i18n';
import { createAppRouter } from './router.create';

const rootEl = document.getElementById('root');
if (rootEl) {
  const router = createAppRouter();
  
  // 完全跳过SSR，直接使用CSR
  const element = <RouterProvider router={router} />;
  createRoot(rootEl).render(element);
}
