# Proposal: 预加载与 Query 新鲜度对齐

## Intent
统一 Router 预加载与 Query 缓存策略，避免过期判断分歧带来的重复加载。

## Scope
- 设置 defaultPreloadStaleTime 与 Query staleTime 协同
- 更新预加载策略约束与验收标准

## Out of Scope
- 业务路由改写
- Query 缓存策略全面重构

## Approach
- Router 层设置 defaultPreloadStaleTime=0
- 以 Query staleTime 作为主新鲜度来源

## Risks
- 预加载行为变化导致性能波动
