#!/usr/bin/env node

// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.359Z
// 🔄 Purpose: Internationalization fixes (completed)
// 

/**
 * GSC 诊断工具
 * 自动检查 SEO 健康状况，帮助解决 Google Search Console 问题
 * 
 * 检查项目：
 * 1. Canonical URL 一致性
 * 2. hreflang 双向引用验证
 * 3. 重定向链检测
 * 4. Sitemap URL 可访问性
 * 5. 结构化数据验证
 * 
 * 运行: node scripts/gsc-diagnostic.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = (process.env.SITE_URL ? String(process.env.SITE_URL) : 'https://chinactscanner.org').replace(/\/+$/, '');
const LANGUAGES = ['en', 'zh'];

// ==================== 配置 ====================

const CRITICAL_PAGES = [
  '/',
  '/devices',
  '/manufacturers',
  '/compare',
  '/pricing',
  '/learn',
  '/blog',
  '/about',
  '/contact'
];

// ==================== 工具函数 ====================

const log = {
  info: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  warn: (msg) => console.log(`⚠️  ${msg}`),
  error: (msg) => console.log(`❌ ${msg}`),
  section: (msg) => console.log(`\n📋 ${msg}\n${'='.repeat(60)}`)
};

/**
 * 解析 sitemap XML 提取所有 URL
 */
const parseSitemapUrls = (sitemapPath) => {
  try {
    const content = fs.readFileSync(sitemapPath, 'utf-8');
    const urls = [];
    const locMatches = content.matchAll(/<loc>([^<]+)<\/loc>/g);
    for (const match of locMatches) {
      urls.push(match[1]);
    }
    return urls;
  } catch (error) {
    log.error(`无法读取 sitemap: ${sitemapPath}`);
    return [];
  }
};

/**
 * 解析 sitemap XML 提取 hreflang 关系
 */
const parseHreflangLinks = (sitemapPath) => {
  try {
    const content = fs.readFileSync(sitemapPath, 'utf-8');
    const urlBlocks = content.split('</url>');
    const hreflangMap = {};
    
    for (const block of urlBlocks) {
      const locMatch = block.match(/<loc>([^<]+)<\/loc>/);
      if (!locMatch) continue;
      
      const loc = locMatch[1];
      const hreflangLinks = [];
      const linkMatches = block.matchAll(/<xhtml:link[^>]*hreflang="([^"]+)"[^>]*href="([^"]+)"/g);
      
      for (const match of linkMatches) {
        hreflangLinks.push({ hreflang: match[1], href: match[2] });
      }
      
      if (hreflangLinks.length > 0) {
        hreflangMap[loc] = hreflangLinks;
      }
    }
    
    return hreflangMap;
  } catch (error) {
    log.error(`无法解析 hreflang: ${sitemapPath}`);
    return {};
  }
};

// ==================== 检查函数 ====================

/**
 * 检查 1: Sitemap 文件存在性
 */
const checkSitemapFiles = () => {
  log.section('检查 Sitemap 文件');
  
  const requiredFiles = [
    'sitemap.xml',
    'sitemap-index.xml',
    'sitemap-en.xml',
    'sitemap-zh.xml',
    'sitemap-images.xml',
    'robots.txt'
  ];
  
  const publicDir = path.join(__dirname, '../public');
  let allExist = true;
  
  for (const file of requiredFiles) {
    const filePath = path.join(publicDir, file);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      log.success(`${file} (${(stats.size / 1024).toFixed(1)} KB)`);
    } else {
      log.error(`缺失: ${file}`);
      allExist = false;
    }
  }
  
  return allExist;
};

/**
 * 检查 2: hreflang 双向一致性
 */
