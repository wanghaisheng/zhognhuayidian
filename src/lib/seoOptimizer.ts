// SEO优化器 - 解决重复内容和索引问题
import { seoManager } from './seo';
import type { SEOData } from './seo';
import { SITE_CONFIG } from '@/config/site';
import i18n from '@/lib/i18n';

interface SEOIssue {
  type: 'duplicate_content' | 'missing_canonical' | 'wrong_robots' | 'poor_content';
  severity: 'high' | 'medium' | 'low';
  page: string;
  description: string;
  fix: string;
}

interface URLNormalizationConfig {
  baseUrl: string;
  enforceHttps: boolean;
  enforceTrailingSlash: boolean;
  lowercaseUrls: boolean;
}

export class SEOOptimizer {
  private baseUrl = SITE_CONFIG.url;
  private supportedLanguages = ['en', 'zh'];
  private issues: SEOIssue[] = [];

  // URL规范化配置
  private urlConfig: URLNormalizationConfig = {
    baseUrl: this.baseUrl,
    enforceHttps: true,
    enforceTrailingSlash: false,
    lowercaseUrls: true
  };

  // 规范化URL
  normalizeUrl(url: string, includeTrailingSlash: boolean = false): string {
    let normalized = url;

    // 移除重复斜杠
    normalized = normalized.replace(/\/+/g, '/');
    
    // 确保以斜杠开头
    if (!normalized.startsWith('/')) {
      normalized = '/' + normalized;
    }

    // 转换为小写（除了查询参数）
    if (this.urlConfig.lowercaseUrls) {
      const [path, query] = normalized.split('?');
      normalized = path.toLowerCase() + (query ? '?' + query : '');
    }

    // 处理尾斜杠
    if (includeTrailingSlash && !normalized.endsWith('/') && !normalized.includes('.')) {
      normalized += '/';
    } else if (!includeTrailingSlash && normalized.endsWith('/') && normalized !== '/') {
      normalized = normalized.slice(0, -1);
    }

    return normalized;
  }

  // 生成规范URL
  generateCanonicalUrl(path: string, language: string = 'zh'): string {
    const normalizedPath = this.normalizeUrl(path);
    
    if (language === 'zh') {
      return `${this.baseUrl}${normalizedPath}`;
    } else {
      return `${this.baseUrl}/${language}${normalizedPath}`;
    }
  }

  // 生成hreflang链接
  generateHreflangLinks(path: string): { href: string; hreflang: string }[] {
    const normalizedPath = this.normalizeUrl(path);
    
    return [
      { href: `${this.baseUrl}${normalizedPath}`, hreflang: 'en' },
      { href: `${this.baseUrl}/zh${normalizedPath}`, hreflang: 'zh' },
      { href: `${this.baseUrl}${normalizedPath}`, hreflang: 'x-default' }
    ];
  }

  // 检测重复内容
  detectDuplicateContent(pages: Array<{ path: string; title: string; description: string }>): SEOIssue[] {
    const duplicates: SEOIssue[] = [];
    const titleMap = new Map<string, string[]>();
    const descriptionMap = new Map<string, string[]>();

    // 检查重复标题
    pages.forEach(page => {
      const title = page.title.toLowerCase().trim();
      if (!titleMap.has(title)) {
        titleMap.set(title, []);
      }
      titleMap.get(title)!.push(page.path);
    });

    // 检查重复描述
    pages.forEach(page => {
      const description = page.description.toLowerCase().trim();
      if (!descriptionMap.has(description)) {
        descriptionMap.set(description, []);
      }
      descriptionMap.get(description)!.push(page.path);
    });

    // 标记重复项
    titleMap.forEach((paths, title) => {
      if (paths.length > 1) {
        duplicates.push({
          type: 'duplicate_content',
          severity: 'high',
          page: paths.join(', '),
          description: i18n.t('common.seoReport.duplicateTitle', { title: title }),
          fix: i18n.t('common.seoReport.createUniqueTitle')
        });
      }
    });

    descriptionMap.forEach((paths, description) => {
      if (paths.length > 1) {
        duplicates.push({
          type: 'duplicate_content',
          severity: 'medium',
          page: paths.join(', '),
          description: i18n.t('common.seoReport.duplicateDesc', { desc: description.substring(0, 50) }),
          fix: i18n.t('common.seoReport.createUniqueDesc')
        });
      }
    });

    return duplicates;
  }

