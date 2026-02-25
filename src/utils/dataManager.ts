// Minimal data manager stub - data now comes from Supabase via useSupabaseData hooks
import type { Device, Manufacturer, Article } from '@/hooks/useSupabaseData';

// Empty data manager - all data fetching should use useSupabaseData hooks
export const dataManager = {
  getAllManufacturers: () => [] as Manufacturer[],
  getAllDevices: () => [] as Device[],
  getAllArticles: () => [] as Article[],
  getManufacturerById: (id: string) => undefined as Manufacturer | undefined,
  getDeviceById: (id: string) => undefined as Device | undefined,
  getArticleById: (id: string) => undefined as Article | undefined,
  getManufacturersByCountry: (country: string) => [] as Manufacturer[],
  getDevicesByType: (type: 'ct' | 'mri') => [] as Device[],
  getArticlesByCategory: (category: string) => [] as Article[],
  searchManufacturers: (query: string) => [] as Manufacturer[],
  searchDevices: (query: string) => [] as Device[],
  searchArticles: (query: string) => [] as Article[],
  getStats: () => ({ manufacturers: 0, devices: 0, articles: 0 })
};

export default dataManager;
