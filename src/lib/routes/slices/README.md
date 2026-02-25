# 路由切片（slices）规范说明

本目录用于按领域拆分路由定义，提升可维护性与可扩展性。每个切片仅关注自身领域的页面/数据加载与路径配置；重定向与多语言路径构造由专用工具模块提供。

## 目录结构与职责

- devices.tsx：设备相关路由（分类、规格、详情、列表），含数据预加载
- manufacturers.tsx：厂商相关路由（列表、详情），含设备联动预加载
- content.tsx：内容中心（博客、历史、资源、技术、学习、教育、指南）
- reports.tsx：报告与分析（行业、市场、专家）
- compare.tsx：设备对比相关（列表与详情）
- customers.tsx：客户与地图页面
- system.tsx：系统页面（dashboard、admin、settings、content-management，通常无语言前缀）
- static.tsx：静态页面（about、faq/procurement-reliability、contact、privacy、terms、glossary）
- staticRedirects.ts：静态页面的重定向（例如 /faq → /about）

## 依赖与工具

- 多语言路径构造：src/lib/routes/langPaths.ts（addLangPath）
- 路由构造器：src/lib/routes/builders.ts（componentRoutes / componentRoutesWithLoader）
- 重定向构造器：src/lib/routes/redirects.ts（redirectRoutes）
- 路由聚合：src/lib/routerInit.tsx（集中加载各领域切片与重定向）

## 命名与约定

- 文件命名：使用领域复数小写（如 devices.tsx、manufacturers.tsx）
- 只导出切片函数：export const <domain>Routes = (rootRoute, wrap) => [...]
- wrap 函数：来自 routerInit.tsx 的 suspenseWrap，用于统一懒加载与占位
- 参数类型：rootRoute 使用 AnyRoute；避免使用 any
- 懒加载：统一使用 React.lazy + React.createElement 包装
- 路由路径参数：内部会将 :param 转换为 $param（由构造器封装，无需手工处理）

## 数据预加载（loader）规范

- 统一使用 componentRoutesWithLoader
- 采用 QueryClient.ensureQueryData 进行预加载
- QueryKey 应含唯一标识（如 ['device', slug]）
- 优先使用本地快照（import.meta.glob），失败时回退到远端数据源（db.*）
- 结果数据形态需稳定：列表为数组、详情为对象；避免返回联合类型

## 重定向规范

- 统一使用 redirects.ts 的 redirectRoutes 构造
- 静态重定向集中于 staticRedirects.ts（如 /faq → /about）
- 跨领域重定向（如 /knowledge/* → /resources/*）在 routerInit.tsx 聚合处统一维护
- 重定向路径需支持多语言前缀（addLangPath 自动适配）

## 新增切片的流程

1. 在本目录新增 <domain>.tsx 文件，导出 <domain>Routes 函数
2. 使用 componentRoutes / componentRoutesWithLoader 构造路由
3. 在 src/lib/routerInit.tsx 引入该切片，并在 routeTree 中展开
4. 如涉及重定向，新增 <domain>Redirects.ts 或加入既有重定向模块
5. 运行 lint，确保无类型与规范告警

## 示例：新增 foo 领域切片

```tsx
// src/lib/routes/slices/foo.tsx
import React, { lazy } from 'react';
import type { AnyRoute } from '@tanstack/react-router';
import { componentRoutes, componentRoutesWithLoader } from '@/lib/routes/builders';
import { QueryClient } from '@tanstack/react-query';

export const fooRoutes = (rootRoute: AnyRoute, wrap: (el: React.ReactNode) => React.ReactNode) => [
  ...componentRoutes(rootRoute, '/foo', React.createElement(lazy(() => import('@/pages/FooList'))), wrap),
  ...componentRoutesWithLoader(
    rootRoute,
    '/foo/:slug',
    React.createElement(lazy(() => import('@/pages/FooDetail'))),
    async ({ queryClient }, params) => {
      await queryClient.ensureQueryData({
        queryKey: ['foo', params.slug],
        queryFn: async () => {/* fetch detail by slug */},
      });
    },
    wrap
  ),
];
```

在 routerInit.tsx 中：

```tsx
import { fooRoutes } from '@/lib/routes/slices/foo';
// ...
export const routeTree = rootRoute.addChildren([
  // ...
  ...fooRoutes(rootRoute, suspenseWrap),
  // ...
]);
```

## 维护建议

- 路由变更优先修改对应切片文件，避免在 routerInit.tsx 直接散落定义
- 跨领域的重定向与迁移路径统一由 routerInit.tsx 管理
- 恪守类型约束（AnyRoute、DehydratedState、QueryClient 等），避免 any

## 接口约定（领域通用）

- devices
  - 列表：['devices'] → Device[]；优先快照失败回退 db.devices.getAll()
  - 详情：['device', slug] → Device；回退 db.devices.getBySlug(slug)
  - manufacturer devices：['devicesByManufacturer', manufacturerId] → Device[]
- manufacturers
  - 列表：['manufacturers'] → Manufacturer[]
  - 详情：['manufacturer', slug] → Manufacturer；必要时联动预取 devicesByManufacturer
- content
  - 博客列表/详情：页面自取或静态内容；不强制 loader
  - 历史/技术/学习：按 slug 渲染；必要时通过 SSR 预置 markdownContent
- reports
  - 行业/市场/专家：页面按 slug/id 渲染；数据来源自页面模块
- customers
  - 列表：['customers'] → Customer[]；详情：['customer', id] → Customer

## Hydration 与上下文

- SSR 侧 router.dehydrate 输出：{ queryClientState?: DehydratedState, markdownContent?: {...} }
- CSR 侧 window.__TANSTACK_ROUTER_CONTEXT__ 读取同结构，避免 any
- entry-client.tsx 与 useMarkdownContent.ts 需保持类型声明一致

## 变更检查清单（PR 审核）

- 是否在对应 slice 中新增/修改路由，而非散落于 routerInit.tsx
- 是否使用 componentRoutes/WithLoader 构造，且包裹 suspenseWrap
- loader 的 queryKey 是否唯一且稳定；返回数据形态是否稳定
- 是否新增必要的重定向（包含多语言适配）
- 是否运行 lint 与编译检查，无类型或规范报错
