import { supabase } from './supabase';

// 混合内容管理器
export class HybridContentManager {
  
  // 创建内容关联
  static async createContentRelationship(
    sourceType: string,
    sourceId: string,
    sourceSlug: string,
    contentPath: string,
    relationshipType: string,
    locale: string = 'en'
  ) {
    try {
      const { data, error } = await supabase
        .from('content_relationships')
        .insert({
          source_type: sourceType,
          source_id: sourceId,
          source_slug: sourceSlug,
          content_type: 'hybrid',
          content_path: contentPath,
          relationship_type: relationshipType,
          locale: locale,
          is_active: true
        });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating content relationship:', error);
      throw error;
    }
  }
  
  // 获取内容关联
  static async getContentRelationships(sourceType: string, sourceSlug: string, locale: string = 'en') {
    try {
      const { data, error } = await supabase
        .from('content_relationships')
        .select('*')
        .eq('source_type', sourceType)
        .eq('source_slug', sourceSlug)
        .eq('locale', locale)
        .eq('is_active', true)
        .order('priority', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching content relationships:', error);
      return [];
    }
  }
  
  // 更新内容元数据
  static async updateContentMetadata(
    contentPath: string,
    metadata: {
      content_type?: string;
      funnel_stage?: string;
      target_keywords?: string[];
      related_devices?: string[];
      related_manufacturers?: string[];
      word_count?: number;
      reading_time_minutes?: number;
      seo_score?: number;
    }
  ) {
    try {
      const { data, error } = await supabase
        .from('content_metadata')
        .upsert({
          content_path: contentPath,
          ...metadata,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'content_path'
        });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating content metadata:', error);
      throw error;
    }
  }
  
  // 获取内容元数据
  static async getContentMetadata(contentPath: string) {
    try {
      const { data, error } = await supabase
        .from('content_metadata')
        .select('*')
        .eq('content_path', contentPath)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
      return data;
    } catch (error) {
      console.error('Error fetching content metadata:', error);
      return null;
    }
  }
  
  // 同步设备规格数据
  static async syncDeviceSpecifications(deviceId: string, specifications: Array<{
    category?: string;
    name: string;
    value: string | number | boolean;
    unit?: string;
    isKey?: boolean;
  }>) {
    try {
      // 删除现有规格
      await supabase
        .from('device_specifications')
        .delete()
        .eq('device_id', deviceId);
      
      // 插入新规格
      if (specifications.length > 0) {
        const { data, error } = await supabase
          .from('device_specifications')
          .insert(
            specifications.map((spec, index) => ({
              device_id: deviceId,
              spec_category: spec.category || 'technical',
              spec_name: spec.name,
              spec_value: spec.value,
              spec_unit: spec.unit,
              is_key_spec: spec.isKey || false,
              display_order: index
            }))
          );
        
        if (error) throw error;
        return data;
      }
      
      return [];
    } catch (error) {
      console.error('Error syncing device specifications:', error);
      throw error;
    }
  }
  
  // 创建设备评价
  static async createDeviceReview(review: {
    device_id: string;
    reviewer_name: string;
    reviewer_title?: string;
    hospital_name?: string;
    hospital_type?: string;
    rating: number;
    review_text: string;
    pros?: string;
    cons?: string;
    use_case?: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('device_reviews')
        .insert(review);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating device review:', error);
      throw error;
    }
  }
  
  // 创建品牌对比数据
  static async createBrandComparison(comparison: {
    brand_a_slug: string;
    brand_b_slug: string;
    category: string;
    comparison_slug: string;
    scores: {
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
    };
    criteria?: Array<{
      category: string;
      name: string;
      brand_a_score: number;
      brand_b_score: number;
      weight?: number;
      description?: string;
      evidence?: string;
    }>;
  }) {
    try {
      // 获取品牌ID
      const [brandAResult, brandBResult] = await Promise.all([
        supabase.from('manufacturers').select('id').eq('slug', comparison.brand_a_slug).single(),
        supabase.from('manufacturers').select('id').eq('slug', comparison.brand_b_slug).single()
      ]);
      
      if (brandAResult.error || brandBResult.error) {
        throw new Error('Brand not found');
      }
      
      // 创建对比记录
      const { data: comparisonData, error: comparisonError } = await supabase
        .from('brand_comparisons')
        .insert({
          brand_a_id: brandAResult.data.id,
          brand_b_id: brandBResult.data.id,
          category: comparison.category,
          comparison_slug: comparison.comparison_slug,
          ...comparison.scores,
          status: 'published'
        })
        .select()
        .single();
      
      if (comparisonError) throw comparisonError;
      
      // 创建详细标准
      if (comparison.criteria && comparison.criteria.length > 0) {
        const { error: criteriaError } = await supabase
          .from('comparison_criteria')
          .insert(
            comparison.criteria.map((criterion, index) => ({
              comparison_id: comparisonData.id,
              category: criterion.category,
              criterion_name: criterion.name,
              brand_a_score: criterion.brand_a_score,
              brand_b_score: criterion.brand_b_score,
              weight: criterion.weight || 1.0,
              description: criterion.description,
              evidence: criterion.evidence,
              display_order: index
            }))
          );
        
        if (criteriaError) throw criteriaError;
      }
      
      return comparisonData;
    } catch (error) {
      console.error('Error creating brand comparison:', error);
      throw error;
    }
  }
  
  // 内容一致性检查
  static async validateContentConsistency(contentType: string, identifier: string) {
    const issues: string[] = [];
    
    try {
      switch (contentType) {
        case 'device': {
          // 检查设备是否存在
          const { data: device } = await supabase
            .from('devices')
            .select('id, name, slug')
            .eq('slug', identifier)
            .single();
          
          if (!device) {
            issues.push(`Device with slug "${identifier}" not found in database`);
            break;
          }
          
          // 检查是否有对应的Markdown文件
          const deviceContentPath = `content/devices/en/${identifier}.md`;
          const deviceRelations = await this.getContentRelationships('device', identifier);
          
          if (deviceRelations.length === 0) {
            issues.push(`No content relationships found for device "${identifier}"`);
          }
          
          // 检查规格数据
          const { data: specs } = await supabase
            .from('device_specifications')
            .select('count')
            .eq('device_id', device.id);
          
          if (!specs || specs.length === 0) {
            issues.push(`No specifications found for device "${device.name}"`);
          }
          
          break;
        }
          
        case 'comparison': {
          // 检查对比是否存在
          const { data: comparison } = await supabase
            .from('brand_comparisons')
            .select('id, comparison_slug')
            .eq('comparison_slug', identifier)
            .single();
          
          if (!comparison) {
            issues.push(`Comparison with slug "${identifier}" not found in database`);
            break;
          }
          
          // 检查对比标准
          const { data: criteria } = await supabase
            .from('comparison_criteria')
            .select('count')
            .eq('comparison_id', comparison.id);
          
          if (!criteria || criteria.length === 0) {
            issues.push(`No comparison criteria found for "${identifier}"`);
          }
          
          break;
        }
      }
      
      return {
        isValid: issues.length === 0,
        issues
      };
    } catch (error) {
      return {
        isValid: false,
        issues: [`Error validating content: ${error}`]
      };
    }
  }
  
  // 生成内容报告
  static async generateContentReport() {
    try {
      const [devicesResult, comparisonsResult, contentRelationsResult] = await Promise.all([
        supabase.from('devices').select('count').eq('is_active', true),
        supabase.from('brand_comparisons').select('count').eq('status', 'published'),
        supabase.from('content_relationships').select('count').eq('is_active', true)
      ]);
      
      const report = {
        devices: {
          total: devicesResult.data?.[0]?.count || 0,
          withContent: 0,
          withoutContent: 0
        },
        comparisons: {
          total: comparisonsResult.data?.[0]?.count || 0,
          withContent: 0,
          withoutContent: 0
        },
        contentRelationships: {
          total: contentRelationsResult.data?.[0]?.count || 0
        },
        generatedAt: new Date().toISOString()
      };
      
      return report;
    } catch (error) {
      console.error('Error generating content report:', error);
      throw error;
    }
  }
}

// 内容同步工具
export class ContentSyncTool {
  
