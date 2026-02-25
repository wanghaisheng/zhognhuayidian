# Core Web Vitals 优化指南

> 2024年起，INP (Interaction to Next Paint) 正式取代FID成为Core Web Vitals核心指标

---

## 一、指标概览

### 1.1 三大核心指标

| 指标 | 全称 | 测量内容 | 目标值 | 需改进 | 差 |
|------|------|----------|--------|--------|-----|
| **LCP** | Largest Contentful Paint | 最大内容绘制时间 | ≤2.5s | 2.5-4s | >4s |
| **INP** | Interaction to Next Paint | 交互响应延迟 | ≤200ms | 200-500ms | >500ms |
| **CLS** | Cumulative Layout Shift | 累积布局偏移 | ≤0.1 | 0.1-0.25 | >0.25 |

### 1.2 评估来源

| 数据类型 | 来源 | 特点 |
|----------|------|------|
| **Field Data (真实用户)** | GSC, CrUX | 反映真实体验，需28天数据 |
| **Lab Data (实验室)** | Lighthouse, PSI | 可控环境，便于调试 |

**注意**: Google排名使用Field Data，优化时需关注真实用户数据。

---

## 二、LCP 优化

### 2.1 什么触发LCP

常见LCP元素:
- `<img>` 图片
- `<video>` 视频封面
- 带背景图的元素
- 包含文本的块级元素

### 2.2 LCP慢的常见原因

| 原因 | 占比 | 解决方案 |
|------|------|----------|
| 服务器响应慢 | 25% | CDN、缓存、服务器优化 |
| 资源加载慢 | 35% | 预加载、压缩、CDN |
| 渲染阻塞 | 25% | 内联关键CSS、延迟JS |
| 客户端渲染 | 15% | 预渲染、SSR |

### 2.3 优化策略

#### A. 预加载关键资源

```html
<!-- 预加载LCP图片 -->
<link rel="preload" as="image" href="/hero-image.webp" />

<!-- 预加载字体 -->
<link rel="preload" as="font" href="/fonts/main.woff2" crossorigin />
```

#### B. 图片优化

```tsx
// 使用 ImageOptimized 组件
import ImageOptimized from '@/components/ImageOptimized';

// Hero图片 - 预加载，不lazy load
<ImageOptimized
  src="/hero.webp"
  alt="Hero Image"
  priority={true}  // 预加载
  width={1200}
  height={600}
/>

// 非首屏图片 - lazy load
<ImageOptimized
  src="/below-fold.webp"
  alt="Below Fold Image"
  lazy={true}
/>
```

#### C. 图片格式选择

```tsx
// 现代格式优先
<picture>
  <source srcSet="/image.avif" type="image/avif" />
  <source srcSet="/image.webp" type="image/webp" />
  <img src="/image.jpg" alt="Fallback" />
</picture>
```

#### D. 避免渲染阻塞

```html
<!-- 关键CSS内联 -->
<style>
  /* 首屏关键样式 */
</style>

<!-- 非关键CSS异步加载 -->
<link rel="preload" href="/styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'" />

<!-- JS延迟加载 -->
<script src="/app.js" defer></script>
```

### 2.4 React项目特定优化

```tsx
// 代码分割 - 按路由懒加载
const DeviceDetail = lazy(() => import('./pages/DeviceDetailPage'));

// 使用Suspense
<Suspense fallback={<Skeleton />}>
  <DeviceDetail />
</Suspense>
```

---

## 三、INP 优化

### 3.1 什么是INP

INP测量用户交互（点击、触摸、键盘输入）到页面视觉更新的延迟时间。

```
用户交互 → 事件处理 → 样式计算 → 布局 → 绘制 → 合成
          ←────────── INP测量范围 ──────────→
```

### 3.2 INP慢的常见原因

| 原因 | 解决方案 |
|------|----------|
| 长任务阻塞主线程 | 拆分长任务、使用Web Worker |
| 大量DOM操作 | 批量更新、虚拟列表 |
| 复杂事件处理器 | debounce/throttle |
| 第三方脚本 | 延迟加载、移除不必要脚本 |

### 3.3 优化策略

#### A. 拆分长任务

```tsx
// ❌ 长任务阻塞
function processData(items) {
  items.forEach(item => {
    heavyCalculation(item);
  });
}

// ✅ 使用 requestIdleCallback 拆分
function processDataChunked(items) {
  let index = 0;
  
  function processChunk(deadline) {
    while (index < items.length && deadline.timeRemaining() > 0) {
      heavyCalculation(items[index]);
      index++;
    }
    if (index < items.length) {
      requestIdleCallback(processChunk);
    }
  }
  
  requestIdleCallback(processChunk);
}
```

#### B. 优化事件处理器

```tsx
// ❌ 频繁触发
<input onChange={(e) => filterResults(e.target.value)} />

// ✅ Debounce
import { useDebouncedCallback } from 'use-debounce';

const debouncedFilter = useDebouncedCallback(
  (value) => filterResults(value),
  300
);

<input onChange={(e) => debouncedFilter(e.target.value)} />
```

