# 正确的 Astro 迁移策略

## 核心原则

**迁移目标**: 将 TanStack Router 的数据获取方式换成 Astro 的方式，React 组件保持不变。

## TanStack Router 数据获取方式分析

### 典型结构

```tsx
// src/routes/blog.tsx
export const Route = createFileRoute('/blog')({
  component: () => <BlogPage />,
  loader: async ({ context, location }) => {
    // 数据获取逻辑
    const { queryClient } = context;
    const locale = getLanguageFromPath(location.pathname);
    
    return {
      prefetch: defer(queryClient.ensureQueryData({
        queryKey: ['supabase', 'articles', 'all', locale],
        queryFn: async () => {
          const { data } = await fetchArticlesAll();
          return Array.isArray(data) ? data : [];
        },
      })),
    };
  },
  head: () => buildPageHead('/blog', i18n.language, {
    title: i18n.language === 'zh' ? '博客' : 'Blog',
    description: i18n.t('blog.description')
  }),
});
```

### 数据流
1. TanStack Router 的 loader 在服务端获取数据
2. 数据通过 context 传递给组件
3. 组件通过 useQuery 获取预取的数据

## Astro 迁移策略

### 迁移步骤

#### 1. 创建 Astro 页面

```astro
---
// 数据获取（替代 TanStack Router 的 loader）
import { fetchArticlesAll } from '@/hooks/useSupabaseData';
import { getLanguageFromPath } from '@/utils/multilingualRoutes';
import { buildPageHead } from '@/utils/seo';
import i18n from '@/lib/i18n';

const locale = getLanguageFromPath(Astro.url.pathname) || 'en';
const { data } = await fetchArticlesAll();
const articles = Array.isArray(data) ? data : [];

// SEO 配置（替代 TanStack Router 的 head）
const head = buildPageHead('/blog', i18n.language, {
  title: i18n.language === 'zh' ? '博客' : 'Blog',
  description: i18n.t('blog.description')
});
---

<!DOCTYPE html>
<html lang={locale}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{head.title}</title>
    <meta name="description" content={head.description} />
    {head.meta.map(meta => <meta {...meta} />)}
    {head.links.map(link => <link {...link} />)}
  </head>
  <body>
    <BlogPage initialData={articles} locale={locale} client:load />
  </body>
</html>
```

#### 2. 修改 React 组件接收初始数据

```tsx
// src/pages/BlogPage.tsx
interface BlogPageProps {
  initialData?: any[];
  locale?: string;
}

const BlogPage: React.FC<BlogPageProps> = ({ initialData, locale }) => {
  const { t, i18n } = useTranslation();
  
  // 直接使用传入的数据，不再使用 useQuery
  const articles = initialData || [];

  return (
    // 组件内容
  );
};
```

**重要提示**: 
- 不应该在 Astro 中使用 TanStack QueryClient 和 QueryClientProvider
- 数据获取完全由 Astro 前置代码块负责
- React 组件只接收数据作为 props，不应该再使用 useQuery
- React 组件变成纯 UI 组件，无状态、无数据获取逻辑

### 核心区别

| 方面 | TanStack Router | Astro |
|------|---------------|-------|
| 数据获取 | loader 函数 | 前置代码块（--- --- 之间） |
| 数据传递 | context | props |
| SEO | head 函数 | HTML head 标签 |
| 路由 | 文件路由（.tsx） | 文件路由（.astro） |
| 组件渲染 | React SSR | Astro + React Islands |

### 迁移优先级

#### 第一优先级（无 loader 的路由）
- index.tsx → index.astro
- about.tsx → about.astro  
- contact.tsx → contact.astro

这些路由没有数据获取逻辑，只需要：
1. 创建 .astro 文件
2. 导入 React 组件
3. 添加必要的 Providers（I18nProvider, QueryClientProvider）

#### 第二优先级（有 loader 的路由）
- blog.tsx → blog.astro
- library.tsx → library.astro
- search.tsx → search.astro

