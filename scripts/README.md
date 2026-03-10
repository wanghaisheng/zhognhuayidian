# Scripts 目录说明

## 📁 目录结构

```
scripts/
├── 📄 README.md              # 本文件 - 脚本索引和使用指南
├── 🗂️ data/                  # 数据处理与生成脚本
├── 🔍 checks/                # 验证与检查脚本  
├── 🔧 fixes/                 # 修复与纠错脚本
├── 🏗️ build/                 # 构建与生成脚本
├── 🔄 migration/             # 数据迁移脚本
├── 📚 docs/                  # 文档与报告
├── 🌐 i18n/                  # 国际化脚本
├── 🔍 seo/                   # SEO相关脚本
├── 🛠️ tools/                 # 工具与实用脚本
└── 📋 scripts/               # 脚本管理与索引
```

## 🌐 国际化脚本 (i18n/)

### 核心脚本

1. **fix-hardcode.mjs** - 修复硬编码中文
   - 自动检测并替换硬编码中文文本
   - 生成翻译键映射
   - 创建备份文件

2. **replace-route.mjs** - 替换路由文件
   - 安全的文件替换操作
   - 自动备份原文件
   - 验证替换结果

3. **verify-i18n.mjs** - 验证国际化实现
   - 检查翻译键完整性
   - 验证语言切换功能
   - 生成验证报告

## 🚀 使用方法

### 修复单个路由
```bash
node scripts/i18n/fix-hardcode.mjs --route=research
node scripts/i18n/replace-route.mjs --route=research
```

### 批量修复
```bash
node scripts/i18n/fix-hardcode.mjs --all
node scripts/i18n/verify-i18n.mjs
```

## 📋 已完成的国际化工作

### ✅ 完成的路由
- research.tsx - 学术研究平台
- search.tsx - 智能检索系统  
- library.tsx - 古籍库
- about.tsx - 关于我们
- contact.tsx - 联系我们

### 📊 统计数据
- 硬编码消除：105+ 行 → 0 行
- 翻译键新增：200+ 个
- 国际化覆盖率：100%

## 🔧 维护指南

### 添加新路由国际化
1. 使用 `fix-hardcode.mjs` 检测硬编码
2. 手动添加翻译键到 `src/locales/*/labels/pages/home.ts`
3. 使用 `replace-route.mjs` 替换文件
4. 运行 `verify-i18n.mjs` 验证

### 检查现有国际化
```bash
npm run check:hardcode
node scripts/i18n/verify-i18n.mjs
```

---

## 🚀 开发流程与脚本索引

### 📋 开发工作流程

#### 1. 项目初始化阶段
```bash
# 数据迁移
node scripts/migration/execute-migration.mjs
node scripts/migration/migrate-html-data.ts

# 基础数据生成
node scripts/data/generate-book-data.cjs
node scripts/data/generate-device-content.cjs
```

#### 2. 内容开发阶段
```bash
# 数据结构对齐
node scripts/data/align-book-data-structure.cjs
node scripts/data/align-chapter-structure.cjs

# 内容生成
node scripts/data/generate-book-chapters.cjs
node scripts/data/generate-zh-books.cjs
node scripts/data/generate-remaining-books.cjs
```

#### 3. 质量检查阶段
```bash
# 数据一致性检查
node scripts/checks/check-book-consistency.cjs
node scripts/checks/check-chinese-display-issues.cjs
node scripts/checks/check-locale-consistency.cjs

# 功能测试
node scripts/checks/test-book-display.cjs
node scripts/checks/test-category-display.cjs
```

#### 4. 问题修复阶段
```bash
# 数据修复
node scripts/fixes/fix-chinese-data.cjs
node scripts/fixes/fix-category-keys.cjs
node scripts/fixes/fix-translation-content.cjs

# 结构修复
node scripts/fixes/complete-final-fix.cjs
node scripts/fixes/final-fix-all.cjs
```

#### 5. 构建部署阶段
```bash
# 路由生成
node scripts/build/generate-routes.ts
node scripts/build/generate-prerender-routes.js

# SEO优化
node scripts/build/generate-dynamic-sitemap.ts
node scripts/seo/check-seo-coverage.js
```

#### 6. 国际化阶段
```bash
# 硬编码修复
node scripts/i18n/fix-hardcode.mjs --all
node scripts/i18n/check-i18n-consistency.js

# 翻译验证
node scripts/i18n/check-missing-labels.js
node scripts/i18n/verify-i18n.mjs
```

