# SEO 集中化方案（TanStack Router + SSR）

本方案将 canonical 与 alternate hreflang 等跨页面 SEO 链接集中到“根路由 Head”，页面仅负责内容级 SEO（title/description/OG/Twitter 等）；通过构建期注入资产与 SSR 路由白名单保证稳定性；不在服务端做 Head 兜底，确保搜索引擎一致性、可维护性与性能稳定性。

## 背景与目标

- 解决问题：页面分散产出 canonical/hreflang 导致重复、冲突与 SSR 不稳定；不同路由对 SEO 链接理解不一致。
- 方案目标：
  - 集中输出 canonical 与 hreflang，统一语言前缀与 URL 规范
  - 页面只负责内容级 SEO，减少耦合与重复
-  取消服务端兜底，由路由层保证缺失标签的默认值与完整 head
  - 引入本地化页面级 SEO（人工编辑）优先覆盖自动生成，确保质量

## 核心原则

- 集中化：canonical/hreflang 由根路由统一生成；页面不再重复输出 links
- 内容级：页面路由仅输出 title/description/OG/Twitter 等内容 SEO
- 规范化：URL 标准化为 https、无 www、无尾斜杠（根除外）；canonical 不带 query
- 取消服务端兜底：不在服务端修补 Head；缺失由根路由/页面路由的 head 默认值覆盖
- 评审优先：英文本地化页面 SEO（人工编辑）优先覆盖自动/动态值

## 架构设计

- 根路由 Head（集中化输出）：
  - 依据当前 pathname 与语言，统一生成 canonical 与 hreflang
  - 位置：[routerInit.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/lib/routerInit.tsx)
- 页面路由 Head（内容级输出）：
  - 仅输出 title/description/OG/Twitter 等；不输出 canonical/hreflang
  - 位置示例：[content.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/lib/routes/slices/content.tsx)、[pricing.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/lib/routes/slices/pricing.tsx)、[static.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/lib/routes/slices/static.tsx)
- 客户端 SEO 组件：
  - 合并页面/本地化/英文映射/默认值，注入 head
  - 位置：[SEOHead.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/components/molecules/SEOHead.tsx)