#### C. 虚拟列表

```tsx
// 大列表使用虚拟化
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={items.length}
  itemSize={50}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>{items[index].name}</div>
  )}
</FixedSizeList>
```

#### D. 避免布局抖动

```tsx
// ❌ 强制同步布局
element.style.width = '100px';
const width = element.offsetWidth; // 强制重排
element.style.height = width + 'px';

// ✅ 批量读写
const width = element.offsetWidth; // 读
element.style.width = '100px';     // 写
element.style.height = width + 'px';
```

---

## 四、CLS 优化

### 4.1 什么导致CLS

- 无尺寸的图片/视频
- 动态插入的内容
- 字体加载导致的文本偏移
- 异步加载的广告

### 4.2 优化策略

#### A. 图片设置尺寸

```tsx
// ❌ 无尺寸
<img src="/image.jpg" alt="Product" />

// ✅ 明确尺寸
<img 
  src="/image.jpg" 
  alt="Product" 
  width={800} 
  height={600}
/>

// ✅ 使用 aspect-ratio
<img 
  src="/image.jpg" 
  alt="Product"
  className="w-full aspect-video object-cover"
/>
```

#### B. 预留广告位空间

```tsx
// 广告容器预留固定高度
<div className="ad-container min-h-[250px] bg-muted">
  <AdSenseAd slot="..." />
</div>
```

#### C. 字体优化

```css
/* 使用 font-display: swap */
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap;
}

/* 或使用 optional 避免布局偏移 */
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: optional;
}
```

#### D. 骨架屏

```tsx
// 加载时显示骨架屏，保持布局稳定
{isLoading ? (
  <div className="space-y-4">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
  </div>
) : (
  <article>{content}</article>
)}
```

#### E. 避免动态内容插入

```tsx
// ❌ 内容加载后推动布局
<header>Header</header>
{notification && <Banner />}  {/* 插入时推动下方内容 */}
<main>Content</main>

// ✅ 预留空间或覆盖显示
<header>Header</header>
<div className="h-12">  {/* 固定高度容器 */}
  {notification && <Banner />}
</div>
<main>Content</main>

// 或使用固定定位
<Banner className="fixed top-0 left-0 right-0" />
```

---

## 五、监控与调试

### 5.1 Chrome DevTools

```
Performance面板:
1. 开启录制
2. 进行用户交互
3. 停止录制
4. 分析长任务（红色三角标记）

Lighthouse面板:
1. 选择 Performance 类别
2. 选择移动设备模拟
3. 生成报告
```

### 5.2 Web Vitals 库

```tsx
// 安装: npm install web-vitals

import { onLCP, onINP, onCLS } from 'web-vitals';

onLCP(console.log);
onINP(console.log);
onCLS(console.log);

// 发送到分析服务
import { onLCP, onINP, onCLS } from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    id: metric.id,
  });
  navigator.sendBeacon('/analytics', body);
}

onLCP(sendToAnalytics);
onINP(sendToAnalytics);
onCLS(sendToAnalytics);
```

### 5.3 GSC Core Web Vitals 报告

路径: GSC → 体验 → 核心网页指标

```
1. 查看整体状态（良好/需改进/差）
2. 按问题类型分组查看URL
3. 点击具体问题查看受影响页面
4. 修复后使用"验证修复"功能
```

---

## 六、优化检查清单

### 发布前检查

#### LCP
- [ ] Hero图片已预加载
- [ ] 关键CSS已内联
- [ ] 非关键JS已defer
- [ ] 图片使用WebP格式
- [ ] 开启CDN缓存

#### INP
- [ ] 无超过50ms的长任务
- [ ] 事件处理器已优化
- [ ] 大列表使用虚拟化
- [ ] 第三方脚本已延迟

#### CLS
- [ ] 所有图片有尺寸
- [ ] 广告位预留空间
- [ ] 字体使用swap/optional
- [ ] 动态内容不推动布局

### 定期审计

| 频率 | 检查项 |
|------|--------|
| 每周 | 查看GSC CWV报告 |
| 每月 | Lighthouse全站审计 |
| 每季度 | 深度性能分析 |

---

## 七、项目特定优化

### 7.1 React-snap 预渲染

预渲染改善LCP:
```json
// package.json
{
  "scripts": {
    "postbuild": "react-snap"
  }
}
```

### 7.2 图片组件

使用项目的 `ImageOptimized` 组件:
```tsx
import ImageOptimized from '@/components/ImageOptimized';
```

### 7.3 懒加载组件

使用项目的 `LazyComponents`:
```tsx
import { LazyDeviceDetail } from '@/components/LazyComponents';
```

---

## 八、参考资源

- [web.dev - Core Web Vitals](https://web.dev/vitals/)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [INP 优化指南](https://web.dev/inp/)
- [CLS 优化指南](https://web.dev/cls/)

---

*最后更新: 2025-01*
*维护人: SEO Team*