### 📂 详细脚本索引

#### 🗂️ data/ - 数据处理与生成 (14个脚本)
- `align-book-data-structure.cjs` - 对齐书籍数据结构
- `align-chapter-structure.cjs` - 对齐章节结构
- `generate-book-chapters.cjs` - 生成书籍章节
- `generate-book-data.cjs` - 生成书籍数据
- `generate-device-content.cjs` - 生成设备内容
- `generate-dimension-field-map.cjs` - 生成维度字段映射
- `generate-dimension-index.cjs` - 生成维度索引
- `generate-remaining-books.cjs` - 生成剩余书籍
- `generate-term-frequency.cjs` - 生成词频统计
- `generate-zh-books.cjs` - 生成中文书籍
- `generate-zh-chapters.cjs` - 生成中文章节
- `unify-book-data-structure.cjs` - 统一书籍数据结构
- `update-main-book-chapters.cjs` - 更新主要书籍章节

#### 🔍 checks/ - 验证与检查 (24个脚本)
- `check-all-category-displays.cjs` - 检查所有分类显示
- `check-book-consistency.cjs` - 检查书籍一致性
- `check-book-detail-keys-simple.cjs` - 检查书籍详情键(简化)
- `check-book-detail-keys.cjs` - 检查书籍详情键
- `check-chinese-display-issues.cjs` - 检查中文显示问题
- `check-chinese-tabs.cjs` - 检查中文标签
- `check-encoding.cjs` - 检查编码
- `check-hardcode.cjs` - 检查硬编码
- `check-locale-consistency.cjs` - 检查语言环境一致性
- `check-missing-tabs.cjs` - 检查缺失标签
- `check-nested-keys.cjs` - 检查嵌套键
- `check-syntax.js` - 检查语法
- `check-translations.js` - 检查翻译
- `simple-key-check.cjs` - 简单键检查
- `simple-tab-check.cjs` - 简单标签检查
- `test-book-display.cjs` - 测试书籍显示
- `test-category-display.cjs` - 测试分类显示
- `test-chinese-category-keys.cjs` - 测试中文分类键
- `test-final-section-fix.cjs` - 测试最终部分修复
- `test-locale-home.js` - 测试语言环境首页
- `test-redirects-dev.js` - 测试重定向开发
- `test-section-titles.cjs` - 测试部分标题
- `test-seo-head.js` - 测试SEO头部
- `test-specific-categories.cjs` - 测试特定分类

#### 🔧 fixes/ - 修复与纠错 (25个脚本)
- `fix-all-translation.cjs` - 修复所有翻译
- `fix-category-keys.cjs` - 修复分类键
- `fix-chinese-data.cjs` - 修复中文数据
- `fix-chinese-tabs.cjs` - 修复中文标签
- `fix-interpretation-summary.cjs` - 修复解释摘要
- `fix-locale-consistency.cjs` - 修复语言环境一致性
- `fix-shanghan-zabing-lun.cjs` - 修复伤寒杂病论
- `fix-tabs-simple.cjs` - 简单标签修复
- `fix-translation-content.cjs` - 修复翻译内容
- `fix_frontmatter.cjs` - 修复前置元数据
- `complete-all-remaining.cjs` - 完成所有剩余
- `complete-final-fix.cjs` - 完成最终修复
- `complete-remaining-fix.cjs` - 完成剩余修复
- `continue-fix-interpretation.cjs` - 继续修复解释
- `continue-fix-remaining.cjs` - 继续修复剩余
- `continue-fix-translation.cjs` - 继续修复翻译
- `continue-fix.cjs` - 继续修复
- `final-complete-fix.cjs` - 最终完整修复
- `final-data-fix.cjs` - 最终数据修复
- `final-fix-all.cjs` - 最终修复所有
- `final-key-verification.cjs` - 最终键验证
- `final-verification.cjs` - 最终验证
- `immediate-fix-all.cjs` - 立即修复所有
- `ultimate-final-fix.cjs` - 终极最终修复
- `ultimate-fix.cjs` - 终极修复

