// SEO管理器
import type { Device } from '@/types/device';
import type { Manufacturer } from '@/types/manufacturer';
import type { Article as ArticleType } from '@/types/domain';
import type { Device as SupabaseDevice, Manufacturer as SupabaseManufacturer, Article as SupabaseArticle } from '@/hooks/useSupabaseData';
import { adaptDeviceToDomain, adaptManufacturerToDomain, adaptArticleToDomain } from '@/lib/dataAdapter';
import { SITE_CONFIG, getSiteName } from '@/config/site';
import i18n from '@/lib/i18n';
import { SEO_DEFAULTS } from '@/config/constants';

export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  schema?: object | object[];
  author?: string;
  publishDate?: string;
  modifiedDate?: string;
  locale?: string;
  alternateLanguages?: { href: string; hreflang: string }[];
  robots?: string;
  siteName?: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface ListingFilters {
  country?: string;
  type?: string;
  category?: string;
}

export class SEOManager {
  private baseUrl = SITE_CONFIG.url;
  private siteName = getSiteName('en');
  private defaultImage = SEO_DEFAULTS.defaultImage;
  private defaultLocale = SEO_DEFAULTS.defaultLocale;

  // 生成页面SEO配置
  generatePageSEO(data: SEOData): SEOData {
    return {
      siteName: this.siteName,
      canonical: data.canonical || this.baseUrl,
      ogImage: data.ogImage || this.defaultImage,
      ogType: data.ogType || 'website',
      twitterCard: data.twitterCard || SEO_DEFAULTS.twitterCard,
      locale: data.locale || this.defaultLocale,
      robots: data.robots || SEO_DEFAULTS.robots,
      ...data
    };
  }

  // 生成产品页面SEO
  generateProductSEO(product: Device | SupabaseDevice): SEOData {
    // Adapt to Domain type
    const d = 'manufacturer_id' in product ? adaptDeviceToDomain(product as SupabaseDevice) : product as Device;
    
    const price = d.priceRange || '';
    const manufacturer = d.manufacturerName || d.brand || '';
    
    return this.generatePageSEO({
      title: i18n.t('data.seo.product.title', { name: d.name, manufacturer, siteName: this.siteName }),
      description: i18n.t('data.seo.product.description', { 
        name: d.name, 
        manufacturer, 
        price,
        siteName: this.siteName 
      }),
      keywords: [
        d.name,
        manufacturer,
        d.type === 'ct' ? i18n.t('data.seo.product.keywords.ct') : i18n.t('data.seo.product.keywords.mri'),
        i18n.t('data.seo.product.keywords.medical'),
        i18n.t('data.seo.product.keywords.diagnosis'),
        String(price)
      ].filter(Boolean),
      ogType: 'product',
      schema: this.generateProductSchema(d)
    });
  }

  // 生成制造商页面SEO
  generateManufacturerSEO(manufacturer: Manufacturer | SupabaseManufacturer): SEOData {
    // Adapt to Domain type
    const m = 'name_en' in manufacturer && !('nameEn' in manufacturer) ? adaptManufacturerToDomain(manufacturer as SupabaseManufacturer) : manufacturer as Manufacturer;
    
    return this.generatePageSEO({
      title: i18n.t('data.seo.manufacturer.title', { name: m.name, siteName: this.siteName }),
      description: i18n.t('data.seo.manufacturer.description', { 
        name: m.name, 
        country: m.country, 
        features: (m.productFeatures as string) || i18n.t('data.seo.product.keywords.medical'),
        siteName: this.siteName
      }),
      keywords: [
        m.name,
        m.country,
        i18n.t('data.seo.manufacturer.keywords.manufacturer'),
        i18n.t('data.seo.manufacturer.keywords.ct'),
        i18n.t('data.seo.manufacturer.keywords.mri'),
        m.category || ''
      ].filter(Boolean),
      ogType: 'website',
      schema: this.generateOrganizationSchema(m)
    });
  }

  // 生成文章页面SEO
  generateArticleSEO(article: ArticleType | SupabaseArticle): SEOData {
    // Adapt to Domain type
    const a = 'content_en' in article ? adaptArticleToDomain(article as SupabaseArticle) : article as ArticleType;
    
    return this.generatePageSEO({
      title: `${a.title} | ${this.siteName}`,
      description: (a.excerpt as string) || a.summary || '',
      keywords: (a.tags as string[]) || [],
      ogType: 'article',
      author: a.author,
      publishDate: a.publishedAt || a.publishDate,
      modifiedDate: a.updatedAt || a.publishedAt || a.publishDate,
      schema: this.generateArticleSchema(a)
    });
  }

