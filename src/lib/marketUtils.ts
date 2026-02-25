/* eslint-disable @typescript-eslint/no-explicit-any */
import { MarketData, DeepPartial } from '@/types/market';
const snapshotModules = import.meta.glob('/src/data/snapshots/**/content/market/*.json', { eager: true });

// Helper for deep merge
function deepMerge<T>(target: T, source: DeepPartial<T>): T {
  if (typeof target !== 'object' || target === null || typeof source !== 'object' || source === null) {
    return source as unknown as T;
  }

  if (Array.isArray(target)) {
    // For arrays, we prefer replacement from source if it's an array
    if (Array.isArray(source)) {
        return source as unknown as T;
    }
    return target;
  }

  const result = { ...target } as any;
  
  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = result[key];
    
    if (sourceValue !== undefined) {
        if (targetValue !== undefined && typeof targetValue === 'object' && targetValue !== null && typeof sourceValue === 'object' && sourceValue !== null && !Array.isArray(targetValue)) {
            result[key] = deepMerge(targetValue, sourceValue);
        } else {
            result[key] = sourceValue;
        }
    }
  }
  
  return result as T;
}

export const getMarketData = (lang?: string): MarketData => {
  const locale = lang || 'en';
  const path = `/src/data/snapshots/${locale}/content/market/global.json`;
  const fallbackPath = `/src/data/snapshots/en/content/market/global.json`;
  const mod = (snapshotModules[path] || snapshotModules[fallbackPath]) as unknown;
  const data = (mod as { default?: unknown })?.default ?? mod;
  return data as MarketData;
};

export const getGlobalMarketSize = (type: 'ct' | 'mri', lang?: string) => {
  const data = getMarketData(lang);
  return type === 'ct' 
    ? data.globalMarketSize.ctScanners 
    : data.globalMarketSize.mriScanners;
};

export const getRegionalMarketShare = (region: 'china' | 'global', type: 'ct' | 'mri', lang?: string) => {
  const data = getMarketData(lang);
  const regionData = region === 'china' ? data.regionalData.china : data.regionalData.global;
  return type === 'ct' ? regionData.ctMarketShare : regionData.mriMarketShare;
};

export const getMarketTrend = (trendKey: keyof MarketData['trends'], lang?: string) => {
  const data = getMarketData(lang);
  return data.trends[trendKey];
};