#### 🏗️ build/ - 构建与生成 (16个脚本)
- `build-specs-catalog.cjs` - 构建规格目录
- `generate-cf-worker.mjs` - 生成Cloudflare Worker
- `generate-content-stats.ts` - 生成内容统计
- `generate-data-migration.ts` - 生成数据迁移
- `generate-dynamic-sitemap.ts` - 生成动态站点地图
- `generate-headings.cjs` - 生成标题
- `generate-markdown-snapshots.mjs` - 生成Markdown快照
- `generate-prerender-routes.js` - 生成预渲染路由
- `generate-routes.ts` - 生成路由
- `generate-snapshots.mjs` - 生成快照
- `generate-split-sitemap.js` - 生成分割站点地图
- `generate-standard-config.cjs` - 生成标准配置
- `generate-static.mjs` - 生成静态文件
- `generate-translation-template.js` - 生成翻译模板
- `post-build.js` - 构建后处理
- `setup-build-optimization.js` - 设置构建优化

#### 🔄 migration/ - 数据迁移 (8个脚本)
- `execute-migration.mjs` - 执行迁移
- `generate-price-migration.cjs` - 生成价格迁移
- `migrate-blog-articles.js` - 迁移博客文章
- `migrate-customers-to-snapshots.ts` - 迁移客户到快照
- `migrate-expert-analysis-to-content.ts` - 迁移专家分析到内容
- `migrate-html-data.ts` - 迁移HTML数据
- `migrate-markdown-to-db.ts` - 迁移Markdown到数据库
- `simple-migration.mjs` - 简单迁移

#### 🌐 i18n/ - 国际化 (12个脚本)
- `check-i18n-consistency.js` - 检查国际化一致性
- `check-i18n.mjs` - 检查国际化
- `check-missing-labels.js` - 检查缺失标签
- `compare_keys.cjs` - 比较键
- `fix-about-contact.mjs` - 修复关于联系
- `fix-syntax-error.mjs` - 修复语法错误
- `migrate-long-content.mjs` - 迁移长内容
- `prune-i18n-glossary.mjs` - 修剪国际化词汇表
- `replace-library-route.mjs` - 替换库路由
- `replace-search-route.mjs` - 替换搜索路由
- `scan-labels-usage.mjs` - 扫描标签使用
- `scan-long-content.mjs` - 扫描长内容

#### 🔍 seo/ - SEO优化 (1个脚本)
- `check-seo-coverage.js` - 检查SEO覆盖

#### 🛠️ tools/ - 工具与实用脚本 (23个脚本)
- `add_author_to_md.cjs` - 添加作者到Markdown
- `add_report_type.cjs` - 添加报告类型
- `analyze-category-system.cjs` - 分析分类系统
- `audit-seo.mjs` - SEO审计
- `check-links.mjs` - 检查链接
- `cleanup-and-archive.mjs` - 清理和归档
- `comprehensive-data-check.cjs` - 综合数据检查
- `debug-one-route.mjs` - 调试单个路由
- `dump-html.mjs` - 转储HTML
- `find-large-git-objects.cjs` - 查找大型Git对象
- `find-large-git-objects.js` - 查找大型Git对象(JS版)
- `fix-frontmatter.mjs` - 修复前置元数据
- `fix-manufacturer-slugs.ts` - 修复制造商别名
- `govern-scripts.mjs` - 管理脚本
- `gsc-diagnostic.js` - GSC诊断
- `organize-i18n-scripts.mjs` - 组织国际化脚本
- `parse-specifications.cjs` - 解析规格
- `seo-monitoring.js` - SEO监控
- `ssr-compare.mjs` - SSR比较
- `ssr-log-stats.mjs` - SSR日志统计
- `stage3-documentation.mjs` - 阶段3文档
- `verify-redirects.js` - 验证重定向

#### 📚 docs/ - 文档与报告 (4个文件)
- `CLEANUP_REPORT.md` - 清理报告
- `FINAL_GOVERNANCE_SUMMARY.md` - 最终管理摘要
- `ORGANIZATION_REPORT.md` - 组织报告
- `SCRIPTS_GOVERNANCE_COMPLETE.md` - 脚本管理完成

#### 📋 scripts/ - 脚本管理与索引 (14个文件)
- 包含脚本索引、治理报告和管理工具

---

## 📝 脚本开发规范

### 命名规范
- 使用 kebab-case 命名
- 功能描述性名称
- 版本号管理

### 错误处理
- 完整的 try-catch 包装
- 详细的错误日志
- 优雅的失败处理

### 备份策略
- 操作前自动备份
- 版本化备份文件名
- 恢复机制

---

*最后更新：2026年3月11日*
