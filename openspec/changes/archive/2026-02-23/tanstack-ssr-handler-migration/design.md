# Design: SSR Handler 标准化

## 设计要点
- 通过标准 handler 生成 HTML 与流式输出
- 统一 RouterServer/RouterClient 的注入路径
- 通过 handler 自动管理路由上下文

## 关键改动点
- entry-server 使用 handler 生成响应
- 删除手工 renderToString 与状态拼接

## 验收关注
- SSR 输出结构稳定
- Router 上下文完整且可复水
