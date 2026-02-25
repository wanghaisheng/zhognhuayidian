// Re-export types from useSupabaseData hooks for backward compatibility
// This file maintains compatibility with existing imports

export type { 
  Manufacturer, 
  Device, 
  Article, 
  Customer 
} from '@/hooks/useSupabaseData';

// Legacy type aliases for components that use old naming
/* eslint-disable @typescript-eslint/no-explicit-any */
export type DeviceType = {
  id: string;
  name: string;
  name_zh?: string;
  name_en?: string;
  slug: string;
  category: 'ct' | 'mri';
  description?: string;
  description_zh?: string;
  description_en?: string;
  created_at: string;
  translations?: Record<string, any>;
};

export type CustomerDevice = {
  id: string;
  customer_id: string;
  device_id: string;
  manufacturer_id: string;
  purchase_date?: string;
  quantity: number;
  contract_amount?: number;
  notes?: string;
  created_at: string;
};

export type HistoricalEvent = {
  id: string;
  year: number;
  category: 'ct' | 'mri' | 'general';
  event_title: string;
  event_title_zh?: string;
  event_title_en?: string;
  description?: string;
  description_zh?: string;
  description_en?: string;
  manufacturer_id?: string;
  importance_level: number;
  created_at: string;
  manufacturer?: import('@/hooks/useSupabaseData').Manufacturer;
  translations?: Record<string, any>;
};
