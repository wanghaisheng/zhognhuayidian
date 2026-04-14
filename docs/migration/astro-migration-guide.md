# Astro 迁移准备文档

## 概述

本文档说明了如何将当前的 React + Vite 项目迁移到 Astro 框架。项目已经通过 Storage Adapter 模式实现了数据层的抽象，为 Astro 迁移做好了准备。

## 当前架构

### 技术栈
- **前端框架**: React + Vite
- **路由**: TanStack Router
- **状态管理**: React Hooks + TanStack Query
- **存储**: Supabase (通过 Storage Adapter 抽象)
- **样式**: Tailwind CSS
- **国际化**: i18next

### 存储架构
项目已实现 Storage Adapter 模式，支持：
- Supabase (当前默认)
- sql.js (客户端本地存储)
- Cloudflare D1 (边缘数据库)

## 迁移到 Astro 的优势

1. **更好的 SEO**: Astro 的岛屿架构提供更好的服务端渲染和 SEO
2. **更快的性能**: 零 JS 默认，按需加载交互组件
3. **更好的开发体验**: 文件系统路由，更简洁的配置
4. **边缘部署**: 原生支持 Cloudflare Workers、Vercel Edge 等边缘平台

## 迁移步骤

### 1. 项目初始化

```bash
# 创建新的 Astro 项目
npm create astro@latest zhognhuayidian-astro

# 选择模板
# - Include sample files: No
# - Install dependencies: Yes
```

### 2. 安装依赖

```bash
cd zhognhuayidian-astro

# 安装 React 集成
npx astro add react

# 安装 Tailwind CSS
npx astro add tailwind

# 安装其他依赖
npm install @tanstack/react-query i18next react-i18next
```

### 3. 配置文件

#### astro.config.mjs
```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [react(), tailwind()],
  // 其他配置
});
```

### 4. 目录结构迁移

#### 原结构
```
src/
├── components/     # React 组件
├── pages/          # 页面组件
├── hooks/          # React Hooks
├── lib/            # 工具函数
├── config/         # 配置文件
└── locales/        # 国际化文件
```

#### Astro 结构
```
src/
├── components/     # React 组件 (岛屿)
├── pages/          # Astro 页面
├── layouts/        # 布局组件
├── hooks/          # React Hooks (保留)
├── lib/            # 工具函数 (保留)
├── config/         # 配置文件 (保留)
└── locales/        # 国际化文件 (保留)
```

### 5. Storage Adapter 集成

由于项目已经实现了 Storage Adapter 模式，迁移到 Astro 非常简单：

```typescript
// src/lib/storage/astro-adapter.ts
import type { StorageAdapter } from './adapter';
import { getOrCreateStorageAdapter } from './factory';

// Astro 页面中使用 Storage Adapter
export async function getStaticProps() {
  const adapter = await getOrCreateStorageAdapter();
  const manufacturers = await adapter.query('manufacturers', {
    order: { column: 'slug' }
  });
  
  return {
    props: {
      manufacturers: manufacturers.data
    }
  };
}
```

### 6. 页面迁移

#### React 组件转为 Astro 页面

**原 React 页面**:
```tsx
// src/pages/Manufacturers.tsx
export function Manufacturers() {
  const { data } = useManufacturers();
  return <div>{/* ... */}</div>;
}
```

**Astro 页面**:
```astro
---
// src/pages/manufacturers.astro
import Manufacturers from '../components/Manufacturers';
import { getManufacturersData } from '../lib/storage';

const manufacturers = await getManufacturersData();
---

<Manufacturers manufacturers={manufacturers} />
```

### 7. 布局系统

创建统一的布局组件：

```astro
---
// src/layouts/MainLayout.astro
interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
  </head>
  <body>
    <slot />
  </body>
</html>
```

### 8. 国际化集成

使用 Astro 的 i18n 集成或继续使用 i18next：

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import { i18n } from '@astrojs/i18n';

export default defineConfig({
  integrations: [
    i18n({
      defaultLocale: 'en',
      locales: ['en', 'zh'],
      routing: {
        prefixDefaultLocale: false,
      },
    }),
  ],
});
```

### 9. 数据获取

#### 服务端数据获取 (推荐)
```astro
---
// src/pages/devices.astro
import { getOrCreateStorageAdapter } from '../lib/storage/factory';

const adapter = await getOrCreateStorageAdapter();
const devices = await adapter.query('devices', {
  eq: { published: true }
});
---

<div>
  {devices.data.map(device => (
    <div>{device.name}</div>
  ))}
</div>
```

#### 客户端数据获取 (React 岛屿)
```tsx
// src/components/DeviceList.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { getOrCreateStorageAdapter } from '../lib/storage/factory';

export function DeviceList() {
  const { data, isLoading } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const adapter = await getOrCreateStorageAdapter();
      const result = await adapter.query('devices', {
        eq: { published: true }
      });
      return result.data;
    }
  });

  if (isLoading) return <div>Loading...</div>;
  return <div>{/* ... */}</div>;
}
```

### 10. 部署配置

#### Cloudflare Pages
```bash
npm install @astrojs/cloudflare
npx astro add cloudflare
```

#### Vercel
```bash
npm install @astrojs/vercel
npx astro add vercel
```

## 迁移清单

- [ ] 创建 Astro 项目
- [ ] 安装依赖
- [ ] 配置 Astro
- [ ] 迁移组件
- [ ] 迁移页面
- [ ] 集成 Storage Adapter
- [ ] 配置布局
- [ ] 配置国际化
- [ ] 配置数据获取
- [ ] 配置部署
- [ ] 测试
- [ ] 部署

## 注意事项

1. **Storage Adapter 无需修改**: 由于已实现抽象层，存储代码可以直接复用
2. **Hooks 可以保留**: React Hooks 在 React 岛屿中继续使用
3. **配置文件复用**: 所有配置文件可以直接复用
4. **样式系统**: Tailwind CSS 配置可以直接复用
5. **国际化**: 可以继续使用 i18next 或迁移到 Astro i18n

## 迁移后架构

```
src/
├── components/     # React 组件 (岛屿)
│   ├── ui/          # UI 组件
│   └── features/    # 功能组件
├── pages/          # Astro 页面 (服务端渲染)
├── layouts/        # 布局组件
├── lib/            # 工具函数 (Storage Adapter 等)
│   └── storage/    # Storage Adapter (无需修改)
├── config/         # 配置文件 (无需修改)
├── hooks/          # React Hooks (保留)
└── locales/        # 国际化文件 (保留)
```

## 总结

通过 Storage Adapter 模式，项目已经为 Astro 迁移做好了充分准备。迁移过程主要是：
1. 创建 Astro 项目
2. 复用现有代码
3. 转换页面组件
4. 配置 Astro 特性

Storage Adapter 的抽象使得数据层代码完全无需修改，大大降低了迁移成本。
