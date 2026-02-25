# 结构化内容指南

> 结构化内容既利于传统SEO，也利于AI搜索引擎理解和引用。

## 📋 结构化内容原则

### 核心原则

```markdown
1. 层次清晰 - 使用合理的H标签层级
2. 语义明确 - 每段落有明确的主题
3. 信息完整 - 包含所需的所有关键信息
4. 格式规范 - 统一的内容格式和样式
5. 机器可读 - 结构化数据和语义HTML
```

### 内容层次结构

```
页面
├── H1: 页面主标题（唯一）
│
├── 导言/摘要
│   └── 关键信息的简洁概述
│
├── H2: 主要章节1
│   ├── 段落
│   ├── H3: 子章节
│   │   ├── 段落
│   │   └── 列表/表格
│   └── H3: 子章节
│
├── H2: 主要章节2
│   └── ...
│
├── FAQ部分
│   └── 常见问题和回答
│
└── 总结/CTA
```

---

## 📝 内容模板库

### 产品页面模板

```markdown
# [产品名称] - [核心卖点]

## Overview
[2-3句话概述产品，包含主要关键词]

## Key Specifications

| Specification | Value |
|--------------|-------|
| 切片数 | XX |
| 扫描时间 | X.Xs |
| ... | ... |

## Features & Benefits

### [特性1]
[描述] [益处]

### [特性2]
[描述] [益处]

## Applications
- [应用场景1]
- [应用场景2]
- [应用场景3]

## Technical Specifications
[详细规格表]

## Pricing
[价格信息或价格范围]

## Why Choose [产品/品牌]
[差异化优势]

## Frequently Asked Questions

### Q: [常见问题1]
A: [回答]

### Q: [常见问题2]
A: [回答]

## Get a Quote
[CTA]
```

### 对比页面模板

```markdown
# [A] vs [B]: Which Is Better for Your Hospital?

## Quick Comparison

| Feature | [A] | [B] |
|---------|-----|-----|
| Price | | |
| Specs | | |
| ... | | |

## Overview

### About [A]
[简介]

### About [B]
[简介]

## Detailed Comparison

### [比较维度1]
**[A]:** [描述]
**[B]:** [描述]
**Winner:** [A/B/Tie]

### [比较维度2]
...

## Pros and Cons

### [A] Pros and Cons
✅ Pros:
- [优点1]
- [优点2]

❌ Cons:
- [缺点1]
- [缺点2]

### [B] Pros and Cons
...

## Which Should You Choose?

### Choose [A] if:
- [场景1]
- [场景2]

### Choose [B] if:
- [场景1]
- [场景2]

## FAQ
...

## Conclusion
[总结性推荐]
```

### 指南类内容模板

```markdown
# How to [动作]: Complete Guide

## What You'll Learn
- [学习点1]
- [学习点2]
- [学习点3]

## Prerequisites
[前提条件或背景知识]

## Step 1: [步骤名称]

### What to Do
[具体操作]

### Why It Matters
[原因解释]

### Tips
- [提示1]
- [提示2]

## Step 2: [步骤名称]
...

## Common Mistakes to Avoid
1. **[错误1]** - [如何避免]
2. **[错误2]** - [如何避免]

## Expert Tips
> "[专家引言]" — [专家姓名, 职位]

## Checklist
- [ ] [检查项1]
- [ ] [检查项2]
- [ ] [检查项3]

## FAQ
...

## Next Steps
[后续行动建议]
```

---

## 🏷️ 语义标记规范

### HTML语义结构

```html
<article>
  <header>
    <h1>主标题</h1>
    <p class="summary">文章摘要</p>
  </header>
  
  <section>
    <h2>章节标题</h2>
    <p>段落内容</p>
    
    <figure>
      <img src="..." alt="描述性alt文本">
      <figcaption>图片说明</figcaption>
    </figure>
    
    <table>
      <caption>表格标题</caption>
      <thead>...</thead>
      <tbody>...</tbody>
    </table>
  </section>
  
  <aside>
    <h3>相关信息</h3>
    ...
  </aside>
  
  <footer>
    <p>作者信息、发布日期等</p>
  </footer>
</article>
```

### React组件对应

```tsx
// 使用语义化组件
import { Heading } from "@/components/ui/heading";

<article>
  <Heading level={1}>主标题</Heading>
  
  <section>
    <Heading level={2}>章节标题</Heading>
    <p>内容...</p>
  </section>
  
  <aside>
    <Heading level={3}>相关信息</Heading>
  </aside>
</article>
```

---

## 📊 信息密度优化

### 核心信息前置

```markdown
❌ 不好的写法:
在医疗影像领域，CT扫描仪经历了多年的发展，从最初的...
（读者需要读很久才能获取关键信息）

✅ 好的写法:
**CT扫描仪价格范围：$75,000 - $2,500,000**

价格因素包括：
- 切片数（16片/64片/128片/256片）
- 品牌（西门子、GE、联影等）
- 新旧程度（新机/翻新机）
...
```

### 信息层次

```markdown
第1层 - 直接回答（标题后立即）
第2层 - 关键支撑点（要点列表）
第3层 - 详细解释（段落）
第4层 - 补充信息（示例、数据）
第5层 - 参考资料（来源、链接）
```

### 可扫描性设计

```markdown
增强可扫描性:
✅ 使用粗体突出关键词
✅ 使用列表呈现并列信息
✅ 使用表格对比数据
✅ 使用短段落（3-4句）
✅ 使用清晰的小标题
✅ 使用数字和统计

❌ 避免:
- 大段纯文字
- 模糊的表述
- 缺少视觉层次
- 信息不分主次
```

---

## 🔗 内部链接结构

### 链接策略

```markdown
每篇内容应包含:
- 2-3个指向相关产品/类别页的链接
- 1-2个指向深入指南的链接
- 1个指向联系/询价页的链接

锚文本规范:
✅ "查看完整的CT扫描仪规格对比"
✅ "了解更多关于联影CT扫描仪"
❌ "点击这里"
❌ "了解更多"
```

### 内容聚类

```markdown
Topic Cluster示例:

Pillar: CT Scanner Buying Guide
├── Cluster: CT Scanner Types
├── Cluster: CT Scanner Brands
├── Cluster: CT Scanner Pricing
├── Cluster: CT Scanner Specs
└── Cluster: CT Scanner Maintenance

每个Cluster页面链接到:
- Pillar页面
- 相邻Cluster页面
- 相关产品页
```

---

## ✅ 内容质量检查清单

### 发布前检查

```markdown
结构检查:
- [ ] 只有一个H1
- [ ] H标签层级正确（无跳级）
- [ ] 有摘要/导言部分
- [ ] 有明确的章节划分
- [ ] 有总结/结论部分

信息检查:
- [ ] 核心信息前置
- [ ] 关键数据有来源
- [ ] 无过时信息
- [ ] 无事实错误

可读性检查:
- [ ] 段落不超过4-5句
- [ ] 有列表/表格辅助
- [ ] 有粗体突出关键词
- [ ] 语言简洁清晰

SEO检查:
- [ ] 关键词自然分布
- [ ] 有足够的内部链接
- [ ] 图片有Alt文本
- [ ] Meta信息完整
```

---

## 🔗 相关文档

- [AI Overview优化](./ai-overview-optimization.md)
- [内容结构指南](../02-on-page-seo/content-structure-guide.md)
- [结构化数据参考](../03-technical-seo/structured-data-reference.md)

---

**文档版本**: v1.0  
**创建日期**: 2026-01-03
