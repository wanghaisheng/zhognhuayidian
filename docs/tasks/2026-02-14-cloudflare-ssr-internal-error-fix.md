# Cloudflare Pages SSR “Internal Server Error” 修复记录（2026-02-14）

## 问题概述
- 线上与本地构建后访问 `/` 返回 Internal Server Error。
- `/?csr=1` 强制 CSR 仍异常（后续加入测试白页后确认入口已生效）。
- 构建出的 `dist/client/index.html` 与部分子页出现“空壳模板”或直接包含 “Internal Server Error” 文本。
- SSR 日志多次出现：
  - `HeadContent` 报错：Cannot read properties of null (reading 'options')
  - `Scripts` 报错：Cannot read properties of null (reading 'options')

## 根因分析
1) SSR 上下文使用错误  
`HeadContent` 与 `Scripts` 依赖 Router 上下文（useTags/useRouter），但被渲染在 Router 上下文之外，导致读取 `null.options` 报错并中断 SSR。

2) 客户端构建入口配置不当  
客户端构建被误设为以 TS 入口（rollupOptions.input 指向 `src/entry-client.tsx`）而不是以 `index.html` 为入口，导致 `dist/client/index.html` 缺失或退化为开发模板脚本路径（`/src/...`），静态层无法正确加载资源。

3) 静态生成阶段未充分兜底  
`generate-static.mjs` 在 SSR 失败返回“Internal Server Error”时未充分识别多种形态，错误文本被写入 `dist/client/index.html`，使 `/` 返回 500 或空白。

## 修复方案与变更点
1) 修正 SSR 结构（确保 Router 上下文可用）  
- 文件： [src/entry-server.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/entry-server.tsx)  
- 关键调整：用 `<RouterProvider router={router}>` 包裹整棵 HTML 树；`<HeadContent />` 放在 `<head>` 内；`<RouterServer router={router} />` 与 `<Scripts />` 放在 `<body>` 内，避免 `useTags/useRouter` 空上下文。

2) 恢复以 HTML 作为客户端构建入口  
- 文件： [vite.config.ts](file:///e:/workspace/ct-scanner-compass-directory/vite.config.ts)  
- 关键调整：移除客户端构建的 `rollupOptions.input` 自定义入口，回到 Vite 默认以 `index.html` 为入口，确保 `dist/client/index.html` 正确产出。

3) 统一根模板脚本入口  
- 文件： [index.html](file:///e:/workspace/ct-scanner-compass-directory/index.html)  
- 关键调整：将根模板脚本从 `/src/main.tsx` 改为 `/src/entry-client.tsx`，与构建产物一致。

4) 强化静态生成兜底  
- 文件： [scripts/generate-static.mjs](file:///e:/workspace/ct-scanner-compass-directory/scripts/generate-static.mjs#L66-L76)  
- 关键调整：更稳健识别 “Internal Server Error” 文本（大小写、是否包裹在标签中等），一旦命中即回退到客户端模板，避免把错误文本写入构建产物。

5) 部署安全阀（临时）  
- 文件： [functions/[[path]].ts](file:///e:/workspace/ct-scanner-compass-directory/functions/[[path]].ts)  
- 策略：  
  - `/?csr=1` 直接返回测试 HTML 白页，快速确认入口与路由链路。  
  - 临时禁用 SSR（统一回退静态层），线上不再返回 500；待验证通过后逐步恢复 SSR。  
- 文件： [scripts/generate-cf-worker.mjs](file:///e:/workspace/ct-scanner-compass-directory/scripts/generate-cf-worker.mjs)  
  - 若本地已存在 `functions/[[path]].ts` 则跳过生成，避免本地与云端不一致。

## 构建与部署规范（Cloudflare Pages）
- Build command：`npm run build`
- Build output directory：`dist/client`
- Functions directory：`functions`
- 验证：  
  - `/_health` → `ok`  
  - `/?csr=1` → 测试白页 “CSR Safe / Static layer reachable.”（仅诊断用）  
  - `/`、`/index.html`、`/about` 等 → 页面正常渲染（若 SSR 暂未恢复则走静态层）

## 验证与现状
- 本地重新构建已通过：  
  - `dist/client/index.html` 与各子页包含正确的 `modulepreload` 与脚本资源  
  - SEO/UX 审计通过（仅轻微警告）  
- 线上部署按规范配置后，错误不再复现。

## 防再发措施
1) 构建入口约束  
- 禁止在客户端构建中将 `rollupOptions.input` 指向 TS 入口，确保以 `index.html` 为入口。  
- 构建后校验：`dist/client/index.html` 必须存在，否则构建失败（建议在 `scripts/post-build.js` 增加检查）。

2) Dev 资源检测  
- 优化 HTML 阶段若检测到 `/src/` 开发脚本引用，直接构建失败（而不是仅移除），防止生成空壳页面。

3) 静态生成守护  
- 保持“SSR 失败 → 回退模板”的逻辑，输出 `prerender-report.json` 供巡检；若检测到“Internal Server Error”文本，强制回退。

4) SSR 恢复流程（Runbook）  
- 步骤 1：在 `functions/[[path]].ts` 移除临时禁用（保留 `/_health` 与 `?csr=1`）；  
- 步骤 2：仅对白名单路由启用 SSR；任何 SSR import/渲染失败一律回退静态层；  
- 步骤 3：观察 Cloudflare Logs，确认无 `useTags/useRouter` 空上下文报错；  
- 步骤 4：稳定后逐步扩大 SSR 覆盖范围。

## 排障 SOP（快速）
1) 产物检查  
- `dist/client/index.html` 是否存在且包含 `modulepreload` 和 `assets` 脚本  
- `dist/server/entry-server.js` 是否存在（启用 SSR 时）

2) 入口检查  
- `functions/[[path]].ts` 是否包含 `/_health`、`?csr=1` 与“SSR 失败回退”逻辑  
- 生成器是否被跳过（保持本地入口一致性）

3) 线上验证  
- `/_health` 与 `/?csr=1` 正常  
- `/index.html` 可直接访问  
- `/` 不带参数时正常渲染

4) 日志检索  
- 关键词：`SSR Import Error`、`SSR Render Error`、`useTags/useRouter null context`

## 参考文件
- [src/entry-server.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/entry-server.tsx)  
- [scripts/generate-static.mjs](file:///e:/workspace/ct-scanner-compass-directory/scripts/generate-static.mjs)  
- [vite.config.ts](file:///e:/workspace/ct-scanner-compass-directory/vite.config.ts)  
- [index.html](file:///e:/workspace/ct-scanner-compass-directory/index.html)  
- [functions/[[path]].ts](file:///e:/workspace/ct-scanner-compass-directory/functions/[[path]].ts)  
- [scripts/generate-cf-worker.mjs](file:///e:/workspace/ct-scanner-compass-directory/scripts/generate-cf-worker.mjs)

