/**
 * Device specifications (nested)
 */
export interface DeviceSpecifications {
    slices?: string | number;
    rotationTime?: string | number;
    scanTime?: string | number;
    detectorRows?: number | string;
    maxVoltage?: string;
    fieldStrength?: number | string;
    magnetType?: string;
    dualSource?: boolean;
    features?: string[];
    dimensions?: {
        width?: string;
        depth?: string;
        height?: string;
    };
    gradientStrength?: string;
    imageResolution?: string;
    maxPatientWeight?: string;
    reconstructionTime?: string;
    specialFeatures?: string[];
    [key: string]: unknown; // Allow additional properties
}

/**
 * Helper type for deep recursive partial objects
 * (Duplicated here to keep files self-contained, or could be moved to a shared utils type file)
 */
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[]
      ? DeepPartial<U>[]
      : T[P] extends object
      ? DeepPartial<T[P]>
      : T[P];
};

/**
 * Device entity
 * Represents a CT or MRI scanner device
 */
export interface Device {
    id: string;
    name: string;
    slug?: string;
    manufacturerId: string;
    manufacturerName?: string;
    brand?: string;
    type: 'ct' | 'mri';
    description?: string;
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
    priceRange?: string;
    currency?: string;
    detectorType?: string;
    specifications?: DeviceSpecifications;
    fieldStrength?: number | string;
    magnetType?: string;
    boreSize?: number | string;
    category?: 'high-end' | 'mid-range' | 'entry-level' | 'low-field' | 'ultra-high-field' | 'high-field' | 'used' | string;
    priceRangeCNY?: number;
    priceRangeUSD?: number;
    targetMarket?: 'hospital' | 'clinic' | 'research' | 'mobile';
    condition?: 'new' | 'used' | 'refurbished';
    isUsed?: boolean;
    regulatoryApproval?: {
        fda?: boolean;
        ce?: boolean;
        nmpa?: boolean;
        [key: string]: boolean | undefined;
    };
    imageUrl?: string;
    modelNumber?: string;
    marketShare?: string;
    launchYear?: number;
    releaseYear?: number;
    rating?: number;
    reviewCount?: number;
    features?: string[];
    /** @deprecated Use translations pattern instead */
    features_zh?: string[];
    /** @deprecated Use translations pattern instead */
    features_en?: string[];
    applications?: string[];
    /** @deprecated Use translations pattern instead */
    applications_zh?: string[];
    /** @deprecated Use translations pattern instead */
    applications_en?: string[];
    /**
     * Localized content using JSONB Column Pattern
     * Key is the language code (e.g., 'en', 'zh', 'es')
     * Value is a recursive partial of the main entity
     */
    translations?: Record<string, DeepPartial<Device>>;
    createdAt?: string;
    updatedAt?: string;
}

export type DeviceCategory = 'high-end' | 'mid-range' | 'entry-level';
export type EquipmentType = 'ct' | 'mri' | 'both';
