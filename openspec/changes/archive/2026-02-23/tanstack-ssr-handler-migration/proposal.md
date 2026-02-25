# Proposal: SSR Handler 标准化

## Intent
迁移到 Router SSR 标准 Handler，降低手工渲染与注入逻辑的维护成本。

## Scope
- 服务端入口使用 defaultRenderHandler 或 renderRouterToStream
- 统一 head 与路由上下文注入流程

## Out of Scope
- 页面组件结构改造
- Head 规则重写

## Approach
- 替换 entry-server 里的自建渲染逻辑
- 在 Streaming 模式下使用标准 stream handler

## Risks
- SSR 输出结构变更影响现有审计脚本
