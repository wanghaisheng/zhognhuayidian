# changlog



## 2025-04-27

**作者：Heisenberg**

### 今日要点总结

1. **首页视频演示优化**
   - 将 index.html 首页静态图片替换为响应式手机尺寸的 MP4 视频播放器，提升视觉吸引力和移动端体验。

2. **SEO 动态 meta 批量注入**
   - 新增 meta-loader.js，自动根据 locale/en.json、locale/zh.json 的 seo 字段批量注入 description、keywords、og:title、og:image、canonical、robots、author 等 meta。
   - 批量为 en.json、zh.json 增加标准 SEO 字段，内容参考主流最佳实践。
   - meta 支持多语言切换自动更新。

3. **自动生成多语言 alternate 标签**
   - 新增 alternate-loader.js，自动为所有支持语言生成 <link rel="alternate" hreflang=...> 标签，含 x-default，国际 SEO 友好。
   - 语言和路径检测逻辑参考 ldjson 多语言处理。

4. **canonical 动态加载**
   - canonical-loader.js 支持根据 config.json baseUrl 和当前路径自动生成 canonical 链接。

5. **最佳实践参考**
   - 参考 template/pollo/pollo.html 的 meta 字段、alternate 标签结构，全面提升 SEO 规范性和国际化支持。

6. **Sitemap 生成与多语言适配**
   - sitemap 逻辑支持自动检测 lang 目录和多语言页面，动态读取各语言 JSON 的前 3 个 key，按配置生成有效 URL。
   - 支持 config.json 配置语言目录，提升灵活性与可维护性。
   - 保证 sitemap 仅包含真实存在的页面，robots.txt 规则同步更新。
   - 优化 robots.txt，兼容 AI Scraper、GPTBot、Google-Extended 等主流 AI 爬虫，提升抓取友好度和隐私控制。

7. **ldjson loader 自动注入结构化数据**
   - 新增 ldjson-loader.js，自动为页面批量注入结构化数据（如 WebSite、Organization、BreadcrumbList 等），提升搜索引擎理解能力。
   - 多语言和页面类型自动适配，结构与 pollo.html、ldjson.js 保持一致。

7. **intro-en.html 视频页面制作**
   - 制作了 intro-en.html 页面，用于展示首页视频演示内容，作为 Vision Board 应用英文版的详细介绍与视频来源。
   - 页面内容与首页视频播放器联动，提升多语言用户体验与内容一致性。

8. **AI 友好的 llms.txt 多语言支持**
   - 支持自动为每种站点语言生成对应的 llms-<lang>.txt 文件（如 llms-zh.txt、llms-fr.txt），robots.txt 针对 AI Scraper bot 自动开放所有语言版本，提升 AI 语料抓取与国际化能力。


8. 使用germini一键更新内容

