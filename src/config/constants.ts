export const NAVIGATION_ITEMS = [
  { key: 'devices', path: '/devices', iconName: 'Monitor' },
  { key: 'manufacturers', path: '/manufacturers', iconName: 'Building' },
  { key: 'pricing', path: '/pricing', iconName: 'DollarSign' },
  { key: 'compare', path: '/compare', iconName: 'Scale' },
  { key: 'analysis', path: '/reports', iconName: 'TrendingUp' },
  { key: 'learn', path: '/learn', iconName: 'GraduationCap' },
  { key: 'resources', path: '/resources', iconName: 'BookOpen' },
  { key: 'about', path: '/about', iconName: 'Award' }
] as const;
export type NavigationItemKey = typeof NAVIGATION_ITEMS[number]['key'];

export const FOOTER_SECTIONS = {
  devices: [
    { key: 'allDevices', path: '/devices' },
    { key: 'ctScanners', path: '/devices/ct-scanners' },
    { key: 'mriScanners', path: '/devices/mri-scanners' },
    { key: 'chinaCt', path: '/manufacturers?country=china&category=ct' },
    { key: 'chinaMri', path: '/manufacturers?country=china&category=mri' },
  ],
  manufacturers: [
    { key: 'allManufacturers', path: '/manufacturers' },
    { key: 'ctManufacturers', path: '/manufacturers?category=ct' },
    { key: 'mriManufacturers', path: '/manufacturers?category=mri' },
    { key: 'chinaManufacturers', path: '/manufacturers?country=china' },
    { key: 'globalPresence', path: '/manufacturers?region=global' },
  ],
  resources: [
    { key: 'resourceCenter', path: '/resources' },
    { key: 'buyingGuides', path: '/guides/buying-guide' },
    { key: 'compare', path: '/compare' },
    { key: 'pricing', path: '/pricing' },
    { key: 'learn', path: '/learn' },
  ],
  market: [
    { key: 'marketReports', path: '/reports/market' },
    { key: 'expertAnalysis', path: '/reports/expert' },
    { key: 'industryTrends', path: '/reports' },
    { key: 'premiumReports', path: '/premium-reports' },
  ],
  company: [
    { key: 'about', path: '/about' },
    { key: 'contact', path: '/contact' },
    { key: 'privacy', path: '/privacy' },
    { key: 'terms', path: '/terms' },
    { key: 'blog', path: '/blog' },
  ]
} as const;
export type FooterSectionKey = keyof typeof FOOTER_SECTIONS;

export const DEVICE_SPECIFICATIONS = [
  '16-slice',
  '128-slice',
  '64-slice',
  '256-slice',
  'mobile',
  'dual-energy',
  'portable',
  '3t',
  '1.5t',
  'open',
  'wide-bore'
] as const;
export type DeviceSpecification = typeof DEVICE_SPECIFICATIONS[number];

export const CUSTOMER_TYPES = [
  'hospital',
  'clinic',
  'research',
  'government',
  'medical_center'
] as const;
export type CustomerType = typeof CUSTOMER_TYPES[number];

export const CUSTOMER_SIZES = [
  'small',
  'medium',
  'large'
] as const;
export type CustomerSize = typeof CUSTOMER_SIZES[number];

export const HOSPITAL_LEVELS = [
  'level3_gradeA',
  'level3_gradeB',
  'level2_gradeA',
  'specialized',
  'community'
] as const;
export type HospitalLevel = typeof HOSPITAL_LEVELS[number];

export const BUDGET_RANGES = [
  'under_1m',
  '1m_3m',
  '3m_5m',
  '5m_8m',
  '8m_12m',
  '12m_20m',
  'over_20m'
] as const;
export type BudgetRange = typeof BUDGET_RANGES[number];

export const TIMELINES = [
  'within_1m',
  '1m_3m',
  '3m_6m',
  '6m_12m',
  'over_12m'
] as const;
export type Timeline = typeof TIMELINES[number];

