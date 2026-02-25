# 技术SEO审计SOP

> 对应主清单条目 #46-70，覆盖可抓取性、站点结构、速度优化、移动端与结构化数据

---

## 一、快速检查表

### A. 基础可抓取性与索引 (#46-52)

| # | 检查项 | 状态 | 优先级 | 工具 |
|---|--------|------|--------|------|
| 46 | robots.txt 存在且配置正确 | ⬜ | P0 | 直接访问 /robots.txt |
| 47 | 允许爬取 CSS/JS 资源 | ⬜ | P0 | GSC URL检查 |
| 48 | XML Sitemap 已生成并包含所有页面 | ⬜ | P0 | /sitemap.xml |
| 49 | Sitemap 已提交到 GSC | ⬜ | P0 | GSC Sitemaps |
| 50 | 关键页面未设置 noindex | ⬜ | P0 | 源代码检查 |
| 51 | 使用规范 Canonical 标签 | ⬜ | P0 | SEOHead组件 |
| 52 | 不同URL不出现相同内容 | ⬜ | P1 | Screaming Frog |

### B. 站点结构与URL规范 (#53-58)

| # | 检查项 | 状态 | 优先级 | 工具 |
|---|--------|------|--------|------|
| 53 | 网站层级深度 ≤ 3 | ⬜ | P1 | Screaming Frog |
| 54 | 使用子目录而非子域名 | ⬜ | P0 | URL审查 |
| 55 | URL 使用小写字母+连字符 | ⬜ | P0 | 代码规范 |
| 56 | URL 简短，避免无意义参数 | ⬜ | P1 | URL审查 |
| 57 | 旧URL全部301到新URL | ⬜ | P0 | 重定向测试 |
| 58 | 重要页面1-2次点击到达 | ⬜ | P1 | 导航审查 |

### C. 速度与 Core Web Vitals (#59-65)

| # | 检查项 | 状态 | 优先级 | 工具 |
|---|--------|------|--------|------|
| 59 | LCP ≤ 2.5s | ⬜ | P0 | PageSpeed Insights |
| 60 | INP ≤ 200ms | ⬜ | P0 | PageSpeed Insights |
| 61 | CLS ≤ 0.1 | ⬜ | P0 | PageSpeed Insights |
| 62 | 图片已压缩并使用 WebP | ⬜ | P1 | Lighthouse |
| 63 | 已开启浏览器缓存 | ⬜ | P1 | 响应头检查 |
| 64 | 使用延迟加载非首屏图片 | ⬜ | P1 | 源代码检查 |
| 65 | 减少第三方脚本 | ⬜ | P1 | Coverage工具 |

### D. 移动端与结构化数据 (#66-70)

| # | 检查项 | 状态 | 优先级 | 工具 |
|---|--------|------|--------|------|
| 66 | 通过移动端友好测试 | ⬜ | P0 | Mobile-Friendly Test |
| 67 | CTA按钮易点击 (≥48x48px) | ⬜ | P0 | 手动测试 |
| 68 | 已添加 Product/SoftwareApplication Schema | ⬜ | P1 | Rich Results Test |
| 69 | 已添加 Article/BlogPosting Schema | ⬜ | P1 | Rich Results Test |
| 70 | 已添加 FAQPage Schema | ⬜ | P1 | Rich Results Test |

---

## 二、审计执行流程

### Phase 1: 自动化爬取 (Day 1)

```
工具: Screaming Frog SEO Spider

1. 配置爬取设置
   - 勾选: Crawl JavaScript, Render JavaScript
   - 限制: 最大URL数量根据网站规模设置
   
2. 开始爬取并导出报告:
   - Response Codes (检查4xx/5xx)
   - Page Titles (检查重复/缺失)
   - Meta Descriptions (检查重复/缺失)
   - H1/H2 (检查缺失/重复)
   - Canonicals (检查问题)
   - Directives (检查noindex)
   
3. 标记问题页面
```

### Phase 2: Core Web Vitals 检查 (Day 1-2)

```
工具: PageSpeed Insights + GSC Core Web Vitals报告

1. 检查GSC中的Core Web Vitals报告
   - 分别查看Mobile和Desktop
   - 标记Poor/Needs Improvement的URL
   
2. 逐个测试关键页面:
   - 首页
   - 主要产品列表页
   - 热门产品详情页
   - 博客/指南页
   
3. 记录每个页面的LCP/INP/CLS值
```

### Phase 3: 移动端测试 (Day 2)

```
工具: Chrome DevTools + 真机测试

1. 使用DevTools模拟移动设备
   - iPhone 12/13
   - Samsung Galaxy S21
   
2. 检查项:
   - 文字可读性（不需缩放）
   - 按钮/链接可点击
   - 无横向滚动
   - 弹窗不遮挡内容
   
3. 真机测试（如有条件）
```

### Phase 4: 结构化数据验证 (Day 2-3)

