# WebSim Starter 结构化数据（ld+json）注入指南

本指南详细说明了如何在 WebSim Starter 项目中自动为 HTML 页面注入结构化数据（ld+json），以提升 SEO 和丰富搜索结果，并支持未来每个页面个性化结构化数据的灵活扩展。

---

## 1. 结构化数据注入原则

- 每个 HTML 页面可包含多个 ld+json 区块。
- 注入的类型和数量根据页面类型、路径、文件名、内容以及 `config.json` 的 `apptype` 字段自动判定。
- 支持多语言和多应用类型（如 App、Game、Product、Blog、FAQ 等）。
- 支持为每个页面单独准备结构化数据，实现页面级个性化。

---

## 2. 支持的 Schema 类型（推荐覆盖）

WebSim Starter 支持并建议优先覆盖以下结构化数据类型，具体可参考 [Google 结构化数据功能总览](https://developers.google.cn/search/docs/appearance/structured-data/search-gallery)：

- [Article](https://developers.google.cn/search/docs/appearance/structured-data/article)
- [Book actions](https://developers.google.cn/search/docs/appearance/structured-data/book)
- [Breadcrumb](https://developers.google.cn/search/docs/appearance/structured-data/breadcrumb)
- [Carousel](https://developers.google.cn/search/docs/appearance/structured-data/carousel)
- [Course info](https://developers.google.cn/search/docs/appearance/structured-data/course-info)
- [Course list](https://developers.google.cn/search/docs/appearance/structured-data/course)
- [Dataset](https://developers.google.cn/search/docs/appearance/structured-data/dataset)
- [Discussion forum](https://developers.google.cn/search/docs/appearance/structured-data/discussion-forum)
- [Education Q&A](https://developers.google.cn/search/docs/appearance/structured-data/education-qa)
- [Employer aggregate rating](https://developers.google.cn/search/docs/appearance/structured-data/employer-rating)
- [Estimated salary](https://developers.google.cn/search/docs/appearance/structured-data/estimated-salary)
- [Event](https://developers.google.cn/search/docs/appearance/structured-data/event)
- [Fact check](https://developers.google.cn/search/docs/appearance/structured-data/factcheck)
- [FAQ](https://developers.google.cn/search/docs/appearance/structured-data/faqpage)
- [Image metadata](https://developers.google.cn/search/docs/appearance/structured-data/image-license-metadata)
- [Job posting](https://developers.google.cn/search/docs/appearance/structured-data/job-posting)
- [Learning video](https://developers.google.cn/search/docs/appearance/structured-data/learning-video)
- [Local business](https://developers.google.cn/search/docs/appearance/structured-data/local-business)
- [Math solver](https://developers.google.cn/search/docs/appearance/structured-data/math-solvers)
- [Movie carousel](https://developers.google.cn/search/docs/appearance/structured-data/movie)
- [Organization](https://developers.google.cn/search/docs/appearance/structured-data/organization)
- [Practice problem](https://developers.google.cn/search/docs/appearance/structured-data/practice-problems)
- Product
    - [Overview](https://developers.google.cn/search/docs/appearance/structured-data/product)
    - [Product snippet](https://developers.google.cn/search/docs/appearance/structured-data/product-snippet)
    - [Merchant listing](https://developers.google.cn/search/docs/appearance/structured-data/merchant-listing)
    - [Variants](https://developers.google.cn/search/docs/appearance/structured-data/product-variants)
- [Profile page](https://developers.google.cn/search/docs/appearance/structured-data/profile-page)
- [Q&A](https://developers.google.cn/search/docs/appearance/structured-data/qapage)
- [Recipe](https://developers.google.cn/search/docs/appearance/structured-data/recipe)
- [Review snippet](https://developers.google.cn/search/docs/appearance/structured-data/review-snippet)
- [Software app](https://developers.google.cn/search/docs/appearance/structured-data/software-app)
- [Speakable](https://developers.google.cn/search/docs/appearance/structured-data/speakable)
- [Special announcement](https://developers.google.cn/search/docs/appearance/structured-data/special-announcements)
- [Subscription and paywalled content](https://developers.google.cn/search/docs/appearance/structured-data/paywalled-content)
- [Vacation rental](https://developers.google.cn/search/docs/appearance/structured-data/vacation-rental)
- [Vehicle listing](https://developers.google.cn/search/docs/appearance/structured-data/vehicle-listing)
- [Video](https://developers.google.cn/search/docs/appearance/structured-data/video)

**特别说明：**  
- 建议将 [Review snippet（评论/评分）](https://developers.google.cn/search/docs/appearance/structured-data/review-snippet) 作为基础类型之一，适用于产品、课程、App、文章等多种页面，提升搜索展示效果。

---

## 3. 模板管理与个性化

- 所有 ld+json 模板存放于 `d:\Download\audio-visual\borninsea\a_websim-website-starter\scripts\ldjson\` 及其子目录。
- 支持两种模板组织方式：
  1. **默认类型模板**：如 `ldjson/app/default/app.json`、`website.json` 等，适用于大多数页面。
  2. **页面级个性化模板**：如 `ldjson/app/home/website.json`、`ldjson/app/about/organization.json`，每个页面一个文件夹，内含该页面所有需注入的结构化数据文件。
- 模板采用 `{{变量名}}` 占位，自动从 config 或页面内容提取。

---

## 4. 自动注入规则

### 4.1 页面类型判定

- **Blog/Posts 页面**  
  路径包含 `/blog/` 或 `/posts/`，或 HTML 含 `<article>` 标签，判定为博客文章页。
- **FAQ 页面**  
  路径包含 `/faq/` 或文件名含 `faq`，判定为 FAQ 页。
- **Product 页面**  
  路径包含 `/product/` 或文件名含 `product`，判定为产品页。
- **Game 页面**  
  路径包含 `/game/` 或文件名含 `game`，判定为游戏页。
- **默认 App 页面**  
  其他页面默认为 App 相关页面。

### 4.2 apptype 组合规则

`config.json` 中通过 `"apptype"` 字段指定项目类型，不同类型默认注入组合如下：

| apptype   | 默认注入类型                                                         |
|-----------|---------------------------------------------------------------------|
| app       | WebSite, Organization, SoftwareApplication, BreadcrumbList, Review  |
| game      | WebSite, Organization, GameApplication, BreadcrumbList, Review      |
| product   | WebSite, Organization, Product, BreadcrumbList, Review              |
| blog      | WebSite, Organization, Article, BreadcrumbList, Review              |
| faq       | WebSite, Organization, FAQPage, BreadcrumbList                      |

> **说明：** Review（评论/评分）建议作为产品、App、课程、文章等页面的基础结构化数据类型。

### 4.3 页面级个性化注入

- 若 `ldjson/<apptype>/<页面名>/` 目录存在，则优先加载该页面下所有 json 文件，全部注入。
- 若无页面级目录，则按默认类型模板和自动判定规则注入。

### 4.4 内容感知补充注入

- 检测到 FAQ 区块（如含 `.faq-question`/`.faq-answer`）且非 FAQ 页面，也会补充注入 FAQPage。
- 检测到 `<article>` 标签且非 Blog 页面，也会补充注入 Article。
- 检测到评论/评分内容时，建议补充注入 Review 结构化数据。

---

## 5. 注入流程

1. **遍历所有 HTML 文件**（支持多语言目录）。
2. **判定页面类型**（根据路径、文件名、内容）。
3. **优先查找页面级个性化模板**（如有则全部注入）。
4. **否则按 apptype 及页面类型加载对应类型的模板**。
5. **渲染模板变量**（如 `{{website.name}}`、`{{product.name}}`）。
6. **如模板缺失，使用内置生成器生成 JSON**。
7. **避免重复注入同类型 ld+json**。
8. **所有 ld+json 块插入到 `</head>` 前**。

---

## 6. 配置与扩展

- `config.json` 可指定默认注入的 apptype（如 `"apptype": "game"`）。
- 新增类型只需在 `ldjson` 目录下添加模板，并在注入规则中配置即可。
- 支持自定义模板变量，自动从 config 或页面内容提取。
- 支持为每个页面单独准备结构化数据，实现页面级 SEO 优化。

---

## 7. 示例模板

见 `scripts/ldjson/` 目录下各类 JSON 文件，如：

- `app/default/app.json`
- `app/home/website.json`
- `game/default/game.json`
- `product/default/product.json`
- `faq/default/faqpage.json`
- `article/default/article.json`
- `review.json`
- `breadcrumblist.json`
- `organization.json`
- `website.json`

---

## 8. 常见问题

**Q: 一个页面可以有多个 ld+json 吗？**  
A: 可以，且推荐按需注入多个类型，提升结构化数据覆盖面。

**Q: 如何扩展支持新类型或页面级个性化？**  
A: 新增模板文件或页面文件夹，并在注入规则函数中添加对应类型即可。

**Q: 如何避免重复注入？**  
A: 脚本会检测页面已有的 ld+json 类型，避免重复插入。

---

## 9. 参考

- [Schema.org 官方文档](https://schema.org/)
- [Google 结构化数据功能总览](https://developers.google.cn/search/docs/appearance/structured-data/search-gallery)
- [Google 结构化数据指南](https://developers.google.cn/search/docs/appearance/structured-data/intro-structured-data)
- [Google 结构化数据测试工具]( [Google 结构化数据测试工具](https://support.google.com/webmasters/answer/7445569#zippy=%2C%E6%94%AF%E6%8C%81%E7%9A%84%E7%B1%BB%E5%9E%8B)
---

如需进一步定制注入规则或模板，请联系开发团队。