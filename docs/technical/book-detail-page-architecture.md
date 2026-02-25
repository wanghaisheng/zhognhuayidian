# 书籍详情页架构设计文档

## 概述

本文档描述了书籍详情页的完整架构设计，包括多语言实现、数据加载策略、SEO优化和组件结构。

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
