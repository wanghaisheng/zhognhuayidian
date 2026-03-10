# TanStack Router SSR/SSG 最佳实践指南 (Cloudflare Pages 版) v1.7.0
 
### 新增：混合内容源（Supabase + Markdown）静态化/SSR 设计
- 混合数据模型：公开内容以 Markdown 为主（content/<category>/<locale>/<slug>.md），结构化与列表数据来自 Supabase（仅匿名可读字段）。
- 构建期策略：使用原生 SSR 渲染器预渲染所有可静态化页面；在服务端入口对当前路由预加载 Markdown 并注入至 window.__TANSTACK_ROUTER_CONTEXT__，客户端入口显式调用 router.hydrate，避免首屏抖动。
- 运行时策略：除 Contact 表单外不依赖 Supabase；若个别动态 SEO 页需要兜底 SSR，优先利用已脱水数据，必要时仅访问匿名只读数据。
- 密钥隔离：服务端使用服务角色密钥，仅在构建脚本/Functions 环境；客户端仅使用匿名键，受 RLS 限制。严禁服务密钥进入客户端产物。
- 首屏一致性：路由工厂集成 @tanstack/react-query 的 dehydrate/hydrate；Markdown 由服务端入口基于 URL 解析类别/slug/locale 进行预加载并随脱水对象一并注入。
- Contact 提交：提供 /api/contact 服务端入口进行写库与风控（校验、限速、Captcha、审计告警）；客户端仅调用该 API。

本文档基于生产环境验证的架构，提炼了使用 TanStack Router 进行 SSR/SSG 混合部署的通用最佳实践。本方案特别针对 Cloudflare Pages 平台进行了优化，旨在实现高性能、高 SEO 友好度且低维护成本的现代 Web 应用。

---





## 1. 核心架构设计：静态优先，动态兜底 (Hybrid Architecture)

### 1.1 设计理念
- **默认静态 (SSG)**：对所有公开、内容相对固定的页面（营销页、博客、文档）进行构建期预渲染。这保证了最佳的 TTFB（首字节时间）和 CDN 缓存能力。
- **SSR 兜底 (SSR Fallback)**：仅对无法预渲染的长尾路径或需要实时数据的 SEO 页面启用运行时服务端渲染。
- **客户端渲染 (CSR)**：对需要登录状态、高度交互的应用内页面（Dashboard、设置），直接降级为 SPA 模式，无需 SSR。

### 1.2 URL 分层策略
| 路由类型 | 渲染模式 | 适用场景 | 示例 |
| :--- | :--- | :--- | :--- |
| **强静态** | SSG (预渲染) | 首页、关于我们、法律条款 | `/`, `/about` |
| **内容流** | SSG + ISR* | 博客文章、产品详情 | `/blog/$slug` |
| **应用态** | CSR (SPA) | 用户后台、购物车 | `/dashboard/*` |
| **动态 SEO** | SSR | 搜索结果、即时生成的落地页 | `/search`, `/promo/$id` |

> *注：Cloudflare Pages 暂不支持增量静态再生 (ISR)，通常通过“预渲染 + 定时重建”或“预渲染首屏 + 客户端数据更新”替代。

---

## 2. 路由系统改造 (Router Refactoring)

### 2.1 工厂模式 (Factory Pattern)
在 SSR 环境下，**必须**避免单例模式。每个请求都需要独立的 Router 实例，以防止跨请求的状态污染。

```tsx
// ❌ 错误：单例模式
export const router = createRouter({ ... })

// ✅ 正确：工厂模式
export function createRouter() {
  return createRouter({
    routeTree,
    context: { ... }, // 注入请求级上下文
  })
}
```

### 2.2 入口分离
标准的 SSR 架构需要拆分客户端和服务端入口：

- **`entry-client.tsx`**：负责客户端“注水” (Hydration)。
  ```tsx
  const router = createRouter()
  router.hydrate() // 恢复服务端状态
  ReactDOM.hydrateRoot(document.getElementById('root')!, <RouterProvider router={router} />)
  ```

