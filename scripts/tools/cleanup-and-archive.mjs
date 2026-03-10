#!/usr/bin/env node

/**
 * 第二阶段：清理和归档
 * 清理剩余文件，创建归档说明
 */

import fs from 'fs';
import path from 'path';

const scriptsDir = path.resolve(process.cwd(), 'scripts');

console.log('🧹 开始第二阶段：清理和归档...');

// 剩余需要清理的文件
const remainingFiles = [
  'test-redirects-dev.js',
  'verify-redirects.js'
];

// 创建归档说明
const createArchiveNote = (filename, reason, alternative) => {
  const note = `# ${filename}

## 归档原因
${reason}

## 替代方案
${alternative}

## 归档时间
${new Date().toISOString()}

---

*此文件已归档至 scripts/archive/ 目录*
`;

  const notePath = path.join(scriptsDir, 'archive', `${filename}.md`);
  fs.writeFileSync(notePath, note, 'utf8');
  console.log(`📝 创建归档说明: ${filename}.md`);
  return notePath;
};

// 处理剩余文件
let archivedCount = 0;
let deletedCount = 0;

remainingFiles.forEach(file => {
  try {
    const srcPath = path.join(scriptsDir, file);
    
    if (fs.existsSync(srcPath)) {
      // 移动到归档目录
      const destPath = path.join(scriptsDir, 'archive', file);
      const archiveDir = path.dirname(destPath);
      
      if (!fs.existsSync(archiveDir)) {
        fs.mkdirSync(archiveDir, { recursive: true });
      }
      
      fs.copyFileSync(srcPath, destPath);
      
      // 创建归档说明
      createArchiveNote(file, 
        '测试和验证相关脚本，功能已集成到主流程中', 
        '使用 npm run check:hardcode 进行硬编码检查'
      );
      
      // 删除原文件
      fs.unlinkSync(srcPath);
      
      archivedCount++;
      console.log(`✅ 归档: ${file} -> archive/`);
    } else {
      console.log(`⚠️ 文件不存在: ${file}`);
    }
  } catch (error) {
    console.error(`❌ 处理 ${file} 时出错:`, error.message);
  }
});

// 清理空目录和临时文件
console.log('\n🧹 清理临时文件...');
const tempFiles = [
  'SIMPLE_MIGRATION_REPORT.json',
  'MIGRATION_REPORT.json'
];

tempFiles.forEach(file => {
  try {
    const filePath = path.join(scriptsDir, file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      deletedCount++;
      console.log(`🗑️ 删除临时文件: ${file}`);
    }
  } catch (error) {
    console.error(`❌ 删除 ${file} 时出错:`, error.message);
  }
});

// 创建清理报告
const cleanupReport = {
  stage: '第二阶段 - 清理和归档',
  archivedCount,
  deletedCount,
  timestamp: new Date().toISOString(),
  archivedFiles: remainingFiles,
  deletedFiles: tempFiles
};

fs.writeFileSync(
  path.join(scriptsDir, 'CLEANUP_ARCHIVE_REPORT.json'),
  JSON.stringify(cleanupReport, null, 2),
  'utf8'
);

// 更新主 README
const updateMainReadme = () => {
  const currentReadme = fs.readFileSync(path.join(scriptsDir, 'README.md'), 'utf8');
  
  const newReadme = currentReadme.replace(
    /## 📋 脚本统计.*?$/ms,
    `## 📋 脚本统计

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
   - 建立自动化流程`
  );
  
  fs.writeFileSync(path.join(scriptsDir, 'README.md'), newReadme, 'utf8');
  console.log('📝 更新主 README.md');
};

updateMainReadme();

console.log('\n📊 生成清理报告: CLEANUP_ARCHIVE_REPORT.json');
console.log(`\n🎉 第二阶段完成！`);
console.log(`✅ 归档文件: ${archivedCount} 个`);
console.log(`🗑️ 删除临时文件: ${deletedCount} 个`);
console.log('\n✅ 清理完成！可以继续第三阶段：文档完善');

// 创建第三阶段准备脚本
const stage3Prep = {
  description: '第三阶段：文档完善',
  tasks: [
    '完善各子目录 README',
    '创建脚本使用指南', 
    '建立最佳实践文档',
    '创建脚本索引'
  ],
  nextAction: 'node scripts/stage3-documentation.mjs'
};

fs.writeFileSync(
  path.join(scriptsDir, 'STAGE3_PREP.json'),
  JSON.stringify(stage3Prep, null, 2),
  'utf8'
);

console.log('\n📋 第三阶段准备文件已创建: STAGE3_PREP.json');
