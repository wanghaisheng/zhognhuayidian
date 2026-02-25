# Delta for Tech

## ADDED Requirements

### Requirement: 预加载新鲜度与 Query 对齐
Router 预加载必须使用 defaultPreloadStaleTime=0，将新鲜度控制交给 Query。

#### Scenario: 预加载发生
- GIVEN 路由触发预加载
- WHEN 查询缓存仍然新鲜
- THEN Query 结果复用且不重复请求

## 成功标准
- defaultPreloadStaleTime 已配置为 0
- 预加载与 Query staleTime 判定一致
