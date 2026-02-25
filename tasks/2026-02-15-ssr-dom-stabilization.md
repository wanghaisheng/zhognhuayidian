# 稳定浏览器实测阶段的 DOM（SSR/Hydration）与可见性信号

目标：修复审计工具在浏览器阶段读取到“0 可见文本/缺失 H1”的误报，确保在无头浏览器与真实环境中 DOM 稳定、可抓取。

## 背景与问题

- 构建+预渲染产物中首页等页面包含首屏内容与 `<h1>`，但浏览器实测阶段（无头浏览器）出现“可见文本为 0 / 未找到 H1”。
- 终端同时捕获到 React 最小化错误 418/423，指向“服务端渲染(SSR)与客户端水合树不一致/水合失败”。
- 结果：运行时抛错或水合回退期间可能清空 `#root`，在审计采样窗口内呈现空壳，造成误报。

## 定位过程

- 审计报告新增了运行时日志捕获后，首页在 headless 环境中反复出现 React 423/418。
- 对比服务端与客户端树：
  - 服务端：`[RouterProvider] → [I18nextProvider] → [RouterServer]`（见 `src/entry-server.tsx`）。
  - 客户端（问题前）：直接渲染 `RouterClient` 或与服务端包裹关系不一致，且水合判断宽松，导致树结构不同。
- 检查脱水上下文注入时机：
  - `window.__TANSTACK_ROUTER_CONTEXT__` 原先在 `</body>` 前注入；若入口脚本更早执行，水合阶段拿不到上下文，进一步放大不一致。
- 水合判定策略：
  - 仅以 `rootEl.hasChildNodes()` 判断会在上下文缺失时仍走 hydrate，或在 CSR 路径下清空 SSR 产物再重绘，二者都可能触发报错与“空壳”。
- 构建链路重复审计：
  - `npm run build` 的 post-build 阶段会跑一次审计；`audit:dev` 再次单独运行，造成“审计结束后又开始”的观感干扰定位。

## 最终原因

- 根因是“服务端与客户端树不一致 + 脱水上下文注入时机偏后 + 水合判定不严谨”的叠加：
  - 客户端包裹结构不与 SSR 对齐，触发 React 418/423 水合冲突；
  - 脱水上下文注入过晚，客户端早于注入时开始水合，拿不到上下文；
  - `hasSSR` 判定未要求上下文存在，容易在不满足水合前提时仍走 hydrate 或清空 DOM，采样时“可见文本为 0 / 无 H1”。

## 修复项

1) 统一客户端渲染结构并严格水合条件  
   - 客户端以与 SSR 相同的包裹顺序渲染：`[RouterProvider] → [I18nextProvider] → [RouterClient]`；
   - 仅当 `#root` 有子节点且存在 `__TANSTACK_ROUTER_CONTEXT__` 时才执行 hydrate，否则走纯 CSR；  
   - 文件：`src/entry-client.tsx`。

2) 调整脱水上下文注入顺序  
   - 将 `window.__TANSTACK_ROUTER_CONTEXT__` 注入到 `<head>` 开始处，确保早于入口脚本；  
   - 文件：`scripts/generate-static.mjs`。

3) 浏览器实测阶段稳态增强  
   - 等待时间从 800ms → 2000ms；
   - 捕获 `pageerror`/`console`，并在报告中记录；
   - 自检 `body/#root` 的可见性样式；  
   - 文件：`scripts/check-links.mjs`。

4) 去除构建内置审计，改为显式分模式执行  
   - 从 post-build 中移除审计步骤，避免“构建时自动审计 + 手动审计”叠加；  
   - 统一通过 `audit:dev` / `audit:prod` 分模式触发；`audit:dev` 改为基于开发构建（非最小化）以便诊断；  
   - 文件：`scripts/post-build.js`、`package.json`（已有脚本定义）。

5) 稳定图表容器 ID，消除水合树差异  
   - 用稳定 ID 替代 `React.useId()`（基于 config 键名生成），确保 SSR/CSR 一致；  
   - 文件：`src/components/ui/chart.tsx`。

## 验证结果

- 在应用 1)~5) 后，分别运行 `audit:dev`（基于 `build:dev` 非最小化）与 `audit:prod`：
  - React 418/423 不再出现；
  - “空壳”误报消失，首页 H1 与可见文本稳定可抓取；
  - 审计报告仍提示 sitemap 指向不存在的页面（FAIL）和若干 PWA/meta 告警（WARN），与水合无关。

## 后续建议

- 清理 sitemap：对齐实际构建/预渲染产物，剔除不存在的路径；
- 对“首屏渐显”策略在 headless / `prefers-reduced-motion` 环境降级；
- 审计建议保持分模式运行：`npm run audit:dev`（本地 dist DOM 实测）与 `npm run audit:prod`（面向线上 URL）。

---

执行时间：2026-02-15（更新）  
负责人：Trae IDE 助手
