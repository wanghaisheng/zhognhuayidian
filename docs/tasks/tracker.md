# 任务追踪

- 创建日期：2026-01-28
- 负责人：项目组
- 状态约定：待办 / 进行中 / 已完成

## 当前任务与状态

1. 修复 i18n 检查脚本的 ESModule 冲突（已完成）
2. 添加“跳过到主内容”可访问性链接与样式（已完成）
3. 配置 Vite manualChunks 拆分大包（已完成）
4. 启用 prerender 构建钩子并加入核心路由（已完成）
5. 路由与图表按需代码分割（已完成）
   - App.tsx: 核心页面与功能模块 lazy 加载
   - DeviceRouter: 内部页面（分类、详情、规格） lazy 加载
   - Dashboard: 图表组件 lazy 加载
6. 迁移中文硬编码到 locales（已完成）
7. 修复 lint 关键错误并在 CI 加入检查（已完成）
8. 添加骨架屏与列表虚拟化（已完成，DeviceCategoryPage/DeviceDetailPage）
9. 建立事件字典与埋点漏斗（已完成，src/lib/analytics/events.ts）
10. 替换首页 Index 的非真实平台数据为 Supabase 实时数据（已完成）
11. 清理 legacy dataManager 引用（已完成，Index/CustomerDetail）
12. DeviceCategoryPage 可访问性增强：aria-live、错误/空态就近提示、焦点管理（已完成）
13. 实施 SSG 预渲染架构（Puppeteer）解决 SEO 空白页问题（已完成）
14. 优化国际化策略：禁用自动跳转，采用 Adobe 风格用户选择（已完成）
15. 修复核心 SEO 问题：语义化 H1、Canonical 标签、移除 Keywords（已完成）
16. 建立统一技术标准文档（Development Standards）并标记旧文档（已完成）
17. 全局修复 TypeScript "Implicit Any" 类型错误（已完成）
18. 增强 E-E-A-T 信任信号：添加隐私政策 (Privacy) 与服务条款 (Terms)（已完成）
19. 优化 SSG 错误处理：生成静态 404.html 供服务端使用（已完成）
20. 优化 LCP 性能：Image 组件支持 fetchPriority 属性（已完成）
21. 完善 Robots.txt：添加 Sitemap 声明（已完成）
22. 补充骨架屏覆盖：CustomerDetail 页面（已完成）
23. 优化表单体验：分步进度，默认值，草稿保存（已完成）
24. 补齐德语（de）本地化残留英文文案（已完成）
25. 修复 MRI 规格页 1.5T 路由 500 错误（已完成）
26. 制造商页面要点改为基于 slug 的品牌 Markdown（已完成）
27. 批量生成目录品牌 Markdown 模板（已完成）
28. 对比页加入 author/publishDate/modified 的结构化元字段（已完成）
29. Key Points 页 SEO 模板补充中文关键词（宽孔径MRI/光子计数CT/光谱CT）（已完成）
30. 统一 PricingPageTemplate 使用 SEOHead（已完成）
31. 补全英文 SEO 配置：pricing 子页（已完成，src/config/seo-en.ts）
32. 新增 pricing 路由切片并注册 `/pricing` 与 `/pricing/:priceType`（已完成）
33. 数据策略补充：明确 Learn 与 Education 的角色区别与 Pricing 映射（已完成）

34. 运行 check-syntax.js 并修复类型/语法错误（已完成）
35. 统一路由 head ctx 签名为 unknown 并内部类型收窄（已完成）
36. 修复 SSR RouterProvider children 类型错误，更新 entry-server 结构（已完成）
37. 修复 guides 页面 og:image 变量缺失（已完成）
38. 调整 Admin 导航路径为已注册路由（已完成）
39. MarkdownPageTemplate 相关链接使用 LangLink，移除 params/search（已完成）
40. manufacturers 路由 frontMatter.image 类型兼容处理（已完成）

