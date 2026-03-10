#!/usr/bin/env node

/**
 * 简化版脚本迁移 - 不依赖外部包
 */

import fs from 'fs';
import path from 'path';

const scriptsDir = path.resolve(process.cwd(), 'scripts');

console.log('🚀 开始简化版脚本迁移...');

// 手动定义文件列表
const scriptFiles = {
  generate: [
    'generate-book-chapters.cjs',
    'generate-book-data.cjs', 
    'generate-markdown-snapshots.mjs',
    'generate-prerender-routes.js',
    'generate-routes.ts',
    'generate-snapshots.mjs',
    'generate-dynamic-sitemap.ts',
    'generate-static.mjs',
    'generate-zh-books.cjs',
    'generate-zh-chapters.cjs',
    'generate-cf-worker.mjs',
    'generate-content-stats.ts',
    'generate-data-migration.ts',
    'generate-device-content.cjs',
    'generate-device-content.js',
    'generate-dimension-field-map.cjs',
    'generate-dimension-index.cjs',
    'generate-headings.cjs',
    'generate-price-migration.cjs',
    'generate-remaining-books.cjs',
    'generate-split-sitemap.js',
    'generate-standard-config.cjs',
    'generate-term-frequency.cjs',
    'generate-translation-template.js'
  ],
  
  check: [
    'check-hardcode.cjs',
    'check-links.mjs',
    'check-locale-consistency.cjs',
    'check-translations.js',
    'check-syntax.js',
    'check-book-consistency.cjs',
    'check-chinese-display-issues.cjs',
    'check-chinese-tabs.cjs',
    'check-encoding.cjs',
    'check-all-category-displays.cjs',
    'check-book-detail-keys-simple.cjs',
    'check-book-detail-keys.cjs',
    'check-missing-tabs.cjs',
    'check-nested-keys.cjs'
  ],
  
  data: [
    'align-book-data-structure.cjs',
    'migrate-html-data.ts',
    'migrate-markdown-to-db.ts',
    'parse-specifications.cjs',
    'build-specs-catalog.cjs',
    'align-chapter-structure.cjs',
    'analyze-category-system.cjs',
    'audit-seo.mjs'
  ],
  
  utils: [
    'post-build.js',
    'setup-build-optimization.js'
  ],
  
  archive: [
    'complete-all-remaining.cjs',
    'complete-final-fix.cjs',
    'complete-remaining-fix.cjs',
    'comprehensive-data-check.cjs',
    'continue-fix-interpretation.cjs',
    'continue-fix-remaining.cjs',
    'continue-fix-translation.cjs',
    'continue-fix.cjs',
    'debug-one-route.mjs',
    'dump-html.mjs',
    'final-complete-fix.cjs',
    'final-data-fix.cjs',
    'final-fix-all.cjs',
    'final-key-verification.cjs',
    'final-verification.cjs',
    'immediate-fix-all.cjs',
    'migrate-blog-articles.js',
    'migrate-customers-to-snapshots.ts',
    'migrate-expert-analysis-to-content.ts',
    'fix-all-translation.cjs',
    'fix-category-keys.cjs',
    'fix-chinese-data.cjs',
    'fix-chinese-tabs.cjs',
    'fix-frontmatter.mjs',
    'fix-interpretation-summary.cjs',
    'fix-locale-consistency.cjs',
    'fix-manufacturer-slugs.ts',
    'fix-shanghan-zabing-lun.cjs',
    'fix-tabs-simple.cjs',
    'fix-translation-content.cjs',
    'fix_frontmatter.cjs',
    'gsc-diagnostic.js',
    'simple-key-check.cjs',
    'simple-tab-check.cjs',
    'ssr-compare.mjs',
    'ssr-log-stats.mjs',
    'test-book-display.cjs',
    'test-category-display.cjs',
    'test-chinese-category-keys.cjs',
    'test-final-section-fix.cjs',
    'test-locale-home.js',
    'test-redirects-dev.js',
    'test-section-titles.cjs',
    'test-seo-head.js',
    'test-specific-categories.cjs',
    'ultimate-final-fix.cjs',
    'ultimate-fix.cjs',
    'unify-book-data-structure.cjs',
    'update-main-book-chapters.cjs',
    'verify-redirects.js'
  ]
};

let totalMoved = 0;
let totalErrors = 0;

// 执行迁移
Object.entries(scriptFiles).forEach(([category, files]) => {
  console.log(`\n📁 处理 ${category} 目录 (${files.length} 个文件)...`);
  
  files.forEach(file => {
    try {
      const srcPath = path.join(scriptsDir, file);
      const destPath = path.join(scriptsDir, category, file);
      
      if (fs.existsSync(srcPath)) {
        // 确保目标目录存在
        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        
        // 移动文件
        fs.copyFileSync(srcPath, destPath);
        fs.unlinkSync(srcPath);
        
        totalMoved++;
        console.log(`  ✅ 移动: ${file}`);
      } else {
        console.log(`  ⚠️ 文件不存在: ${file}`);
      }
    } catch (error) {
      totalErrors++;
      console.error(`  ❌ 错误处理 ${file}:`, error.message);
    }
  });
});

// 生成统计报告
const stats = {
  stage: '第一阶段 - 简化脚本迁移',
  totalMoved,
  totalErrors,
  timestamp: new Date().toISOString(),
  categories: Object.entries(scriptFiles).map(([category, files]) => ({
    category,
    count: files.length,
    moved: files.filter(f => fs.existsSync(path.join(scriptsDir, f))).length
  }))
};

fs.writeFileSync(
  path.join(scriptsDir, 'SIMPLE_MIGRATION_REPORT.json'),
  JSON.stringify(stats, null, 2),
  'utf8'
);

console.log('\n📊 生成统计报告: SIMPLE_MIGRATION_REPORT.json');
console.log(`\n🎉 迁移完成！`);
console.log(`✅ 成功移动: ${totalMoved} 个文件`);
console.log(`❌ 错误数量: ${totalErrors} 个`);

// 显示分类统计
console.log('\n📈 分类统计:');
Object.entries(stats.categories).forEach(([category, info]) => {
  console.log(`  ${category}: ${info.moved}/${info.count} 个文件`);
});

if (totalErrors > 0) {
  console.log('\n⚠️ 存在错误，请检查日志');
  process.exit(1);
} else {
  console.log('\n✅ 迁移成功！可以继续第二阶段：清理归档');
}
