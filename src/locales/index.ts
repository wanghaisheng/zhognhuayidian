// 多语言资源汇总入口
import { enTranslations } from './en';
import { zhTranslations } from './zh';

// 导出所有语言资源
export const localeResources = {
  en: enTranslations,
  zh: zhTranslations
};

// 导出类型定义
export type TranslationKeys = typeof enTranslations;
export type SupportedLocale = 'en' | 'zh';

// 导出默认语言
export const DEFAULT_LOCALE: SupportedLocale = 'en';

// 导出支持的语言列表
export const SUPPORTED_LOCALES: SupportedLocale[] = ['en', 'zh'];
