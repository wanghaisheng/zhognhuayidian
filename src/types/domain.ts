/**
 * Domain Types - Unified type definitions for the CT Scanner Directory
 * 
 * This file serves as the single source of truth for all domain entities.
 * Other files in src/data/*.ts should import from here instead of defining their own.
 * 
 * These types are designed to be compatible with:
 * - Static JSON seed data (src/data/{en,zh}/seedData.json)
 * - Supabase database schema
 * - Frontend components
 */

import { Customer } from './customer';
import { Device } from './device';
import { Manufacturer } from './manufacturer';

export * from './manufacturer';
export * from './device';
export * from './customer';

/**
 * Helper type for deep recursive partial objects
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};

// ==================== Core Domain Entities ====================

// Manufacturer and Device are now exported from their respective files

// Customer is now exported from ./customer

/**
 * Article entity
 * Represents blog posts, guides, and educational content
 */
export interface Article {
    id: string;
    title: string;
    /** @deprecated Use translations pattern instead */
    title_zh?: string;
    /** @deprecated Use translations pattern instead */
    title_en?: string;
    /** @deprecated Use translations pattern instead */
    title_es?: string;
    /** @deprecated Use translations pattern instead */
    title_pt?: string;
    /** @deprecated Use translations pattern instead */
    title_de?: string;
    /** @deprecated Use translations pattern instead */
    title_ja?: string;
    /** @deprecated Use translations pattern instead */
    title_ar?: string;
    /** @deprecated Use translations pattern instead */
    englishTitle?: string; // Legacy
    slug?: string;
    content?: string;
    /** @deprecated Use translations pattern instead */
    content_zh?: string;
    /** @deprecated Use translations pattern instead */
    content_en?: string;
    /** @deprecated Use translations pattern instead */
    content_es?: string;
    /** @deprecated Use translations pattern instead */
    content_pt?: string;
    /** @deprecated Use translations pattern instead */
    content_de?: string;
    /** @deprecated Use translations pattern instead */
    content_ja?: string;
    /** @deprecated Use translations pattern instead */
    content_ar?: string;
    summary?: string;
    excerpt?: string;
    /** @deprecated Use translations pattern instead */
    excerpt_zh?: string;
    /** @deprecated Use translations pattern instead */
    excerpt_en?: string;
    /** @deprecated Use translations pattern instead */
    excerpt_es?: string;
    /** @deprecated Use translations pattern instead */
    excerpt_pt?: string;
    /** @deprecated Use translations pattern instead */
    excerpt_de?: string;
    /** @deprecated Use translations pattern instead */
    excerpt_ja?: string;
    /** @deprecated Use translations pattern instead */
    excerpt_ar?: string;
    category?: 'history' | 'technology' | 'market' | 'guide' | 'analysis';
    tags?: string[];
    author?: string;
    language?: 'zh' | 'en';
    readTime?: number;
    imageUrl?: string;
    featuredImage?: string;
    publishDate?: string;
    publishedAt?: string;
    isPublished?: boolean;
    createdAt?: string;
    updatedAt?: string;
    /**
     * Localized content using JSONB Column Pattern
     * Key is the language code (e.g., 'en', 'zh', 'es')
     * Value is a recursive partial of the main entity
     */
    translations?: Record<string, DeepPartial<Article>>;
}

/**
 * Timeline event entity
 * Represents historical milestones in CT/MRI development
 */
export interface TimelineEvent {
    year: number;
    event: string;
    /** @deprecated Use translations pattern instead */
    event_title_zh?: string;
    /** @deprecated Use translations pattern instead */
    event_title_en?: string;
    /** @deprecated Use translations pattern instead */
    event_title_es?: string;
    /** @deprecated Use translations pattern instead */
    event_title_pt?: string;
    /** @deprecated Use translations pattern instead */
    event_title_de?: string;
    /** @deprecated Use translations pattern instead */
    event_title_ja?: string;
    /** @deprecated Use translations pattern instead */
    event_title_ar?: string;
    description?: string;
    /** @deprecated Use translations pattern instead */
    description_zh?: string;
    /** @deprecated Use translations pattern instead */
    description_en?: string;
    /** @deprecated Use translations pattern instead */
    description_es?: string;
    /** @deprecated Use translations pattern instead */
    description_pt?: string;
    /** @deprecated Use translations pattern instead */
    description_de?: string;
    /** @deprecated Use translations pattern instead */
    description_ja?: string;
    /** @deprecated Use translations pattern instead */
    description_ar?: string;
    location?: string;
    significance?: string;
    manufacturerId?: string;
    scope?: 'global' | 'domestic';
    /**
     * Localized content using JSONB Column Pattern
     * Key is the language code (e.g., 'en', 'zh', 'es')
     * Value is a recursive partial of the main entity
     */
    translations?: Record<string, DeepPartial<TimelineEvent>>;
}

/**
 * Timeline data structure
 */
export interface Timeline {
    ct: TimelineEvent[];
    mri: TimelineEvent[];
}

// ==================== Seed Data Structure ====================

/**
 * Complete seed data structure
 * Matches the JSON structure in src/data/{en,zh}/seedData.json
 */
export interface SeedData {
    metadata: {
        version: string;
        generatedAt: string;
        description: string;
        dataSource: string;
        currency: string;
        language: 'en' | 'zh';
    };
    manufacturers: Manufacturer[];
    devices: Device[];
    customers: Customer[];
    articles?: Article[];
    timeline: Timeline;
}

// ==================== Helper Types ====================

/**
 * Language code type
 */
export type LanguageCode = 'en' | 'zh' | 'es' | 'pt' | 'de' | 'ja' | 'ar';

/**
 * Device category type
 */
export type DeviceCategory = 'high-end' | 'mid-range' | 'entry-level';

/**
 * Manufacturer category type
 */
export type ManufacturerCategory = 'global' | 'domestic' | 'major' | 'notable' | 'other' | string;

/**
 * Equipment type
 */
export type EquipmentType = 'ct' | 'mri' | 'both';
