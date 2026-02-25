# 关键词追踪表模板

> 定期追踪关键词排名变化，评估SEO效果。

## 📊 关键词追踪表结构

### 主表字段

| 字段 | 类型 | 说明 |
|------|------|------|
| keyword_id | 自动 | 唯一标识 |
| keyword | 文本 | 关键词 |
| primary_market | 选择 | 主要市场 (US/EU/APAC/Global) |
| search_volume | 数字 | 月搜索量 |
| kd | 数字 | 关键词难度 (0-100) |
| cpc | 货币 | 点击成本 (USD) |
| intent | 选择 | 搜索意图 |
| funnel_stage | 选择 | 漏斗阶段 |
| target_url | URL | 目标页面 |
| current_rank | 数字 | 当前排名 |
| previous_rank | 数字 | 上周排名 |
| rank_change | 计算 | 排名变化 |
| in_top_10 | 布尔 | 是否进入Top 10 |
| priority | 选择 | 优先级 (P0/P1/P2/P3) |
| status | 选择 | 状态 |
| cluster | 文本 | 所属Cluster |
| notes | 文本 | 备注 |
| last_updated | 日期 | 更新日期 |

---

## 📋 示例数据

### Money Keywords 追踪

| 关键词 | 市场 | 搜索量 | KD | 目标URL | 当前排名 | 上周 | 变化 | 优先级 |
|--------|------|--------|-----|---------|---------|------|------|--------|
| buy CT scanner from China | US | 320 | 35 | /devices/ct | - | - | NEW | P0 |
| Chinese CT manufacturer | Global | 480 | 42 | /manufacturers | 45 | - | NEW | P0 |
| 64 slice CT price | Global | 590 | 55 | /devices/ct-64-slice | 32 | 38 | ↑6 | P0 |
| CT scanner cost | US | 1,200 | 62 | /guides/ct-pricing | 28 | 25 | ↓3 | P0 |
| MRI machine manufacturer | Global | 720 | 48 | /manufacturers | 52 | 55 | ↑3 | P0 |

### Informational Keywords 追踪

| 关键词 | 市场 | 搜索量 | KD | 目标URL | 当前排名 | 状态 |
|--------|------|--------|-----|---------|---------|------|
| how does CT scanner work | Global | 2,400 | 35 | /knowledge/ct-technology | 18 | 优化中 |
| types of CT scanners | Global | 1,800 | 42 | /guides/ct-types | - | 待创建 |
| CT vs MRI difference | Global | 3,200 | 38 | /compare/ct-vs-mri | - | 待创建 |

---

## 📈 周报表模板

### 排名变化汇总

**报告周期**: YYYY-MM-DD 至 YYYY-MM-DD

#### 总体指标

| 指标 | 本周 | 上周 | 变化 |
|------|------|------|------|
| 追踪关键词总数 | | | |
| Top 3 关键词数 | | | |
| Top 10 关键词数 | | | |
| Top 30 关键词数 | | | |
| 平均排名 | | | |

#### 排名提升 Top 5

| 关键词 | 当前排名 | 变化 | 目标URL |
|--------|---------|------|---------|
| | | | |

#### 排名下降 Top 5

| 关键词 | 当前排名 | 变化 | 可能原因 | 建议行动 |
|--------|---------|------|---------|---------|
| | | | | |

#### 新进入 Top 10

| 关键词 | 当前排名 | 之前排名 | 搜索量 |
|--------|---------|---------|--------|
| | | | |

---

## 🔄 更新流程

### 每周更新（周一）

1. 从排名工具导出最新数据
2. 更新 `current_rank` 字段
3. 计算 `rank_change`
4. 标记进入/退出 Top 10 的关键词
5. 生成周报表
6. 记录异常变化的备注

### 每月更新（月初）

1. 更新搜索量和KD数据
2. 添加新发现的关键词
3. 删除不再追踪的关键词
4. 评估优先级是否需要调整
5. 与内容团队同步需要创建的页面

### 每季度更新

1. 全面审查关键词策略
2. 添加新产品/功能相关关键词
3. 分析竞争对手关键词变化
4. 调整Topic Cluster规划

---

## 📊 数据可视化建议

### 推荐图表

1. **排名分布图**: 饼图显示 Top 3 / Top 10 / Top 30 / 30+ 分布
2. **排名趋势图**: 折线图显示重点关键词的排名变化
3. **流量预估图**: 基于排名和搜索量估算流量
4. **优先级矩阵**: 散点图显示搜索量 vs 当前排名

### 关键指标仪表盘

```
┌─────────────────────────────────────────────────┐
│  SEO 关键词仪表盘                                │
├─────────────────────────────────────────────────┤
│                                                 │
│  追踪词数    Top 3     Top 10    平均排名        │
│    150        8         25        32.5          │
│   (+5)      (+2)       (+3)     (-1.2)         │
│                                                 │
├─────────────────────────────────────────────────┤
│  本周提升最多: "64 slice CT price" ↑12位        │
│  本周下降最多: "CT scanner cost" ↓5位           │
│  新进Top10: 3个关键词                           │
└─────────────────────────────────────────────────┘
```

---

## 🛠 推荐工具

| 工具 | 用途 | 成本 |
|------|------|------|
| Google Search Console | 免费排名数据 | 免费 |
| Ahrefs Rank Tracker | 专业排名追踪 | $99+/月 |
| Semrush Position Tracking | 排名追踪+竞品 | $119+/月 |
| Google Sheets | 数据整理 | 免费 |
| Looker Studio | 可视化仪表盘 | 免费 |

---

## 🔗 关联文档

- [keyword-research-sop.md](./keyword-research-sop.md) - 关键词研究SOP
- [../monitoring/gsc-monitoring-sop.md](../monitoring/gsc-monitoring-sop.md) - GSC监控SOP
- [../monitoring/weekly-report-template.md](../monitoring/weekly-report-template.md) - 周报告模板
