# 品牌 Slug 唯一真源（Source of Truth）

适用范围：统一“制造商（brands/manufacturers）”的 slug，在前端路由与 Supabase 数据库保持一致，避免重复与权重分散。

## 统一规则
- 仅使用小写字母、数字与连字符（`-`），不含空格与特殊符号
- 不包含语言前缀（多语言由路由系统处理）
- 保持跨站稳定：内容 frontmatter 的 `slug`、数据库 `manufacturers.slug` 与前端路由 `/manufacturers/{slug}` 一致
- 名称差异时以“行业通用英文名 + 连字符”作为 canonical

## Canonical 映射（标准表）
| 品牌名（英文） | Canonical Slug | 备注 |
| --- | --- | --- |
| United Imaging | united-imaging | |
| Neusoft Medical | neusoft | |
| Anke Medical | anke | 旧：anke-medical |
| Minfound Medical（Mingfeng） | minfound | 旧：mingfeng-medical |
| Changfeng Imaging | chf | |
| GE Healthcare | ge-healthcare | |
| Siemens Healthineers | siemens-healthineers | |
| Philips Healthcare | philips-healthcare | |
| Canon Medical Systems | canon-medical-systems | |
| Perlove Medical | perlove-medical | |
| Wandong Medical | wandong-medical | |
| Kaiying Medical | kaiying-medical | |
| Kangda Intercontinental | kangda-intercontinental | |
| Broaden Medical | broaden-medical | |
| Sino-vision | sino-vision | |

## 迁移与清理
- 旧 slug → 新 slug 映射：  
  - `anke-medical` → `anke`  
  - `mingfeng-medical` → `minfound`  
  - `neusoft-medical` → `neusoft`（如存在）
- 内容层面：确保 Markdown frontmatter 的 `slug` 字段与上表一致；canonical/translation 链接指向 `/manufacturers/{slug}`
- 数据库层面：将 `manufacturers.slug` 更新为 Canonical；如缺失则插入新记录

## 执行脚本
- 数据库修正脚本：`npm run db:fix-manufacturer-slugs`  
  - 脚本位置：[scripts/fix-manufacturer-slugs.ts](file:///e:/workspace/ct-scanner-compass-directory/scripts/fix-manufacturer-slugs.ts)  
  - 作用：将 `anke-medical`/`mingfeng-medical` 等旧 slug 统一修正为 `anke`/`minfound`，并在缺失时创建 `chf`
- 前置条件：配置 Supabase 环境变量 `VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY`

## 验收清单
- `/manufacturers/{slug}` 路由均可访问且无重复
- Markdown frontmatter 的 `slug` 与 canonical/translation 链接一致
- Supabase `manufacturers` 表仅保留 Canonical slug，一致指向唯一品牌记录
- Sitemap 与内部链接不出现旧 slug

## 变更流程
- 新品牌引入：按“统一规则”生成 slug，写入本文档与数据库
- 发现重复或别名：统一到 Canonical，更新本文档与脚本映射，完成一次性迁移与重定向（如有）
