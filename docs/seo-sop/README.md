# SEO 标准化操作流程（SOP）文档体系

> "SEO is a compounding, long-term growth channel." — SEO 是复利型的长期增长渠道。

## 📋 文档总览

本文档体系基于 **100条SEO检查清单** 构建，涵盖关键词系统、页面优化、技术SEO、外链建设、内容维护和国际化SEO六大模块，为中国CT/MRI医疗设备出口网站提供完整的SEO执行协议。

## 🎯 核心目标

1. **搜索可见性**：提升国际市场（欧美、中东、东南亚）的搜索排名
2. **流量增长**：通过结构化内容和Topic Cluster策略获取高质量流量
3. **转化优化**：从关键词 → 流量 → 询价 → 成交的完整闭环
4. **AI可见性**：适应AI Overview时代，优化结构化数据和内容格式

## 📁 文件夹结构

```
docs/seo-sop/
├── README.md                           # 本文件 - SOP总览
├── 00-master-checklist.md              # 100条检查清单主表
│
├── 01-keyword-content-system/          # 模块A：关键词系统与内容体系
│   ├── keyword-research-sop.md         # 关键词研究SOP
│   ├── topic-cluster-strategy.md       # Topic Cluster策略
│   ├── content-brief-template.md       # 内容Brief模板
│   └── keyword-tracking-sheet.md       # 关键词追踪表
│
├── 02-on-page-seo/                     # 模块B：On-page SEO
│   ├── on-page-checklist.md            # 页面优化检查清单
│   ├── title-meta-guidelines.md        # Title/Meta规范
│   ├── content-structure-guide.md      # 内容结构指南
│   └── cta-placement-strategy.md       # CTA布局策略
│
├── 03-technical-seo/                   # 模块C：技术SEO
│   ├── technical-audit-sop.md          # 技术审计SOP
│   ├── core-web-vitals-guide.md        # Core Web Vitals指南
│   ├── structured-data-reference.md    # 结构化数据参考
│   └── mobile-optimization.md          # 移动端优化
│
├── 04-off-page-seo/                    # 模块D：外链与品牌
│   ├── link-building-sop.md            # 外链建设SOP
│   ├── haro-outreach-template.md       # HARO回复模板
│   ├── guest-post-pitch-template.md    # Guest Post Pitch模板
│   └── directory-submission-list.md    # 目录站提交清单
│
├── 05-content-maintenance/             # 模块E：内容维护
│   ├── content-calendar-template.md    # 内容日历模板
│   ├── content-refresh-sop.md          # 内容更新SOP
│   └── competitor-page-templates.md    # 竞品对比页模板
│
├── 06-international-seo/               # 模块F：国际化SEO
│   ├── i18n-seo-checklist.md           # 国际化检查清单
│   └── market-keyword-research.md      # 市场关键词研究
│
├── monitoring/                         # 监控与报告
│   ├── gsc-monitoring-sop.md           # GSC监控SOP
│   ├── weekly-report-template.md       # 周报告模板
│   └── conversion-tracking-setup.md    # 转化追踪设置
│
└── ai-seo-strategy/                    # AI时代SEO策略
    ├── ai-overview-optimization.md     # AI Overview优化
    └── structured-content-guide.md     # 结构化内容指南
```

## 🔗 与项目现有文档的关系

| 现有文档 | 关联SOP模块 | 说明 |
|---------|------------|------|
| `docs/seo-structured-data-checklist.md` | 03-technical-seo | Schema实施参考 |
| `docs/sitemap-strategy.md` | 03-technical-seo | Sitemap生成策略 |
| `docs/url-structure-internal-linking.md` | 02-on-page-seo | URL和内链规范 |
| `scripts/optimize-h-tags.md` | 02-on-page-seo | H标签优化指南 |
| `src/config/site.ts` | 全局配置 | 站点配置单一来源 |
| `src/lib/structuredData.ts` | 03-technical-seo | Schema生成工具库 |
| `src/config/language.ts` | 06-international-seo | 多语言路由配置 |

## 📊 执行优先级

### P0 - 立即执行（影响索引和排名）
- [ ] 100条检查清单自查
- [ ] 关键页面Title/Meta优化
- [ ] Core Web Vitals达标
- [ ] XML Sitemap提交GSC

### P1 - 短期执行（1-4周）
- [ ] Topic Cluster规划
- [ ] 内链策略实施
- [ ] 结构化数据完善
- [ ] 内容Brief模板启用

### P2 - 中期执行（1-3个月）
- [ ] 外链建设启动
- [ ] 内容日历执行
- [ ] 竞品对比页创建
- [ ] GSC监控流程化

### P3 - 长期执行（持续）
- [ ] 每周2-3篇高质量内容
- [ ] 每月5次HARO回复
- [ ] 每季度外链审计
- [ ] 每6-12个月内容刷新

## 📈 核心KPI

| 指标 | 目标 | 监控频率 |
|------|------|---------|
| 关键词排名Top 10 | 50+ | 每周 |
| 自然搜索流量 | MoM +15% | 每月 |
| 索引页面数 | 100% | 每周 |
| Core Web Vitals | 全部通过 | 每周 |
| 询价转化率 | 3%+ | 每月 |
| 高质量外链 | 每月+5 | 每月 |

## 🛠 工具清单

### 必备工具
- **Google Search Console** - 索引监控、排名追踪
- **Google Analytics 4** - 流量分析、转化追踪
- **PageSpeed Insights** - Core Web Vitals测试

### 推荐工具
- **Ahrefs/Semrush** - 关键词研究、竞品分析
- **Screaming Frog** - 技术SEO审计
- **Schema Validator** - 结构化数据验证

### AI工具
- **ChatGPT/Claude** - 内容Brief生成、Outline优化
- **Perplexity** - 行业研究、竞品分析

## 📝 使用指南

### 新手入门
1. 阅读 `00-master-checklist.md` 了解完整检查项
2. 按照P0优先级逐项自查
3. 使用各模块的SOP文档执行优化

### 日常运营
1. 每周查看 `monitoring/gsc-monitoring-sop.md`
2. 按照 `05-content-maintenance/content-calendar-template.md` 发布内容
3. 使用 `01-keyword-content-system/content-brief-template.md` 规划新内容

### 问题排查
1. 排名下降 → 查看技术SEO审计SOP
2. 流量下滑 → 分析关键词排名变化
3. 转化率低 → 优化CTA布局策略

---

**文档版本**: v1.0  
**创建日期**: 2026-01-01  
**维护者**: SEO Team  
**下次更新**: 每季度审查
