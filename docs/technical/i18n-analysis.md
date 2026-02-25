# [LEGACY] 多语言翻译Key分析文档
> 规范更新：本项目采用“顶层命名空间 + 相对键 + ns:key（跨命名空间）”方案；不再使用 pages.* 前缀。页面内优先 useTranslation('ns') 后写相对键（如 hero.title），跨命名空间使用 ns:key（如 navigation:compare）。顶层命名空间需与 locales/{lang}/index.ts 保持一致（如 pricing、resourceCenter、navigation）。

> **注意**: 本文档描述了早期的多语言分析。关于最新的国际化标准（包括 Adobe 风格的跳转策略和根域名规则），请参阅 `development-standards.md`。

## 当前i18n配置结构

### 已有翻译命名空间
- `common`: 通用词汇（按钮、操作等）
- `navigation`: 导航菜单项
- `footer`: 页脚内容
- `breadcrumb`: 面包屑导航
- `devices`: 设备相关术语
- `manufacturers`: 制造商相关术语
- `seo`: SEO元数据

---

## 各页面翻译Key使用情况

### ✅ 已完全国际化的页面

#### 1. Header 组件
**文件**: `src/components/Header.tsx`
**使用的Keys**:
- `common.devices`
- `common.manufacturers`
- `common.knowledgeCenter`
- `common.marketAnalysis`

#### 2. Footer 组件
**文件**: `src/components/Footer.tsx`
**使用的Keys**:
- `footer.brandDescription`
- `footer.quickLinks`
- `footer.knowledgeCenter`
- `footer.analysisReports`
- `footer.companyInfo`
- `footer.email`
- `footer.phone`
- `footer.address`
- `footer.ctManufacturers`
- `footer.mriManufacturers`
- `footer.marketReport`
- `footer.brandComparison`
- `footer.priceAnalysis`
- `common.allRightsReserved`
- `common.miitRecord`

#### 3. Breadcrumb 组件
**文件**: `src/components/Breadcrumb.tsx`
**使用的Keys**:
- `breadcrumb.knowledgeCenter`
- `breadcrumb.analysisReports`
- `breadcrumb.guidesCenter`
- `breadcrumb.developmentHistory`
- `breadcrumb.technologyComparison`
- `breadcrumb.authorityCenter`
- `breadcrumb.marketAnalysis`
- `breadcrumb.expertAnalysis`
- `breadcrumb.selectionGuide`
- `breadcrumb.importGuide`

#### 4. SEOHead 组件
**文件**: `src/components/SEOHead.tsx`
**使用的Keys**:
- `seo.defaultTitle`
- `seo.defaultDescription`
- `seo.keywords`

#### 5. AboutPage
**文件**: `src/pages/AboutPage.tsx`
**状态**: ✅ 已使用useTranslation
**使用的Keys**: 
- 需要补充keys（目前有使用t和i18n，但具体keys未列出）

#### 6. FinancingGuide
**文件**: `src/pages/FinancingGuide.tsx`
**状态**: ✅ 已使用useTranslation
**使用的Keys**: 需要补充

#### 7. MaintenanceGuide
**文件**: `src/pages/MaintenanceGuide.tsx`
**状态**: ✅ 已使用useTranslation
**使用的Keys**: 需要补充

---

### ❌ 需要国际化的页面

#### 核心页面

##### 1. Index (首页)
**文件**: `src/pages/Index.tsx`
**需要翻译的内容**:
```typescript
需要添加的keys:
home.hero.title: "全球医疗影像设备权威目录"
home.hero.subtitle: "专业的CT扫描仪与MRI系统信息平台"
home.stats.manufacturers: "制造商"
home.stats.devices: "设备型号"
home.stats.countries: "覆盖国家"
home.featured.title: "精选设备"
home.featured.viewAll: "查看全部设备"
home.manufacturers.title: "主要制造商"
home.manufacturers.viewAll: "查看全部制造商"
home.articles.title: "最新资讯"
home.articles.viewAll: "查看更多"
```

