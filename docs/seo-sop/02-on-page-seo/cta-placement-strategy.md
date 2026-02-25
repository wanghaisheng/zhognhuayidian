# CTA 布局策略

> 合理的CTA（Call-to-Action）布局既满足SEO需求，又能最大化转化率，实现流量→询盘的闭环

---

## 一、CTA 类型定义

### 1.1 按转化目标分类

| CTA类型 | 目标 | 典型文案 | 适用阶段 |
|---------|------|----------|----------|
| **主CTA** | 核心转化（询价/注册） | Get Quote, 立即询价 | BOFU |
| **辅助CTA** | 次级转化（下载/订阅） | Download Guide, 获取白皮书 | MOFU |
| **探索CTA** | 引导深入浏览 | Learn More, 了解详情 | TOFU |
| **社交CTA** | 社交分享/关注 | Follow Us, 分享 | 全阶段 |

### 1.2 按交互形式分类

| 形式 | 描述 | 使用场景 |
|------|------|----------|
| **Button** | 独立按钮 | 页面顶部、底部 |
| **Inline Link** | 文内链接 | 正文中自然引导 |
| **Floating Bar** | 浮动条 | 长页面持续可见 |
| **Modal/Popup** | 弹窗 | 退出意图、延时触发 |
| **Sidebar Widget** | 侧边栏组件 | 博客、指南页 |
| **Form Embed** | 嵌入表单 | 落地页底部 |

---

## 二、页面位置策略

### 2.1 三段式布局

```
┌─────────────────────────────────────────┐
│  HEADER                                 │
│  ┌─────────────────────────────────┐   │
│  │  Hero Section                    │   │
│  │  H1 + Value Proposition          │   │
│  │  ★ 主CTA: Get Quote Now         │ ◄─── 首屏必见
│  └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│  MIDDLE CONTENT                         │
│  ┌─────────────────────────────────┐   │
│  │  Features / Benefits             │   │
│  │  ...                             │   │
│  │  ★ 辅助CTA: Download Guide      │ ◄─── 阅读中触达
│  │  ...                             │   │
│  │  Case Studies / Testimonials     │   │
│  │  ★ 辅助CTA: View More Cases     │   │
│  └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│  BOTTOM                                 │
│  ┌─────────────────────────────────┐   │
│  │  FAQ Section                     │   │
│  │  ...                             │   │
│  │  ★ 收尾CTA: Ready to Start?     │ ◄─── 阅读完成触达
│  │     [Get Quote] [Contact Us]     │   │
│  └─────────────────────────────────┘   │
│  FOOTER                                 │
└─────────────────────────────────────────┘
```

### 2.2 不同页面类型的CTA配置

#### 产品详情页

| 位置 | CTA类型 | 内容示例 |
|------|---------|----------|
| Hero区 | 主CTA | "Request Quote" / "立即询价" |
| 规格表后 | 辅助CTA | "Download Specs PDF" / "下载规格书" |
| 客户案例后 | 辅助CTA | "View More Cases" / "查看更多案例" |
| 页面底部 | 主CTA | "Ready to Buy? Get Your Quote" |
| 浮动栏 | 主CTA | 固定显示询价按钮 |

#### 列表/对比页

| 位置 | CTA类型 | 内容示例 |
|------|---------|----------|
| 对比表上方 | 探索CTA | "Not sure which to choose? Talk to Expert" |
| 每个产品卡片 | 辅助CTA | "View Details" / "Compare" |
| 页面中部 | 主CTA | "Get Personalized Recommendations" |
| 页面底部 | 主CTA | "Request Quotes for Multiple Products" |

#### 指南/博客页

| 位置 | CTA类型 | 内容示例 |
|------|---------|----------|
| 文章开头 | 辅助CTA | "Download Checklist" |
| 文章中部 | 辅助CTA | "Subscribe for More Guides" |
| 相关产品区 | 探索CTA | "Explore CT Scanners" |
| 文章结尾 | 主CTA | "Ready to Apply This Knowledge? Get Quote" |
| 侧边栏 | 辅助CTA | 固定订阅/下载组件 |