- **`entry-server.tsx`**：负责服务端渲染与脱水 (Dehydration)。
  ```tsx
  export async function render(url, headAssets) {
    const router = createRouter()
    const memoryHistory = createMemoryHistory({ initialEntries: [url] })
    router.update({ history: memoryHistory })

    await router.load() // 等待关键数据加载

    // 注入 Head 资源并渲染
    // 返回 { appHtml, dehydratedRouter }
  }
  ```

---

## 3. Cloudflare Functions 集成 (The Critical Part)

### 3.1 构建期生成入口 (Build-time Generation)
不要手动维护 `functions/[[path]].ts`。应在构建脚本中动态生成它，以便将 `index.html` 中带有哈希的文件名（如 `assets/index-Ah3...css`）自动注入到 SSR 模板中。

**流程**：
1. 构建客户端 (`vite build`) → 产出 `dist/client` (含带哈希的静态资源)。
2. 构建服务端 (`vite build --ssr`) → 产出 `dist/server`。
3. **脚本生成 Functions 入口**：读取 `dist/client/index.html` 提取 CSS/JS 标签，写入 `functions/[[path]].ts`。

### 3.2 静态资源绕行 (Static Bypass) - **核心稳定性机制**
SSR 最常见的问题是错误地拦截了静态资源请求（如 `.css`, `.js`, `robots.txt`），导致返回 HTML 内容，引发 MIME 类型错误或 React Hydration 错误 (Error 418)。

**最佳实践逻辑**：
```typescript
// functions/[[path]].ts
export const onRequest = async (context) => {
  const { pathname } = new URL(context.request.url);
  const accept = context.request.headers.get('accept') || '';

  // 1. 扩展名检查：任何带扩展名的请求视为静态资源
  const hasExt = /\/[^/]+\.[^/]+$/.test(pathname);

  // 2. Accept 头检查：不接受 HTML 的请求视为非页面请求
  const acceptsHtml = /\btext\/html\b/i.test(accept);

  // 3. 绕行判断：非 GET、有扩展名、或不接受 HTML -> 直接透传给静态层
  if (context.request.method !== 'GET' || hasExt || !acceptsHtml) {
    return context.next();
  }

  // ... 进入 SSR 逻辑
}
```

### 3.3 SSR 路由白名单 (Gating)
为了防止 404 页面或未知的 SPA 路由意外触发 SSR（导致不必要的计算开销或错误），建议引入**SSR 路径白名单**。

- **机制**：利用 `prerender-routes.json` 或 `sitemap` 作为白名单。
- **逻辑**：如果请求路径不在白名单中，跳过 SSR，直接返回 SPA 的 `index.html`（由 Cloudflare 默认行为处理）。

---

## 4. SEO 与 Head 管理

### 4.1 集中化策略（Canonical/Hreflang + 内容级 SEO）
- 集中输出链接：在根路由 Head 统一生成 canonical 与 alternate hreflang，按语言前缀规范化 URL（https、非 www、无尾斜杠），避免页面级重复与冲突
- 页面职责收敛：页面/路由仅输出内容级 SEO（title、description、OG、Twitter），不再输出 canonical/hreflang
- 本地化页面 SEO 数据：
  - 目录结构：`src/locales/<lang>/seo/**/*.{ts,json}`
  - 路径映射：`/` → `index.ts`；`/pricing` → `pricing/index.ts`；`/learn/what-is-mri` → `learn/what-is-mri.ts`
  - 字段支持：`title`、`description`、`structuredData`（不读取 `keywords`）
- 覆盖优先级：本地化页面 SEO（title/description/structuredData）> 页面/路由 head 值 > 英文映射（`src/config/seo-en.ts`，含 keywords）> 站点默认（`src/config/site.ts`）
- 关键词密度：允许在 SEO 工具层进行描述增强（推断关键词、90–180 字窗口、买方导向），确保描述质量，但不修改正文内容
- x-default 一致性：生成 hreflang 时同时输出 x-default 指向默认语言，保证多语言版本的双向链接完整
- 语言标签规范：中文统一输出 `zh-Hans`

