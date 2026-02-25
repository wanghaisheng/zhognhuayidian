# 移动端优化规范

> Google采用移动优先索引（Mobile-First Indexing），移动端体验直接影响搜索排名

---

## 一、核心要求

### 1.1 移动优先索引原则

| 原则 | 说明 |
|------|------|
| **内容一致** | 移动端与桌面端内容相同 |
| **结构化数据** | 两端Schema标记一致 |
| **Meta标签** | 两端Title/Description一致 |
| **可抓取性** | 移动端不阻止Googlebot |

### 1.2 目标指标

| 指标 | 目标值 | 测试工具 |
|------|--------|----------|
| 移动友好测试 | 通过 | Mobile-Friendly Test |
| 触摸目标尺寸 | ≥48x48px | Lighthouse |
| 视口配置 | 正确 | 源代码检查 |
| 文字可读 | 无需缩放 | 手动测试 |

---

## 二、视口配置

### 2.1 正确的viewport设置

```html
<!-- index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
```

### 2.2 常见错误

```html
<!-- ❌ 禁用缩放 - 可访问性问题 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />

<!-- ❌ 固定宽度 - 不响应 -->
<meta name="viewport" content="width=1024" />

<!-- ❌ 缺少viewport - 桌面布局 -->
<!-- 无viewport标签 -->
```

---

## 三、触摸目标优化

### 3.1 尺寸要求

| 元素类型 | 最小尺寸 | 推荐尺寸 | 间距 |
|----------|----------|----------|------|
| 按钮 | 44x44px | 48x48px | 8px |
| 链接 | 44x44px | 48x48px | 8px |
| 表单输入 | 44px高 | 48px高 | 8px |
| 图标按钮 | 44x44px | 48x48px | 8px |

### 3.2 Tailwind 实现

```tsx
// 按钮组件
<Button className="min-h-[48px] min-w-[48px] px-6">
  Submit
</Button>

// 图标按钮
<Button variant="ghost" size="icon" className="h-12 w-12">
  <MenuIcon className="h-6 w-6" />
</Button>

// 链接
<a href="/page" className="inline-block py-3 px-4">
  Link Text
</a>
```

### 3.3 间距处理

```tsx
// 按钮组 - 确保足够间距
<div className="flex gap-3">
  <Button>Primary</Button>
  <Button variant="outline">Secondary</Button>
</div>

// 列表链接 - 足够的垂直间距
<nav className="space-y-2">
  <a href="/page1" className="block py-3">Link 1</a>
  <a href="/page2" className="block py-3">Link 2</a>
</nav>
```

---

## 四、文字可读性

### 4.1 字体大小规范

| 元素 | 最小尺寸 | 推荐尺寸 |
|------|----------|----------|
| 正文 | 14px | 16px |
| 小字 | 12px | 14px |
| 标题 | 根据层级 | H1:24px, H2:20px |

### 4.2 Tailwind 实现

```tsx
// 正文文字
<p className="text-base">  {/* 16px */}
  Regular paragraph text
</p>

// 小字文字
<span className="text-sm">  {/* 14px */}
  Secondary text
</span>

// 确保最小字体
<p className="text-sm md:text-base">
  Responsive text
</p>
```

### 4.3 行高与间距

```tsx
// 良好的行高
<p className="leading-relaxed">  {/* 1.625 */}
  Long paragraph content...
</p>

// 段落间距
<article className="space-y-4">
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</article>
```

---

## 五、响应式布局

### 5.1 断点规范

```tsx
// Tailwind 默认断点
// sm: 640px
// md: 768px
// lg: 1024px
// xl: 1280px
// 2xl: 1536px

// 移动优先写法
<div className="
  grid 
  grid-cols-1      /* 移动端: 单列 */
  md:grid-cols-2   /* 平板: 双列 */
  lg:grid-cols-3   /* 桌面: 三列 */
  gap-4
">
```

### 5.2 常见响应式模式

#### 导航菜单

```tsx
// Header 组件
<header className="flex items-center justify-between p-4">
  <Logo />
  
  {/* 桌面导航 */}
  <nav className="hidden md:flex gap-6">
    <NavLinks />
  </nav>
  
  {/* 移动端汉堡菜单 */}
  <Sheet>
    <SheetTrigger className="md:hidden">
      <MenuIcon className="h-6 w-6" />
    </SheetTrigger>
    <SheetContent>
      <MobileNav />
    </SheetContent>
  </Sheet>
</header>
```

#### 卡片网格

```tsx
<div className="
  grid
  grid-cols-1
  sm:grid-cols-2
  lg:grid-cols-3
  xl:grid-cols-4
  gap-4 md:gap-6
">
  {devices.map(device => (
    <DeviceCard key={device.id} device={device} />
  ))}
</div>
```

#### 侧边栏布局

```tsx
<div className="flex flex-col lg:flex-row gap-6">
  {/* 主内容 - 移动端全宽 */}
  <main className="flex-1 order-2 lg:order-1">
    <Content />
  </main>
  
  {/* 侧边栏 - 移动端在上方或隐藏 */}
  <aside className="w-full lg:w-80 order-1 lg:order-2">
    <Sidebar />
  </aside>
</div>
```

---

## 六、表单优化

### 6.1 输入类型

