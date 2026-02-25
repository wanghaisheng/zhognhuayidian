// 站点配置中心 - 统一管理域名和品牌信息
export const SITE_CONFIG = {
  // 域名配置
  domain: 'zhonghuayidian.org',
  url: 'https://zhonghuayidian.org',
  
  // 品牌名称（多语言）
  name: {
    en: 'Chinese Medical Classics',
    zh: '中华医典'
  },
  
  // 简短品牌名
  shortName: {
    en: 'TCM Classics',
    zh: '中华医典'
  },
  
  // 品牌标语（多语言）
  tagline: {
    en: 'Preserving Ancient Wisdom · Promoting Cultural Heritage',
    zh: '传承中医智慧 · 弘扬中华文化'
  },
  
  // 联系信息
  contact: {
    email: 'info@zhonghuayidian.org',
    supportEmail: 'support@zhonghuayidian.org'
  },
  
  // SEO 默认配置
  seo: {
    defaultTitle: {
      en: 'Chinese Medical Classics - Ancient Books and Traditional Medicine',
      zh: '中华医典 - 中医古籍与传统医学'
    },
    defaultDescription: {
      en: 'Explore 1000+ ancient Chinese medical books, 400 million characters of traditional medicine literature. Discover the wisdom of TCM through classical texts and modern research.',
      zh: '探索1000+部中国医学古籍，4亿字中医文献资料。通过古典文本和现代研究发现中医智慧。'
    },
    defaultKeywords: {
      en: 'TCM, traditional Chinese medicine, ancient books, medical classics, herbal medicine, acupuncture, Chinese culture',
      zh: '中医, 传统医学, 古籍, 医典, 中药学, 针灸, 中医文化'
    }
  },
  
  // 社交媒体
  social: {
    twitter: '@zhonghuayidian',
    linkedin: 'zhonghuayidian'
  },
  
  // 版权信息
  copyright: {
    year: new Date().getFullYear(),
    holder: {
      en: 'Chinese Medical Classics',
      zh: '中华医典'
    }
  }
} as const;

// 获取当前语言的站点名称
export const getSiteName = (lang: 'en' | 'zh' = 'en'): string => {
  return SITE_CONFIG.name[lang];
};

// 获取当前语言的SEO标题
export const getDefaultSeoTitle = (lang: 'en' | 'zh' = 'en'): string => {
  return SITE_CONFIG.seo.defaultTitle[lang];
};

// 获取当前语言的SEO描述
export const getDefaultSeoDescription = (lang: 'en' | 'zh' = 'en'): string => {
  return SITE_CONFIG.seo.defaultDescription[lang];
};

// 生成完整URL
export const getFullUrl = (path: string = ''): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_CONFIG.url}${cleanPath}`;
};
export const domain = SITE_CONFIG.domain;

export type SiteLanguage = 'en' | 'zh';
