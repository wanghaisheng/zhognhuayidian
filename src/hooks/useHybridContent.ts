import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMarkdownContent } from './useMarkdownContent';
import { supabase } from '@/integrations/supabase/client';
import { mapLocalizedFields, type Device, type Manufacturer } from './useSupabaseData';
import type { MarkdownContent } from '@/lib/markdown';

// 数据库内容类型定义
export interface DeviceSpecification {
  category: string;
  name: string;
  value: string | number;
  unit?: string;
  display_order?: number;
  [key: string]: unknown;
}

export interface DeviceReview {
  id: string;
  rating: number;
  comment?: string;
  content?: string;
  author?: string;
  created_at: string;
  [key: string]: unknown;
}

export interface ComparisonCriterion {
  category: string;
  name: string;
  value_a: string | number;
  value_b: string | number;
  [key: string]: unknown;
}

export interface DatabaseDevice {
  id: string;
  name: string;
  slug: string;
  manufacturer_name: string;
  manufacturer_slug: string;
  specifications_detailed: DeviceSpecification[];
  review_summary: {
    average_rating: number;
    review_count: number;
    reviews: DeviceReview[];
  };
  related_content: Record<string, unknown>[];
  description?: string;
  [key: string]: unknown;
}

export interface DatabaseComparison {
  id: string;
  comparison_slug: string;
  brand_a_name: string;
  brand_a_slug: string;
  brand_b_name: string;
  brand_b_slug: string;
  image_quality_a: number;
  image_quality_b: number;
  service_support_a: number;
  service_support_b: number;
  cost_value_a: number;
  cost_value_b: number;
  innovation_a: number;
  innovation_b: number;
  reliability_a: number;
  reliability_b: number;
  detailed_criteria: ComparisonCriterion[];
  related_content: Record<string, unknown>[];
  [key: string]: unknown;
}

// 混合内容类型定义
export interface HybridContent {
  // 数据库内容
  databaseContent: DatabaseDevice | DatabaseComparison | null;

  // Markdown内容
  markdownContent?: MarkdownContent;

  // 合并后的SEO数据
  seoData: {
    title: string;
    description: string;
    keywords: string;
    canonical: string;
  };

  // 内容类型
  contentType: 'device' | 'comparison' | 'education' | 'technology' | 'guides' | 'pricing';
}

// 辅助函数：转换规格格式
function transformSpecifications(specs: Record<string, unknown> | null): DeviceSpecification[] {
  if (!specs) return [];
  
  return Object.entries(specs).map(([key, value]) => ({
    category: 'General', // 默认分类
    name: key.replace(/([A-Z])/g, ' $1').trim(), // 驼峰转空格
    value: String(value),
    display_order: 0
  }));
}

// 数据库内容加载器
export class DatabaseContentLoader {
  // 加载设备完整信息
  static async loadDevice(slug: string, lang: string = 'en'): Promise<DatabaseDevice | null> {
    try {
      // 使用标准 devices 表查询
      const { data: deviceData, error } = await supabase
        .from('devices')
        .select('*, manufacturer:manufacturers(*)')
        .eq('slug', slug)
        .maybeSingle();

      if (error) {
        console.error('Error loading device:', error);
        return null;
      }

      if (!deviceData) return null;

      // 映射多语言字段
      const localizedDevice = mapLocalizedFields(deviceData, lang) as Device;
      const manufacturer = localizedDevice.manufacturer;

      // 获取评价数据 (如果表不存在，可能会报错，需要处理)
      const reviews = await this.loadDeviceReviews(localizedDevice.id);
      const reviewCount = reviews.length;
      const averageRating = reviewCount > 0 
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount 
        : 0;

      // 转换规格数据
      const specifications = transformSpecifications(localizedDevice.specifications as Record<string, unknown>);

      // 构造 DatabaseDevice 对象
      return {
        ...localizedDevice, // 保留其他字段，后续字段覆盖相同键
        id: localizedDevice.id,
        name: localizedDevice.name,
        slug: localizedDevice.slug,
        manufacturer_name: manufacturer?.name || '',
        manufacturer_slug: manufacturer?.slug || '',
        specifications_detailed: specifications,
        review_summary: {
          average_rating: averageRating,
          review_count: reviewCount,
          reviews: reviews
        },
        related_content: [], // 暂时为空
        description: localizedDevice.description || ''
      };
    } catch (error) {
      console.error('Error loading device:', error);
      return null;
    }
  }

  // 加载品牌对比完整信息
  static async loadComparison(slug: string): Promise<DatabaseComparison | null> {
    try {
      // 暂时不支持直接从数据库加载对比信息（表不存在），直接使用动态生成
      // const { data, error } = await supabase
      //   .from('brand_comparison_full_info')
      //   .select('*')
      //   .eq('comparison_slug', slug)
      //   .single();

      // if (error) {
         return await this.generateDynamicComparison(slug);
      // }

      // return data;
    } catch (error) {
      console.error('Error loading comparison:', error);
      return null;
    }
  }

