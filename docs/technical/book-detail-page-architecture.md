# 书籍详情页架构设计文档 v1.7.0

## 概述

本文档描述了书籍详情页的完整架构设计，包括多语言实现、数据加载策略、SEO优化和组件结构。基于中医古籍数据快照标准结构，确保所有书籍页面的一致性和完整性。本文档已更新以反映v1.7.0的脚本重组优化。

## 脚本化架构管理 (v1.7.0新增)

### 构建脚本集成
```bash
# 详情页相关构建脚本
node scripts/build/generate-prerender-routes.js    # 生成预渲染路由
node scripts/build/post-build.js                  # 构建后优化
```

### 数据管理脚本
```bash
# 书籍数据相关脚本
node scripts/data/generate-book-chapters.cjs      # 生成章节数据
node scripts/data/align-chapter-structure.cjs   # 对齐章节结构
```

## 🏗️ 架构原则

### 1. 数据分离原则

```
src/locales/     ← 静态UI文本翻译
src/data/snapshots/ ← 动态内容数据
src/seo/         ← 页面SEO元数据
```

- **静态UI文本**: 界面固定文本（按钮、标签、提示等）
- **动态内容数据**: 书籍实际内容（标题、章节、原文等）
- **SEO元数据**: 页面搜索引擎优化信息

### 2. 多语言架构

#### 文件结构
```
src/
├── locales/
│   ├── en/
│   │   ├── labels/
│   │   │   └── pages/
│   │   │       └── book-detail.ts     ← UI静态文本
│   │   └── intro.json                  ← 页面介绍文本
│   └── zh/
│       ├── labels/
│       │   └── pages/
│       │       └── book-detail.ts     ← UI静态文本
│       └── intro.json                  ← 页面介绍文本
├── data/
│   └── snapshots/
│       ├── en/
│       │   └── content/
│       │       └── ancient-books/      ← 英文书籍数据
│       └── zh/
│           └── content/
│               └── ancient-books/      ← 中文书籍数据
└── seo/
    ├── en/
    │   └── pages/
    │       └── book-detail.ts          ← 英文SEO数据
    └── zh/
        └── pages/
            └── book-detail.ts          ← 中文SEO数据
```

### 3. 数据快照架构

#### 主文件结构
```json
{
  "labels": {
    "title": "书籍标题",
    "description": "书籍描述"
  },
  "content": {
    "id": "book-id",
    "title": {
      "zh": "中文标题",
      "en": "English Title"
    },
    "dynasty": "朝代",
    "author": "作者",
    "category": "分类",
    "metadata": { ... },
    "chapters": [
      {
        "id": "chapter-id",
        "title": {
          "zh": "中文章节标题",
          "en": "English Chapter Title"
        },
        "order": 章节顺序,
        "summary": "章节摘要",
        "sections": [...]
      }
    ],
    "relatedBooks": [...],
    "readingTime": { ... },
    "studyNotes": { ... }
  },
  "metrics": { ... },
  "updatedAt": "更新时间",
  "metadata": { ... }
}
```

#### 章节文件结构
```json
{
  "id": "chapter-id",
  "title": {
    "zh": "中文章节标题",
    "en": "English Chapter Title"
  },
  "order": 章节顺序,
  "summary": "章节摘要",
  "sections": [
    {
      "id": "section-id",
      "title": {
        "zh": "中文节标题",
        "en": "English Section Title"
      },
      "order": 节顺序,
      "originalText": "原文",
      "translation": "白话译文",
      "interpretation": "现代解读",
      "summary": "节摘要",
      "keyConcepts": [...]
    }
  ]
}
```
│   │   └── seo/
│   │       └── book-detail.ts         ← SEO元数据
│   └── zh/
│       ├── labels/
│       │   └── pages/
│       │       └── book-detail.ts     ← UI静态文本
│       └── seo/
│           └── book-detail.ts         ← SEO元数据
├── data/
│   └── snapshots/
│       ├── en/
│       │   └── content/
│       │       └── ancient-books/
│       │           ├── huangdi-neijing.json
│       │           ├── shanghan-zabing-lun.json
│       │           └── ...                   ← 动态内容数据
│       │           └── {bookId}/
│       │               └── chapters/
│       │                   ├── suwen-1.json
│       │                   └── ...           ← 章节数据
│       └── zh/
│           └── content/
│               └── ancient-books/
│                   ├── collection.json
│                   └── ...                   ← 中文数据
└── seo/
    └── book-detail.ts                    ← SEO生成逻辑
