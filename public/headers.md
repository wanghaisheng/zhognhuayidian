# Cloudflare Pages Headers Configuration
# This file is transformed to _headers during build
#
# IMPORTANT: 添加 Link canonical 响应头强化 SEO 信号
# 这有助于解决 GSC "重复网页" 问题

# ==================== Global Headers ====================
/*
  X-Robots-Tag: index, follow
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()

# ==================== Canonical Link Headers ====================
# 强化 canonical 信号，协助搜索引擎确定规范版本

# 首页
/
  Link: <https://chinactscanner.org/>; rel="canonical"
  Cache-Control: public, max-age=3600, must-revalidate

/zh
  Link: <https://chinactscanner.org/zh>; rel="canonical"
  Cache-Control: public, max-age=3600, must-revalidate

# 核心页面 - English
/devices
  Link: <https://chinactscanner.org/devices>; rel="canonical"
  Cache-Control: public, max-age=3600, must-revalidate

/manufacturers
  Link: <https://chinactscanner.org/manufacturers>; rel="canonical"
  Cache-Control: public, max-age=3600, must-revalidate

/compare
  Link: <https://chinactscanner.org/compare>; rel="canonical"
  Cache-Control: public, max-age=3600, must-revalidate

/pricing
  Link: <https://chinactscanner.org/pricing>; rel="canonical"
  Cache-Control: public, max-age=3600, must-revalidate

/learn
  Link: <https://chinactscanner.org/learn>; rel="canonical"
  Cache-Control: public, max-age=3600, must-revalidate

/blog
  Link: <https://chinactscanner.org/blog>; rel="canonical"
  Cache-Control: public, max-age=3600, must-revalidate

/about
  Link: <https://chinactscanner.org/about>; rel="canonical"
  Cache-Control: public, max-age=3600, must-revalidate

/contact
  Link: <https://chinactscanner.org/contact>; rel="canonical"
  Cache-Control: public, max-age=3600, must-revalidate

# 核心页面 - Chinese
/zh/devices
  Link: <https://chinactscanner.org/zh/devices>; rel="canonical"
  Cache-Control: public, max-age=3600, must-revalidate

/zh/manufacturers
  Link: <https://chinactscanner.org/zh/manufacturers>; rel="canonical"
  Cache-Control: public, max-age=3600, must-revalidate

/zh/compare
  Link: <https://chinactscanner.org/zh/compare>; rel="canonical"
  Cache-Control: public, max-age=3600, must-revalidate

/zh/pricing
  Link: <https://chinactscanner.org/zh/pricing>; rel="canonical"
  Cache-Control: public, max-age=3600, must-revalidate

/zh/learn
  Link: <https://chinactscanner.org/zh/learn>; rel="canonical"
  Cache-Control: public, max-age=3600, must-revalidate

/zh/blog
  Link: <https://chinactscanner.org/zh/blog>; rel="canonical"
  Cache-Control: public, max-age=3600, must-revalidate

/zh/about
  Link: <https://chinactscanner.org/zh/about>; rel="canonical"
  Cache-Control: public, max-age=3600, must-revalidate

/zh/contact
  Link: <https://chinactscanner.org/zh/contact>; rel="canonical"
  Cache-Control: public, max-age=3600, must-revalidate

# ==================== Static Assets Caching ====================
# Cache static assets for 1 year
/assets/*
  Cache-Control: public, max-age=31536000, immutable

# Cache images for 1 year
/images/*
  Cache-Control: public, max-age=31536000, immutable

# Cache fonts for 1 year  
/fonts/*
  Cache-Control: public, max-age=31536000, immutable

# ==================== Dynamic Content Caching ====================
# Shorter cache for HTML pages (1 hour)
/*.html
  Cache-Control: public, max-age=3600, must-revalidate

# Shorter cache for JSON data (1 hour)
/*.json
  Cache-Control: public, max-age=3600, must-revalidate

# XML files (sitemaps) cache for 1 day
/*.xml
  Cache-Control: public, max-age=86400
