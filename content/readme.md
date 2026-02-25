---
title: Markdown 内容管理规范
description: "Markdown 内容管理规范\r \r 本文档定义了  目录下所有 Markdown 内容的组织结构、Frontmatter 字段标准以及写作排版规范。本系统采用了垂直节奏协议 (Vertical Rhythm Protocol) 和 宽度分层架构 (Breakout Tiers)，请严格遵守以下规范以确保最佳阅读体验。\r \r 0. 去 AI..."
slug: readme
category: readme.md
tags: []
status: published
seo:
  title: Markdown 内容管理规范
  description: "Markdown 内容管理规范\r \r 本文档定义了  目录下所有 Markdown 内容的组织结构、Frontmatter 字段标准以及写作排版规范。本系统采用了垂直节奏协议 (Vertical Rhythm Protocol) 和 宽度分层架构 (Breakout Tiers)，请严格遵守以下规范以确保最佳阅读体验。\r \r 0. 去 AI..."
  keywords: ''
  canonical: ''
readingTime: 3
contentType: guide
---

# Markdown 内容管理规范

本文档定义了 `content/` 目录下所有 Markdown 内容的组织结构、Frontmatter 字段标准以及写作排版规范。本系统采用了**垂直节奏协议 (Vertical Rhythm Protocol)** 和 **宽度分层架构 (Breakout Tiers)**，请严格遵守以下规范以确保最佳阅读体验。

## 0. 去 AI 痕迹写作规范（必读）

为保证内容自然、可信、可引用，创建或改写内容时必须遵循：

- 去 AI 痕迹写作指南：`docs/content/humanized-SKILL.md`
- 不同内容类型写作技巧与验收清单：`docs/content/content-guides/`

最低要求：
- 删除填充短语与模板化开场白，首段直接回答标题承诺
- 打散公式结构，避免“三段式强迫症”“挑战与展望”模板与口号式结尾
- 避免“粗体标题：解释”竖排列表，能合并成自然句就合并
- 关键事实必须可复查：数字带单位与口径；涉及价格/政策/统计时提供权威来源与访问日期

## 1. 目录结构

所有内容文件必须遵循以下路径格式：

```
content/
├── {category}/          # 内容分类 (e.g., learn, guides, reports, history)
│   ├── {locale}/        # 语言代码 (e.g., en, zh)
│   │   ├── {slug}.md    # 内容文件 (文件名即 URL slug)
│   │   └── ...
│   └── ...
└── ...
```

**示例**:
- `content/learn/en/what-is-mri.md` -> 对应 URL `/learn/what-is-mri`
- `content/guides/en/financing.md` -> 对应 URL `/guides/financing`

---

## 2. Frontmatter 规范 (YAML Header)

每个 Markdown 文件必须包含 YAML Frontmatter。以下是完整字段定义：

### 基础字段 (Required)

```yaml
---
id: "unique-id"      # (Optional) 用于内部引用，通常与 slug 一致
title: "文章标题"
description: "文章简短描述，用于列表页展示"
slug: "what-is-mri"  # 必须与文件名一致
category: "learn"    # 必须与目录名一致
tags: ["tag1", "tag2"] # 文章标签
status: "published"  # draft | published | archived
publishedAt: "2025-03-20"
updatedAt: "2025-03-25"
author: "Author Name"
readingTime: 15      # 分钟数
difficulty: "intermediate" # beginner | intermediate | advanced
contentType: "guide" # guide | tutorial | reference | analysis | report
---
```

### SEO 字段 (Required)

```yaml
seo:
  title: "SEO 优化标题 (通常比文章标题更长)"
  description: "Meta description，用于搜索引擎展示 (150-160字符)"
  keywords: "mri, medical imaging, scanner"
  canonical: "/learn/what-is-mri" # 规范链接
```

### EEAT 专业性字段 (Recommended for Medical Content)

为提升 Google EEAT (Experience, Expertise, Authoritativeness, Trustworthiness) 评分，请尽量提供以下字段：

