loader 层改为“数据库 → snapshots → mocks”的统一回退


src\data\seed 从src\locales中对应locale读取对应的seed数据



**核心思路**
- 统一数据读取回退链路：数据库 → snapshots → mocks（seeddata），保证首屏稳定与离线覆盖<mccoremem id="03fkgv35gapq1v559nyzt7287" />。
- 语言化的“作者/种子数据”与文案分离：seeddata 承载结构化种子数据；labels 承载文案权威；Markdown 在 content 作为长文与文案主权来源<mccoremem id="01KH41RQB9RK7JAQAX7RFTDDZ5" />。
- 构建期融合：存在数据库时，按统一 Schema 生成 snapshots JSON 并注水 SSR；不存在数据库时，直接以 seeddata 作为回退输出。

**目录职责**
- supabase/migrations
  - 保存表结构与填充脚本，定义“结构化数据”的权威模型与字段命名。
  - 构建期脚本对齐表 Schema，从数据库拉取最新数据用于快照融合。
- src/locales/en/seeddata
  - 一国语言的“可读写种子数据”，对齐 migrations 字段含义；用于无数据库时的初始运行保障。
  - 与 labels 独立；seeddata 专注结构化字段，labels 专注文案与 UI 文本。
- src/data/snapshots
  - 构建期只读 JSON 快照；按 locale 分层，如 src/data/snapshots/en/…。
  - 产物用于 SSR 注水与客户端首屏一致；运行期由 TanStack Query 背景刷新数据库数据并覆盖更丰富字段<mccoremem id="03fkgv35gapq1v559nyzt7287" />。

**loader 读取策略**
- 统一入口读取顺序：优先数据库，失败则读 snapshots，仍无则读 seeddata。
- SSR 路由 loader 使用 ensureQueryData 预取数据并注水到 window.__TANSTACK_ROUTER_CONTEXT__；客户端入口 hydrate 后直接命中缓存<mccoremem id="03fkbd3og5jey8w91q294y6dm" />。
- 链接前缀在渲染时计算，不在常量中写死路径，保持多语言一致性<mccoremem id="01KH3T318QG5DGB1VVPGYVRP1F" />。

**Schema 与融合规则**
- 字段优先级
  - 文案类（title、summary、body、SEO 文案）：content Markdown 优先（frontmatter + 正文）。
  - 结构化类（market_share、price_range、实体关联、媒体）：数据库优先。
- 冲突标记
  - snapshots 增加 metadata：updatedAt、ETag/hash、sourceFlags（db|markdown|seed），便于监控与差异修复。
- 多语言
  - 统一 id/slug；locale 缺失时回退到英文，并在页面渲染时加语言前缀<mccoremem id="01KH41RQB9RK7JAQAX7RFTDDZ5|01KH3T318QG5DGB1VVPGYVRP1F" />。

**构建期管线**
- 快照生成
  - 读取数据库（若存在），输出 JSON 到 src/data/snapshots/<locale>/…。
  - 参考构建链路：[post-build.js](file:///e:/workspace/ct-scanner-compass-directory/scripts/post-build.js) 中的静态生成与站点地图流程，可在“生成静态文件”之前先生成快照。
- SSR/SSG
  - 静态页生成时注入脱水对象 window.__TANSTACK_ROUTER_CONTEXT__，保证首屏数据一致。
  - 参考静态生成实现：[generate-static.mjs](file:///e:/workspace/ct-scanner-compass-directory/scripts/generate-static.mjs)。

**优势**
- 首屏可用与一致性：无论是否有数据库环境，SSR + snapshots 能稳定输出。
- 分工清晰：seeddata 面向作者与种子，snapshots 面向运行时与首屏；labels 保持文案权威。
- SEO 与治理：快照与注水让搜索引擎抓取到完整结构化页面；字段来源明确，便于问题定位。

**注意点**
- Schema 同步：migrations 的表结构变更需要同步快照生成脚本，否则会产生字段偏差。
- 环境变量缺失：构建期无法访问数据库时应优雅降级为 seeddata；并输出合并报告便于观察缺失项。
- 语言与路径：避免在常量中写死路径，始终由渲染时的 addLanguagePrefix 生成<mccoremem id="01KH3T318QG5DGB1VVPGYVRP1F" />。

**文件参考**
- 你的思路说明：[readme.md](file:///e:/workspace/ct-scanner-compass-directory/src/data/readme.md)
- 构建后流程总入口：[post-build.js](file:///e:/workspace/ct-scanner-compass-directory/scripts/post-build.js)
- 静态与注水脚本：[generate-static.mjs](file:///e:/workspace/ct-scanner-compass-directory/scripts/generate-static.mjs)
- 数据来源与类型映射：Supabase hooks 示例 [useSupabaseData.ts](file:///e:/workspace/ct-scanner-compass-directory/src/hooks/useSupabaseData.ts)

**建议的微调**
- 将快照输出路径规范化为 src/data/snapshots/<locale>/…，便于按语言管理与清晰隔离。
- seeddata 与 labels 继续分离；尽量在 seeddata 中不混入 UI 的枚举/常量（这些已迁移到 labels/constants），将其保持为纯“实体数据”。
- 为构建脚本增加“融合报告”（新增/更新/缺失统计），并在 CI 中存档，便于数据质量长期治理。

整体来看，你的重组目标清晰且方向正确：以 seeddata 保障基础、以 snapshots 增强首屏与覆盖、以数据库提供更丰富字段，三者在构建期融合，运行期再由查询层刷新，能兼顾可维护性、稳定性与 SEO 表现。
## 2026-02 更新补充

- locales 下线 `en/data`，文案统一迁移到 `en/labels/data`
- `snapshots` 路径与内容规范：
  - 路径：`src/data/snapshots/<locale>/content/<category>/<slug>.json`
  - 示例：`src/data/snapshots/en/content/stats/global.json`
  - 字段：`labels`（用于 UI 文案）、`metrics`（结构化数值）、`updatedAt`（时间戳）
- loader 回退实现示例（统计数据）：
  - 首选 Supabase 统计
  - 失败时按 `i18n.language` 加载对应 `snapshots/<locale>/content/stats/global.json`
  - 英文为最终兜底
- Markdown 内容与快照：
  - 例如 `content/reports/*` 在构建期生成到 `src/data/snapshots/<locale>/content/reports/*.json`
  - 页面通过 `import.meta.glob` 读取，SSR 首屏与 CSR 一致
