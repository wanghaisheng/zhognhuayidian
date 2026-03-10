// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.306Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
const fs = require('fs');
const path = require('path');

console.log('🔍 直接检查书籍详情页的翻译键一致性...\n');

// 读取中英文翻译文件
const zhTranslationPath = path.join(__dirname, '../src/locales/zh/labels/pages/book-detail.ts');
const enTranslationPath = path.join(__dirname, '../src/locales/en/labels/pages/book-detail.ts');

const zhContent = fs.readFileSync(zhTranslationPath, 'utf8');
const enContent = fs.readFileSync(enTranslationPath, 'utf8');

// 提取所有翻译键的简单方法
function extractAllKeys(content) {
  const keys = {};
  
  // 提取所有单引号键值对
  const matches = content.match(/'([^']+)':\s*'([^']+)'/g);
  if (matches) {
    matches.forEach(match => {
      const keyValueMatch = match.match(/'([^']+)':\s*'([^']+)'/);
      if (keyValueMatch) {
        keys[keyValueMatch[1]] = keyValueMatch[2];
      }
    });
  }
  
  return keys;
}

// 提取中英文键
const zhKeys = extractAllKeys(zhContent);
const enKeys = extractAllKeys(enContent);

console.log('📊 翻译键统计：');
console.log(`中文翻译键数量: ${Object.keys(zhKeys).length}`);
console.log(`英文翻译键数量: ${Object.keys(enKeys).length}`);

// 找出所有唯一的键
const allKeys = new Set([...Object.keys(zhKeys), ...Object.keys(enKeys)]);
console.log(`总唯一键数量: ${allKeys.size}`);

// 检查每个键的一致性
console.log('\n🔍 键一致性检查：');

const issues = {
  missingInZh: [],
  missingInEn: [],
  emptyInZh: [],
  emptyInEn: [],
  englishInZh: [],
  chineseInEn: [],
  suspiciousEnglish: []
};

allKeys.forEach(key => {
  const zhValue = zhKeys[key];
  const enValue = enKeys[key];
  
  const hasZh = zhValue !== undefined;
  const hasEn = enValue !== undefined;
  const zhIsEmpty = zhValue === '' || zhValue === null || zhValue === undefined;
  const enIsEmpty = enValue === '' || enValue === null || enValue === undefined;
  
  // 检查缺失
  if (!hasZh && hasEn) {
    issues.missingInZh.push({ key, enValue });
  }
  if (hasZh && !hasEn) {
    issues.missingInEn.push({ key, zhValue });
  }
  
  // 检查空值
  if (hasZh && zhIsEmpty) {
    issues.emptyInZh.push({ key, enValue });
  }
  if (hasEn && enIsEmpty) {
    issues.emptyInEn.push({ key, zhValue });
  }
  
  // 检查中文环境下是否有英文（更严格的检查）
  if (hasZh && hasEn) {
    // 检查中文值是否包含英文单词
    const hasEnglishWords = /\b[A-Za-z]+\b/.test(zhValue);
    const hasChineseChars = /[\u4e00-\u9fff]/.test(zhValue);
    
    if (hasEnglishWords && !hasChineseChars && zhValue.length > 2) {
      issues.englishInZh.push({ key, zhValue, enValue });
    }
    
    // 检查英文值是否包含中文
    if (/[\u4e00-\u9fff]/.test(enValue)) {
      issues.chineseInEn.push({ key, zhValue, enValue });
    }
  }
  
  // 检查可疑的英文（缩写、技术术语等）
  if (hasZh && hasEn) {
    const isZhEnglish = /^[A-Za-z\s\-_]+$/.test(zhValue);
    const isEnEnglish = /^[A-Za-z\s\-_]+$/.test(enValue);
    
    if (isZhEnglish && !isEnEnglish) {
      issues.suspiciousEnglish.push({ key, zhValue, enValue, reason: '中文值为纯英文' });
    }
  }
});

// 输出问题
console.log('\n❌ 发现的问题：');

let hasIssues = false;

if (issues.missingInZh.length > 0) {
  hasIssues = true;
  console.log(`\n🇨🇳 中文缺失 (${issues.missingInZh.length}个)：`);
  issues.missingInZh.forEach(({ key, enValue }) => {
    console.log(`  ❌ ${key}: "${enValue}" (英文存在，中文缺失)`);
  });
}

if (issues.missingInEn.length > 0) {
  hasIssues = true;
  console.log(`\n🇺🇸 英文缺失 (${issues.missingInEn.length}个)：`);
  issues.missingInEn.forEach(({ key, zhValue }) => {
    console.log(`  ❌ ${key}: "${zhValue}" (中文存在，英文缺失)`);
  });
}