##### 2. Devices (设备列表)
**文件**: `src/pages/Devices.tsx`, `src/pages/DeviceList.tsx`, `src/pages/DeviceCollection.tsx`
**需要翻译的内容**:
```typescript
devices.pageTitle: "医疗影像设备目录"
devices.pageDescription: "浏览和比较全球领先的CT扫描仪和MRI系统"
devices.filters.all: "全部"
devices.filters.byManufacturer: "按制造商筛选"
devices.filters.byType: "按类型筛选"
devices.filters.byPriceRange: "按价格筛选"
devices.search.placeholder: "搜索设备名称或型号..."
devices.sort.newest: "最新"
devices.sort.popular: "最受欢迎"
devices.sort.priceLowToHigh: "价格从低到高"
devices.sort.priceHighToLow: "价格从高到低"
devices.comparison.title: "设备对比"
devices.comparison.add: "添加到对比"
devices.results.showing: "显示 {{count}} 个结果"
devices.results.noResults: "未找到匹配的设备"
```

##### 3. DeviceDetailPage (设备详情)
**文件**: `src/pages/DeviceDetailPage.tsx`
**需要翻译的内容**:
```typescript
deviceDetail.overview: "产品概述"
deviceDetail.specifications: "技术规格"
deviceDetail.features: "产品特性"
deviceDetail.pricing: "价格信息"
deviceDetail.manufacturer: "制造商信息"
deviceDetail.related: "相关设备"
deviceDetail.inquiry.title: "询价"
deviceDetail.inquiry.button: "立即询价"
deviceDetail.download.brochure: "下载产品手册"
deviceDetail.share.title: "分享"
```

##### 4. Manufacturers (制造商列表)
**文件**: `src/pages/Manufacturers.tsx`
**需要翻译的内容**:
```typescript
manufacturers.pageTitle: "制造商目录"
manufacturers.pageDescription: "了解全球医疗影像设备制造商"
manufacturers.stats.total: "总数"
manufacturers.stats.countries: "国家数"
manufacturers.stats.avgMarketShare: "平均市场份额"
manufacturers.filters.country: "按国家筛选"
manufacturers.filters.category: "按类别筛选"
manufacturers.filters.size: "按规模筛选"
manufacturers.card.viewProfile: "查看详情"
manufacturers.card.products: "产品"
manufacturers.card.marketShare: "市场份额"
```

##### 5. ManufacturerDetail (制造商详情)
**文件**: `src/pages/ManufacturerDetail.tsx`
**需要翻译的内容**:
```typescript
manufacturerDetail.overview: "公司概况"
manufacturerDetail.products: "主要产品"
manufacturerDetail.advantages: "技术优势"
manufacturerDetail.certifications: "资质认证"
manufacturerDetail.contactInfo: "联系方式"
manufacturerDetail.relatedDevices: "相关设备"
```

##### 6. Brands (品牌列表)
**文件**: `src/pages/Brands.tsx`
**需要翻译的内容**:
```typescript
brands.pageTitle: "品牌目录"
brands.pageDescription: "探索医疗影像设备品牌"
brands.search.placeholder: "搜索品牌..."
brands.card.devices: "设备数"
brands.card.viewBrand: "查看品牌"
```

##### 7. BrandDetail (品牌详情)
**文件**: `src/pages/BrandDetail.tsx`
**需要翻译的内容**:
```typescript
brandDetail.overview: "品牌概述"
brandDetail.products: "产品系列"
brandDetail.features: "品牌特色"
brandDetail.history: "品牌历史"
```

#### 知识中心页面

##### 8. KnowledgeCenter
**文件**: `src/pages/KnowledgeCenter.tsx`
**需要翻译的内容**:
```typescript
knowledge.pageTitle: "知识中心"
knowledge.pageDescription: "了解医疗影像技术的发展与应用"
knowledge.categories.history: "发展历史"
knowledge.categories.technology: "技术对比"
knowledge.categories.guides: "选购指南"
knowledge.featured.title: "精选文章"
```

##### 9. History (发展历史)
**文件**: `src/pages/History.tsx`
**需要翻译的内容**:
```typescript
history.pageTitle: "医疗影像技术发展历史"
history.pageDescription: "探索CT和MRI技术的演进历程"
history.timeline.title: "发展时间线"
history.topics.title: "历史专题"
history.search.placeholder: "搜索历史话题..."
```