41. compare 路由切片接入路由树，注册 `/compare`（已完成，参见 [routerInit.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/lib/routerInit.tsx) 与 [compare.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/lib/routes/slices/compare.tsx)）
42. reports 路由新增 `/reports/premium`，canonical 指向 `/premium-reports`（已完成，参见 [reports.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/lib/routes/slices/reports.tsx) 与 [static.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/lib/routes/slices/static.tsx)）
43. 同步 snapshots→content（英文）：新增 [content/market/en/global.md](file:///e:/workspace/ct-scanner-compass-directory/content/market/en/global.md) 与 [content/market/en/insights.md](file:///e:/workspace/ct-scanner-compass-directory/content/market/en/insights.md)（已完成）
44. 补齐中文内容缺失（zh）：新增 [content/stats/zh/global.md](file:///e:/workspace/ct-scanner-compass-directory/content/stats/zh/global.md)（已完成）
45. 路由与内容变更校验：通过 `npm run lint` 与 `npm run check:syntax`（已完成）

## 2026 优化战略执行 (2026 Optimization Strategy Execution)

### Phase 1: 30 Days (Foundation)
- [x] 全站审计（性能/无障碍/内容）
- [x] 建立设计令牌与主题 (Design Tokens) - `tailwind.config.ts` & `globals.css`
- [x] 关键文案改写 (Review Copywriting)
- [x] 骨架屏 (Skeleton) 与资源优化

### Phase 2: 60 Days (Refinement)
- [x] 核心组件库重构 (Refactor Core Components)
- [ ] 导航与信息架构简化 (Simplify Navigation & IA)
- [ ] 事件字典与埋点上线 (Analytics Implementation)
- [ ] 实验框架接入 (A/B Testing Framework)

### Phase 3: 90 Days (Optimization)
- [ ] 关键流程重设计 (Redesign Key Flows)
- [ ] 国际化完善 (Enhance i18n)
- [ ] 数据驱动迭代 (Data-Driven Iteration)
- [ ] 性能预算固化 (Enforce Performance Budgets)

### 可落地执行清单 (Actionable Checklist)
- [x] **UI 规范**：Button/Input/Card 变体 ≤ 4 种。
- [x] **排版布局**：主色对比度 ≥ 4.5:1，正文 ≥ 16px，行高 ≥ 1.5，8px 间距系统。
- [x] **性能加载**：列表/图片懒加载，虚拟列表，骨架屏覆盖主要页面。
- [x] **错误处理**：人话报错 + 一键重试/恢复。
- [x] **表单体验**：分步进度，默认值，草稿保存。
- [x] **埋点规范**：查看/交互/提交/错误四类归档。
- [x] **面包屑统一**：合并分散的 Breadcrumb 组件为 Shadcn UI 标准组件。
- [x] **SEO Schema**：补充首页 Breadcrumb Schema。

## 变更验证

- 构建与预览：npm run build / npm run preview
- 预渲染：npm run prerender
- 国际化检查：npm run i18n:check
- 语法与类型检查：npm run check:syntax
- 检查结果：TypeScript/ESLint 全通过（2026-02-14）
- 体积与分块：构建日志与 dist/ 产物

## 备注

- 本文件用于阶段性追踪与对齐，完成后在此更新状态

## 硬编码迁移矩阵

| 页面/组件 | 路径 | 硬编码类型 | 状态 |
| --- | --- | --- | --- |
| MarketAnalysisDetail | [MarketAnalysisDetail.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/pages/MarketAnalysisDetail.tsx) | 中文文案、公司名称 | 已完成 |
| CustomerDetail | [CustomerDetail.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/pages/CustomerDetail.tsx) | 中文文案 | 已完成 |
| DeviceComparison 页面 | [DeviceComparisonPage.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/pages/DeviceComparisonPage.tsx) | 中文文案 | 已完成 |
| DeviceComparison 组件 | [DeviceComparison.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/components/DeviceComparison.tsx) | 中文文案 | 已完成 |
| ExpertAnalysis | [ExpertAnalysis.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/pages/ExpertAnalysis.tsx) | 中文文案 | 已完成 |
| DynamicPricingPage | [DynamicPricingPage.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/pages/DynamicPricingPage.tsx) | 中文文案、价格标签 | 已完成 |
| InquiryForm | [InquiryForm.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/components/InquiryForm.tsx) | 中文表单提示 | 已完成 |
| DeviceSpecifications | [DeviceSpecifications.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/components/organisms/DeviceSpecifications.tsx) | 中文规格名称 | 已完成 |
| Pricing 价格计算器（容器） | [PriceCalculator.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/components/organisms/PriceCalculator.tsx) | 金额单位“K/M”展示、摘要 | 已完成 |
| Pricing 价格计算器（表单） | [PriceCalculatorForm.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/components/molecules/PriceCalculatorForm.tsx) | 规格/制造商选项 | 已完成 |
| Pricing 价格范围卡片 | [PriceRangeCard.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/components/molecules/PriceRangeCard.tsx) | 规格名称（如 64-slice） | 已完成 |
| Comparison 表格 | [ComparisonTable.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/components/organisms/ComparisonTable.tsx) | 英文价格区间、英文括号全称 | 已完成 |
| 品牌对比模板 | [BrandComparisonTemplate.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/components/templates/BrandComparisonTemplate.tsx) | 英文标题/段落 | 已完成 |
| Pricing 页面模板 | [PricingPageTemplate.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/components/templates/PricingPageTemplate.tsx) | 英文段落/标签 | 已完成 |

## 多语言文件改写矩阵（i18n Rewrite Matrix）

> 目标：跟踪需改写的多语言文件（Data/Labels），统一使用 data.customer.* 等数据命名空间，补齐非英文语言的真实文案。

### 1. 核心标签 (Labels - Core)

| 模块 | 文件 | 语言 (zh) | 状态 | 优先级 |
| --- | --- | --- | --- | --- |
| Common | [common/index.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/common/index.ts) | zh | **已完成** | P0 |
| Navigation | [navigation/index.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/navigation/index.ts) | zh | **已完成** | P0 |
| Footer | [footer.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/footer.ts) | zh | **已完成** | P0 |
| Breadcrumb | [breadcrumb.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/breadcrumb.ts) | zh | **已完成** | P1 |
| SEO | [seo.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/seo.ts) | zh | **已完成** | P1 |
| Site | [site.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/site.ts) | zh | **已完成** | P1 |

### 2. 页面标签 (Labels - Pages)

| 页面 | 文件 | 语言 (zh) | 状态 | 优先级 |
| --- | --- | --- | --- | --- |
| Home | [home.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/home.ts) | zh | **已完成** | P0 |
| Devices List | [devices.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/devices.ts) | zh | **已完成** | P0 |
| Device Detail | [deviceDetail.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/deviceDetail.ts) | zh | **已完成** | P0 |
| Manufacturers | [manufacturers.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/manufacturers.ts) | zh | **已完成** | P1 |
| Customers | [customers.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/customers.ts) | zh | **已完成** | - |
| Customer Detail | [customerDetail.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/customerDetail.ts) | zh | **已完成** | P1 |
| About | [about.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/about.ts) | zh | **已完成** | P2 |
| Contact | [contact.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/contact.ts) | zh | **已完成** | P2 |
| Pricing | [pricing.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/pricing.ts) | zh | **已完成** | P1 |
| Comparison | [comparison.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/comparison.ts) | zh | **已完成** | P1 |
| Resource Center | [resourceCenter.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/resourceCenter.ts) | zh | **已完成** | P2 |
| Inquiry Form (Component) | [inquiryForm.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/components/inquiryForm.ts) | zh | **已完成** | P1 |

### 3. 数据字典 (Data - Dictionaries)

| 模块 | 文件 | 语言 (zh) | 状态 | 优先级 |
| --- | --- | --- | --- | --- |
| Customer Data | [customer.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/data/customer.ts) | zh | **已完成** | - |
| Manufacturers | [manufacturers/index.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/data/manufacturers/index.ts) | zh | **已完成** | P1 |
| CT Products | [ct/index.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/data/ct/index.ts) | zh | **已完成** | P2 |
| MRI Products | [mri/index.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/data/mri/index.ts) | zh | **已完成** | P2 |
| Market Data | [market/index.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/data/market/index.ts) | zh | **已完成** | P2 |

| 模块/命名空间 | 文件 | 语言 | 状态 | 备注 |
| --- | --- | --- | --- | --- |
| Data / customer | [customer.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/en/data/customer.ts) | en | 已完成 | 基线数据源（供其它语言继承） |
| Data / customer | [customer.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/data/customer.ts) | zh | 已完成 | 统一为中文字典（类型/规模/等级） |
| Data / customer | [customer.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/de/data/customer.ts) | de | 已完成 | 与业务优先级同步推进 |
| Data / customer | [customer.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/pt/data/customer.ts) | pt | 已完成 | 与业务优先级同步推进 |
| Labels / customers | [customers.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/customers.ts) | zh | 已完成 | 列表/统计/筛选文案中文化 |
| Labels / customerDetail | [customerDetail.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/customerDetail.ts) | zh | **已完成** | 中文化客户详情页面标签 |
| Data / navigation | [navigation.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/data/navigation.ts) | zh | 已完成 | 已在 `localeResources` 合并覆盖 |
| Data / footer | [footer.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/data/footer.ts) | zh | 已完成 | 已在 `localeResources` 合并覆盖 |
| Labels / devices | [devices.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/devices.ts) | zh | **已完成** | 中文化设备列表页面标签 |
| Labels / deviceDetail | [deviceDetail.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/deviceDetail.ts) | zh | **已完成** | 中文化设备详情页面标签 |
| Labels / pricing | [pricing.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/pricing.ts) | zh | **已完成** | 中文化价格页面标签 |
| Labels / manufacturers | [manufacturers.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/manufacturers.ts) | zh | **已完成** | 中文化制造商页面标签 |
| Labels / marketAnalysis | [marketAnalysis.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/marketAnalysis.ts) | zh | **已完成** | 中文化市场分析页面标签 |
| Labels / marketAnalysisDetail | [marketAnalysisDetail.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/marketAnalysisDetail.ts) | zh | **已完成** | 中文化市场分析详情标签 |
| Labels / resourceCenter | [resourceCenter.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/resourceCenter.ts) | zh | **已完成** | 英文占位，需中文文案 |
| Labels / technology | [technology.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/technology.ts) | zh | **已完成** | 中文化技术标签 |
| Labels / glossary | [glossary.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/glossary.ts) | zh | **已完成** | 中文化术语标签 |
| Labels / faq | [faq.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/faq.ts) | zh | **已完成** | 中文化 FAQ 标签 |
| Labels / about | [about.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/about.ts) | zh | **已完成** | 英文占位，需中文文案 |
| Labels / home | [home.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/home.ts) | zh | **已完成** | 中文化首页标签 |
| Labels / tags | [tags.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/tags.ts) | zh | **已完成** | 中文化标签页面文案 |
| Labels / seo-landing | [seo-landing.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/seo-landing.ts) | zh | **已完成** | 中文化 SEO 落地页标签 |
| Labels / education | [education.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/education.ts) | zh | **已完成** | 中文化教育页面标签 |
| Labels / education | [education.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/education.ts) | zh | **已完成** | 中文化教育标签 |
| Labels / guides | [guides.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/guides.ts) | zh | **已完成** | 中文化指南页面标签 |
| Labels / history | [history.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/history.ts) | zh | **已完成** | 中文化历史页面标签 |
| Labels / historyDetail | [historyDetail.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/historyDetail.ts) | zh | **已完成** | 中文化历史详情页面标签 |
| Labels / admin | [admin.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/admin.ts) | zh | **已完成** | 中文化后台管理页面标签 |
| Labels / contact | [contact.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/contact.ts) | zh | **已完成** | 中文化联系我们页面标签 |
| Labels / privacy | [privacy.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/privacy.ts) | zh | **已完成** | 中文化隐私政策页面标签 |
| Labels / terms | [terms.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/terms.ts) | zh | **已完成** | 中文化服务条款页面标签 |
| Labels / dashboard | [dashboard.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/dashboard.ts) | zh | **已完成** | 中文化仪表盘页面标签 |
| Labels / deviceSpecification | [deviceSpecification.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/deviceSpecification.ts) | zh | **已完成** | 中文化设备规格页面标签 |
| Labels / deviceComparison | [deviceComparison.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/deviceComparison.ts) | zh | **已完成** | 中文化设备对比页面标签 |
| Labels / blog | [blog.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/blog.ts) | zh | **已完成** | 英文占位，需中文文案 |
| Labels / learn | [learn.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/learn.ts) | zh | **已完成** | 中文化学习中心标签 |
| Labels / premiumReports | [premiumReports.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/premiumReports.ts) | zh | **已完成** | 中文化高级报告页面标签 |
| Labels / contentManagement | [contentManagement.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/contentManagement.ts) | zh | **已完成** | 中文化内容管理页面标签 |
| Labels / translationTest | [translationTest.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/translationTest.ts) | zh | **已完成** | 中文化测试页面标签 |
| Labels / iconValidation | [iconValidation.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/iconValidation.ts) | zh | **已完成** | 中文化图标校验页面标签 |

### 德语（de）本地化任务（参考 zh 实现）

#### 核心标签 (Labels - Core)

| 模块 | 文件 | 语言 (de) | 状态 | 优先级 |
| --- | --- | --- | --- | --- |
| Common | [common/index.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/de/labels/common/index.ts) | de | 已完成 | P0 |
| Navigation | [navigation/index.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/de/labels/navigation/index.ts) | de | 已完成 | P0 |
| Footer | [footer.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/de/labels/footer.ts) | de | 已完成 | P0 |
| Breadcrumb | [breadcrumb.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/de/labels/breadcrumb.ts) | de | 已完成 | P1 |
| SEO | [seo.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/de/labels/seo.ts) | de | 已完成 | P1 |
| Site | [site.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/de/labels/site.ts) | de | 已完成 | P1 |

#### 页面标签 (Labels - Pages)

| 页面 | 文件 | 语言 (de) | 状态 | 优先级 |
| --- | --- | --- | --- | --- |
| Home | [home.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/de/labels/pages/home.ts) | de | 已完成 | P0 |
| Devices List | [devices.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/de/labels/pages/devices.ts) | de | 已完成 | P0 |
| Device Detail | [deviceDetail.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/de/labels/pages/deviceDetail.ts) | de | 已完成 | P0 |
| Manufacturers | [manufacturers.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/de/labels/pages/manufacturers.ts) | de | 已完成 | P1 |
| Customers | [customers.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/de/labels/pages/customers.ts) | de | 已完成 | - |
| Customer Detail | [customerDetail.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/de/labels/pages/customerDetail.ts) | de | 已完成 | P1 |
| About | [about.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/de/labels/pages/about.ts) | de | 已完成 | P2 |
| Contact | [contact.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/de/labels/pages/contact.ts) | de | 已完成 | P2 |
| Pricing | [pricing.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/de/labels/pages/pricing.ts) | de | 已完成 | P1 |
| Comparison | [comparison.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/de/labels/pages/comparison.ts) | de | 已完成 | P1 |
| Resource Center | [resourceCenter.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/de/labels/pages/resourceCenter.ts) | de | 已完成 | P2 |
| Inquiry Form (Component) | [inquiryForm.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/de/labels/components/inquiryForm.ts) | de | 已完成 | P1 |
| Learn | [learn.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/de/labels/pages/learn.ts) | de | 已完成 | P2 |
| Premium Reports | [premiumReports.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/de/labels/pages/premiumReports.ts) | de | 已完成 | P2 |
| Market Analysis Detail | [marketAnalysisDetail.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/de/labels/pages/marketAnalysisDetail.ts) | de | 已完成 | P2 |
| Guides | [guides.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/de/labels/pages/guides.ts) | de | 已完成 | P2 |
| Tags | [tags.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/de/labels/pages/tags.ts) | de | 已完成 | P2 |
| SEO Landing | [seo-landing.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/de/labels/pages/seo-landing.ts) | de | 已完成 | P2 |

#### 数据字典 (Data - Dictionaries)

| 模块 | 文件 | 语言 (de) | 状态 | 备注 |
| --- | --- | --- | --- | --- |
| Customer Data | [customer.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/de/data/customer.ts) | de | 已完成 | 与业务优先级同步推进 |
| Navigation | [navigation.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/de/data/navigation.ts) | de | 已完成 | 已在 `localeResources` 合并覆盖 |
| Footer | [footer.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/de/data/footer.ts) | de | 已完成 | 已在 `localeResources` 合并覆盖 |
| Admin | [admin.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/de/data/admin.ts) | de | 已完成 | - |
| Comparison | [comparison.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/de/data/comparison.ts) | de | 已完成 | - |
| Education | [education.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/de/data/education.ts) | de | 已完成 | - |
| Export | [export.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/de/data/export.ts) | de | 已完成 | - |
| Inquiry | [inquiry.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/de/data/inquiry.ts) | de | 已完成 | - |
| GuideFaqs | [guideFaqs.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/de/data/guideFaqs.ts) | de | 已完成 | - |
| SEO | [seo.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/de/data/seo.ts) | de | 已完成 | - |
| Stats | [stats.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/de/data/stats.ts) | de | 已完成 | - |

### 葡萄牙语（pt）本地化任务（参考 zh 实现）

#### 核心标签 (Labels - Core)

| 模块 | 文件 | 语言 (pt) | 状态 | 优先级 | 备注 |
| --- | --- | --- | --- | --- | --- |
| Common | [common/index.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/pt/labels/common/index.ts) | pt | 已完成 | P0 | - |
| Navigation | [navigation/index.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/pt/labels/navigation/index.ts) | pt | 已完成 | P0 | - |
| Footer | [footer.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/pt/labels/footer.ts) | pt | 已完成 | P0 | - |
| Breadcrumb | [breadcrumb.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/pt/labels/breadcrumb.ts) | pt | 已完成 | P1 | - |
| SEO | [seo.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/pt/labels/seo.ts) | pt | 已完成 | P1 | - |
| Site | [site.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/pt/labels/site.ts) | pt | 已完成 | P1 | - |

#### 页面标签 (Labels - Pages)

| 页面 | 文件 | 语言 (pt) | 状态 | 优先级 | 备注 |
| --- | --- | --- | --- | --- | --- |
| Home | [home.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/pt/labels/pages/home.ts) | pt | 已完成 | P0 | - |
| About | [about.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/pt/labels/pages/about.ts) | pt | 已完成 | P1 | - |
| Technology | [technology.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/pt/labels/pages/technology.ts) | pt | 已完成 | P1 | - |
| SEO Landing | [seo-landing.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/pt/labels/pages/seo-landing.ts) | pt | 已完成 | P1 | - |
| Pricing | [pricing.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/pt/labels/pages/pricing.ts) | pt | 已完成 | P1 | - |
| Comparison | [comparison.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/pt/labels/pages/comparison.ts) | pt | 已完成 | P1 | - |
| Device Comparison | [deviceComparison.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/pt/labels/pages/deviceComparison.ts) | pt | 已完成 | P1 | - |
| Resource Center | [resourceCenter.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/pt/labels/pages/resourceCenter.ts) | pt | 已完成 | P2 | - |
| Glossary | [glossary.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/pt/labels/pages/glossary.ts) | pt | 已完成 | P2 | - |
| Learn | [learn.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/pt/labels/pages/learn.ts) | pt | 已完成 | P2 | - |
| Premium Reports | [premiumReports.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/pt/labels/pages/premiumReports.ts) | pt | 已完成 | P2 | - |
| Privacy | [privacy.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/pt/labels/pages/privacy.ts) | pt | 已完成 | P1 | - |
| Terms | [terms.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/pt/labels/pages/terms.ts) | pt | 已完成 | P1 | - |
| Dashboard | [dashboard.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/pt/labels/pages/dashboard.ts) | pt | 已完成 | P2 | - |
| Admin | [admin.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/pt/labels/pages/admin.ts) | pt | 已完成 | P2 | - |
| Device Detail | [deviceDetail.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/pt/labels/pages/deviceDetail.ts) | pt | 已完成 | P2 | - |
| History | [history.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/pt/labels/pages/history.ts) | pt | 已完成 | P2 | - |
| History Detail | [historyDetail.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/pt/labels/pages/historyDetail.ts) | pt | 已完成 | P2 | - |
| Icon Validation | [iconValidation.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/pt/labels/pages/iconValidation.ts) | pt | 已完成 | P3 | - |

#### 数据字典 (Data - Dictionaries)

| 模块 | 文件 | 语言 (pt) | 状态 | 备注 |
| --- | --- | --- | --- | --- |
| Customer Data | [customer.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/pt/data/customer.ts) | pt | 已完成 | 与业务优先级同步推进 |
| SEO | [seo.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/pt/data/seo.ts) | pt | 已完成 | - |

> 注：已抽检并修正 pt 目录下部分 labels/pages 与 data（customers、market/stats 等）残留英文/中文。

### Data 目录需改写（zh 英文占位）
| 模块/命名空间 | 文件 | 语言 | 状态 | 备注 |
| --- | --- | --- | --- | --- |
| Data / admin | [admin.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/data/admin.ts) | zh | **已完成** | 中文化导航字典 |
| Data / comparison | [comparison.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/data/comparison.ts) | zh | **已完成** | 中文化对比字典 |
| Data / education | [education.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/data/education.ts) | zh | **已完成** | 中文化教育科普字典 |
| Data / export | [export.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/data/export.ts) | zh | **已完成** | 中文化出口服务字典 |
| Data / inquiry | [inquiry.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/data/inquiry.ts) | zh | **已完成** | 中文化预算与时间字典 |
| Data / guideFaqs | [guideFaqs.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/data/guideFaqs.ts) | zh | **已完成** | 中文化常见问答字典 |
| Data / seo | [seo.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/data/seo.ts) | zh | **已完成** | 中文化 SEO 模板字典 |
| Data / stats | [stats.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/data/stats.ts) | zh | **已完成** | 中文化统计字典 |

> 注：设备/制造商数据量较大（ct/mri/manufacturers 目录），按批次推进，不逐文件列出

### 说明
- 支持语言列表：en / zh / de / pt（参考 [locales/index.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/index.ts) SUPPORTED_LOCALES）
- Data 命名空间用于结构化字典数据；页面可见文案在 Labels 命名空间
 - 优先完成 zh 的 Data/Labels 真实中文翻译，其它语言按市场优先级推进

## 内容计划（GSC 驱动）

- 数据来源：
  - 查询榜单（2026-01-31）：[查询数.csv](file:///e:/workspace/ct-scanner-compass-directory/data/chinactscanner.org-Performance-on-Search-2026-01-31/%E6%9F%A5%E8%AF%A2%E6%95%B0.csv)
  - 网页表现（2026-01-31）：[网页.csv](file:///e:/workspace/ct-scanner-compass-directory/data/chinactscanner.org-Performance-on-Search-2026-01-31/%E7%BD%91%E9%A1%B5.csv)
  - 总结与建议（2026-01-06）：[analysis.md](file:///e:/workspace/ct-scanner-compass-directory/data/chinactscanner.org-Performance-on-Search-2026-01-06/analysis.md)

### 策略对齐
- 目标聚焦 MOFU/BOFU 商业意图词（Manufacturer / Price / Supplier / Buy），减少历史类 TOFU 内容投入
- 标题与元描述采用采购语气与明确 CTA，匹配地区语言习惯（参考 Humanizer-zh）
- 加强 E-E-A-T：作者介绍、数据来源、更新日期、联系方式与可验证引用
- 页面技术增强：FAQ/Breadcrumb/Article Schema，表格结构化，内链至询价/对比页

### 任务清单（待办）
- 创建“中国 CT 厂商与价格总览”落地页（英文，采购导向）
- 创建“中国 MRI 厂商与价格总览”落地页（英文，采购导向）
- 品牌目录专题页：联影/东软/安科/明峰/长峰（各 1 页）
- 对比页：64/128/256-slice CT 价格与规格（按场景与预算）
- 对比页：1.5T vs 3T MRI（宽孔径 vs 常规）
- 采购 FAQ：如何识别低故障率与高可靠性品牌（含来源与质保）
- 德语着陆页：China CT/MRI Hersteller & Preise（简版，复用现有 de 资源）
- 首页与目录页 CTR 提升：标题/摘要改写为采购语气 + 增强摘要块
- 高曝光零点击词对应页面的 Title/Meta 改写（china closed mri machine / china 3t mri / chinese ct manufacturers / wholesale large-scale ct）
- 为“国内 CT 市场之争”文章添加结构化摘要与品牌对比区块（链接至品牌页）
- 添加 E-E-A-T 信号：作者卡片、引用区、更新时间与联系 CTA
- 人性化写作审校（Humanizer-zh 清单执行）

### 近期完成
- 规格 Learn 招标参数清单（CT/MRI/DR，en/zh）：`/learn/ct-64-slice-specifications`、`/learn/ct-128-slice-specifications`、`/learn/ct-256-slice-specifications`、`/learn/mri-1-5t-specifications`、`/learn/mri-3t-specifications`、`/learn/mri-5t-specifications`、`/learn/mri-7t-specifications`、`/learn/bedside-dr-specifications`（状态以 [content-plan-gsc-matrix.md](file:///e:/workspace/ct-scanner-compass-directory/docs/tasks/content-plan-gsc-matrix.md) 为准）

### 内容日历（草案）

| 主题/标题 | 主要关键词 | 漏斗阶段 | 内容类型 | 负责人 | 状态 | 截止日期 | 目标URL | 备注 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 中国 CT 厂商与价格总览 | `chinese ct scanner manufacturers` | BOFU | 落地页 | 项目组 | 已完成 | 2026-02-10 | `/pricing/ct-scanner` | 已上线：en/zh/de 内容与 FAQ Schema |
| 中国 MRI 厂商与价格总览 | `china 3t mri machine` | BOFU | 落地页 | 项目组 | 已完成 | 2026-02-12 | `/pricing/mri-scanner` | 已上线：en/zh/de 内容与 FAQ Schema |
| 64/128/256-slice CT 对比 | `ct scanner manufacturers` | MOFU | 对比页 | 项目组 | 待办 | 2026-02-16 | `/compare/ct-slice` | 场景化预算建议 |
| 1.5T vs 3T MRI | `wide bore mri` | MOFU | 对比页 | 项目组 | 待办 | 2026-02-18 | `/compare/mri-1-5t-vs-3t` | 宽孔径/成像质量/成本 |
| 品牌页：联影 | `united imaging medical` | BOFU | 品牌页 | 项目组 | 待办 | 2026-02-20 | `/manufacturers/united-imaging` | 优缺点/维保/案例 |
| 品牌页：东软 | `neusoft ct` | BOFU | 品牌页 | 项目组 | 待办 | 2026-02-22 | `/manufacturers/neusoft` | 型号矩阵与价格带 |
| 德语着陆页（简版） | `ct hersteller` | MOFU | 落地页 | 项目组 | 已完成 | 2026-02-24 | `/pricing/ct-scanner` | 已上线：de 版本（统一路由，无语言前缀） |

### 页面大纲（首批）

- /pricing/ct-scanner
  - 标题与导语：采购导向标题 + 简短市场趋势
  - 价格区间表：16/32/64/128/256-slice（最低/最高/均值）
  - 价格计算器：规格/制造商/新旧/地区参数可调
  - FAQ：采购流程、质保、备件、装机与培训
  - 相关链接：/pricing/mri-scanner、/devices/ct-scanners、/compare/ct-scanners
  - Schema：Product + AggregateOffer；页面面包屑与组织信息
  - CTA：咨询报价、浏览设备

- /pricing/mri-scanner
  - 标题与导语：1.5T/3T 与宽孔径的选择建议
  - 价格区间表：0.5T/1.5T/3T（最低/最高/均值）
  - 价格计算器：场景/制造商/新旧/地区参数可调
  - FAQ：磁体维护、冷头周期、场地改造与屏蔽
  - 相关链接：/pricing/ct-scanner、/devices/mri-scanners、/compare/mri-scanners
  - Schema：Product + AggregateOffer；FAQPage
  - CTA：咨询报价、浏览设备

- /manufacturers/united-imaging、/manufacturers/neusoft
  - 品牌概览：定位与主力机型矩阵
  - 价格带：典型型号的价格区间与适用场景
  - 服务与维保：备件、响应、培训
  - 案例与资质：装机示例与认证
  - 相关对比：联影 vs 东软、型号对比
  - CTA：联系与询价

### 改写规则（Title/Meta 模板）
- 标题规则：≤ 60 字，采购语气，包含品牌/品类/规格/意图
- 元描述：≤ 160 字，给出价格范围与明确 CTA
- 模板示例：
  - 标题：`中国 {品牌} {规格} CT 价格与供应 | 即刻询价`
  - 描述：`{品牌}{型号} {slice} CT 价格区间 ¥{min}–¥{max}。含质保/备件/装机与培训，提交需求获取准确报价。`
- 结构与词序遵循本地语言习惯（en/zh/de/pt），避免堆叠关键词

### 结构化数据（Schema）清单
- BreadcrumbList：所有着陆与详情页
- FAQPage：价格/采购流程/维保问答
- Product + AggregateOffer：价格区间与可选规格
- Organization：品牌页包含联系方式与资质
- Article：长文加作者/发布日期/引用来源

### 内部链接策略
- BOFU 页链接到：询价表单、设备列表、品牌页、对比页
- 章节内插入 2–3 个语义锚文本链接，避免“点击这里”
- 品牌页互链“对比页”与“典型型号”，形成小型主题簇
- 高曝光词对应页互链首页与目录页，提升抓取与 CTR

### E-E-A-T 强化清单
- 作者卡片：真实姓名/头衔/照片/过往资质
- 数据来源：价格/可靠性引用可验证出处（含日期）
- 更新标识：最后更新日期 + 变更摘要
- 联系方式：电话/邮箱/表单与响应 SLA
- 编辑原则：披露方法与采样范围（可在页尾）

### Humanizer-zh 审校清单
- 直述句，短句优先；避免夸张形容与行业黑话
- 首次出现术语给出简短定义或链接
- 使用读者第二人称与明确动作指令（提交、对比、选择）
- 表格与要点化呈现，减少长段落
- 数字与单位统一格式（slice/T/万元）

### 零点击词处置
- 为高展示低点击查询新增“快速答案”段落与 FAQ
- 改写标题/Meta，更贴合查询意图与地区习惯
- 若现有页主题不匹配，创建专属着陆页承接该查询
- 在首页/目录页增加增强摘要块，覆盖这些查询

### 观察指标与迭代
- 主要指标：CTR、平均排名、有效点击、询价转化率
- 辅助指标：覆盖查询数量、页面收录与抓取频次
- 迭代节奏：每两周复盘 GSC 与埋点漏斗，更新内容日历
- A/B 验证：标题/摘要与 CTA 文案做小流量实验

### 内容日历（第二批）

| 主题/标题 | 主要关键词 | 漏斗阶段 | 内容类型 | 负责人 | 状态 | 截止日期 | 目标URL | 备注 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 采购 FAQ：可靠性与维保 | `ct scanner reliability` | MOFU | FAQ | 项目组 | 待办 | 2026-02-26 | `/faq/procurement-reliability` | 故障率/质保/备件/服务响应 |
| 品牌页：安科 | `anke ct price` | BOFU | 品牌页 | 项目组 | 待办 | 2026-02-28 | `/manufacturers/anke` | 价格带与售后 |
| 品牌页：明峰 | `minfound mri` | BOFU | 品牌页 | 项目组 | 待办 | 2026-03-02 | `/manufacturers/minfound` | 机型矩阵与案例 |
| 品牌页：长峰 | `chf ct` | BOFU | 品牌页 | 项目组 | 待办 | 2026-03-04 | `/manufacturers/chf` | 维保与资质 |
| 首页/目录 CTR 提升 | `ct scanner manufacturers` | TOFU/MOFU | 改写 | 项目组 | 待办 | 2026-03-06 | `/` `/devices/ct-scanners` | 采购语气标题与摘要块 |
| 零点击查询专页 | `wholesale large-scale ct` | BOFU | 落地页 | 项目组 | 待办 | 2026-03-08 | `/pricing/ct-wholesale` | 快速答案 + FAQ |
| 文章结构化更新 | `china ct market` | TOFU/MOFU | 长文改版 | 项目组 | 待办 | 2026-03-10 | `/articles/china-ct-market-battle` | 摘要与品牌对比区块 |

### 页面大纲（第二批）

- /compare/ct-slice
  - 导语：按场景/预算选择 64/128/256-slice
  - 规格对比表：成像速度/辐射/占地/功耗/价格
  - 场景建议：急诊/常规体检/大型三甲/科研
  - 预算建议：采购/维保/耗材估算
  - CTA：选择预算/询价 + 链接设备列表

- /compare/mri-1-5t-vs-3t
  - 导语：成像质量/扫描时间/宽孔径舒适度
  - 对比表：磁体/梯度/线圈兼容/冷头周期/价格
  - 场景建议：神经/肌骨/腹部/儿科
  - 总结与建议 + CTA：提交需求获取报价

- /faq/procurement-reliability
  - 问答主题：可靠性评估/质保范围/备件供给/服务响应
  - 证据与来源：维保合同样例/第三方报告引用
  - 内链：品牌页与价格页
  - Schema：FAQPage

- /articles/china-ct-market-battle
  - 结构化摘要：市场格局与趋势要点
  - 品牌对比区块：优势/劣势/适用场景
  - 引用与数据：时间戳与出处
  - CTA：跳转品牌页/询价表单

## 新增 P0 任务：TanStack Hooks 优化拆解
1. 路由 loader 迁移关键数据（设备/厂商/文章/客户）（P0）— 进行中
2. 为领域定义 queryOptions 并用 useSuspenseQuery 替代 useEffect/useState（P0）— 待办
3. 统一 SSR 脱水/水合：Router 集成 QueryClient dehydrate/hydrate（P0）— 待办
4. 统一 queryKey 命名（列表/详情/关联：如 ['devices'] / ['device', slug] / ['devicesByManufacturer', id]）（P0）— 待办
5. 类型收敛与移除 any（领域类型与 translations 使用 Record<string, unknown>）（P0）— 进行中
6. 重构 useMarkdownContent：路由 loader 预置 + Query 读取，移除 window 访问（P0）— 待办
7. 重构 useStats/useRecommendations/useComparison 为 Query 驱动并接入错误边界（P0）— 待办
8. 在 routes/slices 中维护对应 loaders 与多语言适配的重定向（P0）— 待办

## Q1 内容策略未完成项（追加）
- 更新 ct-scanner-invention.md：补 FAQPage 结构化与作者/引用 — 待办
- 更新 ct-scanner-invention.md：补 FAQPage 结构化与作者/引用 — 已完成
- 重构 global-ct-mri-manufacturers.md：Top 10 榜单（ItemList + Manufacturer）— 待办
- 重构 global-ct-mri-manufacturers.md：Top 10 榜单（ItemList + Manufacturer）— 已完成
- 新建 china-medical-imaging-market-report-2026.md — 待办
- 新增/重构内容统一接入 Article/FAQ 结构化数据 — 已完成
- 对比页分类化与 canonical/translations：64‑vs‑128、128‑vs‑256、siemens‑vs‑ge、united‑imaging‑vs‑neusoft — 已完成（en/zh 与 canonical 同步）
- 建立 MRI 场强聚合页：/devices/mri-scanners/3t — 已完成
- 定价页内容迁移：将 pricing-philips-incisive-ct.md 迁至 content/education/en/pricing-*；新增 pricing-united-imaging-uct-528.md — 已完成
- 新增 zh 定价页：Incisive 与 uCT‑528 — 已完成
- 创建供应商 FAQ 聚合页（面向 “ct scan suppliers” 查询）— 已完成
- 制造商目录页升级：统一校验 Manufacturer + Product 列表结构化数据 — 待办
- 草稿发布：Incisive vs Canon 与 MRI 宽孔径专题，并接入结构化数据 — 待办
- 草稿发布：Incisive vs Canon 与 MRI 宽孔径专题，并接入结构化数据 — 已完成

### 进度更新（新增）
- 供应商 FAQ 聚合页（/learn/suppliers-faq）：已完成（en/zh，含 FAQPage 结构化）
- MRI 3T 聚合页（/learn/mri-3t-aggregation）：已完成（en/zh，含 FAQ 结构化）
- 定价页结构化数据：Incisive 与 uCT‑528 已接入 frontmatter FAQs（FAQPage）
- 为主要比较与价格页补充 Product/Offer 结构化（Incisive/uCT‑528 已接入）— 已完成
 
 ## 2026-02-12 结构化数据职责边界清理（新增）
 - 删除 locales 中冗余 SEO 模板（seo.ts），以 Markdown frontmatter 与 src/config/seo-en.ts 为准 — 已完成
 - 动态站点地图改用快照数据源：从 snapshots 读取设备/制造商，修复类型与未知设备报错 — 已完成（[generate-dynamic-sitemap.ts](file:///e:/workspace/ct-scanner-compass-directory/scripts/generate-dynamic-sitemap.ts)）
 - 导航结构迁移到配置并更新引用 — 已完成（[siteNavigation.ts](file:///e:/workspace/ct-scanner-compass-directory/src/config/siteNavigation.ts)）
 - stats 文案与数据职责分离：labels 留在 locales，数据迁至 snapshots；更新入口引用 — 已完成（[locales/en/index.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/en/index.ts)、[locales/zh/index.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/index.ts)、[global.json](file:///e:/workspace/ct-scanner-compass-directory/src/data/snapshots/en/content/stats/global.json)）
 - 常量与枚举集中：迁移到 src/config/constants.ts 并全量更新引用 — 已完成（[constants.ts](file:///e:/workspace/ct-scanner-compass-directory/src/config/constants.ts)）
 - 指南页面结构化：Related/QuickLinks 迁至配置，页面用 t 渲染文案 — 已完成（[guidesConfig.ts](file:///e:/workspace/ct-scanner-compass-directory/src/config/guidesConfig.ts)、[DynamicGuidePage.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/pages/DynamicGuidePage.tsx)）
 - 面包屑链接统一：使用 addLanguagePrefix 处理语言前缀 — 已完成（[DeviceDetailPage.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/pages/DeviceDetailPage.tsx)、[ManufacturerDetailPage.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/pages/ManufacturerDetailPage.tsx)）
 - 内容目录别名映射迁出：CATEGORY_FOLDER_ALIAS → src/config/contentCategories.ts，并更新 lib/markdown.ts 引用 — 已完成（[contentCategories.ts](file:///e:/workspace/ct-scanner-compass-directory/src/config/contentCategories.ts)、[markdown.ts](file:///e:/workspace/ct-scanner-compass-directory/src/lib/markdown.ts)）
 - 语法与类型校验：npm run check:syntax 全部通过 — 已完成

## 2026-02-12 关键词提取与内容优化方案（新增）
 - 关键词池（采购与规格导向）：ct scanner manufacturer、ct scanner manufacturers、ct scanner brands、computed tomography manufacturers、philips incisive ct specifications、ct scanner comparison（chart）、philips incisive ct price、incisive ct philips price、wide bore mri、3t mri
 - 进度（自然嵌入正文，非 head keywords）：已完成（设备页：Incisive、SOMATOM Drive/Force/go.Up、uCT 528/860/960+、Spectral CT、GE Revolution CT/Optima CT680 Expert/Revolution Apex、Wandong TURBOTOM 3200S、Mingfeng ScintCare Blue 755；制造商页：GE/Philips/Siemens/United Imaging；对比页：全球 CT/MRI 制造商；定价页：CT/MRI 价格指南 zh）；下一步：MRI 型号页扩展（MAGNETOM Vida/Lumina/Mica、Philips Ingenia Elition/Ambition）— 待办

## 新增计划：设备数据与页面优化（对齐 devicetype 文档）
1. 建立设备分类枚举与前端映射（CT/MRI 枚举表）— 待办  
   - CT：generation、detector_rows/slice_count、configuration（helical/dual_source/spectral/cbct/portable）、aperture  
   - MRI：field_strength、magnet_type（permanent/electromagnet/superconducting）、bore_type（open/closed/wide）、application
2. 设备 frontmatter 规范化（字段与类型约束，含 schema_version/updated_at/source_refs）— 待办
3. 为 3–5 个代表设备补录示范字段与 badges（如 128-slice、Dual-Source、3T、Wide-Bore）— 待办
4. 设备列表页新增筛选与分组卡片— 待办  
   - CT：slice_count、configuration、aperture  
   - MRI：field_strength、bore_type、magnet_type  
   - 分组：按品牌/技术特征分组展示
5. 详情页新增“相关设备”区块（基于枚举交集与品牌）— 待办
6. 扩展 generate-content-stats 输出聚合维度— 待办  
   - CT/MRI 占比、slice_count 分布、field_strength 分布、wide-bore 占比、topBrands、annualGrowth
7. 在 /stats 列表页增加对应可视化卡片（对齐新增聚合维度）— 待办
8. prebuild 校验脚本（frontmatter 枚举校验、slug 唯一、translations 完整性、类型检查）— 待办
9. 详情页结构化数据（Product/MedicalDevice schema）按可用字段输出— 待办
10. 路由规范化与导航补全— 待办  
    - /devices/ct/:sliceCount、/devices/ct/config/:configuration、/devices/mri/:fieldStrength、/devices/mri/bore/:boreType
11. hreflang/canonical 统一由 frontmatter/快照映射输出（SSR 与 CSR 一致）— 待办
12. 术语统一与买方导向写作（glossary technical.terms 扩展、设备页场景适配卡片）— 待办
- 进度（自然嵌入正文，非 head keywords）：已完成（设备页：Incisive、SOMATOM Drive/Force/go.Up、uCT 528/860/960+、Spectral CT、GE Revolution CT/Optima CT680 Expert/Revolution Apex、Wandong TURBOTOM 3200S、Mingfeng ScintCare Blue 755、MRI：MAGNETOM Vida/Lumina/Mica、GE SIGNA/Architect AIR、Philips Ingenia Elition X/Ambition S、UIH uMR 588/660/790/870、Neusoft NeuMR Rena、二手 SIGNA HDx；制造商页：GE/Philips/Siemens/United Imaging；对比页：全球 CT/MRI 制造商；定价页：CT/MRI 价格指南 zh）；下一步：英文页同步（如需）— 待办
- 进度（自然嵌入正文，非 head keywords）：已完成（设备页：Incisive、SOMATOM Drive/Force/go.Up、uCT 528/860/960+、Spectral CT、GE Revolution CT/Optima CT680 Expert/Revolution Apex、Wandong TURBOTOM 3200S、Mingfeng ScintCare Blue 755、MRI：MAGNETOM Vida/Lumina/Mica、GE SIGNA/Architect AIR、Philips Ingenia Elition X/Ambition S、UIH uMR 588/660/790/870、Neusoft NeuMR Rena、二手 SIGNA HDx；制造商页：GE/Philips/Siemens/United Imaging（中英）；对比页：全球 CT/MRI 制造商（中英）；定价页：CT/MRI 价格指南（中英））；下一步：审阅与再优化（FAQ/对比入口可用性）— 待办
- 对比页补充：Philips vs Siemens CT（已自然嵌入 ct scanner manufacturers/brands、computed tomography manufacturers、ct scanner comparison（chart）、philips incisive ct specifications、philips incisive ct price、incisive ct philips price）
- 作者与审核规范（E-E-A-T）— 待办
  - 统一使用作者：Heisenberg（来源 [authors.ts](file:///e:/workspace/ct-scanner-compass-directory/src/data/mock/authors.ts)）
  - 单人团队策略：前期不设置 reviewer，采用 `lastReviewedAt` + 引用来源（citations）保障可信度
  - 字段映射：author/name/role/credentials → Frontmatter；authorBio 引用作者简介摘要（避免夸大）
  - 页面范围：设备页/制造商页/对比页/定价页统一落地
- 设备页优化（CT）— 待办
  - Philips Incisive CT：补“规格参数（微辐射/金属伪影去除/量体成像）”“价格（588.11 万）”“型号对比入口”；路径 `/zh/devices/ct-scanners/philips-incisive-ct`
  - Siemens SOMATOM Drive/Force/Go Up：按 64 排模板补平台能力 + 临床软件包 + 后处理
  - 联影 uCT 528/860/960+：按 64 排模板补平台能力 + 临床软件包 + 后处理
- MRI 页面优化（3.0T）— 待办
  - MAGNETOM Vida/Lumina/Mica；Philips Ingenia Elition/Ambition：补 快速成像与 AI / 静音扫描 / 智能扫描平台 / 标准与高级应用组件
- 对比页与互链 — 待办
  - 在设备页与制造商页加入对比导流入口（/zh/compare/:slug），统一 canonical/translations
- SEO 关键词追加 — 待办
  - 设备与品牌页在 `seo.keywords` 增补 manufacturer/brands/specifications/price/comparison 相关高意图词
- 术语表扩展（technical.terms）— 待办
  - 增补：微辐射平台、金属伪影去除、静音扫描平台、智能扫描平台、快速成像与 AI（中英 1:1）
- 数据源（参考）
  - 查询数：`data/chinactscanner.org-Performance-on-Search-2026-01-06/查询数.csv`、`2026-01-31/查询数.csv`、`2026-02-10/查询数.csv`
  - CT 规格维度：`data/rawdata/specifications/headings/64-ct-specifications.headings.txt`
  - MRI 规格维度：`data/rawdata/specifications/headings/3.0t-mri-specifications.headings.txt`
  - 价格：`data/rawdata/prices.md`