export const ROI_CONSTANTS = {
  DEFAULT_EQUIPMENT_COST: 500000,
  DEFAULT_PATIENTS_PER_DAY: 15,
  DEFAULT_SCAN_FEE: 500,
  DEFAULT_MAINTENANCE_RATIO: 8,
  DEFAULT_OPERATING_DAYS: 300,
  DEFAULT_DOWN_PAYMENT: 100000,
  DEFAULT_INTEREST_RATE: 5,
  DEFAULT_LOAN_TERM: 5,
  ESTIMATED_CLINICAL_STAFF_COST: 150000,
  ESTIMATED_UTILITIES_OVERHEAD: 50000,
};
export const CONDITION_MULTIPLIERS = {
  new: 1.0,
  demo: 0.85,
  refurbished: 0.6,
  used: 0.4
};
export const REGION_MULTIPLIERS = {
  na: 1.0,
  eu: 1.1,
  asia: 0.85,
  latam: 0.9
};

export const MEDICAL_BRANDS = [
  'Siemens',
  'Philips',
  'GE',
  'Canon',
  'Toshiba',
  'Hitachi',
  'Samsung',
  'Fujifilm',
  'Mindray',
  'United Imaging',
  'Neusoft'
] as const;
export type MedicalBrand = typeof MEDICAL_BRANDS[number];

export const GUIDE_FAQ_CATEGORIES = ['financing', 'import', 'maintenance'] as const;
export type GuideFaqCategory = typeof GUIDE_FAQ_CATEGORIES[number];
export const GUIDE_FAQ_KEYS = {
  financing: ['rates', 'refurbished', 'lease_vs_loan'],
  import: ['license', 'customs', 'shipping'],
  maintenance: ['tube_cost', 'service_contract', 'preventive']
} as const;

export const RELATED_LINK_KEYS = [
  'mri_cost',
  'ct_vs_mri'
] as const;
export type RelatedLinkKey = typeof RELATED_LINK_KEYS[number];
export const RELATED_LINK_VARIANTS: Record<RelatedLinkKey, 'blue' | 'green' | 'purple' | 'orange'> = {
  mri_cost: 'blue',
  ct_vs_mri: 'green'
};
export const RELATED_LINK_HREFS: Record<RelatedLinkKey, string> = {
  mri_cost: '/pricing/mri-scan-cost',
  ct_vs_mri: '/compare/ct-vs-mri'
};
export const MRI_FAQ_KEYS = [
  'definition',
  'duration',
  'shows',
  'safety',
  'eating',
  'field_strength'
] as const;
export type MriFaqKey = typeof MRI_FAQ_KEYS[number];
export const MRI_HOW_IT_WORKS_STEPS = [
  'magnet',
  'radio_waves',
  'relaxation',
  'detection',
  'image_creation'
] as const;
export const MRI_FIELD_STRENGTHS = ['1.5T', '3.0T', '0.5T'] as const;
export const MRI_DESIGN_TYPES = ['closed', 'open', 'wide_bore'] as const;
export const MRI_PRINCIPLE_KEYS = ['magnetic_fields', 'radio_waves', 'signal_detection'] as const;
export const MRI_COMPARISON_KEYS = ['mri_vs_ct', 'mri_vs_xray', 'mri_vs_ultrasound'] as const;

export const EXPORT_SERVICE_KEYS = [
  'logistics',
  'installation',
  'training',
  'support'
] as const;
export type ExportServiceKey = typeof EXPORT_SERVICE_KEYS[number];

export const ADMIN_NAV_ITEMS = [
  { key: 'dashboard', path: '/admin', iconName: 'LayoutDashboard' },
  { key: 'articles', path: '/content-management', iconName: 'FileText' },
  { key: 'devices', path: '/content-management', iconName: 'Stethoscope' },
  { key: 'settings', path: '/admin/settings', iconName: 'Settings' },
] as const;
export type AdminNavItemKey = typeof ADMIN_NAV_ITEMS[number]['key'];

export const SEO_DEFAULTS = {
  title: 'China CT Scanner - Medical Imaging Equipment Export Platform',
  description: 'Professional CT scanner and MRI equipment information platform, providing equipment comparison, manufacturer information, market analysis, and purchasing guides.',
  siteName: 'China CT Scanner',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://chinactscanner.org/',
  },
  defaultImage: 'https://chinactscanner.org/assets/og-image.png',
  twitterCard: 'summary_large_image' as const,
  defaultLocale: 'en-US',
  robots: 'index, follow'
};
