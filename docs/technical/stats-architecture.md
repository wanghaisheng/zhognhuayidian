# Stats 架构说明

- 本文说明 `/stats` 列表页与 `/stats/:slug` 详情页的路由、数据流、SEO、本地回退与脚本更新策略，便于维护与扩展。

## 路由结构
- 列表页：`/stats`
  - 定义位置：[content.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/lib/routes/slices/content.tsx#L192-L229)
  - 预加载：`markdownContentManager.getContentList('stats', locale)`
  - SEO：标题、描述、canonical 输出
- 详情页：`/stats/:slug`
  - 定义位置：[content.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/lib/routes/slices/content.tsx#L229-L289)
  - 预加载：`markdownContentManager.getContent('stats', slug, locale)`
  - SEO：从 frontmatter 中读取并输出（title、description、canonical）

## 页面组件
- 列表页组件：`StatsIndexPage`
  - 文件：[StatsIndexPage.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/pages/StatsIndexPage.tsx)
  - 展示：
    - 顶部聚合概览：`StatsOverview`（实时统计）与 `GlobalPresenceStats`（全球覆盖项）
    - stats 分类下的 Markdown 条目列表（标题、描述、查看详情）
- 详情页组件：`StatsDetailPage`
  - 文件：[StatsDetailPage.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/pages/StatsDetailPage.tsx)
  - 展示：
    - SEOHead + 面包屑
    - 顶部实时统计 `StatsOverview`
    - 正文渲染 Markdown（`htmlContent`）

## 数据流与回退策略
- 首选实时数据：`useStats`
  - 文件：[useStats.ts](file:///e:/workspace/ct-scanner-compass-directory/src/hooks/useStats.ts#L23-L79)
  - 来源：
    - Supabase `devices`/`manufacturers`/`articles` 表计数
    - `manufacturers.country` 去重计数
- 回退快照：
  - 当 Supabase 不可用时，读取 `src/data/snapshots/**/content/stats/global.json` 的 `metrics` 字段
  - 快照更新脚本：`generate-content-stats.ts`（见下）

## 内容与 SEO
- stats 内容 Markdown：
  - 例：[global.md](file:///e:/workspace/ct-scanner-compass-directory/content/stats/en/global.md)
  - frontmatter 中可加入 `routes` 字段，声明到站点各目录的导航路径
- 多语言 SEO 文件：
  - 列表页：`src/locales/{lang}/seo/stats/index.ts`
    - [en/index.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/en/seo/stats/index.ts)
    - [zh/index.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/seo/stats/index.ts)
  - 详情页示例：`src/locales/en/seo/stats/global/index.ts`
  - 字段：本地化仅提供 `title/description/structuredData`
  - 覆盖顺序：本地化 > 页面 head > 英文映射（`src/config/seo-en.ts`）> 默认
  - 注意：canonical/hreflang 由根路由统一输出，页面不再生成这些 links；中文 hreflang 输出 `zh-Hans` 并含 `x-default`

## 快照更新脚本
- 目的：在本地或无 Supabase 环境下，提供合理的静态基线，避免快照数值为 0
- 文件：[generate-content-stats.ts](file:///e:/workspace/ct-scanner-compass-directory/scripts/generate-content-stats.ts)
- 逻辑：
  - 设备数：统计 `content/devices/{lang}` 下 `.md` 文件数
  - 制造商数：统计 `content/manufacturers/{lang}` 下 `.md` 文件数
  - 文章数：`content/history/{lang}` + `content/learn/{lang}` `.md` 文件数之和
  - 国家数：尝试从 `content/customers/{lang}` frontmatter 中读取 `country:`，去重；若客户存在但无国家字段，则回退为 1
- npm 命令：
  - 在 `package.json` 中添加：`"generate:stats": "npx tsx scripts/generate-content-stats.ts"`
  - 运行：`npm run generate:stats`
  - 可选：加入到 `prebuild` 流程统一执行

## 扩展建议
- 列表页增加更多聚合卡片：客户总数、活跃市场数、设备目录增长趋势
- 详情页支持按 `routes` 自动渲染导航按钮
- 快照脚本加入更多维度（例如 CT/MRI 占比、品牌覆盖度），在列表页可视化
