基于 docs/prd.md 和 scripts/config.json，要求直接为每个页面生成结构化数据 json 文件，而不是新建脚本来实现。

1. 优先从 sitemap.xml 中读取所有页面的 HTML 路径（支持多语言和多目录结构，语言一般通过如 /en/、/zh/、/fr/ 等目录区分）。
2. 若 sitemap.xml 不存在或者未包含某些 HTML 页面，则递归遍历项目根目录下所有 HTML 文件，补全所有页面。
3. 对每个 HTML 文件，读取其内容，智能分析页面类型（如首页、产品页、文章页、FAQ页、App页等）。
4. 根据页面内容和类型，自动生成该页面所需的所有结构化数据（ld+json），包括但不限于：
   - WebSite
   - Organization
   - SoftwareApplication
   - Product
   - Article
   - FAQPage
   - BreadcrumbList
   - Review
   - 以及 Google 支持的其它 schema（如 Event、Course、Recipe、Video 等，按页面内容自动判断）。
5. 每个 schema 直接生成一个独立的 json 文件，文件名为 schema 类型（如 article.json、product.json 等）。
6. 多语言页面采用分层目录结构管理：将 json 文件分别保存到 scripts/ldjson/<语言>/<页面名>/ 文件夹下（如 en/about.html → scripts/ldjson/en/about/，zh/about.html → scripts/ldjson/zh/about/），路径均为项目根目录下的相对路径。
7. 支持多语言页面（通过目录结构自动提取语言信息，如 en/about.html → 语言为 en），如有需要可在 json 中体现语言字段（如 inLanguage）。
8. 生成的 json 文件内容需自动填充页面实际数据（如标题、作者、图片、描述、评分等），如无法提取则留空或用默认值。
9. 生成的 json 文件可直接供 scripts/ldjson.js 脚本加载 html 页面使用。

补充说明：
- 每个 HTML 页面必须包含 WebSite 和 Organization 两种结构化数据，这两类数据全站内容一致，仅需生成一次，统一存放于 scripts/ldjson/website.json 和 scripts/ldjson/organization.json，并在所有页面结构化数据注入流程中自动加载，无需为每个页面重复生成。
- 其他如 Article、Product、FAQPage 等 schema 仍按页面内容智能生成，按页面和语言分目录存放。

目标：
实现智能、结构化地为每个页面直接生成最优 ld+json 的 json 文件，便于后续 SEO 和富媒体展示。