### 4.2 避免 Hydration Mismatch
- 服务端生成的 Title/Meta 必须与客户端初始渲染完全一致；避免在组件内部使用 `useEffect` 修改 Title/Meta
- 取消服务端兜底：不在服务端入口修补 Head 或注入隐藏 H1；所有 Head（canonical、hreflang、title、description、OG、Twitter）由根路由与页面路由集中管理与产出
- 统一注入：Functions/入口只注入构建期资产与脱水状态，不拼接开发资源；静态资源请求绕行 SSR，防止 MIME 错误与 Hydration Error

---

## 5. 构建与部署管道 (Pipeline)

### 5.1 推荐构建顺序
1. **`build:client`**：生成静态产物。
2. **`build:server`**：生成 SSR 渲染器。
3. **`post-build`**：统一执行以下任务
   - 生成 `prerender-routes.json` 并调用 `generate-static.mjs` 产出静态 HTML
   - 生成 Cloudflare Worker（`scripts/generate-cf-worker.mjs`），注入构建期 CSS/JS 资产与脱水脚本
   - 生成分片站点地图：`sitemap-main.xml`、`sitemap-blog.xml` 与索引 `sitemap.xml`
   - 生成 `robots.txt` 与 `_redirects`，并优化 HTML（去除 `/src/*` 资产等）

注：
- 若本地已存在 `functions/[[path]].ts`（用于调试），生成脚本会跳过重建；发布前建议删除该文件让脚本重建，以确保资产清单与白名单最新。

### 5.2 重定向规则 (`_redirects`)
对于 Cloudflare Pages，正确的重定向规则是性能和稳定性的关键。

```plaintext
# 1. 静态资源优先 (防止 SSR 误拦截)
/assets/*  /assets/:splat  200
/images/*  /images/:splat  200

# 2. 规范化规则 (移除尾随斜杠等)
# 注意：不要强制添加尾随斜杠，这会破坏文件请求

# 3. SPA 兜底 (对于未被 SSR/SSG 覆盖的路径)
/*  /index.html  200
```

---

## 6. 常见故障排查 (Troubleshooting)

| 现象 | 可能原因 | 解决方案 |
| :--- | :--- | :--- |
| **CSS/JS 报 MIME 错误** | SSR 拦截了静态资源并返回了 HTML | 检查 `onRequest` 中的**静态资源绕行**逻辑；检查 `_redirects` 是否有强制重写规则。 |
| **React Error #418** | 服务端 HTML 与客户端渲染不一致 | 检查 `entry-server` 是否注入了正确的脱水数据；检查是否有组件使用了 `window` 变量但未做环境判断。 |
| **页面空白 / 307 跳转** | 路由初始化 URL 不正确 | 确保服务端传入 `createMemoryHistory` 的 URL 是规范化的（包含 pathname + search）。 |
| **样式闪烁 (FOUC)** | CSS 未在 HTML 头部注入 | 确保 `post-build` 阶段生成的 Cloudflare Worker 按白名单注入构建期 `<link rel="stylesheet">`。 |

---

## 7. 总结
本方案的核心优势在于**确定性**：
1. **构建确定性**：通过构建脚本注入哈希资源，杜绝版本不一致。
2. **路由确定性**：通过白名单和静态绕行，确保 SSR 只在应该发生的时候发生。
3. **SEO 确定性**：通过集中式 Head 管理，保证元数据的准确输出。


# TanStack Router 原生 SSR/SSG 迁移计划

## 1. 背景与目标
目前项目使用 Puppeteer 进行预渲染 (SSG)。这种方式虽然能够生成静态 HTML，但存在以下局限性：
- **构建效率低**：需要启动无头浏览器，资源消耗大且速度慢。
- **一致性风险**：客户端 Hydration 可能与 Puppeteer 抓取的 HTML 不完全匹配，导致页面闪烁或 Hydration Error。
- **依赖复杂**：Puppeteer 在 CI/CD 环境中配置较为繁琐。

**目标**：迁移到 TanStack Router 官方推荐的原生 SSR/SSG 方案，利用 Vite 的 SSR 模式进行高效、标准的静态页面生成。

## 2. 核心架构变更

