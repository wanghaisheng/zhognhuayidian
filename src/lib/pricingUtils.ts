
// 价格工具函数

export interface PricingFactor {
  positioning: string;
  priceRange: string;
  advantages: string[];
}

export const getManufacturerPricing = (): Record<string, PricingFactor> => {
  return {
    'GE Healthcare': {
      positioning: 'pricing.manufacturerFactors.positioning.highEnd',
      priceRange: 'pricing.manufacturerFactors.priceRange.midHigh',
      advantages: [
        'pricing.manufacturerFactors.advantages.advancedTech',
        'pricing.manufacturerFactors.advantages.brandReputation',
        'pricing.manufacturerFactors.advantages.globalService'
      ]
    },
    'Siemens Healthineers': {
      positioning: 'pricing.manufacturerFactors.positioning.highEnd',
      priceRange: 'pricing.manufacturerFactors.priceRange.midHigh',
      advantages: [
        'pricing.manufacturerFactors.advantages.dualSourceTech',
        'pricing.manufacturerFactors.advantages.imageQuality',
        'pricing.manufacturerFactors.advantages.precisionCraft'
      ]
    },
    'Philips Healthcare': {
      positioning: 'pricing.manufacturerFactors.positioning.highEnd',
      priceRange: 'pricing.manufacturerFactors.priceRange.midHigh',
      advantages: [
        'pricing.manufacturerFactors.advantages.spectralImaging',
        'pricing.manufacturerFactors.advantages.userExperience',
        'pricing.manufacturerFactors.advantages.innovation'
      ]
    },
    'United Imaging': {
      positioning: 'pricing.manufacturerFactors.positioning.fullMarketCoverage',
      priceRange: 'pricing.manufacturerFactors.priceRange.midRange',
      advantages: [
        'pricing.manufacturerFactors.advantages.costEffective',
        'pricing.manufacturerFactors.advantages.localService',
        'pricing.manufacturerFactors.advantages.fastGrowth'
      ]
    },
    'Neusoft Medical': {
      positioning: 'pricing.manufacturerFactors.positioning.valueSegment',
      priceRange: 'pricing.manufacturerFactors.priceRange.economy',
      advantages: [
        'pricing.manufacturerFactors.advantages.budgetFriendly',
        'pricing.manufacturerFactors.advantages.largeMarketShare',
        'pricing.manufacturerFactors.advantages.serviceConvenience'
      ]
    }
  };
};
