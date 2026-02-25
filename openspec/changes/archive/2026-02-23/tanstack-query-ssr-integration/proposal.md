# Proposal: TanStack Query SSR 集成

## Intent
统一 Query 的 SSR 脱水/流式传输与重定向处理，降低首屏二次请求与状态不一致风险。

## Scope
- 接入 @tanstack/react-router-ssr-query 或等价集成
- 统一 QueryClient 的脱水与复水路径
- SSR/Streaming 下的 Query 状态注入

## Out of Scope
- 业务数据结构调整
- 路由与页面内容改写

## Approach
- 引入官方集成包并在 Router 创建与入口处接入
- 移除手工 Query 脱水/复水逻辑
- 以验收测试验证脱水/复水与重定向一致性

## Risks
- SSR 上下文变更影响既有渲染脚本
- 集成包升级导致的 API 适配成本
