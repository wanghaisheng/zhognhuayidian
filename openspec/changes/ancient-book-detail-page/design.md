# Design Document: Ancient Book Detail Page

## Technical Architecture (基于现有项目架构)

### 1. 路由与页面 (遵循TanStack Router文件化路由)

#### 1.1 路由定义
```typescript
// src/routes/book.$bookId.tsx - 古籍详情页
export const Route = createFileRoute('/book/$bookId')({
  component: BookDetailPage,
  loader: ({ params }) => loadBookData(params.bookId),
  meta: ({ params }) => generateBookSEO(params.bookId),
});

// src/routes/book.$bookId.chapter.$chapterId.tsx - 章节详情页  
export const Route = createFileRoute('/book/$bookId/chapter/$chapterId')({
  component: ChapterDetailPage,
  loader: ({ params }) => loadChapterData(params.bookId, params.chapterId),
  meta: ({ params }) => generateChapterSEO(params.bookId, params.chapterId),
});
```

#### 1.2 路由切片 (遵循现有content.tsx模式)
```typescript
// src/lib/routes/slices/book.tsx
export const bookRoutes = [
  {
    path: '/book/$bookId',
    component: 'BookDetailPage',
    loader: 'loadBookData',
    meta: 'generateBookSEO'
  },
  {
    path: '/book/$bookId/chapter/$chapterId', 
    component: 'ChapterDetailPage',
    loader: 'loadChapterData',
    meta: 'generateChapterSEO'
  }
];
```

### 2. 数据管理策略 (遵循JSONB + Domain + Markdown模式)

#### 2.1 分层模型
```typescript
// 常量层：src/data/constants/
export const BOOK_CATEGORIES = {
  MEDICAL_CLASSICS: 'medical-classics',
  MATERIA_MEDICA: 'materia-medica', 
  PRESCRIPTIONS: 'prescriptions',
  ACUPUNCTURE: 'acupuncture'
} as const;

// 结构化数据层：src/data/production/ancient-books.ts
export interface AncientBook {
  id: string;
  title: Record<LanguageCode, string>;
  dynasty: string;
  author: string;
  category: BookCategory;
  chapters: Chapter[];
  metadata: BookMetadata;
  translations: Record<LanguageCode, DeepPartial<AncientBook>>;
}

// 本地化层：src/locales/{lang}/book/
export const bookTranslations = {
  header: {
    title: '中华医典',
    description: '...'
  },
  content: {
    originalText: '古籍原文',
    translation: '白话译文', 
    interpretation: '现代解读'
  }
};
```

#### 2.2 Markdown内容管理 (遵循frontmatter规范)
```markdown
---
title: "黄帝内经"
titleEn: "Yellow Emperor's Inner Canon"
description: "中医经典著作，奠定中医理论基础"
descriptionEn: "Foundational text of Traditional Chinese Medicine"
slug: "huangdi-neijing"
category: "medical-classics"
tags: ["医经", "基础理论", "黄帝"]
seo:
  title: "黄帝内经 - 中华医典"
  description: "《黄帝内经》是中医学奠基之作，包含阴阳五行、脏腑经络等核心理论"
  keywords: ["黄帝内经", "中医经典", "医经", "基础理论"]
  canonical: "https://zhonghuayidian.org/book/huangdi-neijing"
  image: "/images/books/huangdi-neijing-cover.jpg"
dynasty: "先秦"
author: "佚名"
chapters: 18
wordCount: 25000
---

# 黄帝内经

## 素问篇

上古之人，其知道者，法于阴阳，和于术数...
```

#### 2.3 Domain Hooks (遵循现有模式)
```typescript
// src/hooks/useBookDomainContent.ts
export const useBookDomainContent = (bookId: string) => {
  const locale = useLocale();
  
  return useQuery({
    queryKey: ['book', bookId, locale],
    queryFn: async () => {
      // 1. 读取Markdown内容
      const markdown = await markdownContentManager.getContent('book', bookId, locale);
      
      // 2. 读取结构化数据
      const structured = await getBookStructuredData(bookId);
      
      // 3. 合并输出Domain对象
      return {
        title: markdown.frontmatter.title || structured.title[locale],
        description: markdown.frontmatter.description || structured.description[locale],
        content: markdown.htmlContent,
        keywords: markdown.frontmatter.seo?.keywords,
        canonical: markdown.frontmatter.seo?.canonical,
        ogImage: markdown.frontmatter.seo?.image,
        metadata: structured.metadata,
        chapters: structured.chapters
      };
    }
  });
};
```

### 3. SSR/SSG策略 (遵循混合架构)