```

## 📊 数据结构标准

### 主文件结构

基于黄帝内经的完整数据结构：

```json
{
  "labels": {
    "title": "书籍英文标题",
    "description": "书籍英文描述"
  },
  "content": {
    "id": "书籍ID",
    "title": {
      "en": "英文标题",
      "zh": "中文标题"
    },
    "dynasty": "朝代",
    "author": "作者",
    "category": "分类",
    "year": "年份",
    "metadata": {
      "dynasty": "朝代",
      "author": "作者",
      "chapters": 章节数,
      "wordCount": 字数,
      "publishYear": "出版年份",
      "tags": ["标签1", "标签2", "标签3"],
      "coverImage": "封面图片路径",
      "difficulty": "难度等级",
      "influence": "影响力描述",
      "preservation": "保存状态"
    },
    "chapters": [
      {
        "id": "章节ID",
        "title": {
          "en": "英文章节标题",
          "zh": "中文章节标题"
        },
        "order": 章节顺序,
        "summary": "章节摘要",
        "sections": [
          {
            "id": "小节ID",
            "title": "小节标题",
            "order": 小节顺序,
            "originalText": "原文",
            "translation": "英文翻译",
            "interpretation": "现代解读",
            "keyConcepts": [
              {
                "id": "概念ID",
                "term": "术语",
                "description": "概念描述",
                "category": "概念分类",
                "relatedConcepts": ["相关概念1", "相关概念2"]
              }
            ]
          }
        ]
      }
    ],
    "relatedBooks": ["相关书籍ID1", "相关书籍ID2"],
    "readingTime": {
      "estimated": "预计阅读时间",
      "difficulty": "难度描述",
      "prerequisites": ["前置知识1", "前置知识2"]
    },
    "studyNotes": {
      "keyPoints": ["要点1", "要点2"],
      "clinicalApplications": ["临床应用1", "临床应用2"],
      "historicalSignificance": ["历史意义1", "历史意义2"]
    }
  },
  "metrics": {
    "totalChapters": 总章节数,
    "totalWords": 总字数,
    "totalSections": 总小节数,
    "relatedBooks": 相关书籍数,
    "keyConcepts": 关键概念数,
    "readingTime": 阅读时间(分钟),
    "difficulty": 难度等级(1-5)
  },
  "updatedAt": "更新时间(ISO格式)",
  "metadata": {
    "sourceFlags": ["db", "markdown", "seed"],
    "version": "版本号",
    "lastReviewed": "最后审查时间(ISO格式)"
  }
}
```

### 章节文件结构

```json
{
  "id": "章节ID",
  "title": {
    "en": "英文章节标题",
    "zh": "中文章节标题"
  },
  "order": 章节顺序,
  "summary": "章节摘要",
  "sections": [
    {
      "id": "小节ID",
      "title": "小节标题",
      "order": 小节顺序,
      "originalText": "原文",
      "translation": "英文翻译",
      "interpretation": "现代解读",
      "keyConcepts": [
        {
          "id": "概念ID",
          "term": "术语",
          "description": "概念描述",
          "category": "概念分类",
          "relatedConcepts": ["相关概念1", "相关概念2"]
        }
      ]
    }
  ]
}
```

## 🔄 数据加载流程

### 1. 路由匹配

```typescript
// src/routes/book.$bookId.tsx
export async function loader({ params }: LoaderFunctionArgs) {
  const { bookId } = params;
  const locale = getLocale();
  
  // 加载书籍数据
  const book = await fetchBook(bookId, locale);
  
  if (!book) {
    throw new Response("Not Found", { status: 404 });
  }
  
  return { book, locale };
}
```

### 2. 数据获取

```typescript
// src/hooks/useBookData.ts
export const fetchBook = async (bookId: string, locale?: string): Promise<AncientBook> => {
  // 1. 尝试加载指定语言的数据
  const snapshotPath = `/src/data/snapshots/${locale}/content/ancient-books/${bookId}.json`;
  
  // 2. 如果不存在，回退到英文
  const fallbackPath = `/src/data/snapshots/en/content/ancient-books/${bookId}.json`;
  
  // 3. 加载数据并提取content
  const data = await loadSnapshot(snapshotPath || fallbackPath);
  return data.content; // 统一使用content格式
};
```

### 3. 章节加载

```typescript
// src/hooks/useChapterData.ts
export const fetchChapter = async (bookId: string, chapterId: string, locale?: string) => {
  const chapterPath = `/src/data/snapshots/${locale}/content/ancient-books/${bookId}/chapters/${chapterId}.json`;
  const fallbackPath = `/src/data/snapshots/en/content/ancient-books/${bookId}/chapters/${chapterId}.json`;
  
  const chapter = await loadSnapshot(chapterPath || fallbackPath);
  return chapter;
};
```

## 🎨 组件架构

### 1. 页面组件层次

```
BookDetailPage
├── BookHeader
│   ├── BookTitle
│   ├── BookMetadata
│   └── BookActions
├── BookNavigation
│   ├── ChapterList
│   └── SectionNavigation
├── BookContent
│   ├── ChapterContent
│   │   ├── SectionContent
│   │   │   ├── OriginalText
│   │   │   ├── Translation
│   │   │   ├── Interpretation
│   │   │   └── KeyConcepts
│   │   └── SectionNavigation
│   └── ChapterNavigation
├── BookSidebar
│   ├── ReadingProgress
│   ├── BookInfo
│   └── RelatedBooks
└── BookFooter
    ├── Bookmarks
    ├── ShareButtons
    └── DownloadOptions
