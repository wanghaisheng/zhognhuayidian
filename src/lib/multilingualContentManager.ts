import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export interface MultilingualDevice {
  id: string;
  slug: string;
  name_zh: string;
  name_en: string;
  description_zh?: string | null;
  description_en?: string | null;
  type: string;
  manufacturer_id?: string | null;
  specifications?: Json | null;
  features_zh?: string[] | null;
  features_en?: string[] | null;
  applications_zh?: string[] | null;
  applications_en?: string[] | null;
  image_url?: string | null;
  price_range?: string | null;
  release_year?: number | null;
  certifications?: string[] | null;
  is_featured?: boolean | null;
  published?: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface MultilingualManufacturer {
  id: string;
  slug: string;
  name_zh: string;
  name_en: string;
  description_zh?: string | null;
  description_en?: string | null;
  country: string;
  founded_year?: number | null;
  headquarters?: string | null;
  website?: string | null;
  logo_url?: string | null;
  category?: string[] | null;
  market_share?: number | null;
  is_featured?: boolean | null;
  published?: boolean | null;
  created_at: string;
  updated_at: string;
}

function normalizeNullsDeep<T>(value: unknown): T {
  if (value === null) return undefined as unknown as T;
  if (Array.isArray(value)) {
    const arr = value.map(v => normalizeNullsDeep(v));
    return arr as unknown as T;
  }
  if (value && typeof value === 'object') {
    const source = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(source)) {
      const v = source[key];
      out[key] = normalizeNullsDeep(v);
    }
    return out as unknown as T;
  }
  return value as T;
}

export function getLocalized<T extends Record<string, unknown>>(raw: T | null, langCode: string): T | null {
  if (!raw) return null;
  const normalized = normalizeNullsDeep<Record<string, unknown>>(raw);
  const result: Record<string, unknown> = { ...normalized };
  const translations = normalized.translations as Record<string, unknown> | undefined;
  if (translations && typeof translations === 'object') {
    const localized = translations[langCode] as Record<string, unknown> | undefined;
    if (localized) {
      Object.keys(localized).forEach((key) => {
        if (key === 'specifications' && typeof localized['specifications'] === 'object') {
          const base = result['specifications'] as Record<string, unknown> | undefined;
          const loc = localized['specifications'] as Record<string, unknown>;
          result['specifications'] = { ...(base || {}), ...(loc || {}) };
        } else {
          (result as Record<string, unknown>)[key] = localized[key];
        }
      });
      return result as T;
    }
  }
  const isZh = langCode === 'zh';
  const suffixPairs = [
    'name',
    'description',
    'title',
    'excerpt',
    'content',
    'features',
    'applications'
  ];
  for (const baseKey of suffixPairs) {
    const zhKey = `${baseKey}_zh`;
    const enKey = `${baseKey}_en`;
    if (zhKey in normalized || enKey in normalized) {
      (result as Record<string, unknown>)[baseKey] = isZh
        ? normalized[zhKey] ?? normalized[enKey]
        : normalized[enKey] ?? normalized[zhKey];
    }
  }
  const specsBase = normalized['specifications'] as Record<string, unknown> | undefined;
  const specsLocalizedKey = isZh ? 'specifications_zh' : 'specifications_en';
  const specsLocalized = normalized[specsLocalizedKey] as Record<string, unknown> | undefined;
  if (specsBase || specsLocalized) {
    result['specifications'] = { ...(specsBase || {}), ...(specsLocalized || {}) };
  }
  return result as T;
}

export interface MultilingualArticle {
  id: string;
  slug: string;
  title_zh: string;
  title_en: string;
  excerpt_zh?: string | null;
  excerpt_en?: string | null;
  content_zh?: string | null;
  content_en?: string | null;
  category: string;
  tags?: string[] | null;
  author?: string | null;
  featured_image?: string | null;
  read_time?: number | null;
  published?: boolean | null;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface MultilingualCustomer {
  id: string;
  slug: string;
  name_zh: string;
  name_en: string;
  description_zh?: string | null;
  description_en?: string | null;
  province: string;
  city?: string | null;
  hospital_type?: string | null;
  bed_count?: number | null;
  devices?: Json[] | null;
  year?: number | null;
  image_url?: string | null;
  published?: boolean | null;
  created_at: string;
  updated_at: string;
}

/**
 * Multilingual Content Manager
 * Provides unified access to multilingual content from database
 */
export class MultilingualContentManager {
  private static instance: MultilingualContentManager;

  private constructor() {}

  static getInstance(): MultilingualContentManager {
    if (!MultilingualContentManager.instance) {
      MultilingualContentManager.instance = new MultilingualContentManager();
    }
    return MultilingualContentManager.instance;
  }