#### 3.1 静态优先策略
```typescript
// 构建期预渲染所有公开古籍页面
// entry-server.tsx 扩展
export async function renderRouterToString(url: string) {
  const router = createAppRouter();
  
  // 预加载古籍内容
  if (url.startsWith('/book/')) {
    const bookId = extractBookId(url);
    const bookData = await markdownContentManager.getContent('book', bookId, 'zh');
    
    // 注入到window.__TANSTACK_ROUTER_CONTEXT__
    injectBookData(bookData);
  }
  
  return await router.dehydrate();
}
```

#### 3.2 客户端水合
```typescript
// entry-client.tsx
const router = createAppRouter();

// 水合服务端数据
if (window.__TANSTACK_ROUTER_CONTEXT__) {
  const bookData = window.__TANSTACK_ROUTER_CONTEXT__.bookData;
  if (bookData) {
    router.hydrate(bookData);
  }
}
```

### 4. 组件架构 (遵循原子设计模式)

#### 4.1 组件目录结构
```
src/components/book/
├── atoms/                    # 原子组件
│   ├── BookTitle.tsx        # 古籍标题
│   ├── ChapterTitle.tsx     # 章节标题  
│   ├── ReadingProgress.tsx   # 阅读进度
│   ├── TextContent.tsx      # 文本内容
│   └── index.ts
├── molecules/               # 分子组件
│   ├── BookHeader.tsx       # 古籍头部信息
│   ├── ChapterNavigation.tsx # 章节导航
│   ├── ContentTabs.tsx      # 内容标签页
│   ├── ReadingTools.tsx     # 阅读工具栏
│   ├── BookmarkButton.tsx   # 书签按钮
│   └── index.ts
├── organisms/               # 有机体组件
│   ├── BookDetailPage.tsx   # 主页面组件
│   ├── ContentViewer.tsx    # 内容查看器
│   ├── KnowledgeGraph.tsx    # 知识图谱
│   ├── RelatedBooks.tsx     # 相关推荐
│   └── index.ts
└── templates/               # 模板组件
    ├── BookLayout.tsx       # 古籍页面布局
    ├── MobileBookLayout.tsx  # 移动端布局
    └── index.ts
```

#### 4.2 类型安全 (遵循development-standards.md)
```typescript
// src/types/book.ts
export interface AncientBook {
  readonly id: string;
  readonly title: Record<LanguageCode, string>;
  readonly dynasty: string;
  readonly author: string;
  readonly category: BookCategory;
  readonly chapters: ReadonlyArray<Chapter>;
  readonly metadata: BookMetadata;
  readonly translations: Readonly<Record<LanguageCode, DeepPartial<AncientBook>>>;
}

export interface Chapter {
  readonly id: string;
  readonly title: Record<LanguageCode, string>;
  readonly order: number;
  readonly sections: ReadonlyArray<Section>;
  readonly keyConcepts: ReadonlyArray<Concept>;
}

// 严格类型检查，避免any
export function useBookData(bookId: unknown): UseQueryResult<AncientBook> {
  if (typeof bookId !== 'string') {
    throw new Error('Book ID must be a string');
  }
  
  return useQuery({
    queryKey: ['book', bookId],
    queryFn: () => fetchBook(bookId as string)
  });
}
```

### 5. SEO与结构化数据 (遵循现有SEO策略)

#### 5.1 SEOHead集成
```typescript
// src/components/book/organisms/BookDetailPage.tsx
export const BookDetailPage: React.FC = () => {
  const { bookId } = Route.useParams();
  const { data: book } = useBookDomainContent(bookId);
  
  return (
    <>
      <SEOHead
        title={book.title}
        description={book.description}
        keywords={book.keywords}
        canonical={book.canonical}
        ogImage={book.ogImage}
        structuredData={generateBookStructuredData(book)}
      />
      <BookLayout book={book} />
    </>
  );
};
```

#### 5.2 多语言SEO文件
```typescript
// src/locales/zh/seo/book/huangdi-neijing/index.ts
export const seoData = {
  title: '黄帝内经 - 中华医典',
  description: '《黄帝内经》是中医学奠基之作，包含阴阳五行、脏腑经络等核心理论',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: '黄帝内经',
    author: {
      '@type': 'Person',
      name: '佚名'
    },
    datePublished: '-2000',
    inLanguage: 'zh-CN',
    about: '中医学'
  }
};
```

### 6. 国际化策略 (遵循Adobe-style方法)

#### 6.1 URL结构
```typescript
// 中文 (默认): /book/huangdi-neijing
// 英文: /en/book/huangdi-neijing

// src/utils/multilingualRoutes.ts 扩展
export const addBookLanguagePrefix = (bookId: string, lang: SupportedLanguage): string => {
  const basePath = `/book/${bookId}`;
  return addLanguagePrefix(basePath, lang);
};
```

#### 6.2 翻译键命名空间
```typescript
// src/locales/zh/index.ts 扩展
export const zhTranslations = {
  // ...现有命名空间
  book: {
    header: {
      title: '中华医典',
      description: '...'
    },
    content: {
      originalText: '古籍原文',
      translation: '白话译文',
      interpretation: '现代解读'
    },
    navigation: {
      chapters: '章节',
      bookmarks: '书签',
      notes: '笔记',
      search: '搜索'
    }
  }
};
```

