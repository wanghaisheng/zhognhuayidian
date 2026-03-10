# Scripts 最佳实践指南

## 🎯 开发规范

### 1. 脚本命名
- 使用 kebab-case 命名
- 功能描述性名称
- 包含版本号信息

### 2. 错误处理
- 完整的 try-catch 包装
- 详细的错误日志
- 优雅的失败处理

### 3. 文档要求
- 每个脚本都有使用说明
- 包含参数说明
- 提供使用示例

## 🚀 使用指南

### 运行环境
- Node.js >= 16.0.0
- 在项目根目录运行
- 确保有必要的权限

### 常用命令
```bash
# 检查硬编码
npm run check:hardcode

# 生成路由
node scripts/generate/generate-routes.ts

# 检查链接
node scripts/check/check-links.mjs
```

## 🔧 维护指南

### 定期任务
- [ ] 每月检查脚本有效性
- [ ] 季度更新依赖版本
- [ ] 年度清理废弃脚本

### 版本管理
- 使用语义化版本号
- 记录重要变更
- 维护变更日志

## 📚 相关资源

- [Node.js 最佳实践](https://nodejs.org/en/docs/guides/)
- [JavaScript 标准](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [项目文档](../README.md)

---

*创建时间: 2026-03-10T19:06:44.992Z*
