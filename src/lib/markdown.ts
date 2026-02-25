import { marked } from 'marked';
import yaml from 'js-yaml';
import { supabase } from '@/integrations/supabase/client';
const snapshotFiles = import.meta.glob('/src/data/snapshots/**/*.json');

// Use Vite's glob import to get all markdown files
// as: 'raw' ensures we get the raw string content when imported
const markdownFiles = import.meta.glob('/content/**/*.md', { as: 'raw' });

import { toFolderCategory } from '@/config/contentCategories';

// 简化的Markdown处理
export interface MarkdownFrontMatter {
  title: string;
  description: string;
  slug: string;
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  author: string;
  summary?: string;
  featuresNote?: string;
  specsNote?: string;
  specHighlights?: Array<{ key?: string; label?: string; value?: string }>;
  price?: {
    currency: string;
    unit?: string;
    min?: number;
    max?: number;
    originalText?: string;
  };
  // EEAT Fields
  authorBio?: string;
  authorCredentials?: string; // e.g. "MD, PhD, Radiologist"
  reviewer?: {
    name: string;
    title?: string;
    profileUrl?: string;
  };
  lastReviewedAt?: string;
  citations?: Array<{
    text: string;
    url?: string;
  }>;
  schemaType?: 'Article' | 'TechArticle' | 'MedicalWebPage' | 'NewsArticle';
  medicalSpecialty?: string[]; // e.g. ["Radiology", "Cardiology"]
  audience?: string; // e.g. "Patient", "Medical Professional"
  
  status: 'draft' | 'published' | 'archived';
  seo: {
    title: string;
    description: string;
    keywords: string;
    canonical: string;
    image?: string;
  };
  keywords?: string;
  canonical?: string;
  translations: Record<string, string>;
  related?: Array<{ slug: string; title: string }>;
  readingTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  contentType: 'guide' | 'tutorial' | 'reference' | 'analysis' | 'report';
  // Market Report specific fields
  type?: 'CT' | 'MRI' | 'Comprehensive';
  reportType?: 'market_analysis' | 'expert_insight';
  region?: string;
  year?: number;
  quarter?: string;
  downloadCount?: string;
  relatedReports?: Array<{
    id: string;
    title: string;
    slug: string;
    date: string;
  }>;
}

export interface MarkdownContent {
  slug: string;
  frontMatter: MarkdownFrontMatter;
  content: string;
  htmlContent: string;
  excerpt?: string;
}

// 简化的Front Matter解析器
const parseFrontMatter = (content: string): { data: Record<string, unknown>; content: string } => {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);

  if (!match) {
    return { data: {}, content };
  }

  const [, frontMatterStr, bodyContent] = match;

  try {
    const data = yaml.load(frontMatterStr) as Record<string, unknown>;
    return { data: data || {}, content: bodyContent };
  } catch (e) {
    console.error('Error parsing frontmatter:', e);
    return { data: {}, content: bodyContent };
  }
};

// 使用marked库进行Markdown到HTML转换
const markdownToHtml = async (markdown: string): Promise<string> => {
  return await marked.parse(markdown);
};

export class MarkdownContentManager {
  private contentDir: string;

  constructor(contentDir: string = 'content') {
    this.contentDir = contentDir;
  }

  // 获取单个内容
  async getContent(category: string, slug: string, locale: string = 'en'): Promise<MarkdownContent | null> {
    try {
      const dbContent = await this.loadFromDB(category, slug, locale);
      if (dbContent) return dbContent;
      const snapshotContent = await this.loadFromSnapshot(category, slug, locale);
      if (snapshotContent) return snapshotContent;
      const realContent = await this.loadRealContent(category, slug, locale);
      if (realContent) return realContent;

      if (locale !== 'en') {
        const fallbackContent =
          (await this.loadFromDB(category, slug, 'en')) ||
          (await this.loadFromSnapshot(category, slug, 'en')) ||
          (await this.loadRealContent(category, slug, 'en'));
        if (fallbackContent) return fallbackContent;
      }

      // 如果没有找到真实文件，返回null
      return null;
    } catch (error) {
      console.error(`Error loading content: ${category}/${locale}/${slug}`, error);
      return null;
    }
  }

