目录组织与约定：
- 页面翻译统一归档在 pages/，文件名与路由 slug 对齐（如 pages/manufacturers.ts、pages/deviceDetail.ts）
- 组件翻译统一归档在 components/（如 components/inquiryForm.ts），与页面翻译分层独立
- 通用翻译项统一在 common/index.ts（跨页面复用的短语与文本）
- 全局资源：navigation/、seo.ts（站点默认）、site.ts（站点级文案）
- UI 枚举/字典集中在 constants.ts（不含具体文案），页面/组件文案放 pages/ 与 components/
- 若内容来源于 content/Markdown，页面键命名仍按 slug 对齐，frontmatter/正文在构建期与数据库融合为 snapshots

实现与迁移建议：
- 清理顶层页面型文件（analysis.ts、history.ts、guide.ts、blog.ts 等页面文案）到 pages/ 对应文件，避免与 pages/* 并存
- 新增或调整页面键命名，统一遵循 prerender-routes.json 的 slug 规范
- 保持链接前缀在渲染时生成（addLanguagePrefix），不要在常量中写死路径

data/ 目录的定位与原则：
- 用途：承载“数据字典/结构化枚举”的文案，供 hooks 与逻辑层复用，不直接绑定某个页面或组件
- 使用者举例：
  - 页脚链接文案：data/footer.* 被 hooks/data/useFooterData.ts 通过 t('data.footer...') 读取
  - 教育/常见问答：data/education.*、data/guideFaqs.* 被 hooks/data/useEducationData.ts、useGuideFaqData.ts 读取
  - 统计与标签：data/stats.*、data/customer.*、data/inquiry.*、data/export.* 被对应 hooks 使用
  - 比对面板：data/comparison.* 被 hooks/data/useComparisonData.ts 使用
- 与 pages/components 的边界：
  - 页面或组件 UI 标题/说明文本 → 放在 pages/* 或 components/*
  - 可被多处逻辑复用的枚举/列表项名称、筛选项标签、SEO 关键词等 → 放在 data/*
- 聚合与覆盖：
  - EN：在 en/index.ts 中通过 data 节点统一导出
  - ZH：在 locales/index.ts 中 data 节点以 EN 为基底，按需覆写（如 data.footer、data.navigation、data.comparison）
- 避免重复：同一语义的键只保留一份来源；例如：
  - “页脚栏目标题/品牌简介”等 UI 文案在 labels/footer.ts
  - “页脚链接项文本”在 data/footer.ts，由 useFooterData 读取渲染