```

### 2. 核心组件

#### BookDetailPage

```typescript
// src/components/book/pages/BookDetailPage.tsx
export default function BookDetailPage() {
  const { book, locale } = useLoaderData<typeof loader>();
  const { t } = useTranslation();
  
  return (
    <div className="book-detail-page">
      <BookHeader book={book} />
      <BookNavigation chapters={book.chapters} />
      <BookContent book={book} />
      <BookSidebar book={book} />
      <BookFooter book={book} />
    </div>
  );
}
```

#### BookContent

```typescript
// src/components/book/organisms/BookContent.tsx
interface BookContentProps {
  book: AncientBook;
}

export default function BookContent({ book }: BookContentProps) {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  
  const chapter = book.chapters[currentChapter];
  
  return (
    <div className="book-content">
      <ChapterContent 
        chapter={chapter}
        onSectionChange={setCurrentSection}
      />
      <ChapterNavigation 
        chapters={book.chapters}
        currentChapter={currentChapter}
        onChapterChange={setCurrentChapter}
      />
    </div>
  );
}
```

#### SectionContent

```typescript
// src/components/book/molecules/SectionContent.tsx
interface SectionContentProps {
  section: Section;
}

export default function SectionContent({ section }: SectionContentProps) {
  const { t } = useTranslation();
  
  return (
    <div className="section-content">
      <h3>{section.title}</h3>
      
      <div className="content-tabs">
        <OriginalText text={section.originalText} />
        <Translation text={section.translation} />
        <Interpretation text={section.interpretation} />
      </div>
      
      {section.keyConcepts && (
        <KeyConcepts concepts={section.keyConcepts} />
      )}
    </div>
  );
}
```

#### KeyConcepts

```typescript
// src/components/book/molecules/KeyConcepts.tsx
interface KeyConceptsProps {
  concepts: KeyConcept[];
}