  private async loadFromDB(category: string, slug: string, locale: string): Promise<MarkdownContent | null> {
    try {
      const folderAlias = toFolderCategory(category);
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        // 兼容过渡期：既匹配规范分类（路由slug），也匹配目录别名
        .in('category', [category, folderAlias])
        .eq('published', true)
        .maybeSingle();
      if (error || !data) {
        return null;
      }
      const body = locale === 'zh' ? (data.content_zh ?? data.content_en) : (data.content_en ?? data.content_zh);
      const title = locale === 'zh' ? (data.title_zh ?? data.title_en) : (data.title_en ?? data.title_zh);
      const excerpt = locale === 'zh' ? (data.excerpt_zh ?? data.excerpt_en) : (data.excerpt_en ?? data.excerpt_zh);
      const htmlContent = await markdownToHtml(body || '');
      const frontMatter = {
        title: title || '',
        description: excerpt || '',
        slug,
        category,
        tags: data.tags || [],
        publishedAt: data.published_at || '',
        updatedAt: data.updated_at || '',
        author: data.author || '',
        featuresNote: undefined,
        specsNote: undefined,
        status: 'published',
        seo: {
          title: title || '',
          description: excerpt || '',
          keywords: '',
          canonical: ''
        },
        translations: {
          en: data.title_en || '',
          zh: data.title_zh || ''
        },
        related: [],
        readingTime: data.read_time ?? 0,
        difficulty: 'beginner',
        contentType: 'guide'
      } as unknown as MarkdownFrontMatter;
      return {
        slug,
        frontMatter,
        content: body || '',
        htmlContent,
        excerpt: excerpt || undefined
      };
    } catch {
      return null;
    }
  }

  private async loadFromSnapshot(category: string, slug: string, locale: string): Promise<MarkdownContent | null> {
    const filePath = `/src/data/snapshots/${locale}/content/${toFolderCategory(category)}/${slug}.json`;
    const loader = snapshotFiles[filePath];
    if (!loader) {
      return null;
    }
    const mod = await loader();
    const data = (mod as { default?: unknown })?.default ?? mod;
    const snap = data as Partial<MarkdownContent> | null;
    if (!snap) {
      return null;
    }
    const content = snap.content ?? '';
    const htmlContent = snap.htmlContent ?? (await markdownToHtml(content));
    return {
      slug,
      frontMatter: snap.frontMatter as MarkdownFrontMatter,
      content,
      htmlContent,
      excerpt: snap.excerpt,
    };
  }

  // 加载真实文件内容
  private async loadRealContent(category: string, slug: string, locale: string): Promise<MarkdownContent | null> {
    try {
      // 构建文件路径 - 对应 import.meta.glob 的 key
      const filePath = `/content/${toFolderCategory(category)}/${locale}/${slug}.md`;
      
      const loader = markdownFiles[filePath];
      if (!loader) {
        console.warn(`File not found in glob: ${filePath}`);
        return null;
      }

      // 加载文件内容
      // import.meta.glob with { as: 'raw' } returns a function that resolves to the string content
      const rawContent = await loader();
      
      // Handle case where rawContent might be a module with default export (though {as: 'raw'} usually returns string directly or in default)
      const fileContent = typeof rawContent === 'string' ? rawContent : (rawContent as { default: string }).default || '';

      const { data: frontMatter, content } = parseFrontMatter(fileContent);

      // 如果Front Matter为空，说明可能不是Markdown文件
      if (Object.keys(frontMatter).length === 0 && !content) {
        return null;
      }

      // 处理Markdown内容
      const htmlContent = await markdownToHtml(content);

      // 生成摘要
      const excerpt = this.generateExcerpt(content);

      const fm = frontMatter as Record<string, unknown>;
      const featuresNote =
        typeof fm.featuresNote === 'string' ? fm.featuresNote.slice(0, 280) : undefined;
      const specsNote =
        typeof fm.specsNote === 'string' ? fm.specsNote.slice(0, 280) : undefined;
      const summary =
        typeof fm.summary === 'string' ? fm.summary.slice(0, 280) : undefined;
      const normalizedFrontMatter = {
        ...(frontMatter as unknown as MarkdownFrontMatter),
        featuresNote,
        specsNote,
        summary
      } as MarkdownFrontMatter;
      if (normalizedFrontMatter.seo && typeof normalizedFrontMatter.seo === 'object') {
        normalizedFrontMatter.seo.canonical = '';
      }
      if (typeof normalizedFrontMatter.canonical === 'string') {
        normalizedFrontMatter.canonical = '';
      }
      return {
        slug,
        frontMatter: normalizedFrontMatter,
        content,
        htmlContent,
        excerpt
      };
    } catch (error) {
      console.error(`Error loading real content: ${category}/${locale}/${slug}`, error);
      return null;
    }
  }

