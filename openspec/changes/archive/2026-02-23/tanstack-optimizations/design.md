# Design: TanStack 架构优化

## 架构目标
- SSR/SSG/CSR 路由分层稳定
- Head 管理与 SEO 链接输出一致
- 构建产物可审计、可回退、可复现

## 方案概述
1. SSR 白名单自动化
   - 白名单来源：`prerender-routes.json` 或 sitemap
   - 入口读取白名单并在请求级判断是否 SSR
2. Head 一致性与审计
   - root head 统一输出 canonical/hreflang
   - 页面仅输出内容级 SEO 元数据
   - 严格审计模式下重复或缺失直接失败
3. 预加载与数据分片
   - 路由层统一默认预加载策略
   - 分页/筛选路由添加 loaderDeps
   - 慢数据使用 deferred
4. 静态资源绕行
   - 扩展名/Accept 识别静态资源
   - SSR 入口不返回 HTML 给非页面请求

## 关键改动点
- Functions/SSR 入口读取白名单并执行 gating
- 路由层补全 loaderDeps 与 deferred
- 审计脚本增加 Head 与资源一致性校验
- 站点内容侧补全本地化 SEO 配置

## 验证策略
- 构建后审计：canonical/hreflang 唯一性、资源 MIME 校验
- 单路由审计：关键页面 head 与渲染一致性
- 线上回归：静态资源不被 SSR 误拦截
