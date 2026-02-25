// 内容管理系统 - 处理Markdown文档和SEO优化
import { ContentMetadata } from '../types/standardized';
import i18n from './i18n';

// Markdown文档处理
export class MarkdownManager {
  // 提取Markdown文档的前言(frontmatter)
  static extractFrontmatter(content: string): { metadata: Partial<ContentMetadata>; body: string } {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
      return { metadata: {}, body: content };
    }

    const [, frontmatterStr, body] = match;
    const rawMetadata: Record<string, unknown> = {};
    
    // 解析YAML格式的前言
    const lines = frontmatterStr.split('\n');
    lines.forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.slice(0, colonIndex).trim();
        const value = line.slice(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
        
        // 处理不同数据类型
        if (key === 'keywords' || key === 'tags' || key === 'related_devices') {
          rawMetadata[key] = value.split(',').map(v => v.trim());
        } else if (key === 'featured') {
          rawMetadata[key] = value.toLowerCase() === 'true';
        } else if (key === 'reading_time') {
          rawMetadata[key] = parseInt(value, 10);
        } else {
          rawMetadata[key] = value;
        }
      }
    });

    return { metadata: rawMetadata as Partial<ContentMetadata>, body };
  }

  // 生成SEO友好的slug
  static generateSlug(filePath: string): string {
    const fileName = filePath.split('/').pop()?.replace('.md', '') || '';
    return fileName
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // 估算阅读时间（分钟）
  static estimateReadingTime(content: string): number {
    const wordsPerMinute = 200; // 中文阅读速度
    const chineseChars = (content.match(/[\u4e00-\u9fff]/g) || []).length;
    const englishWords = (content.match(/[a-zA-Z]+/g) || []).length;
    
    const totalWords = chineseChars + englishWords;
    return Math.ceil(totalWords / wordsPerMinute);
  }
}

// SEO优化工具
export class SEOOptimizer {
  // 检查SEO元素
  static analyzeSEO(metadata: ContentMetadata): {
    score: number;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 100;

    // 标题长度检查
    if (metadata.title.length < 30) {
      issues.push(i18n.t('common.seoReport.shortTitle', { length: metadata.title.length }));
      suggestions.push(i18n.t('common.seoReport.titleLengthSuggestion'));
      score -= 10;
    } else if (metadata.title.length > 60) {
      issues.push(i18n.t('common.seoReport.longTitle', { length: metadata.title.length }));
      suggestions.push(i18n.t('common.seoReport.titleMaxLengthSuggestion'));
      score -= 10;
    }

    // 描述长度检查
    if (metadata.description.length < 120) {
      issues.push(i18n.t('common.seoReport.shortDesc', { length: metadata.description.length }));
      suggestions.push(i18n.t('common.seoReport.descLengthSuggestion'));
      score -= 10;
    }

    return { score: Math.max(0, score), issues, suggestions };
  }
}