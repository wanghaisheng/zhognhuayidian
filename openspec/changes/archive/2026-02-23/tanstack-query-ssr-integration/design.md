# Design: TanStack Query SSR 集成

## 设计要点
- Router 与 Query 的 SSR 脱水由集成包统一处理
- 服务端流式渲染可自动推送 Query 结果
- 客户端在首屏完成后恢复 Query 状态并避免二次请求

## 关键改动点
- Router 创建时接入 Query SSR 集成
- 服务端入口使用集成包提供的 render handler
- 客户端入口从 SSR 上下文恢复 Query 状态

## 验收关注
- SSR 首屏不触发重复请求
- Query 状态与路由状态同步注入
- 重定向行为与 SSR 输出一致
