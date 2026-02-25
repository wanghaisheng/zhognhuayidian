# Proposal: Router Register 类型对齐

## Intent
让模块类型注册与实际 Router 实例一致，避免上下文类型丢失。

## Scope
- 更新 Register 的 router 类型映射

## Out of Scope
- Router 创建逻辑改写
- 新增路由功能

## Approach
- 使用 createAppRouter 的返回类型进行注册

## Risks
- 影响少量类型推断或工具链缓存