export default function KeyConcepts({ concepts }: KeyConceptsProps) {
  const { t } = useTranslation();
  
  return (
    <div className="key-concepts">
      <h4>{t('bookDetail.keyConcepts.title')}</h4>
      <div className="concepts-grid">
        {concepts.map(concept => (
          <ConceptCard key={concept.id} concept={concept} />
        ))}
      </div>
    </div>
  );
}
```

## 🌐 多语言实现

### 1. 翻译键结构

```typescript
// src/locales/en/labels/pages/book-detail.ts
export default {
  title: 'Book Details',
  back: 'Back to Books',
  bookInfo: 'Book Information',
  chapters: 'Chapters',
  sections: 'Sections',
  originalText: 'Original Text',
  translation: 'Translation',
  interpretation: 'Modern Interpretation',
  keyConcepts: 'Key Concepts',
  relatedBooks: 'Related Books',
  readingTime: 'Reading Time',
  difficulty: 'Difficulty',
  tags: 'Tags',
  // ... 更多翻译键
};
```

### 2. 语言切换

```typescript
// src/hooks/useLanguageSwitch.ts
export const useLanguageSwitch = () => {
  const { locale } = useLoaderData();
  const navigate = useNavigate();
  
  const switchLanguage = (newLocale: string) => {
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(`/${locale}/`, `/${newLocale}/`);
    navigate(newPath);
  };
  
  return { currentLocale: locale, switchLanguage };
};
```

## 🔍 SEO优化

### 1. 元数据生成

```typescript
// src/seo/book-detail.ts
export const generateBookSEO = (book: AncientBook, locale: string) => {
  const title = book.title[locale] || book.title.en;
  const description = book.description || book.summary;
  
  return {
    title: `${title} | 中华医典`,
    description: `Read ${title} - ${description}`,
    keywords: [
      ...book.metadata.tags,
      book.author,
      book.dynasty,
      'Traditional Chinese Medicine',
      'Ancient Medical Classics'
    ].join(', '),
    openGraph: {
      title: `${title} - 中华医典`,
      description: description,
      image: book.metadata.coverImage,
      type: 'article'
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Book',
      name: title,
      author: {
        '@type': 'Person',
        name: book.author
      },
      description: description,
      inLanguage: locale,
      about: book.metadata.tags
    }
  };
};
```

### 2. 结构化数据

```typescript
// src/components/seo/StructuredData.tsx
export default function StructuredData({ book }: { book: AncientBook }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title.zh || book.title.en,
    author: {
      '@type': 'Person',
      name: book.author
    },
    datePublished: book.metadata.publishYear,
    description: book.summary,
    inLanguage: ['zh', 'en'],
    about: book.metadata.tags,
    numberOfPages: book.metadata.chapters,
    keywords: book.metadata.tags.join(', ')
  };
  
  return (
    <script type="application/ld+json">
      {JSON.stringify(structuredData)}
    </script>
  );
}
```

## 📱 响应式设计

### 1. 断点设计

```css
/* src/styles/book-detail.css */
.book-detail-page {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .book-detail-page {
    grid-template-columns: 1fr 300px;
  }
}

@media (min-width: 1024px) {
  .book-detail-page {
    grid-template-columns: 250px 1fr 300px;
  }
}
```

### 2. 移动端优化

```typescript
// src/components/book/hooks/useMobileLayout.ts
export const useMobileLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};
```

## ⚡ 性能优化

### 1. 数据缓存

```typescript
// src/hooks/useBookCache.ts
const bookCache = new Map<string, AncientBook>();