  // 动态生成对比数据
  static async generateDynamicComparison(slug: string): Promise<DatabaseComparison | null> {
    try {
      // 解析slug获取品牌信息
      const parts = slug.split('-vs-');
      if (parts.length !== 2) return null;

      const [brandASlug, brandBWithCategory] = parts;
      const brandBParts = brandBWithCategory.split('-');
      const brandBSlug = brandBParts[0];
      // const category = brandBParts.length > 1 ? brandBParts.slice(1).join('-') : 'general';

      // 获取品牌信息
      const [brandAResult, brandBResult] = await Promise.all([
        this.loadManufacturer(brandASlug),
        this.loadManufacturer(brandBSlug)
      ]);

      if (!brandAResult || !brandBResult) return null;

      // 生成动态对比数据
      return {
        id: `dynamic-${slug}`,
        comparison_slug: slug,
        brand_a_name: brandAResult.name,
        brand_a_slug: brandAResult.slug,
        brand_b_name: brandBResult.name,
        brand_b_slug: brandBResult.slug,
        image_quality_a: 4.0, // 默认评分
        image_quality_b: 4.0,
        service_support_a: 4.0,
        service_support_b: 4.0,
        cost_value_a: 4.0,
        cost_value_b: 4.0,
        innovation_a: 4.0,
        innovation_b: 4.0,
        reliability_a: 4.0,
        reliability_b: 4.0,
        detailed_criteria: [], // 空的详细标准
        related_content: []
      };
    } catch (error) {
      console.error('Error generating dynamic comparison:', error);
      return null;
    }
  }

