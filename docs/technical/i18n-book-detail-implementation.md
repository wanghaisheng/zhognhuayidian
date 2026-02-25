# 书籍详情页多语言实现指南

## 概述

本文档详细说明了书籍详情页的多语言实现，包括架构设计、文件组织、命名规范和使用示例。

## 🏗️ 架构设计原则

### 1. 数据分离原则

书籍详情页严格遵循三种数据的分离：

| 数据类型 | 存储位置 | 内容类型 | 示例 |
|---------|---------|---------|------|
| **静态UI文本** | `src/locales/{lang}/labels/pages/` | 界面固定文本 | 按钮文字、标签、提示信息 |
| **动态内容数据** | `src/data/snapshots/{lang}/content/` | 书籍实际内容 | 标题、章节、原文、译文 |
| **SEO元数据** | `src/locales/{lang}/seo/` | 页面SEO信息 | title、description、structuredData |

### 2. 为什么需要分离？

#### 静态UI文本的特点
- **固定不变**: 按钮文字、标签等界面元素
- **语言相关**: 每种语言有不同的翻译
- **频繁使用**: 在多个组件中重复使用
- **易于维护**: 修改UI不影响数据内容

#### 动态内容数据的特点
- **内容丰富**: 书籍的完整信息
- **结构化**: JSON格式，包含复杂的嵌套结构
- **多语言**: 同一书籍的多语言版本
- **数据驱动**: 内容决定页面展示

#### SEO元数据的特点
- **页面专用**: 每个页面有独特的SEO需求
- **模板化**: 支持变量替换
- **搜索引擎**: 针对搜索引擎优化
- **独立管理**: 与UI和内容分离

## 📁 文件组织结构

### 完整目录结构

```
src/
├── locales/
│   ├── zh/
│   │   ├── labels/
│   │   │   ├── pages/
│   │   │   │   ├── home.ts
│   │   │   │   ├── about.ts
│   │   │   │   ├── book-detail.ts     ← 书籍详情页UI文本
│   │   │   │   └── ...
│   │   │   ├── components/
│   │   │   ├── navigation/
│   │   │   └── common.ts
│   │   ├── seo/
│   │   │   ├── index.ts
│   │   │   ├── book/
│   │   │   │   ├── $bookId.ts          ← 书籍详情页SEO
│   │   │   │   └── ...
│   │   │   └── ...
│   │   └── index.ts                    ← 聚合文件
│   └── en/
│       ├── labels/
│       │   ├── pages/
│       │   │   ├── home.ts
│       │   │   ├── about.ts
│       │   │   ├── book-detail.ts     ← 书籍详情页UI文本
│       │   │   └── ...
│       │   ├── components/
│       │   ├── navigation/
│       │   └── common.ts
│       ├── seo/
│       │   ├── index.ts
│       │   ├── book/
│       │   │   ├── $bookId.ts          ← 书籍详情页SEO
│       │   │   └── ...
│       │   └── ...
│       └── index.ts                    ← 聚合文件
└── data/
    └── snapshots/
        ├── zh/
        │   └── content/
        │       └── ancient-books/
        │           ├── huangdi-neijing.json  ← 中文书籍内容
        │           ├── collection.json
        │           └── ...
        └── en/
            └── content/
                └── ancient-books/
                    ├── huangdi-neijing.json  ← 英文书籍内容
                    ├── collection.json
                    └── ...
```

### 文件命名规范

#### UI文本文件
- **位置**: `src/locales/{lang}/labels/pages/`
- **命名**: `kebab-case.ts` (如: `book-detail.ts`)
- **导出**: 命名导出对象

#### SEO文件
- **位置**: `src/locales/{lang}/seo/`
- **命名**: 遵循路由结构 (如: `book/$bookId.ts`)
- **导出**: 默认导出对象

#### 快照数据文件
- **位置**: `src/data/snapshots/{lang}/content/{category}/`
- **命名**: `kebab-case.json` (如: `huangdi-neijing.json`)
- **格式**: JSON文件

## 🔤 命名空间规范

### 1. UI文本命名空间

```typescript
// book-detail.ts 的命名空间结构
export const bookDetail = {
  // UI交互文本
  ui: {
    loading: '加载中...',
    loadingError: '加载古籍数据失败',
    backToLibrary: '返回古籍库',
    backToHome: '首页',
    breadcrumbs: {
      home: '首页',
      library: '古籍库'
    }
  },
  
  // 章节导航
  navigation: {
    chapters: '章节',
    bookmarks: '书签',
    notes: '笔记',
    search: '搜索',
    previous: '上一章',
    next: '下一章',
    continueReading: '继续阅读',
    startOver: '重新开始',
    searchPlaceholder: '搜索章节内容...',
    quickJump: '快速跳转',
    readingProgress: '阅读进度',
    goToSection: '跳转到'
  },
  
  // 书籍元数据标签
  metadata: {
    title: '古籍信息',
    dynasty: '朝代',
    author: '作者',
    chapters: '章节数',
    wordCount: '字数',
    category: '分类',
    tags: '标签',
    ancient: '古代'
  },
  
  // 阅读统计
  readingStats: {
    title: '阅读统计',
    progress: '进度',
    bookmarks: '书签',
    notes: '笔记',
    lastRead: '最后阅读',
    today: '今天',
    never: '从未'
  },
  
  // 操作按钮
  actions: {
    bookmark: '书签',
    note: '笔记',
    share: '分享',
    download: '下载',
    similar: '相似古籍'
  },
  
  // 内容区域
  content: {
    original: '古籍原文',
    translation: '白话译文',
    interpretation: '现代解读',
    // ... 更多内容相关文本
  }
};
```

