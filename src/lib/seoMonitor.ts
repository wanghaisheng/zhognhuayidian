// SEO监控和自动检查系统
import { seoOptimizer } from './seoOptimizer';
import i18n from '@/lib/i18n';

interface SEOCheckResult {
  url: string;
  issues: Array<{
    type: string;
    severity: 'critical' | 'warning' | 'info';
    message: string;
    suggestion: string;
  }>;
  score: number;
  timestamp: Date;
}

interface PageMetrics {
  loadTime: number;
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
}

export class SEOMonitor {
  private checkQueue: string[] = [];
  private results: Map<string, SEOCheckResult> = new Map();
  private isRunning = false;

  // 批量检查页面SEO
  async checkMultiplePages(urls: string[]): Promise<Map<string, SEOCheckResult>> {
    console.log(`🔍 开始检查${urls.length}个页面的SEO状态...`);
    
    for (const url of urls) {
      try {
        const result = await this.checkPageSEO(url);
        this.results.set(url, result);
        
        // 输出进度
        const progress = ((this.results.size / urls.length) * 100).toFixed(1);
        console.log(`✅ ${url} 检查完成 (${progress}%)`);
        
      } catch (error) {
        console.error(`❌ 检查${url}时出错:`, error);
      }
    }
    
    console.log('🎉 SEO检查完成！');
    return this.results;
  }

  // 检查单个页面SEO
  async checkPageSEO(url: string): Promise<SEOCheckResult> {
    const issues: SEOCheckResult['issues'] = [];
    let score = 100;

    try {
      // 如果在浏览器环境中，检查当前页面
      if (typeof window !== 'undefined' && url === window.location.pathname) {
        // 检查meta标签
        const metaIssues = this.checkMetaTags();
        issues.push(...metaIssues);
        
        // 检查结构化数据
        const schemaIssues = this.checkStructuredData();
        issues.push(...schemaIssues);
        
        // 检查内容质量
        const contentIssues = this.checkContentQuality();
        issues.push(...contentIssues);
        
        // 检查性能指标
        const performanceIssues = await this.checkPerformanceMetrics();
        issues.push(...performanceIssues);
        
        // 检查内链结构
        const linkIssues = this.checkInternalLinks();
        issues.push(...linkIssues);
      }

      // 计算总分
      score = this.calculateSEOScore(issues);
      
    } catch (error) {
      console.error('SEO检查出错:', error);
      issues.push({
        type: 'system_error',
        severity: 'critical',
        message: i18n.t('common.error'),
        suggestion: '请检查页面是否正确加载'
      });
    }

    return {
      url,
      issues,
      score,
      timestamp: new Date()
    };
  }

  // 检查meta标签
  private checkMetaTags(): SEOCheckResult['issues'] {
    if (typeof window === 'undefined') return [];
    
    const issues: SEOCheckResult['issues'] = [];
    
    // 检查title标签
    const title = document.querySelector('title')?.textContent || '';
    if (!title) {
      issues.push({
        type: 'missing_title',
        severity: 'critical',
        message: i18n.t('common.seoReport.missingTitle'),
        suggestion: i18n.t('common.seoReport.addTitle')
      });
    } else if (title.length < 30) {
      issues.push({
        type: 'short_title',
        severity: 'warning',
        message: i18n.t('common.seoReport.shortTitle', { length: title.length }),
        suggestion: i18n.t('common.seoReport.titleLengthSuggestion')
      });
    } else if (title.length > 60) {
      issues.push({
        type: 'long_title',
        severity: 'warning',
        message: i18n.t('common.seoReport.longTitle', { length: title.length }),
        suggestion: i18n.t('common.seoReport.titleLengthSuggestion')
      });
    }

    // 检查meta description
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    if (!description) {
      issues.push({
        type: 'missing_description',
        severity: 'critical',
        message: i18n.t('common.seoReport.missingDesc'),
        suggestion: i18n.t('common.seoReport.addDesc')
      });
    } else if (description.length < 120) {
      issues.push({
        type: 'short_description',
        severity: 'warning',
        message: i18n.t('common.seoReport.shortDesc', { length: description.length }),
        suggestion: i18n.t('common.seoReport.descLengthSuggestion')
      });
    } else if (description.length > 160) {
      issues.push({
        type: 'long_description',
        severity: 'warning',
        message: i18n.t('common.seoReport.longDesc', { length: description.length }),
        suggestion: i18n.t('common.seoReport.descLengthSuggestion')
      });
    }

    // 检查canonical标签
    const canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      issues.push({
        type: 'missing_canonical',
        severity: 'critical',
        message: i18n.t('common.seoReport.missingCanonical'),
        suggestion: i18n.t('common.seoReport.addCanonical')
      });
    }

