# 国际化SEO检查清单

> 针对中国医疗设备出口网站的多语言、多地区SEO优化指南。

## 📋 检查清单概览

### URL结构

| # | 检查项 | 优先级 | 状态 |
|---|-------|-------|------|
| 1 | URL使用子目录结构（/zh/, /en/） | P0 | ⬜ |
| 2 | 英文为默认语言，无前缀 | P0 | ⬜ |
| 3 | URL使用英文slug（即使中文页面） | P1 | ⬜ |
| 4 | 所有语言版本URL结构一致 | P1 | ⬜ |
| 5 | 避免URL参数切换语言（?lang=zh） | P1 | ⬜ |

### Hreflang标签

| # | 检查项 | 优先级 | 状态 |
|---|-------|-------|------|
| 6 | 所有页面包含hreflang标签 | P0 | ⬜ |
| 7 | hreflang包含x-default指向英文版 | P0 | ⬜ |
| 8 | 双向hreflang引用（A→B且B→A） | P0 | ⬜ |
| 9 | hreflang URL使用绝对路径 | P1 | ⬜ |
| 10 | 语言代码使用ISO 639-1（zh, en） | P1 | ⬜ |

### 内容本地化

| # | 检查项 | 优先级 | 状态 |
|---|-------|-------|------|
| 11 | 内容为原创翻译，非机器直译 | P0 | ⬜ |
| 12 | 关键词针对目标市场研究 | P0 | ⬜ |
| 13 | 货币/单位符合目标市场习惯 | P1 | ⬜ |
| 14 | 日期格式符合目标市场习惯 | P2 | ⬜ |
| 15 | 联系方式包含目标市场渠道 | P1 | ⬜ |

### 技术设置

| # | 检查项 | 优先级 | 状态 |
|---|-------|-------|------|
| 16 | HTML lang属性正确设置 | P0 | ⬜ |
| 17 | 各语言版本有独立Sitemap | P1 | ⬜ |
| 18 | 或使用带hreflang的统一Sitemap | P1 | ⬜ |
| 19 | GSC添加所有语言版本 | P1 | ⬜ |
| 20 | CDN/服务器覆盖目标地区 | P2 | ⬜ |

---

## 🌐 URL结构规范

### 当前实现

```
项目采用子目录结构:
- 英文（默认）: chinactscanner.org/devices/
- 中文: chinactscanner.org/zh/devices/

配置文件: src/config/language.ts
```

### URL结构对比

| 结构类型 | 示例 | 优点 | 缺点 | 推荐 |
|---------|-----|------|------|------|
| 子目录 | /zh/devices | 简单管理、共享域名权重 | - | ✅ |
| 子域名 | zh.example.com | 地理定位灵活 | 独立域名权重 | ⬜ |
| ccTLD | example.cn | 强地理信号 | 成本高、管理复杂 | ⬜ |

### 实现代码参考

```typescript
// src/config/language.ts
export const SUPPORTED_LANGUAGES = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    urlPrefix: '', // 默认语言无前缀
    direction: 'ltr',
    locale: 'en-US'
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    urlPrefix: '/zh',
    direction: 'ltr',
    locale: 'zh-CN'
  }
];
```

---

## 🏷️ Hreflang实现

### 正确的Hreflang格式

```html
<!-- 英文页面 /devices/ct-scanner-a -->
<link rel="alternate" hreflang="en" href="https://chinactscanner.org/devices/ct-scanner-a" />
<link rel="alternate" hreflang="zh" href="https://chinactscanner.org/zh/devices/ct-scanner-a" />
<link rel="alternate" hreflang="x-default" href="https://chinactscanner.org/devices/ct-scanner-a" />

<!-- 中文页面 /zh/devices/ct-scanner-a -->
<link rel="alternate" hreflang="en" href="https://chinactscanner.org/devices/ct-scanner-a" />
<link rel="alternate" hreflang="zh" href="https://chinactscanner.org/zh/devices/ct-scanner-a" />
<link rel="alternate" hreflang="x-default" href="https://chinactscanner.org/devices/ct-scanner-a" />
```

### 组件实现