### 2.1 路由实例工厂化 (Factory Pattern)
目前 `src/router.ts` 导出一个单例 `router`。在 SSR 环境下，必须为每个请求（或构建时的每个页面）创建一个独立的 Router 实例，以避免状态污染。

- **当前**: `export const router = createRouter(...)`
- **计划**: `export function createRouter() { return createRouter(...) }`

### 2.2 入口文件拆分
标准的 SSR 架构需要将入口分为客户端和服务端两部分：

1.  **`src/entry-client.tsx`** (客户端注水)
    - 替代原本的 `src/index.tsx`。
    - 使用 `StartClient` 或 `hydrateRoot` 进行激活。
    - 负责恢复服务端传递的状态 (Dehydrated State)。

2.  **`src/entry-server.tsx`** (服务端渲染)
    - 新增文件。
    - 负责接收 URL，创建 Router 实例。
    - 等待 `loader` 数据加载完成。
    - 使用 `ReactDOMServer.renderToString` 或 `renderToPipeableStream` 生成 HTML。
    - 注入脱水状态 (`DehydratedRouter`) 到 HTML 中。
1.  **`src/entry-client.tsx`** (客户端注水/挂载)
    - 使用 `RouterClient` 并结合 `shouldHydrate` 策略：存在 SSR 产物时使用 `hydrateRoot` 注水，否则使用 `createRoot` 挂载
    - 在最外层包裹 I18n Provider 与必要的上下文，以保证与服务端初始状态一致

### 2.3 Vite 配置调整
需要调整 `vite.config.ts` 以支持 SSR 构建：
- 配置 `ssr.noExternal` 以确保特定依赖被正确打包。
- 可能需要区分 `vite build` (客户端) 和 `vite build --ssr` (服务端)。

## 3. 数据加载与状态同步 (Dehydration/Hydration)

### 3.1 Loader 适配
TanStack Router 的核心优势在于其 Loader 系统天然支持 SSR。
- **机制**：服务端执行 Loader -> 序列化数据 -> 注入 HTML -> 客户端复用数据（不重新请求）。
- **要求**：确保所有 `loader` 函数是纯粹的（不依赖 `window`/`document`），或者在服务端有正确的 Polyfill/Mock。

### 3.2 国际化 (I18n) 适配
- 确保 i18n 在服务端正确初始化（基于 URL 解析语言）。
- 将服务端的 i18n Store 状态序列化，并在客户端初始化时恢复，避免语言闪烁。

### 3.3 SEO 与元数据管理 (Head Management)
- **现状与问题**: TanStack Router 的 `HeadContent` 组件在 SSR 模式下存在无法正确提取 `title` 的问题（表现为 `<title>undefined</title>`），且与 React 19 配合时存在兼容性挑战。
- **实施方案 (已落地)**:
    - **手动标题解析**: 在 `src/routes/__root.tsx` 中实现了**手动标题解析 (Manual Title Resolution)** 逻辑。
    - **集中式元数据管理**:
        - **Hreflang & Canonical**: 全部逻辑移至 `src/routes/__root.tsx` 统一处理。根据当前 URL 自动生成所有支持语言的 `alternate` 链接和当前语言的 `canonical` 链接。
        - **去冗余**: 移除了分散在各个路由文件（如 `blog.$slug.tsx`, `services.index.tsx` 等）中的重复 Hreflang 生成代码 (`HREFLANG_MAP`)。
        - **元数据长度优化**: 修正了多语言翻译文件（如 `consultingLandingPage.ts`）中的 Description 长度，以符合 SEO 最佳实践。
    - **逻辑**:
        1. 优先检查 Router Context (`entry-server.tsx` 注入)。
        2. 尝试从 `routerContext.head` (Vite 注入) 解析。
        3. 遍历 `matches`，执行路由的 `head` 函数或读取 `loaderData.seo`。
        4. 最后兜底为 "Pearl Coach"。
    - **验证**: 已通过 `debug-ssr.mjs` 验证，且在 `post-build.js` 流程中生效。SEO Audit 已通过。

## 4. 实施步骤

