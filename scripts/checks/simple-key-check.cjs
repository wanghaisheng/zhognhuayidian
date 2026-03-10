// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.372Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
const fs = require('fs');
const path = require('path');

console.log('🔍 简单验证书籍详情页关键翻译键...\n');

// 读取翻译文件
const zhContent = fs.readFileSync(path.join(__dirname, '../src/locales/zh/labels/pages/book-detail.ts'), 'utf8');
const enContent = fs.readFileSync(path.join(__dirname, '../src/locales/en/labels/pages/book-detail.ts'), 'utf8');

// 用户关注的关键键
const criticalKeys = [
  'navigation.chapters',
  'navigation.chapter',
  'navigation.section',
  'chapterNavigation.section',
  'content.section',
  'metadata.chapters',
  'metadata.category'
];

console.log('🎯 检查用户关注的关键键：');

let allKeysExist = true;

criticalKeys.forEach(key => {
  // 检查中文
  const zhKeyPattern = key.replace(/\./g, '\\.');
  const zhRegex = new RegExp(`${zhKeyPattern}\\s*:\\s*'([^']+)'`);
  const zhMatch = zhContent.match(zhRegex);
  const zhValue = zhMatch ? zhMatch[1] : null;
  
  // 检查英文
  const enKeyPattern = key.replace(/\./g, '\\.');
  const enRegex = new RegExp(`${enKeyPattern}\\s*:\\s*'([^']+)'`);
  const enMatch = enContent.match(enRegex);
  const enValue = enMatch ? enMatch[1] : null;
  
  const status = zhValue && enValue ? '✅' : '❌';
  if (!zhValue || !enValue) {
    allKeysExist = false;
  }
  
  console.log(`  ${status} ${key}:`);
  console.log(`    中文: "${zhValue || '缺失'}"`);
  console.log(`    英文: "${enValue || '缺失'}"`);
  
  // 检查中文值是否包含英文
  if (zhValue && /\b[A-Za-z]{2,}\b/.test(zhValue)) {
    console.log(`    ⚠️  中文值包含英文: "${zhValue}"`);
  }
  
  // 检查英文值是否包含中文
  if (enValue && /[\u4e00-\u9fff]/.test(enValue)) {
    console.log(`    ⚠️  英文值包含中文: "${enValue}"`);
  }
});

// 检查所有导航相关的键
console.log('\n🧭 检查所有导航相关键：');

const navigationRelatedKeys = [
  'navigation.chapters',
  'navigation.bookmarks',
  'navigation.notes',
  'navigation.search',
  'navigation.previous',
  'navigation.next',
  'navigation.continueReading',
  'navigation.startOver',
  'navigation.searchPlaceholder',
  'navigation.quickJump',
  'navigation.readingProgress',
  'navigation.goToSection',
  'navigation.chapter',
  'navigation.minutes'
];

let navigationIssues = 0;

navigationRelatedKeys.forEach(key => {
  const zhKeyPattern = key.replace(/\./g, '\\.');
  const zhRegex = new RegExp(`${zhKeyPattern}\\s*:\\s*'([^']+)'`);
  const zhMatch = zhContent.match(zhRegex);
  const zhValue = zhMatch ? zhMatch[1] : null;
  
  const enKeyPattern = key.replace(/\./g, '\\.');
  const enRegex = new RegExp(`${enKeyPattern}\\s*:\\s*'([^']+)'`);
  const enMatch = enContent.match(enRegex);
  const enValue = enMatch ? enMatch[1] : null;
  
  const status = zhValue && enValue ? '✅' : '❌';
  if (!zhValue || !enValue) {
    navigationIssues++;
  }
  
  console.log(`  ${status} ${key}: "${zhValue || '缺失'}" / "${enValue || '缺失'}"`);
});

// 检查章节导航相关键
console.log('\n📖 检查章节导航相关键：');

const chapterNavKeys = [
  'chapterNavigation.title',
  'chapterNavigation.section'
];

let chapterNavIssues = 0;

chapterNavKeys.forEach(key => {
  const zhKeyPattern = key.replace(/\./g, '\\.');
  const zhRegex = new RegExp(`${zhKeyPattern}\\s*:\\s*'([^']+)'`);
  const zhMatch = zhContent.match(zhRegex);
  const zhValue = zhMatch ? zhMatch[1] : null;
  
  const enKeyPattern = key.replace(/\./g, '\\.');
  const enRegex = new RegExp(`${enKeyPattern}\\s*:\\s*'([^']+)'`);
  const enMatch = enContent.match(enRegex);
  const enValue = enMatch ? enMatch[1] : null;
  
  const status = zhValue && enValue ? '✅' : '❌';
  if (!zhValue || !enValue) {
    chapterNavIssues++;
  }
  
  console.log(`  ${status} ${key}: "${zhValue || '缺失'}" / "${enValue || '缺失'}"`);
});

// 检查元数据相关键
console.log('\n📋 检查元数据相关键：');

const metadataKeys = [
  'metadata.title',
  'metadata.dynasty',
  'metadata.author',
  'metadata.chapters',
  'metadata.wordCount',
  'metadata.category',
  'metadata.tags',
  'metadata.ancient'
];

let metadataIssues = 0;

