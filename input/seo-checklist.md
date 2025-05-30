# SEO 优化 Checklist（规范+实操示例版）

本清单系统梳理了高质量页面SEO优化的理论原则与实操要点，并为每条规范提供了简明 DEMO 示例，便于理解和落地执行。

---

## 1. SEO 友好 HTML 输出
- HTML 代码必须符合 SEO 标准，采用语义化结构，正确使用 H1-H6 标题标签。
  - **DEMO:**
    ```html
    <main>
      <header>
        <h1>AI 视频生成器</h1>
      </header>
    </main>
    ```

## 2. 关键词优化标题
- 主要关键词应融入 H1 标题，次要关键词自然融入 H2 等标题和正文内容。
  - **DEMO:**
    ```html
    <title>AI Video Generator - 免费在线生成</title>
    <h1>AI 视频生成器</h1>
    ```

## 3. 内容 SEO 相关性
- 页面内容需与用户搜索意图高度相关，围绕关键词提供有价值信息。
  - **DEMO:**
    ```html
    <meta name="description" content="用 AI 一键生成高质量视频和图片，满足多场景需求。">
    ```

## 4. 长文案结构化
- 长文案需结构化，便于搜索引擎抓取和用户阅读（H1-H6、段落、列表等）。
  - **DEMO:**
    ```html
    <h2>产品优势</h2>
    <ul>
      <li>操作简单</li>
      <li>多语言支持</li>
    </ul>
    ```

## 5. 视频 SEO 优化
- 视频需使用描述性文件名和 ALT 文本，提升视频被搜索引擎识别的能力。
  - **DEMO:**
    ```html
    <video src="ai-demo-video.mp4" poster="ai-video-cover.webp" alt="AI 视频演示"></video>
    ```

## 6. 图片 SEO 优化
- 图片应压缩优化，优先使用 WebP 格式，支持懒加载，并添加描述性文件名和 ALT 文本。
  - **DEMO:**
    ```html
    <img src="product-feature.webp" alt="AI 视频生成器界面" loading="lazy" />
    ```

## 7. 页面加载速度优化
- 代码精简，避免冗余，静态资源使用 CDN 加速，提升页面加载速度。
  - **DEMO:**
    ```html
    <link rel="preload" href="/static/main.css" as="style">
    <script src="https://cdn.example.com/main.js"></script>
    ```

## 8. 移动端优先优化
- 页面需移动端优先设计，确保移动设备上加载速度和体验。
  - **DEMO:**
    ```html
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ```

## 9. 响应式设计
- 页面必须响应式，适配各种屏幕尺寸。
  - **DEMO:**
    ```css
    @media (max-width: 600px) {
      body { font-size: 16px; }
    }
    ```

## 10. E-A-T 权威性
- 页面应包含权威性和可信度指标（如专家背书、权威认证等）。
  - **DEMO:**
    ```html
    <script type="application/ld+json">{"@context":"http://schema.org","@type":"Organization","name":"Pollo AI","url":"https://pollo.ai"}</script>
    ```

## 11. 用户互动指标优化
- 优化设计提升用户互动（如点击率、停留时间、跳出率等）。
  - **DEMO:**
    ```html
    <button>立即体验</button>
    ```

## 12. 价值驱动定价
- 清晰展示价格和优惠信息，突出产品价值感。
  - **DEMO:**
    ```html
    <section>
      <h2>价格方案</h2>
      <p>免费试用，专业版仅需 ¥99/月</p>
    </section>
    ```

## 13. 单解决方案聚焦
- 页面聚焦单一产品或解决方案，避免分散用户注意力。
  - **DEMO:**
    ```html
    <section>
      <h2>一站式 AI 视频/图片生成</h2>
    </section>
    ```

## 14. 品牌调性一致性
- 页面颜色、设计风格需与品牌一致，提升品牌识别度。
  - **DEMO:**
    ```html
    <img src="logo.svg" alt="品牌 LOGO">
    <meta name="theme-color" content="#ff9900">
    ```

## 15. 落地页合规性
- 包含必要合规声明，确保符合平台政策和法律法规。
  - **DEMO:**
    ```html
    <link rel="manifest" href="/manifest.json">
    <meta property="google" content="notranslate">
    ```

## 16. 多语言与国际化
- 支持多语言，适配不同地区用户，使用 hreflang 标记。
  - **DEMO:**
    ```html
    <link rel="alternate" hreflang="en" href="https://example.com/en" />
    <link rel="alternate" hreflang="zh" href="https://example.com/zh" />
    ```

## 17. Open Graph & 社交媒体优化
- 配置 og:title、og:description、og:image 等，优化社交平台分享效果。
  - **DEMO:**
    ```html
    <meta property="og:title" content="AI 视频生成器">
    <meta property="og:description" content="一站式 AI 视频/图片生成解决方案">
    <meta property="og:image" content="https://example.com/og-image.webp">
    ```

## 18. 结构化数据
- 使用结构化数据（如 JSON-LD），提升搜索引擎对页面内容的理解。
  - **DEMO:**
    ```html
    <script type="application/ld+json">{"@context":"http://schema.org","@type":"Product","name":"AI 视频生成器"}</script>
    ```

## 19. PWA 支持
- 支持渐进式 Web 应用（PWA），提升用户体验和复访率。
  - **DEMO:**
    ```html
    <link rel="manifest" href="/manifest.json">
    <link rel="apple-touch-icon" href="/icon-192.png">
    ```

## 20. 防止机器翻译
- 设置相关 meta，避免自动翻译影响品牌表达。
  - **DEMO:**
    ```html
    <meta property="google" content="notranslate">
    ```

---

> **说明：** 本 Checklist 既可用于SEO策略制定，也可用于页面开发与自查，每条均配有实操 DEMO 便于理解和落地。
