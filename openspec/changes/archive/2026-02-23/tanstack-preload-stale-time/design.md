# Design: 预加载与 Query 新鲜度对齐

## 设计要点
- Router 预加载不做新鲜度判断
- Query 作为主缓存策略

## 关键改动点
- Router 默认预加载配置补齐 defaultPreloadStaleTime

## 验收关注
- 预加载不触发额外缓存分裂
- Query 结果按 staleTime 判定是否复用
