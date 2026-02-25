---
title: "Compare 页面优化方案（结合 rawdata 规格与现有文档）"
description: "以规格原始数据为单一事实来源，驱动对比工具与文章页的结构化展示与 SEO 增强。"
slug: "compare-page-optimization"
category: "seo-sop"
tags: ["compare", "specifications", "seo", "ux", "i18n"]
publishedAt: "2026-02-07"
updatedAt: "2026-02-07"
author: "Heisenberg"
status: "draft"
---

# Compare 页面优化方案（不落地实现版）

## 背景与目标

- 现有对比体系包括工具页与文章页两类：
  - 工具页路由：`/compare`、`/compare/ct-scanners`、`/compare/mri-scanners`（见 [App.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/App.tsx#L122-L148)）
  - 文章对比页：`/compare/:slug`（见 [ComparisonDetailPage.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/pages/ComparisonDetailPage.tsx)）
- 原始规格库：`e:\workspace\ct-scanner-compass-directory\data\rawdata\specifications\*`，包含 CT/MRI/DR 的招标参数与证明材料口径。
- 目标：以 rawdata 为单一事实来源，统一规格字段与“★/▲”标注口径，驱动 compare 页的数据渲染、差异高亮、证据索引与 SEO 结构化数据。

## 数据源与现状

- 原始规格（Markdown）：例如
  - [64-ct-specifications.md](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/64-ct-specifications.md)
  - [128-ct-specifications.md](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/128-ct-specifications.md)
  - [1.5t-mri-specifications-1.md](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/1.5t-mri-specifications-1.md)
  - [3.0t-mri-specifications.md](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/3.0t-mri-specifications.md)
  - [5.0t-mri-specifications.md](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/5.0t-mri-specifications.md)
  - [7.0t-mri-specifications.md](file:///e:/workspace/ct-scanner-compass-directory/data/rawdata/specifications/7.0t-mri-specifications.md)
- 对比文章模板与 SEO SOP：
  - [competitor-page-templates.md](file:///e:/workspace/ct-scanner-compass-directory/docs/seo-sop/05-content-maintenance/competitor-page-templates.md)
- 运行时页面：
  - 对比详情页加载混合内容钩子：`useComparisonHybridContent`（见 [ComparisonDetailPage.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/pages/ComparisonDetailPage.tsx#L48-L66)）
  - 语言资源：`src/locales/*/labels/pages/comparison.ts`

## 优化方向（原则）

- 单一事实来源：以 rawdata 的规格条目为准，统一字段名/单位/范围表达。
- 明确判定口径：保留“★不可负偏离”与“▲关键评分项”，支持“真实值/工程值/非峰值/非等效值”显式标识。
- 证据映射：引入“条款→证据文件→页码/图表”的索引表，以便审核与合规答复。
- 多语言一致：规格字段采用 key 归一化，文案层通过 i18n 映射，避免内容漂移。
- 性能与可维护：构建时预处理为 JSON（或轻量数据库），页面运行时只做渲染与交互。

## 数据模型（建议）

```json
{
  "deviceId": "mri-3t-generic",
  "type": "MRI",
  "model": "Generic 3.0T",
  "brand": "Generic",
  "specs": [
    {
      "id": "field_strength",
      "labelKey": "spec.fieldStrength",
      "category": "magnet",
      "unit": "T",
      "value": "3.0",
      "mark": "★",
      "proofRefs": [{ "file": "whitepaper.pdf", "page": "12", "note": "Non-peak/engineering wording visible" }],
      "notes": ["trueValue": true]
    },
    {
      "id": "patient_bore",
      "labelKey": "spec.patientBore",
      "category": "magnet",
      "unit": "cm",
      "value": "70",
      "mark": "★"
    }
  ]
}
```

字段解释：
- `id`：规格键名（统一命名）
- `labelKey`：多语言展示 key
- `category`：规格分组（magnet/gradient/rf/coil/workflow/site 等）
- `unit/value/range`：值与单位（范围用 `min/max` 或 `valueText`）
- `mark`：`★/▲/—`
- `proofRefs`：证据文件、页码、标注说明
- `notes.trueValue`：真实值/工程值口径标识

## 交互与呈现（compare 工具页）

- 基础：
  - 设备选择器：品牌/型号搜索、按类型（CT/MRI/DR）过滤
  - 列固定：设备 A、设备 B、可扩展到设备 C
  - 规格分组折叠：magnet/gradient/rf/coil/site 等分组可展开/折叠
- 差异高亮：
  - 数值差异：按单位标准化后对比，显著差异高亮（支持阈值）
  - 判定口径：标记“真实值/非峰值/非等效值”，并以提示气泡说明
  - 条款标记：显示 `★/▲`，支持“仅显示 ★/仅显示 ▲/全部”
- 证据索引：
  - 行内证据：点击行弹出证据索引（文件+页码/图表）
  - 全页汇总：导出“条款→证据”的对照表
- 多语言与可访问：
  - labelKey 驱动文案；数字与单位按本地化格式化
  - 大表虚拟化与键盘导航，支持移动端折叠模式

## 文章对比页（/compare/:slug）

- 结构：
  - 概览卡片：核心差异摘要（速度/孔径/梯度/通道/工作流）
  - 规格表：与工具页同源数据（两设备对比）
  - 场景推荐：根据规格差异生成“适用场景”提示
  - 证据映射：将证据表作为可下载/复制的索引
- SEO：
  - 标题/描述含对比关键词与年份
  - 结构化数据：Article + Product + FAQ（参考 [dynamic-pages-architecture.md](file:///e:/workspace/ct-scanner-compass-directory/docs/plan/archived/%5BDEPRECATED%5D_dynamic-pages-architecture.md#L517)）
  - 相关对比：品牌/型号/切片数联动（参考 [competitor-page-templates.md](file:///e:/workspace/ct-scanner-compass-directory/docs/seo-sop/05-content-maintenance/competitor-page-templates.md)）

## 规格标准化规则

- 单位规范：
  - 梯度强度：`mT/m`，切换率：`T/m/s` 或 `mT/m/ms`（统一展示与内部换算）
  - 孔径：`cm`，功率：`kW`，接收通道：整数
- 真实值口径：
  - 含“工程值/非峰值/非等效值”的条款，统一标注 `notes.trueValue = true`
- 组合规则：
  - 线圈通道不得组合累加；条款中明确要求“非组合”的，行内提示警告
- 复合判定：
  - “强度与切换率可同时达到”作为复合条款，取布尔字段 `gradientSimultaneous = true`

## 性能与工程建议（不落地实现）

- 预处理：
  - 构建时将 Markdown 规格转为 JSON，做单位归一化与键名映射
  - 按设备 ID 建立索引，支持快速检索
- 渲染优化：
  - 大表虚拟列表；分组折叠与记忆展开状态
  - 依赖变更范围内的 memo 与 selector，减少不必要重渲染
- 校验与测试：
  - 规格 schema 校验（必填字段与单位/范围）
  - 差异检测单测：边界值与单位换算用例

## 渐进式路线图（不实现，仅建议）

1. Phase 1：数据管线
   - 原始 Markdown→规格 JSON 的预处理脚本（含单位归一化、★/▲ 映射、trueValue 标识）
2. Phase 2：compare 工具页改造
   - 分组规格表 + 差异高亮 + 证据弹层 + 过滤（★/▲）
3. Phase 3：文章页升级
   - 概览卡片 + 规格同源 + 场景提示 + 结构化数据 + 相关对比
4. Phase 4：SEO 与 i18n
   - 多语言规格 labelKey 接入；路由/链接结构统一与 canonical 整理

## 验收标准（DoD）

- 从 rawdata 到 compare 页的数据链路可重复执行，字段与单位稳定一致。
- `★/▲/trueValue` 等口径在工具页与文章页一致展示。
- 证据索引可按条款打包导出，页面内点击即可查看对应页码/图表。
- 多语言页文案一致性与数字格式化正确。
- 性能可处理 ≥2 设备 × ≥200 条规格的对比表，交互流畅。

## 风险与规避

- 原始规格口径不一致：通过预处理脚本统一单位/键名/判定口径。
- 证据文件版本漂移：引入证据清单版本号与“最后更新”标记。
- 多语言维护成本：采用 labelKey + i18n，不在数据层写死文案。
- 表格过大：分组折叠 + 虚拟列表 + 移动端折叠模式。
