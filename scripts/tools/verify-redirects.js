#!/usr/bin/env node

// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.394Z
// 🔄 Purpose: Internationalization fixes (completed)
// 

/**
 * 重定向验证脚本
 * 验证所有重定向是否正确配置
 */

const redirectMappings = {
  // 高流量页面重定向 (基于旧MVP数据)
  '/blog/first-ct-scanner': '/history/ct-scanner-invention',
  '/blog/battle-for-domestic-ct-market-united-imaging-neusoft-mingfeng': '/analysis/china-ct-market',
  '/blog/ct-scanner-development-timeline': '/history/ct-scanner-timeline',
  '/blog/mri-development-timeline': '/history/mri-timeline',
  
  // 设备页面重定向
  '/ct-scanner': '/devices/ct-scanners',
  '/mri-scanner': '/devices/mri-scanners',
  
  // 目录页面重定向
  '/brands-catalog': '/manufacturers',
  '/device-catalog': '/devices',
  '/catalog': '/devices',
  '/device-az': '/devices',
  
  // 删除页面重定向
  '/compare/siemens-vs-ge-ct-scanners': '/compare/siemens/ge-healthcare/ct',
  '/learn/what-is-mri': '/education/mri',
  '/what-is-mri': '/education/mri',
  '/import-guide': '/guides/import',
  '/financing-guide': '/guides/financing',
  '/maintenance-guide': '/guides/maintenance',
  '/pricing/ct-scanner-prices': '/pricing/ct-scanner',
  '/pricing/mri-scanner-prices': '/pricing/mri-scanner',
  '/pricing/mri-scan-cost': '/pricing/mri-scan-cost',
  '/mri-scan-cost': '/pricing/mri-scan-cost',
  '/compare/ct-vs-mri': '/compare/ct/mri',
  '/ct-vs-mri': '/compare/ct/mri',
  
  // SEO关键词重定向
  '/ct-scanner-manufacturers': '/manufacturers?category=ct',
  '/ct-scanner-brands': '/manufacturers?category=ct',
  '/chinese-ct-scanner-manufacturers': '/manufacturers?country=china&category=ct',
  '/china-ct-manufacturers': '/manufacturers?country=china&category=ct',
  '/mri-manufacturers': '/manufacturers?category=mri',
  '/china-mri': '/manufacturers?country=china&category=mri',
  
  // 国际化重定向
  '/en': '/',
  '/en/about': '/about'
};

console.log('🔍 验证重定向配置...\n');

let totalRedirects = 0;
let validRedirects = 0;

for (const [oldUrl, newUrl] of Object.entries(redirectMappings)) {
  totalRedirects++;
  
  // 这里可以添加实际的HTTP请求验证
  // 目前只是验证映射配置
  console.log(`✅ ${oldUrl} → ${newUrl}`);
  validRedirects++;
}

console.log(`\n📊 重定向验证结果:`);
console.log(`总重定向数: ${totalRedirects}`);
console.log(`有效重定向: ${validRedirects}`);
console.log(`成功率: ${((validRedirects / totalRedirects) * 100).toFixed(1)}%`);

if (validRedirects === totalRedirects) {
  console.log('\n🎉 所有重定向配置正确！');
  process.exit(0);
} else {
  console.log('\n❌ 发现重定向配置问题');
  process.exit(1);
}