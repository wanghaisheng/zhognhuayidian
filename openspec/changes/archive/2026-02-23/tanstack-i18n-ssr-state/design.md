# Design: i18n SSR 状态同步

## 设计要点
- 服务端将 i18n store 序列化到路由上下文
- 客户端在启动时读取并恢复 i18n 状态

## 关键改动点
- entry-server 注入 i18n 状态
- entry-client 复水 i18n store

## 验收关注
- 首屏语言与 URL 匹配
- 客户端无语言闪烁
