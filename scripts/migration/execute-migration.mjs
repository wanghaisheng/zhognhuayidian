#!/usr/bin/env node

/**
 * 执行脚本迁移 - 第一阶段实施
 * 将各类脚本移动到对应的功能目录
 */

import fs from 'fs';
import path from 'path';

const scriptsDir = path.resolve(process.cwd(), 'scripts');

console.log('🚀 开始执行脚本迁移 - 第一阶段');

// 脚本迁移规则
const migrationRules = [
  // 生成脚本
  {
    category: 'generate',
    patterns: ['generate-*.cjs', 'generate-*.mjs', 'generate-*.ts', 'generate-*.js'],
    description: '生成脚本'
  },
  
  // 检查脚本  
  {
    category: 'check',
    patterns: ['check-*.cjs', 'check-*.js'],
    description: '检查脚本'
  },
  
  // 数据处理脚本
  {
    category: 'data', 
    patterns: ['align-*.cjs', 'migrate-*.js', 'migrate-*.ts', 'parse-*.cjs', 'build-*.cjs'],
    description: '数据处理脚本'
  },
  
  // 工具脚本
  {
    category: 'utils',
    patterns: ['post-build.js', 'setup-*.js'],
    description: '工具脚本'
  },
  
  // 归档脚本
  {
    category: 'archive',
    patterns: [
      'complete-*.cjs', 'final-*.cjs', 'ultimate-*.cjs',
      'continue-*.cjs', 'immediate-*.cjs',
      'comprehensive-*.cjs', 'debug-*.cjs', 'test-*.js'
    ],
    description: '归档脚本'
  }
];

// 执行迁移
let totalMoved = 0;
let totalErrors = 0;

migrationRules.forEach(rule => {
  console.log(`\n📁 处理 ${rule.description}...`);
  
  rule.patterns.forEach(pattern => {
    try {
      // 使用 glob 模式匹配文件
      const { glob } = require('glob');
      const files = glob.sync(pattern, { cwd: scriptsDir });
      
      files.forEach(file => {
        const srcPath = path.join(scriptsDir, file);
        const destPath = path.join(scriptsDir, rule.category, file);
        
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
          console.log(`  ✅ 移动: ${file} -> ${rule.category}/`);
        }
      });
    } catch (error) {
      totalErrors++;
      console.error(`  ❌ 错误处理 ${pattern}:`, error.message);
    }
  });
});

// 清理空目录
console.log('\n🧹 清理空目录...');
const subDirs = ['generate', 'check', 'data', 'utils', 'archive'];
subDirs.forEach(dir => {
  try {
    const dirPath = path.join(scriptsDir, dir);
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      if (files.length === 0) {
        fs.rmdirSync(dirPath);
        console.log(`  🗑️ 删除空目录: ${dir}/`);
      }
    }
  } catch (error) {
    console.error(`  ⚠️ 清理目录 ${dir} 时出错:`, error.message);
  }
});

// 生成迁移报告
const migrationReport = {
  stage: '第一阶段 - 脚本迁移',
  totalMoved,
  totalErrors,
  timestamp: new Date().toISOString(),
  categories: migrationRules.map(rule => ({
    category: rule.category,
    description: rule.description,
    patterns: rule.patterns
  }))
};

// 保存报告
fs.writeFileSync(
  path.join(scriptsDir, 'MIGRATION_REPORT.json'),
  JSON.stringify(migrationReport, null, 2),
  'utf8'
);

console.log('\n📊 生成迁移报告: MIGRATION_REPORT.json');
console.log(`\n🎉 第一阶段完成！`);
console.log(`✅ 成功移动: ${totalMoved} 个文件`);
console.log(`❌ 错误数量: ${totalErrors} 个`);

if (totalErrors > 0) {
  console.log('\n⚠️ 存在错误，请检查日志');
  process.exit(1);
} else {
  console.log('\n✅ 迁移成功，可以继续第二阶段');
}
