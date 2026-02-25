// Unify Supabase client instance by reusing the integrations client.
// Keep it loosely typed here to avoid tight coupling with generated Database types.
import { supabase as baseClient } from '@/integrations/supabase/client';

// Use a relaxed any-typed alias to preserve existing helper signatures.
// Runtime will still share the single client instance from integrations.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase: any = baseClient;

// Database query helpers
export const db = {
  // Manufacturers
  manufacturers: {
    getAll: () => supabase.from('manufacturers').select('*').order('slug'),
    getBySlug: (slug: string) => supabase.from('manufacturers').select('*').eq('slug', slug).maybeSingle(),
    getChinese: () => supabase.from('manufacturers').select('*').eq('country', 'China').order('slug'),
    getInternational: () => supabase.from('manufacturers').select('*').neq('country', 'China').order('slug'),
    upsertTranslated: (payload: { slug: string; translations: Record<string, unknown> } & Record<string, unknown>) =>
      supabase.from('manufacturers').upsert(payload, { onConflict: 'slug' }),
  },

  // Devices
  devices: {
    getAll: () => supabase.from('devices').select(`
      *,
      manufacturer:manufacturers(*)
    `).eq('published', true).order('name_en'),
    
    getByCategory: (category: 'ct' | 'mri') => supabase.from('devices').select(`
      *,
      manufacturer:manufacturers(*)
    `).in('type', [category, category.toUpperCase()]).eq('published', true).order('slug'),
    
    getBySlug: (slug: string) => supabase.from('devices').select(`
      *,
      manufacturer:manufacturers(*)
    `).eq('slug', slug).maybeSingle(),
    
    getByManufacturer: (manufacturerId: string) => supabase.from('devices').select(`
      *,
      manufacturer:manufacturers(*)
    `).eq('manufacturer_id', manufacturerId).eq('published', true).order('slug'),
    upsertTranslated: (payload: { slug: string; translations: Record<string, unknown> } & Record<string, unknown>) =>
      supabase.from('devices').upsert(payload, { onConflict: 'slug' }),
  },

  // Device Types
  deviceTypes: {
    getAll: () => supabase.from('devices').select('type').order('type'),
    getByCategory: (category: 'ct' | 'mri') => supabase.from('devices').select('type').eq('type', category).order('type'),
  },

  // Articles
  articles: {
    getAll: () => supabase.from('articles').select('*').eq('published', true).order('published_at', { ascending: false }),
    getBySlug: (slug: string) => supabase.from('articles').select('*').eq('slug', slug).eq('published', true).maybeSingle(),
    getByCategory: (category: string) => supabase.from('articles').select('*').eq('category', category).eq('published', true).order('published_at', { ascending: false }),
    upsertTranslated: (payload: { slug: string; translations: Record<string, unknown> } & Record<string, unknown>) =>
      supabase.from('articles').upsert(payload, { onConflict: 'slug' }),
  },

  // Historical Events
  historicalEvents: {
    getAll: () => supabase.from('historical_events').select(`
      *,
      manufacturer:manufacturers(*)
    `).order('year', { ascending: false }),
    
    getByCategory: (category: 'ct' | 'mri' | 'general') => supabase.from('historical_events').select(`
      *,
      manufacturer:manufacturers(*)
    `).eq('category', category).order('year', { ascending: false }),
  },

  // Customer Devices
  customerDevices: {
    getAll: () => supabase.from('customer_devices').select(`
      *,
      customer:customers(*),
      device:devices(*),
      manufacturer:manufacturers(*)
    `).order('purchase_date', { ascending: false }),
    
    getByManufacturer: (manufacturerId: string) => supabase.from('customer_devices').select(`
      *,
      customer:customers(*),
      device:devices(*),
      manufacturer:manufacturers(*)
    `).eq('manufacturer_id', manufacturerId).order('purchase_date', { ascending: false }),
  },
  
  // Customers
  customers: {
    getAll: () => supabase.from('customers').select('*').eq('published', true).order('slug'),
    getBySlug: (slug: string) => supabase.from('customers').select('*').eq('slug', slug).maybeSingle(),
    upsertTranslated: (payload: { slug: string; translations: Record<string, unknown> } & Record<string, unknown>) =>
      supabase.from('customers').upsert(payload, { onConflict: 'slug' }),
  },
};
