# 多语言类型定义一致性分析报告

## 背景与目标
- 统一评估数据库 JSONB translations 策略与前端类型/组件用法的一致性
- 明确不一致点、风险与根因，形成改进建议

## 数据库策略回顾
- 统一采用 JSONB translations 存储多语言内容，新增语言无需改表结构
- 提供表达式索引优化本地化检索/排序
- 回填与导入脚本确保 legacy 字段合并到 translations
- 关键参考：
  - 初始 schema 与 translations 字段 [001_create_base_tables.sql](file:///e:/workspace/ct-scanner-compass-directory/supabase/migrations/001_create_base_tables.sql#L20-L23)
  - 混合内容与 locale 关联 [007_hybrid_content_architecture.sql](file:///e:/workspace/ct-scanner-compass-directory/supabase/migrations/007_hybrid_content_architecture.sql#L80-L93)
  - 多语言数据回填 [20260211_translations_jsonb.sql](file:///e:/workspace/ct-scanner-compass-directory/supabase/migrations/20260211_translations_jsonb.sql#L16-L31)
  - 表达式索引 [20260211_translations_indexes.sql](file:///e:/workspace/ct-scanner-compass-directory/supabase/migrations/20260211_translations_indexes.sql#L3-L12)

## 前端类型与适配现状
- 接口层：Multilingual* 仍包含 *_zh/*_en 字段，且多为 string | null
- Domain 类型：已提供 translations 结构，legacy 字段标记为 deprecated
- 适配层：实现 normalizeNullsDeep，深度归一化 null→undefined，提升健壮性
- Hook 层：useMultilingualObject 优先读取 translations，回退到 *_zh/*_en；useSupabaseData 对 translations 做动态合并
- 关键参考：
  - 深度归一化实现与调用 [multilingualContentManager.ts](file:///e:/workspace/ct-scanner-compass-directory/src/lib/multilingualContentManager.ts#L48-L64)
  - Domain 类型中 translations 约定 [device.ts](file:///e:/workspace/ct-scanner-compass-directory/src/types/device.ts#L86-L104), [domain.ts](file:///e:/workspace/ct-scanner-compass-directory/src/types/domain.ts#L135-L157)
  - 多语言合并 Hook [useMultilingualContent.ts](file:///e:/workspace/ct-scanner-compass-directory/src/hooks/useMultilingualContent.ts#L18-L44)
  - Supabase 数据多语言合并 [useSupabaseData.ts](file:///e:/workspace/ct-scanner-compass-directory/src/hooks/useSupabaseData.ts#L244-L268)

## 一致性评估
- 数据层一致：translations 统一，扩展语言不改 schema
- 适配层基本一致：normalizeNullsDeep 保障 null→undefined 一致
- 接口层不一致：*_zh/*_en 与 translations 并存，组件容易误用 legacy 字段
- 组件层潜在不一致：部分组件直接读取默认英文或 *_zh/*_en，绕过 translations

## 风险与根因
- 双路映射导致维护成本高、逻辑重复
- 可空与可选混用，形成 string | null 与 string | undefined 的并存
- 语言选择分散，不同组件自行处理语言键
- translations 键名契约不够强（name/description/features/applications）

## 发现的问题清单
- Multilingual* 接口暴露 legacy 字段，诱导直接使用
- useSupabaseData 与 useMultilingualObject 有重复映射逻辑
- 缺少统一 mapper 作为唯一边界进行 Raw→Domain 转换
- lint 与测试缺少对 “禁止直接访问 *_zh/*_en” 的约束

## 结论
- 数据库策略统一且扩展性强；前端已具备归一化能力
- 需要在类型与适配层彻底收敛到 translations 模式，分层 Raw/Domain，统一语言选择入口，逐步淘汰 *_zh/*_en

## 命名空间契约（前端补充）
- 顶层命名空间：与 locales/{lang}/index.ts 对齐（如 pricing、resourceCenter、navigation）
- 用法：
  - 页面内使用 useTranslation('ns')，键写相对路径（如 hero.title）
  - 跨命名空间使用 ns:key（如 navigation:pricing）
- 目的：降低脚本与组件心智成本，减少误报，确保 en/zh 键集合一致性
