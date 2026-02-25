# Tasks

## 1. SSR 白名单自动化
- [x] 1.1 读取 prerender-routes.json 或 sitemap 作为 SSR_PATHS
- [x] 1.2 在入口层应用 SSR gating 并记录原因
- [x] 1.3 增加白名单同步的构建期校验

## 2. Head 一致性与审计
- [x] 2.1 强化审计脚本检测 canonical/hreflang 唯一性
- [x] 2.2 严格模式失败中止并输出定位信息
- [x] 2.3 页面级 Head 产出边界自检

## 3. 预加载与数据分片
- [x] 3.1 设置统一默认预加载策略
- [x] 3.2 为分页/筛选路由添加 loaderDeps
- [x] 3.3 慢数据引入 deferred

## 4. SEO 内容与本地化覆盖
- [x] 4.1 补齐关键页面本地化 SEO 配置
- [x] 4.2 统一 description 长度与优化策略

## 5. 静态资源绕行与构建校验
- [x] 5.1 入口层静态资源绕行策略审计
- [x] 5.2 资源 MIME 与路由匹配一致性校验
