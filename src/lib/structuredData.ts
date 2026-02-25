/**
 * Schema.org Structured Data Helper Functions
 * 为各种页面类型生成标准的 JSON-LD 结构化数据
 */

import { SITE_CONFIG, getSiteName } from '@/config/site';
import type { Device, Manufacturer } from '@/hooks/useSupabaseData';

const BASE_URL = SITE_CONFIG.url;
const SITE_NAME = getSiteName('en');

// ==================== Website & Organization Schema ====================

/**
 * 生成网站主体结构化数据（用于首页）
 */
export const generateWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: BASE_URL,
  description: '专业的CT扫描仪和MRI设备信息平台，提供设备对比、制造商信息、市场分析和采购指南。',
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/logo.png`
    }
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/devices?search={search_term_string}`
    },
    'query-input': 'required name=search_term_string'
  }
});

/**
 * 生成组织结构化数据
 */
export const generateOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${BASE_URL}/logo.png`
  },
  description: '专业医疗影像设备信息和咨询服务平台',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    availableLanguage: ['zh-CN', 'en']
  }
});

// ==================== Product Schema ====================

/**
 * 生成面包屑结构化数据
 */
export const generateBreadcrumbSchema = (items: { label: string; href: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.label,
    item: item.href.startsWith('http') ? item.href : `${BASE_URL}${item.href}`
  }))
});

/**
 * 生成产品结构化数据（设备详情页）
 */
export const generateProductSchema = (device: Partial<Device> & { 
  manufacturerName?: string; 
  imageUrl?: string; 
  priceRange?: string; 
  rating?: number;
  reviewCount?: number;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: device.name,
  description: device.description,
  image: device.imageUrl || `${BASE_URL}/placeholder.svg`,
  brand: {
    '@type': 'Brand',
    name: device.manufacturer?.name || device.manufacturerName
  },
  manufacturer: {
    '@type': 'Organization',
    name: device.manufacturer?.name || device.manufacturerName,
    url: device.manufacturer?.website
  },
  model: device.model,
  category: device.type === 'ct' ? 'CT Scanner' : 'MRI System',
  offers: {
    '@type': 'Offer',
    priceCurrency: device.price_currency || 'CNY',
    price: device.priceRange || device.price_range_min ? `${device.price_range_min}-${device.price_range_max}` : undefined,
    availability: 'https://schema.org/InStock',
    seller: {
      '@type': 'Organization',
      name: device.manufacturer?.name || device.manufacturerName
    }
  },
  aggregateRating: device.rating ? {
    '@type': 'AggregateRating',
    ratingValue: device.rating,
    reviewCount: device.reviewCount || 1,
    bestRating: 5,
    worstRating: 1
  } : undefined,
  additionalProperty: device.specifications ? Object.entries(device.specifications).map(([key, value]) => ({
    '@type': 'PropertyValue',
    name: key,
    value: String(value)
  })) : []
});

// ==================== Manufacturer/Organization Schema ====================

/**
 * 生成制造商组织结构化数据
 */
export const generateManufacturerSchema = (manufacturer: Partial<Manufacturer> & { englishName?: string; foundedYear?: number; founded_year?: number; logo?: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: manufacturer.name,
  alternateName: manufacturer.englishName,
  description: manufacturer.description || `${manufacturer.name} - 专业医疗影像设备制造商`,
  url: manufacturer.website,
  logo: manufacturer.logo,
  foundingDate: manufacturer.foundedYear || manufacturer.founded_year,
  address: {
    '@type': 'PostalAddress',
    addressCountry: manufacturer.country
  },
  sameAs: [manufacturer.website].filter(Boolean),
  makesOffer: {
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Product',
      category: 'Medical Imaging Equipment'
    }
  }
});


// ==================== Article Schema ====================

/**
 * 生成文章结构化数据（知识中心、指南等）
 */
export const generateArticleSchema = (article: {
  title: string;
  description: string;
  author?: string;
  publishDate?: string;
  modifiedDate?: string;
  image?: string;
  category?: string;
  tags?: string[];
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.title,
  description: article.description,
  image: article.image || `${BASE_URL}/placeholder.svg`,
  author: {
    '@type': article.author ? 'Person' : 'Organization',
    name: article.author || SITE_NAME
  },
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/logo.png`
    }
  },
  datePublished: article.publishDate || new Date().toISOString(),
  dateModified: article.modifiedDate || article.publishDate || new Date().toISOString(),
  articleSection: article.category,
  keywords: article.tags?.join(', ')
});

// ==================== FAQ Schema ====================

/**
 * 生成FAQ结构化数据
 */
export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
});

// ==================== ItemList/CollectionPage Schema ====================

/**
 * 生成列表页面结构化数据（设备列表、制造商列表等）
 */
export const generateItemListSchema = (params: {
  type: 'devices' | 'manufacturers' | 'articles';
  items: (Partial<Device> | Partial<Manufacturer> | Record<string, unknown>)[];
  totalCount?: number;
}) => {
  const typeMap = {
    devices: 'Product',
    manufacturers: 'Organization',
    articles: 'Article'
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: params.items.slice(0, 10).map((item, index) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyItem = item as any;
      return {
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': typeMap[params.type],
          name: anyItem.name || anyItem.title || '',
          url: anyItem.url || (anyItem.id || anyItem.slug ? `${BASE_URL}/${params.type}/${anyItem.id || anyItem.slug}` : '')
        }
      };
    }),
    numberOfItems: params.totalCount || params.items.length
  };
};

/**
 * 生成集合页面结构化数据
 */
export const generateCollectionPageSchema = (params: {
  name: string;
  description: string;
  url: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: params.name,
  description: params.description,
  url: params.url
});

// ==================== How-To Schema ====================

/**
 * 生成操作指南结构化数据
 */
export const generateHowToSchema = (guide: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string; image?: string }>;
  totalTime?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: guide.name,
  description: guide.description,
  totalTime: guide.totalTime,
  step: guide.steps.map((step, index) => ({
    '@type': 'HowToStep',
    position: index + 1,
    name: step.name,
    text: step.text,
    image: step.image
  }))
});

// ==================== VideoObject Schema ====================

/**
 * 生成视频结构化数据
 */
export const generateVideoSchema = (video: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string;
  embedUrl?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: video.name,
  description: video.description,
  thumbnailUrl: video.thumbnailUrl,
  uploadDate: video.uploadDate,
  duration: video.duration,
  embedUrl: video.embedUrl
});

// ==================== Review Schema ====================

/**
 * 生成评价结构化数据
 */
export const generateReviewSchema = (review: {
  itemName: string;
  reviewBody: string;
  author: string;
  datePublished: string;
  ratingValue: number;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Review',
  itemReviewed: {
    '@type': 'Product',
    name: review.itemName
  },
  reviewBody: review.reviewBody,
  author: {
    '@type': 'Person',
    name: review.author
  },
  datePublished: review.datePublished,
  reviewRating: {
    '@type': 'Rating',
    ratingValue: review.ratingValue,
    bestRating: 5,
    worstRating: 1
  }
});

// ==================== Export All ====================

export const structuredDataHelpers = {
  generateWebsiteSchema,
  generateOrganizationSchema,
  generateProductSchema,
  generateManufacturerSchema,
  generateBreadcrumbSchema,
  generateArticleSchema,
  generateFAQSchema,
  generateItemListSchema,
  generateCollectionPageSchema,
  generateHowToSchema,
  generateVideoSchema,
  generateReviewSchema
};

export default structuredDataHelpers;
