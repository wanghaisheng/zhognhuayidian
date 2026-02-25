# 转化追踪设置

> 完整的转化追踪是衡量SEO ROI的基础。

## 📋 转化目标定义

### 主要转化 (Macro Conversions)

| 转化类型 | 描述 | 价值 | 优先级 |
|---------|-----|------|-------|
| 询价表单提交 | 潜在客户提交询价请求 | $100 | P0 |
| 联系表单提交 | 一般咨询联系 | $25 | P0 |
| 报价请求 | 请求具体产品报价 | $150 | P0 |
| 电话咨询 | 点击电话号码 | $50 | P1 |
| 邮件联系 | 点击邮箱链接 | $25 | P1 |

### 微转化 (Micro Conversions)

| 转化类型 | 描述 | 价值 | 优先级 |
|---------|-----|------|-------|
| 目录下载 | 下载产品目录PDF | $5 | P1 |
| 规格对比 | 使用对比功能 | $3 | P2 |
| 视频观看 | 观看产品视频 | $2 | P2 |
| 邮件订阅 | 订阅newsletter | $10 | P1 |
| 页面深度访问 | 浏览>5页 | $1 | P2 |
| 会话时长 | 停留>3分钟 | $1 | P2 |

---

## 🛠️ GA4转化设置

### 事件追踪配置

#### 1. 询价表单提交

```javascript
// 表单提交事件
gtag('event', 'generate_lead', {
  'event_category': 'form',
  'event_label': 'inquiry_form',
  'value': 100,
  'currency': 'USD'
});
```

```jsx
// React组件中实现
import { trackEvent } from '@/lib/analytics';

const handleFormSubmit = async (data) => {
  try {
    await submitInquiry(data);
    
    // 追踪转化
    trackEvent('generate_lead', {
      event_category: 'form',
      event_label: 'inquiry_form',
      device_type: data.deviceType,
      manufacturer: data.manufacturer,
      value: 100
    });
  } catch (error) {
    console.error(error);
  }
};
```

#### 2. 联系方式点击

```javascript
// 电话点击
gtag('event', 'click_phone', {
  'event_category': 'contact',
  'event_label': 'header_phone',
  'value': 50
});

// 邮箱点击
gtag('event', 'click_email', {
  'event_category': 'contact',
  'event_label': 'footer_email',
  'value': 25
});
```

#### 3. 资源下载

```javascript
// PDF下载
gtag('event', 'file_download', {
  'event_category': 'download',
  'event_label': 'product_catalog',
  'file_name': 'catalog-2026.pdf',
  'value': 5
});
```

### GA4转化标记

```markdown
在GA4管理界面中:
1. 转到 管理 > 事件
2. 找到需要标记为转化的事件
3. 切换"标记为转化"开关

标记为转化的事件:
- generate_lead ✅
- click_phone ✅
- click_email ✅
- file_download ✅
- newsletter_signup ✅
```

---

## 📊 Google Tag Manager配置

### 容器结构

```
GTM Container
├── Tags
│   ├── GA4 Configuration
│   ├── GA4 Event - Form Submit
│   ├── GA4 Event - Phone Click
│   ├── GA4 Event - Email Click
│   ├── GA4 Event - Download
│   └── Google Ads Conversion (如适用)
│
├── Triggers
│   ├── Form Submission
│   ├── Phone Link Click
│   ├── Email Link Click
│   ├── PDF Download Click
│   └── Page View - Thank You
│
└── Variables
    ├── Click URL
    ├── Form ID
    ├── Page Path
    └── User Properties
```

### 示例触发器配置

#### 表单提交触发器

```json
{
  "name": "Trigger - Inquiry Form Submit",
  "type": "formSubmission",
  "filters": [
    {
      "type": "contains",
      "parameter": "form_id",
      "value": "inquiry-form"
    }
  ]
}
```

#### 电话点击触发器

```json
{
  "name": "Trigger - Phone Click",
  "type": "linkClick",
  "filters": [
    {
      "type": "startsWith",
      "parameter": "Click URL",
      "value": "tel:"
    }
  ]
}
```

---