```yaml
# 作者增强信息
authorBio: "Detailed biography of the author establishing their expertise."
authorCredentials: "MD, PhD, Radiologist" # 作者专业资质

# 审核人信息
reviewer:
  name: "Dr. Sarah Chen"
  title: "Chief Radiologist"
  profileUrl: "/experts/dr-sarah-chen" # 可选

lastReviewedAt: "2025-03-25" # 最后医学审核时间

# 内容定位
medicalSpecialty: ["Radiology", "Oncology"] # 涉及的医学专科
audience: "Patient" # Patient | Medical Professional | Investor

# 参考文献与引用
citations:
  - text: "RSNA Guidelines 2025"
    url: "https://www.rsna.org/..."
  - text: "Medical Physics Journal, Vol 45"
    # url 可选
```

### 市场报告特定字段 (仅 Reports 类)

```yaml
reportType: "market_analysis" # market_analysis | expert_insight
type: "CT"       # CT | MRI | Comprehensive
region: "China"
year: 2025
quarter: "Q1"
downloadCount: "2,341" # 下载次数 (Display only)
relatedReports:        # 相关报告推荐
  - id: "related-report-id"
    title: "Related Report Title"
    slug: "related-report-slug"
    date: "2025-01-15"
```

---

## 3. 排版与写作规范 (Rendering Engine)

本站渲染引擎采用 **Cinematic Typography** 系统，内容会根据元素类型自动应用不同的宽度层级。

### 宽度分层 (Breakout Tiers)

| 层级 | 宽度 | 适用元素 | 写作建议 |
| :--- | :--- | :--- | :--- |
| **Tier 1: Focus** | **720px** | 正文段落 (`p`)<br>列表 (`ul`, `ol`) | 保持简洁，专注于阅读体验。黄金阅读宽度。 |
| **Tier 2: Rhythm** | **800px** | 标题 (`h1`-`h4`)<br>引用 (`blockquote`) | 标题用于建立视觉锚点。**引用块被设计为 Strong Lead**，用于强调核心观点。 |
| **Tier 3: Cinematic** | **1000px** | 图片 (`img`)<br>代码块 (`code`)<br>表格 (`table`) | **破框展示**。使用高分辨率图片和复杂表格，系统会自动扩展宽度以获得沉浸感。 |

### 垂直节奏 (Vertical Rhythm)

*   **段落**: 段落间距为 `2.5rem`。请适当分段，避免大段文字。
*   **列表**: 遵循 **2:1 间距法则**。列表项之间有 `1.25rem` 间距。有序列表自动启用表格数字对齐 (`tabular-nums`)。
*   **标题**: 标题上方有较大留白 (`4rem`)，下方较小 (`1.5rem`)，用于明确区分章节。

---

## 4. 组件使用指南

### 强调引用 (Strong Lead)

使用标准 Markdown 引用语法 `>`，会被渲染为 **Tier 2** 宽度的醒目引导块，适合放在章节开头或用于强调关键结论。

```markdown
> CT 扫描仪的核心在于其探测器效率，这直接决定了图像质量与辐射剂量的平衡。
```

### 代码块 (Cinematic Code)

使用标准三撇号语法。系统会自动渲染为带有 macOS 风格窗口控制点的 **Tier 3** 宽幅容器，并支持一键复制。

    ```json
    {
      "key": "value"
    }
    ```

### 表格 (Cinematic Table)

标准 Markdown 表格会被渲染为 **Tier 3** 全宽容器，支持水平滚动，带有阴影和圆角。

```markdown
| 参数 | 64排 CT | 128排 CT |
| :--- | :--- | :--- |
| 覆盖范围 | 40mm | 80mm |
| 心脏扫描 | 需要屏气 | 单心动周期 |
```

### 图片 (Cinematic Image)

直接使用标准 Markdown 图片语法。图片会自动应用 **Tier 3** 宽度、圆角和阴影。支持 `title` 属性作为图片说明 (Caption)。

```markdown
![GE Revolution CT 扫描仪](/images/ge-revolution.jpg "GE Revolution Apex CT Scanner - Side View")
```

---

## 5. 维护与工作流

1.  **新建内容**: 复制现有文件作为模板，确保 Frontmatter 完整。
2.  **图片资源**: 存放在 `public/images/content/{category}/` 目录下。
3.  **URL 规划**: 文件名 (`slug`) 一旦确定，尽量不要修改，以免破坏 SEO 链接权重。如需修改，请配置 301 重定向。