  // Helper to parse path from glob result
  private parsePath(path: string): { category: string; locale: string; slug: string } | null {
    // Expected format: /content/{category}/{locale}/{slug}.md
    const match = path.match(/\/content\/([^/]+)\/([^/]+)\/([^/]+)\.md$/);
    if (!match) return null;
    return {
      category: match[1],
      locale: match[2],
      slug: match[3]
    };
  }

  // 获取分类下的所有内容列表
  async getContentList(category: string, locale: string = 'en'): Promise<MarkdownContent[]> {
    try {
      const folderCategory = toFolderCategory(category);
      // 从 import.meta.glob 获取所有文件路径
      const validPaths = Object.keys(markdownFiles).filter(path => {
         const parts = this.parsePath(path);
         return parts && parts.category === folderCategory && parts.locale === locale;
      });

      // 提取 slugs
      const slugs = validPaths.map(path => {
        const parts = this.parsePath(path);
        return parts ? parts.slug : null;
      }).filter(Boolean) as string[];

      const contents = await Promise.all(
        slugs.map(async (slug) => {
          return this.getContent(category, slug, locale);
        })
      );

      const filtered = contents.filter(Boolean) as MarkdownContent[];
      if (filtered.length === 0 && locale !== 'en') {
        return this.getContentList(category, 'en');
      }
      return filtered;
    } catch (error) {
      console.error(`Error loading content list: ${category}/${locale}`, error);
      return [];
    }
  }

  // 搜索内容
  async searchContent(query: string, category?: string, locale: string = 'en'): Promise<MarkdownContent[]> {
    // 如果指定了category，只搜索该category
    // 否则搜索所有已知category
    let categories: string[] = [];
    
    if (category) {
      categories = [category];
    } else {
      // 动态发现所有category
      const allCategories = new Set<string>();
      Object.keys(markdownFiles).forEach(path => {
        const parts = this.parsePath(path);
        if (parts && parts.locale === locale) {
          allCategories.add(parts.category);
        }
      });
      categories = Array.from(allCategories);
    }

    const allContents: MarkdownContent[] = [];

    for (const cat of categories) {
      const contents = await this.getContentList(cat, locale);
      allContents.push(...contents);
    }

    // 简单的文本搜索
    const searchTerms = query.toLowerCase().split(' ');
    const results = allContents.filter(content => {
      const searchText = `${content.frontMatter.title} ${content.frontMatter.description} ${content.content}`.toLowerCase();
      return searchTerms.some(term => searchText.includes(term));
    });

    if (results.length === 0 && locale !== 'en') {
      return this.searchContent(query, category, 'en');
    }

    return results;
  }

  // 生成内容摘要
  private generateExcerpt(content: string, maxLength: number = 200): string {
    const plainText = content
      .replace(/#{1,6}\s+/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\n+/g, ' ')
      .trim();

    if (plainText.length <= maxLength) {
      return plainText;
    }

    const truncated = plainText.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');

    return lastSpaceIndex > 0
      ? truncated.substring(0, lastSpaceIndex) + '...'
      : truncated + '...';
  }
}

export const markdownContentManager = new MarkdownContentManager();