## 🎯 SEO专属追踪

### UTM参数规范

```markdown
SEO流量标记:
- utm_source: organic / google / bing
- utm_medium: organic
- utm_campaign: [campaign_name]
- utm_content: [page_type]

示例:
?utm_source=google&utm_medium=organic&utm_campaign=ct_scanner_guide
```

### Landing Page追踪

```javascript
// 记录着陆页
if (!sessionStorage.getItem('landing_page')) {
  sessionStorage.setItem('landing_page', window.location.pathname);
  sessionStorage.setItem('traffic_source', document.referrer);
}

// 在转化时发送
gtag('event', 'generate_lead', {
  'landing_page': sessionStorage.getItem('landing_page'),
  'traffic_source': sessionStorage.getItem('traffic_source')
});
```

### 关键词-转化关联

```markdown
由于GA4不再接收关键词数据，使用以下方法:

1. GSC + GA4 整合
   - 在Looker Studio中关联两个数据源
   - 按着陆页匹配

2. 自定义维度追踪
   - 记录用户首次访问页面
   - 关联页面目标关键词

3. 第三方工具
   - 使用Ahrefs/Semrush关键词追踪
   - 导出与转化数据合并分析
```

---

## 📈 转化报告

### 周度转化报告

| 转化类型 | 本周 | 上周 | 环比 | 来自SEO | SEO占比 |
|---------|-----|-----|------|--------|--------|
| 询价表单 | | | % | | % |
| 联系表单 | | | % | | % |
| 电话点击 | | | % | | % |
| PDF下载 | | | % | | % |

### SEO转化漏斗

```
有机访问 (Sessions)
    ↓ X%
产品页浏览 (Product Views)
    ↓ X%
询价页访问 (Inquiry Page)
    ↓ X%
表单提交 (Form Submit)
    ↓ X%
确认页面 (Confirmation)
```

### 转化率基准

| 指标 | 当前 | 行业基准 | 目标 |
|-----|------|---------|------|
| 访问→询价页 | % | 3-5% | % |
| 询价页→提交 | % | 5-10% | % |
| 整体转化率 | % | 1-3% | % |

---

## 🔧 实施检查清单

### 初始设置

```markdown
- [ ] GA4账户创建
- [ ] GTM容器创建
- [ ] 基础代码安装验证
- [ ] 增强测量开启
- [ ] 跨域追踪配置（如需要）
- [ ] IP过滤设置
- [ ] 数据保留期设置（14个月）
```

### 事件追踪

```markdown
- [ ] 表单提交事件
- [ ] 电话点击事件
- [ ] 邮箱点击事件
- [ ] PDF下载事件
- [ ] 视频播放事件
- [ ] 滚动深度追踪
- [ ] 出站链接追踪
```

### 转化配置

```markdown
- [ ] 转化事件标记
- [ ] 转化价值设置
- [ ] 归因模型选择
- [ ] Google Ads关联（如适用）
- [ ] GSC关联
```

### 验证测试

```markdown
- [ ] 使用GTM预览模式测试
- [ ] GA4实时报告验证
- [ ] 转化事件触发确认
- [ ] 跨设备测试
- [ ] 移动端测试
```

---

## 🔗 相关组件

### 项目中的追踪实现

| 文件 | 功能 |
|-----|------|
| `src/lib/analytics.ts` | 分析工具库 |
| `src/hooks/useAnalytics.ts` | 分析Hook |
| `src/lib/tracking.ts` | 事件追踪 |
| `src/components/InquiryForm.tsx` | 询价表单 |

### 代码示例

```typescript
// src/lib/analytics.ts
export const trackConversion = (
  eventName: string,
  params: Record<string, any>
) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, {
      ...params,
      timestamp: new Date().toISOString(),
      page_path: window.location.pathname
    });
  }
};

// 使用
trackConversion('generate_lead', {
  lead_source: 'inquiry_form',
  device_type: 'CT Scanner',
  value: 100
});
```

---

**文档版本**: v1.0  
**创建日期**: 2026-01-03  
**GA4属性ID**: [待配置]  
**GTM容器ID**: [待配置]
