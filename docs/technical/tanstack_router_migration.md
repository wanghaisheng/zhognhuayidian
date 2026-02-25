---
title: Migration from React Router Checklist
toc: false
---

**_If your UI is blank, open the console, and you will probably have some errors that read something along the lines of `cannot use 'useNavigate' outside of context` . This means there are React Router api’s that are still imported and referenced that you need to find and remove. The easiest way to make sure you find all React Router imports is to uninstall `react-router-dom` and then you should get typescript errors in your files. Then you will know what to change to a `@tanstack/react-router` import._**

Here is the [example repo](https://github.com/Benanna2019/SickFitsForEveryone/tree/migrate-to-tanstack/router/React-Router)

- [x] Install Router - `npm i @tanstack/react-router` (see [detailed installation guide](../how-to/install.md))
- [x] **Optional:** Uninstall React Router to get TypeScript errors on imports.
  - At this point I don’t know if you can do a gradual migration, but it seems likely you could have multiple router providers, not desirable.
  - The api’s between React Router and TanStack Router are very similar and could most likely be handled in a sprint cycle or two if that is your companies way of doing things.
- [x] Create Routes for each existing React Router route we have
- [x] Create root route
- [x] Create router instance
- [x] Add global module in main.tsx
- [x] Remove any React Router (`createBrowserRouter` or `BrowserRouter`), `Routes`, and `Route` Components from main.tsx
- [ ] **Optional:** Refactor `render` function for custom setup/providers - The repo referenced above has an example - This was necessary in the case of Supertokens. Supertoken has a specific setup with React Router and a different setup with all other React implementations
- [x] Set RouterProvider and pass it the router as the prop
- [x] Replace all instances of React Router `Link` component with `@tanstack/react-router` `Link` component

程序化导航处（navigate 或 onClick 跳转）可统一通过已存在的路径助手做前缀处理，或包一层 helper 使用 addLanguagePrefix，保持与 LangLink 一致。



  - [x] Add `to` prop with literal path
  - [ ] Add `params` prop, where necessary with params like so `params={{ orderId: order.id }}`
- [x] Replace all instances of React Router `useNavigate` hook with `@tanstack/react-router` `useNavigate` hook
  - [x] Set `to` property and `params` property where needed
- [ ] Replace any React Router `Outlet`'s with the `@tanstack/react-router` equivalent
- [ ] If you are using `useSearchParams` hook from React Router, move the search params default value to the validateSearch property on a Route definition.
  - [ ] Instead of using the `useSearchParams` hook, use `@tanstack/react-router` `Link`'s search property to update the search params state
  - [ ] To read search params you can do something like the following
    - `const { page } = useSearch({ from: productPage.fullPath })`
- [x] If using React Router’s `useParams` hook, update the import to be from `@tanstack/react-router` and set the `from` property to the literal path name where you want to read the params object from
  - So say we have a route with the path name `orders/$orderid`.
  - In the `useParams` hook we would set up our hook like so: `const params = useParams({ from: "/orders/$orderId" })`
  - Then wherever we wanted to access the order id we would get it off of the params object `params.orderId`



程序化导航处（navigate 或 onClick 跳转）可统一通过已存在的路径助手做前缀处理，或包一层 helper 使用 addLanguagePrefix，保持与 LangLink 一致。

## 整合注意（与数据策略/SSR）

- Loader 与脱水
  - 将 Domain 合并逻辑（JSONB translations 深度合并 + Markdown 回退）封装为路由级 loader，在服务端执行并注入脱水状态，客户端用 `router.hydrate()` 复用。
  - 统一 `null→undefined` 归一化，避免 SSR/CSR 初渲染不一致。

- Head 管理
  - 全局集中式管理 canonical/hreflang；页面如需自定义 SEO，在模板传入 `disableSEOHead=true` 并在页面内部输出 `SEOHead`，避免重复。

- 数据边界
  - 客户端仅匿名读；服务端 Functions/构建脚本使用服务角色密钥，严禁泄漏到客户端产物。

- 静态资源与 OG 图
  - 比较页封面缺省路径 `/og/comparisons/{slug}.png`；将该目录纳入静态资源绕行与白名单，避免 MIME 错误。

- 文章演进
  - `articles` 过渡期保留多语言列与 Markdown 并存；最终以 Markdown(frontmatter+body) 为主，DB 作为快照/索引层与富查询入口。