metadataKeys.forEach(key => {
  const zhKeyPattern = key.replace(/\./g, '\\.');
  const zhRegex = new RegExp(`${zhKeyPattern}\\s*:\\s*'([^']+)'`);
  const zhMatch = zhContent.match(zhRegex);
  const zhValue = zhMatch ? zhMatch[1] : null;
  
  const enKeyPattern = key.replace(/\./g, '\\.');
  const enRegex = new RegExp(`${enKeyPattern}\\s*:\\s*'([^']+)'`);
  const enMatch = enContent.match(enRegex);
  const enValue = enMatch ? enMatch[1] : null;
  
  const status = zhValue && enValue ? '✅' : '❌';
  if (!zhValue || !enValue) {
    metadataIssues++;
  }
  
  console.log(`  ${status} ${key}: "${zhValue || '缺失'}" / "${enValue || '缺失'}"`);
});

// 检查内容相关键
console.log('\n📄 检查内容相关键：');

const contentKeys = [
  'content.originalText',
  'content.translation',
  'content.interpretation',
  'content.section'
];

let contentIssues = 0;

contentKeys.forEach(key => {
  const zhKeyPattern = key.replace(/\./g, '\\.');
  const zhRegex = new RegExp(`${zhKeyPattern}\\s*:\\s*'([^']+)'`);
  const zhMatch = zhContent.match(zhRegex);
  const zhValue = zhMatch ? zhMatch[1] : null;
  
  const enKeyPattern = key.replace(/\./g, '\\.');
  const enRegex = new RegExp(`${enKeyPattern}\\s*:\\s*'([^']+)'`);
  const enMatch = enContent.match(enRegex);
  const enValue = enMatch ? enMatch[1] : null;
  
  const status = zhValue && enValue ? '✅' : '❌';
  if (!zhValue || !enValue) {
    contentIssues++;
  }
  
  console.log(`  ${status} ${key}: "${zhValue || '缺失'}" / "${enValue || '缺失'}"`);
});

// 检查是否有英文内容混入中文翻译
console.log('\n🔍 检查中文翻译中的英文内容：');

// 排除代码中的英文单词，只检查翻译值
const zhTranslationValues = zhContent.match(/:\s*'([^']+)'/g);
if (zhTranslationValues) {
  let englishInTranslations = 0;
  
  zhTranslationValues.forEach(match => {
    const value = match.match(/:\s*'([^']+)'/)[1];
    // 检查是否包含英文单词（排除单个字母）
    if (/\b[A-Za-z]{3,}\b/.test(value) && !/[\u4e00-\u9fff]/.test(value)) {
      englishInTranslations++;
      if (englishInTranslations <= 5) { // 只显示前5个
        console.log(`  ⚠️  可能的英文翻译: "${value}"`);
      }
    }
  });
  
  console.log(`发现 ${englishInTranslations} 个可能的英文翻译值`);
}

// 检查英文翻译中的中文内容
console.log('\n🔍 检查英文翻译中的中文内容：');

const enTranslationValues = enContent.match(/:\s*'([^']+)'/g);
if (enTranslationValues) {
  let chineseInTranslations = 0;
  
  enTranslationValues.forEach(match => {
    const value = match.match(/:\s*'([^']+)'/)[1];
    if (/[\u4e00-\u9fff]/.test(value)) {
      chineseInTranslations++;
      if (chineseInTranslations <= 5) { // 只显示前5个
        console.log(`  ⚠️  包含中文的英文翻译: "${value}"`);
      }
    }
  });
  
  console.log(`发现 ${chineseInTranslations} 个包含中文的英文翻译值`);
}

// 生成最终报告
console.log('\n📊 最终验证报告：');

const totalCheckedKeys = criticalKeys.length + navigationRelatedKeys.length + chapterNavKeys.length + metadataKeys.length + contentKeys.length;
const totalIssues = (!allKeysExist ? 1 : 0) + navigationIssues + chapterNavIssues + metadataIssues + contentIssues;
const completeness = ((totalCheckedKeys - totalIssues) / totalCheckedKeys) * 100;

console.log(`检查的键总数: ${totalCheckedKeys}`);
console.log(`问题键总数: ${totalIssues}`);
console.log(`完整度: ${completeness.toFixed(1)}%`);

console.log('\n📋 分类统计：');
console.log(`用户关注键: ${criticalKeys.length}个，${allKeysExist ? '完整' : '不完整'}`);
console.log(`导航相关键: ${navigationRelatedKeys.length}个，${navigationRelatedKeys.length - navigationIssues}个完整`);
console.log(`章节导航键: ${chapterNavKeys.length}个，${chapterNavKeys.length - chapterNavIssues}个完整`);
console.log(`元数据键: ${metadataKeys.length}个，${metadataKeys.length - metadataIssues}个完整`);
console.log(`内容相关键: ${contentKeys.length}个，${contentKeys.length - contentIssues}个完整`);

if (completeness >= 95) {
  console.log('\n🎯 结论：书籍详情页的翻译键高度完整，用户关注的键都已正确实现！');
} else if (completeness >= 80) {
  console.log('\n⚠️  结论：书籍详情页的翻译键基本完整，但有少量键需要补充。');
} else {
  console.log('\n❌ 结论：书籍详情页的翻译键不完整，需要补充工作。');
}

console.log('\n🚀 验证完成！');