---

## 三、CTA 设计规范

### 3.1 按钮设计标准

```tsx
// 主CTA - 高对比度，最醒目
<Button variant="default" size="lg">
  Get Quote Now
</Button>

// 辅助CTA - 次级突出
<Button variant="secondary" size="default">
  Download Guide
</Button>

// 探索CTA - 低调引导
<Button variant="outline" size="sm">
  Learn More →
</Button>
```

### 3.2 按钮尺寸

| 设备 | 最小尺寸 | 推荐尺寸 |
|------|----------|----------|
| 桌面端 | 120px × 40px | 160px × 48px |
| 移动端 | 全宽 or 44px高 | 48px × 48px 触摸区 |

### 3.3 颜色与对比度

```css
/* 主CTA: 使用主色调 */
.cta-primary {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}

/* 辅助CTA: 使用次级色调 */
.cta-secondary {
  background: hsl(var(--secondary));
  color: hsl(var(--secondary-foreground));
}

/* 确保对比度 >= 4.5:1 (WCAG AA) */
```

---

## 四、CTA 文案公式

### 4.1 主CTA文案

#### 公式: [动作] + [价值/结果]

| 动作词 | 价值描述 | 完整文案 |
|--------|----------|----------|
| Get | Your Free Quote | Get Your Free Quote |
| Request | Personalized Pricing | Request Personalized Pricing |
| Start | Your Free Trial | Start Your Free Trial |
| Book | Expert Consultation | Book Expert Consultation |

#### 中文版

| 动作词 | 价值描述 | 完整文案 |
|--------|----------|----------|
| 获取 | 免费报价 | 获取免费报价 |
| 申请 | 专属优惠 | 申请专属优惠 |
| 预约 | 专家咨询 | 预约专家咨询 |
| 立即 | 开始试用 | 立即开始试用 |

### 4.2 辅助CTA文案

```
Download [资源类型]
下载 [资源类型]

例如:
- Download Buyer's Guide
- 下载采购指南
- Download Spec Sheet
- 下载规格表
```

### 4.3 紧迫感元素

| 类型 | 英文示例 | 中文示例 |
|------|----------|----------|
| 时间限制 | Limited Time Offer | 限时优惠 |
| 库存限制 | Only 5 Units Left | 仅剩5台 |
| 人数限制 | First 100 Get 10% Off | 前100名享9折 |
| 节日促销 | Black Friday Special | 年末特惠 |

---

## 五、转化追踪

### 5.1 事件追踪代码

```tsx
import { trackEvent } from '@/lib/tracking';

// CTA点击追踪
const handleCTAClick = (ctaType: string, location: string) => {
  trackEvent('cta_click', {
    cta_type: ctaType,        // 'primary', 'secondary', 'explore'
    page_location: location,   // 'hero', 'middle', 'bottom'
    page_path: window.location.pathname,
  });
};

// 使用
<Button onClick={() => handleCTAClick('primary', 'hero')}>
  Get Quote
</Button>
```

### 5.2 转化漏斗追踪

```
CTA Impression → CTA Click → Form Open → Form Submit → Lead Qualified
```

| 事件 | 追踪点 |
|------|--------|
| CTA曝光 | 视口可见时触发 |
| CTA点击 | onClick事件 |
| 表单打开 | 弹窗/页面加载 |
| 表单提交 | form submit |
| 询盘确认 | 后端确认 |

### 5.3 A/B测试指标

| 指标 | 计算方式 | 基准值 |
|------|----------|--------|
| CTR | CTA点击 / CTA曝光 | 2-5% |
| Form完成率 | 表单提交 / 表单打开 | 30-50% |
| 询盘率 | 询盘数 / 页面UV | 1-3% |

