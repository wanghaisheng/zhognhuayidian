# Localized Page SEO (English)

Purpose: 为每个页面提供英文本地化的页面级 SEO 数据（title、description、structuredData），用于覆盖自动产出的默认值与英文全局映射。说明：不需要提供 keywords 字段，Google 搜索不要求该字段。

## 文件组织与路径映射

- 根目录：`src/locales/en/seo/`
- 约定的页面路径 → 文件路径
  - `/` → `index.ts` 或 `index.json`
  - `/pricing` → `pricing/index.ts` 或 `pricing/index.json`
  - `/learn/what-is-mri` → `learn/what-is-mri.ts` 或 `learn/what-is-mri.json`
  - 任意多级路径：去掉语言前缀后，按路径层级放置同名文件；`index` 文件代表目录本身
- 路径标准化：自动去重斜杠、去尾部斜杠；`index` 映射到其父目录路径

## 支持的文件类型与导出格式

- TypeScript：默认导出对象（推荐）
- JSON：顶层对象

对象字段（全部可选）：

- `title`: string
- `description`: string
- `structuredData`: object（JSON-LD 片段，可为 Article/Product/WebPage 等）

## 生效优先级（合并策略）

当页面渲染时，SEO 组件按以下顺序合并：

1. 本地化页面 SEO（本目录文件，人工编辑优先）
2. 页面/路由 head 显式传入的值（自动或动态生成）
3. 英文全局映射 `src/config/seo-en.ts`
4. 站点默认值 `src/config/site.ts`

说明：

- `canonical` 与 `hreflang` 由根路由统一输出；页面不需自定义这些链接

## 描述写作规范

- `description` 建议 120–180 字（英文），覆盖页面核心主题，避免堆砌
- 避免与页面正文重复过多；保持买方决策导向与摘要信息密度

## 示例

TS（`pricing/index.ts`）：

```ts
export default {
  title: 'CT Scanner & MRI Equipment Prices 2025 | Compare & Quote',
  description:
    'Comprehensive pricing for CT scanners and MRI machines. Compare slice counts, field strengths, service terms, and request procurement-ready quotes.',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'ProductCollection',
    'name': 'CT & MRI Equipment Pricing',
    'description': 'Price ranges by specification and service terms'
  }
};
```

JSON（`learn/what-is-mri.json`）：

```json
{
  "title": "What is MRI? Meaning, Process & Preparation | Complete Guide",
  "description": "Understand magnetic resonance imaging (MRI): how it works, typical scan process, preparation tips, and differences vs CT for clinical decisions.",
  "structuredData": {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "What is MRI? Complete Guide",
    "articleSection": "Education"
  }
}
```

根路径（`index.ts` → `/`）：

```ts
export default {
  title: 'CT Scanner Manufacturers & Models | Specs, Prices & Shortlists',
  description:
    'Browse CT scanner models, compare key specifications and price ranges, shortlist suppliers, and request quotes with confidence.',
};
```

## 校验与审计

- 单页 SSR 审计脚本（示例）：
  - `node scripts/debug-one-route.mjs /pricing`
  - `node scripts/debug-one-route.mjs /learn/what-is-mri`
- 观察输出的 `<title>`、`<meta name="description">`、OG/Twitter 字段是否被本地化覆盖

## 常见问题

- 未生效：确认路径与文件映射是否正确（`index` 文件代表目录路径）
- 与正文冲突：本地化描述应为摘要，不替代正文；避免与正文段落重复
- 过短/过长：按 120–180 字优化；长度不足会被审计脚本提示

## 相关代码

- 合并与加载逻辑：`src/components/molecules/SEOHead.tsx`
- 本地化加载函数：`src/utils/seo.ts` 中的 `getLocalizedSEOConfig`
