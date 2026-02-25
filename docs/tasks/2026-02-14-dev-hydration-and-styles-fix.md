# Dev 模式 Hydration 警告与样式缺失修复记录（2026-02-14）

## 现象
- `npm run dev` 访问 http://localhost:8082/：
  - 控制台出现多次 Hydration 警告：服务器 HTML 被客户端替换
  - 报错堆栈指向 `<AwaitInner>`：`{ __isServerError: true }`
  - 页面“有内容但没样式”

## 根因
1) 客户端入口使用不当  
- 入口总是用 `RouterClient + hydrateRoot`，而开发模式并没有 SSR/注水数据，导致：
  - 对空容器强行 `hydrate` → Hydration 警告
  - RouterClient 的流式等待（Await/useAwaited）在 DEV 无服务端数据 → 抛出 `__isServerError: true`

2) 全局样式未引入  
- 将入口从 `main.tsx` 切到 `entry-client.tsx` 后，未在新入口引入 `index.css`，开发模式下样式不会被注入。

3) 其它噪音  
- Supabase 客户端在浏览器多实例创建，控制台出现多实例告警  
- manifest.json 引用了不存在的 192/512 图标，产生 404

## 修复方案
1) 按环境选择客户端入口实现  
- 文件： [src/entry-client.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/entry-client.tsx)  
- 关键点：  
  - 开发环境使用 `<RouterProvider />`（纯 CSR）  
  - 生产环境使用 `<RouterClient />`（配合 SSR/SSG）  
  - 根据容器是否已有子节点选择 `hydrateRoot`（有子节点）或 `createRoot().render`（无子节点）

2) 引入全局样式  
- 文件： [src/entry-client.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/entry-client.tsx)  
- 变更：`import './index.css';`

3) 服务端入口结构规范化  
- 文件： [src/entry-server.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/entry-server.tsx)  
- 做法：输出 `<HeadContent />`、`<RouterServer />`、`<Scripts />`；不再误用 `<RouterProvider>` 包裹，确保上下文与类型正确。

4) Supabase 单例化  
- 文件：  
  - [src/integrations/supabase/client.ts](file:///e:/workspace/ct-scanner-compass-directory/src/integrations/supabase/client.ts)  
  - [src/lib/supabase.ts](file:///e:/workspace/ct-scanner-compass-directory/src/lib/supabase.ts)  
- 做法：浏览器侧通过 `globalThis.__SUPABASE_CLIENT__` 复用单例，统一从 integrations 导出的实例，避免多实例告警。

5) 修正 manifest 404 噪音（临时）  
- 文件： [public/manifest.json](file:///e:/workspace/ct-scanner-compass-directory/public/manifest.json)  
- 做法：移除缺失的 192/512 图标条目，待资源补齐后再恢复。

## 验证
- 开发模式  
  - 刷新 http://localhost:8082/，Hydration 警告消失  
  - 控制台不再出现 `<AwaitInner>` 的 `__isServerError: true`  
  - 样式已加载（Tailwind/组件样式正常）
- 类型/语法/ESLint  
  - 执行：`node scripts/check-syntax.js`（集成 `tsc --noEmit` 与 `eslint`）  
  - 结果：通过

## 防再发
- 入口变更时自查：是否已在新入口引入全局样式（`index.css`）  
- DEV/PROD 行为分离：开发模式避免使用 `RouterClient` 与流式 Await；生产才启用  
- SSR/SSG 一致性：生产构建与 Functions 注入只使用 `dist/client/index.html` 的哈希资源，禁止注入 `/src/*` 开发路径  
- 复用客户端 SDK 实例：浏览器态统一单例，避免多实例副作用与告警

## 参考
- React Developer Tools（辅助组件与状态排查）  
- Error Boundaries（为局部数据链路增加兜底渲染）

