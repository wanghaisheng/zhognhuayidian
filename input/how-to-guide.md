1. prd中包含功能需求、痛点分析、工具构建的背景故事、内链建设思路（可以用于规划urls）
2. input\saas-official-launch-stage-prompt.md和input\v3-tool.md 是用于指导页面生成的提示词，对于我们而言，根据第一步的规划，首页、工具页和其他页面的提示词你可以从前面中提取合适的
3. 实现技术以input\saas-official-launch-stage-prompt.md中的为准
>**最终输出包含 `index.html`, `about.html`, `career.html`,`tools/xx.html` 文件,具体以网站结构设计为准，以及 `css/`, `js/`, `img/`, `locale/` 文件夹的项目结构**. **本模板** **最核心的升级** **是** **极致强调在 `index.html` 中融入 **功能互动、高度用户友好、且性能优化的互动预览式 Playground 板块**，允许用户未登录状态下简单输入并预览初步结果，获取完整结果需引导注册/登录，整个流程在页面内无缝完成，极致提升用户参与度、转化漏斗效率和早期用户积累。** 同时，在 `index.html` 显著位置加入 **“精选结果展示” (Featured Results Showcase) 板块**，直观展示工具能力和价值。**此外，为了提供** **开箱即用的多语言支持**，模板输出包含 `locale/` 文件夹 (内含 **JSON 格式的多语言数据文件**)，**所有 HTML 页面 (`index.html`, `about.html`, `career.html`) 的 Footer 区域均包含语言切换功能**，并且 **所有页面的文本内容和可本地化数据均通过 HTML 的 `data-i18n` 属性进行管理和显示**，配合 JavaScript 脚本实现 **动态多语言切换**。 **本版本还包含 **“未来优势差异化” Section** 和 **“深度用户痛点挖掘与远见卓识的解决方案” Section** (位于 `index.html`)，**在 Pre-launch 阶段，侧重于通过清晰的愿景和痛点解决，建立早期用户信任和兴趣。** **新增生成 `about.html` (讲述小团队起源故事) 和 `career.html` (发布具体招聘职位：Remote Fullstack Next.js Developer) 页面**，要求所有页面风格、多语言支持、SEO 和 E-E-A-T 原则保持高度一致性。

4. input\seo-checklist.md、input\config.json、input\ld-json-guide.md是相关的配置和优化文档
5. input\design-style-guide.md 如果有需要可以参考，如果没有需要根据prd和风格要求自行创建
6. 规划并开始整个网站的实现
7. 根据提示词 reference\llm-txt.md 结合sitemap。xml 和docs\prd.md，生成llms.txt

