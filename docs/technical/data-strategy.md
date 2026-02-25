# 数据与内容统一策略（JSONB + Domain + Markdown）

## 1. 目标与范围
- 统一结构化数据与非结构化内容的读取与渲染路径
- 建立多语言数据的类型安全与优先级策略
- 规范页面 SEO 元信息的统一来源

## 2. 分层模型
- 常量层：`src/data/constants/` 仅包含键与枚举
- 结构化数据层：数据库（Supabase/PostgreSQL）或 `src/data/production/` 备份
- 本地化层：`src/locales/{lang}/` 负责 UI 文案与标签
- 访问/合并层：Hooks 提供 Domain 对象与 Markdown 合并输出

## 3. 数据库多语言（JSONB translations）
- 模式：实体包含 `translations: Record<LanguageCode, DeepPartial<Entity>>`
- 合并原则：以主实体为权威，当前语言的 translations 覆盖文本字段；深度合并 specifications
- 归一化：对齐 `null → undefined`；避免空值污染
- 读取优先级：`translations[currentLang] → 主实体 → 其他语言（页面回退）`

## 4. Markdown 内容（frontmatter）
- 必备字段：`title`、`description`、`slug`、`category`、`tags`、`seo.{title, description, keywords, canonical, image}`
- 补充字段：`featuresNote`、`specsNote`（用于设备页面模块补充）
- 摘要：`excerpt`，自动生成或来自数据库字段
- 语言回退：当 `zh` 缺失时回退 `en` 内容（已在内容管理器实现）

## 5. 前端消费（Domain Hooks）
- `useManufacturerDomainContent(slug)`
- `useDeviceDomainContent(slug)`
- `useComparisonDomainContent(slug)`
- 输出（视类型而定）：`title`、`description`、`content.htmlContent`、`keywords`、`canonical`、`ogImage`
- 页面统一使用 `SEOHead` 渲染 SEO 字段；结构化数据通过 `structuredData` 传入
- 页面快照（Pages/FAQs）：对于“关于我们 / 隐私 / 条款 / FAQ / 术语”等页面，直接从 `src/data/snapshots/{lang}/pages/*.json` 读取结构化正文（富文本段落、要点、列表等），用于增强 i18n 标签以外的长内容；SEO 仍由 `SEOHead` + 本地化 SEO 配置统一输出

## 6. 页面规范
- ManufacturerDetailPage：优先展示品牌 Markdown 文案；缺省时中文高亮回退
- DeviceDetailPage：
  - 概览：文案优先、结构化兜底
  - Features/Specs Tab：优先 frontmatter 的 `featuresNote/specsNote`，否则回退 `excerpt`；建议长度≤280字、客观中性语气，作为“补充说明”不替代规格
- DeviceComparisonPage（/compare）：基于设备目录 + URL 查询参数（如 `?devices=a,b,c`）渲染对比；默认由 `SEOHead` 输出通用 SEO（无需 slug 化 og 图规则）
- ComparisonDetailPage（/compare/:slug）：当存在专题“对比文章”时，使用 `useComparisonDomainContent`（Markdown）输出 `title/description/keywords/canonical/ogImage`，配合 `SEOHead`
 - SEO 自定义：页面需要完全自定义 SEO 时，在模板传入 `disableSEOHead=true` 并在页面中自行输出 `SEOHead`

### 6.1 Learn / Education / Pricing / Technology / Stats / Reports 路径映射
- Learn（学习中心）：系统化科普与专题合集
  - 路由：`/learn`、`/learn/:slug`
  - 目录：`content/learn/{lang}/:slug.md`
  - 加载：`markdownContentManager.getContent('learn', slug, locale)`
- Education（买方决策导向）：应用型主题与采购相关内容，包含价格页与交互工具
  - 路由：`/education/:topic`
  - 目录：`content/education/{lang}/:topic.md`
  - 加载：`useHybridContent('education', topic, locale)`
