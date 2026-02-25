// 国际化配置
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { localeResources, DEFAULT_LOCALE } from '@/locales';
import { getLanguageFromPath } from '@/utils/multilingualRoutes';

// 初始化i18n
const detectInitialLang = () => {
  if (typeof window !== 'undefined') {
    const ctx = (window as unknown as { __TANSTACK_ROUTER_CONTEXT__?: { lang?: string } }).__TANSTACK_ROUTER_CONTEXT__;
    if (ctx && typeof ctx.lang === 'string' && ctx.lang.trim()) {
      return ctx.lang;
    }
    try {
      const pathname = window.location?.pathname || '/';
      const lang = getLanguageFromPath(pathname);
      if (lang) return lang;
    } catch {
      // ignore
    }
  }
  return DEFAULT_LOCALE;
};

const initialLang = detectInitialLang();

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: localeResources,
      lng: initialLang,
      fallbackLng: DEFAULT_LOCALE, // 回退语言
      initImmediate: false,
      
      interpolation: {
        escapeValue: false // React已经进行了XSS保护
      }
    });
} else if (i18n.language !== initialLang) {
  i18n.changeLanguage(initialLang);
}

// 强制重新加载资源（开发环境）
if (process.env.NODE_ENV === 'development') {
  // 开发环境下强制重新加载翻译资源
  Object.keys(localeResources).forEach(lang => {
    const locale = lang as keyof typeof localeResources;
    i18n.addResourceBundle(locale, 'translation', localeResources[locale], true, true);
  });
}

export default i18n;