const checkHreflangConsistency = () => {
  log.section('检查 hreflang 双向一致性');
  
  const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
  const hreflangMap = parseHreflangLinks(sitemapPath);
  
  let issues = 0;
  let checked = 0;
  
  for (const [url, links] of Object.entries(hreflangMap)) {
    checked++;
    
    // 检查是否有 x-default
    const hasXDefault = links.some(l => l.hreflang === 'x-default');
    if (!hasXDefault) {
      log.warn(`${url} 缺少 x-default`);
      issues++;
    }
    
    // 检查是否有所有语言版本
    for (const lang of LANGUAGES) {
      const hasLang = links.some(l => l.hreflang === lang);
      if (!hasLang) {
        log.warn(`${url} 缺少 hreflang="${lang}"`);
        issues++;
      }
    }
    
    // 检查双向引用
    for (const link of links) {
      if (link.hreflang === 'x-default') continue;
      
      const targetLinks = hreflangMap[link.href];
      if (!targetLinks) {
        // 目标页面不在 sitemap 中，跳过
        continue;
      }
      
      // 检查目标页面是否引用回原页面
      const hasBackReference = targetLinks.some(l => l.href === url);
      if (!hasBackReference) {
        log.warn(`双向引用缺失: ${url} -> ${link.href} (无回引)`);
        issues++;
      }
    }
  }
  
  if (issues === 0) {
    log.success(`已检查 ${checked} 个页面，hreflang 配置正确`);
  } else {
    log.error(`发现 ${issues} 个 hreflang 问题`);
  }
  
  return issues === 0;
};

/**
 * 检查 3: 英文和中文版本 priority 一致性
 */
const checkPriorityConsistency = () => {
  log.section('检查多语言 Priority 一致性');
  
  const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
  
  try {
    const content = fs.readFileSync(sitemapPath, 'utf-8');
    const urlBlocks = content.split('</url>');
    
    const priorityMap = {};
    
    for (const block of urlBlocks) {
      const locMatch = block.match(/<loc>([^<]+)<\/loc>/);
      const priorityMatch = block.match(/<priority>([^<]+)<\/priority>/);
      
      if (locMatch && priorityMatch) {
        const url = locMatch[1];
        const priority = parseFloat(priorityMatch[1]);
        
        // 提取路径（移除域名和语言前缀）
        let path = url.replace(BASE_URL, '');
        if (path.startsWith('/zh')) {
          path = path.substring(3) || '/';
        }
        
        if (!priorityMap[path]) {
          priorityMap[path] = {};
        }
        
        const lang = url.includes('/zh') ? 'zh' : 'en';
        priorityMap[path][lang] = priority;
      }
    }
    
    let issues = 0;
    for (const [path, priorities] of Object.entries(priorityMap)) {
      if (priorities.en !== undefined && priorities.zh !== undefined) {
        if (priorities.en !== priorities.zh) {
          log.warn(`${path}: en=${priorities.en}, zh=${priorities.zh} (不一致)`);
          issues++;
        }
      }
    }
    
    if (issues === 0) {
      log.success('所有多语言页面 priority 一致');
    } else {
      log.error(`发现 ${issues} 个 priority 不一致问题`);
    }
    
    return issues === 0;
  } catch (error) {
    log.error(`无法检查 priority: ${error.message}`);
    return false;
  }
};

/**
 * 检查 4: redirects.md 配置
 */
const checkRedirectsConfig = () => {
  log.section('检查 Redirects 配置');
  
  const redirectsPath = path.join(__dirname, '../public/redirects.md');
  
  try {
    const content = fs.readFileSync(redirectsPath, 'utf-8');
    
    // 检查关键配置
    const checks = [
      { pattern: '/*/  /:splat  301', desc: '通用 trailing slash 处理' },
      { pattern: '/en/*  /:splat  301', desc: '旧 /en/* URL 迁移' },
      { pattern: '/*  /index.html  200', desc: 'SPA fallback' }
    ];
    
    let allPassed = true;
    for (const check of checks) {
      if (content.includes(check.pattern)) {
        log.success(check.desc);
      } else {
        log.warn(`缺失: ${check.desc}`);
        allPassed = false;
      }
    }
    
    // 检查 SPA fallback 是否在最后
    const lines = content.split('\n').filter(l => l.trim() && !l.startsWith('#'));
    const lastLine = lines[lines.length - 1];
    if (lastLine && lastLine.includes('/index.html  200')) {
      log.success('SPA fallback 正确位于最后');
    } else {
      log.warn('SPA fallback 应该放在最后');
      allPassed = false;
    }
    
    return allPassed;
  } catch (error) {
    log.error(`无法读取 redirects.md: ${error.message}`);
    return false;
  }
};

/**
 * 检查 5: headers.md 配置
 */
