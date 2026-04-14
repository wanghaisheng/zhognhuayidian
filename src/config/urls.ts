/**
 * URL 配置
 * 
 * 集中管理应用中的 URL，便于维护和环境切换
 */

// === 应用基础 URL ===
export const APP_URLS = {
  // 生产环境
  PRODUCTION: 'https://chinactscanner.org',
  // 开发环境
  DEVELOPMENT: 'http://localhost:5173',
  // CDN URL
  CDN: 'https://chinactscanner.org',
} as const;

// === API 端点 ===
export const API_ENDPOINTS = {
  // Supabase
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  // 其他 API
  ANALYTICS: '/api/analytics',
  SEARCH: '/api/search',
} as const;

// === 社交媒体 URL ===
export const SOCIAL_URLS = {
  TWITTER: 'https://twitter.com/chinactscanner',
  LINKEDIN: 'https://linkedin.com/company/chinactscanner',
  FACEBOOK: 'https://facebook.com/chinactscanner',
  YOUTUBE: 'https://youtube.com/@chinactscanner',
} as const;

// === 外部资源 URL ===
export const EXTERNAL_RESOURCES = {
  // sql.js CDN
  SQLJS_CDN: 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js',
  SQLJS_WASM: 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.wasm',
  // 其他 CDN
  TAILWIND_CSS: 'https://cdn.tailwindcss.com',
} as const;

// === 路由路径 ===
export const ROUTE_PATHS = {
  HOME: '/',
  DEVICES: '/devices',
  MANUFACTURERS: '/manufacturers',
  PRICING: '/pricing',
  COMPARE: '/compare',
  REPORTS: '/reports',
  LEARN: '/learn',
  RESOURCES: '/resources',
  ABOUT: '/about',
  CONTACT: '/contact',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  BLOG: '/blog',
} as const;

// === 资源路径 ===
export const RESOURCE_PATHS = {
  IMAGES: '/assets/images',
  ICONS: '/assets/icons',
  FONTS: '/assets/fonts',
  DOCUMENTS: '/assets/documents',
} as const;

// === 获取当前应用 URL ===
export function getAppUrl(): string {
  if (import.meta.env.PROD) {
    return APP_URLS.PRODUCTION;
  }
  return APP_URLS.DEVELOPMENT;
}

// === 构建完整 URL ===
export function buildUrl(path: string, baseUrl?: string): string {
  const base = baseUrl || getAppUrl();
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
}

// === 构建资源 URL ===
export function buildResourcePath(path: string, type: keyof typeof RESOURCE_PATHS = 'IMAGES'): string {
  return `${RESOURCE_PATHS[type]}${path.startsWith('/') ? '' : '/'}${path}`;
}
