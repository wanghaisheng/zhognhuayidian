# 从 TanStack Router 迁移到 Astro 的详细计划

## 概述

基于 Astro 官方迁移指南和当前项目架构，本文档提供了从 TanStack Router 迁移到 Astro 的详细步骤和最佳实践。

## 当前项目架构

### 技术栈
- **前端框架**: React + Vite
- **路由**: TanStack Router (文件路由)
- **状态管理**: React Hooks + TanStack Query
- **存储**: Supabase (通过 Storage Adapter 抽象)
- **样式**: Tailwind CSS
- **国际化**: i18next
- **数据层**: Storage Adapter (Supabase, sql.js, D1)

### 路由结构
```
src/routes/
├── __root.tsx                    # 根布局
├── index.tsx                     # 首页
├── about.tsx                     # 关于页面
├── contact.tsx                   # 联系页面
├── blog.tsx                      # 博客列表
├── blog.$slug.tsx                # 博客详情 (动态路由)
├── book.$bookId.tsx              # 书籍详情 (动态路由)
├── book.$bookId.chapter.$chapterId.tsx  # 章节详情 (嵌套动态路由)
├── library.tsx                   # 古籍库
├── search.tsx                    # 搜索页面
├── glossary.tsx                  # 词汇表
├── history.tsx                   # 历史页面
├── history.$slug.tsx             # 历史详情 (动态路由)
├── learn.tsx                     # 学习中心
├── learn.$slug.tsx               # 学习详情 (动态路由)
├── research.tsx                  # 研究页面
├── resources.tsx                 # 资源页面
├── privacy.tsx                   # 隐私政策
└── terms.tsx                     # 服务条款
```

## Astro 迁移策略

### 策略选择：渐进式迁移

采用渐进式迁移策略，而非一次性完全重写：

1. **保持现有 TanStack Router 运行**: 在迁移期间保持现有功能
2. **并行开发 Astro 版本**: 在同一项目中开发 Astro 版本
3. **逐步替换页面**: 逐个页面迁移到 Astro
4. **复用现有组件**: 通过 React 集成复用现有 React 组件

## 迁移步骤

### 阶段 1: Astro 基础设施（已完成 ✅）

#### 1.1 安装 Astro 依赖
```bash
npm install astro @astrojs/react @astrojs/tailwind @astrojs/mdx @astrojs/cloudflare
```

#### 1.2 创建 Astro 配置
```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [
    react(),
    tailwind(),
    mdx(),
  ],
  site: 'https://chinactscanner.org',
  compressHTML: true,
  build: {
    format: 'directory',
  },
  adapter: '@astrojs/cloudflare',
  vite: {
    ssr: {
      external: ['sql.js'],
    },
    build: {
      rollupOptions: {
        external: ['sql.js'],
      },
    },
  },
});
```

#### 1.3 配置国际化
```javascript
// astro.config.mjs
export default defineConfig({
  // ... 其他配置
  i18n: {
    locales: ["en", "zh"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
```

### 阶段 2: 布局和基础组件迁移

#### 2.1 创建 Astro 布局组件
```astro
---
// src/layouts/MainLayout.astro
interface Props {
  title: string;
  description?: string;
  lang?: string;
}

const { 
  title, 
  description = '中华医典 - 中国医疗器械数据库',
  lang = 'en'
} = Astro.props;
---

<!DOCTYPE html>
<html lang={lang}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <meta name="description" content={description} />
    <meta name="generator" content={Astro.generator} />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

#### 2.2 迁移根布局组件
将 `src/routes/__root.tsx` 转换为 Astro 布局：

**原 TanStack Router**:
```tsx
// src/routes/__root.tsx
export const Route = createFileRoute('/')({
  component: () => (
    <div className="min-h-screen">
      <Header />
      <Outlet />
      <Footer />
    </div>
  ),
});
```

**Astro 版本**:
```astro
---
// src/layouts/AppLayout.astro
import Header from '../components/Header';
import Footer from '../components/Footer';
---
<div class="min-h-screen">
  <Header client:visible />
  <slot />
  <Footer client:visible />