##### 10. HistoryDetail
**文件**: `src/pages/HistoryDetail.tsx`
**需要翻译的内容**:
```typescript
historyDetail.relatedTopics: "相关话题"
historyDetail.timeline: "时间线"
```

##### 11. Technology
**文件**: `src/pages/Technology.tsx`
**需要翻译的内容**:
```typescript
technology.pageTitle: "技术对比"
technology.pageDescription: "深入了解不同影像技术的特点"
technology.comparison.ct: "CT技术"
technology.comparison.mri: "MRI技术"
technology.comparison.features: "技术特点"
technology.comparison.applications: "应用场景"
```

##### 12. GuidesCenter
**文件**: `src/pages/GuidesCenter.tsx`
**需要翻译的内容**:
```typescript
guides.pageTitle: "选购指南中心"
guides.pageDescription: "专业的设备选购建议"
guides.categories.selection: "选型指南"
guides.categories.import: "进口指南"
guides.categories.financing: "融资方案"
guides.categories.maintenance: "维护保养"
```

##### 13. Guide (选购指南)
**文件**: `src/pages/Guide.tsx`
**需要翻译的内容**:
```typescript
guide.selection.pageTitle: "设备选购指南"
guide.selection.factors: "选购因素"
guide.selection.checklist: "选购清单"
guide.selection.tips: "专家建议"
```

##### 14. ImportGuide (进口指南)
**文件**: `src/pages/ImportGuide.tsx`
**需要翻译的内容**:
```typescript
guide.import.pageTitle: "设备进口指南"
guide.import.process: "进口流程"
guide.import.regulations: "法规要求"
guide.import.documents: "所需文件"
guide.import.customs: "海关手续"
```

#### 分析中心页面

##### 15. AnalysisCenter
**文件**: `src/pages/AnalysisCenter.tsx`
**需要翻译的内容**:
```typescript
analysis.pageTitle: "市场分析中心"
analysis.pageDescription: "专业的市场分析与行业洞察"
analysis.categories.market: "市场分析"
analysis.categories.expert: "专家观点"
analysis.categories.trends: "行业趋势"
```

##### 16. MarketAnalysis
**文件**: `src/pages/MarketAnalysis.tsx`
**需要翻译的内容**:
```typescript
marketAnalysis.pageTitle: "市场分析报告"
marketAnalysis.pageDescription: "深度解析医疗影像设备市场"
marketAnalysis.global.title: "全球市场"
marketAnalysis.regional.title: "区域市场"
marketAnalysis.trends.title: "市场趋势"
```

##### 17. MarketAnalysisDetail
**文件**: `src/pages/MarketAnalysisDetail.tsx`
**需要翻译的内容**:
```typescript
marketAnalysisDetail.summary: "报告摘要"
marketAnalysisDetail.findings: "主要发现"
marketAnalysisDetail.recommendations: "建议"
marketAnalysisDetail.related: "相关报告"
```

##### 18. ExpertAnalysis
**文件**: `src/pages/ExpertAnalysis.tsx`
**需要翻译的内容**:
```typescript
expertAnalysis.pageTitle: "专家分析"
expertAnalysis.pageDescription: "行业专家的专业见解"
expertAnalysis.experts.title: "专家团队"
expertAnalysis.articles.title: "分析文章"
```

#### 客户页面

##### 19. Customers
**文件**: `src/pages/Customers.tsx`
**需要翻译的内容**:
```typescript
customers.pageTitle: "客户案例"
customers.pageDescription: "了解我们的客户成功故事"
customers.stats.total: "总客户数"
customers.stats.countries: "覆盖国家"
customers.stats.satisfaction: "满意度"
customers.filters.type: "按类型筛选"
customers.filters.location: "按地区筛选"
```

##### 20. CustomerDetail
**文件**: `src/pages/CustomerDetail.tsx`
**需要翻译的内容**:
```typescript
customerDetail.overview: "客户概况"
customerDetail.equipment: "采购设备"
customerDetail.story: "成功故事"
customerDetail.testimonial: "客户评价"
```

