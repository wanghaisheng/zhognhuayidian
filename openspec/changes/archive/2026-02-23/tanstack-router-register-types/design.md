# Design: Router Register 类型对齐

## 设计要点
- Register 使用 createAppRouter 的返回类型
- 类型提示包含 router context

## 关键改动点
- 更新模块增强定义

## 验收关注
- 类型提示包含 queryClient 等上下文字段