  // 从Markdown frontmatter同步到数据库
  static async syncMarkdownToDatabase(contentPath: string, frontMatter: {
    contentType?: string;
    comparisonEntities?: {
      brandA: { slug: string };
      brandB: { slug: string };
    };
    category?: string;
    slug: string;
    comparisonCategories?: Array<{
      name: string;
      weight?: number;
      criteria?: Array<{
        name: string;
        brandAScore: number;
        brandBScore: number;
        description?: string;
      }>;
    }>;
    deviceId?: string;
    funnelStage?: string;
    seo?: { keywords?: string };
    wordCount?: number;
    readingTime?: number;
    seoScore?: number;
  }) {
    try {
      const contentType = frontMatter.contentType || 'unknown';
      
      switch (contentType) {
        case 'brand-comparison':
          if (frontMatter.comparisonEntities) {
            await HybridContentManager.createBrandComparison({
              brand_a_slug: frontMatter.comparisonEntities.brandA.slug,
              brand_b_slug: frontMatter.comparisonEntities.brandB.slug,
              category: frontMatter.category || 'general',
              comparison_slug: frontMatter.slug,
              scores: {
                image_quality_a: 4.5,
                image_quality_b: 4.3,
                service_support_a: 4.2,
                service_support_b: 4.4,
                cost_value_a: 3.8,
                cost_value_b: 4.0,
                innovation_a: 4.6,
                innovation_b: 4.2,
                reliability_a: 4.4,
                reliability_b: 4.1
              },
              criteria: frontMatter.comparisonCategories?.flatMap((category) => 
                category.criteria?.map((criterion) => ({
                  category: category.name.toLowerCase().replace(/\s+/g, '_'),
                  name: criterion.name,
                  brand_a_score: criterion.brandAScore,
                  brand_b_score: criterion.brandBScore,
                  weight: category.weight || 1.0,
                  description: criterion.description
                })) || []
              ) || []
            });
          }
          break;
          
        case 'device-detail':
          // 同步设备补充内容
          if (frontMatter.deviceId) {
            await HybridContentManager.createContentRelationship(
              'device',
              frontMatter.deviceId,
              frontMatter.slug,
              contentPath,
              'supplement'
            );
          }
          break;
      }
      
      // 更新内容元数据
      await HybridContentManager.updateContentMetadata(contentPath, {
        content_type: contentType,
        funnel_stage: frontMatter.funnelStage,
        target_keywords: frontMatter.seo?.keywords?.split(',').map((k: string) => k.trim()) || [],
        word_count: frontMatter.wordCount,
        reading_time_minutes: frontMatter.readingTime,
        seo_score: frontMatter.seoScore
      });
      
    } catch (error) {
      console.error('Error syncing markdown to database:', error);
      throw error;
    }
  }
}

export default HybridContentManager;
