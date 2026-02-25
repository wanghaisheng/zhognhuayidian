import { CTSpecs, MRISpecs, CommonDeviceSpecs } from './specifications';

// Standardized data type definitions - based on data management strategy

/**
 * Helper type for deep recursive partial objects
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};

// Manufacturer data standard structure
export interface StandardizedManufacturer {
  id: string;
  name: string;
  country: string;
  region: string;
  founded_year: number;
  headquarters: string;
  website: string;
  market_share: number;
  product_lines: ("CT" | "MRI" | "X-Ray" | "Ultrasound")[];
  certifications: string[];
  contact_info: {
    email?: string;
    phone?: string;
    address?: string;
  };
  financial_data: {
    annual_revenue?: number;
    employee_count?: number;
    market_value?: number;
  };
  technical_advantages: string[];
  patent_count: number;
  category: "major" | "notable" | "domestic";
  created_at: string;
  updated_at: string;
  /**
   * Localized content using JSONB Column Pattern
   * Key is the language code (e.g., 'en', 'zh', 'es')
   * Value is a recursive partial of the main entity
   */
  translations?: Record<string, DeepPartial<StandardizedManufacturer>>;
}

// Device data standard structure
export interface StandardizedDevice {
  id: string;
  name: string;
  manufacturer_id: string;
  type: "CT" | "MRI" | "X-Ray" | "Ultrasound";
  category: "High-end" | "Mid-range" | "Entry-level";
  model_number: string;
  release_year?: number;
  specifications: Partial<CTSpecs> & Partial<MRISpecs> & CommonDeviceSpecs & {
    // Legacy support for snake_case fields (to be deprecated)
    detector_rows?: number;
    scan_speed?: string;
    field_strength?: number;
    magnet_type?: string;
    aperture_size?: number;
    max_patient_weight?: string;
    power_requirements?: string;
    [key: string]: unknown; // Allow flexibility during migration
  };
  price_range: {
    min: number;
    max: number;
    currency: "CNY" | "USD" | "EUR";
  };
  features: string[];
  certifications: ("CE" | "ISO" | "FDA" | "NMPA")[];
  target_market: ("Hospital" | "Clinic" | "Research" | "Mobile")[];
  availability_regions: string[];
  technical_documents?: string[];
  clinical_evidence?: string[];
  created_at: string;
  updated_at: string;
  /**
   * Localized content using JSONB Column Pattern
   * Key is the language code (e.g., 'en', 'zh', 'es')
   * Value is a recursive partial of the main entity
   */
  translations?: Record<string, DeepPartial<StandardizedDevice>>;
}

// Customer case data standard structure
export interface StandardizedCustomer {
  id: string;
  hospital_name: string;
  location: {
    city: string;
    province: string;
    country: string;
    coordinates?: [number, number];
  };
  hospital_type: "Public" | "Private" | "Research" | "Specialty";
  bed_count?: number;
  established_year?: number;
  purchased_devices: Array<{
    device_id: string;
    purchase_date: string;
    contract_amount?: number;
    warranty_period?: string;
    quantity: number;
    currency: string;
  }>;
  contact_person?: string;
  procurement_budget?: number;
  specialties: string[];
  certifications: string[];
  case_studies?: Array<{
    id: string;
    title: string;
    description: string;
    outcomes: string[];
    metrics?: {
      efficiency_improvement?: string;
      cost_savings?: string;
      patient_satisfaction?: string;
    };
    publish_date: string;
    featured: boolean;
  }>;
  created_at: string;
  updated_at: string;
  /**
   * Localized content using JSONB Column Pattern
   * Key is the language code (e.g., 'en', 'zh', 'es')
   * Value is a recursive partial of the main entity
   */
  translations?: Record<string, DeepPartial<StandardizedCustomer>>;
}