  // 加载制造商信息
  static async loadManufacturer(slug: string): Promise<Manufacturer | null> {
    try {
      const { data, error } = await supabase
        .from('manufacturers')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) {
        console.error('Error loading manufacturer:', error);
        return null;
      }

      // 这里不包含语言信息，所以返回原始数据，调用者需要处理本地化
      // 或者我们假设默认英语，因为这个方法主要用于内部逻辑
      // 更好的方式是传入 isZh 参数
      return data as unknown as Manufacturer; 
    } catch (error) {
      console.error('Error loading manufacturer:', error);
      return null;
    }
  }

  // 加载设备规格 (废弃，改用 JSON 字段)
  static async loadDeviceSpecifications(deviceId: string) {
    return []; // 规格现已包含在设备 JSON 字段中
  }

  // 加载设备评价
  static async loadDeviceReviews(deviceId: string): Promise<DeviceReview[]> {
    try {
      // 检查表是否存在或直接尝试查询
      // 注意：如果表不存在，Supabase 会返回错误
      const { data, error } = await supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .from('device_reviews' as any) // 使用 any 绕过类型检查，因为该表可能未在 types.ts 定义
        .select('*')
        .eq('device_id', deviceId)
        .eq('verified', true)
        .order('created_at', { ascending: false });

      if (error) {
        // console.warn('Device reviews table might not exist or error loading reviews:', error);
        return [];
      }

      return (data || []) as unknown as DeviceReview[];
    } catch (error) {
      // console.warn('Error loading device reviews:', error);
      return [];
    }
  }
}
// 混合内容加载Hook
export const useHybridContent = (
  contentType: 'device' | 'comparison' | 'education' | 'technology' | 'guides' | 'pricing',
  identifier: string,
  locale: string = 'en'
) => {
  const [hybridContent, setHybridContent] = useState<HybridContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { i18n } = useTranslation();
  const lang = locale || i18n.language || 'en';

  // 加载Markdown内容
  const markdownCategory = contentType === 'comparison' ? 'comparisons' : contentType;
  const {
    content: markdownContent,
    loading: markdownLoading,
    error: markdownError
  } = useMarkdownContent(markdownCategory, identifier, locale);

  useEffect(() => {
    const loadHybridContent = async () => {
      try {
        setLoading(true);
        setError(null);

        let databaseContent: DatabaseDevice | DatabaseComparison | null = null;

        // 根据内容类型加载对应的数据库内容
        switch (contentType) {
          case 'device':
            databaseContent = await DatabaseContentLoader.loadDevice(identifier, lang);
            break;
          case 'comparison':
            databaseContent = await DatabaseContentLoader.loadComparison(identifier);
            break;
          case 'education':
          case 'technology':
          case 'guides':
            // 纯Markdown内容，不需要加载数据库
            // 教育/技术/指南内容通常不需要数据库内容，但可以加载相关设备信息
            break;
        }

        // 等待Markdown内容加载完成
        if (!markdownLoading) {
          // 合并SEO数据
          const frontMatter = markdownContent?.frontMatter as unknown as Record<string, unknown> | undefined;
          const seo = frontMatter?.seo as Record<string, string> | undefined;
          
          let dbTitle = '';
          let dbDescription = '';

          if (contentType === 'device') {
            const device = databaseContent as unknown as DatabaseDevice;
            dbTitle = device?.name || '';
            dbDescription = device?.description || '';
          } else if (contentType === 'comparison') {
             // 对于对比页面，通常没有直接的name字段，使用slug或其他生成
             // 这里保留原有逻辑的意图，但安全访问
             const comparison = databaseContent as unknown as DatabaseComparison;
             dbTitle = comparison?.comparison_slug || ''; // 实际上可能需要更好的标题生成逻辑
          }

          const seoData = {
            title: (seo?.title as string) ||
              (frontMatter?.title as string) ||
              dbTitle ||
              'Medical Imaging Equipment',
            description: (seo?.description as string) ||
              (frontMatter?.description as string) ||
              dbDescription ||
              '',
            keywords: (seo?.keywords as string) ||
              '',
            canonical: (seo?.canonical as string) || ''
          };

          setHybridContent({
            databaseContent,
            markdownContent: markdownContent || undefined,
            seoData,
            contentType
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load hybrid content');
      } finally {
        setLoading(false);
      }
    };

    if (!markdownLoading) {
      loadHybridContent();
    }
  }, [contentType, identifier, locale, markdownContent, markdownLoading, lang]);

  return {
    content: hybridContent,
    loading: loading || markdownLoading,
    error: error || markdownError
  };
};

// 设备混合内容Hook
export const useDeviceHybridContent = (slug: string, locale: string = 'en') => {
  return useHybridContent('device', slug, locale);
};

// 对比页面混合内容Hook
export const useComparisonHybridContent = (slug: string, locale: string = 'en') => {
  return useHybridContent('comparison', slug, locale);
};

// 教育内容Hook (纯Markdown)
export const useEducationContent = (slug: string, locale: string = 'en') => {
  return useHybridContent('education', slug, locale);
};

// 专用Hook：获取设备相关的所有内容
export const useDeviceCompleteContent = (slug: string, locale: string = 'en') => {
  const hybridContent = useDeviceHybridContent(slug, locale);
  const [relatedContent, setRelatedContent] = useState<Record<string, unknown>[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  useEffect(() => {
    const loadRelatedContent = async () => {
      if (!hybridContent.content?.databaseContent) return;

      setLoadingRelated(true);
      try {
        const device = hybridContent.content.databaseContent as DatabaseDevice;

        // 加载相关内容
        const [specifications, reviews] = await Promise.all([
          DatabaseContentLoader.loadDeviceSpecifications(device.id),
          DatabaseContentLoader.loadDeviceReviews(device.id),
          // 可以添加更多相关内容加载
        ]);

        setRelatedContent([
          { type: 'specifications', data: specifications },
          { type: 'reviews', data: reviews },
        ]);
      } catch (error) {
        console.error('Error loading related content:', error);
      } finally {
        setLoadingRelated(false);
      }
    };

    if (hybridContent.content && !hybridContent.loading) {
      loadRelatedContent();
    }
  }, [hybridContent.content, hybridContent.loading]);

  return {
    ...hybridContent,
    relatedContent,
    loadingRelated
  };
};

// 专用Hook：获取对比页面的完整内容
export const useComparisonCompleteContent = (slug: string, locale: string = 'en') => {
  const hybridContent = useComparisonHybridContent(slug, locale);
  const [brandDetails, setBrandDetails] = useState<{ brandA: Record<string, unknown>, brandB: Record<string, unknown> } | null>(null);
  const [loadingBrands, setLoadingBrands] = useState(false);

  useEffect(() => {
    const loadBrandDetails = async () => {
      if (!hybridContent.content?.databaseContent) return;

      setLoadingBrands(true);
      try {
        const comparison = hybridContent.content.databaseContent as DatabaseComparison;

        // 加载品牌详细信息
        const [brandA, brandB] = await Promise.all([
          DatabaseContentLoader.loadManufacturer(comparison.brand_a_slug),
          DatabaseContentLoader.loadManufacturer(comparison.brand_b_slug)
        ]);

        setBrandDetails({ 
          brandA: (brandA as unknown as Record<string, unknown>) || {}, 
          brandB: (brandB as unknown as Record<string, unknown>) || {} 
        });
      } catch (error) {
        console.error('Error loading brand details:', error);
      } finally {
        setLoadingBrands(false);
      }
    };

    if (hybridContent.content && !hybridContent.loading) {
      loadBrandDetails();
    }
  }, [hybridContent.content, hybridContent.loading]);

  return {
    ...hybridContent,
    brandDetails,
    loadingBrands
  };
};
