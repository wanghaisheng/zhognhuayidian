# 多语言类型与架构优化方案

## 目标
- 统一前后端多语言数据访问契约，消除 legacy 字段依赖
- 强化类型一致性、提升可维护性与扩展性

## 原则
- 数据库以 JSONB translations 为唯一多语言来源
- 前端采用 Raw/Domain 分层，边界进行深度归一化与语言选择
- 工具化语言选择逻辑，避免组件分散处理

## 命名空间与用法约定（前端）
- 顶层命名空间与 locales/{lang}/index.ts 保持一致（如 pricing、resourceCenter、navigation）
- 页面内：useTranslation('ns') + 相对键（例如 t('hero.title')）
- 跨命名空间：使用 ns:key（例如 t('navigation:compare')）
- 禁止使用 pages.* 前缀（历史写法），统一改为顶层命名空间

## 内容目录与构建期管线
- 内容文件位于 [content](file:///e:/workspace/ct-scanner-compass-directory/content) 目录，Markdown 作为长文与文案主权来源，配合 frontmatter 提供文案/SEO 元信息
- 统一读取回退链路遵循 [src/data/readme.md](file:///e:/workspace/ct-scanner-compass-directory/src/data/readme.md)：
  - 数据库 → snapshots → seed（mocks）
  - 构建期生成 snapshots 到 src/data/snapshots/<locale>/…，SSR 注水首屏；运行期由查询层刷新数据库数据
- 链接语言前缀在渲染时计算，不在常量中写死路径；与 TanStack Router 的语言前缀策略保持一致

## 分层设计
- Raw* 类型：严格映射数据库返回，允许 null，包含 translations 与 legacy 字段（仅兼容）
- Domain* 类型：仅可选 undefined，不包含 *_zh/*_en，统一从 translations 选择

## 适配边界与规范
- 深度归一化：使用 normalizeNullsDeep，将所有嵌套结构 null→undefined
- Mapper：mapRawToDomain(raw, lang) 统一执行：
  - 归一化
  - 从 translations 选取语言键并合并
  - 去除 *_zh/*_en 等 legacy 字段
  - 字段兜底（例如 name/description）

## 工具与 Hook
- getLocalized<T>(raw, langCode)：单一入口进行语言选择与键合并
- useMultilingualObject：过渡期支持 translations 优先，后续移除 *_zh/*_en 回退

## 字段契约
- translations 键名统一：
  - name、description、title、excerpt、features、applications
- 导入/迁移脚本遵循契约，索引与查询按契约维护

## 组件改造策略
- 组件层依赖 Domain* 类型，不直接读取 *_zh/*_en
- 公共显示组件通过工具/Hook 接入 translations
- 渐进式替换 legacy 访问为 getLocalized/mapper

## 路径与环境约定
- 弃用路径说明：将 [src/data/production](file:///e:/workspace/ct-scanner-compass-directory/src/data/production) 视为历史/废弃目录；生产环境的“数据来源”应指代连接数据库（Supabase），而非本地 TypeScript 数据文件
- 生产语义：生产环境读取优先来自数据库，无法连接时按“数据库 → snapshots → seed”回退
- 内容治理：Markdown 长文在 content 管理，结构化字段以数据库为权威；构建期融合生成 snapshots 并注水

## Lint 与测试保障
- ESLint 规则：禁止新增直接访问 *_zh/*_en
- 单元测试：
  - normalizeNullsDeep：对象/数组嵌套、边界值
  - mapRawToDomain：语言选择、字段合并、兜底逻辑

## 实施路线图
- 阶段一：引入 Raw/Domain 类型对与统一 mapper
- 阶段二：适配层切换到 mapper，组件开始使用 Domain 类型
- 阶段三：移除 *_zh/*_en 回退逻辑与 legacy 字段访问
- 阶段四：完善测试覆盖与 ESLint 规则，锁定一致性

## 验收标准
- 代码库不再出现直接访问 *_zh/*_en 的用法
- 所有多语言读取统一通过 translations 与 mapper/工具
- TypeScript 与 ESLint 全量通过；新增语言不引入类型改动

## 实施进度（最新）
- 已完成：useSupabaseData 多语言映射切换为 “translations 优先 + 深度归一化”，并对 specifications 做深合并；保留过渡期 *_zh/*_en 回退
- 已完成：通过全量 TypeScript 与 ESLint 检查（npm run check:syntax），验证无类型与风格错误
- 进行中：在 multilingualContentManager 引入 getLocalized 工具，统一 Raw→Domain 的语言选择入口
- 待完成：组件层逐步移除 *_zh/*_en 直接读取，改为消费 Domain；补充单元测试覆盖 normalizeNullsDeep 与 mapLocalizedFields/mapRawToDomain

## 近期变更摘要
- useSupabaseData.ts：新增深度归一化并将 translations 合并置于最高优先级；完善价格解析与派生字段一致性
- 计划文件：明确生产语义为连接数据库并弃用 src/data/production；构建期 snapshots 回退链路保持不变
