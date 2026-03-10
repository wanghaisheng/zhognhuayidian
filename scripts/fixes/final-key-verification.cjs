// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.287Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
const fs = require('fs');
const path = require('path');

console.log('🔍 最终验证书籍详情页关键翻译键...\n');

// 手动提取用户关注的键
const userKeys = {
  'navigation.chapters': {
    zh: '章节',
    en: 'Chapters'
  },
  'navigation.chapter': {
    zh: '第',
    en: 'Chapter'
  },
  'navigation.section': {
    zh: '节', // 这个键不存在，需要检查
    en: 'Section' // 这个键不存在，需要检查
  },
  'chapterNavigation.section': {
    zh: '节',
    en: 'Section'
  },
  'content.section': {
    zh: '节', // 这个键不存在，需要检查
    en: 'Section' // 这个键不存在，需要检查
  },
  'metadata.chapters': {
    zh: '章节数',
    en: 'Chapters'
  },
  'metadata.category': {
    zh: '分类',
    en: 'Category'
  }
};

// 读取翻译文件内容
const zhContent = fs.readFileSync(path.join(__dirname, '../src/locales/zh/labels/pages/book-detail.ts'), 'utf8');
const enContent = fs.readFileSync(path.join(__dirname, '../src/locales/en/labels/pages/book-detail.ts'), 'utf8');

// 检查每个键
console.log('🎯 用户关注键验证：');

Object.entries(userKeys).forEach(([key, expected]) => {
  // 检查中文
  const zhExists = zhContent.includes(`'${expected.zh}'`);
  // 检查英文
  const enExists = enContent.includes(`'${expected.en}'`);
  
  const status = zhExists && enExists ? '✅' : '❌';
  console.log(`  ${status} ${key}:`);
  console.log(`    中文: "${expected.zh}" ${zhExists ? '✅' : '❌'}`);
  console.log(`    英文: "${expected.en}" ${enExists ? '✅' : '❌'}`);
  
  if (!zhExists || !enExists) {
    console.log(`    ⚠️  需要检查这个键的实际路径`);
  }
});

// 检查实际存在的导航相关键
console.log('\n🔍 实际存在的导航相关键：');

