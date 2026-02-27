// 语言配置中心 - 统一管理多语言设置
// 添加新语言只需在此文件中配置，其他文件会自动适配

export interface LanguageConfig {
  code: string;           // 语言代码 (en, zh, ja, ko, ar...)
  prefix: string;         // URL前缀 ('' 表示默认语言无前缀)
  hreflang: string;       // hreflang 标签值
  locale: string;         // locale 值
  name: string;           // 语言名称（本地化）
  nameEn: string;         // 语言名称（英文）
  dir: 'ltr' | 'rtl';     // 文字方向
  country?: string;       // 国家/地区名称
  region?: 'Americas' | 'Europe' | 'Asia Pacific' | 'Middle East & Africa'; // 所属区域
}

// 语言配置列表 - 添加新语言只需在此添加配置
export const LANGUAGES: LanguageConfig[] = [
  {
    code: 'en',
    prefix: '',           // 默认语言无前缀: /devices
    hreflang: 'en-US',
    locale: 'en_US',
    name: 'English',
    nameEn: 'English',
    dir: 'ltr',
    country: 'United States',
    region: 'Americas'
  },
  {
    code: 'zh',
    prefix: '/zh',        // 中文有前缀: /zh/devices
    hreflang: 'zh-CN',
    locale: 'zh_CN',
    name: '中文',
    nameEn: 'Chinese',
    dir: 'ltr',
    country: 'China',
    region: 'Asia Pacific'
  },
  // {
  //   code: 'fr',
  //   prefix: '/fr',
  //   hreflang: 'fr-FR',
  //   locale: 'fr_FR',
  //   name: 'Français',
  //   nameEn: 'French',
  //   dir: 'ltr',
  //   country: 'France',
  //   region: 'Europe'
  // },
  // {
  //   code: 'es',
  //   prefix: '/es',
  //   hreflang: 'es-ES',
  //   locale: 'es_ES',
  //   name: 'Español',
  //   nameEn: 'Spanish',
  //   dir: 'ltr',
  //   country: 'Spain',
  //   region: 'Europe'
  // },
  // {
  //   code: 'ru',
  //   prefix: '/ru',
  //   hreflang: 'ru-RU',
  //   locale: 'ru_RU',
  //   name: 'Русский',
  //   nameEn: 'Russian',
  //   dir: 'ltr',
  //   country: 'Russia',
  //   region: 'Europe'
  // },
  // {
  //   code: 'it',
  //   prefix: '/it',
  //   hreflang: 'it-IT',
  //   locale: 'it_IT',
  //   name: 'Italiano',
  //   nameEn: 'Italian',
  //   dir: 'ltr',
  //   country: 'Italy',
  //   region: 'Europe'
  // },
  // {
  //   code: 'ja',
  //   prefix: '/ja',
  //   hreflang: 'ja-JP',
  //   locale: 'ja_JP',
  //   name: '日本語',
  //   nameEn: 'Japanese',
  //   dir: 'ltr',
  //   country: 'Japan',
  //   region: 'Asia Pacific'
  // },
  // {
  //   code: 'ar',
  //   prefix: '/ar',
  //   hreflang: 'ar-SA',
  //   locale: 'ar_SA',
  //   name: 'العربية',
  //   nameEn: 'Arabic',
  //   dir: 'rtl',  // 阿拉伯语从右到左
  //   country: 'Saudi Arabia',
  //   region: 'Middle East & Africa'
  // }
];

// 默认语言配置
export const DEFAULT_LANGUAGE = LANGUAGES.find(lang => lang.prefix === '') || LANGUAGES[0];

// 派生的便捷常量
export const LANGUAGE_CONFIG = {
  defaultLanguage: DEFAULT_LANGUAGE.code,
  supportedLanguages: LANGUAGES.map(lang => lang.code),
  // 动态生成的映射
  languagePrefix: Object.fromEntries(LANGUAGES.map(lang => [lang.code, lang.prefix])),
  hreflangMap: Object.fromEntries(LANGUAGES.map(lang => [lang.code, lang.hreflang])),
  localeMap: Object.fromEntries(LANGUAGES.map(lang => [lang.code, lang.locale]))
} as const;

export const getLanguageConfig = (code: SupportedLanguage): LanguageConfig | undefined => {
  return LANGUAGES.find(l => l.code === code);
};

export const getLanguagePrefix = (code: SupportedLanguage): string => {
  const lang = LANGUAGES.find(l => l.code === code);
  return lang ? lang.prefix : '';
};

export const isDefaultLanguage = (code: SupportedLanguage): boolean => {
  return code === DEFAULT_LANGUAGE.code;
};

export const getNonDefaultPrefixes = (): string[] => {
  return LANGUAGES.filter(l => l.prefix !== '').map(l => l.prefix.replace(/^\//, ''));
};

export type SupportedLanguage = (typeof LANGUAGES)[number]['code'];
