import { useEffect, useMemo } from 'react';
import { useLocation } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { LANGUAGE_CONFIG, SupportedLanguage } from '@/config/language';
import { SITE_CONFIG, getSiteName } from '@/config/site';
import { getTCMSEOConfig, shouldUseTCMSEO } from '@/config/seo-tcm';
import { generateCanonicalUrl, getLocalizedSEOConfig } from '@/utils/seo';
import { getLanguageFromPath } from '@/utils/multilingualRoutes';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string | string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  structuredData?: object | object[];
  robots?: string;
  author?: string;
  publishDate?: string;
  modifiedDate?: string;
  articleSection?: string;
  locale?: string;
  alternateLanguages?: { href: string; hreflang: string }[];
}

const SEOHead = ({ 
  title, 
  description, 
  keywords, 
  canonicalUrl, 
  ogImage,
  ogType = 'website',
  structuredData,
  robots = "index,follow",
  author,
  publishDate,
  modifiedDate,
  articleSection,
  locale,
  alternateLanguages = []
}: SEOHeadProps) => {
  const location = useLocation();
  const { t } = useTranslation();
  
  // 默认值 - 统一URL管理（从配置文件读取）
  const baseUrl = SITE_CONFIG.url;
  const pathnameFromRouter = location.pathname || '/';
  const pathname = pathnameFromRouter;
  const currentLang = getLanguageFromPath(pathname) as SupportedLanguage;
  const siteName = getSiteName(currentLang === 'zh' ? 'zh' : 'en');
  const defaultTitle = t('seo.defaultTitle');
  const defaultDescription = t('seo.defaultDescription');

  // URL规范化 - 确保一致的URL格式
  const normalizeUrl = (url: string) => {
    return url.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
  };

  // 检查是否应该使用TCM SEO配置
  const normalizedPath = normalizeUrl(pathname);
  const tcmSEOConfig = shouldUseTCMSEO(currentLang, normalizedPath) 
    ? getTCMSEOConfig(normalizedPath) 
    : null;
  
  const localizedSEO = getLocalizedSEOConfig(currentLang, normalizedPath);
  const finalTitle = localizedSEO?.title || title || tcmSEOConfig?.title || defaultTitle;
  const finalDescription = localizedSEO?.description || description || tcmSEOConfig?.description || defaultDescription;
  
  // 生成Canonical URL - 如果传入了自定义URL则使用，否则自动生成
  // CRITICAL: canonical 必须指向当前页面的正确语言版本
  const finalCanonicalUrl = (() => {
    const selfCanonical = generateCanonicalUrl(normalizedPath, currentLang);
    if (!canonicalUrl) return selfCanonical;
    const trimmed = canonicalUrl.trim();
    const candidate = (() => {
      if (/^https?:\/\//i.test(trimmed)) {
        try {
          const u = new URL(trimmed.replace(/^http:/, 'https:').replace('://www.', '://'));
          return `${u.origin}${u.pathname.replace(/\/$/, '')}`;
        } catch {
          return selfCanonical;
        }
      }
      const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
      return generateCanonicalUrl(path, currentLang);
    })();
    return candidate === selfCanonical ? candidate : selfCanonical;
  })();
  
  const finalOgImage = ogImage || `${baseUrl}/placeholder.svg`;
  const finalLocale = locale || LANGUAGE_CONFIG.localeMap[currentLang as keyof typeof LANGUAGE_CONFIG.localeMap] || 'en_US';
  

  // 生成结构化数据 - 优先使用TCM SEO配置，确保 url 字段正确
  const finalStructuredData = useMemo(() => {
    const base = localizedSEO?.structuredData || (tcmSEOConfig as { structuredData?: object })?.structuredData || structuredData || {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": siteName,
      "url": finalCanonicalUrl,
      "description": finalDescription,
      "inLanguage": currentLang,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${baseUrl}/devices?search={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };
    const list = Array.isArray(base) ? base : [base];
    const normalized = list.map((item) => {
      const obj = { ...(item as Record<string, unknown>) };
      if (typeof obj.url === 'string') obj.url = finalCanonicalUrl;
      const mep = obj.mainEntityOfPage as Record<string, unknown> | undefined;
      if (mep && typeof mep === 'object') {
        obj.mainEntityOfPage = { ...mep, "@id": finalCanonicalUrl };
      }
      if (typeof (obj as Record<string, unknown>)['@id'] === 'string') {
        (obj as Record<string, unknown>)['@id'] = finalCanonicalUrl;
      }
      return obj;
    });
    return Array.isArray(base) ? normalized : normalized[0];
  }, [
    localizedSEO,
    tcmSEOConfig,
    structuredData,
    finalCanonicalUrl,
    siteName,
    finalDescription,
    currentLang,
    baseUrl
  ]);

  // canonical 与 hreflang 由根路由集中输出；此组件不再注入 link 标签

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = finalTitle;
    const ensureMeta = (attr: 'name' | 'property' | 'httpEquiv', key: string, content: string) => {
      let selector = '';
      if (attr === 'name') selector = `meta[name="${key}"]`;
      if (attr === 'property') selector = `meta[property="${key}"]`;
      if (attr === 'httpEquiv') selector = `meta[http-equiv="${key}"]`;
      let el = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        if (attr === 'name') el.setAttribute('name', key);
        if (attr === 'property') el.setAttribute('property', key);
        if (attr === 'httpEquiv') el.setAttribute('http-equiv', key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    ensureMeta('name', 'description', finalDescription);
    ensureMeta('name', 'robots', robots);
    ensureMeta('name', 'author', author || siteName);
    ensureMeta('name', 'viewport', 'width=device-width, initial-scale=1.0');
    ensureMeta('name', 'theme-color', '#2563eb');
    ensureMeta('httpEquiv', 'content-language', currentLang);
    ensureMeta('name', 'locale', finalLocale);
    const ensureLink = (rel: string, href: string, extra?: Record<string, string>) => {
      let el = document.head.querySelector(`link[rel="${rel}"]${extra?.hrefLang ? `[hreflang="${extra.hrefLang}"]` : ''}`) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        if (extra?.hrefLang) el.setAttribute('hreflang', extra.hrefLang);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
      if (extra) {
        Object.entries(extra).forEach(([k, v]) => {
          if (k !== 'hrefLang') el.setAttribute(k, v);
        });
      }
    };
    // 不在客户端注入 canonical/hreflang，避免与根路由输出重复
    ensureMeta('property', 'og:type', ogType);
    ensureMeta('property', 'og:title', finalTitle);
    ensureMeta('property', 'og:description', finalDescription);
    ensureMeta('property', 'og:url', finalCanonicalUrl);
    ensureMeta('property', 'og:image', finalOgImage);
    ensureMeta('property', 'og:site_name', siteName);
    ensureMeta('property', 'og:locale', finalLocale);
    ensureMeta('name', 'twitter:card', 'summary_large_image');
    ensureMeta('name', 'twitter:title', finalTitle);
    ensureMeta('name', 'twitter:description', finalDescription);
    ensureMeta('name', 'twitter:image', finalOgImage);
    if (publishDate) {
      ensureMeta('property', 'article:published_time', publishDate);
      ensureMeta('name', 'publish_date', publishDate);
    }
    if (modifiedDate) {
      ensureMeta('property', 'article:modified_time', modifiedDate);
      ensureMeta('name', 'last-modified', modifiedDate);
    }
    if (articleSection) {
      ensureMeta('property', 'article:section', articleSection);
    }
    const jsonLdId = 'seo-structured-data';
    const existing = document.getElementById(jsonLdId) as HTMLScriptElement | null;
    const structured = Array.isArray(finalStructuredData) ? finalStructuredData : [finalStructuredData];
    const json = JSON.stringify(structured);
    if (finalStructuredData) {
      if (existing) {
        existing.textContent = json;
      } else {
        const s = document.createElement('script');
        s.type = 'application/ld+json';
        s.id = jsonLdId;
        s.textContent = json;
        document.head.appendChild(s);
      }
    }
    ensureMeta('name', 'referrer', 'no-referrer-when-downgrade');
    ensureMeta('httpEquiv', 'X-UA-Compatible', 'IE=edge');
    ensureLink('dns-prefetch', '//www.google-analytics.com');
    ensureLink('dns-prefetch', '//www.googletagmanager.com');
    ensureLink('dns-prefetch', '//pagead2.googlesyndication.com');
    ensureLink('dns-prefetch', '//www.clarity.ms');
    ensureLink('preconnect', 'https://fonts.googleapis.com');
    const preconnectGstatic = document.createElement('link');
    preconnectGstatic.rel = 'preconnect';
    preconnectGstatic.href = 'https://fonts.gstatic.com';
    preconnectGstatic.crossOrigin = 'anonymous';
    document.head.appendChild(preconnectGstatic);
  }, [
    finalTitle,
    finalDescription,
    robots,
    author,
    siteName,
    currentLang,
    finalLocale,
    finalCanonicalUrl,
    ogType,
    finalOgImage,
    publishDate,
    modifiedDate,
    articleSection,
    finalStructuredData
  ]);

  return (
    null
  );
};

export default SEOHead;
export { SEOHead };