- Functions 注入层：
-  仅注入构建期提取的 CSS/JS 资产与脱水状态脚本；静态资源请求绕行 SSR
-  不在入口/服务端修补任意 Head 标签
-  入口由脚本生成：[functions/[[path]].ts](file:///e:/workspace/ct-scanner-compass-directory/functions/[[path]].ts)
   - 注：若本地存在该文件用于调试，构建脚本将跳过重建；发布前建议删除以确保注入资产与白名单为最新

## 优先级与覆盖策略

字段合并顺序（title/description/structuredData）：

1. 本地化页面 SEO（目录：`src/locales/<lang>/seo/**/*.{ts,json}`；字段：`title`、`description`、`structuredData`）
2. 页面/路由 head 显式传入的值（自动或动态生成）
3. 英文映射配置（`src/config/seo-en.ts`，含 `keywords` 可选）
4. 站点默认值（`src/config/site.ts`）

说明：

- 本地化 SEO 不读取 `keywords`
- `keywords` 仅在英文映射中定义与使用（如需）
- canonical 与 hreflang 统一由根路由输出；页面不自定义这些链接
- 中文 hreflang 统一输出为 `zh-Hans`，并自动包含 `x-default`

## 数据组织与工具函数

- URL 与语言：
  - generateCanonicalUrl(path, lang)：标准化 canonical URL
  - generateHreflangLinks(path)：为所有支持语言生成 alternate links（含 x-default）
  - 位置：[seo.ts](file:///e:/workspace/ct-scanner-compass-directory/src/utils/seo.ts)
- 本地化页面 SEO 读取：
-  - getLocalizedSEOConfig(locale, pathname)：从 `src/locales/<lang>/seo/**/*.{ts,json}` 读取
-  - 路径映射规则：`/` → `index.ts`；`/pricing` → `pricing/index.ts`；`/learn/what-is-mri` → `learn/what-is-mri.ts`
  - 位置：[seo.ts](file:///e:/workspace/ct-scanner-compass-directory/src/utils/seo.ts)
- 关键词密度增强（可选）：
  - inferKeywordsFromPath(path, locale)：从路径/slug推断关键词
  - optimizeDescription(base, keywords, locale)：将描述优化到 90–180 字并补全关键词
  - 位置：[seo.ts](file:///e:/workspace/ct-scanner-compass-directory/src/utils/seo.ts)

## 站点地图

- 产物形态：分片站点地图，包括 `sitemap-main.xml`、`sitemap-blog.xml`，以及索引 `sitemap.xml`
- 生成阶段：由 `post-build` 调用 `scripts/generate-split-sitemap.js` 产出
- 链接规范：所有链接使用规范化 URL（https、无 www、结尾带 `/`），仅收录 EN 主路径，博客单列子地图

## 页面路由规范（实施要点）

- 不再输出 links（canonical/hreflang），只输出内容级 SEO：
  - title：顶层
  - meta：description、OG、Twitter（含 og:image 与 twitter:image）
  - 示例：查看 [content.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/lib/routes/slices/content.tsx)、[pricing.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/lib/routes/slices/pricing.tsx)、[static.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/lib/routes/slices/static.tsx)
- 路由 loader 可注入 frontmatter.seo/title/description/image/canonical 等用于内容级 SEO

## 取消服务端兜底策略

- 单路由审计失败或 Head 缺失时：
-  修复应发生在路由层（根路由/页面 head），补齐默认值或页面级字段
-  若 SSR 未产出 HTML，Cloudflare Pages 回退到静态层；不注入隐藏 H1
-  验证方式：使用 `npm run audit:dev` / `npm run audit:prod` 以及 `tests/seo` 用例进行检查

## 校验与审计

- 构建：`npm run build:server`
- 单路由审计：`node scripts/debug-one-route.mjs /zh/learn/mri-7t-specifications`、`node scripts/debug-one-route.mjs /pricing`
- 观察点：
  - canonical 与 hreflang 只出现一次，且与语言/路径一致
  - title/description/OG/Twitter 在页面层被正确覆盖（若存在本地化/页面值）
  - 描述长度建议 ≥120 字；过短会提示警告

## 迁移与落实清单

- 已完成：
  - 根路由集中输出 canonical/hreflang
  - /learn、/pricing、/privacy、/terms、/premium-reports 移除 links，统一内容级 SEO
  - 引入并应用关键词密度优化（可选）
  - 合并优先级改为“本地化 > 页面 > 英文映射 > 默认”
- 待扩展（建议）：
  - compare、reports、devices、manufacturers 等切片统一规范
  - 为关键页面在 `src/locales/en/seo` 添加本地化文件（title/description/keywords/structuredData）

## 常见问题与处理

- 重复标签：页面仍输出 canonical/hreflang → 删除页面级 links，由根路由统一
- 描述过短：补充本地化描述或启用 optimizeDescription 增强
- 多语言一致性：hreflang 必须覆盖所有语言版本并包含 x-default（函数已保证）
- 非英文页面：本地化目录可拓展至其他语言（如 `src/locales/zh/seo`），加载逻辑可复用

## 附录：关键代码位置

- 根路由集中 Head：[routerInit.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/lib/routerInit.tsx)
- 页面路由切片：[content.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/lib/routes/slices/content.tsx)、[pricing.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/lib/routes/slices/pricing.tsx)、[static.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/lib/routes/slices/static.tsx)
- SEO 组件与合并逻辑：[SEOHead.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/components/molecules/SEOHead.tsx)
- 工具函数与本地化加载：[seo.ts](file:///e:/workspace/ct-scanner-compass-directory/src/utils/seo.ts)
- 英文映射配置：[seo-en.ts](file:///e:/workspace/ct-scanner-compass-directory/src/config/seo-en.ts)
