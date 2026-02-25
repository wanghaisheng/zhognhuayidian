// 内容优化器 - 拆分自contentManager，专注于性能和搜索
import { marked } from 'marked';

export interface OptimizedContent {
  id: string;
  title: string;
  content: string;
  summary: string;
  language: 'zh' | 'en';
  category: string;
  tags: string[];
  slug: string;
  publishedAt: Date;
  updatedAt: Date;
  readTime: number;
  wordCount: number;
  seoScore: number;
  meta: {
    description: string;
    keywords: string[];
    author: string;
    canonicalUrl?: string;
  };
}

interface SearchIndex {
  title: Map<string, string[]>;
  content: Map<string, string[]>;
  tags: Map<string, string[]>;
  categories: Map<string, string[]>;
}

interface ContentStats {
  readability: number;
  keywordDensity: Map<string, number>;
  sentenceCount: number;
  paragraphCount: number;
  imageCount: number;
  linkCount: number;
}

export class ContentOptimizer {
  private searchIndex: SearchIndex;
  private contentCache = new Map<string, OptimizedContent>();
  private statsCache = new Map<string, ContentStats>();

  constructor() {
    this.searchIndex = {
      title: new Map(),
      content: new Map(),
      tags: new Map(),
      categories: new Map()
    };
    this.initializeMarkedOptions();
  }

  private initializeMarkedOptions() {
    marked.setOptions({
      breaks: true,
      gfm: true
    });
  }

  // 添加或更新内容
  addContent(content: Partial<OptimizedContent>): OptimizedContent {
    const optimizedContent = this.optimizeContent(content);
    this.contentCache.set(optimizedContent.id, optimizedContent);
    this.updateSearchIndex(optimizedContent);
    return optimizedContent;
  }

  // 内容优化处理
  private optimizeContent(content: Partial<OptimizedContent>): OptimizedContent {
    const processedContent = content.content || '';
    const wordCount = this.calculateWordCount(processedContent);
    const readTime = Math.ceil(wordCount / 200); // 平均每分钟200字
    const seoScore = this.calculateSEOScore(content);

    return {
      id: content.id || this.generateId(),
      title: content.title || '',
      content: processedContent,
      summary: content.summary || this.generateSummary(processedContent),
      language: content.language || 'zh',
      category: content.category || 'general',
      tags: content.tags || [],
      slug: content.slug || this.generateSlug(content.title || ''),
      publishedAt: content.publishedAt || new Date(),
      updatedAt: new Date(),
      readTime,
      wordCount,
      seoScore,
      meta: {
        description: content.meta?.description || this.generateMetaDescription(processedContent),
        keywords: content.meta?.keywords || this.extractKeywords(processedContent),
        author: content.meta?.author || 'System',
        canonicalUrl: content.meta?.canonicalUrl
      }
    };
  }