</div>
```

### 阶段 3: 静态页面迁移

#### 3.1 迁移首页 (index.tsx → index.astro)

**原 TanStack Router**:
```tsx
// src/routes/index.tsx
export const Route = createFileRoute('/')({
  component: () => (
    <main>
      <h1>中华医典</h1>
      <p>传承中医智慧 · 弘扬中华文化</p>
    </main>
  ),
});
```

**Astro 版本**:
```astro
---
// src/pages/index.astro
import MainLayout from '../layouts/MainLayout.astro';
import I18nProvider from '../components/I18nProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import i18n from '../lib/i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
---

<MainLayout title="中华医典 - 中国医疗器械数据库">
  <I18nProvider client:visible>
    <QueryClientProvider client={queryClient}>
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-7xl mb-6 font-bold text-gradient-tcm">
            中华医典
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            传承中医智慧 · 弘扬中华文化
          </p>
        </div>
      </main>
    </QueryClientProvider>
  </I18nProvider>
</MainLayout>
```

#### 3.2 迁移其他静态页面
类似地迁移：
- `about.tsx` → `src/pages/about.astro`
- `contact.tsx` → `src/pages/contact.astro`
- `privacy.tsx` → `src/pages/privacy.astro`
- `terms.tsx` → `src/pages/terms.astro`

### 阶段 4: 动态路由迁移

#### 4.1 迁移博客详情 (blog.$slug.tsx → blog/[slug].astro)

**原 TanStack Router**:
```tsx
// src/routes/blog.$slug.tsx
export const Route = createFileRoute('/blog/$slug')({
  loader: ({ params }) => {
    return getBlogPost(params.slug);
  },
  component: ({ loaderData }) => (
    <BlogPost post={loaderData} />
  ),
});
```

**Astro 版本**:
```astro
---
// src/pages/blog/[slug].astro
import MainLayout from '../layouts/MainLayout.astro';
import I18nProvider from '../components/I18nProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import i18n from '../lib/i18n';
import BlogPost from '../components/BlogPost';

const { slug } = Astro.params;