```tsx
// 使用正确的输入类型触发合适的键盘
<input type="email" />     // 邮箱键盘
<input type="tel" />       // 数字键盘
<input type="number" />    // 数字键盘
<input type="search" />    // 搜索键盘
<input type="url" />       // URL键盘
```

### 6.2 输入框尺寸

```tsx
// 足够的输入框高度
<Input className="h-12 text-base" />

// 足够的间距
<form className="space-y-4">
  <div>
    <Label>Email</Label>
    <Input type="email" className="mt-1.5 h-12" />
  </div>
  <div>
    <Label>Phone</Label>
    <Input type="tel" className="mt-1.5 h-12" />
  </div>
</form>
```

### 6.3 自动完成

```tsx
// 启用自动完成提高体验
<Input 
  type="email" 
  autoComplete="email"
  name="email"
/>

<Input 
  type="tel" 
  autoComplete="tel"
  name="phone"
/>
```

---

## 七、图片优化

### 7.1 响应式图片

```tsx
// 使用 srcset 提供不同尺寸
<img
  src="/image-800.jpg"
  srcSet="
    /image-400.jpg 400w,
    /image-800.jpg 800w,
    /image-1200.jpg 1200w
  "
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  alt="Product image"
/>

// 使用项目的 ImageOptimized 组件
<ImageOptimized
  src="/image.jpg"
  alt="Product"
  className="w-full h-auto"
/>
```

### 7.2 懒加载

```tsx
// 非首屏图片使用懒加载
<img
  src="/image.jpg"
  loading="lazy"
  alt="Below fold image"
/>

// 首屏图片不要懒加载
<img
  src="/hero.jpg"
  loading="eager"  // 或不设置
  alt="Hero image"
/>
```

---

## 八、性能优化

### 8.1 减少移动端资源

```tsx
// 移动端隐藏非必要元素（CSS隐藏而非不渲染）
<div className="hidden lg:block">
  <DesktopOnlyWidget />
</div>

// 条件渲染减少DOM
const isMobile = useIsMobile();

{!isMobile && <DesktopOnlyComponent />}
```

### 8.2 触摸交互优化

```css
/* 移除触摸延迟 */
* {
  touch-action: manipulation;
}

/* 触摸反馈 */
.touchable {
  -webkit-tap-highlight-color: transparent;
}

.touchable:active {
  opacity: 0.7;
  transform: scale(0.98);
}
```

### 8.3 滚动优化

```css
/* 平滑滚动 */
html {
  scroll-behavior: smooth;
}

/* 滚动容器优化 */
.scroll-container {
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}
```

---

## 九、测试流程

### 9.1 工具测试

```
1. Google Mobile-Friendly Test
   - 输入URL测试
   - 查看问题列表
   
2. Chrome DevTools
   - 打开Device Mode (Ctrl+Shift+M)
   - 选择设备: iPhone 12, Galaxy S21
   - 测试交互
   
3. Lighthouse
   - 选择 Mobile
   - 运行审计
   - 关注 Accessibility 评分
```

### 9.2 手动测试清单

#### 导航测试
- [ ] 汉堡菜单可打开/关闭
- [ ] 菜单项可点击
- [ ] Logo链接到首页
- [ ] 面包屑正常显示

#### 内容测试
- [ ] 文字可读，无需缩放
- [ ] 图片正确显示
- [ ] 无横向滚动
- [ ] 表格可横向滚动

#### 交互测试
- [ ] 按钮可点击
- [ ] 表单可输入
- [ ] 弹窗可关闭
- [ ] 下拉菜单可选择

#### 性能测试
- [ ] 页面3秒内可交互
- [ ] 滚动流畅
- [ ] 无明显卡顿

### 9.3 真机测试

```
优先测试设备:
1. iPhone 12/13/14 (Safari)
2. Samsung Galaxy S21/S22 (Chrome)
3. iPad (Safari)

测试网络条件:
- 4G (慢速)
- WiFi (正常)
```

---

## 十、常见问题修复

### 10.1 内容被裁剪

```tsx
// ❌ 固定宽度导致裁剪
<div style={{ width: '1200px' }}>

// ✅ 响应式宽度
<div className="w-full max-w-7xl mx-auto px-4">
```

### 10.2 触摸目标太小

```tsx
// ❌ 太小的触摸目标
<a href="/page" className="text-sm">Link</a>

// ✅ 足够的触摸区域
<a href="/page" className="inline-block py-3 px-4">Link</a>
```

### 10.3 文字太小

```tsx
// ❌ 太小的文字
<p className="text-xs">Content</p>

// ✅ 可读的文字
<p className="text-sm md:text-base">Content</p>
```

### 10.4 横向滚动

```tsx
// ❌ 表格导致横向滚动
<table className="w-[1000px]">

// ✅ 表格容器可滚动
<div className="overflow-x-auto">
  <table className="w-full min-w-[600px]">
```

---

## 十一、检查清单

### 发布前

- [ ] 通过 Mobile-Friendly Test
- [ ] Lighthouse Mobile 评分 ≥ 90
- [ ] 所有触摸目标 ≥ 48px
- [ ] 无横向滚动
- [ ] 文字无需缩放可读
- [ ] 表单输入类型正确
- [ ] 导航菜单可用

### 定期审计

- [ ] 月度: Mobile-Friendly Test
- [ ] 月度: 真机测试关键页面
- [ ] 季度: 全站移动端审计

---

*最后更新: 2025-01*
*维护人: SEO Team*
