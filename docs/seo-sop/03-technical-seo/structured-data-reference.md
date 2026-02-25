# 结构化数据参考文档

> 结构化数据（Schema Markup）帮助搜索引擎理解页面内容，获得Rich Results展示机会

---

## 一、Schema类型总览

### 1.1 项目已实现的Schema

| Schema类型 | 页面类型 | Rich Results效果 |
|------------|----------|------------------|
| **Product** | 设备详情页 | 产品卡片、价格、评分 |
| **Organization** | 制造商页 | 公司信息卡片 |
| **Article** | 博客/指南页 | 文章卡片、发布时间 |
| **FAQPage** | FAQ区域 | FAQ折叠展示 |
| **BreadcrumbList** | 全站 | 面包屑导航 |
| **WebSite** | 首页 | 站点搜索框 |

### 1.2 计划实现的Schema

| Schema类型 | 页面类型 | 用途 |
|------------|----------|------|
| **HowTo** | 指南页 | 步骤展示 |
| **Video** | 视频内容 | 视频卡片 |
| **Review** | 评测页 | 评分展示 |
| **LocalBusiness** | 联系页 | 本地业务 |

---

## 二、Product Schema

### 2.1 适用页面
- 设备详情页 (`/devices/[slug]`)

### 2.2 JSON-LD 示例

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Siemens SOMATOM go.Top CT Scanner",
  "description": "64-slice premium CT scanner with AI-powered imaging...",
  "image": [
    "https://yoursite.com/images/siemens-somatom-go-top-1.jpg",
    "https://yoursite.com/images/siemens-somatom-go-top-2.jpg"
  ],
  "brand": {
    "@type": "Brand",
    "name": "Siemens Healthineers"
  },
  "manufacturer": {
    "@type": "Organization",
    "name": "Siemens Healthineers",
    "url": "https://www.siemens-healthineers.com"
  },
  "category": "CT Scanner",
  "sku": "SOMATOM-GO-TOP",
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "USD",
    "lowPrice": "200000",
    "highPrice": "500000",
    "offerCount": "5",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "128"
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Organization",
        "name": "MedDevice360"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "4.8"
      },
      "reviewBody": "Excellent imaging quality with low radiation dose..."
    }
  ]
}
```

### 2.3 必填字段

| 字段 | 必填 | 说明 |
|------|------|------|
| name | ✅ | 产品名称 |
| image | ✅ | 至少1张产品图 |
| description | 推荐 | 产品描述 |
| brand | 推荐 | 品牌信息 |
| offers | 推荐 | 价格信息（可用范围） |
| aggregateRating | 推荐 | 评分信息 |

### 2.4 项目实现

```tsx
// src/lib/structuredData.ts
export const generateProductSchema = (device: Device) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: device.name_en,
  description: device.description_en,
  image: device.image_url,
  brand: {
    "@type": "Brand",
    name: device.manufacturer_name
  },
  category: device.type,
  offers: device.price_range ? {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    priceRange: device.price_range
  } : undefined
});
```

---

## 三、Organization Schema

### 3.1 适用页面
- 制造商详情页 (`/manufacturers/[slug]`)
- 关于我们页面

### 3.2 JSON-LD 示例

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Siemens Healthineers",
  "alternateName": "西门子医疗",
  "url": "https://www.siemens-healthineers.com",
  "logo": "https://yoursite.com/logos/siemens.png",
  "description": "Global leader in medical technology...",
  "foundingDate": "1847",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Erlangen",
    "addressCountry": "Germany"
  },
  "sameAs": [
    "https://www.linkedin.com/company/siemens-healthineers",
    "https://twitter.com/SiemensHealth"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "sales",
    "telephone": "+1-xxx-xxx-xxxx",
    "email": "sales@example.com"
  }
}
```

### 3.3 项目实现

```tsx
// src/lib/structuredData.ts
export const generateOrganizationSchema = (manufacturer: Manufacturer) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: manufacturer.name_en,
  url: manufacturer.website,
  logo: manufacturer.logo_url,
  description: manufacturer.description_en,
  foundingDate: manufacturer.founded_year?.toString(),
  address: {
    "@type": "PostalAddress",
    addressCountry: manufacturer.country
  }
});
```

---

## 四、Article Schema

### 4.1 适用页面
- 博客文章
- 指南页面
- 新闻页面