// Market analysis data standard structure
export interface StandardizedMarketAnalysis {
  market_segments: Array<{
    id: string;
    name: string;
    type: "CT" | "MRI" | "X-Ray" | "Ultrasound";
    segment: "High-end" | "Mid-range" | "Entry-level";
    market_share: number;
    growth_rate: number;
    key_players: string[];
    price_range: {
      min: number;
      max: number;
    };
    target_customers: string[];
    characteristics: string[];
    trends: string[];
    /**
     * Localized content using JSONB Column Pattern
     */
    translations?: Record<string, DeepPartial<Omit<StandardizedMarketAnalysis['market_segments'][number], 'translations'>>>;
  }>;
  technology_trends: Array<{
    id: string;
    name: string;
    category: "AI" | "Hardware" | "Software" | "Materials";
    description: string;
    impact_level: "High" | "Medium" | "Low";
    timeline: string;
    adoption_rate: string;
    affected_devices: string[];
    challenges: string[];
    opportunities: string[];
    /**
     * Localized content using JSONB Column Pattern
     */
    translations?: Record<string, DeepPartial<Omit<StandardizedMarketAnalysis['technology_trends'][number], 'translations'>>>;
  }>;
  regional_analysis: Array<{
    region: string;
    market_size: number;
    growth_rate: number;
    key_trends: string[];
    major_players: string[];
    market_dynamics: string[];
    /**
     * Localized content using JSONB Column Pattern
     */
    translations?: Record<string, DeepPartial<Omit<StandardizedMarketAnalysis['regional_analysis'][number], 'translations'>>>;
  }>;
  competitive_landscape: {
    market_leaders: Array<{
      company_id: string;
      market_share: number;
      strengths: string[];
      weaknesses: string[];
      strategic_focus: string[];
      /**
       * Localized content using JSONB Column Pattern
       */
      translations?: Record<string, DeepPartial<Omit<StandardizedMarketAnalysis['competitive_landscape']['market_leaders'][number], 'translations'>>>;
    }>;
    emerging_players: string[];
    market_consolidation_trends: string[];
    /**
     * Localized content using JSONB Column Pattern
     */
    translations?: Record<string, DeepPartial<Omit<StandardizedMarketAnalysis['competitive_landscape'], 'market_leaders' | 'translations'>>>;
  };
  created_at: string;
  updated_at: string;
  /**
   * Localized content using JSONB Column Pattern
   * Key is the language code (e.g., 'en', 'zh', 'es')
   * Value is a recursive partial of the main entity
   */
  translations?: Record<string, DeepPartial<StandardizedMarketAnalysis>>;
}

// Content metadata standard structure
export interface ContentMetadata {
  id: string;
  title: string;
  slug: string;
  description: string;
  keywords: string[];
  author?: string;
  publish_date: string;
  last_updated: string;
  content_type: "article" | "guide" | "analysis" | "history" | "case-study";
  category: string;
  tags: string[];
  featured: boolean;
  reading_time?: number;
  related_devices?: string[];
  related_manufacturers?: string[];
  related_customers?: string[];
  seo_data: {
    meta_title?: string;
    meta_description?: string;
    canonical_url?: string;
    og_image?: string;
    schema_markup?: Record<string, unknown>;
  };
  language: "zh" | "en";
  status: "draft" | "published" | "archived";
  /**
   * Localized content using JSONB Column Pattern
   * Key is the language code (e.g., 'en', 'zh', 'es')
   * Value is a recursive partial of the main entity
   */
  translations?: Record<string, DeepPartial<ContentMetadata>>;
}

// Data validation result
export interface ValidationResult {
  isValid: boolean;
  errors: Array<{
    field: string;
    message: string;
    severity: "error" | "warning" | "info";
  }>;
  warnings: Array<{
    field: string;
    message: string;
    suggestion?: string;
  }>;
}

// Search and filter parameters
export interface SearchFilters {
  deviceType?: ("CT" | "MRI" | "X-Ray" | "Ultrasound")[];
  category?: ("High-end" | "Mid-range" | "Entry-level")[];
  manufacturers?: string[];
  priceRange?: {
    min?: number;
    max?: number;
  };
  regions?: string[];
  features?: string[];
  certifications?: string[];
  releaseYear?: {
    min?: number;
    max?: number;
  };
}

// Search results
export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  facets?: {
    manufacturers: Array<{ id: string; name: string; count: number }>;
    categories: Array<{ id: string; name: string; count: number }>;
    regions: Array<{ id: string; name: string; count: number }>;
  };
}

// API response format
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    timestamp: string;
    version: string;
    requestId?: string;
  };
}