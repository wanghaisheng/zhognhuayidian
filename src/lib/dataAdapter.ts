/**
 * Data Adapter
 * Adapts Supabase data types to Domain types
 * This ensures that data from the database (via useSupabaseData hooks)
 * is compatible with the unified Domain types used in the application.
 */

import type { Device as SupabaseDevice, Manufacturer as SupabaseManufacturer, Article as SupabaseArticle } from '@/hooks/useSupabaseData';
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Device as DomainDevice } from '@/types/device';
import type { Manufacturer as DomainManufacturer } from '@/types/manufacturer';
import type { Article as DomainArticle } from '@/types/domain'; // Article might still be in domain or needs its own file

/**
 * Adapts a Supabase Manufacturer to a Domain Manufacturer
 */
export const adaptManufacturerToDomain = (manufacturer: SupabaseManufacturer): DomainManufacturer => {
  // Map Supabase fields to Domain fields
  const domainManufacturer: DomainManufacturer = {
    id: manufacturer.id,
    name: manufacturer.name,
    name_zh: manufacturer.name_zh || manufacturer.translations?.zh?.name || undefined,
    name_en: manufacturer.name_en || manufacturer.translations?.en?.name || undefined,
    description: manufacturer.description || undefined,
    description_zh: manufacturer.description_zh || manufacturer.translations?.zh?.description || undefined,
    description_en: manufacturer.description_en || manufacturer.translations?.en?.description || undefined,
    country: manufacturer.country,
    region: '', // Region not present in Supabase schema, default to empty
    website: manufacturer.website || undefined,
    logo: manufacturer.logo_url || undefined,
    founded: manufacturer.founded_year ? String(manufacturer.founded_year) : undefined,
    marketShare: manufacturer.market_share ? String(manufacturer.market_share) : undefined,
    type: 'both', // Default, should be inferred if possible
    category: 'other', // Default
    translations: manufacturer.translations as any,
    ...manufacturer as unknown as Partial<DomainManufacturer> // Spread remaining fields
  };

  return domainManufacturer;
};

/**
 * Adapts a Supabase Device to a Domain Device
 */
export const adaptDeviceToDomain = (device: SupabaseDevice): DomainDevice => {
  const domainDevice: DomainDevice = {
    id: device.id,
    name: device.name,
    manufacturerId: device.manufacturer_id ?? device.manufacturer?.id ?? '',
    manufacturerName: device.manufacturer?.name,
    type: device.type as 'ct' | 'mri',
    description: device.description || undefined,
    description_zh: device.description_zh || device.translations?.zh?.description || undefined,
    description_en: device.description_en || device.translations?.en?.description || undefined,
    imageUrl: device.image_url || undefined,
    modelNumber: device.model || undefined, // Map 'model' to 'modelNumber'
    priceRange: device.price_range_min && device.price_range_max 
      ? `${device.price_range_min}-${device.price_range_max}` 
      : undefined,
    currency: device.price_currency || undefined,
    specifications: {
      slices: device.slice_count,
      fieldStrength: device.field_strength,
      magnetType: device.magnet_type,
      detectorRows: device.detector_type, // Assuming mapping
      ...device.specifications as Record<string, unknown>
    },
    translations: device.translations as any,
    ...device as unknown as Partial<DomainDevice>
  };

  return domainDevice;
};

/**
 * Adapts a Supabase Article to a Domain Article
 */
export const adaptArticleToDomain = (article: SupabaseArticle): DomainArticle => {
  const domainArticle: DomainArticle = {
    id: article.id,
    title: article.title,
    title_zh: article.title_zh,
    title_en: article.title_en,
    content: article.content || undefined,
    content_zh: article.content_zh || undefined,
    content_en: article.content_en || undefined,
    excerpt: article.excerpt || undefined,
    excerpt_zh: article.excerpt_zh || undefined,
    excerpt_en: article.excerpt_en || undefined,
    author: article.author || undefined,
    publishDate: article.published_at || undefined,
    tags: article.tags || undefined,
    featuredImage: article.featured_image || undefined,
    category: (article.category as DomainArticle['category']) || 'analysis',
    ...article as unknown as Partial<DomainArticle>
  };

  return domainArticle;
};