---

## 六、组件实现

### 6.1 询价表单组件

```tsx
import InquiryForm from '@/components/InquiryForm';

// 页面底部使用
<section className="bg-muted py-12">
  <div className="container mx-auto">
    <h2>Ready to Get Started?</h2>
    <p>Request a personalized quote for your hospital</p>
    <InquiryForm 
      source="product_page_bottom"
      productId={device.id}
    />
  </div>
</section>
```

### 6.2 浮动CTA组件

```tsx
// 创建 FloatingCTA 组件
const FloatingCTA = ({ show }: { show: boolean }) => {
  if (!show) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50 md:bottom-8 md:right-8">
      <Button size="lg" className="shadow-lg">
        Get Quote
      </Button>
    </div>
  );
};

// 使用: 滚动超过首屏后显示
const [showFloating, setShowFloating] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setShowFloating(window.scrollY > window.innerHeight);
  };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

### 6.3 收尾CTA区块

```tsx
const ClosingCTA = () => (
  <section className="bg-primary text-primary-foreground py-16">
    <div className="container mx-auto text-center">
      <h2 className="text-3xl font-bold mb-4">
        Ready to Find Your Ideal CT Scanner?
      </h2>
      <p className="text-lg mb-8 opacity-90">
        Get personalized recommendations and competitive pricing
      </p>
      <div className="flex gap-4 justify-center">
        <Button variant="secondary" size="lg">
          Get Quote
        </Button>
        <Button variant="outline" size="lg">
          Contact Expert
        </Button>
      </div>
    </div>
  </section>
);
```

---

## 七、检查清单

### 发布前检查

- [ ] 首屏有可见的主CTA
- [ ] 页面中部有辅助CTA
- [ ] 页面底部有收尾CTA区块
- [ ] 所有CTA按钮可点击且链接正确
- [ ] 移动端CTA易于点击（≥48px触摸区）
- [ ] CTA颜色对比度符合WCAG AA标准
- [ ] 事件追踪代码已添加
- [ ] 表单字段已简化（≤5个必填项）

### 定期审计

- [ ] 月度: 检查CTA点击率
- [ ] 季度: A/B测试CTA文案/颜色
- [ ] 年度: 整体CTA策略评估

---

## 八、案例参考

### 高转化产品页示例

```
┌─────────────────────────────────────────────┐
│ [Breadcrumb]                                │
│                                             │
│ ┌─────────────────┐ ┌───────────────────┐  │
│ │                 │ │ Siemens SOMATOM   │  │
│ │   [Product      │ │ go.Top CT Scanner │  │
│ │    Image]       │ │                   │  │
│ │                 │ │ ⭐ 4.8 (128 reviews)  │
│ └─────────────────┘ │                   │  │
│                     │ ★ [Get Quote]     │  │ ← 主CTA
│                     │   [Download Specs]│  │ ← 辅助CTA
│                     └───────────────────┘  │
├─────────────────────────────────────────────┤
│ ## Key Features                             │
│ - Feature 1...                              │
│ - Feature 2...                              │
│                                             │
│ ★ [Compare with Similar Models]            │ ← 探索CTA
├─────────────────────────────────────────────┤
│ ## Technical Specifications                 │
│ [Spec Table]                                │
│                                             │
│ ★ [Download Full Spec Sheet PDF]           │ ← 辅助CTA
├─────────────────────────────────────────────┤
│ ## Customer Success Stories                 │
│ [Case Study Cards]                          │
├─────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐│
│ │  Ready to Get Your CT Scanner?          ││
│ │  ★ [Request Quote] [Talk to Expert]    ││ ← 收尾CTA
│ └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘
│ ★ [Floating: Get Quote]                    │ ← 浮动CTA
└─────────────────────────────────────────────┘
```

---

*最后更新: 2025-01*
*维护人: SEO Team*
