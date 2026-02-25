# 关键词研究标准化操作流程（SOP）

> 关键词研究是SEO的基础，决定了流量的天花板和转化的底线。

## 📋 适用范围

本SOP适用于中国CT/MRI医疗设备出口网站的关键词研究工作，涵盖：
- 新产品/页面的关键词规划
- 现有内容的关键词优化
- 竞争对手关键词分析
- 定期关键词库更新

## 🎯 核心目标

1. 建立完整的关键词分类体系
2. 识别高商业价值的Money Keywords
3. 为每个产品线建立关键词矩阵
4. 支持Topic Cluster内容规划

---

## 第一步：业务线与产品清单梳理

### 1.1 核心业务线

| 业务线 | 主要产品 | 目标市场 | 商业价值 |
|--------|---------|---------|---------|
| CT扫描仪 | 16排/64排/128排CT | 全球 | 高 |
| MRI设备 | 1.5T/3.0T MRI | 全球 | 高 |
| 配件与耗材 | 球管、探测器 | 全球 | 中 |
| 维保服务 | 安装、培训、维修 | 全球 | 中 |

### 1.2 产品关键词矩阵模板

```
[产品名称]
├── 核心词（Core Keywords）
│   ├── [产品] + manufacturer
│   ├── [产品] + supplier
│   └── [产品] + price
├── 对比词（Comparison）
│   ├── [产品] vs [竞品]
│   └── [品牌A] vs [品牌B] [产品]
├── 替代词（Alternative）
│   ├── [竞品] alternative
│   └── cheaper than [竞品]
├── 用例词（Use Case）
│   ├── [产品] for small hospitals
│   └── [产品] for emergency room
└── 定价词（Pricing）
    ├── [产品] cost
    └── how much does [产品] cost
```

---

## 第二步：关键词意图分类

### 2.1 搜索意图分类标准

| 意图类型 | 英文 | 特征 | 示例 | 漏斗阶段 |
|---------|------|------|------|---------|
| 学习型 | Informational | 了解知识、原理 | how does CT scanner work | TOFU |
| 比较型 | Commercial | 对比评估、选择 | best CT scanner brands | MOFU |
| 交易型 | Transactional | 购买意向明确 | buy 64 slice CT scanner | BOFU |
| 导航型 | Navigational | 寻找特定品牌/网站 | Siemens CT scanner | MOFU |

### 2.2 漏斗阶段定义

```
TOFU (Top of Funnel) - 认知阶段
├── 用户正在学习和了解
├── 搜索量大，竞争激烈
├── 转化率低，但建立品牌认知
└── 内容类型：指南、科普、趋势分析

MOFU (Middle of Funnel) - 考虑阶段
├── 用户正在比较和评估
├── 搜索量中等，意向较明确
├── 转化率中等
└── 内容类型：对比页、评测、案例

BOFU (Bottom of Funnel) - 决策阶段
├── 用户准备购买
├── 搜索量小，但价值最高
├── 转化率高
└── 内容类型：产品页、定价页、询价表单
```

---

## 第三步：关键词收集与标注

### 3.1 数据收集工具

| 工具 | 用途 | 优先级 |
|------|------|--------|
| Google Search Console | 现有排名词发现 | P0 |
| Ahrefs/Semrush | 竞品词分析、搜索量 | P0 |
| Google Keyword Planner | 搜索量、CPC数据 | P1 |
| Google Trends | 趋势分析 | P2 |
| AlsoAsked/AnswerThePublic | 长尾词发现 | P2 |

### 3.2 关键词标注字段

创建Excel/Google Sheet，包含以下字段：

| 字段 | 说明 | 示例 |
|------|------|------|
| Keyword | 关键词 | 64 slice CT scanner |
| Search Volume | 月搜索量 | 1,200 |
| KD | 关键词难度 (0-100) | 45 |
| CPC | 点击成本 (USD) | $12.50 |
| Intent | 搜索意图 | Transactional |
| Funnel Stage | 漏斗阶段 | BOFU |
| Primary Market | 主要市场 | US, EU |
| Target Page | 目标页面 | /devices/ct-64-slice |
| Priority | 优先级 | P0/P1/P2 |
| Status | 状态 | 待优化/已优化 |

### 3.3 关键词分类表结构

