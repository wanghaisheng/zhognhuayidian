
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};

export interface Customer {
  id: string;
  name: string;
  /** @deprecated Use translations pattern instead */
  name_zh?: string;
  /** @deprecated Use translations pattern instead */
  name_en?: string;
  /** @deprecated Use translations pattern instead */
  name_es?: string;
  /** @deprecated Use translations pattern instead */
  name_pt?: string;
  /** @deprecated Use translations pattern instead */
  name_de?: string;
  /** @deprecated Use translations pattern instead */
  name_ja?: string;
  /** @deprecated Use translations pattern instead */
  name_ar?: string;
  /** @deprecated Use translations pattern instead */
  nameEn?: string;
  imageUrl?: string;
  type: 'hospital' | 'clinic' | 'research' | 'government' | 'medical_center';
  location: {
    country: string;
    province?: string;
    city: string;
    district?: string;
    coordinates?: [number, number];
  };
  establishedYear?: number;
  contactInfo?: {
    website?: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  purchaseHistory: Array<{
    deviceId: string;
    deviceName: string;
    manufacturerId: string;
    manufacturerName: string;
    brandId: string;
    brandName: string;
    purchaseDate: string;
    purchasePrice?: string;
    quantity: number;
    totalValue?: string;
    currency: string;
  }>;
  partnerships: string[]; // manufacturer IDs
  caseStudies?: Array<{
    id: string;
    title: string;
    description: string;
    results: string[];
    publishDate: string;
    featured: boolean;
  }>;
  size: 'small' | 'medium' | 'large';
  specialties: string[];
  certifications: string[];
  bedCount?: number;
  patientVolumePerYear?: number;
  annualSurgeryCount?: number;
  annualExamLabCount?: number;
  staffCount?: number;
  annualRevenue?: string;
  marketShare?: number;
  created_at: string;
  updated_at: string;
  /**
   * Localized content using JSONB Column Pattern
   * Key is the language code (e.g., 'en', 'zh', 'es')
   * Value is a recursive partial of the main entity
   */
  translations?: Record<string, DeepPartial<Customer>>;
}
