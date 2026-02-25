# 内容结构与内链规范

> 优质的内容结构提升用户体验和搜索引擎理解，合理的内链策略传递页面权重并引导用户旅程

---

## 一、H标签层级结构

### 1.1 层级规范

```
H1: 页面主标题（唯一，包含主关键词）
├── H2: 主要章节（3-8个）
│   ├── H3: 子章节（每个H2下0-5个）
│   │   └── H4: 细分内容（谨慎使用）
│   └── H3: 子章节
├── H2: 主要章节
└── H2: FAQ区域（推荐）
```

### 1.2 H标签关键词分配

| 标签级别 | 关键词类型 | 示例 |
|----------|------------|------|
| H1 | 主关键词 | "CT Scanner Buying Guide" |
| H2 | 次级关键词/长尾词 | "How to Choose CT Scanner Slice Count" |
| H3 | 长尾词/问题词 | "What is the difference between 64 and 128 slice?" |
| H4 | 细分主题 | "Cardiac imaging capabilities" |

### 1.3 项目实现

使用统一的 `Heading` 组件确保语义正确：

```tsx
import { Heading } from '@/components/ui/heading';

// 页面结构示例
<article>
  <Heading level={1}>CT Scanner Buying Guide 2025</Heading>
  
  <section>
    <Heading level={2}>Understanding CT Scanner Types</Heading>
    <p>Content...</p>
    
    <Heading level={3}>Single-Slice vs Multi-Slice CT</Heading>
    <p>Content...</p>
  </section>
  
  <section>
    <Heading level={2}>Frequently Asked Questions</Heading>
    {/* FAQ items */}
  </section>
</article>
```

---

## 二、内容结构模板

### 2.1 产品详情页结构

```markdown
# [产品名称] - [核心卖点]

## 产品概述
[150-200字产品介绍，包含主关键词]

## 核心特性
- 特性1: [描述]
- 特性2: [描述]
- 特性3: [描述]

## 技术规格
[规格表格]

## 应用场景
### 场景1
### 场景2

## 价格与配置
[价格区间、配置选项]

## 客户评价
[真实案例/testimonials]

## 相关产品
[内链到3-5个相关产品]

## 常见问题 (FAQ)
### Q1: [问题]
### Q2: [问题]

## 获取报价
[CTA区域]
```

### 2.2 列表/对比页结构

```markdown
# [数量] Best [品类] in [年份]

## 快速对比表
[对比表格，包含关键指标]

## 评选标准
[解释如何评选，建立可信度]

## 详细评测
### 1. [产品名] - [一句话定位]
[200-300字评测]
**优点**: ...
**缺点**: ...
**最适合**: ...

### 2. [产品名] - [一句话定位]
...

## 如何选择适合你的[品类]
[购买指南内容]

## 常见问题 (FAQ)

## 结论与推荐
[总结性内容 + CTA]
```

### 2.3 指南/教程页结构

```markdown
# How to [动作] [对象] - [年份] Guide

## 快速概览 (TL;DR)
[50-100字核心要点]

## 目录
[可跳转的内容目录]

## 为什么重要
[问题背景和痛点]

## 步骤详解
### Step 1: [步骤名]
### Step 2: [步骤名]
### Step 3: [步骤名]

## 专家建议
[E-E-A-T内容：经验分享、专业见解]

## 常见错误
[避坑指南]

## 工具与资源
[相关资源链接]

## FAQ

## 下一步行动
[CTA]
```

---

## 三、内链策略

### 3.1 内链数量标准

| 页面类型 | 内容长度 | 建议内链数 |
|----------|----------|------------|
| 短页面 | <500字 | 5-8个 |
| 中等页面 | 500-1500字 | 8-15个 |
| 长页面 | >1500字 | 15-25个 |
| 支柱页 | >3000字 | 25-40个 |

### 3.2 内链类型

#### A. 导航型内链
位置：页面顶部/侧边栏
```tsx
<nav>
  <Link href="/ct-scanners">CT Scanners</Link>
  <Link href="/mri-machines">MRI Machines</Link>
</nav>
```

#### B. 上下文内链
位置：正文内容中
```tsx
<p>
  When choosing a CT scanner, consider the 
  <Link href="/guides/ct-scanner-slice-count">slice count specifications</Link> 
  and <Link href="/guides/ct-dose-reduction">dose reduction technology</Link>.
</p>
```

#### C. 相关内容内链
位置：页面底部
```tsx
<RelatedDevices 
  currentDevice={device}
  maxItems={6}
/>
```

