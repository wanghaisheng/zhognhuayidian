# Proposal: i18n SSR 状态同步

## Intent
在 SSR 与 CSR 之间同步 i18n store，避免语言闪烁与首屏不一致。

## Scope
- 服务端序列化 i18n store
- 客户端复原 i18n store

## Out of Scope
- 文案内容改写
- 多语言路由结构调整

## Approach
- 在 SSR 入口注入 i18n store
- 在客户端入口恢复并初始化 i18n

## Risks
- i18n 状态体积增长影响首屏大小