// 在服务端获取数据
const { getOrCreateStorageAdapter } = await import('../lib/storage/factory');
const adapter = await getOrCreateStorageAdapter();
const result = await adapter.query('blog_posts', {
  eq: { slug }
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
---

<MainLayout title={`Blog - ${result.data?.title || 'Not Found'}`}>
  <I18nProvider client:visible>
    <QueryClientProvider client={queryClient}>
      {result.data ? (
        <BlogPost post={result.data} client:visible />
      ) : (
        <div>Post not found</div>
      )}
    </QueryClientProvider>
  </I18nProvider>
</MainLayout>
```

#### 4.2 迁移嵌套动态路由 (book.$bookId.chapter.$chapterId.tsx)

**原 TanStack Router**:
```tsx
// src/routes/book.$bookId.chapter.$chapterId.tsx
export const Route = createFileRoute('/book/$bookId/chapter/$chapterId')({
  loader: ({ params }) => {
    return getChapter(params.bookId, params.chapterId);
  },
  component: ({ loaderData }) => (
    <Chapter chapter={loaderData} />
  ),
});
```

**Astro 版本**:
```astro
---
// src/pages/book/[bookId]/chapter/[chapterId].astro
import MainLayout from '../layouts/MainLayout.astro';
import I18nProvider from '../components/I18nProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import i18n from '../lib/i18n';
import Chapter from '../components/Chapter';

const { bookId, chapterId } = Astro.params;

// 在服务端获取数据
const { getOrCreateStorageAdapter } = await import('../lib/storage/factory');
const adapter = await getOrCreateStorageAdapter();
const result = await adapter.query('chapters', {
  eq: { book_id: bookId, id: chapterId }
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
---

<MainLayout title={`Chapter - ${result.data?.title || 'Not Found'}`}>
  <I18nProvider client:visible>
    <QueryClientProvider client={queryClient}>
      {result.data ? (
        <Chapter chapter={result.data} client:visible />
      ) : (
        <div>Chapter not found</div>
      )}
    </QueryClientProvider>
  </I18nProvider>
</MainLayout>
```

### 阶段 5: 国际化路由配置

#### 5.1 创建本地化文件夹结构
```
src/pages/
├── index.astro            # / (英文首页)
├── about.astro            # /about (英文关于)
├── zh/
│   ├── index.astro        # /zh (中文首页)
│   └── about.astro        # /zh/about (中文关于)
├── blog/
│   ├── index.astro        # /blog (英文博客列表)
│   └── [slug].astro      # /blog/:slug (英文博客详情)
└── zh/
    └── blog/
        ├── index.astro    # /zh/blog (中文博客列表)
        └── [slug].astro  # /zh/blog/:slug (中文博客详情)
```

#### 5.2 使用 i18n 辅助函数
```astro
---
import { getRelativeLocaleUrl } from 'astro:i18n';

// 获取当前语言
const lang = Astro.currentLocale || 'en';

// 生成本地化链接
const aboutUrl = getRelativeLocaleUrl(lang, 'about');
const blogUrl = getRelativeLocaleUrl(lang, 'blog');
---
```

### 阶段 6: 数据获取优化

#### 6.1 使用 Content Collections（可选）

如果项目有大量 markdown 内容，可以考虑迁移到 Content Collections：

```typescript
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };
```

#### 6.2 继续使用 Storage Adapter

保持现有的 Storage Adapter 架构，在 Astro 中使用：

```astro
---
const { getOrCreateStorageAdapter } = await import('../lib/storage/factory');
const adapter = await getOrCreateStorageAdapter();
const data = await adapter.query('table', { eq: { published: true }});
---
```

### 阶段 7: 组件迁移策略

#### 7.1 React 组件转换为 Astro 组件

**判断标准**:
- **转换为 Astro**: 静态展示组件，无需交互
- **保持为 React**: 需要交互的组件（表单、搜索、动态加载）

**示例转换**:

**原 React 组件**:
```tsx
export function HeroSection() {
  return (
    <section className="hero">
      <h1>标题</h1>
      <p>描述</p>
    </section>
  );
}
```

**Astro 版本**:
```astro
---
// src/components/HeroSection.astro
interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
---
<section class="hero">
  <h1>{title}</h1>
  <p>{description}</p>
</section>
```

#### 7.2 保持交互组件为 React 岛屿

```astro
---
import SearchBar from '../components/SearchBar';
---
<SearchBar client:visible />
```

### 阶段 8: 样式迁移

#### 8.1 Tailwind CSS（无需修改）

项目已使用 Tailwind CSS，在 Astro 中继续使用：

```bash
npx astro add tailwind
```

#### 8.2 CSS Modules 转换

**原 CSS Modules**:
```tsx
import styles from './Hero.module.css';
<div className={styles.hero}>...</div>
```

**Astro 版本**:
```astro
---
// 使用 scoped CSS
<style>
  .hero {
    /* styles */
  }
</style>

<div class="hero">...</div>
```

### 阶段 9: 测试和验证

#### 9.1 本地测试
```bash
# 启动 Astro 开发服务器
npm run dev:astro

# 构建生产版本
npm run build:astro

# 预览生产构建
npm run preview:astro
```

#### 9.2 功能验证清单
- [ ] 所有静态页面正确渲染
- [ ] 动态路由正确工作
- [ ] 国际化切换正常
- [ ] Storage Adapter 数据获取正常
- [ ] React 岛屿组件交互正常
- [ ] 样式正确应用
- [ ] SEO 元数据正确

### 阶段 10: 部署配置

#### 10.1 Cloudflare Pages 部署
```bash
# 构建项目
npm run build:astro

# 部署到 Cloudflare Pages
# 使用 wrangler 或 Cloudflare Pages CI/CD
```

#### 10.2 环境变量配置
在 Cloudflare Pages 中配置：
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_SERVICE_ROLE_KEY`

## 迁移检查清单

### 基础设施
- [x] 安装 Astro 依赖
- [x] 创建 astro.config.mjs
- [x] 配置 React 集成
- [x] 配置 Tailwind CSS
- [x] 配置 MDX
- [x] 配置 Cloudflare 适配器
- [x] 配置国际化

### 布局和组件
- [x] 创建 MainLayout.astro
- [ ] 创建 AppLayout.astro
- [ ] 创建 I18nProvider 组件
- [ ] 迁移 Header 组件
- [ ] 迁移 Footer 组件

### 页面迁移
- [x] 创建 index.astro 示例
- [x] 创建 manufacturers.astro 示例
- [ ] 迁移 about.astro
- [ ] 迁移 contact.astro
- [ ] 迁移 library.astro
- [ ] 迁移 search.astro
- [ ] 迁移 blog.tsx 和 blog.$slug.tsx
- [ ] 迁移 book 相关页面
- [ ] 迁移 history 相关页面
- [ ] 迁移 learn 相关页面
- [ ] 迁移 research.astro
- [ ] 迁移 glossary.astro
- [ ] 迁移 resources.astro
- [ ] 迁移 privacy.astro
- [ ] 迁移 terms.astro

### 国际化
- [ ] 创建 zh/ 文件夹结构
- [ ] 迁移中文页面
- [ ] 配置语言切换
- [ ] 测试多语言路由

### 数据层
- [x] 集成 Storage Adapter
- [ ] 测试数据获取
- [ ] 优化查询性能
- [ ] 配置缓存策略

## 迁移优先级

### 第一优先级（核心功能）
1. 首页 (index.astro)
2. 布局组件 (MainLayout, AppLayout)
3. 国际化配置
4. Storage Adapter 集成

### 第二优先级（主要页面）
5. 关于页面 (about.astro)
6. 联系页面 (contact.astro)
7. 古籍库 (library.astro)
8. 搜索页面 (search.astro)

### 第三优先级（动态内容）
9. 博客页面 (blog/)
10. 书籍页面 (book/)
11. 历史页面 (history/)
12. 学习中心 (learn/)

### 第四优先级（辅助功能）
13. 词汇表 (glossary.astro)
14. 研究页面 (research.astro)
15. 资源页面 (resources.astro)
16. 隐私政策 (privacy.astro)
17. 服务条款 (terms.astro)

## 注意事项

### React 组件兼容性
- React 组件在 Astro 中必须使用 `.jsx` 或 `.tsx` 扩展名
- 使用 `client:*` 指令控制水合时机
- 避免在服务端使用浏览器专用 API

### 性能优化
- 使用 `client:idle` 延迟加载非关键组件
- 使用 `client:visible` 仅在可见时加载组件
- 服务端获取数据，客户端仅负责展示

### SEO 优化
- 在 Astro 前置代码块中设置元数据
- 使用 `Astro.props` 传递页面属性
- 利用 Astro 的静态生成优势

## 回退计划

如果迁移过程中遇到问题：
1. 保留 TanStack Router 版本作为备份
2. 使用 Git 分支管理迁移进度
3. 逐步迁移，每个阶段都测试验证
4. 遇到严重问题时可以快速回退

## 总结

本迁移计划采用渐进式策略，充分利用 Astro 的 React 集成能力，最小化迁移风险。通过复用现有的 Storage Adapter 和组件，可以快速完成核心功能的迁移，同时享受 Astro 的性能和 SEO 优势。

迁移完成后，项目将拥有：
- 更好的 SEO 和性能
- 更快的页面加载速度
- 更简单的部署流程
- 更好的开发者体验
