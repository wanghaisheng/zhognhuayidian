# 种子数据（seed）目录说明

## 目录定位
- 用途：在无数据库且未生成快照的紧急场景提供结构化数据兜底
- 现状：目录已清空；常规运行不再读取此目录的数据
- 推荐：优先使用数据库与 snapshots；seed 仅作为临时来源

## 数据读取优先级
- 顺序：数据库 → snapshots → seed
- 说明：统一回退链路与详细策略见 [data/readme.md](file:///e:/workspace/ct-scanner-compass-directory/src/data/readme.md)

## 与其他目录的分工
- labels：文案与 UI 标签的权威来源（含 data.* 键），不存结构化实体
- content：Markdown 长文与页面文案主权来源（frontmatter + 正文）
- snapshots：构建期只读 JSON，用于 SSR 注水与离线稳定输出，参见 [snapshots/readme.md](file:///e:/workspace/ct-scanner-compass-directory/src/data/snapshots/readme.md)
- seed：结构化“种子数据”，仅在特殊场景短期使用

## 使用规范
- Schema 对齐 supabase/migrations；字段命名与类型与生产一致
- 只存结构化实体（如 manufacturers/devices/customers/market），不混入 UI 文案/枚举
- 语言分层建议：`src/data/seed/<locale>/...`（如 `en/`、`zh/`）
- 最终产物应在构建期生成到 `src/data/snapshots/<locale>/content/...`，而非直接在运行期读取 seed

## 示例结构（建议）
```json
{
  "metadata": {
    "version": "1.0.0",
    "generatedAt": "2026-02-12T00:00:00.000Z",
    "dataSource": "seed"
  },
  "manufacturers": [],
  "devices": [],
  "customers": [],
  "articles": [],
  "timeline": { "ct": [], "mri": [] }
}
```

## 构建期流程
- 从数据库或 seed 生成 snapshots 到 `src/data/snapshots/<locale>/content/...`
- 在静态生成与站点地图之前执行快照生成，参考 [scripts/post-build.js](file:///e:/workspace/ct-scanner-compass-directory/scripts/post-build.js)

## 维护策略
- 默认保持空目录；避免新增运行期依赖
- 如需临时添加，请同步提供生成 snapshots 的脚本，并在后续移除 seed
- 在 CI 中增加快照生成与差异报告，保持与 Schema 一致

## 参考
- 数据层说明：[data/readme.md](file:///e:/workspace/ct-scanner-compass-directory/src/data/readme.md)
- 快照说明：[snapshots/readme.md](file:///e:/workspace/ct-scanner-compass-directory/src/data/snapshots/readme.md)
