import { createRoot, hydrateRoot } from 'react-dom/client'
import { AppRouterProvider } from './router.tsx'
import './index.css'

const rootElement = document.getElementById("root");

if (rootElement) {
  // 检查是否已经被 react-snap 预渲染
  // 如果有子节点，说明是预渲染的 HTML，使用 hydrate
  // 否则使用正常的 render
  if (rootElement.hasChildNodes()) {
    hydrateRoot(rootElement, <AppRouterProvider />);
  } else {
    createRoot(rootElement).render(<AppRouterProvider />);
  }
}
