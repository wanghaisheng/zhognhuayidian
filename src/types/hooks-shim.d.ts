declare module '@/hooks/useSupabaseData' {
  export function fetchArticlesAll(): Promise<{ data: unknown[] | null }>;
  export function getArticlesAllQueryKey(locale: string): unknown[];
  export function fetchArticlesByCategory(category: string): Promise<{ data: unknown[] | null }>;
  export function getArticlesByCategoryQueryKey(category: string, locale: string): unknown[];
  export function fetchArticleBySlug(slug: string): Promise<{ data: Record<string, unknown> | null }>;
  export function getArticleBySlugQueryKey(slug: string, locale: string): unknown[];
  export function mapLocalizedArray<T = unknown>(data: Record<string, unknown>[], locale: string): T[];
  export function mapLocalizedFields<T = unknown>(data: Record<string, unknown>, locale: string): T;
}
declare module '@/hooks/useStats' {
  export interface Stats {
    totalDevices: number;
    totalManufacturers: number;
    totalArticles: number;
    totalCountries: number;
  }
  export function fetchStats(lang: string): Promise<Stats>;
  export const useStats: () => { stats: Stats; loading: boolean; error: Error | null };
}