- Pricing（隶属 Education 域）：定价内容以 `pricing-*` 命名，统一走 `/pricing`
  - 路由：`/pricing`、`/pricing/:priceType`
  - 目录：`content/education/{lang}/pricing-:priceType.md`
  - 加载：`useHybridContent('education', \`pricing-\${priceType}\`, locale)`
  - 示例：`/pricing/ct-scanner → content/education/en/pricing-ct-scanner.md`
  - i18n 命名空间：使用 `pricing` 顶层命名空间（页面内 `useTranslation('pricing')` + 相对键；跨命名空间用 `ns:key`），不使用 `pages.pricing.*` 前缀
- Technology（技术深度/集合页）
  - 路由：`/technology`（集合页，内容来自 `snapshots/{lang}/pages/technology.json`）/ `/technology/:slug`（Markdown 明细）
  - 集合页快照字段：`hub.title`、`hub.description`、`detail.takeaways`（可选）
- Stats（统计/导航入口）
  - 路由：`/stats/:slug`
  - 目录：`content/stats/{lang}/:slug.md`
  - 加载：`markdownContentManager.getContent('stats', slug, locale)`
- Reports（报告中心）
  - 路由：`/reports`（总览）、`/reports/market`（市场分析）、`/reports/expert`（专家分析）、`/reports/market/:reportId`
  - 目录：`content/reports/{lang}/:slug.md`
  - 加载：列表按 `frontmatter.contentType/reportType` 过滤；详情走 `markdownContentManager.getContent('reports', slug, locale)`

### 6.2 页面快照消费规范
- 路径：`src/data/snapshots/{lang}/pages/*.json` 与 `src/data/snapshots/{lang}/faqs/*.json`
- 适用页面：About、Privacy、Terms、FAQ、Glossary、PremiumReports（营销页）、Technology（集合页）、Suppliers FAQ 等
- 消费方式：页面组件内按语言直接 import；必要时与 i18n 文案合并
- SEO：由 `SEOHead` 与 `getLocalizedSEOConfig` 统一生成；快照不负责 canonical/hreflang

### 6.3 路由别名与 Canonical（营销短链 + 业务归档）
- 规范：营销短链作为 Canonical，业务归档路由作为别名；两者内容一致，避免重复收录
- 示例：`/premium-reports` 为 Canonical（营销落地页），`/reports/premium` 为报告中心别名；head 中将 canonical 指向 `/premium-reports`

说明：Education 的写作角度以买方价值与决策为中心；Learn 侧重知识体系化沉淀。多语言前缀由路由工具自动追加，中文 canonical 统一 `/zh/...` 前缀。

## 7. 兼容与回退
- Markdown：`zh` 缺失 → 自动回退 `en`
- 文案合并：DB 字段优先，frontmatter 兜底
- 规格合并：保持主实体规格为权威，frontmatter 不覆盖规格
 - 比较页封面：`frontmatter.seo.image` 缺失时按规则使用 `/og/comparisons/{slug}.png`，无图则回退占位图
- 页面快照：若 `pages` 快照缺失对应语言，页面回退到英文快照；如英文快照亦缺失，则回退到 i18n 文案（若有）

## 8. 测试与校验
- 单元测试：`pickTextFields` 合并策略与语言归一化
- 集成测试：验证 Markdown zh→en 回退行为被页面正确消费
- 代码质量：`npm run check:syntax`（TypeScript + ESLint）
- 示例内容：`content/devices/en/frontmatter-notes-example.md` 演示 `featuresNote/specsNote`

## 9. 迁移与废弃
- 废弃：`docs/technical/DATA_STRATEGY.md`、`docs/technical/data-management-strategy.md`
- 统一参见本文件，后续规格与实现更新以此为准

