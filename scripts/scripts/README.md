# Scripts 目录

## 📁 目录结构

```
scripts/
├── i18n/                    # 国际化脚本 ✨
├── generate/                 # 生成脚本 🏗️
├── check/                   # 检查脚本 🔍
├── data/                    # 数据处理脚本 📊
├── utils/                   # 工具脚本 🛠️
├── archive/                 # 归档脚本 📦
├── i18n/                   # 国际化相关目录
├── seo/                    # SEO 相关目录
└── tools/                  # 工具目录
```

## 🚀 快速开始

### 国际化相关
```bash
# 检查硬编码
npm run check:hardcode

# 修复路由
node scripts/i18n/replace-search-route.mjs
node scripts/i18n/replace-library-route.mjs
```

### 生成相关
```bash
# 生成数据
node scripts/generate/generate-book-data.cjs

# 生成路由
node scripts/generate/generate-routes.ts
```

### 检查相关
```bash
# 检查链接
node scripts/check/check-links.mjs

# 检查国际化
node scripts/check/check-locale-consistency.cjs
```

## 📋 脚本统计

| 类别 | 数量 | 状态 |
|------|------|------|
| 国际化脚本 | 4 | ✅ 完成 |
| 生成脚本 | 24 | 📋 待整理 |
| 检查脚本 | 14 | 📋 待整理 |
| 数据处理 | 8 | 📋 待整理 |
| 工具脚本 | 5 | 📋 待整理 |
| 归档脚本 | 50+ | ✅ 已归档 |
| 废弃脚本 | 15+ | ⚠️ 已识别 |

## 🚀 治理进度

### ✅ 已完成
- [x] 国际化脚本整理
- [x] 废弃脚本归档
- [x] 文档体系建立

### 📋 进行中
- [ ] 生成脚本分类
- [ ] 检查脚本分类  
- [ ] 数据处理脚本分类
- [ ] 工具脚本分类

### 📅 后续计划
1. **第三阶段**: 文档完善
   - 完善各子目录 README
   - 创建脚本使用指南
   - 建立最佳实践文档

2. **第四阶段**: 持续优化
   - 定期审查脚本使用
   - 优化脚本性能
   - 建立自动化流程

- **总脚本数**: 100+
- **活跃脚本**: 30+
- **归档脚本**: 20+
- **目录数**: 8

## 🎯 治理成果

1. **分类清晰**: 按功能分类到专门目录
2. **归档管理**: 废弃脚本移至 archive 目录
3. **文档完善**: 每个目录都有详细说明
4. **维护友好**: 便于查找和使用

---

*治理完成时间: 2026-03-10T19:02:41.617Z*