if (issues.emptyInZh.length > 0) {
  hasIssues = true;
  console.log(`\n🇨🇳 中文空值 (${issues.emptyInZh.length}个)：`);
  issues.emptyInZh.forEach(({ key, enValue }) => {
    console.log(`  ⚠️  ${key}: "" (中文为空，英文: "${enValue}")`);
  });
}

if (issues.emptyInEn.length > 0) {
  hasIssues = true;
  console.log(`\n🇺🇸 英文空值 (${issues.emptyInEn.length}个)：`);
  issues.emptyInEn.forEach(({ key, zhValue }) => {
    console.log(`  ⚠️  ${key}: "" (英文为空，中文: "${zhValue}")`);
  });
}

if (issues.englishInZh.length > 0) {
  hasIssues = true;
  console.log(`\n🇨🇳 中文环境中的英文 (${issues.englishInZh.length}个)：`);
  issues.englishInZh.forEach(({ key, zhValue, enValue }) => {
    console.log(`  ⚠️  ${key}: "${zhValue}" (可能是英文，应该翻译)`);
    console.log(`     建议翻译: "${enValue}"`);
  });
}

if (issues.chineseInEn.length > 0) {
  hasIssues = true;
  console.log(`\n🇺🇸 英文环境中的中文 (${issues.chineseInEn.length}个)：`);
  issues.chineseInEn.forEach(({ key, zhValue, enValue }) => {
    console.log(`  ⚠️  ${key}: "${enValue}" (包含中文，应该是英文)`);
    console.log(`     建议翻译: "${zhValue}"`);
  });
}

if (issues.suspiciousEnglish.length > 0) {
  hasIssues = true;
  console.log(`\n🔍 可疑的英文键 (${issues.suspiciousEnglish.length}个)：`);
  issues.suspiciousEnglish.forEach(({ key, zhValue, enValue, reason }) => {
    console.log(`  ⚠️  ${key}: "${zhValue}" (${reason})`);
    console.log(`     英文值: "${enValue}"`);
  });
}

// 检查特定的用户关注点
console.log('\n🎯 用户关注点检查：');

const userConcernKeys = [
  'navigation.chapters',
  'navigation.chapter',
  'navigation.section',
  'chapterNavigation.section',
  'content.section',
  'metadata.chapters',
  'metadata.category'
];

console.log('\n检查用户可能关心的导航和内容相关键：');
userConcernKeys.forEach(key => {
  const zhValue = zhKeys[key];
  const enValue = enKeys[key];
  
  if (zhValue && enValue) {
    const zhHasEnglish = /\b[A-Za-z]+\b/.test(zhValue);
    const enHasChinese = /[\u4e00-\u9fff]/.test(enValue);
    
    if (zhHasEnglish) {
      console.log(`  ⚠️  ${key}: "${zhValue}" (中文中有英文)`);
    } else {
      console.log(`  ✅ ${key}: "${zhValue}" / "${enValue}"`);
    }
  } else {
    console.log(`  ❌ ${key}: 缺失翻译`);
  }
});

// 生成统计报告
const totalIssues = issues.missingInZh.length + issues.missingInEn.length + 
                   issues.emptyInZh.length + issues.emptyInEn.length + 
                   issues.englishInZh.length + issues.chineseInEn.length + 
                   issues.suspiciousEnglish.length;

console.log('\n📊 统计报告：');
console.log(`总键数: ${allKeys.size}`);
console.log(`中文键数: ${Object.keys(zhKeys).length}`);
console.log(`英文键数: ${Object.keys(enKeys).length}`);
console.log(`问题总数: ${totalIssues}`);
console.log(`问题率: ${allKeys.size > 0 ? ((totalIssues / allKeys.size) * 100).toFixed(1) : 0}%`);

// 输出所有键的详细对比（用于调试）
console.log('\n🔍 详细键对比（前20个）：');
const keyArray = Array.from(allKeys).slice(0, 20);
keyArray.forEach(key => {
  const zhValue = zhKeys[key];
  const enValue = enKeys[key];
  
  const status = zhValue && enValue ? '✅' : '❌';
  console.log(`  ${status} ${key}:`);
  console.log(`    中文: "${zhValue || '缺失'}"`);
  console.log(`    英文: "${enValue || '缺失'}"`);
});

if (allKeys.size > 20) {
  console.log(`  ... 还有 ${allKeys.size - 20} 个键未显示`);
}

if (!hasIssues) {
  console.log('\n🎯 结论：书籍详情页的翻译键完全一致，没有遗漏或错误！');
} else {
  console.log(`\n⚠️  结论：发现 ${totalIssues} 个问题需要修复。`);
}

console.log('\n🚀 检查完成！');
