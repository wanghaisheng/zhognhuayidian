# 结构化数据（JSON-LD）实施指南

## 📋 概述

本文档详细说明项目中 Schema.org 结构化数据的实施策略，用于提升搜索引擎可见性和富媒体搜索结果展示。

## 🎯 实施的结构化数据类型

### 1. **Product Schema**（产品架构）
**应用页面**：设备详情页 (`/devices/:slug`)

**主要字段**：
- `@type`: "Product"
- `name`: 设备名称
- `description`: 设备描述
- `brand`: 品牌信息
- `manufacturer`: 制造商信息
- `offers`: 价格和可用性
- `aggregateRating`: 聚合评分（如有）
- `additionalProperty`: 技术规格

**示例**：
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Revolution CT",
  "description": "高性能64排CT扫描仪",
  "brand": {
    "@type": "Brand",
    "name": "GE Healthcare"
  },
  "manufacturer": {
    "@type": "Organization",
    "name": "GE Healthcare",
    "url": "https://www.gehealthcare.com"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "CNY",
    "price": "300-500万",
    "availability": "https://schema.org/InStock"
  }
}
```

### 2. **Organization Schema**（组织架构）
**应用页面**：
- 制造商详情页 (`/manufacturers/:slug`)
- 首页（关于公司）

**主要字段**：
- `@type`: "Organization"
- `name`: 组织名称
- `url`: 官方网站
- `logo`: 公司Logo
- `foundingDate`: 成立日期
- `address`: 公司地址
- `contactPoint`: 联系方式
- `sameAs`: 社交媒体链接

**示例**：
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Siemens Healthineers",
  "url": "https://www.siemens-healthineers.com",
  "foundingDate": "2015",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "Germany"
  },
  "logo": "https://example.com/logo.png"
}
```

### 3. **BreadcrumbList Schema**（面包屑导航）
**应用页面**：所有详情页面

**主要字段**：
- `@type`: "BreadcrumbList"
- `itemListElement`: 导航项列表
  - `position`: 位置索引
  - `name`: 显示名称
  - `item`: 链接URL

**示例**：
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "首页",
      "item": "https://ctscannerinfo.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "设备列表",
      "item": "https://ctscannerinfo.com/devices"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Revolution CT",
      "item": "https://ctscannerinfo.com/devices/revolution-ct"
    }
  ]
}
```

### 4. **Article Schema**（文章架构）
**应用页面**：
- 知识中心 (`/knowledge`)
- 市场分析 (`/analysis`)
- 指南中心 (`/guides`)

**主要字段**：
- `@type`: "Article"
- `headline`: 标题
- `author`: 作者信息
- `datePublished`: 发布日期
- `dateModified`: 修改日期
- `publisher`: 发布者
- `image`: 特色图片
- `articleSection`: 文章分类

**示例**：
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "CT扫描仪选购指南",
  "author": {
    "@type": "Person",
    "name": "医疗设备专家"
  },
  "publisher": {
    "@type": "Organization",
    "name": "CT Scanner Hub"
  },
  "datePublished": "2024-01-01",
  "dateModified": "2024-01-15"
}
```

### 5. **WebSite Schema**（网站架构）
**应用页面**：首页

**主要字段**：
- `@type`: "WebSite"
- `name`: 网站名称
- `url`: 网站URL
- `potentialAction`: 搜索功能
- `publisher`: 发布者信息

**示例**：
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "CT Scanner Hub",
  "url": "https://ctscannerinfo.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://ctscannerinfo.com/devices?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

### 6. **FAQPage Schema**（常见问题）
**应用页面**：FAQ页面

**主要字段**：
- `@type`: "FAQPage"
- `mainEntity`: 问题列表
  - `@type`: "Question"
  - `acceptedAnswer`: 答案

### 7. **ItemList Schema**（列表页）
**应用页面**：
- 设备列表 (`/devices`)
- 制造商列表 (`/manufacturers`)

**主要字段**：
- `@type`: "ItemList"
- `itemListElement`: 列表项
- `numberOfItems`: 总数量

### 8. **HowTo Schema**（操作指南）
**应用页面**：导入指南、维护指南等

**主要字段**：
- `@type`: "HowTo"
- `name`: 指南标题
- `step`: 步骤列表
- `totalTime`: 总耗时

## 🛠️ 实施方式

### 方法1：通过 SEOHead 组件
```tsx
import SEOHead from '@/components/SEOHead';
import { seoManager } from '@/lib/seo';

const DeviceDetailPage = () => {
  const seoData = seoManager.generateProductSEO(device);
  const breadcrumbSchema = seoManager.generateBreadcrumbSchema(breadcrumbItems);
  
  return (
    <>
      <SEOHead 
        title={seoData.title}
        description={seoData.description}
        structuredData={[seoData.schema, breadcrumbSchema]}
      />
      {/* Page content */}
    </>
  );
};
```

