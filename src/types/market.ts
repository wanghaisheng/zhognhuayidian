
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

export interface MarketData {
  globalMarketSize: {
    ctScanners: {
      size2023: string;
      projectedSize2030: string;
      cagr: string;
    };
    mriScanners: {
      size2023: string;
      projectedSize2030: string;
      cagr: string;
    };
  };
  regionalData: {
    china: {
      ctMarketShare: { [brand: string]: number };
      mriMarketShare: { [brand: string]: number };
      totalInstalled: number;
      growthRate: string;
    };
    global: {
      ctMarketShare: { [brand: string]: number };
      mriMarketShare: { [brand: string]: number };
    };
  };
  trends: {
    aiIntegration: number;
    lowDoseTechnology: number;
    portableSystems: number;
    cloudConnectivity: number;
  };
  translations?: Record<string, DeepPartial<MarketData>>;
}

export interface CustomerSegment {
  id: string;
  name: string;
  icon?: string;
  category: 'tier1_hospital' | 'tier2_hospital' | 'tier3_hospital' | 'clinic' | 'research' | 'mobile';
  description: string;
  requirements: string[];
  budgetRange: string;
  keyFactors: string[];
  preferredBrands: string[];
  marketSize: number;
  translations?: Record<string, DeepPartial<CustomerSegment>>;
}

export interface PriceTrendItem {
  range: string;
  trend: string;
  drivers: string[];
  /**
   * Localized content using JSONB Column Pattern
   * Key is the language code (e.g., 'en', 'zh', 'es')
   * Value is a recursive partial of the main entity
   */
  translations?: Record<string, DeepPartial<PriceTrendItem>>;
}

export interface PriceTrends {
  ctScanners: {
    [category: string]: PriceTrendItem;
  };
  mriScanners: {
    [category: string]: PriceTrendItem;
  };
}

export interface TechnologyTrendItem {
  adoption?: number;
  growth?: number;
  applications?: string[];
  technologies?: string[];
  benefits?: string[];
  benefit?: string;
  leaders: string[];
  impact?: string;
  marketSize?: string;
  translations?: Record<string, DeepPartial<TechnologyTrendItem>>;
}

export interface TechnologyTrends {
  [trend: string]: TechnologyTrendItem;
}