    // 检查hreflang标签
    const hreflangTags = document.querySelectorAll('link[rel="alternate"][hreflang]');
    if (hreflangTags.length === 0) {
      issues.push({
        type: 'missing_hreflang',
        severity: 'warning',
        message: i18n.t('common.seoReport.missingHreflang'),
        suggestion: i18n.t('common.seoReport.addHreflang')
      });
    }

    // 检查robots meta
    const robots = document.querySelector('meta[name="robots"]')?.getAttribute('content') || '';
    if (robots.includes('noindex')) {
      issues.push({
        type: 'noindex_found',
        severity: 'critical',
        message: i18n.t('common.seoReport.noindexFound'),
        suggestion: i18n.t('common.seoReport.checkIndex')
      });
    }

    return issues;
  }

  // 检查结构化数据
  private checkStructuredData(): SEOCheckResult['issues'] {
    if (typeof window === 'undefined') return [];
    
    const issues: SEOCheckResult['issues'] = [];
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    
    if (scripts.length === 0) {
      issues.push({
        type: 'missing_structured_data',
        severity: 'warning',
        message: i18n.t('common.seoReport.missingStructuredData'),
        suggestion: i18n.t('common.seoReport.addSchema')
      });
    } else {
      scripts.forEach((script, index) => {
        try {
          const data = JSON.parse(script.textContent || '');
          const validation = seoOptimizer.validateStructuredData(data);
          
          if (!validation.valid) {
            issues.push({
              type: 'invalid_structured_data',
              severity: 'warning',
              message: i18n.t('common.seoReport.invalidSchemaValidation', { index: index + 1, errors: validation.errors.join(', ') }),
              suggestion: i18n.t('common.seoReport.fixSchema')
            });
          }
        } catch (error) {
          issues.push({
            type: 'malformed_structured_data',
            severity: 'warning',
            message: i18n.t('common.seoReport.malformedSchema', { index: index + 1 }),
            suggestion: i18n.t('common.seoReport.checkJson')
          });
        }
      });
    }

    return issues;
  }

  // 检查内容质量
  private checkContentQuality(): SEOCheckResult['issues'] {
    if (typeof window === 'undefined') return [];
    
    const issues: SEOCheckResult['issues'] = [];
    
    // 检查H1标签
    const h1Tags = document.querySelectorAll('h1');
    if (h1Tags.length === 0) {
      issues.push({
        type: 'missing_h1',
        severity: 'critical',
        message: i18n.t('common.seoReport.missingH1'),
        suggestion: i18n.t('common.seoReport.addH1')
      });
    } else if (h1Tags.length > 1) {
      issues.push({
        type: 'multiple_h1',
        severity: 'warning',
        message: i18n.t('common.seoReport.multipleH1', { count: h1Tags.length }),
        suggestion: i18n.t('common.seoReport.oneH1')
      });
    }

    // 检查内容长度
    const bodyText = document.body.innerText || '';
    const wordCount = bodyText.trim().split(/\s+/).length;
    
    if (wordCount < 300) {
      issues.push({
        type: 'thin_content',
        severity: 'warning',
        message: i18n.t('common.seoReport.thinContent', { count: wordCount }),
        suggestion: i18n.t('common.seoReport.addContent')
      });
    }

    // 检查图片alt属性
    const images = document.querySelectorAll('img');
    let missingAltCount = 0;
    
    images.forEach(img => {
      if (!img.getAttribute('alt')) {
        missingAltCount++;
      }
    });

    if (missingAltCount > 0) {
      issues.push({
        type: 'missing_alt_text',
        severity: 'warning',
        message: i18n.t('common.seoReport.missingAlt', { count: missingAltCount }),
        suggestion: i18n.t('common.seoReport.addAlt')
      });
    }

    return issues;
  }

  // 检查性能指标
  private async checkPerformanceMetrics(): Promise<SEOCheckResult['issues']> {
    if (typeof window === 'undefined') return [];
    
    const issues: SEOCheckResult['issues'] = [];

    try {
      // 检查Core Web Vitals
      if ('web-vitals' in window) {
        // 这里可以集成web-vitals库的检查
        // 暂时用性能API进行基本检查
      }

      // 检查页面加载时间
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        
        if (loadTime > 3000) {
          issues.push({
            type: 'slow_loading',
            severity: 'warning',
            message: i18n.t('common.seoReport.slowLoading', { time: (loadTime / 1000).toFixed(2) }),
            suggestion: i18n.t('common.seoReport.optimizeSpeed')
          });
        }
      }

    } catch (error) {
      console.warn('性能检查出错:', error);
    }

    return issues;
  }

  // 检查内链结构
  private checkInternalLinks(): SEOCheckResult['issues'] {
    if (typeof window === 'undefined') return [];
    
    const issues: SEOCheckResult['issues'] = [];
    const links = document.querySelectorAll('a[href]');
    const internalLinks: string[] = [];
    const externalLinks: string[] = [];
    
    links.forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href.startsWith('/') || href.includes(window.location.hostname)) {
        internalLinks.push(href);
      } else if (href.startsWith('http')) {
        externalLinks.push(href);
      }
    });

    if (internalLinks.length < 3) {
      issues.push({
        type: 'insufficient_internal_links',
        severity: 'warning',
        message: i18n.t('common.seoReport.insufficientLinks', { count: internalLinks.length }),
        suggestion: i18n.t('common.seoReport.addInternalLinks')
      });
    }

    // 检查外链的nofollow属性
    const externalLinksElements = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
    let nofollowCount = 0;
    
    externalLinksElements.forEach(link => {
      if (link.getAttribute('rel')?.includes('nofollow')) {
        nofollowCount++;
      }
    });

    if (externalLinksElements.length > 0 && nofollowCount === 0) {
      issues.push({
        type: 'missing_nofollow',
        severity: 'info',
        message: i18n.t('common.seoReport.missingNofollow'),
        suggestion: i18n.t('common.seoReport.addNofollow')
      });
    }

    return issues;
  }

  // 计算SEO分数
  private calculateSEOScore(issues: SEOCheckResult['issues']): number {
    let score = 100;
    
    issues.forEach(issue => {
      switch (issue.severity) {
        case 'critical':
          score -= 25;
          break;
        case 'warning':
          score -= 10;
          break;
        case 'info':
          score -= 2;
          break;
      }
    });

    return Math.max(0, score);
  }

  // 生成SEO报告
  generateReport(): string {
    if (this.results.size === 0) {
      return i18n.t('common.seoReport.noResults');
    }

    let report = i18n.t('common.seoReport.reportTitle');
    report += '=' .repeat(50) + '\n\n';

    this.results.forEach((result, url) => {
      report += i18n.t('common.seoReport.reportPage', { url: url });
      report += i18n.t('common.seoReport.reportScore', { score: result.score });
      report += i18n.t('common.seoReport.reportTime', { time: result.timestamp.toLocaleString() });
      
      if (result.issues.length > 0) {
        report += i18n.t('common.seoReport.reportIssues');
        result.issues.forEach((issue, index) => {
          const icon = issue.severity === 'critical' ? '🔴' : 
                     issue.severity === 'warning' ? '🟡' : '🔵';
          report += `   ${index + 1}. ${icon} ${issue.message}\n`;
          report += i18n.t('common.seoReport.reportSuggestion', { suggestion: issue.suggestion });
        });
      } else {
        report += i18n.t('common.seoReport.reportNoIssues');
      }
      
      report += '\n' + '-'.repeat(50) + '\n\n';
    });

    // 总结
    const totalPages = this.results.size;
    const avgScore = Array.from(this.results.values()).reduce((sum, result) => sum + result.score, 0) / totalPages;
    const criticalIssues = Array.from(this.results.values()).reduce((sum, result) => 
      sum + result.issues.filter(issue => issue.severity === 'critical').length, 0);

    report += i18n.t('common.seoReport.reportSummary');
    report += i18n.t('common.seoReport.reportCheckedPages', { count: totalPages });
    report += i18n.t('common.seoReport.reportAvgScore', { score: avgScore.toFixed(1) });
    report += i18n.t('common.seoReport.reportCriticalIssues', { count: criticalIssues });

    return report;
  }

  // 清除结果
  clearResults(): void {
    this.results.clear();
  }

  // 获取问题最多的页面
  getMostProblematicPages(limit: number = 5): Array<{ url: string; issueCount: number; score: number }> {
    return Array.from(this.results.entries())
      .map(([url, result]) => ({
        url,
        issueCount: result.issues.length,
        score: result.score
      }))
      .sort((a, b) => b.issueCount - a.issueCount || a.score - b.score)
      .slice(0, limit);
  }
}

export const seoMonitor = new SEOMonitor();
export default seoMonitor;
