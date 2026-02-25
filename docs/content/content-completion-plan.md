# 内容补齐计划 - 基于动态内容渲染架构

## 项目背景

基于 `docs/plan/dynamic-pages-architecture.md` 的架构设计和 `docs/plan/PROJECT_STATUS_MASTER.md` 的完成状态，我们需要系统性地补齐静态内容（Markdown文件）和数据库内容，以支持动态内容渲染系统。

## 当前状态分析

### ✅ 已完成的架构
- 动态页面系统（5个动态页面替代11个静态页面）
- 混合内容架构（数据库 + Markdown）
- URL重定向策略
- 基础数据库结构

### 🔄 需要补齐的内容

#### 1. 静态内容（Markdown文件）
- **教育内容** (TOFU): 基础知识、科普文章
- **对比内容** (MOFU): 品牌对比、技术对比
- **指南内容** (MOFU): 选购指南、采购指南
- **案例研究** (MOFU): 客户案例、成功故事

#### 2. 数据库内容
- **设备数据**: 完善设备规格、价格、评价
- **制造商数据**: 补充制造商信息
- **对比数据**: 品牌对比评分和标准
- **客户案例**: 实际客户部署案例

## 内容补齐优先级

### Phase 1: 核心TOFU内容（教育科普）- 立即执行
**目标**: 满足高增长搜索需求，基于Google Trends数据

1. **MRI教育内容** - 匹配+4,700%搜索增长
   - `content/education/en/what-is-mri-complete.md` - 完整MRI指南
   - `content/education/en/mri-vs-ct-detailed.md` - MRI vs CT详细对比
   - `content/education/en/mri-safety-guide.md` - MRI安全指南
   - `content/education/en/mri-preparation-complete.md` - MRI检查准备

2. **CT教育内容** - 基础科普
   - `content/education/en/ct-scanner-complete-guide.md` - CT完整指南
   - `content/education/en/ct-scan-process.md` - CT扫描流程
   - `content/education/en/ct-safety-radiation.md` - CT辐射安全

3. **价格教育内容** - 匹配+2,100%价格查询增长
   - `content/education/en/mri-scan-cost-complete.md` - MRI扫描费用完整指南
   - `content/education/en/ct-scanner-price-guide.md` - CT设备价格指南
   - `content/education/en/medical-imaging-costs.md` - 医学影像费用对比

### Phase 2: 核心MOFU内容（对比评估）- 1-2周内
**目标**: 支持用户决策过程

1. **品牌对比内容**
   - `content/comparisons/en/philips-vs-siemens-ct.md` - 飞利浦vs西门子
   - `content/comparisons/en/ge-vs-philips-mri.md` - GE vs 飞利浦MRI
   - `content/comparisons/en/united-imaging-vs-siemens.md` - 联影vs西门子

2. **技术对比内容**
   - `content/comparisons/en/16-slice-vs-64-slice-ct.md` - 16层vs64层CT
   - `content/comparisons/en/1.5t-vs-3t-mri.md` - 1.5T vs 3T MRI
   - `content/comparisons/en/new-vs-refurbished-ct.md` - 新设备vs翻新设备

3. **选购指南内容**
   - `content/guides/en/mri-buying-guide.md` - MRI选购指南
   - `content/guides/en/hospital-ct-selection.md` - 医院CT选择指南
   - `content/guides/en/equipment-financing-guide.md` - 设备融资指南

### Phase 3: 数据库内容补齐 - 2-3周内
**目标**: 支持动态页面数据驱动

1. **设备数据补齐**
   - 完善现有设备的详细规格
   - 添加缺失的主流设备型号
   - 补充价格范围和市场数据

2. **制造商数据完善**
   - 补充制造商详细信息
   - 添加技术优势和市场定位
   - 完善服务网络信息

3. **对比数据建立**
   - 创建品牌对比评分数据
   - 建立对比标准和权重
   - 添加专家评价和用户反馈

### Phase 4: 案例研究和高级内容 - 3-4周内
**目标**: 建立权威性和信任度

1. **客户案例内容**
   - `content/case-studies/en/hospital-ct-upgrade.md` - 医院CT升级案例
   - `content/case-studies/en/multi-site-deployment.md` - 多院区部署案例
   - `content/case-studies/en/cost-optimization.md` - 成本优化案例

2. **深度分析内容**
   - `content/analysis/en/china-ct-market-2024.md` - 中国CT市场分析
   - `content/analysis/en/mri-technology-trends.md` - MRI技术趋势
   - `content/analysis/en/medical-imaging-future.md` - 医学影像未来

