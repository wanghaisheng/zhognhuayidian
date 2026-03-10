# Technical Documentation Index

## 中华医典平台技术文档 v1.7.0

本文档目录包含了中华医典平台的完整技术文档，已更新以反映v1.7.0的脚本重组优化。

## 📚 核心文档

### 🚀 入门文档
- **[Scripts Organization Guide](./scripts-organization-guide.md)** - 脚本组织和使用指南 (v1.7.0新增)
- **[Development Standards](./development-standards.md)** - 开发标准和技术要求
- **[Project Architecture Overview](./project-architecture-overview.md)** - 项目整体架构说明

### 🏗️ 架构设计
- **[Project Architecture Overview](./project-architecture-overview.md)** - 完整的架构说明和组件关系
- **[Data Strategy](./data-strategy.md)** - 数据管理策略和架构
- **[SEO Centralization](./seo-centralization.md)** - SEO优化策略

### 📊 数据管理
- **[Book Data Generation](./book-data-generation.md)** - 中医古籍数据生成指南
- **[Book Chapters Structure Analysis](./book-chapters-structure-analysis.md)** - 章节结构分析
- **[Book Consistency Check](./book-consistency-check.md)** - 数据一致性检查
- **[Book Detail Page Architecture](./book-detail-page-architecture.md)** - 详情页架构设计

### 🌐 国际化 (i18n)
- **[i18n Analysis](./i18n-analysis.md)** - 多语言翻译分析 (Legacy)
- **[i18n Book Detail Implementation](./i18n-book-detail-implementation.md)** - 国际化实现详情
- **[i18n Optimization Plan](./i18n-optimization-plan.md)** - 国际化优化计划

### 🔧 开发工具
- **[TanStack Router SSR SSG](./TanStack%20Router%20SSR%20SSG%20cf%20pages.md)** - 路由和静态生成
- **[TanStack Router Migration](./tanstack_router_migration.md)** - 路由迁移指南

## 📋 文档状态

### ✅ 当前活跃文档
- `scripts-organization-guide.md` - 脚本组织指南 (v1.7.0)
- `development-standards.md` - 开发标准 (v1.7.0)
- `project-architecture-overview.md` - 架构概览 (v1.7.0)
- `data-strategy.md` - 数据策略
- `seo-centralization.md` - SEO策略
- `book-data-generation.md` - 数据生成
- `book-chapters-structure-analysis.md` - 章节分析
- `book-consistency-check.md` - 一致性检查
- `book-detail-page-architecture.md` - 详情页架构

### ⚠️ 已废弃/遗留文档
- `data-management-strategy.md` - 已废弃，请参考 `data-strategy.md`
- `i18n-analysis.md` - Legacy，请参考 `development-standards.md`
- `project-completion-summary.md` - 项目完成总结 (历史记录)

### 📂 特定领域文档
- `brand-slug-source-of-truth.md` - 品牌别名管理
- `canonical-strategy.md` - 规范化URL策略
- `category-management.md` - 分类管理
- `contact-form-setup.md` - 联系表单设置
- `device-specifications-source-of-truth.md` - 设备规格管理
- `icon-strategy-recommendation.md` - 图标策略
- `simple-icons-usage.md` - 图标使用指南
- `stats-architecture.md` - 统计架构

## 🔄 文档维护

### 更新频率
- **核心文档**: 每次重大版本更新时修订
- **架构文档**: 架构变更时及时更新
- **指南文档**: 新功能添加时补充

### 版本对应
- **v1.7.0**: 脚本重组优化，新增工作流程
- **v1.6.x**: 404页面修复，语言选择器优化
- **v1.5.x**: URL联动修复，搜索功能扩展
- **v1.4.x**: 中文显示问题修复
- **v1.3.x**: 数据结构标准化

## 🎯 快速导航

### 新手入门
1. 阅读 [Scripts Organization Guide](./scripts-organization-guide.md) 了解脚本体系
2. 查看 [Development Standards](./development-standards.md) 了解开发规范
3. 参考 [Project Architecture Overview](./project-architecture-overview.md) 了解整体架构

### 开发人员
1. 数据相关: [Book Data Generation](./book-data-generation.md)
2. 国际化: [i18n Book Detail Implementation](./i18n-book-detail-implementation.md)
3. SEO优化: [SEO Centralization](./seo-centralization.md)

### 运维人员
1. 构建部署: [TanStack Router SSR SSG](./TanStack%20Router%20SSR%20SSG%20cf%20pages.md)
2. 数据迁移: 参考 `scripts/migration/` 目录下的脚本
3. 质量检查: 参考 `scripts/checks/` 目录下的脚本

## 📝 贡献指南

### 文档更新
1. 确保内容与当前项目版本一致
2. 使用清晰的标题结构和代码示例
3. 更新相关的索引和链接
4. 标注版本和更新日期

### 新增文档
1. 确定文档分类和位置
2. 遵循现有的文档格式和风格
3. 更新本索引文件
4. 通知相关团队成员

---

*最后更新: 2026年3月11日*  
*版本: v1.7.0*  
*维护者: 中华医典开发团队*