### 阶段一：基础设施改造 (已完成)
- [x] **重构 Router**: 修改 `src/router.ts` 为工厂模式。
- [x] **创建服务端入口**: 编写 `src/entry-server.tsx`，实现核心渲染逻辑。
- [x] **创建客户端入口**: 编写 `src/entry-client.tsx`，实现 Hydration 逻辑。
- [x] **调整 HTML 模板**: 修改 `index.html`。

### 阶段二：构建脚本开发 (已完成)
- [x] **编写生成脚本**: `scripts/post-build.js` 集成了 SSG 生成逻辑。
- [x] **路由预渲染列表**: `scripts/generate-prerender-routes.js` 自动生成。
- [x] **配置 npm scripts**:
    - `build:ssr`: `vite build --ssr src/entry-server.tsx --outDir dist/server`
    - `build:client`: `vite build --outDir dist/client`
    - `generate`: `node scripts/post-build.js`

### 阶段三：验证与清理 (已完成)
- [x] **SEO 审计**: 
    - 集成 `scripts/check-links.mjs` 进行 SEO/UX 审计。
    - **完成**: 修复 Canonical URL 自引用和 hreflang 标签缺失问题。所有 "Description 过短" 警告已修复。
- [x] **验证交互**: 确保页面加载后 React 能正确接管（无 Hydration Error）。
- [x] **清理旧代码**: 移除 `scripts/puppeteer-prerender.js` 及 `puppeteer` 依赖。

## 7. 最近更新与状态 (2026-02)
- **React 升级**: 项目已升级至 React 19 (^19.0.0)，以配合 TanStack Router 的最新特性。
- **SEO 修复与优化 (2026-02-09)**: 
    - **Hreflang 集中化**: 彻底重构了多语言标签生成逻辑。从 10+ 个路由文件中移除了冗余的 `HREFLANG_MAP` 调用，全部由 `__root.tsx` 根据 URL 动态生成。这消除了构建产物中重复标签的风险。
    - **元数据完善**: 修复了 8+ 个页面的 Meta Description 过短问题（中文和英文），确保符合搜索引擎最佳实践（>50 chars）。
    - **Bug 修复**: 解决了 `FounderPrelude` 未定义引用的问题；修复了 `__root.tsx` 中 `hrefLang` 属性大小写导致的渲染问题。
    - **文档更新**: 重写了 `multilingual-design.md` 和本迁移计划，以反映当前的 URL-Based Routing 架构。
- **SEO 修复 (早期)**: 
    - 修复了 `__root.tsx` 中的 title undefined 问题，增加了 Fallback 和日志分支。
    - 增加了 PWA 支持 (manifest.json, theme-color)。
    - 优化了 `scripts/check-links.mjs` 的超时设置 (120s) 和调试日志。

## 5. 风险点与注意事项

- **第三方组件兼容性**: 某些组件库（如 `react-cookie-consent`, `@calcom/embed-react`）可能在服务端渲染时报错。
    - *解决方案*: 使用 `import { ClientOnly }` 包装，或在组件内部检查 `if (typeof window === 'undefined') return null`。
- **Window 对象访问**: 检查代码中所有直接访问 `window` 的地方，确保有防护。
- **环境变量**: 确保服务端构建时能正确读取 `VITE_` 环境变量。

