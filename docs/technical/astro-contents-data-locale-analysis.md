# Astro Contents、Data、Locale 管理分析

## Astro 内容管理方式

### Content Collections（内容集合）

Astro 的 Content Collections 是管理结构化内容的最佳方式，支持：
- **构建时集合**：在构建时更新数据，适合静态内容（博客、文档、产品描述）
- **实时集合**：在运行时获取数据，适合频繁更新的数据（库存、价格）

#### 定义方式

在 `src/content.config.ts` 中定义集合：

```typescript
import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

// 使用 glob loader 处理多个文件
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
  }),
});

// 使用 file loader 处理单个文件
const dogs = defineCollection({
  loader: file("src/data/dogs.json"),
  schema: z.object({
    id: z.string(),
    breed: z.string(),
  }),
});

export const collections = { blog, dogs };
```

#### 查询方式

```astro
---
import { getCollection, getEntry } from 'astro:content';

// 获取整个集合
const allBlogPosts = await getCollection('blog');

// 获取单个条目
const poodleData = await getEntry('dogs', 'poodle');
---
```

#### 生成路由

使用 `getStaticPaths()` 从内容生成路由：

```astro
---
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { id: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---
```

## Astro 数据获取方式

### fetch() API

Astro 组件在组件脚本中可以使用全局 `fetch()` 函数：

```astro
---
const response = await fetch("https://api.example.com/data");
const data = await response.json();
---
```

特点：
- **构建时执行**：数据在构建时获取并生成 HTML
- **SSR 模式**：如果启用 SSR，fetch 在运行时执行
- **顶层 await**：支持顶层 await 语法
- **传递数据**：可将获取的数据传递给组件

### 框架组件中的 fetch()

框架组件（React、Vue 等）也可以使用 fetch：

```tsx
const data = await fetch('https://example.com/movies.json').then(res => res.json());
```

## Astro 国际化管理

### i18n 路由配置

在 `astro.config.mjs` 中配置：

```javascript
export default defineConfig({
  i18n: {
    locales: ["es", "en", "pt-br"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: false, // 默认语言是否使用前缀
    },
  },
})
```

### 本地化文件夹结构

在 `src/pages/` 中创建本地化文件夹：

```
src/
  pages/
    about.astro          # /about (默认语言)
    index.astro          # / (默认语言)
    es/
      about.astro        # /es/about
      index.astro        # /es
    pt-br/
      about.astro        # /pt-br/about
      index.astro        # /pt-br
```

### 辅助函数

使用 `astro:i18n` 模块的辅助函数：

```astro
---
import { getRelativeLocaleUrl } from 'astro:i18n';

const aboutURL = getRelativeLocaleUrl("es", "about");
---
```

## 当前项目路由分析

### TanStack Router 结构

当前项目使用 TanStack Router，位于 `src/routes/` 目录：

```
src/routes/
├── __root.tsx                    # 根布局
├── index.tsx                     # 首页
├── about.tsx                     # 关于页面
├── contact.tsx                   # 联系页面
├── blog.tsx                      # 博客列表
├── blog.$slug.tsx                # 博客详情
├── book.$bookId.tsx              # 书籍详情
├── book.$bookId.chapter.$chapterId.tsx  # 章节详情
├── library.tsx                   # 古籍库
├── search.tsx                    # 搜索页面
├── glossary.tsx                  # 词汇表
├── history.tsx                   # 历史页面
├── history.$slug.tsx             # 历史详情
├── learn.tsx                     # 学习中心
├── learn.$slug.tsx               # 学习详情
├── research.tsx                  # 研究页面
├── resources.tsx                 # 资源页面
├── privacy.tsx                   # 隐私政策
├── terms.tsx                     # 服务条款
├── analysis/                     # 分析相关
├── knowledge/                    # 知识相关
└── resources/                    # 资源相关
```

### 当前国际化配置

项目在 `src/config/language.ts` 中定义了语言配置：

```typescript
export const LANGUAGES: LanguageConfig[] = [
  {
    code: 'en',
    prefix: '',           // 默认语言无前缀: /devices
    hreflang: 'en-US',
    locale: 'en_US',
    name: 'English',
    dir: 'ltr',
  },
  {
    code: 'zh',
    prefix: '/zh',        // 中文有前缀: /zh/devices
    hreflang: 'zh-CN',
    locale: 'zh_CN',
    name: '中文',
    dir: 'ltr',
  },
];
```

### 迁移到 Astro 的建议

#### 1. 路由结构迁移

将 TanStack Router 的文件路由转换为 Astro 的文件路由：

**TanStack Router**:
```
src/routes/
├── index.tsx              # /
├── about.tsx              # /about
├── blog.$slug.tsx         # /blog/:slug
└── book.$bookId.tsx       # /book/:bookId
```

**Astro**:
```
src/pages/
├── index.astro            # /
├── about.astro            # /about
├── blog/
│   └── [slug].astro       # /blog/:slug
└── book/
    └── [bookId].astro     # /book/:bookId
```

#### 2. 国际化路由迁移

根据当前语言配置，创建 Astro i18n 文件夹结构：

**astro.config.mjs**:
```javascript
export default defineConfig({
  i18n: {
    locales: ["en", "zh"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: false,  // 英文无前缀
    },
  },
})
```

**文件夹结构**:
```
src/pages/
├── index.astro            # / (英文)
├── about.astro            # /about (英文)
├── zh/
│   ├── index.astro        # /zh (中文)
│   └── about.astro        # /zh/about (中文)
```

#### 3. 数据迁移策略

**选项 1: 使用 Content Collections**

将现有的 markdown 内容迁移到 Content Collections：

```typescript
// src/content.config.ts
const books = defineCollection({
  loader: glob({ base: './src/content/books', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    dynasty: z.string(),
  }),
});
```

**选项 2: 使用 Storage Adapter**

继续使用现有的 Storage Adapter，在 Astro 服务端获取数据：

```astro
---
const { getOrCreateStorageAdapter } = await import('../lib/storage/factory');
const adapter = await getOrCreateStorageAdapter();
const books = await adapter.query('books', { eq: { published: true }});
---
```

#### 4. 组件迁移

将 React 组件迁移为 Astro 岛屿：

**TanStack Router (React)**:
```tsx
// src/routes/index.tsx
export function Route() {
  return <div><Header /><Main /><Footer /></div>;
}
```

**Astro**:
```astro
---
import Header from '../components/Header';
import Main from '../components/Main';
import Footer from '../components/Footer';
---
<Header />
<Main client:visible />
<Footer />
```

## 迁移优先级建议

### 高优先级
1. **基础页面迁移**: index, about, contact 等静态页面
2. **国际化配置**: 设置 Astro i18n 配置和文件夹结构
3. **布局组件**: 迁移 Header, Footer 等布局组件

### 中优先级
4. **动态路由**: 迁移 blog, book 等动态路由页面
5. **数据获取**: 集成 Storage Adapter 或 Content Collections
6. **搜索功能**: 迁移搜索页面和相关逻辑

### 低优先级
7. **复杂功能**: library, research 等复杂功能页面
8. **性能优化**: 图片优化、缓存策略
9. **SEO 优化**: 元数据、结构化数据

## 总结

Astro 提供了强大的内容管理和国际化功能：
- **Content Collections**: 结构化内容管理，支持类型安全
- **Data Fetching**: 灵活的数据获取方式，支持构建时和运行时
- **i18n Routing**: 内置国际化路由，支持多语言站点

当前项目的 TanStack Router 结构可以平滑迁移到 Astro 的文件路由系统，同时保持现有的 Storage Adapter 和国际化配置。