export const useBookCache = () => {
  const getCachedBook = (bookId: string, locale: string) => {
    const key = `${bookId}-${locale}`;
    return bookCache.get(key);
  };
  
  const setCachedBook = (bookId: string, locale: string, book: AncientBook) => {
    const key = `${bookId}-${locale}`;
    bookCache.set(key, book);
  };
  
  return { getCachedBook, setCachedBook };
};
```

### 2. 懒加载

```typescript
// src/components/book/atoms/LazyChapter.tsx
export default function LazyChapter({ chapterId }: { chapterId: string }) {
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchChapter(chapterId).then(data => {
      setChapter(data);
      setLoading(false);
    });
  }, [chapterId]);
  
  if (loading) return <ChapterSkeleton />;
  return <ChapterContent chapter={chapter} />;
}
```

## 🧪 测试策略

### 1. 单元测试

```typescript
// src/components/book/__tests__/BookDetailPage.test.tsx
describe('BookDetailPage', () => {
  it('should render book information correctly', () => {
    const mockBook = createMockBook();
    
    render(<BookDetailPage book={mockBook} />);
    
    expect(screen.getByText(mockBook.title.en)).toBeInTheDocument();
    expect(screen.getByText(mockBook.author)).toBeInTheDocument();
    expect(screen.getByText(mockBook.dynasty)).toBeInTheDocument();
  });
  
  it('should handle missing book data', () => {
    render(<BookDetailPage book={null} />);
    
    expect(screen.getByText('Book not found')).toBeInTheDocument();
  });
});
```

### 2. 集成测试

```typescript
// src/routes/__tests__/book.$bookId.test.tsx
describe('Book Detail Route', () => {
  it('should load book data correctly', async () => {
    const response = await loader({
      params: { bookId: 'huangdi-neijing' }
    });
    
    expect(response.book).toBeDefined();
    expect(response.book.id).toBe('huangdi-neijing');
  });
  
  it('should handle 404 for non-existent book', async () => {
    await expect(
      loader({ params: { bookId: 'non-existent' } })
    ).rejects.toThrow('Not Found');
  });
});
```

## 📊 监控和分析

### 1. 性能监控

```typescript
// src/hooks/usePerformanceTracking.ts
export const usePerformanceTracking = () => {
  const trackPageLoad = (bookId: string, loadTime: number) => {
    // 发送性能数据到分析服务
    analytics.track('book_page_load', {
      bookId,
      loadTime,
      userAgent: navigator.userAgent
    });
  };
  
  const trackUserInteraction = (action: string, bookId: string) => {
    analytics.track('book_interaction', {
      action,
      bookId,
      timestamp: Date.now()
    });
  };
  
  return { trackPageLoad, trackUserInteraction };
};
```

### 2. 错误监控

```typescript
// src/hooks/useErrorTracking.ts
export const useErrorTracking = () => {
  const trackError = (error: Error, context: string) => {
    console.error(`Error in ${context}:`, error);
    
    // 发送错误报告
    errorReporting.captureException(error, {
      context,
      bookId: getBookIdFromUrl(),
      userAgent: navigator.userAgent
    });
  };
  
  return { trackError };
};
```

## 📋 部署和维护

### 1. 构建优化

```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'book-detail': [
            './src/components/book/pages/BookDetailPage.tsx',
            './src/components/book/organisms/'
          ]
        }
      }
    }
  }
});
```

### 2. 数据验证

```typescript
// src/utils/bookValidation.ts
export const validateBookData = (book: any): book is AncientBook => {
  const requiredFields = ['id', 'title', 'dynasty', 'author', 'chapters'];
  
  return requiredFields.every(field => {
    const value = book[field];
    return value !== undefined && value !== null && value !== '';
  });
};
```

---

*最后更新：2026年2月26日*
│   │   └── seo/
│   │       └── book/
│   │           └── $bookId.ts          ← SEO元数据
│   └── zh/
│       ├── labels/
│       │   └── pages/
│       │       └── book-detail.ts     ← UI静态文本
│       └── seo/
│           └── book/
│               └── $bookId.ts          ← SEO元数据
└── data/
    └── snapshots/
        ├── zh/
        │   └── content/
        │       └── ancient-books/
        │           └── huangdi-neijing.json  ← 动态内容
        └── en/
            └── content/
                └── ancient-books/
                    └── huangdi-neijing.json  ← 动态内容
```

#### 命名空间规范
```typescript
// UI文本命名空间
bookDetail.ui.loading              // 加载文本
bookDetail.ui.loadingError         // 加载错误
bookDetail.ui.breadcrumbs.home     // 面包屑首页
bookDetail.navigation.chapters     // 章节导航
bookDetail.metadata.title          // 元数据标题
bookDetail.readingStats.progress    // 阅读进度
```

## 📊 数据加载策略

### 1. 加载优先级

```typescript
// 数据加载的三层回退机制
1. 数据库/API (优先)
2. 静态快照文件 (回退)
3. 硬编码备选数据 (兜底)
```

### 2. 快照加载实现

#### 问题解决
- **原问题**: 使用 `fetch()` 加载静态文件导致获取HTML 404页面
- **解决方案**: 使用 `import.meta.glob()` 动态导入