创建3个独立的关键词视图：

**表1：Informational Keywords（学习型）**
- 用于博客文章、指南页面
- 目标：建立品牌认知，获取反向链接

**表2：Commercial Keywords（比较型）**
- 用于对比页、评测页、列表页
- 目标：引导用户进入决策阶段

**表3：Transactional Keywords（交易型）**
- 用于产品页、定价页、询价页
- 目标：直接转化，获取询价

---

## 第四步：Money Keywords 识别

### 4.1 Money Keywords 定义

Money Keywords = 高商业意图 + 合理搜索量 + 可竞争难度

### 4.2 识别标准

| 指标 | 理想范围 | 权重 |
|------|---------|------|
| 搜索意图 | Transactional / Commercial | 40% |
| 搜索量 | >100/月 | 20% |
| KD难度 | <50（可竞争） | 20% |
| CPC | >$5（高商业价值） | 20% |

### 4.3 Money Keywords 示例

| 关键词 | 搜索量 | KD | CPC | 得分 |
|--------|--------|-----|-----|------|
| buy CT scanner from China | 320 | 35 | $15.20 | ⭐⭐⭐⭐⭐ |
| Chinese CT manufacturer | 480 | 42 | $8.50 | ⭐⭐⭐⭐ |
| 64 slice CT price | 590 | 55 | $12.00 | ⭐⭐⭐⭐ |
| refurbished CT scanner | 1,200 | 48 | $6.80 | ⭐⭐⭐ |

---

## 第五步：竞争对手关键词分析

### 5.1 竞争对手识别

| 类型 | 竞争对手示例 | 分析重点 |
|------|-------------|---------|
| 直接竞争 | 其他中国设备出口商 | 产品词、品牌词 |
| 间接竞争 | GE、Siemens经销商 | 高价值关键词 |
| 内容竞争 | 医疗设备媒体、论坛 | 信息类关键词 |

### 5.2 竞争对手分析流程

```
1. 导出竞争对手Top 100排名关键词（Ahrefs）
2. 筛选与自身业务相关的关键词
3. 标注自己网站在该词的当前排名
4. 识别排名差距（Ranking Gap）
5. 优先攻克「竞争对手排名Top 10，自己未排名」的词
```

### 5.3 竞争对手关键词模板

| 关键词 | 竞品排名 | 自己排名 | 差距 | 机会评估 |
|--------|---------|---------|------|---------|
| CT scanner price | #3 | - | 无排名 | 高 |
| MRI machine manufacturer | #5 | #25 | 20位 | 中 |
| medical imaging equipment | #2 | #45 | 43位 | 低（难度大） |

---

## 第六步：关键词优先级排序

### 6.1 优先级评分公式

```
优先级得分 = (商业价值 × 0.4) + (可竞争性 × 0.3) + (搜索量 × 0.2) + (战略匹配 × 0.1)
```

### 6.2 优先级分类

| 优先级 | 得分范围 | 行动 |
|--------|---------|------|
| P0 | 8-10 | 立即优化，创建专属页面 |
| P1 | 6-7.9 | 短期规划（1-4周内） |
| P2 | 4-5.9 | 中期规划（1-3个月） |
| P3 | <4 | 长期储备 |

---

## 📊 输出交付物

完成关键词研究后，应交付：

1. **关键词主表** - 包含所有标注字段的完整列表
2. **Money Keywords清单** - Top 20-50高价值关键词
3. **竞品差距分析** - 与主要竞争对手的排名对比
4. **Topic Cluster规划** - 基于关键词的内容主题分组
5. **优先级路线图** - P0/P1/P2关键词的执行计划

---

## 📅 执行周期

| 任务 | 频率 | 负责人 |
|------|------|--------|
| 新产品关键词研究 | 产品上线前 | SEO |
| 关键词库更新 | 每季度 | SEO |
| 竞品关键词监控 | 每月 | SEO |
| 排名追踪 | 每周 | SEO |

---

## 🔗 关联文档

- [topic-cluster-strategy.md](./topic-cluster-strategy.md) - 主题集群规划
- [content-brief-template.md](./content-brief-template.md) - 内容Brief模板
- [keyword-tracking-sheet.md](./keyword-tracking-sheet.md) - 关键词追踪表
