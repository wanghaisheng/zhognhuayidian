// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.316Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
const fs = require('fs');
const path = require('path');

console.log('🔍 检查嵌套翻译键的完整性和一致性...\n');

// 读取中英文翻译文件
const zhTranslationPath = path.join(__dirname, '../src/locales/zh/labels/pages/book-detail.ts');
const enTranslationPath = path.join(__dirname, '../src/locales/en/labels/pages/book-detail.ts');

const zhContent = fs.readFileSync(zhTranslationPath, 'utf8');
const enContent = fs.readFileSync(enTranslationPath, 'utf8');

// 解析嵌套对象结构
function parseNestedObject(content) {
  const obj = {};
  
  // 使用正则表达式提取嵌套结构
  const mainObjectMatch = content.match(/export\s+const\s+bookDetail\s*=\s*({[\s\S]*})\s*$/m);
  if (mainObjectMatch) {
    const mainContent = mainObjectMatch[1];
    
    // 递归解析对象
    function parseObject(objContent, currentPath = '') {
      const result = {};
      
      // 匹配对象键
      const keyMatches = objContent.match(/(\w+)\s*:\s*{([^}]*)}/g);
      if (keyMatches) {
        keyMatches.forEach(match => {
          const keyMatch = match.match(/(\w+)\s*:\s*{([^}]*)}/);
          if (keyMatch) {
            const key = keyMatch[1];
            const valueContent = keyMatch[2];
            const fullPath = currentPath ? `${currentPath}.${key}` : key;
            
            // 检查是否还有嵌套对象
            if (valueContent.includes(':')) {
              result[key] = parseObject(`{${valueContent}}`, fullPath);
            } else {
              // 解析字符串值
              const stringMatches = valueContent.match(/'([^']+)'/g);
              if (stringMatches) {
                stringMatches.forEach((str, index) => {
                  const cleanStr = str.slice(1, -1);
                  const subPath = index > 0 ? `${fullPath}_${index}` : fullPath;
                  result[subPath] = cleanStr;
                });
              }
            }
          }
        });
      }
      
      // 解析直接的键值对
      const directMatches = objContent.match(/'([^']+)':\s*'([^']+)'/g);
      if (directMatches) {
        directMatches.forEach(pair => {
          const match = pair.match(/'([^']+)':\s*'([^']+)'/);
          if (match) {
            const key = match[1];
            const value = match[2];
            const fullPath = currentPath ? `${currentPath}.${key}` : key;
            result[fullPath] = value;
          }
        });
      }
      
      return result;
    }
    
    return parseObject(mainContent);
  }
  
  return {};
}

// 解析中英文嵌套键
const zhNestedKeys = parseNestedObject(zhContent);
const enNestedKeys = parseNestedObject(enContent);

console.log('📊 嵌套翻译键统计：');
console.log(`中文翻译键数量: ${Object.keys(zhNestedKeys).length}`);
console.log(`英文翻译键数量: ${Object.keys(enNestedKeys).length}`);

// 找出所有唯一的键
const allNestedKeys = new Set([...Object.keys(zhNestedKeys), ...Object.keys(enNestedKeys)]);
console.log(`总唯一键数量: ${allNestedKeys.size}`);

// 检查每个键的一致性
console.log('\n🔍 嵌套键一致性检查：');

const issues = {
  missingInZh: [],
  missingInEn: [],
  emptyInZh: [],
  emptyInEn: [],
  englishInZh: [],
  chineseInEn: []
};

allNestedKeys.forEach(key => {
  const zhValue = zhNestedKeys[key];
  const enValue = enNestedKeys[key];
  
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
  
  // 检查中文环境下是否有英文
  if (hasZh && hasEn) {
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

// 检查用户特别关注的键
console.log('\n🎯 用户关注键检查：');

const userKeys = [
  'navigation.chapters',
  'navigation.chapter', 
  'navigation.section',
  'chapterNavigation.section',
  'content.section',
  'metadata.chapters',
  'metadata.category'
];

console.log('\n检查用户特别关注的键：');
userKeys.forEach(key => {
  const zhValue = zhNestedKeys[key];
  const enValue = enNestedKeys[key];
  
  if (zhValue && enValue) {
    const zhHasEnglish = /\b[A-Za-z]+\b/.test(zhValue);
    const enHasChinese = /[\u4e00-\u9fff]/.test(enValue);
    
    if (zhHasEnglish) {
      console.log(`  ⚠️  ${key}: "${zhValue}" (中文中有英文)`);
    } else {
      console.log(`  ✅ ${key}: "${zhValue}" / "${enValue}"`);
    }
  } else {
    console.log(`  ❌ ${key}: 缺失翻译 (中文: ${zhValue || '无'}, 英文: ${enValue || '无'})`);
  }
});

// 检查所有导航相关的键
console.log('\n🧭 导航相关键检查：');
const navigationKeys = Array.from(allNestedKeys).filter(key => 
  key.includes('navigation') || key.includes('chapter') || key.includes('section')
);

console.log(`\n找到 ${navigationKeys.length} 个导航相关键：`);
navigationKeys.forEach(key => {
  const zhValue = zhNestedKeys[key];
  const enValue = enNestedKeys[key];
  
  const status = zhValue && enValue ? '✅' : '❌';
  console.log(`  ${status} ${key}: "${zhValue || '缺失'}" / "${enValue || '缺失'}"`);
});

// 生成统计报告
const totalIssues = issues.missingInZh.length + issues.missingInEn.length + 
                   issues.emptyInZh.length + issues.emptyInEn.length + 
                   issues.englishInZh.length + issues.chineseInEn.length;

console.log('\n📊 统计报告：');
console.log(`总键数: ${allNestedKeys.size}`);
console.log(`中文键数: ${Object.keys(zhNestedKeys).length}`);
console.log(`英文键数: ${Object.keys(enNestedKeys).length}`);
console.log(`问题总数: ${totalIssues}`);
console.log(`问题率: ${allNestedKeys.size > 0 ? ((totalIssues / allNestedKeys.size) * 100).toFixed(1) : 0}%`);

if (!hasIssues) {
  console.log('\n🎯 结论：书籍详情页的嵌套翻译键完全一致，没有遗漏或错误！');
} else {
  console.log(`\n⚠️  结论：发现 ${totalIssues} 个问题需要修复。`);
}

console.log('\n🚀 检查完成！');