## 6. 参考文档
- [TanStack Router SSR Guide](https://tanstack.com/router/latest/docs/framework/react/guide/ssr)
- [Vite SSR Guide](https://vitejs.dev/guide/ssr.html)

## 8. 故障复盘：Cloudflare Pages 空白页与 CSS MIME 错误

- 现象
  - 访问 Cloudflare Pages 出现空白页，`window.__TANSTACK_ROUTER_CONTEXT__` 显示 `matches: []`，且 `statusCode: 307` 重定向到伪路径 `/https:/...`。
  - 浏览器控制台报错：CSS/JS 资源 MIME 为 `text/html`，严格检查被拒绝；`manifest.json` 语法错误；模块脚本无法加载。
- 根因
  - SSR 初始化传入了“绝对 URL”（如 `https://...`），TanStack Router 的内存历史初始条目被当作整串路径，导致路由匹配失败并出现伪重定向，页面空白。
  - 静态资源被错误重写到 HTML：构建生成的重写规则将 `/assets/*` 等请求落到 SPA Fallback（`/index.html`），返回 HTML，导致 CSS/JS 的 MIME 为 `text/html`。
  - 头部资产注入包含开发路径 `/src/index.css`，生产环境不存在该文件，实际返回 HTML，引发 CSS MIME 错误。
- 修复措施（已实施）
  - 规范化 SSR URL：在服务端入口将绝对 URL 解析为 `pathname + search + hash`；历史初始条目与 i18n 初始化只使用 `pathname`。
    - 代码参考：[entry-server.tsx](file:///e:/workspace/pearl-coach-fullstack/src/entry-server.tsx#L7-L22)
  - 修正重写规则：确保静态资源优先匹配并绕过 SPA Fallback；将 `/assets/* → /assets/:splat 200`、`/api/* → /api/:splat 200`、`/static/* → /static/:splat 200`，并置于 Fallback 之前。
    - 生成位置：[post-build.js](file:///e:/workspace/pearl-coach-fullstack/scripts/post-build.js#L212-L241)，产物：[dist/client/_redirects](file:///e:/workspace/pearl-coach-fullstack/dist/client/_redirects)
  - 过滤开发时资产：Cloudflare Functions 头部资产生成器过滤任何 `/src/*` 路径，仅注入构建产出的哈希 CSS/JS。
    - 生成器：[generate-cf-worker.mjs](file:///e:/workspace/pearl-coach-fullstack/scripts/generate-cf-worker.mjs#L77-L99)
    - 入口资产示例：[functions/[[path]].ts](file:///e:/workspace/pearl-coach-fullstack/functions/[[path]].ts#L15-L18)
  - 验证：本地构建通过；静态生成、Functions 入口生成、SEO 审计均完成；MIME 与空白页问题消失。

## 9. 设计规避原则（长期）

- URL 输入规范化
  - 服务端所有进入 Router/History 的 URL 必须规范化为 `pathname + search + hash`，避免将绝对 URL 写入路由系统。
  - i18n 初始化只依据 `pathname`，减少环境差异带来的歧义。
- 静态资源边界明确
  - 重写/路由规则中静态资源优先匹配，且必须在 SPA Fallback 之前；对 `/assets/*`、`/*.css`、`/*.js` 等进行显式 200 映射。
  - 云端入口（Functions/Workers）不对静态资源做 SSR 处理，直接透传给静态目录。
- Head 资产来源一致
  - 头部资产仅来源于 `dist/client/index.html` 的构建产物（哈希文件），禁止注入任何开发路径（如 `/src/*`）。
  - 生成器层面提供过滤策略，避免将无效标签带入生产 SSR。
- SSR/SSG 一致性校验
  - 在构建后审计中加入两类检查：
    - 路由匹配一致性：采集 `window.__TANSTACK_ROUTER_CONTEXT__` 的 `matches` 长度与 `redirect` 字段，检测异常重定向与空匹配。
    - 资源 MIME 校验：对关键 CSS/JS 发起 HEAD 请求验证 `Content-Type` 是否为 `text/css`/`application/javascript`。
  - 失败时构建中止并输出定位指引。
- 入口隔离与最小信任
  - Functions/Workers 入口只负责：
    - 解析请求 URL→传给服务端渲染；
    - 注入构建期提取的资产（严格白名单）；
    - 写入脱水状态脚本。
  - 禁止在入口中拼接开发资源或动态生成未知标签。
 
 ## 10. 性能与数据加载优化思路
 
 - 统一预加载策略
   - 在 Router 层启用 `defaultPreload: 'intent'`，并设置 `defaultPreloadDelay: 50–100ms`，降低误触预加载。
   - 当以 TanStack Query 作为主缓存时，将 `defaultPreloadStaleTime: 0`，把新鲜度控制交给 Query。
 - 路由级数据分片与重载控制
   - 为分页/筛选类路由显式声明 `loaderDeps`（如 `{ offset, limit, filters }`），保证缓存分片正确。
   - 对“仅进入时加载”的页面使用 `shouldReload: false + gcTime: 0`，离开后不保留数据。
 - Deferred 与占位优化
   - 将慢速/非关键数据改为 Deferred：loader 返回未决 Promise；组件用 `Await/Suspense` 渐进渲染。
   - 使用 `pendingMs/pendingMinMs` 抑制闪烁；必要时 `wrapInSuspense` 强制包裹。
 - 与 TanStack Query 协同
   - 在关键路由的 loader 中使用 `ensureQueryData` 预取首屏关键数据，组件侧使用 `useSuspenseQuery` 读取，避免瀑布与闪烁。
   - 对非关键数据使用 `useQuery`（仅客户端执行），减少首屏阻塞。
 - 交互级预加载
   - 列表项/详情跳转启用 `preload='intent'`；首屏以下或折叠内容链接使用 `preload='viewport'`；常驻导航使用 `preload='render'`。
   - 对少数关键跳转可在交互前使用 `router.preloadRoute` 手动预热。
 - 代码拆分与 Chunk 预热
   - 利用 `router.loadRouteChunk(route)` 在进入复杂页面前预热代码 Chunk，降低首跳抖动。
 - 资源与请求安全
   - 在所有 loader 中传入 `abortController.signal`，支持取消，避免悬挂请求。
   - SSR 入口继续执行 URL 规范化（`pathname + search + hash`），防止绝对 URL 破坏匹配。
 - 监控与回退
   - 观测首屏 TTFB/FP/FCP 与路由切换耗时；对比预加载开启/关闭的差异，按页面类型分组优化。
   - 保留“禁用预加载”的快速回退开关，用于定位异常或外部库交互冲突。
 - 实施顺序建议
   - 先全局启用 `intent` 预加载与合理延迟→为关键路由补充 `loaderDeps`→将慢数据改造为 Deferred→引入 Query 的 `ensureQueryData`→按需增加 `pending` 占位与 Chunk 预热→最后细化各页面的预加载策略与缓存窗口。

## 11. 与数据策略整合（JSONB + Domain + Markdown）

- 数据合并与脱水
  - 将 Domain 合并逻辑封装为路由级 loader（纯函数、可序列化），在服务端入口执行并随脱水状态注入 HTML，客户端使用 router.hydrate 复用，避免首屏二次请求。
  - 多语言：使用 JSONB translations 深度合并为最终对象，规范 null→undefined；Markdown 在 zh 缺失时回退 en，保证 SSR/CSR 一致性。

- Head 与 SEO 一致性
  - 全局集中式 Head 管理用于 canonical/hreflang 等；页面若需要完全自定义 SEO，则在模板传入 `disableSEOHead=true` 并在页面内输出 `SEOHead`，避免重复渲染。
  - 比较页封面：`frontmatter.seo.image` 缺失时按规则使用 `/og/comparisons/{slug}.png`；将该目录纳入静态资源绕行白名单，避免 CSS/JS/图片被误拦截导致 MIME 错误。

- 数据访问边界
  - 客户端仅匿名只读键，受 RLS 限制；服务端 Functions/构建脚本使用服务角色密钥，严禁泄漏到客户端产物。
  - 公开内容优先走构建期预取或服务端脱水；运行时尽量避免额外 DB 请求，确保稳定性与性能。

- 路由白名单与预渲染
  - 将 devices/manufacturers/guides/history/comparisons 等路径纳入 SSR 白名单或预渲染列表；未覆盖的路径走 SPA Fallback，减少非必要 SSR。
  - 配合 `prerender-routes.json`/`sitemap` 维护白名单；构建后生成 `_redirects`，保证静态资源优先绕行。

- 文章与内容演进
  - 过渡期保留 `articles` 的多语言列与 Markdown 并存；最终以 Markdown(frontmatter+body) 为主，DB 作为快照/索引层。
  - frontmatter 规范：`seo.title/description/keywords/canonical/image`；设备页 `featuresNote/specsNote` 作为“补充说明”，不替代结构化规格。