## 内容创建标准

### Markdown文件结构标准
```yaml
---
# 基础信息
title: "页面标题"
description: "页面描述"
slug: "url-slug"
category: "education|comparison|guide|case-study|analysis"
contentType: "具体内容类型"
funnelStage: "tofu|mofu|bofu"

# SEO优化
seo:
  title: "SEO标题"
  description: "SEO描述"
  keywords: "关键词列表"
  canonical: "规范URL"

# 内容元数据
publishedAt: "发布时间"
updatedAt: "更新时间"
author: "作者"
readingTime: "阅读时间（分钟）"
wordCount: "字数"

# 关联数据（引用数据库）
relatedDevices: ["设备slug列表"]
relatedManufacturers: ["制造商slug列表"]
relatedContent: ["相关内容slug列表"]

# 多语言
translations:
  en: "/en/path/"
  zh: "/zh/path/"
---

# 内容正文
```

### 内容质量标准
1. **字数要求**: 
   - 教育内容: 2000-4000字
   - 对比内容: 3000-5000字
   - 指南内容: 2500-4000字
   - 案例研究: 1500-2500字

2. **SEO优化**:
   - 目标关键词密度: 1-2%
   - 长尾关键词覆盖: 5-10个
   - 内链数量: 5-10个
   - 外链引用: 2-5个权威来源

3. **用户体验**:
   - 清晰的标题结构 (H1-H6)
   - 要点列表和表格
   - 图片和图表支持
   - FAQ部分
   - CTA引导

## 数据库内容补齐计划

### 1. 设备数据补齐
```sql
-- 需要补齐的设备数据字段
ALTER TABLE devices ADD COLUMN IF NOT EXISTS:
- detailed_specifications JSONB
- clinical_applications TEXT[]
- key_features TEXT[]
- target_market VARCHAR(100)
- competitive_advantages TEXT
- typical_price_range VARCHAR(100)
```

### 2. 制造商数据补齐
```sql
-- 需要补齐的制造商数据
UPDATE manufacturers SET:
- technical_advantages = '详细技术优势'
- service_scope = '服务范围描述'
- market_positioning = '市场定位'
- competitive_strengths = '竞争优势'
```

### 3. 对比数据建立
```sql
-- 创建品牌对比数据
INSERT INTO brand_comparisons (
  brand_a_id, brand_b_id, category, comparison_slug,
  各项评分数据...
);

-- 创建详细对比标准
INSERT INTO comparison_criteria (
  comparison_id, category, criterion_name,
  brand_a_score, brand_b_score, weight, description
);
```

## 实施时间表

### Week 1: TOFU教育内容
- Day 1-2: MRI完整教育内容 (4篇)
- Day 3-4: CT教育内容 (3篇)
- Day 5-7: 价格教育内容 (3篇)

### Week 2: MOFU对比内容
- Day 1-3: 品牌对比内容 (3篇)
- Day 4-5: 技术对比内容 (3篇)
- Day 6-7: 选购指南内容 (3篇)

### Week 3: 数据库内容
- Day 1-2: 设备数据补齐
- Day 3-4: 制造商数据完善
- Day 5-7: 对比数据建立

### Week 4: 案例研究和优化
- Day 1-3: 客户案例内容 (3篇)
- Day 4-5: 深度分析内容 (3篇)
- Day 6-7: 内容优化和测试

## 成功指标

### 内容指标
- **内容数量**: 30+篇高质量Markdown文件
- **字数总计**: 80,000+字
- **SEO覆盖**: 100+目标关键词
- **内链网络**: 200+内部链接

### 数据库指标
- **设备数据**: 100+设备完整信息
- **制造商数据**: 20+制造商详细资料
- **对比数据**: 10+品牌对比完整数据
- **案例数据**: 50+客户案例记录

### 技术指标
- **页面加载**: <3秒加载时间
- **SEO评分**: 90+分SEO评分
- **移动适配**: 100%移动友好
- **内容质量**: 95%+内容完整度

## 下一步行动

1. **立即开始**: Phase 1 TOFU教育内容创建
2. **并行进行**: 数据库结构优化和数据导入
3. **持续监控**: 内容质量和SEO效果
4. **迭代优化**: 基于用户反馈和数据分析

这个计划将在4周内完成核心内容补齐，支持动态内容渲染系统的全面运行，并为SEO增长奠定坚实基础。