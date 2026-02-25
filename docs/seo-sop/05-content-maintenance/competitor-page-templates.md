# 竞品对比页模板

> 竞品对比页是高转化的Money Pages，结构化的模板确保一致性和SEO效果。

## 📋 对比页类型

### 1. 品牌对比页 (Brand vs Brand)

**URL格式**: `/compare/[brand-a]-vs-[brand-b]`

**示例**: `/compare/siemens-vs-united-imaging-ct-scanners`

**目标关键词**: "[Brand A] vs [Brand B]", "[Brand A] [Brand B] comparison"

### 2. 产品对比页 (Product vs Product)

**URL格式**: `/compare/[product-a]-vs-[product-b]`

**示例**: `/compare/siemens-somatom-vs-ge-revolution-ct`

**目标关键词**: "[Product A] vs [Product B]", "[Product A] [Product B] specs"

### 3. 类型对比页 (Category Comparison)

**URL格式**: `/guide/[type-a]-vs-[type-b]`

**示例**: `/guide/64-slice-vs-128-slice-ct-scanner`

**目标关键词**: "[Type A] vs [Type B]", "difference between [Type A] and [Type B]"

---

## 📝 品牌对比页模板

### 页面结构

```markdown
# [Brand A] vs [Brand B]: Complete CT/MRI Scanner Comparison [Year]

## Quick Comparison Summary
[简要对比表格，包含关键差异]

## Overview: [Brand A] vs [Brand B]
### About [Brand A]
[品牌简介、历史、市场定位]

### About [Brand B]
[品牌简介、历史、市场定位]

## Product Lineup Comparison
### [Brand A] CT/MRI Scanner Models
[产品线概览]

### [Brand B] CT/MRI Scanner Models
[产品线概览]

## Feature-by-Feature Comparison
### Image Quality
[具体对比]

### Technology & Innovation
[具体对比]

### Ease of Use
[具体对比]

### Service & Support
[具体对比]

## Pricing Comparison
[价格区间对比]

## Pros and Cons
### [Brand A] Pros and Cons
[优缺点列表]

### [Brand B] Pros and Cons
[优缺点列表]

## Which Brand Should You Choose?
### Choose [Brand A] If...
[适用场景]

### Choose [Brand B] If...
[适用场景]

## Frequently Asked Questions
[5-8个FAQ]

## Conclusion
[总结性建议]
```

### 必备元素检查清单

```markdown
SEO元素:
- [ ] Title: "[Brand A] vs [Brand B]: [Year] Comparison"
- [ ] Meta: 包含两个品牌名和"comparison"
- [ ] H1: 包含 vs 对比格式
- [ ] URL: 使用 vs 或 compare 格式

内容元素:
- [ ] 对比表格（至少1个）
- [ ] 优缺点列表
- [ ] 价格信息
- [ ] 推荐场景
- [ ] FAQ部分（5+ 问题）
- [ ] 明确的结论/推荐

结构化数据:
- [ ] Product Schema（两个产品）
- [ ] FAQ Schema
- [ ] Breadcrumb Schema
```

---

## 📝 产品对比页模板

### 页面结构

```markdown
# [Product A] vs [Product B]: Detailed Specs Comparison [Year]

## At a Glance
[对比概览卡片]

## Specifications Comparison Table
| Feature | [Product A] | [Product B] |
|---------|-------------|-------------|
| Slices | | |
| Rotation Time | | |
| Field of View | | |
| Power | | |
| Weight | | |
| Price Range | | |

## Design and Build Quality
[外观、构造对比]

## Technical Specifications Deep Dive
### Imaging Performance
[成像性能详细对比]

### Dose Efficiency
[剂量效率对比]

### Workflow Features
[工作流功能对比]

## Clinical Applications
### Best Uses for [Product A]
[适用场景]

### Best Uses for [Product B]
[适用场景]

## Total Cost of Ownership
### Initial Investment
[初始成本]

### Maintenance Costs
[维护成本]

### ROI Analysis
[投资回报分析]

## User Reviews and Feedback
[用户评价汇总]

## The Verdict
### Winner for [Use Case 1]: [Product X]
### Winner for [Use Case 2]: [Product Y]
### Overall Recommendation

## FAQ

## Related Comparisons
[相关对比链接]
```

