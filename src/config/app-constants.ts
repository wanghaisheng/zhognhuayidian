/**
 * 应用常量配置
 * 
 * 集中管理应用中的硬编码字符串，便于维护和国际化
 */

// === 国家/地区常量 ===
export const COUNTRIES = {
  CHINA: 'China',
  USA: 'United States',
  GERMANY: 'Germany',
  JAPAN: 'Japan',
  NETHERLANDS: 'Netherlands',
} as const;

export type CountryCode = typeof COUNTRIES[keyof typeof COUNTRIES];

// === 语言/地区常量 ===
export const LOCALES = {
  EN_US: 'en_US',
  ZH_CN: 'zh_CN',
  EN: 'en',
  ZH: 'zh',
  // 从 i18n 配置中派生
  DEFAULT: 'en',
} as const;

export type LocaleCode = typeof LOCALES[keyof typeof LOCALES];

// === 设备类型常量 ===
export const DEVICE_TYPES = {
  CT: 'ct',
  MRI: 'mri',
  CT_UPPERCASE: 'CT',
  MRI_UPPERCASE: 'MRI',
} as const;

export type DeviceType = typeof DEVICE_TYPES[keyof typeof DEVICE_TYPES];

// === 表名常量 ===
export const TABLE_NAMES = {
  MANUFACTURERS: 'manufacturers',
  DEVICES: 'devices',
  ARTICLES: 'articles',
  CUSTOMERS: 'customers',
  HISTORICAL_EVENTS: 'historical_events',
  CUSTOMER_DEVICES: 'customer_devices',
  DEVICE_REVIEWS: 'device_reviews',
} as const;

export type TableName = typeof TABLE_NAMES[keyof typeof TABLE_NAMES];

// === 字段名常量 ===
export const FIELD_NAMES = {
  ID: 'id',
  SLUG: 'slug',
  NAME_EN: 'name_en',
  NAME_ZH: 'name_zh',
  DESCRIPTION_EN: 'description_en',
  DESCRIPTION_ZH: 'description_zh',
  COUNTRY: 'country',
  TYPE: 'type',
  MANUFACTURER_ID: 'manufacturer_id',
  PUBLISHED: 'published',
  CREATED_AT: 'created_at',
  UPDATED_AT: 'updated_at',
  CATEGORY: 'category',
  CONTENT_EN: 'content_en',
  CONTENT_ZH: 'content_zh',
  TITLE_EN: 'title_en',
  TITLE_ZH: 'title_zh',
  PUBLISHED_AT: 'published_at',
  AUTHOR: 'author',
  FEATURED_IMAGE: 'featured_image',
  TAGS: 'tags',
  READ_TIME: 'read_time',
  EXCERPT_EN: 'excerpt_en',
  EXCERPT_ZH: 'excerpt_zh',
  PROVINCE: 'province',
  CITY: 'city',
  IMAGE_URL: 'image_url',
  LOGO_URL: 'logo_url',
  PRICE_RANGE: 'price_range',
  SPECIFICATIONS: 'specifications',
  RELEASE_YEAR: 'release_year',
  IS_FEATURED: 'is_featured',
  BED_COUNT: 'bed_count',
  HOSPITAL_TYPE: 'hospital_type',
  YEAR: 'year',
  DEVICES: 'devices',
  PURCHASE_DATE: 'purchase_date',
  CUSTOMER_ID: 'customer_id',
  DEVICE_ID: 'device_id',
  MANUFACTURER: 'manufacturer',
  NAME: 'name',
  EMAIL: 'email',
  PASSWORD: 'password',
  VERIFIED: 'verified',
  RATING: 'rating',
  COMMENT: 'comment',
  CREATED_AT_ORDER: 'created_at',
} as const;

export type FieldName = typeof FIELD_NAMES[keyof typeof FIELD_NAMES];

// === 排序方向常量 ===
export const SORT_ORDERS = {
  ASC: 'ASC',
  DESC: 'DESC',
  ASCENDING: true,
  DESCENDING: false,
} as const;

export type SortOrder = typeof SORT_ORDERS[keyof typeof SORT_ORDERS];

// === 冲突解决策略常量 ===
export const CONFLICT_STRATEGIES = {
  SLUG: 'slug',
  ID: 'id',
} as const;

export type ConflictStrategy = typeof CONFLICT_STRATEGIES[keyof typeof CONFLICT_STRATEGIES];

// === 存储提供者常量 ===
export const STORAGE_PROVIDERS = {
  SUPABASE: 'supabase',
  SQLJS: 'sqljs',
  D1: 'd1',
} as const;

export type StorageProvider = typeof STORAGE_PROVIDERS[keyof typeof STORAGE_PROVIDERS];

// === 环境变量键名常量 ===
export const ENV_KEYS = {
  STORAGE_PROVIDER: 'VITE_STORAGE_PROVIDER',
  SUPABASE_URL: 'VITE_SUPABASE_URL',
  SUPABASE_PUBLISHABLE_KEY: 'VITE_SUPABASE_PUBLISHABLE_KEY',
  SQLJS_DATABASE_PATH: 'VITE_SQLJS_DATABASE_PATH',
  SQLJS_CDN_URL: 'VITE_SQLJS_CDN_URL',
  D1_DATABASE_ID: 'VITE_D1_DATABASE_ID',
  D1_BINDING_NAME: 'VITE_D1_BINDING_NAME',
  EMAILJS_SERVICE_ID: 'VITE_EMAILJS_SERVICE_ID',
  EMAILJS_TEMPLATE_ID: 'VITE_EMAILJS_TEMPLATE_ID',
  EMAILJS_PUBLIC_KEY: 'VITE_EMAILJS_PUBLIC_KEY',
} as const;

export type EnvKey = typeof ENV_KEYS[keyof typeof ENV_KEYS];

// === 默认值常量 ===
export const DEFAULTS = {
  STORAGE_PROVIDER: STORAGE_PROVIDERS.SUPABASE,
  LOCALE: LOCALES.EN_US,
  PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// === 错误消息常量 ===
export const ERROR_MESSAGES = {
  STORAGE_NOT_INITIALIZED: 'Storage adapter not initialized. Call initialize() first.',
  STORAGE_PROVIDER_MISSING: (provider: string) => `${provider} configuration is missing`,
  UNKNOWN_STORAGE_PROVIDER: (provider: string) => `Unknown storage provider: ${provider}`,
  AUTH_NOT_SUPPORTED: (adapter: string) => `Authentication is not supported in ${adapter} adapter`,
  D1_BINDING_NOT_FOUND: 'D1 database binding not found. Make sure you are running in a Cloudflare Worker environment.',
  SQLJS_MODULE_NOT_LOADED: 'sql.js module not loaded',
  INVALID_CONFIGURATION: (errors: string[]) => `Invalid storage configuration: ${errors.join(', ')}`,
} as const;

// === 成功消息常量 ===
export const SUCCESS_MESSAGES = {
  DATA_LOADED: 'Data loaded successfully',
  DATA_SAVED: 'Data saved successfully',
  DATA_DELETED: 'Data deleted successfully',
  DATA_UPDATED: 'Data updated successfully',
} as const;