### 2. 命名空间设计原则

#### 层级结构
- **一级分类**: 按功能区域划分 (ui, navigation, metadata, etc.)
- **二级分类**: 具体的功能项 (breadcrumbs, chapters, etc.)
- **三级分类**: 细分项 (home, library, etc.)

#### 命名规范
- **camelCase**: 使用驼峰命名法
- **语义化**: 名称要清晰表达含义
- **一致性**: 中英文使用相同的键名
- **简洁性**: 避免过长的键名

## 💡 使用示例

### 1. 组件中使用UI文本

```typescript
import { useTranslation } from 'react-i18next';

export const BookDetailPage: React.FC<BookDetailPageProps> = ({ book }) => {
  const { i18n } = useTranslation();
  const locale = i18n.language as 'zh' | 'en';
  
  // ✅ 正确 - 使用UI文本
  const loadingText = i18n.t('bookDetail.ui.loading');
  const chaptersText = i18n.t('bookDetail.navigation.chapters');
  const metadataTitle = i18n.t('bookDetail.metadata.title');
  
  // ✅ 正确 - 使用动态内容
  const bookTitle = book.title[locale] || book.title.zh;
  const chapterTitles = book.chapters.map(ch => ch.title[locale]);
  
  return (
    <div>
      {/* UI文本来自locales */}
      <h1>{i18n.t('bookDetail.ui.breadcrumbs.home')}</h1>
      
      {/* 动态内容来自snapshots */}
      <h2>{bookTitle}</h2>
      
      {/* 混合使用 */}
      <p>{i18n.t('bookDetail.metadata.author')}: {book.author}</p>
    </div>
  );
};
```

### 2. SEO数据使用

SEO数据由SEO组件自动加载和处理：

```typescript
// src/locales/zh/seo/book/$bookId.ts
export default {
  title: '{{bookTitle}} - 中医古籍经典 | 中华医典',
  description: '{{bookDescription}} 阅读这部中医经典的原文、白话译文和专家解读。',
  structuredData: {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": "{{bookTitle}}",
    "author": { "@type": "Person", "name": "{{bookAuthor}}" },
    // ... 更多结构化数据
  }
}
```

### 3. 路由中的SEO集成

```typescript
// src/routes/book.$bookId.tsx
export const Route = createFileRoute('/book/$bookId')({
  component: BookDetailRoute,
  loader: async ({ params }) => {
    const bookId = params.bookId as string;
    const book = await fetchBook(bookId, 'zh');
    
    return { 
      book,
      // SEO数据会自动从 src/locales/{lang}/seo/book/$bookId.ts 加载
    };
  },
  meta: ({ params }) => {
    // SEO组件会自动处理meta标签
    return {};
  }
});
```

## 🔧 开发指南

### 1. 添加新的UI文本

#### 步骤1: 更新翻译文件
```typescript
// src/locales/zh/labels/pages/book-detail.ts
export const bookDetail = {
  // 添加新的文本
  newFeature: {
    title: '新功能',
    description: '这是新功能的描述',
    button: '立即体验'
  }
};

// src/locales/en/labels/pages/book-detail.ts
export const bookDetail = {
  // 添加对应的英文翻译
  newFeature: {
    title: 'New Feature',
    description: 'This is a description of the new feature',
    button: 'Try Now'
  }
};
```

#### 步骤2: 在组件中使用
```typescript
// 在组件中使用新文本
<h3>{i18n.t('bookDetail.newFeature.title')}</h3>
<p>{i18n.t('bookDetail.newFeature.description')}</p>
<button>{i18n.t('bookDetail.newFeature.button')}</button>
```

### 2. 添加新的书籍内容

#### 步骤1: 创建快照文件
```json
// src/data/snapshots/zh/content/ancient-books/new-book.json
{
  "labels": {
    "title": "新书名称",
    "description": "新书描述"
  },
  "content": {
    "id": "new-book",
    "title": {
      "zh": "新书名称",
      "en": "New Book Title"
    },
    "dynasty": "明朝",
    "author": "作者名",
    "chapters": [
      {
        "id": "chapter-1",
        "title": {
          "zh": "第一章",
          "en": "Chapter 1"
        },
        "sections": [...]
      }
    ],
    "metadata": {...}
  }
}
```