```
工具: Rich Results Test + Schema Validator

1. 测试关键页面类型:
   - 产品页 → Product Schema
   - 制造商页 → Organization Schema
   - 博客页 → Article Schema
   - FAQ区域 → FAQPage Schema
   
2. 验证JSON-LD语法正确
3. 检查必填字段完整
4. 预览Rich Results效果
```

### Phase 5: 综合报告 (Day 3)

```
输出: 技术SEO审计报告

内容:
1. 执行摘要（关键发现）
2. 问题分类（Critical/High/Medium/Low）
3. 具体问题列表
4. 修复建议
5. 优先级排序
6. 预估工作量
```

---

## 三、常见问题修复指南

### 3.1 robots.txt 问题

**问题**: robots.txt 阻止了重要页面
```
# 错误配置
User-agent: *
Disallow: /devices/
```

**修复**: 编辑 `public/robots.txt`
```
# 正确配置
User-agent: *
Disallow: /admin/
Disallow: /api/
Allow: /

Sitemap: https://yoursite.com/sitemap.xml
```

### 3.2 Canonical 问题

**问题**: 缺失或错误的Canonical标签

**修复**: 使用 SEOHead 组件
```tsx
<SEOHead
  canonicalUrl={`https://yoursite.com${location.pathname}`}
/>
```

### 3.3 重复内容

**问题**: 带参数的URL产生重复内容
- `/devices?page=1`
- `/devices?sort=price`

**修复方案**:
1. 设置Canonical指向无参数版本
2. 在robots.txt中添加:
```
Disallow: /*?page=
Disallow: /*?sort=
```

### 3.4 404错误

**问题**: 存在大量404页面

**修复流程**:
1. 从GSC/Screaming Frog导出404列表
2. 分类：是否曾有流量/外链
3. 有价值的→设置301重定向
4. 无价值的→确认移除即可

### 3.5 页面速度慢

**问题**: LCP > 2.5s

**常见原因与修复**:
| 原因 | 修复方案 |
|------|----------|
| 图片过大 | 压缩+WebP+lazy load |
| 字体加载慢 | font-display: swap |
| JS阻塞渲染 | defer/async + 代码分割 |
| 服务器响应慢 | CDN + 缓存 |

---

## 四、项目特定配置

### 4.1 Sitemap 生成

项目已配置动态Sitemap生成:
```
scripts/generate-sitemap.js
scripts/generate-dynamic-sitemap.js
```

验证路径: `/sitemap.xml`

### 4.2 结构化数据实现

参考文件:
- `src/lib/structuredData.ts` - Schema生成工具
- `src/components/SEOHead.tsx` - Schema注入

已实现的Schema类型:
- Product（设备页）
- Organization（制造商页）
- WebSite（全站）
- BreadcrumbList（面包屑）
- FAQPage（FAQ区域）

### 4.3 图片优化

使用组件:
```tsx
import ImageOptimized from '@/components/ImageOptimized';

<ImageOptimized
  src="/images/device.jpg"
  alt="CT Scanner Image"
  width={800}
  height={600}
  lazy={true}
/>
```

### 4.4 预渲染配置

React-snap配置见:
- `docs/react-snap-setup.md`
- `scripts/generate-prerender-routes.js`

---

## 五、监控与告警

### 5.1 GSC监控频率

| 报告 | 检查频率 | 关注指标 |
|------|----------|----------|
| 索引覆盖 | 每周 | 有效页面数、排除页面数 |
| Core Web Vitals | 每周 | Poor URL数量变化 |
| 移动设备适用性 | 每月 | 问题页面数 |
| 增强功能 | 每周 | Schema错误 |

### 5.2 告警阈值

| 指标 | 告警阈值 | 行动 |
|------|----------|------|
| 404增加 | >10个/周 | 立即排查 |
| 索引下降 | >5%/周 | 立即排查 |
| CWV变差 | 任何Poor | 72小时内修复 |
| Schema错误 | 任何错误 | 1周内修复 |

---

## 六、工具清单

### 免费工具
- **Google Search Console**: 索引、CWV、移动端
- **PageSpeed Insights**: 速度检测
- **Rich Results Test**: Schema验证
- **Mobile-Friendly Test**: 移动端测试
- **Chrome DevTools**: 调试

### 付费工具
- **Screaming Frog**: 网站爬取（500 URL免费）
- **Ahrefs/Semrush**: 技术审计+竞品分析
- **ContentKing**: 实时监控

### 浏览器扩展
- **Lighthouse**: 综合审计
- **SEO Meta in 1 Click**: 快速查看页面SEO元素
- **Web Vitals**: 实时CWV显示

---

## 七、相关文档

- [Core Web Vitals 优化指南](./core-web-vitals-guide.md)
- [结构化数据参考文档](./structured-data-reference.md)
- [移动端优化规范](./mobile-optimization.md)
- [项目Sitemap策略](../../sitemap-strategy.md)

---

*最后更新: 2025-01*
*维护人: SEO Team*
