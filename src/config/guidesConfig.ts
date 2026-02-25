export type GuideType = 'import' | 'financing' | 'maintenance';

export interface RelatedGuideItem {
  key: string;
  slug: string;
}

export const RELATED_GUIDES_MAP: Record<GuideType, RelatedGuideItem[]> = {
  import: [
    { key: 'financing', slug: 'financing' },
    { key: 'maintenance', slug: 'maintenance' },
    { key: 'selection', slug: 'selection' }
  ],
  financing: [
    { key: 'import', slug: 'import' },
    { key: 'maintenanceCost', slug: 'maintenance' },
    { key: 'roi', slug: 'roi' }
  ],
  maintenance: [
    { key: 'importInstall', slug: 'import' },
    { key: 'serviceFinancing', slug: 'financing' },
    { key: 'upgrade', slug: 'upgrade' }
  ]
};

export interface QuickLinkItem {
  key: string;
  path: string;
  iconName: 'Users' | 'FileText' | 'Clock';
}

export const QUICK_LINKS_MAP: Record<GuideType, QuickLinkItem[]> = {
  import: [
    { key: 'viewManufacturers', path: '/manufacturers', iconName: 'Users' },
    { key: 'deviceCatalog', path: '/devices', iconName: 'FileText' },
    { key: 'costCalculator', path: '/pricing', iconName: 'Clock' }
  ],
  financing: [
    { key: 'financingCalculator', path: '/pricing', iconName: 'Clock' },
    { key: 'deviceCatalog', path: '/devices', iconName: 'FileText' },
    { key: 'contactConsultant', path: '/contact', iconName: 'Users' }
  ],
  maintenance: [
    { key: 'serviceProviders', path: '/manufacturers?service=maintenance', iconName: 'Users' },
    { key: 'partsQuery', path: '/devices', iconName: 'FileText' },
    { key: 'maintenancePlan', path: '/resources', iconName: 'Clock' }
  ]
};
