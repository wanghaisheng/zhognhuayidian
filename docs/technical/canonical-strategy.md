# Canonical 策略（站点级规范化 URL 规范）

面向整站的 canonical 生成与管理规范，确保搜索引擎只索引我们希望的规范化页面版本，避免内容重复、权重稀释与抓取浪费。该策略与 SSR/SSG 渲染、国际化（i18n）和边缘层重定向协调一致，并由统一工具函数负责落实。

## 目标
- 统一、稳定、可预测的规范化 URL
- SSR/CSR 一致输出，避免 hydration 期间的差异
- 与多语言 hreflang 链接成对、闭环
- 与边缘层重定向、路由规范一致；减少重复内容

## 规范化规则
1) 绝对 URL 基准
- 以站点配置为唯一权威来源：`SITE_CONFIG.url`（生产为 `https://chinactscanner.org`）
- 仅拼接路径与语言前缀，不从运行时 `window.location` 读取
- 输出必须为 HTTPS 绝对 URL（禁止相对 URL 与协议相对 URL，例如 `//example.com`）

2) 语言前缀
- 默认语言 `en`：无前缀（例：`/devices`）
- 中文 `zh`：使用 `/zh` 前缀（例：`/zh/devices`）
- 规范化时先去除路径中已有的语言前缀，再按目标语言补回

3) 末尾斜杠
- 统一采用“无尾斜杠”策略（root 除外）
- 例：`https://chinactscanner.org/devices`（而非 `/devices/`）

4) 查询参数与哈希
- 规范化 URL 不包含 query 与 hash（除非未来对特定参数另行白名单化）
- 过滤/排序等短期性参数一律移除，避免产生大量重复页面

5) 大小写与编码
- 路径采用小写、连字符 `-` 的 slug；仅在内容规范层保证
- 规范化函数不主动变更已有 slug 的大小写/编码

## 语言交叉与 hreflang
- 对任意路径输出完整的 hreflang 链接集合：
  - `en` → `en`
  - `zh` → `zh-Hans`
  - `x-default` 指向默认语言（English）
- 每个语言版本彼此对等、闭环互链

## SSR/CSR 一致性
- SSR 阶段由路由 head 统一生成 canonical 与 meta/link（避免客户端再计算）
- 客户端严禁使用 `window.location` 推导 canonical；只消费服务端注入的上下文
- 关键实现：
  - 统一入口：`utils/seo.ts` 的 `generateCanonicalUrl` 与 `generateHreflangLinks`
  - 路由 head 输出：`routerInit.tsx` rootRoute 的 `head(...)`
  - SSR 注入：`entry-server.tsx` 将 head 组装注入到 HTML

## 页面类型策略
- 首页
  - `en`：`https://chinactscanner.org`
  - `zh`：`https://chinactscanner.org/zh`
- 列表/集合页（如 Devices/Manufacturers）
  - 无分页参数时直接指向当前列表页
  - 筛选、排序、临时参数不入 canonical（统一回落到基础列表）
- 详情页
  - 精确到设备/文章/制造商唯一 slug 的页面
- 动态内容页（Learn/History/Reports）
  - 以内容 slug 为唯一规范

## 与边缘层重定向的关系
- 边缘层负责：
  - 旧 `/en/*` 的平滑迁移到无前缀路径
  - 尾斜杠统一规范（外部访问 `/*/` 302 → `/*`）
- canonical 始终输出“无尾斜杠”版本，以避免两套 URL 并存

## 实现与调用
- 核心实现：
  - `src/utils/seo.ts`
    - `generateCanonicalUrl(path, lang)`：按上述规则生成唯一规范 URL
    - `generateHreflangLinks(path)`：输出多语言互链与 `x-default`
  - `src/lib/routerInit.tsx` rootRoute `head(...)`：在 SSR 阶段集中输出 `<link rel="canonical">` 与 `<link rel="alternate" hreflang>`
  - `src/entry-server.tsx`：将 head 片段注入 HTML，供静态生成复用
- 页面接入：
  - Home/列表/详情等路由均通过 `buildPageHead` 或对应 slice 在 head 中注入

## 审计与验证
- 开发/生产审计脚本：`npm run audit:dev` / `npm run audit:prod`
  - 核查 canonical 存在且唯一
  - 提醒自引用策略（首页、规范页自引用合规）
  - 报告 hash/本地存储等线索（仅提示，不影响通过）
- 构建后检查 dist 中生成页的 `<head>`：确保没有重复 canonical，hreflang 语言集合完整
- 可选严格模式（默认关闭；在 CI 或本地按需开启）：
  - `CHECK_STRICT_HEAD=1`：
    - canonical 必须为绝对 URL，且不得包含 `?` 或 `#`
    - 检查 `<title>`、`meta[name="description"]`、`og:title/og:description/og:image/og:url` 不重复
    - 检查 `link[rel="alternate"][hreflang]` 必须为绝对 URL，存在 `x-default`，同一 `hreflang` 不可指向多个不同 `href`
  - `CHECK_STRICT_SITEMAP=1`：
    - 检查 sitemap 是否存在重复 `<loc>`
    - 若默认语言为 `en`，提示 sitemap 中的 `/en` 前缀 URL（建议去除）
  - 示例：
    - `CHECK_STRICT_HEAD=1 npm run audit:dev`
    - `CHECK_STRICT_HEAD=1 CHECK_STRICT_SITEMAP=1 npm run audit:prod`

## 变更与扩展
- 若未来启用分页的可索引策略（如 `/page/2` 规范化），可在 `generateCanonicalUrl` 中对白名单参数/路径段进行扩展
- 若需要保留某些“静态筛选”页作为独立入口，可为其定义稳定、无参数的唯一路径（再加入 sitemap）

---
附：当前实现参考
- 规范化函数：`src/utils/seo.ts`
- 路由 head：`src/lib/routerInit.tsx`
- SSR 注入：`src/entry-server.tsx`
