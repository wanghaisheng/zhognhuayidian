# Delta for Tech

## ADDED Requirements

### Requirement: SSR Handler 标准化
服务端渲染必须使用 Router SSR 标准 Handler，禁止继续使用自建 renderToString/renderToReadableStream。

#### Scenario: 非流式 SSR
- GIVEN 标准 handler 处理请求
- WHEN SSR 完成
- THEN HTML 与路由上下文由 handler 输出

#### Scenario: 流式 SSR
- GIVEN 标准 stream handler 处理请求
- WHEN 流式输出进行
- THEN 路由上下文与流式内容一致

## 成功标准
- entry-server 使用标准 handler
- SSR 输出不依赖手工拼装