## 10. 参考实现
- Hooks：[useDomainContent.ts](file:///e:/workspace/ct-scanner-compass-directory/src/hooks/useDomainContent.ts)
- Device 页面：[DeviceDetailPage.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/pages/DeviceDetailPage.tsx)
- Manufacturer 页面：[ManufacturerDetailPage.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/pages/ManufacturerDetailPage.tsx)
- Comparison 页面：[ComparisonDetailPage.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/pages/ComparisonDetailPage.tsx)
- Markdown 管理器：[markdown.ts](file:///e:/workspace/ct-scanner-compass-directory/src/lib/markdown.ts)

## 11. 业务数据与演进分析

- 数据表（Supabase）
  - manufacturers：结构化主实体，含 translations(JSONB)；字段 name/description/website 等，页面可配合 Markdown 品牌文案
  - devices：结构化主实体，含 translations(JSONB) 与 specifications(JSON)；description 在此为权威；features/specs 细节走结构化；页面可配合 Markdown 的 featuresNote/specsNote 说明
  - customers：客户档案，含 devices 采购记录（联动 customer_devices），结构化为主；展示用文案由 locales 提供
  - customer_devices：客户-设备关联，结构化；作为客户案例数据来源
  - articles：业务内容文章，含 title/content/excerpt 的多语言列（过渡期）；统一以 Markdown 管理为目标，DB 用作缓存或同步来源
  - historical_events：历史事件结构化数据，用于时间线；正文走 Markdown
  - device_reviews（可选）：设备评价数据，用于评分与评论摘要；正文为结构化文本或 Markdown 混合
  - brand_comparisons（计划/可选）：品牌对比结构化信息；当前通过 manufacturers 动态生成
  - content_relationships（计划/可选）：内容关系映射（设备-文章-制造商等）

- 代码数据目录（src/data）
  - production/：早期结构化数据的文件库（JSON/TS），作为备份/本地开发数据源，逐步废弃
  - seed/en/：种子数据与标签，用于本地/初始化
  - snapshots/：内容快照（JSON）与 Markdown 映射的辅助存储，作为过渡期缓存
  - mock/：示例或占位数据（如 authors）
  - 目标：逐步迁移到 DB + Markdown，保留 seed 作为初始化脚本与本地演示

- 字段归属与 Markdown
  - 结构化字段：设备规格、价格区间、制造商官网链接、客户档案、采购记录等
  - Markdown 字段：文章、技术指南、历史、品牌故事、比较文案；设备页的 featuresNote/specsNote 作为“补充说明”，不替代结构化规格
  - SEO frontmatter：统一使用 seo.{title, description, keywords, canonical, image}；comparisons image 缺省按规则生成

- 数据演进策略
  - 多语言统一：所有主实体采用 translations(JSONB)；前端深度合并为 Domain 对象；规范 null→undefined
  - 内容统一：文章/教育/历史/比较等叙述性内容迁移为 Markdown（frontmatter+body）；DB 可作为缓存层或富查询用途
  - 结构化优先：规格/价格/关联关系保留在 DB；Markdown 不覆盖规格，仅提供说明性补充
  - 过渡与淘汰：逐步淘汰 src/data/production 与 snapshots 的直接渲染路径；保留 seed 作为初始化；articles 过渡期的多语言列与 Markdown 并存，最终以 Markdown 为主
  - 统一消费：页面通过 HybridContentTemplate 与 Domain Hooks 合并消费；SEO 统一由 SEOHead 渲染，可按需禁用模板内置 SEO

## 12. 策略更新建议
- 保留 content/education 命名，不新增 content/pricing 目录；维持 pricing→education 别名，确保“业务分类”与“编辑归档”解耦。
- 前端调用可统一以 category='pricing' 进行 Markdown/Hybrid 加载，由别名完成目录映射；现有使用 'education' 亦符合约定，按团队偏好选择其一以保持一致性。
- 构建期增加“Markdown→snapshots”生成步骤，输出至 src/data/snapshots/{locale}/content/{category}/{slug}.json，以提升 SSR 首屏与离线可靠性。
- 下线 src/locales/en/data/mri 与 src/locales/en/data/ct 的设备 seed，设备数据改由数据库与 content/devices Markdown 承载；locales 仅保留 UI 文案职责。
- Pages/FAQs 快照保持：About/Privacy/Terms/FAQ/Glossary/PremiumReports/Technology（集合页）与 Suppliers FAQ 等页面仍以 `snapshots/{lang}/pages|faqs` 为权威编辑来源，后续如迁移到 CMS/DB，可沿用同样的快照生成与回退策略
