# Delta for Tech

## ADDED Requirements

### Requirement: SSR 路由白名单自动化
SSR 入口必须使用 `prerender-routes.json` 或站点地图作为白名单来源，禁止手工维护列表。

#### Scenario: 未在白名单中的路径
- GIVEN 请求路径不在白名单中
- WHEN 进入 SSR 入口
- THEN 直接回退到静态层或 SPA 兜底

#### Scenario: 白名单更新
- GIVEN `prerender-routes.json` 更新
- WHEN 重新构建
- THEN SSR 白名单自动同步更新

### Requirement: Head 一致性审计
构建后审计必须检测 canonical 与 hreflang 的唯一性与一致性，并在严格模式下失败中止构建。

#### Scenario: 重复 canonical
- GIVEN 页面 head 中存在多个 canonical
- WHEN 执行严格审计
- THEN 构建失败并输出定位信息

### Requirement: 预加载与 loaderDeps 规范
分页/筛选类路由必须声明 `loaderDeps`，并可使用 deferred 降低关键渲染阻塞。

#### Scenario: 分页参数变更
- GIVEN 路由使用分页参数
- WHEN 参数变化
- THEN 仅相关数据分片重新加载

### Requirement: 静态资源绕行稳定性
SSR 入口必须对静态资源请求与非 HTML 请求进行绕行，禁止返回 HTML 以防 MIME 错误。

#### Scenario: CSS/JS 请求
- GIVEN 请求路径含扩展名或 Accept 不包含 text/html
- WHEN 进入 SSR 入口
- THEN 直接透传静态层

## MODIFIED Requirements

### Requirement: 页面 Head 产出边界
页面路由仅输出内容级 SEO 元数据，不得输出 canonical 与 hreflang。
(Previously: 页面允许输出 canonical/hreflang)

## REMOVED Requirements

### Requirement: 手工维护 SSR 路由列表
手工维护 SSR 路由列表的机制被废弃。

## 成功标准

- 预渲染路由清单与 SSR 白名单完全一致
- SSR 入口对静态资源与非 HTML 请求进行绕行
- SSR 入口在白名单外路径回退到静态层
- 验收测试套件可运行且全部通过
