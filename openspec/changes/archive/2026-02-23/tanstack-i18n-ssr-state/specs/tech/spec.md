# Delta for Tech

## ADDED Requirements

### Requirement: i18n SSR 状态同步
服务端必须序列化 i18n store 并在客户端复水。

#### Scenario: 服务端注入
- GIVEN SSR 渲染完成
- WHEN 输出 HTML
- THEN i18n store 被注入到上下文

#### Scenario: 客户端复水
- GIVEN 客户端启动
- WHEN 读取 SSR 上下文
- THEN i18n store 被恢复且首屏语言一致

## 成功标准
- 首屏语言与 URL 匹配
- 客户端无语言闪烁