  // 生成摘要
  private generateSummary(content: string, maxLength: number = 200): string {
    const plainText = content.replace(/<[^>]*>/g, '').replace(/[#*`]/g, '');
    const sentences = plainText.split(/[。！？.!?]/).filter(s => s.trim().length > 10);
    
    let summary = '';
    for (const sentence of sentences) {
      if (summary.length + sentence.length > maxLength) break;
      summary += sentence.trim() + '。';
    }
    
    return summary || plainText.substring(0, maxLength) + '...';
  }

  // 计算词汇数量
  private calculateWordCount(content: string): number {
    const plainText = content.replace(/<[^>]*>/g, '').replace(/[#*`]/g, '');
    // 中文字符数 + 英文单词数
    const chineseChars = (plainText.match(/[\u4e00-\u9fff]/g) || []).length;
    const englishWords = plainText.match(/[a-zA-Z]+/g)?.length || 0;
    return chineseChars + englishWords;
  }

  // 计算SEO评分
  private calculateSEOScore(content: Partial<OptimizedContent>): number {
    let score = 0;
    
    // 标题长度 (10-60字符)
    const titleLength = content.title?.length || 0;
    if (titleLength >= 10 && titleLength <= 60) score += 20;
    else if (titleLength > 0) score += 10;
    
    // 描述长度 (120-160字符)
    const descLength = content.meta?.description?.length || 0;
    if (descLength >= 120 && descLength <= 160) score += 20;
    else if (descLength > 0) score += 10;
    
    // 内容长度 (至少300字)
    const contentLength = content.content?.length || 0;
    if (contentLength >= 300) score += 20;
    else if (contentLength >= 150) score += 10;
    
    // 标签数量 (3-8个)
    const tagCount = content.tags?.length || 0;
    if (tagCount >= 3 && tagCount <= 8) score += 20;
    else if (tagCount > 0) score += 10;
    
    // 关键词密度检查
    if (content.content && content.meta?.keywords) {
      const keywordDensity = this.calculateKeywordDensity(content.content, content.meta.keywords);
      const avgDensity = Array.from(keywordDensity.values()).reduce((a, b) => a + b, 0) / keywordDensity.size;
      if (avgDensity >= 1 && avgDensity <= 3) score += 20;
    }
    
    return score;
  }

  // 提取关键词
  private extractKeywords(content: string, limit: number = 10): string[] {
    const plainText = content.replace(/<[^>]*>/g, '').toLowerCase();
    const words = plainText.match(/[\u4e00-\u9fff]{2,}|[a-zA-Z]{3,}/g);
    
    if (!words || words.length === 0) {
      return [];
    }
    
    // 统计词频
    const frequency = new Map<string, number>();
    words.forEach(word => {
      if (word.length >= 2) {
        frequency.set(word, (frequency.get(word) || 0) + 1);
      }
    });
    
    // 按频率排序并返回前N个
    return Array.from(frequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([word]) => word);
  }

  // 生成元描述
  private generateMetaDescription(content: string): string {
    const summary = this.generateSummary(content, 150);
    return summary.replace(/。$/, '').substring(0, 150);
  }

  // 生成URL友好的slug
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[\u4e00-\u9fff]/g, match => encodeURIComponent(match))
      .replace(/[^a-z0-9\u4e00-\u9fff-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  // 生成ID
  private generateId(): string {
    return `content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // 更新搜索索引
  private updateSearchIndex(content: OptimizedContent) {
    const { id, title, content: contentText, tags, category } = content;
    
    // 标题索引
    this.addToIndex(this.searchIndex.title, title, id);
    
    // 内容索引
    this.addToIndex(this.searchIndex.content, contentText, id);
    
    // 标签索引
    tags.forEach(tag => {
      this.addToIndex(this.searchIndex.tags, tag, id);
    });
    
    // 分类索引
    this.addToIndex(this.searchIndex.categories, category, id);
  }

  // 添加到索引
  private addToIndex(index: Map<string, string[]>, text: string, id: string) {
    const words = text.toLowerCase().match(/[\u4e00-\u9fff]{1,}|[a-zA-Z]{2,}/g) || [];
    
    words.forEach(word => {
      if (!index.has(word)) {
        index.set(word, []);
      }
      const ids = index.get(word)!;
      if (!ids.includes(id)) {
        ids.push(id);
      }
    });
  }

  // 智能搜索
  search(query: string, options: {
    language?: 'zh' | 'en';
    category?: string;
    limit?: number;
    includeContent?: boolean;
  } = {}): {
    results: OptimizedContent[];
    suggestions: string[];
    totalFound: number;
  } {
    const { language, category, limit = 10, includeContent = false } = options;
    const searchTerms = query.toLowerCase().match(/[\u4e00-\u9fff]{1,}|[a-zA-Z]{2,}/g) || [];
    
    const matchedIds = new Set<string>();
    const scores = new Map<string, number>();
    
    // 搜索标题 (权重最高)
    searchTerms.forEach(term => {
      const ids = this.searchIndex.title.get(term) || [];
      ids.forEach(id => {
        matchedIds.add(id);
        scores.set(id, (scores.get(id) || 0) + 10);
      });
    });
    
    // 搜索标签 (权重中等)
    searchTerms.forEach(term => {
      const ids = this.searchIndex.tags.get(term) || [];
      ids.forEach(id => {
        matchedIds.add(id);
        scores.set(id, (scores.get(id) || 0) + 5);
      });
    });
    
    // 搜索内容 (权重较低)
    if (includeContent) {
      searchTerms.forEach(term => {
        const ids = this.searchIndex.content.get(term) || [];
        ids.forEach(id => {
          matchedIds.add(id);
          scores.set(id, (scores.get(id) || 0) + 1);
        });
      });
    }
    
    // 过滤和排序结果
    const results = Array.from(matchedIds)
      .map(id => this.contentCache.get(id))
      .filter(content => {
        if (!content) return false;
        if (language && content.language !== language) return false;
        if (category && content.category !== category) return false;
        return true;
      })
      .sort((a, b) => (scores.get(b!.id) || 0) - (scores.get(a!.id) || 0))
      .slice(0, limit) as OptimizedContent[];
    
    const suggestions = this.generateSearchSuggestions(query);
    
    return {
      results,
      suggestions,
      totalFound: matchedIds.size
    };
  }

  // 生成搜索建议
  private generateSearchSuggestions(query: string): string[] {
    const suggestions: Set<string> = new Set();
    const lowerQuery = query.toLowerCase();
    
    // 从标签中查找建议
    this.searchIndex.tags.forEach((_, tag) => {
      if (tag.includes(lowerQuery)) {
        suggestions.add(tag);
      }
    });
    
    return Array.from(suggestions).slice(0, 5);
  }

  // 计算关键词密度
  private calculateKeywordDensity(content: string, keywords: string[]): Map<string, number> {
    const plainText = content.replace(/<[^>]*>/g, '').toLowerCase();
    const totalWords = (plainText.match(/[\u4e00-\u9fff]|[a-zA-Z]+/g) || []).length;
    const density = new Map<string, number>();
    
    keywords.forEach(keyword => {
      const regex = new RegExp(keyword.toLowerCase(), 'g');
      const matches = plainText.match(regex)?.length || 0;
      density.set(keyword, (matches / totalWords) * 100);
    });
    
    return density;
  }

  // 分析内容统计
  analyzeContent(content: OptimizedContent): ContentStats {
    const cached = this.statsCache.get(content.id);
    if (cached) return cached;
    
    const plainText = content.content.replace(/<[^>]*>/g, '');
    const sentences = plainText.split(/[。！？.!?]/).filter(s => s.trim().length > 5);
    const paragraphs = content.content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const images = content.content.match(/<img[^>]*>/g)?.length || 0;
    const links = content.content.match(/<a[^>]*>/g)?.length || 0;
    
    const stats: ContentStats = {
      readability: this.calculateReadability(sentences),
      keywordDensity: this.calculateKeywordDensity(content.content, content.meta.keywords),
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      imageCount: images,
      linkCount: links
    };
    
    this.statsCache.set(content.id, stats);
    return stats;
  }

  // 计算可读性评分
  private calculateReadability(sentences: string[]): number {
    if (sentences.length === 0) return 0;
    
    const avgSentenceLength = sentences.reduce((sum, sentence) => {
      return sum + sentence.replace(/[\s\n\r]/g, '').length;
    }, 0) / sentences.length;
    
    // 简化的可读性评分 (基于句子长度)
    let score = 100;
    if (avgSentenceLength > 50) score -= 20;
    if (avgSentenceLength > 80) score -= 30;
    if (avgSentenceLength < 10) score -= 10;
    
    return Math.max(0, Math.min(100, score));
  }

  // 获取内容
  getContent(id: string): OptimizedContent | undefined {
    return this.contentCache.get(id);
  }

  // 获取所有内容
  getAllContent(language?: 'zh' | 'en'): OptimizedContent[] {
    const contents = Array.from(this.contentCache.values());
    if (language) {
      return contents.filter(c => c.language === language);
    }
    return contents;
  }

  // 按分类获取内容
  getContentByCategory(category: string, language?: 'zh' | 'en'): OptimizedContent[] {
    return this.getAllContent(language).filter(c => c.category === category);
  }

  // 获取相关内容
  getRelatedContent(id: string, limit: number = 5): OptimizedContent[] {
    const content = this.getContent(id);
    if (!content) return [];
    
    const allContent = this.getAllContent(content.language);
    const scored = allContent
      .filter(c => c.id !== id)
      .map(c => ({
        content: c,
        score: this.calculateSimilarity(content, c)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    
    return scored.map(item => item.content);
  }

  // 计算内容相似度
  private calculateSimilarity(content1: OptimizedContent, content2: OptimizedContent): number {
    let score = 0;
    
    // 分类匹配
    if (content1.category === content2.category) score += 30;
    
    // 标签匹配
    const commonTags = content1.tags.filter(tag => content2.tags.includes(tag));
    score += commonTags.length * 10;
    
    // 关键词匹配
    const commonKeywords = content1.meta.keywords.filter(keyword => 
      content2.meta.keywords.includes(keyword)
    );
    score += commonKeywords.length * 5;
    
    return score;
  }

  // 导出/导入功能
  exportContent(): string {
    const data = Array.from(this.contentCache.values());
    return JSON.stringify(data, null, 2);
  }

  importContent(jsonData: string): { success: boolean; imported: number; errors: string[] } {
    const errors: string[] = [];
    let imported = 0;
    
    try {
      const data = JSON.parse(jsonData);
      if (!Array.isArray(data)) {
        return { success: false, imported: 0, errors: ['数据格式错误'] };
      }
      
      data.forEach(item => {
        try {
          this.addContent(item);
          imported++;
        } catch (error) {
          errors.push(`导入内容失败: ${error}`);
        }
      });
      
      return { success: errors.length === 0, imported, errors };
    } catch (error) {
      return { success: false, imported: 0, errors: [`解析失败: ${error}`] };
    }
  }

  // 清理缓存
  clearCache(): void {
    this.contentCache.clear();
    this.statsCache.clear();
    this.searchIndex = {
      title: new Map(),
      content: new Map(),
      tags: new Map(),
      categories: new Map()
    };
  }
}

export const contentOptimizer = new ContentOptimizer();
export default contentOptimizer;