  // ============= Devices =============

  async getDevices(filters?: {
    type?: string;
    manufacturer_id?: string;
    is_featured?: boolean;
  }): Promise<MultilingualDevice[]> {
    let query = supabase
      .from('devices')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }
    if (filters?.manufacturer_id) {
      query = query.eq('manufacturer_id', filters.manufacturer_id);
    }
    if (filters?.is_featured !== undefined) {
      query = query.eq('is_featured', filters.is_featured);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching devices:', error);
      return [];
    }

    return (data || []).map(d => normalizeNullsDeep<MultilingualDevice>(d));
  }

  async getDeviceBySlug(slug: string): Promise<MultilingualDevice | null> {
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) {
      console.error('Error fetching device:', error);
      return null;
    }

    return data ? normalizeNullsDeep<MultilingualDevice>(data) : null;
  }

  async getDeviceById(id: string): Promise<MultilingualDevice | null> {
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('id', id)
      .eq('published', true)
      .single();

    if (error) {
      console.error('Error fetching device:', error);
      return null;
    }

    return data;
  }

  // ============= Manufacturers =============

  async getManufacturers(filters?: {
    country?: string;
    category?: string;
    is_featured?: boolean;
  }): Promise<MultilingualManufacturer[]> {
    let query = supabase
      .from('manufacturers')
      .select('*')
      .eq('published', true)
      .order('market_share', { ascending: false, nullsFirst: false });

    if (filters?.country) {
      query = query.eq('country', filters.country);
    }
    if (filters?.category) {
      query = query.contains('category', [filters.category]);
    }
    if (filters?.is_featured !== undefined) {
      query = query.eq('is_featured', filters.is_featured);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching manufacturers:', error);
      return [];
    }

    return (data || []).map(d => normalizeNullsDeep<MultilingualManufacturer>(d));
  }

  async getManufacturerBySlug(slug: string): Promise<MultilingualManufacturer | null> {
    const { data, error } = await supabase
      .from('manufacturers')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) {
      console.error('Error fetching manufacturer:', error);
      return null;
    }

    return data ? normalizeNullsDeep<MultilingualManufacturer>(data) : null;
  }

  async getManufacturerById(id: string): Promise<MultilingualManufacturer | null> {
    const { data, error } = await supabase
      .from('manufacturers')
      .select('*')
      .eq('id', id)
      .eq('published', true)
      .single();

    if (error) {
      console.error('Error fetching manufacturer:', error);
      return null;
    }

    return data;
  }

  // ============= Articles =============

  async getArticles(filters?: {
    category?: string;
    tag?: string;
  }): Promise<MultilingualArticle[]> {
    let query = supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false, nullsFirst: false });

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.tag) {
      query = query.contains('tags', [filters.tag]);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching articles:', error);
      return [];
    }

    return (data || []).map(d => normalizeNullsDeep<MultilingualArticle>(d));
  }

  async getArticleBySlug(slug: string): Promise<MultilingualArticle | null> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) {
      console.error('Error fetching article:', error);
      return null;
    }

    return data ? normalizeNullsDeep<MultilingualArticle>(data) : null;
  }

  // ============= Customers =============

  async getCustomers(filters?: {
    province?: string;
    hospital_type?: string;
  }): Promise<MultilingualCustomer[]> {
    let query = supabase
      .from('customers')
      .select('*')
      .eq('published', true)
      .order('bed_count', { ascending: false, nullsFirst: false });

    if (filters?.province) {
      query = query.eq('province', filters.province);
    }
    if (filters?.hospital_type) {
      query = query.eq('hospital_type', filters.hospital_type);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching customers:', error);
      return [];
    }

    return (data || []).map(d => normalizeNullsDeep<MultilingualCustomer>(d));
  }

  async getCustomerBySlug(slug: string): Promise<MultilingualCustomer | null> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) {
      console.error('Error fetching customer:', error);
      return null;
    }

    return data ? normalizeNullsDeep<MultilingualCustomer>(data) : null;
  }

  // ============= Statistics =============

  async getStats() {
    const [devices, manufacturers, customers, articles] = await Promise.all([
      this.getDevices(),
      this.getManufacturers(),
      this.getCustomers(),
      this.getArticles(),
    ]);

    return {
      totalDevices: devices.length,
      totalManufacturers: manufacturers.length,
      totalCustomers: customers.length,
      totalArticles: articles.length,
      devicesByType: devices.reduce((acc, device) => {
        acc[device.type] = (acc[device.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      manufacturersByCountry: manufacturers.reduce((acc, mfr) => {
        acc[mfr.country] = (acc[mfr.country] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }
}

// Export singleton instance
export const contentManager = MultilingualContentManager.getInstance();
