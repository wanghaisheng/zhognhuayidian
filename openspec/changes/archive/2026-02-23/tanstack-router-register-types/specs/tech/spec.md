# Delta for Tech

## MODIFIED Requirements

### Requirement: Router 类型注册
Register 中的 router 类型必须反映实际 createAppRouter 的返回类型。
(Previously: Register 使用 createRouter 原生类型)

#### Scenario: 类型提示
- GIVEN 代码中引用 router context
- WHEN 类型推断发生
- THEN 可获得 queryClient 等上下文字段

## 成功标准
- Register 类型与 createAppRouter 对齐