```tsx
// src/components/SEOHead.tsx 中的实现
const generateHreflangLinks = (currentPath: string) => {
  return SUPPORTED_LANGUAGES.map(lang => ({
    rel: 'alternate',
    hreflang: lang.code,
    href: `${SITE_CONFIG.domain}${lang.urlPrefix}${currentPath}`
  }));
};
```

### 常见错误

```
❌ 避免的错误:

1. 缺少x-default
<link rel="alternate" hreflang="en" href="..." />
<link rel="alternate" hreflang="zh" href="..." />
<!-- 缺少 x-default -->

2. 非双向引用
英文页面只指向中文，中文页面未指向英文

3. 使用相对URL
<link rel="alternate" hreflang="zh" href="/zh/page" />
<!-- 应使用绝对URL -->

4. 错误的语言代码
hreflang="chinese" ❌
hreflang="zh" ✅
```

---

## 📝 内容本地化策略

### 翻译质量要求

```
✅ 高质量翻译标准:
- 专业术语准确（医疗设备行业术语）
- 符合目标读者习惯
- SEO关键词自然融入
- 保持品牌声音一致
- 本地化案例和数据

❌ 避免:
- 纯机器翻译
- 逐字直译
- 忽略文化差异
- 使用源语言关键词
```

### 关键词本地化

| 英文关键词 | 中文关键词 | 搜索量(英) | 搜索量(中) |
|-----------|-----------|-----------|-----------|
| CT scanner | CT扫描仪 | 12,100 | 8,100 |
| MRI machine | 核磁共振 / MRI机 | 22,200 | 15,000 |
| medical imaging | 医学影像 | 8,100 | 6,600 |
| hospital equipment | 医院设备 | 5,400 | 4,400 |

### 地区化内容差异

```markdown
美国市场内容重点:
- FDA认证状态
- 美元价格
- 美国服务网络
- 美国案例研究

欧洲市场内容重点:
- CE认证
- 欧元价格
- 欧洲分销商
- GDPR合规

中东市场内容重点:
- 阿拉伯语支持（未来）
- 本地支付方式
- 宗教/文化考量
- 本地合作伙伴
```

---

## 🛠️ 技术实现检查

### HTML Lang属性

```tsx
// LanguageRouteProvider.tsx
useEffect(() => {
  document.documentElement.lang = currentLanguage.code;
  document.documentElement.dir = currentLanguage.direction;
}, [currentLanguage]);
```

### Sitemap国际化

```xml
<!-- sitemap.xml with hreflang -->
<url>
  <loc>https://chinactscanner.org/devices/ct-scanner-a</loc>
  <xhtml:link rel="alternate" hreflang="en" 
    href="https://chinactscanner.org/devices/ct-scanner-a"/>
  <xhtml:link rel="alternate" hreflang="zh" 
    href="https://chinactscanner.org/zh/devices/ct-scanner-a"/>
  <xhtml:link rel="alternate" hreflang="x-default" 
    href="https://chinactscanner.org/devices/ct-scanner-a"/>
</url>
```

### GSC设置

```
Google Search Console配置:
1. 添加主域名属性
2. 验证所有语言版本可访问
3. 提交国际化Sitemap
4. 设置国际定位（如适用）
5. 监控各语言版本索引状态
```

---

## 📊 国际化SEO监控

### 按语言/地区追踪

| 指标 | 英文版 | 中文版 | 目标 |
|-----|-------|-------|------|
| 索引页面数 | | | 100% |
| 有机流量 | | | MoM +10% |
| 关键词Top 10 | | | +5/月 |
| 平均排名 | | | <15 |
| 跳出率 | | | <50% |

### 常见问题排查

```
问题1: 语言版本未被索引
→ 检查hreflang实现
→ 检查robots.txt是否阻止
→ 在GSC请求索引

问题2: 错误语言版本排名
→ 检查hreflang双向引用
→ 确保内容真正本地化
→ 检查内链语言一致性

问题3: 重复内容警告
→ 确认hreflang正确
→ 添加canonical标签
→ 内容差异化
```

---

## 🔗 相关文档

- [语言配置](../../src/config/language.ts)
- [多语言路由](../../src/utils/multilingualRoutes.ts)
- [市场关键词研究](./market-keyword-research.md)
- [SEOHead组件](../../src/components/SEOHead.tsx)

---

**文档版本**: v1.0  
**创建日期**: 2026-01-03  
**支持语言**: 英文（默认）、中文
