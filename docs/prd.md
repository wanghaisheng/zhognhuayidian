# PRD: WebSim Vibe Coding Starter

## 1. 项目背景与目标
- 目标：打造一个极致自动化、SEO 友好、支持多语言、可一键部署的现代 SaaS 网站生成器。
- 用户：希望快速上线高质量网站的开发者、创业团队、内容创作者。
- 痛点：传统建站繁琐，SEO 难以自动化，多语言和内容管理复杂，缺乏一站式自动部署。

## 2. 核心功能
- **AI 研究与需求分析**：集成 Grok.com，自动挖掘用户痛点、竞品分析。
- **PRD 生成**：集成 Google AI Studio，根据用户输入与调研自动生成详细产品需求文档（PRD.md）。
- **代码与内容生成**：集成 WebSim.com，结合 PRD.md 和 prompt 模板自动生成完整 HTML/CSS/JS 站点。
- **SEO 自动化**：自动生成 sitemap、robots.txt，集成 IndexNow、Bing、Google Search Console API，自动提交和校验。
- **多语言支持**：locale 目录自动生成中英文等多语言 JSON 资源，支持动态切换。
- **Playground 互动区**：多步骤标签页，支持嵌入第三方工具、输入输出流转。
- **一键部署**：支持 Cloudflare Pages、GitHub Pages 等静态托管，自动化 CI/CD。

## 3. 用户流程
1. **Grok.com 研究用户痛点** —— 复制调研结果。
2. **Google AI Studio 生成 PRD.md** —— 粘贴调研内容，输出详细需求文档。
3. **WebSim.com 生成站点** —— 粘贴 PRD.md 与 prompt 模板，自动生成 html 文件。
4. **本地配置与部署** —— 将文件放入根目录，配置 config.json，连接 Cloudflare，git push 即可上线。

## 4. 关键页面与模块
- 首页（index.html）：产品介绍、功能亮点、Playground 互动区、案例展示、未来愿景。
- about.html、career.html：团队与招聘信息。
- Playground：多步骤标签页，嵌入 Grok、Google AI Studio、WebSim。
- locale/：多语言资源。
- docs/prompts/：各类 prompt 模板。

## 5. 技术与集成
- 前端：HTML5、CSS3、GSAP 动画、响应式设计、SVG 插画。
- 后端/自动化脚本：Python（requests）、GitHub Actions。
- 第三方 API：Grok.com、Google AI Studio、WebSim.com、Cloudflare Pages、IndexNow、Bing、Google Search Console。

## 6. SEO 及最佳实践
- 语义化 HTML、H1-H6、alt 标签、meta 优化。
- 自动 sitemap/robots.txt、自动提交索引。
- 避免 GSC 常见错误，详细见 docs/gsc-common-mistakes.md。

## 7. 交互与视觉
- 大胆创意、现代 SaaS 风格，卡片式布局。
- 多步骤 Tab、动画切换、极致响应式。
- 真实用户头像与 SVG 插画混用。

## 8. 未来拓展
- 支持更多第三方 API（如 Notion、Figma、Midjourney 等）。
- 支持自定义主题与 UI 组件市场。
- 智能内容更新与 A/B 测试。

## 9. AI Scraper 友好特性
- 内置支持主流 AI 爬虫（如 GPTBot、anthropic-ai、Amazonbot、Bytespider 等）友好的 robots.txt 自动生成，自动区分普通搜索引擎与 AI Scraper。
- 支持自动生成 llms.txt/llms-full.txt，向 AI 爬虫清晰传递网站结构、内容分类、页面说明及最新动态，提升 AI 搜索与索引的友好度与曝光。
- robots.txt、llms.txt 规则可自动根据 config 和 ai-robots.txt 列表扩展维护，适配未来更多 AI 相关标准。

---

> 本 PRD.md 可作为自动化站点生成与团队协作的蓝本，适用于 WebSim Vibe Coding Starter 及其衍生项目。