这些路由需要：
1. 将 loader 的数据获取逻辑移到前置代码块
2. 将数据作为 props 传递给 React 组件
3. 修改 React 组件接收初始数据

#### 第三优先级（动态路由）
- blog.$slug.tsx → blog/[slug].astro
- book.$bookId.tsx → book/[bookId].astro
- history.$slug.tsx → history/[slug].astro

这些路由需要：
1. 实现 getStaticPaths() 函数
2. 在前置代码块获取特定数据
3. 传递给 React 组件

## 示例：blog.tsx 迁移

### 原 TanStack Router

```tsx
// src/routes/blog.tsx
export const Route = createFileRoute('/blog')({
  component: () => <BlogPage />,
  loader: async ({ context, location }) => {
    const { queryClient } = context;
    const locale = getLanguageFromPath(location.pathname) || 'en';
    return {
      prefetch: defer(queryClient.ensureQueryData({
        queryKey: ['supabase', 'articles', 'all', locale],
        queryFn: async () => {
          const { data } = await fetchArticlesAll();
          return Array.isArray(data) ? data : [];
        },
      })),
    };
  },
  head: () => buildPageHead('/blog', i18n.language, {
    title: i18n.language === 'zh' ? '博客' : 'Blog',
    description: i18n.t('blog.description')
  }),
});
```

### 迁移后 Astro

```astro
---
import BlogPage from '@/pages/BlogPage';
import I18nProvider from '@/components/I18nProvider';
import { fetchArticlesAll } from '@/hooks/useSupabaseData';
import { getLanguageFromPath } from '@/utils/multilingualRoutes';
import { buildPageHead } from '@/utils/seo';
import i18n from '@/lib/i18n';

// 数据获取（替代 loader）
const locale = getLanguageFromPath(Astro.url.pathname) || 'en';
const { data } = await fetchArticlesAll();
const articles = Array.isArray(data) ? data : [];

// SEO 配置（替代 head）
const head = buildPageHead('/blog', i18n.language, {
  title: i18n.language === 'zh' ? '博客' : 'Blog',
  description: i18n.t('blog.description')
});
---

<!DOCTYPE html>
<html lang={locale}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{head.title}</title>
    <meta name="description" content={head.description} />
    {head.meta.map(meta => <meta {...meta} />)}
    {head.links.map(link => <link {...link} />)}
  </head>
  <body>
    <I18nProvider client:load>
      <BlogPage 
        initialData={articles} 
        locale={locale} 
        client:visible 
      />
    </I18nProvider>
  </body>
</html>
```

## 注意事项

1. **React 组件需要修改**: 需要移除 useQuery 等数据获取逻辑，改为接收数据作为 props
2. **数据获取逻辑复用**: 将 TanStack Router loader 中的逻辑直接复制到 Astro 前置代码块
3. **SEO 配置**: 将 head 函数的配置直接转换为 HTML head 标签
4. **不使用 TanStack QueryClient**: Astro 负责数据获取，不需要 QueryClientProvider
5. **Providers**: 只需要在 Astro 中添加 I18nProvider，不需要 QueryClientProvider
6. **国际化**: 使用现有的 i18next 配置，不需要切换到 Astro i18n
7. **React 组件变成纯 UI 组件**: 无状态、无数据获取逻辑，只负责展示

## 当前实际路由列表

基于 `src/routes` 目录的实际文件：

### 静态路由（无 loader）
- index.tsx
- about.tsx
- contact.tsx
- glossary.tsx
- history.tsx
- learn.tsx
- library.tsx
- research.tsx
- resources.tsx
- search.tsx
- privacy.tsx
- terms.tsx

### 有 loader 的路由
- blog.tsx
- book.$bookId.tsx
- book.$bookId.chapter.$chapterId.tsx

### 动态路由
- blog.$slug.tsx
- history.$slug.tsx
- learn.$slug.tsx
