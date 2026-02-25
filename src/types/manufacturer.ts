/**
 * Manufacturer entity
 * Represents a medical equipment manufacturer
 */

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

export interface Manufacturer {
    id: string;
    name: string; // Required primary identifier
    slug?: string;
    country: string;
    region: string;
    website?: string;
    marketValue?: string;
    category: 'global' | 'domestic' | 'major' | 'notable' | 'other';
    type: 'ct' | 'mri' | 'both';
    logo?: string;
    founded?: string;
    established?: string;
    globalPresence?: string[];
    certifications?: string[];
    keyProducts?: string[];
    competitiveAdvantage?: string[];
    
    // Localizable fields (Base language version)
    description?: string;
    productFeatures?: string | string[];
    technicalAdvantages?: string | string[];
    serviceScope?: string | string[];
    customerReviews?: string;
    annualSales?: string;
    patentQuantity?: string;
    employeeScale?: string;
    marketShare?: string;
    headquarters?: string;

    /**
/**
     * Localized content using JSONB Column Pattern
     * Key is the language code (e.g., 'en', 'zh', 'es')
     * Value is a recursive partial of the main entity
     */
    translations?: Record<string, DeepPartial<Manufacturer>>;
    
    // Legacy localized fields (kept for backward compatibility during migration, marked optional)
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
    description_zh?: string;
    /** @deprecated Use translations pattern instead */
    description_en?: string;
    /** @deprecated Use translations pattern instead */
    description_es?: string;
    /** @deprecated Use translations pattern instead */
    description_pt?: string;
    /** @deprecated Use translations pattern instead */
    description_de?: string;
    /** @deprecated Use translations pattern instead */
    description_ja?: string;
    /** @deprecated Use translations pattern instead */
    description_ar?: string;

    /** @deprecated Use translations pattern instead */
    technical_advantages_zh?: string;
    /** @deprecated Use translations pattern instead */
    technical_advantages_en?: string;
    /** @deprecated Use translations pattern instead */
    technical_advantages_es?: string;
    /** @deprecated Use translations pattern instead */
    technical_advantages_pt?: string;
    /** @deprecated Use translations pattern instead */
    technical_advantages_de?: string;
    /** @deprecated Use translations pattern instead */
    technical_advantages_ja?: string;
    /** @deprecated Use translations pattern instead */
    technical_advantages_ar?: string;

    createdAt?: string;
    updatedAt?: string;
}

export type ManufacturerCategory = 'global' | 'domestic' | 'major' | 'notable' | 'other' | string;