#### D. 面包屑内链
位置：页面顶部
```tsx
<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'CT Scanners', href: '/ct-scanners' },
    { label: 'Siemens', href: '/manufacturers/siemens' },
  ]}
/>
```

### 3.3 锚文本规范

#### ✅ 最佳实践

| 锚文本类型 | 示例 | 使用场景 |
|------------|------|----------|
| 精确匹配 | "CT scanner prices" | 目标页主关键词 |
| 部分匹配 | "compare CT scanner pricing options" | 自然融入句子 |
| 品牌锚文本 | "Siemens SOMATOM" | 品牌/产品页 |
| 长尾锚文本 | "how to choose a 64-slice CT scanner" | 指南页 |

#### ❌ 避免

| 问题 | 示例 | 原因 |
|------|------|------|
| 通用锚文本 | "click here", "read more" | 无SEO价值 |
| 过度优化 | 所有链接都用相同锚文本 | 可能被判定为操纵 |
| 无关锚文本 | 锚文本与目标页无关 | 用户体验差 |

### 3.4 Topic Cluster 内链模式

```
                    ┌─────────────────┐
                    │   支柱页 (Pillar) │
                    │  CT Scanner Guide │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  集群页 A      │  │  集群页 B      │  │  集群页 C      │
│ CT Slice Count │◄─►│ CT Scanner Price│◄─►│ CT Dose Guide │
└───────────────┘  └───────────────┘  └───────────────┘
        │                    │                    │
        └────────────────────┴────────────────────┘
                    （集群页之间互链）
```

**实现规则**：
1. 每个集群页都链接到支柱页
2. 支柱页链接到所有集群页
3. 相关集群页之间互链
4. 使用语义化锚文本

---

## 四、内链组件使用

### 4.1 InternalLinking 组件

```tsx
import InternalLinking from '@/components/InternalLinking';

// 在页面底部使用
<InternalLinking
  currentPath="/devices/siemens-somatom-go-top"
  category="ct-scanner"
  maxLinks={8}
/>
```

### 4.2 RelatedDevices 组件

```tsx
import RelatedDevices from '@/components/RelatedDevices';

<RelatedDevices
  currentDevice={device}
  sameManufacturer={true}
  sameType={true}
  maxItems={6}
/>
```

### 4.3 Breadcrumb 组件

```tsx
import Breadcrumb from '@/components/Breadcrumb';

<Breadcrumb
  items={[
    { label: t('home'), href: '/' },
    { label: t('devices'), href: '/devices' },
    { label: device.name, href: `/devices/${device.slug}` },
  ]}
/>
```

---

## 五、内容质量标准

### 5.1 E-E-A-T 检查清单

| 维度 | 检查项 | 实现方式 |
|------|--------|----------|
| **Experience (经验)** | 包含真实使用案例 | 客户案例、截图、数据 |
| **Expertise (专业)** | 技术深度足够 | 专业术语解释、规格分析 |
| **Authoritativeness (权威)** | 引用权威来源 | 学术论文、官方数据 |
| **Trustworthiness (可信)** | 信息准确可验证 | 更新日期、数据来源 |

### 5.2 可读性标准

| 指标 | 目标值 |
|------|--------|
| 平均段落长度 | 3-5句 |
| 平均句子长度 | 15-25词 |
| 列表使用 | 每500字至少1个 |
| 图片/表格 | 每800字至少1个 |
| 小节标题 | 每300-500字1个 |

### 5.3 关键词密度

| 关键词类型 | 建议密度 | 位置要求 |
|------------|----------|----------|
| 主关键词 | 1-2% | 首段、H1、结尾段 |
| 次级关键词 | 0.5-1% | H2、正文自然分布 |
| 长尾关键词 | 各1-2次 | H3、FAQ |

---

## 六、审计工具

### 6.1 H标签检查

```javascript
// 控制台检查H标签结构
const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
headings.forEach(h => console.log(h.tagName, h.textContent));
```

### 6.2 内链检查

```javascript
// 统计页面内链数量
const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="' + location.origin + '"]');
console.log('Internal links count:', internalLinks.length);
```

### 6.3 Screaming Frog 批量审计

1. 爬取网站
2. 导出 `H1` 和 `H2` 报告
3. 导出 `Inlinks` 报告
4. 检查孤岛页面（0 incoming links）

---

*最后更新: 2025-01*
*维护人: SEO Team*
