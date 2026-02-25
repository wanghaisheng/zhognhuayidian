toolName: todo_write
            
status: success
          
Todos updated: 4 items
          

        
            
toolName: edit_file_update
            
status: failed
          
            
filePath: e:\workspace\ct-scanner-compass-directory\functions\[[path]].ts
          
          

        
            
toolName: view_files
            
status: success
          
            
filePath: e:\workspace\ct-scanner-compass-directory\functions\[[path]].ts
          

        
            
toolName: apply_patch
            
status: failed
          
          

        
            
toolName: edit_file_update
            
status: failed
          
            
filePath: e:\workspace\ct-scanner-compass-directory\functions\[[path]].ts
          
          

        
            
toolName: apply_patch
            
status: failed
          
          

        
            
toolName: edit_file_update
            
status: success
          
            
filePath: e:\workspace\ct-scanner-compass-directory\functions\[[path]].ts
          
changes: 
          

        
            
toolName: todo_write
            
status: success
          
Todos updated: 4 items
          

        
            
toolName: GetDiagnostics
            
status: success
          
          
**可能原因**
- 服务器端渲染入口缺失或不可加载：Cloudflare Pages Functions 引入了 dist/server/entry-server.js，但构建产物未上传或路径不匹配，导致运行时 import 失败而抛 500。
- SSR 运行期异常：entry-server 在渲染过程中访问了服务端不支持的 API（如 fs、process 未做防护），或在 React 渲染/路由加载阶段抛错，导致 500。
- SSR 白名单误配：路径命中 SSR 白名单，但页面并不支持 SSR（缺少必要数据或 loader 抛错），直接导致 500。
- 静态资源被拦截：未绕行 CSS/JS/图像等请求，返回了 HTML，引发后续 Hydration/MIME 错误（虽然你现在看到的是 Internal Error，但这类问题经常伴随 500）。
- Head 资产未注入：未把构建哈希 CSS/JS 注入 SSR HTML，客户端首次渲染异常，可能在服务端渲染流程中提前报错。

**渐进式修复思路**
- 第一步（安全兜底）：
  - 静态资源绕行：非 GET/带扩展名/不接受 text/html → 直接 next（已具备）。
  - SSR 白名单：仅白名单路径尝试 SSR（已具备）。
  - SSR 失败回退静态层：任何 SSR import/渲染失败 → 打日志并直接 next，避免 500。
- 第二步（定位问题）：
  - 增强日志：输出 Pathname 和 Import/Render 错误类型，便于在 Cloudflare 日志中快速定位。
  - 验证 dist/server/entry-server.js 是否包含在部署产物内，且为 ESM 可被 Workers 加载。
- 第三步（完善体验）：
  - 构建期注入 headAssets：从 dist/client/index.html 提取哈希 CSS/JS，注入 SSR HTML，减少首屏样式与脚本问题。
  - 白名单来源自动化：用 prerender-routes.json/sitemap 生成 SSR_PATHS，降低遗漏风险。

**已实施的修复**
- 对 Cloudflare Functions 入口进行“失败回退”改造：SSR 动态导入 + 渲染失败时返回静态层，避免 Internal Error。
  - 位置：functions/[[path]].ts
  - 关键点：
    - 去除顶层静态 import，改为在请求内动态 import('../dist/server/entry-server.js')，导入失败直接 next。
    - 找不到 render 函数或渲染抛错时，打印错误并 next（不再返回 500）。
    - 日志包含 Pathname，便于 Cloudflare Logs 检索。
  - 参考文件：[functions/[[path]].ts](file:///e:/workspace/ct-scanner-compass-directory/functions/[[path]].ts)

这一步确保即使 SSR 出问题，页面也至少能回退到静态 index.html，不再出现“Internal Error”空白页。

**下一步优化（可持续完善）**
- 产物校验：
  - 确认 dist/server/entry-server.js 在部署时随代码一并上传（Pages 构建 → 部署产物中可见）。
  - 确认 entry-server.js 不引入 Node-Only 模块；如需 polyfill，限制在客户端路径。
- headAssets 注入生成脚本：
  - 在构建后读取 dist/client/index.html 提取 <link rel="stylesheet"> 与 <script type="module">，写入 Functions 入口（或作为字符串注入），避免首屏样式/脚本缺失。
- SSR 白名单自动化：
  - 使用 prerender-routes.json 作为 SSR_PATHS 来源，新增路由不需要手工维护白名单。
- 监控与日志：
  - 在 Cloudflare Pages 项目中开启 Functions 日志，检索关键字 “SSR Import Error/SSR Render Error”，定位根因。

**验证步骤**
- 部署到 Cloudflare 后，访问此前显示 Internal Error 的页面：
  - 若 SSR 仍失败，应回退到静态页面而不再 500；
  - Cloudflare 日志中应出现 SSR Import Error 或 SSR Render Error，并附带 Pathname。
- 检查静态资源是否正确加载（无 MIME/Hydration 报错）。
- 若页面需要 SSR（如 /premium-reports）依然显示异常，再根据日志定位是“导入失败”还是“渲染失败”，分别：
  - 导入失败：确认 dist/server/entry-server.js 是否存在于部署产物、路径是否正确、是否 ESM。
  - 渲染失败：定位 entry-server 中具体抛错位置（React 渲染/数据加载/i18n 初始化）。

我已经完成入口的“失败回退”改造，建议你触发一次部署验证。如果你同意，我可以继续补上构建期的 headAssets 注入脚本和 SSR 白名单自动化，进一步提升稳定性与首屏一致性。