```typescript
// ✅ 正确的快照加载方式
const snapshotModules = import.meta.glob('/src/data/snapshots/*/content/ancient-books/*.json', { eager: false });
const snapshotPath = `/src/data/snapshots/${locale}/content/ancient-books/${bookId}.json`;
const loader = snapshotModules[snapshotPath];

if (loader) {
  const mod = await loader();
  const data = (mod as any).default || mod;
  return data.content; // 使用 content 格式
}
```

### 3. 数据格式

#### 快照文件格式
```json
{
  "labels": {
    "title": "黄帝内经",
    "description": "中医理论奠基之作"
  },
  "content": {
    "id": "huangdi-neijing",
    "title": {
      "zh": "黄帝内经",
      "en": "Yellow Emperor's Inner Canon"
    },
    "dynasty": "先秦",
    "author": "佚名",
    "chapters": [...],
    "metadata": {...}
  },
  "metrics": {...},
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

## 🎨 组件架构

### 1. 组件层级

```
BookDetailPage (页面容器)
├── BookHeader (书籍头部信息)
├── ChapterNavigation (章节导航)
├── ContentViewer (内容查看器)
├── ReadingProgress (阅读进度)
└── RelatedBooks (相关推荐)
```

### 2. 数据流

```typescript
// Loader → React Query → 组件
Route Loader → fetchBook() → useBook() → BookDetailPage
```

#### Loader 实现
```typescript
loader: async ({ params, context }) => {
  const bookId = params.bookId as string;
  const locale = 'en'; // 服务器端默认
  
  try {
    const book = await fetchBook(bookId, locale);
    await queryClient?.ensureQueryData({
      queryKey: ['book', bookId, locale],
      queryFn: () => fetchBook(bookId, locale),
      staleTime: 5 * 60_000,
    });
    return { book };
  } catch (error) {
    console.error('Failed to load book data:', error);
    return { book: null };
  }
}
```

### 3. 错误处理

#### 数据安全检查
```typescript
// 组件中的防御性编程
if (!book || !book.chapters || book.chapters.length === 0) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1>{i18n.t('bookDetail.ui.loading')}</h1>
        <p>{i18n.t('bookDetail.ui.loadingError')}</p>
      </div>
    </div>
  );
}

// 安全访问数组属性
{bookmarks?.length || 0}
```

## 🔍 SEO优化

### 1. SEO数据结构

```typescript
// src/locales/{lang}/seo/book/$bookId.ts
export default {
  title: '{{bookTitle}} - Ancient Chinese Medical Classic | Chinese Medical Classics',
  description: '{{bookDescription}} Read the original text, modern translation, and expert interpretation...',
  structuredData: {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": "{{bookTitle}}",
    "author": { "@type": "Person", "name": "{{bookAuthor}}" },
    "datePublished": "{{publishYear}}",
    "inLanguage": "zh-CN",
    "about": "中医学",
    "description": "{{bookDescription}}",
    "numberOfPages": "{{chapterCount}}",
    "keywords": "{{bookTags}}",
    "publisher": { "@type": "Organization", "name": "中华医典" },
    "genre": ["医经类", "中医学", "{{bookCategory}}"]
  }
}
```

### 2. 模板变量

SEO文件支持模板变量，运行时动态替换：

- `{{bookTitle}}` - 书籍标题
- `{{bookAuthor}}` - 作者
- `{{bookDescription}}` - 描述
- `{{publishYear}}` - 发布年份
- `{{chapterCount}}` - 章节数
- `{{bookTags}}` - 标签
- `{{bookCategory}}` - 分类

## 🌐 多语言实现

### 1. UI文本示例

#### 中文 (src/locales/zh/labels/pages/book-detail.ts)
```typescript
export const bookDetail = {
  ui: {
    loading: '加载中...',
    loadingError: '加载古籍数据失败',
    breadcrumbs: {
      home: '首页',
      library: '古籍库'
    }
  },
  navigation: {
    chapters: '章节',
    bookmarks: '书签',
    previous: '上一章',
    next: '下一章'
  },
  metadata: {
    title: '古籍信息',
    dynasty: '朝代',
    author: '作者'
  }
  // ... 更多翻译
};
```

#### 英文 (src/locales/en/labels/pages/book-detail.ts)
```typescript
export const bookDetail = {
  ui: {
    loading: 'Loading...',
    loadingError: 'Failed to load book data',
    breadcrumbs: {
      home: 'Home',
      library: 'Library'
    }
  },
  navigation: {
    chapters: 'Chapters',
    bookmarks: 'Bookmarks',
    previous: 'Previous',
    next: 'Next'
  },
  metadata: {
    title: 'Book Information',
    dynasty: 'Dynasty',
    author: 'Author'
  }
  // ... 更多翻译
};
```

### 2. 组件中使用

```typescript
// ✅ 正确使用方式
const { i18n } = useTranslation();
const locale = i18n.language as 'zh' | 'en';