#### 步骤2: 创建英文版本
```json
// src/data/snapshots/en/content/ancient-books/new-book.json
{
  "labels": {
    "title": "New Book Title",
    "description": "New book description"
  },
  "content": {
    // 相同的结构，英文内容
  }
}
```

### 3. 添加SEO配置

```typescript
// src/locales/zh/seo/book/new-book.ts
export default {
  title: '{{bookTitle}} - 中医古籍 | 中华医典',
  description: '{{bookDescription}} 了解这部中医经典的内容和价值。',
  structuredData: {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": "{{bookTitle}}",
    // ... 结构化数据
  }
};

// src/locales/en/seo/book/new-book.ts
export default {
  title: '{{bookTitle}} - Chinese Medical Classic',
  description: '{{bookDescription}} Learn about this traditional Chinese medicine classic.',
  structuredData: {
    // ... 英文结构化数据
  }
};
```

## 🚀 最佳实践

### 1. 键名设计

```typescript
// ✅ 推荐 - 语义化、层级清晰
bookDetail.ui.loading
bookDetail.navigation.chapters
bookDetail.metadata.title
bookDetail.readingStats.progress

// ❌ 避免 - 过于简单或复杂
loading
bookNavChapters
bookMetaInfoTitle
readingStatsProgressPercentage
```

### 2. 文本内容

```typescript
// ✅ 推荐 - 简洁明了
loading: '加载中...'
chapters: '章节'
author: '作者'

// ❌ 避免 - 过长或包含标点
loading: '正在加载中，请稍候...'
chapters: '章节列表：'
author: '作者：'
```

### 3. 一致性维护

```typescript
// ✅ 推荐 - 中英文键名一致
// 中文
{
  navigation: {
    chapters: '章节',
    bookmarks: '书签'
  }
}

// 英文
{
  navigation: {
    chapters: 'Chapters',
    bookmarks: 'Bookmarks'
  }
}

// ❌ 避免 - 键名不一致
// 英文中使用了不同的键名
{
  nav: {
    chapterList: 'Chapters',
    bookmarkList: 'Bookmarks'
  }
}
```

### 4. 类型安全

```typescript
// ✅ 推荐 - 使用TypeScript类型
interface BookDetailTranslations {
  ui: {
    loading: string;
    loadingError: string;
    breadcrumbs: {
      home: string;
      library: string;
    };
  };
  navigation: {
    chapters: string;
    bookmarks: string;
  };
}

// 在组件中使用类型
const { i18n } = useTranslation<'bookDetail'>();
```

## 🐛 常见问题

### 1. 翻译键不存在

**问题**: 显示原始键名而不是翻译文本

**原因**: 
- 翻译文件中缺少对应的键
- 键名拼写错误
- 聚合文件中未导入

**解决**:
```typescript
// 检查翻译文件是否包含该键
// 检查聚合文件是否正确导入
// 使用开发工具检查翻译键
```

### 2. 数据类型错误

**问题**: TypeScript类型检查失败

**原因**: 
- 翻译对象结构与类型定义不匹配
- 缺少类型定义

**解决**:
```typescript
// 添加类型定义
interface BookDetailTranslations {
  ui: {
    loading: string;
    // ... 其他属性
  };
}

// 使用类型断言
const translations = i18n.t('bookDetail') as BookDetailTranslations;
```

### 3. SEO变量未替换

**问题**: SEO模板变量没有正确替换

**原因**: 
- 变量名拼写错误
- 数据结构不匹配
- SEO组件未正确处理

**解决**:
```typescript
// 检查变量名
title: '{{bookTitle}} - Chinese Medical Classics'  // ✅ 正确
title: '{{book_name}} - Chinese Medical Classics' // ❌ 错误

// 检查数据结构
const seoData = {
  bookTitle: book.title[locale],  // ✅ 正确
  book_name: book.title[locale]   // ❌ 错误
};
```

## 📈 性能优化

### 1. 翻译文件分割

```typescript
// ✅ 推荐 - 按页面分割
// book-detail.ts 只包含书籍详情页的翻译
import { bookDetail } from './pages/book-detail';

// ❌ 避免 - 过大的文件
// all-pages.ts 包含所有页面的翻译
import { allTranslations } from './all-pages';
```

### 2. 懒加载

```typescript
// ✅ 推荐 - 按需加载
const BookDetailPage = lazy(() => import('./BookDetailPage'));

// 组件内部使用翻译
const { i18n } = useTranslation();
```

### 3. 缓存策略

```typescript
// ✅ 推荐 - 合理的缓存时间
 staleTime: 5 * 60_000,  // 5分钟
 cacheTime: 10 * 60_000, // 10分钟
```

## 📚 相关文档

- [书籍详情页架构设计](./book-detail-page-architecture.md)
- [数据加载修复总结](./data-loading-fix-summary.md)
- [国际化分析](./i18n-analysis.md)
- [SEO中心化](./seo-centralization.md)

---

**文档版本**: 1.0.0  
**最后更新**: 2026年2月25日  
**维护团队**: 开发团队