### 4.2 JSON-LD 示例

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Choose a CT Scanner: Complete Buying Guide 2025",
  "description": "Expert guide on selecting the right CT scanner...",
  "image": "https://yoursite.com/images/ct-guide-hero.jpg",
  "author": {
    "@type": "Organization",
    "name": "MedDevice360",
    "url": "https://yoursite.com"
  },
  "publisher": {
    "@type": "Organization",
    "name": "MedDevice360",
    "logo": {
      "@type": "ImageObject",
      "url": "https://yoursite.com/logo.png"
    }
  },
  "datePublished": "2025-01-15",
  "dateModified": "2025-01-20",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://yoursite.com/guides/ct-scanner-buying-guide"
  }
}
```

### 4.3 必填字段

| 字段 | 必填 | 说明 |
|------|------|------|
| headline | ✅ | 文章标题 |
| image | ✅ | 文章配图 |
| datePublished | ✅ | 发布日期 |
| author | ✅ | 作者信息 |
| publisher | ✅ | 发布者信息 |

---

## 五、FAQPage Schema

### 5.1 适用区域
- 产品页FAQ区域
- 专门的FAQ页面
- 指南页问答区域

### 5.2 JSON-LD 示例

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the price range for a 64-slice CT scanner?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A 64-slice CT scanner typically costs between $200,000 to $500,000 depending on the manufacturer and configuration..."
      }
    },
    {
      "@type": "Question",
      "name": "How long does CT scanner installation take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Installation typically takes 2-4 weeks including site preparation, equipment installation, and calibration..."
      }
    }
  ]
}
```

### 5.3 项目实现

```tsx
// FAQ组件中使用
export const generateFAQSchema = (faqs: FAQ[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(faq => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer
    }
  }))
});
```

---

## 六、BreadcrumbList Schema

### 6.1 适用页面
- 所有非首页页面

### 6.2 JSON-LD 示例

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://yoursite.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "CT Scanners",
      "item": "https://yoursite.com/devices?type=ct"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Siemens SOMATOM go.Top",
      "item": "https://yoursite.com/devices/siemens-somatom-go-top"
    }
  ]
}
```

### 6.3 项目实现

```tsx
// src/components/Breadcrumb.tsx
export const generateBreadcrumbSchema = (items: BreadcrumbItem[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.label,
    item: `${siteConfig.url}${item.href}`
  }))
});
```

---

## 七、WebSite Schema

### 7.1 适用页面
- 首页

### 7.2 JSON-LD 示例

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "MedDevice360",
  "alternateName": "医疗设备360",
  "url": "https://yoursite.com",
  "description": "Your trusted source for medical imaging equipment...",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://yoursite.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "inLanguage": ["en", "zh"]
}
```

---

## 八、验证与调试

### 8.1 验证工具

| 工具 | 用途 | 链接 |
|------|------|------|
| Rich Results Test | Google官方验证 | [测试](https://search.google.com/test/rich-results) |
| Schema Markup Validator | 语法验证 | [验证](https://validator.schema.org) |
| GSC Enhancement Report | 监控错误 | GSC后台 |

### 8.2 常见错误

| 错误 | 原因 | 解决方案 |
|------|------|----------|
| Missing field | 缺少必填字段 | 补充相应字段 |
| Invalid URL | URL格式错误 | 使用绝对URL |
| Invalid date | 日期格式错误 | 使用ISO 8601格式 |
| Image too small | 图片尺寸不足 | 使用≥1200px宽的图片 |

### 8.3 调试技巧

```javascript
// 控制台查看页面Schema
const schemas = document.querySelectorAll('script[type="application/ld+json"]');
schemas.forEach(s => console.log(JSON.parse(s.textContent)));
```

---

## 九、SEOHead 组件使用

### 9.1 基础使用

```tsx
import SEOHead from '@/components/SEOHead';

<SEOHead
  title="Product Title | MedDevice360"
  description="Product description..."
  structuredData={productSchema}
/>
```

### 9.2 多Schema页面

```tsx
// 同时使用多个Schema
const schemas = [
  generateProductSchema(device),
  generateBreadcrumbSchema(breadcrumbs),
  device.faqs?.length ? generateFAQSchema(device.faqs) : null
].filter(Boolean);

<SEOHead
  title={device.name}
  structuredData={schemas}
/>
```

---

## 十、检查清单

### 新页面上线前

- [ ] 选择合适的Schema类型
- [ ] 填写所有必填字段
- [ ] 使用Rich Results Test验证
- [ ] 检查图片URL可访问
- [ ] 确认日期格式正确
- [ ] 验证URL为绝对路径

### 定期审计

- [ ] 每周查看GSC Enhancement报告
- [ ] 每月验证主要页面Schema
- [ ] 季度更新过时信息

---

## 十一、参考资源

- [Schema.org 官方文档](https://schema.org)
- [Google 结构化数据指南](https://developers.google.com/search/docs/appearance/structured-data)
- [Rich Results 支持列表](https://developers.google.com/search/docs/appearance/structured-data/search-gallery)

---

*最后更新: 2025-01*
*维护人: SEO Team*