  // 生成列表页面SEO
  generateListingSEO(type: 'devices' | 'manufacturers' | 'brands', filters?: ListingFilters): SEOData {
    const typeNames = {
      devices: i18n.t('data.seo.listing.types.devices'),
      manufacturers: i18n.t('data.seo.listing.types.manufacturers'),
      brands: i18n.t('data.seo.listing.types.brands')
    };

    const filterText = filters ? this.generateFilterText(filters) : '';
    const typeName = typeNames[type];

    return this.generatePageSEO({
      title: i18n.t('data.seo.listing.title', { typeName, filterText, siteName: this.siteName }),
      description: i18n.t('data.seo.listing.description', { typeName, filterText }),
      keywords: [
        typeName, 
        i18n.t('data.seo.product.keywords.ct'), 
        i18n.t('data.seo.product.keywords.mri'), 
        i18n.t('data.seo.product.keywords.medical'), 
        i18n.t('data.seo.listing.keywords.0'), // 目录
        i18n.t('data.seo.listing.keywords.1')  // 对比
      ].concat(
        filters?.country ? [filters.country] : [],
        filters?.type ? [filters.type] : []
      ),
      schema: this.generateCollectionPageSchema(type, filters)
    });
  }

  // 生成面包屑Schema
  generateBreadcrumbSchema(items: BreadcrumbItem[]): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${this.baseUrl}${item.url}`
      }))
    };
  }

  // 生成产品Schema
  private generateProductSchema(d: Device): object {
    // Assuming d is already adapted Domain Device
    const manufacturer = d.manufacturerName || d.brand || '';
    
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: d.name,
      description: d.description || undefined,
      brand: {
        '@type': 'Brand',
        name: manufacturer
      },
      manufacturer: {
        '@type': 'Organization',
        name: manufacturer
      },
      model: d.modelNumber || d.name,
      category: d.type === 'ct' ? 'CT Scanner' : 'MRI System',
      offers: {
        '@type': 'Offer',
        priceCurrency: d.currency || 'CNY',
        price: d.priceRange,
        availability: 'https://schema.org/InStock'
      },
      additionalProperty: Object.entries(d.specifications || {}).map(([key, value]) => ({
        '@type': 'PropertyValue',
        name: key,
        value: String(value)
      }))
    };
  }

  // 生成组织Schema
  private generateOrganizationSchema(m: Manufacturer): object {
    // Assuming m is already adapted Domain Manufacturer
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: m.name,
      alternateName: m.name_en,
      description: m.description || undefined,
      url: m.website,
      foundingDate:  m.founded || m.established,
      location: {
        '@type': 'Place',
        addressCountry: m.country
      },
      sameAs: [m.website].filter(Boolean)
    };
  }

  // 生成文章Schema
  private generateArticleSchema(a: ArticleType): object {
    // Assuming a is already adapted Domain Article
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: a.title,
      description: (a.excerpt as string) || a.summary || undefined,
      author: {
        '@type': 'Person',
        name: a.author
      },
      publisher: {
        '@type': 'Organization',
        name: this.siteName,
        logo: {
          '@type': 'ImageObject',
          url: `${this.baseUrl}/logo.png`
        }
      },
      datePublished: a.publishedAt || a.publishDate,
      dateModified: a.updatedAt || a.publishedAt || a.publishDate,
      image: a.featuredImage || a.imageUrl,
      articleSection: a.category,
      keywords: ((a.tags as string[]) || []).join(', ')
    };
  }

  // 生成集合页面Schema
  private generateCollectionPageSchema(type: string, filters?: ListingFilters): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${type} Directory`,
      description: `Comprehensive directory of medical ${type}`,
      url: this.baseUrl,
      mainEntity: {
        '@type': 'ItemList',
        name: `${type} Collection`
      }
    };
  }

  // 生成过滤器文本
  private generateFilterText(filters: ListingFilters): string {
    const parts: string[] = [];
    if (filters.country) parts.push(`${filters.country}`);
    if (filters.type) parts.push(`${filters.type}`);
    if (filters.category) parts.push(`${filters.category}`);
    
    return parts.length > 0 ? ` - ${parts.join('、')}` : '';
  }
}

export const seoManager = new SEOManager();
export default seoManager;
