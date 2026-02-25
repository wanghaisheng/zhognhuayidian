import { LANGUAGE_CONFIG, type SupportedLanguage } from '@/config/language';
const allSeoModules = import.meta.glob('../locales/*/seo/**/index.ts', { eager: true }) as Record<string, unknown>;

function normalizeRouteFromFile(filePath: string) {
  const p = filePath.replace(/\\/g, '/');
  const m = p.match(/\/seo\/(.*)\/index\.ts$/);
  const seg = m ? m[1] : '';
  if (!seg || seg === '') return '/';
  const route = `/${seg}`;
  return route.startsWith('//') ? route.slice(1) : route;
}

function getDefaultExport(mod: unknown): unknown {
  if (mod && typeof mod === 'object' && 'default' in (mod as Record<string, unknown>)) {
    return (mod as { default: unknown }).default;
  }
  return mod;
}

type RouteMap = Map<string, unknown>;
const LANG_ROUTE_MAP: Record<string, RouteMap> = {};

// 构建每种语言的路由 -> SEO 数据映射
for (const [filePath, mod] of Object.entries(allSeoModules)) {
  const p = filePath.replace(/\\/g, '/');
  const m = p.match(/\/locales\/([^/]+)\/seo\/(.*)\/index\.ts$/);
  if (!m) continue;
  const lang = m[1];
  // 仅纳入被语言配置声明支持的语言
  if (!LANGUAGE_CONFIG.supportedLanguages.includes(lang)) continue;
  const data = getDefaultExport(mod);
  const route = normalizeRouteFromFile(filePath);
  if (!route || !data) continue;
  if (!LANG_ROUTE_MAP[lang]) LANG_ROUTE_MAP[lang] = new Map<string, unknown>();
  const map = LANG_ROUTE_MAP[lang];
  map.set(route, data);
  if (!route.endsWith('/')) map.set(route + '/', data);
  if (route.endsWith('/')) map.set(route.slice(0, -1), data);
}

export function getLocalizedSeoForPath(lang: SupportedLanguage, path: string) {
  const p = path.replace(/\\/g, '/');
  const normalized = p === '' ? '/' : p.endsWith('/') ? p : p;
  const fallback = LANGUAGE_CONFIG.defaultLanguage as SupportedLanguage;
  const map = LANG_ROUTE_MAP[lang] || LANG_ROUTE_MAP[fallback];
  if (!map) return null;
  if (map.has(normalized)) return map.get(normalized);
  const alt = normalized.endsWith('/') ? normalized.slice(0, -1) : normalized + '/';
  if (map.has(alt)) return map.get(alt);
  return null;
}