##### 21. CustomerMap
**文件**: `src/pages/CustomerMap.tsx`
**需要翻译的内容**:
```typescript
customerMap.pageTitle: "客户分布地图"
customerMap.pageDescription: "查看全球客户分布"
customerMap.filters.country: "国家"
customerMap.filters.type: "类型"
customerMap.legend.title: "图例"
```

#### 制造商专题页面

##### 22. CTManufacturers
**文件**: `src/pages/CTManufacturers.tsx`
**需要翻译的内容**:
```typescript
ctManufacturers.pageTitle: "CT扫描仪制造商"
ctManufacturers.pageDescription: "全球CT扫描仪制造商目录"
ctManufacturers.global.title: "国际制造商"
ctManufacturers.domestic.title: "国内制造商"
```

##### 23. MRIManufacturers
**文件**: `src/pages/MRIManufacturers.tsx`
**需要翻译的内容**:
```typescript
mriManufacturers.pageTitle: "MRI系统制造商"
mriManufacturers.pageDescription: "全球MRI系统制造商目录"
mriManufacturers.global.title: "国际制造商"
mriManufacturers.domestic.title: "国内制造商"
```

##### 24. ChinaCTManufacturers
**文件**: `src/pages/ChinaCTManufacturers.tsx`
**需要翻译的内容**:
```typescript
chinaCTManufacturers.pageTitle: "中国CT制造商"
chinaCTManufacturers.pageDescription: "国内CT扫描仪制造商目录"
chinaCTManufacturers.leading.title: "领先企业"
chinaCTManufacturers.emerging.title: "新兴企业"
```

##### 25. ChinaMRIManufacturers
**文件**: `src/pages/ChinaMRIManufacturers.tsx`
**需要翻译的内容**:
```typescript
chinaMRIManufacturers.pageTitle: "中国MRI制造商"
chinaMRIManufacturers.pageDescription: "国内MRI系统制造商目录"
chinaMRIManufacturers.leading.title: "领先企业"
chinaMRIManufacturers.emerging.title: "新兴企业"
```

#### 其他页面

##### 26. ContactPage
**文件**: `src/pages/ContactPage.tsx`
**需要翻译的内容**:
```typescript
contact.pageTitle: "联系我们"
contact.pageDescription: "与我们取得联系"
contact.form.title: "发送消息"
contact.form.name: "姓名"
contact.form.email: "邮箱"
contact.form.company: "公司"
contact.form.phone: "电话"
contact.form.subject: "主题"
contact.form.message: "留言"
contact.form.submit: "提交"
contact.methods.title: "联系方式"
contact.methods.email: "电子邮件"
contact.methods.phone: "电话"
contact.methods.chat: "在线客服"
contact.methods.website: "网站"
contact.office.title: "办公地点"
```

##### 27. FAQPage
**文件**: `src/pages/FAQPage.tsx`
**需要翻译的内容**:
```typescript
faq.pageTitle: "常见问题"
faq.pageDescription: "找到您需要的答案"
faq.categories.general: "常规问题"
faq.categories.purchasing: "采购相关"
faq.categories.technical: "技术问题"
faq.categories.support: "售后支持"
faq.search.placeholder: "搜索问题..."
```

##### 28. GlossaryPage
**文件**: `src/pages/GlossaryPage.tsx`
**需要翻译的内容**:
```typescript
glossary.pageTitle: "术语表"
glossary.pageDescription: "医疗影像设备专业术语解释"
glossary.search.placeholder: "搜索术语..."
glossary.categories.technical: "技术术语"
glossary.categories.medical: "医学术语"
glossary.categories.regulatory: "法规术语"
```

##### 29. Dashboard
**文件**: `src/pages/Dashboard.tsx`
**需要翻译的内容**:
```typescript
dashboard.pageTitle: "数据面板"
dashboard.overview.title: "概览"
dashboard.statistics.title: "统计数据"
dashboard.trends.title: "趋势分析"
```

##### 30. NotFound
**文件**: `src/pages/NotFound.tsx`
**需要翻译的内容**:
```typescript
notFound.title: "页面未找到"
notFound.description: "抱歉，您访问的页面不存在"
notFound.backHome: "返回首页"
```

