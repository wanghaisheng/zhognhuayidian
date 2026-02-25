# 多语言使用示例

> 命名空间与用法约定（最新）
> - 页面/组件：useTranslation('ns') 后使用相对键（如 t('hero.title')）
> - 跨命名空间：使用 ns:key（如 t('navigation:compare')）
> - 不使用 pages.* 前缀；与 locales/{lang}/index.ts 的顶层命名空间一致（如 pricing、resourceCenter）

## 基本用法

### 1. 在React组件中使用翻译

```typescript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation('common');
  
  return (
    <div>
      <h1>{t('home')}</h1>
      <p>{t('devices:ctScanner')}</p>
      <button>{t('viewDetails')}</button>
    </div>
  );
};
```

### 1.1 跨命名空间与相对键

```typescript
const PricingFeatures = () => {
  const { t } = useTranslation(['pricing', 'navigation']);
  return (
    <>
      <h3>{t('pricing:features.expertSupport.title')}</h3>
      <p>{t('pricing:features.expertSupport.technicalGuidanceDesc')}</p>
      <a href="/pricing">{t('navigation:pricing')}</a>
    </>
  );
};
```

### 2. 带参数的翻译

```typescript
// 翻译文件中
export const messages = {
  welcome: '欢迎 {{name}}，您有 {{count}} 条新消息'
};

// 组件中使用
const WelcomeMessage = ({ userName, messageCount }) => {
  const { t } = useTranslation();
  
  return (
    <p>{t('messages.welcome', { name: userName, count: messageCount })}</p>
  );
};
```

### 3. 复数形式处理

```typescript
// 翻译文件中
export const items = {
  device: '设备',
  device_plural: '设备',
  manufacturer: '制造商',
  manufacturer_plural: '制造商'
};

// 组件中使用
const ItemCount = ({ count, type }) => {
  const { t } = useTranslation();
  
  return (
    <span>
      {count} {t(`items.${type}`, { count })}
    </span>
  );
};
```

## 高级用法

### 1. 条件翻译

```typescript
const DeviceType = ({ device }) => {
  const { t } = useTranslation();
  
  const getDeviceTypeText = (type) => {
    switch (type) {
      case 'CT Scanner':
        return t('devices.ctScanner');
      case 'MRI System':
        return t('devices.mriSystem');
      default:
        return t('devices.unknown');
    }
  };
  
  return <span>{getDeviceTypeText(device.type)}</span>;
};
```

### 2. 动态翻译键

```typescript
const StatusBadge = ({ status }) => {
  const { t } = useTranslation();
  
  return (
    <Badge className={`status-${status}`}>
      {t(`status.${status}`)}
    </Badge>
  );
};
```

### 3. 嵌套翻译对象

```typescript
const ManufacturerCard = ({ manufacturer }) => {
  const { t } = useTranslation();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{manufacturer.name}</CardTitle>
        <CardDescription>
          {t('manufacturers.founded')}: {manufacturer.foundedYear}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>{t('manufacturers.headquarters')}</label>
            <p>{manufacturer.headquarters}</p>
          </div>
          <div>
            <label>{t('manufacturers.employees')}</label>
            <p>{manufacturer.employeeCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
```

## SEO和元数据翻译

### 1. 页面标题和描述

```typescript
const SEOLandingPage = () => {
  const { t } = useTranslation();
  
  return (
    <>
      <SEOHead 
        title={t('seoLanding.ctMriScannerKnowledgeCenter')}
        description={t('seoLanding.professionalMedicalImagingPlatform')}
        keywords={t('seo.keywords')}
      />
      <div>
        {/* 页面内容 */}
      </div>
    </>
  );
};
```

### 2. 结构化数据翻译

```typescript
const generateStructuredData = (t) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": t('seoLanding.ctMriScannerKnowledgeCenter'),
  "description": t('seoLanding.professionalMedicalImagingPlatform'),
  "mainEntity": {
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": t('technology.whatIsMultiSliceCT'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('technology.multiSliceCTAnswer')
        }
      }
    ]
  }
});
```

## 表单和验证翻译

### 1. 表单标签和占位符

```typescript
const ContactForm = () => {
  const { t } = useTranslation();
  
  return (
    <form>
      <div>
        <label>{t('contact.name')}</label>
        <Input 
          placeholder={t('contact.namePlaceholder')}
          required
        />
      </div>
      <div>
        <label>{t('contact.email')}</label>
        <Input 
          type="email"
          placeholder={t('contact.emailPlaceholder')}
          required
        />
      </div>
      <Button type="submit">
        {t('contact.send')}
      </Button>
    </form>
  );
};
```

### 2. 错误消息翻译

```typescript
const validateForm = (data, t) => {
  const errors = {};
  
  if (!data.name) {
    errors.name = t('validation.nameRequired');
  }
  
  if (!data.email) {
    errors.email = t('validation.emailRequired');
  } else if (!isValidEmail(data.email)) {
    errors.email = t('validation.emailInvalid');
  }
  
  return errors;
};
```

## 最佳实践

### 1. 翻译键命名规范

```typescript
// ✅ 好的命名
t('devices.ctScanner')
t('manufacturers.companyInfo')
t('seoLanding.expertAnalysis')

// ❌ 避免的命名
t('ct_scanner')
t('company_info')
t('expert_analysis')
```

### 2. 组织翻译内容

```typescript
// ✅ 按功能模块组织
const devices = {
  title: '设备目录',
  ctScanner: 'CT扫描仪',
  specifications: '技术规格'
};

// ❌ 扁平化结构
const translations = {
  devicesTitle: '设备目录',
  devicesCTScanner: 'CT扫描仪',
  devicesSpecifications: '技术规格'
};
```

### 3. 处理长文本

```typescript
// ✅ 将长文本分解为段落
const longText = {
  intro: '这是介绍段落...',
  details: '这是详细说明...',
  conclusion: '这是总结段落...'
};

// 在组件中使用
<div>
  <p>{t('longText.intro')}</p>
  <p>{t('longText.details')}</p>
  <p>{t('longText.conclusion')}</p>
</div>
```

### 4. 处理HTML内容

```typescript
// 翻译文件中
const content = {
  richText: '访问我们的<strong>官方网站</strong>获取更多信息'
};

// 组件中使用
<div 
  dangerouslySetInnerHTML={{ 
    __html: t('content.richText') 
  }} 
/>
```

## 调试和测试

### 1. 显示翻译键（开发模式）

```typescript
const DebugTranslation = ({ tKey, children }) => {
  const isDev = process.env.NODE_ENV === 'development';
  
  return (
    <span title={isDev ? tKey : undefined}>
      {children}
    </span>
  );
};

// 使用
<DebugTranslation tKey="common.home">
  {t('common.home')}
</DebugTranslation>
```

### 2. 缺失翻译检测

```typescript
// 在i18n配置中添加
i18n.init({
  // ...其他配置
  saveMissing: true,
  missingKeyHandler: (lng, ns, key) => {
    console.warn(`Missing translation: ${lng}.${ns}.${key}`);
  }
});
```