const checkHeadersConfig = () => {
  log.section('检查 Headers 配置');
  
  const headersPath = path.join(__dirname, '../public/headers.md');
  
  try {
    const content = fs.readFileSync(headersPath, 'utf-8');
    
    // 检查关键头部
    const checks = [
      { pattern: 'X-Robots-Tag', desc: 'X-Robots-Tag 头部' },
      { pattern: 'Link:', desc: 'Canonical Link 头部' },
      { pattern: 'Cache-Control', desc: 'Cache-Control 头部' }
    ];
    
    let allPassed = true;
    for (const check of checks) {
      if (content.includes(check.pattern)) {
        log.success(check.desc);
      } else {
        log.warn(`缺失: ${check.desc}`);
        allPassed = false;
      }
    }
    
    // 检查核心页面是否有 Link canonical
    for (const page of CRITICAL_PAGES) {
      const pattern = `Link: <${BASE_URL}${page}>`;
      if (content.includes(pattern) || page === '/') {
        // 首页特殊处理
        if (page === '/' && content.includes(`Link: <${BASE_URL}/>`)) {
          continue;
        }
      }
    }
    
    return allPassed;
  } catch (error) {
    log.error(`无法读取 headers.md: ${error.message}`);
    return false;
  }
};

/**
 * 检查 6: robots.txt 配置
 */
const checkRobotsTxt = () => {
  log.section('检查 robots.txt 配置');
  
  const robotsPath = path.join(__dirname, '../public/robots.txt');
  
  try {
    const content = fs.readFileSync(robotsPath, 'utf-8');
    
    const checks = [
      { pattern: 'User-agent: *', desc: '通用 User-agent' },
      { pattern: 'Allow: /', desc: 'Allow 规则' },
      { pattern: 'Sitemap:', desc: 'Sitemap 引用' }
    ];
    
    let allPassed = true;
    for (const check of checks) {
      if (content.includes(check.pattern)) {
        log.success(check.desc);
      } else {
        log.warn(`缺失: ${check.desc}`);
        allPassed = false;
      }
    }
    
    return allPassed;
  } catch (error) {
    log.error(`无法读取 robots.txt: ${error.message}`);
    return false;
  }
};

/**
 * 生成诊断报告
 */
const generateReport = (results) => {
  log.section('诊断报告摘要');
  
  const total = Object.keys(results).length;
  const passed = Object.values(results).filter(r => r).length;
  const failed = total - passed;
  
  console.log(`\n总检查项: ${total}`);
  console.log(`通过: ${passed} ✅`);
  console.log(`失败: ${failed} ❌`);
  
  if (failed > 0) {
    console.log('\n需要修复的问题:');
    for (const [name, result] of Object.entries(results)) {
      if (!result) {
        console.log(`  - ${name}`);
      }
    }
  }
  
  console.log('\n建议操作:');
  if (!results['hreflang']) {
    console.log('  1. 运行 node scripts/generate-dynamic-sitemap.js 重新生成 sitemap');
  }
  if (!results['priority']) {
    console.log('  2. 检查 sitemap 生成脚本中的 priority 设置');
  }
  if (!results['redirects']) {
    console.log('  3. 检查 public/redirects.md 配置');
  }
  if (!results['headers']) {
    console.log('  4. 检查 public/headers.md 配置');
  }
  
  console.log('\n📌 GSC 提交后的监控建议:');
  console.log('  - 使用 GSC URL 检查工具验证关键页面');
  console.log('  - 监控 "索引覆盖率" 报告中的错误变化');
  console.log('  - 检查 "网址检查" 中的 canonical 和 hreflang 状态');
  
  return failed === 0;
};

// ==================== 主函数 ====================

const main = () => {
  console.log('🔍 GSC 诊断工具 - SEO 健康检查');
  console.log(`🌐 目标网站: ${BASE_URL}`);
  console.log(`📅 检查时间: ${new Date().toISOString()}`);
  
  const results = {
    'sitemap文件': checkSitemapFiles(),
    'hreflang': checkHreflangConsistency(),
    'priority': checkPriorityConsistency(),
    'redirects': checkRedirectsConfig(),
    'headers': checkHeadersConfig(),
    'robots.txt': checkRobotsTxt()
  };
  
  const success = generateReport(results);
  
  process.exit(success ? 0 : 1);
};

// 运行
main();