  // 生成结构化数据验证
  validateStructuredData(schema: object): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!schema || typeof schema !== 'object') {
      errors.push(i18n.t('common.seoReport.invalidStructuredData'));
      return { valid: false, errors };
    }

    const data = schema as Record<string, unknown>;
    
    // 检查基本必需字段
    if (!data['@context']) {
      errors.push(i18n.t('common.seoReport.missingContext'));
    }
    
    if (!data['@type']) {
      errors.push(i18n.t('common.seoReport.missingType'));
    }

    // 根据类型检查特定字段
    switch (data['@type']) {
      case 'Product':
        if (!data.name) errors.push(i18n.t('common.seoReport.productMissingName'));
        if (!data.description) errors.push(i18n.t('common.seoReport.productMissingDesc'));
        break;
      case 'Organization':
        if (!data.name) errors.push(i18n.t('common.seoReport.orgMissingName'));
        break;
      case 'Article':
        if (!data.headline) errors.push(i18n.t('common.seoReport.articleMissingHeadline'));
        if (!data.author) errors.push(i18n.t('common.seoReport.articleMissingAuthor'));
        break;
    }

    return { valid: errors.length === 0, errors };
  }

  // 生成内容质量分析
  analyzeContentQuality(content: string, minLength: number = 300): {
    score: number;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 100;

    // 长度检查
    if (content.length < minLength) {
      issues.push(i18n.t('common.seoReport.contentTooShort', { length: content.length, min: minLength }));
      score -= 30;
      suggestions.push(i18n.t('common.seoReport.addMoreContent'));
    }

    // 重复内容检查
    const words = content.toLowerCase().split(/\s+/);
    const wordCount = new Map<string, number>();
    words.forEach(word => {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    });

    const duplicateWords = Array.from(wordCount.entries())
      .filter(([word, count]) => count > 10 && word.length > 3)
      .length;

    if (duplicateWords > 5) {
      issues.push(i18n.t('common.seoReport.tooManyRepeated'));
      score -= 20;
      suggestions.push(i18n.t('common.seoReport.reduceRepetition'));
    }

    // 标点符号和格式检查
    const sentenceCount = content.split(/[.!?。！？]/).length - 1;
    if (sentenceCount < 3) {
      issues.push(i18n.t('common.seoReport.tooFewSentences'));
      score -= 15;
      suggestions.push(i18n.t('common.seoReport.addMoreDetails'));
    }

    return { score: Math.max(0, score), issues, suggestions };
  }

  // 生成robots meta标签建议
  generateRobotsMetaSuggestion(pageType: string, isPublic: boolean = true): string {
    if (!isPublic) {
      return 'noindex,nofollow';
    }

    switch (pageType) {
      case 'product':
      case 'category':
      case 'article':
        return 'index,follow';
      case 'search':
      case 'filter':
        return 'noindex,follow';
      case 'pagination':
        return 'noindex,follow';
      case 'private':
      case 'admin':
        return 'noindex,nofollow';
      default:
        return 'index,follow';
    }
  }

  // 检测孤立页面（没有内链的页面）
  detectOrphanPages(pages: string[], internalLinks: Map<string, string[]>): string[] {
    const orphans: string[] = [];
    
    pages.forEach(page => {
      let hasIncomingLinks = false;
      
      internalLinks.forEach((links, sourcePage) => {
        if (links.includes(page) && sourcePage !== page) {
          hasIncomingLinks = true;
        }
      });

      if (!hasIncomingLinks && page !== '/') {
        orphans.push(page);
      }
    });

    return orphans;
  }

  // 生成内链建议
  generateInternalLinkSuggestions(currentPage: string, allPages: string[]): {
    related: string[];
    breadcrumb: string[];
    contextual: string[];
  } {
    const related: string[] = [];
    const breadcrumb: string[] = [];
    const contextual: string[] = [];

    // 生成面包屑路径
    const pathSegments = currentPage.split('/').filter(Boolean);
    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += '/' + segment;
      if (currentPath !== currentPage && allPages.includes(currentPath)) {
        breadcrumb.push(currentPath);
      }
    });

    // 查找相关页面
    allPages.forEach(page => {
      if (page === currentPage) return;

      // 检查路径相似性
      const pageSegments = page.split('/').filter(Boolean);
      const commonSegments = pathSegments.filter(segment => 
        pageSegments.includes(segment)
      );

      if (commonSegments.length > 0) {
        related.push(page);
      }

      // 检查语义相关性（简单关键词匹配）
      const currentKeywords = currentPage.split(/[-/]/).filter(Boolean);
      const pageKeywords = page.split(/[-/]/).filter(Boolean);
      
      const commonKeywords = currentKeywords.filter(keyword => 
        pageKeywords.includes(keyword)
      );

      if (commonKeywords.length > 1) {
        contextual.push(page);
      }
    });

    return {
      related: related.slice(0, 5),
      breadcrumb,
      contextual: contextual.slice(0, 3)
    };
  }

  // 生成SEO优化报告
  generateSEOReport(): {
    summary: string;
    issues: SEOIssue[];
    recommendations: string[];
    priority: 'critical' | 'important' | 'minor';
  } {
    const criticalIssues = this.issues.filter(issue => issue.severity === 'high');
    const recommendations: string[] = [];

    // 基于问题生成建议
    if (criticalIssues.length > 0) {
      recommendations.push(i18n.t('common.seoReport.fixCritical'));
      recommendations.push(i18n.t('common.seoReport.canonical'));
      recommendations.push(i18n.t('common.seoReport.hreflang'));
    }

    recommendations.push(i18n.t('common.seoReport.gsc'));
    recommendations.push(i18n.t('common.seoReport.speed'));
    recommendations.push(i18n.t('common.seoReport.quality'));

    return {
      summary: i18n.t('common.seoReport.summary', { issues: this.issues.length, critical: criticalIssues.length }),
      issues: this.issues,
      recommendations,
      priority: criticalIssues.length > 0 ? 'critical' : 'important'
    };
  }

  // 清除已记录的问题
  clearIssues(): void {
    this.issues = [];
  }
}

export const seoOptimizer = new SEOOptimizer();
export default seoOptimizer;