##### 31. SEOLanding
**文件**: `src/pages/SEOLanding.tsx`
**需要翻译的内容**: 根据实际内容确定

##### 32. Tags
**文件**: `src/pages/Tags.tsx`
**需要翻译的内容**:
```typescript
tags.pageTitle: "标签"
tags.pageDescription: "按标签浏览内容"
tags.popular.title: "热门标签"
tags.all.title: "全部标签"
```

---

## 建议的i18n结构重组

### 新增命名空间

```typescript
// 页面级命名空间（不使用 pages.* 前缀）
home: {
  hero: { ... },
  stats: { ... },
  featured: { ... },
  manufacturers: { ... },
  articles: { ... }
}

devices: {
  pageTitle: "...",
  pageDescription: "...",
  filters: { ... },
  search: { ... },
  sort: { ... },
  comparison: { ... },
  results: { ... }
}

deviceDetail: { ... }

manufacturers: {
  pageTitle: "...",
  pageDescription: "...",
  stats: { ... },
  filters: { ... },
  card: { ... }
}

manufacturerDetail: { ... }

brands: { ... }
brandDetail: { ... }

knowledge: {
  pageTitle: "...",
  categories: { ... },
  featured: { ... }
}

history: { ... }
historyDetail: { ... }

technology: { ... }

guides: {
  pageTitle: "...",
  categories: { ... }
}

guide: {
  selection: { ... },
  import: { ... }
}

analysis: { ... }
marketAnalysis: { ... }
marketAnalysisDetail: { ... }
expertAnalysis: { ... }

customers: { ... }
customerDetail: { ... }
customerMap: { ... }

ctManufacturers: { ... }
mriManufacturers: { ... }
chinaCTManufacturers: { ... }
chinaMRIManufacturers: { ... }

contact: {
  form: { ... },
  methods: { ... },
  office: { ... }
}

faq: { ... }
glossary: { ... }
dashboard: { ... }
notFound: { ... }
tags: { ... }
```

### 使用约定示例
```typescript
// 页面内
const { t } = useTranslation('pricing');
t('features.instantQuotes.title');

// 跨命名空间
const { t } = useTranslation(['pricing','navigation']);
t('navigation:pricing');
```

---

## 实施优先级

### P0 - 高优先级（用户最常访问）
1. ✅ Header/Footer（已完成）
2. ❌ Index (首页)
3. ❌ Devices (设备列表)
4. ❌ DeviceDetailPage (设备详情)
5. ❌ Manufacturers (制造商列表)
6. ❌ ManufacturerDetail (制造商详情)

### P1 - 中优先级（重要功能页面）
1. ❌ KnowledgeCenter
2. ❌ Guide/ImportGuide
3. ❌ AnalysisCenter/MarketAnalysis
4. ❌ ContactPage
5. ❌ FAQPage
6. ❌ NotFound

### P2 - 低优先级（专题/详情页面）
1. ❌ Brands/BrandDetail
2. ❌ Customers相关页面
3. ❌ History相关页面
4. ❌ CTManufacturers/MRIManufacturers等专题页面
5. ❌ Dashboard
6. ❌ GlossaryPage
7. ❌ Tags

---

## 下一步行动

1. **创建完整的翻译文件**：扩展 `src/lib/i18n.ts`，添加所有页面的翻译keys
2. **逐页实施国际化**：按优先级顺序，为每个页面添加 `useTranslation` hook
3. **测试翻译**：确保中英文切换正常工作
4. **SEO优化**：为每个页面添加对应的SEO元数据翻译
5. **URL路由**：确保所有页面的URL都支持 `/en` 前缀

---

## 注意事项

1. **保持一致性**：翻译key的命名要保持一致的模式
2. **避免硬编码**：所有用户可见的文本都应该使用翻译key
3. **动态内容**：对于数据库或API返回的动态内容，需要在后端也支持多语言
4. **日期/数字格式**：需要根据语言格式化日期和数字
5. **图片/图标**：某些含文字的图片可能需要准备多语言版本
