# Cloudflare Pages Redirects Configuration
# This file is transformed to _redirects during build
# 
# IMPORTANT: 所有 trailing slash 和 URL 规范化在边缘层处理
# 避免与客户端 React Router 重复处理，解决 GSC "网页会自动重定向" 问题

# ==================== URL Normalization (Edge Level) ====================

# 1. 统一 Trailing Slash 规则 - 移除所有 trailing slashes
# 使用通配符覆盖所有情况，确保一致性
/*/  /:splat  301

# 2. Legacy URL Migration (301 永久重定向)
/en/*  /:splat  301
/ct-scanner  /devices/ct-scanners  301
/mri-scanner  /devices/mri-scanners  301
/brands  /manufacturers  301
/device-collection  /devices  301
/catalog  /devices  301
# 品牌页旧 slug → 新规范 slug（唯一真源）
/manufacturers/anke-medical  /manufacturers/anke  301
/manufacturers/mingfeng-medical  /manufacturers/minfound  301

# ==================== Language-specific Trailing Slash ====================

# 中文页面 trailing slash normalization (确保覆盖所有中文路径)
/zh/  /zh  301
/zh/devices/  /zh/devices  301
/zh/manufacturers/  /zh/manufacturers  301
/zh/compare/  /zh/compare  301
/zh/compare/ct-scanners/  /zh/compare/ct-scanners  301
/zh/compare/mri-scanners/  /zh/compare/mri-scanners  301
/zh/history/  /zh/history  301
/zh/pricing/  /zh/pricing  301
/zh/learn/  /zh/learn  301
/zh/blog/  /zh/blog  301
/zh/resources/  /zh/resources  301
/zh/analysis/  /zh/analysis  301
/zh/about/  /zh/about  301
/zh/contact/  /zh/contact  301
/zh/glossary/  /zh/glossary  301
/zh/customers/  /zh/customers  301

# ==================== SPA Fallback ====================
# 必须最后 - 所有未匹配的路由返回 index.html
/*  /index.html  200
