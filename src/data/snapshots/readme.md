# Snapshots 说明

- 来源：构建期从数据库与 Markdown 内容融合生成
- 作用：SSR 首屏注水、离线与无库环境的稳定输出

## 目录规范
- 路径：`src/data/snapshots/<locale>/content/<category>/<slug>.json`
- 示例：
  - `src/data/snapshots/en/content/stats/global.json`
  - `src/data/snapshots/zh/content/stats/global.json`
  - `src/data/snapshots/en/content/reports/expert-analysis.json`

## 文件结构示例
```json
{
  "labels": { "...": "..." },
  "metrics": {
    "totalDevices": 0,
    "totalManufacturers": 0,
    "totalArticles": 0,
    "totalCountries": 0
  },
  "updatedAt": "2026-02-12T00:00:00.000Z",
  "metadata": {
    "sourceFlags": ["db", "markdown", "seed"]
  }
}
```

## 使用建议
- SSR/CSR 读取：使用 `import.meta.glob('/src/data/snapshots/**/content/**/*.json')`
- 多语言兜底：按 `i18n.language` 选择 locale，缺失则回退到英文
- 构建期生成：在 `scripts/post-build.js` 的静态生成前执行快照生成脚本