### 7. 性能优化 (遵循现有优化策略)

#### 7.1 数据预加载
```typescript
// src/lib/routes/slices/book.tsx
export const bookRoutes = [
  {
    path: '/book/$bookId',
    component: 'BookDetailPage',
    loader: async ({ params }) => {
      // 预加载古籍数据
      const bookData = await loadBookData(params.bookId);
      
      // 预加载下一章
      const nextChapter = await preloadNextChapter(params.bookId);
      
      return { bookData, nextChapter };
    },
    meta: 'generateBookSEO'
  }
];
```

#### 7.2 组件优化
```typescript
// 使用React.memo和useMemo优化
export const BookTitle = React.memo<{ title: string }>(({ title }) => {
  return <h1 className="book-title">{title}</h1>;
});

// 虚拟滚动长内容
export const VirtualizedChapterContent = ({ content }: { content: string }) => {
  const lines = useMemo(() => content.split('\n'), [content]);
  
  return (
    <FixedSizeList
      height={600}
      itemCount={lines.length}
      itemSize={24}
      itemData={lines}
    >
      {ChapterLine}
    </FixedSizeList>
  );
};
```

### 8. 错误处理与回退策略

#### 8.1 数据回退
```typescript
// src/hooks/useBookDomainContent.ts
export const useBookDomainContent = (bookId: string) => {
  return useQuery({
    queryKey: ['book', bookId],
    queryFn: async () => {
      try {
        // 1. 尝试从数据库读取
        const dbData = await fetchBookFromDB(bookId);
        return dbData;
      } catch (error) {
        console.warn('Database failed, falling back to snapshots');
        
        // 2. 回退到快照数据
        const snapshotData = await fetchBookFromSnapshot(bookId);
        return snapshotData;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000 // 5分钟
  });
};
```

#### 8.2 快照生成脚本
```typescript
// scripts/generate-ancient-books-stats.ts
export async function generateAncientBooksStats() {
  const books = await getAllBooks();
  
  const stats = {
    totalBooks: books.length,
    categories: countByCategory(books),
    dynasties: countByDynasty(books),
    totalChapters: sum(books, b => b.chapters.length),
    totalWords: sum(books, b => b.wordCount)
  };
  
  // 写入快照
  await writeSnapshot('ancient-books/global.json', { metrics: stats });
}
```

### 9. 测试策略 (遵循现有测试模式)

#### 9.1 单元测试
```typescript
// src/components/book/__tests__/BookTitle.test.tsx
describe('BookTitle', () => {
  it('should display book title correctly', () => {
    const title = '黄帝内经';
    render(<BookTitle title={title} />);
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(title);
  });
  
  it('should handle empty title gracefully', () => {
    render(<BookTitle title="" />);
    
    expect(screen.getByRole('heading', { level: 1 })).toBeEmptyDOMElement();
  });
});
```

#### 9.2 集成测试
```typescript
// src/routes/__tests__/book.$bookId.test.tsx
describe('Book Detail Route', () => {
  it('should load book data and render page', async () => {
    const bookId = 'huangdi-neijing';
    
    render(
      <MemoryRouter initialEntries={[`/book/${bookId}`]}>
        <Route path="/book/:bookId" component={BookDetailPage} />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('黄帝内经')).toBeInTheDocument();
    });
  });
});
```

### 10. 部署与监控

#### 10.1 构建优化
```typescript
// vite.config.ts 扩展
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'book-components': ['src/components/book'],
          'book-hooks': ['src/hooks/useBookData'],
          'book-types': ['src/types/book']
        }
      }
    }
  }
});
```

#### 10.2 性能监控
```typescript
// src/utils/analytics.ts 扩展
export const trackBookReading = (bookId: string, chapterId: string, progress: number) => {
  analytics.track('book_reading_progress', {
    book_id: bookId,
    chapter_id: chapterId,
    progress_percent: progress,
    timestamp: new Date().toISOString()
  });
};
```

## 架构优势

### 1. 一致性
- 完全遵循现有项目的架构模式
- 复用现有的工具函数和组件
- 保持代码风格和命名规范

### 2. 可维护性
- 清晰的分层架构
- 类型安全的TypeScript实现
- 完善的错误处理和回退机制

### 3. 性能
- SSR/SSG混合策略
- 智能预加载和缓存
- 组件级别的优化

### 4. SEO友好
- 完整的SEO元数据支持
- 结构化数据
- 多语言URL优化

### 5. 扩展性
- 模块化的组件设计
- 可扩展的数据模型
- 灵活的内容管理策略

这个架构设计完全基于现有项目的成功经验，确保了古籍详情页能够无缝集成到现有系统中，同时保持高性能和良好的用户体验。