### 方法2：直接使用结构化数据工具
```tsx
import { generateProductSchema, generateBreadcrumbSchema } from '@/lib/structuredData';

const structuredData = [
  generateProductSchema(device),
  generateBreadcrumbSchema(breadcrumbItems)
];
```

## 📊 已实施页面清单

### ✅ 已完成
- [x] 设备详情页 - Product + Breadcrumb Schema
- [x] 制造商详情页 - Organization + Breadcrumb Schema
- [x] 首页 - Website + Organization Schema
- [x] SEO工具库 - seo.ts
- [x] 结构化数据工具库 - structuredData.ts

### 🔄 待实施
- [ ] 知识中心 - Article Schema
- [ ] 市场分析 - Article + ItemList Schema
- [ ] 指南中心 - HowTo Schema
- [ ] FAQ页面 - FAQPage Schema
- [ ] 设备列表 - ItemList Schema
- [ ] 制造商列表 - ItemList Schema
- [ ] 客户案例 - Review Schema

## 🧪 测试与验证

### Google Rich Results Test
1. 访问：https://search.google.com/test/rich-results
2. 输入页面URL或粘贴HTML代码
3. 检查是否有错误或警告

### Schema.org Validator
1. 访问：https://validator.schema.org/
2. 输入页面URL或粘贴JSON-LD代码
3. 验证结构化数据格式是否正确

### Google Search Console
1. 前往 Search Console → Enhancements
2. 查看各类富媒体结果的索引状态
3. 修复任何错误或警告

## 📈 SEO 影响

### 富媒体搜索结果
- **Product Rich Results**: 显示价格、评分、可用性
- **Breadcrumb Navigation**: 搜索结果中显示面包屑
- **Organization Knowledge Panel**: 显示公司信息卡片
- **FAQ Rich Results**: 在搜索结果中展开常见问题
- **How-to Rich Results**: 显示步骤式指南

### 预期提升
- 点击率（CTR）提升：15-30%
- 搜索可见度提升：20-40%
- 用户体验改善
- 品牌权威度提升

## 📝 最佳实践

### 1. 必须包含的字段
- 所有 `required` 字段必须填写
- 使用准确的数据类型
- URL 必须是绝对路径

### 2. 推荐包含的字段
- `image`: 高质量图片（最小1200px宽）
- `aggregateRating`: 如有评价数据
- `offers`: 详细的价格信息
- `datePublished` / `dateModified`: 保持更新

### 3. 避免的错误
- ❌ 不要使用相对URL
- ❌ 不要在JSON-LD中使用未转义的HTML
- ❌ 不要重复相同的结构化数据
- ❌ 不要添加页面上不存在的内容

### 4. 多语言支持
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Revolution CT",
  "description": {
    "@language": "zh-CN",
    "@value": "高性能64排CT扫描仪"
  }
}
```

## 🔍 调试技巧

### 1. 浏览器开发者工具
```javascript
// 查看页面所有结构化数据
document.querySelectorAll('script[type="application/ld+json"]')
  .forEach(el => console.log(JSON.parse(el.textContent)));
```

### 2. 结构化数据检查命令
```bash
# 提取页面所有JSON-LD数据
curl -s 'https://ctscannerinfo.com/devices/revolution-ct' | \
  grep -o '<script type="application/ld+json">.*</script>' | \
  sed 's/<script type="application\/ld+json">//;s/<\/script>//' | \
  jq .
```

## 📚 参考资源

### 官方文档
- [Schema.org Full Documentation](https://schema.org/)
- [Google Search Central - Structured Data](https://developers.google.com/search/docs/advanced/structured-data/intro-structured-data)
- [JSON-LD Specification](https://json-ld.org/)

### 工具链接
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)
- [Structured Data Testing Tool](https://search.google.com/structured-data/testing-tool)

### 学习资源
- [Google's Structured Data Guidelines](https://developers.google.com/search/docs/advanced/structured-data/sd-policies)
- [Moz: JSON-LD for Beginners](https://moz.com/learn/seo/json-ld)

## 🎯 下一步行动

1. ✅ **已完成**：基础Product和Organization Schema实施
2. 📝 **进行中**：在其他关键页面添加结构化数据
3. 🔜 **待办**：
   - 实施FAQ Schema到FAQ页面
   - 添加HowTo Schema到指南页面
   - 实施ItemList Schema到列表页面
   - 提交到Google Search Console验证
   - 监控富媒体搜索结果表现

---

**最后更新**：2024-01-15  
**维护者**：SEO团队