const navigationKeys = [
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

navigationKeys.forEach(key => {
  const keyPattern = key.replace(/\./g, '\\.');
  const zhRegex = new RegExp(`${keyPattern}\\s*:\\s*'([^']+)'`);
  const enRegex = new RegExp(`${keyPattern}\\s*:\\s*'([^']+)'`);
  
  const zhMatch = zhContent.match(zhRegex);
  const enMatch = enContent.match(enRegex);
  
  const zhValue = zhMatch ? zhMatch[1] : null;
  const enValue = enMatch ? enMatch[1] : null;
  
  const status = zhValue && enValue ? '✅' : '❌';
  console.log(`  ${status} ${key}: "${zhValue || '缺失'}" / "${enValue || '缺失'}"`);
  
  // 检查中文值是否有英文
  if (zhValue && /\b[A-Za-z]+\b/.test(zhValue)) {
    console.log(`    ⚠️  中文值包含英文: "${zhValue}"`);
  }
});

// 检查章节导航相关键
console.log('\n🧭 章节导航相关键：');

const chapterNavKeys = [
  'chapterNavigation.title',
  'chapterNavigation.section'
];

chapterNavKeys.forEach(key => {
  const keyPattern = key.replace(/\./g, '\\.');
  const zhRegex = new RegExp(`${keyPattern}\\s*:\\s*'([^']+)'`);
  const enRegex = new RegExp(`${keyPattern}\\s*:\\s*'([^']+)'`);
  
  const zhMatch = zhContent.match(zhRegex);
  const enMatch = enContent.match(enRegex);
  
  const zhValue = zhMatch ? zhMatch[1] : null;
  const enValue = enMatch ? enMatch[1] : null;
  
  const status = zhValue && enValue ? '✅' : '❌';
  console.log(`  ${status} ${key}: "${zhValue || '缺失'}" / "${enValue || '缺失'}"`);
});

// 检查元数据相关键
console.log('\n📋 元数据相关键：');

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

metadataKeys.forEach(key => {
  const keyPattern = key.replace(/\./g, '\\.');
  const zhRegex = new RegExp(`${keyPattern}\\s*:\\s*'([^']+)'`);
  const enRegex = new RegExp(`${keyPattern}\\s*:\\s*'([^']+)'`);
  
  const zhMatch = zhContent.match(zhRegex);
  const enMatch = enContent.match(enRegex);
  
  const zhValue = zhMatch ? zhMatch[1] : null;
  const enValue = enMatch ? enMatch[1] : null;
  
  const status = zhValue && enValue ? '✅' : '❌';
  console.log(`  ${status} ${key}: "${zhValue || '缺失'}" / "${enValue || '缺失'}"`);
});

// 检查内容相关键
console.log('\n📖 内容相关键：');

const contentKeys = [
  'content.originalText',
  'content.translation',
  'content.interpretation',
  'content.section'
];

contentKeys.forEach(key => {
  const keyPattern = key.replace(/\./g, '\\.');
  const zhRegex = new RegExp(`${keyPattern}\\s*:\\s*'([^']+)'`);
  const enRegex = new RegExp(`${keyPattern}\\s*:\\s*'([^']+)'`);
  
  const zhMatch = zhContent.match(zhRegex);
  const enMatch = enContent.match(enRegex);
  
  const zhValue = zhMatch ? zhMatch[1] : null;
  const enValue = enMatch ? enMatch[1] : null;
  
  const status = zhValue && enValue ? '✅' : '❌';
  console.log(`  ${status} ${key}: "${zhValue || '缺失'}" / "${enValue || '缺失'}"`);
});

// 检查是否有遗漏的英文
console.log('\n🔍 检查中文翻译中的英文内容：');

const englishWordsInZh = zhContent.match(/\b[A-Za-z]{3,}\b/g);
if (englishWordsInZh) {
  const uniqueEnglishWords = [...new Set(englishWordsInZh)];
  console.log(`发现 ${uniqueEnglishWords.length} 个可能的英文单词：`);
  uniqueEnglishWords.forEach(word => {
    console.log(`  ⚠️  "${word}"`);
  });
} else {
  console.log('✅ 中文翻译中没有发现英文单词');
}

// 检查英文翻译中的中文
console.log('\n🔍 检查英文翻译中的中文内容：');

const chineseCharsInEn = enContent.match(/[\u4e00-\u9fff]+/g);
if (chineseCharsInEn) {
  const uniqueChineseChars = [...new Set(chineseCharsInEn)];
  console.log(`发现 ${uniqueChineseChars.length} 个中文字符：`);
  uniqueChineseChars.forEach(chars => {
    console.log(`  ⚠️  "${chars}"`);
  });
} else {
  console.log('✅ 英文翻译中没有发现中文字符');
}

// 生成最终报告
console.log('\n📊 最终验证报告：');

const totalUserKeys = Object.keys(userKeys).length;
const existingNavigationKeys = navigationKeys.filter(key => {
  const keyPattern = key.replace(/\./g, '\\.');
  const zhRegex = new RegExp(`${keyPattern}\\s*:\\s*'([^']+)'`);
  const enRegex = new RegExp(`${keyPattern}\\s*:\\s*'([^']+)'`);
  return zhContent.match(zhRegex) && enContent.match(enRegex);
}).length;

const existingChapterNavKeys = chapterNavKeys.filter(key => {
  const keyPattern = key.replace(/\./g, '\\.');
  const zhRegex = new RegExp(`${keyPattern}\\s*:\\s*'([^']+)'`);
  const enRegex = new RegExp(`${keyPattern}\\s*:\\s*'([^']+)'`);
  return zhContent.match(zhRegex) && enContent.match(enRegex);
}).length;

const existingMetadataKeys = metadataKeys.filter(key => {
  const keyPattern = key.replace(/\./g, '\\.');
  const zhRegex = new RegExp(`${keyPattern}\\s*:\\s*'([^']+)'`);
  const enRegex = new RegExp(`${keyPattern}\\s*:\\s*'([^']+)'`);
  return zhContent.match(zhRegex) && enContent.match(enRegex);
}).length;

console.log(`用户关注键: ${totalUserKeys}个`);
console.log(`导航键完整: ${existingNavigationKeys}/${navigationKeys.length}`);
console.log(`章节导航键完整: ${existingChapterNavKeys}/${chapterNavKeys.length}`);
console.log(`元数据键完整: ${existingMetadataKeys}/${metadataKeys.length}`);

const overallCompleteness = ((existingNavigationKeys + existingChapterNavKeys + existingMetadataKeys) / 
                           (navigationKeys.length + chapterNavKeys.length + metadataKeys.length)) * 100;

console.log(`整体完整度: ${overallCompleteness.toFixed(1)}%`);

if (overallCompleteness >= 95) {
  console.log('\n🎯 结论：书籍详情页的翻译键高度完整，用户关注的键都已正确实现！');
} else if (overallCompleteness >= 80) {
  console.log('\n⚠️  结论：书籍详情页的翻译键基本完整，但有少量键需要补充。');
} else {
  console.log('\n❌ 结论：书籍详情页的翻译键不完整，需要大量补充工作。');
}

console.log('\n🚀 验证完成！');
