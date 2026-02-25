// Database types compatibility layer - Re-exports from Supabase auto-generated types
// This file provides backward compatibility for admin pages that used the old format

import type { Database as SupabaseDatabase } from '@/integrations/supabase/types';

// Re-export the Database type with the expected structure for admin pages
export type Database = SupabaseDatabase;

// Export individual table types for convenience
export type Article = SupabaseDatabase['public']['Tables']['articles']['Row'];
export type ArticleInsert = SupabaseDatabase['public']['Tables']['articles']['Insert'];
export type ArticleUpdate = SupabaseDatabase['public']['Tables']['articles']['Update'];

export type Device = SupabaseDatabase['public']['Tables']['devices']['Row'];
export type DeviceInsert = SupabaseDatabase['public']['Tables']['devices']['Insert'];
export type DeviceUpdate = SupabaseDatabase['public']['Tables']['devices']['Update'];

export type Manufacturer = SupabaseDatabase['public']['Tables']['manufacturers']['Row'];
export type ManufacturerInsert = SupabaseDatabase['public']['Tables']['manufacturers']['Insert'];
export type ManufacturerUpdate = SupabaseDatabase['public']['Tables']['manufacturers']['Update'];

export type Customer = SupabaseDatabase['public']['Tables']['customers']['Row'];
export type CustomerInsert = SupabaseDatabase['public']['Tables']['customers']['Insert'];
export type CustomerUpdate = SupabaseDatabase['public']['Tables']['customers']['Update'];