### 规格对比表示例

```markdown
| Specification | Siemens SOMATOM go.Top | GE Revolution CT |
|--------------|------------------------|------------------|
| **Slices** | 128 | 256 |
| **Rotation Time** | 0.33s | 0.28s |
| **Coverage** | 80mm | 160mm |
| **kW** | 100 | 120 |
| **Bore Size** | 80cm | 80cm |
| **Gantry Tilt** | ±30° | ±30° |
| **Table Load** | 307kg | 300kg |
| **Price Range** | $400K-600K | $800K-1.2M |
| **FDA Cleared** | ✅ | ✅ |
| **CE Marked** | ✅ | ✅ |
```

---

## 📝 类型对比页模板

### 页面结构

```markdown
# [Type A] vs [Type B]: Which Is Right for Your Hospital?

## What's the Difference?
[核心差异解释]

## Understanding [Type A]
### How It Works
[技术原理]

### Key Advantages
[主要优势]

### Limitations
[局限性]

## Understanding [Type B]
### How It Works
[技术原理]

### Key Advantages
[主要优势]

### Limitations
[局限性]

## Side-by-Side Comparison
[对比表格]

## Cost Comparison
### Initial Cost
### Operating Cost
### Total Cost of Ownership

## Clinical Scenarios
### When to Choose [Type A]
[适用场景列表]

### When to Choose [Type B]
[适用场景列表]

## Future Considerations
[技术发展趋势]

## Expert Recommendations
[专家建议]

## FAQ

## Conclusion
```

---

## ✅ 对比页SEO优化要点

### Title优化

```
格式:
[Brand/Product A] vs [Brand/Product B]: [Benefit/Year] Comparison

示例:
- Siemens vs GE CT Scanners: 2026 Complete Comparison
- 64-Slice vs 128-Slice CT: Which Should You Buy?
- SOMATOM vs Revolution CT: Specs & Price Comparison
```

### Schema实现

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[Product A] vs [Product B] Comparison",
  "description": "Detailed comparison of...",
  "author": {
    "@type": "Organization",
    "name": "China CT Scanner"
  },
  "about": [
    {
      "@type": "Product",
      "name": "[Product A]",
      "brand": "[Brand A]"
    },
    {
      "@type": "Product", 
      "name": "[Product B]",
      "brand": "[Brand B]"
    }
  ]
}
```

### 内链策略

```markdown
必须包含的内链:
- [ ] 链接到各产品详情页
- [ ] 链接到各品牌页面
- [ ] 链接到相关对比页
- [ ] 链接到采购指南
- [ ] 链接到联系/询价页面

锚文本示例:
- "Learn more about [Product A] specifications"
- "See all [Brand] CT scanners"
- "Compare with [Other Product]"
- "Get a quote for [Product]"
```

---

## 📊 对比页优先级矩阵

### 高优先级对比页

| 对比类型 | 搜索量预估 | 商业价值 |
|---------|----------|---------|
| Siemens vs GE CT | 高 | 高 |
| Chinese vs Western CT | 中 | 高 |
| 64 vs 128 Slice CT | 中 | 高 |
| United Imaging vs Neusoft | 中 | 高 |
| 1.5T vs 3T MRI | 高 | 高 |

### 创建顺序

```
Phase 1 (立即创建):
1. 主要品牌对比 (Top 5 品牌两两对比)
2. 切片数对比 (16/64/128/256)
3. 中国品牌对比

Phase 2 (Q2):
4. 具体产品型号对比
5. 新旧版本对比
6. 价格区间对比

Phase 3 (Q3-Q4):
7. 特定应用场景对比
8. 服务/保修对比
9. 翻新vs新机对比
```

---

**文档版本**: v1.0  
**创建日期**: 2026-01-03