// UI文本 - 来自locales
{i18n.t('bookDetail.ui.loading')}
{i18n.t('bookDetail.navigation.chapters')}

// 动态内容 - 来自snapshots
{book.title[locale] || book.title.zh}
{book.chapters.map(chapter => chapter.title[locale])}
```

## 🔧 开发指南

### 1. 添加新书籍

1. **添加快照数据**
   ```bash
   # 创建快照文件
   touch src/data/snapshots/zh/content/ancient-books/new-book.json
   touch src/data/snapshots/en/content/ancient-books/new-book.json
   ```

2. **添加SEO配置**
   ```bash
   # 创建SEO文件
   touch src/locales/zh/seo/book/new-book.ts
   touch src/locales/en/seo/book/new-book.ts
   ```

### 2. 添加新的UI文本

1. **更新翻译文件**
   ```typescript
   // 在 bookDetail 对象中添加新键
   newFeature: {
     title: '新功能',
     description: '功能描述'
   }
   ```

2. **在组件中使用**
   ```typescript
   {i18n.t('bookDetail.newFeature.title')}
   ```

### 3. 调试技巧

#### 启用详细日志
```typescript
// 在 fetchBook 函数中添加调试信息
console.log('Available snapshot paths:', Object.keys(snapshotModules));
console.log('Attempting to load snapshot from:', snapshotPath);
console.log('Loaded data:', data);
```

#### 检查数据格式
```typescript
// 验证快照数据格式
if (data.content) {
  console.log('Using content format');
  return data.content;
} else if (data.id) {
  console.log('Using direct format');
  return data;
}
```

## 🐛 常见问题

### 1. JSON解析错误

**问题**: `SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON`

**原因**: 使用 `fetch()` 加载静态文件时获取到HTML 404页面

**解决**: 使用 `import.meta.glob()` 替代 `fetch()`

### 2. 组件崩溃

**问题**: `TypeError: Cannot read properties of undefined (reading 'length')`

**原因**: 访问未定义的数组属性

**解决**: 添加安全检查
```typescript
{bookmarks?.length || 0}
{book.chapters?.length > 0 && <Component />}
```

### 3. 翻译键缺失

**问题**: 翻译键不存在导致显示原始键名

**解决**: 确保在两个语言文件中都添加了相同的键

## 📈 性能优化

### 1. 数据缓存

```typescript
// React Query 缓存配置
staleTime: 5 * 60_000, // 5分钟
cacheTime: 10 * 60_000, // 10分钟
```

### 2. 懒加载

```typescript
// 组件懒加载
const BookDetailPage = lazy(() => import('@/components/book/organisms/BookDetailPage'));

// 图片懒加载
<OptimizedImage loading="lazy" />
```

### 3. 代码分割

```typescript
// 按路由分割代码
export const Route = createFileRoute('/book/$bookId')({
  component: lazy(() => import('./BookDetailRoute')),
  loader: bookLoader
});
```

## 🎯 最佳实践

1. **数据分离**: 严格区分UI文本、动态内容和SEO数据
2. **错误处理**: 添加完整的错误边界和回退机制
3. **类型安全**: 使用TypeScript确保类型一致性
4. **性能优化**: 合理使用缓存和懒加载
5. **国际化**: 遵循项目的多语言命名空间规范

## 📚 相关文档

- [数据管理策略](./data-management-strategy.md)
- [国际化分析](./i18n-analysis.md)
- [SEO中心化](./seo-centralization.md)
- [项目架构概览](./project-architecture-overview.md)

---

**最后更新**: 2026年2月25日  
**维护者**: 开发团队  
**版本**: 1.0.0
