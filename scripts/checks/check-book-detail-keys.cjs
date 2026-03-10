// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.308Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
const fs = require('fs');
const path = require('path');

console.log('🔍 系统性检查书籍详情页的key一致性...\n');

// 读取中英文翻译文件
const zhTranslationPath = path.join(__dirname, '../src/locales/zh/labels/pages/book-detail.ts');
const enTranslationPath = path.join(__dirname, '../src/locales/en/labels/pages/book-detail.ts');

const zhContent = fs.readFileSync(zhTranslationPath, 'utf8');
const enContent = fs.readFileSync(enTranslationPath, 'utf8');

// 解析翻译文件中的所有key
function parseTranslationKeys(content) {
  const keys = {};
  
  // 解析顶层对象
  const topLevelMatch = content.match(/export\s+const\s+bookDetailLabels\s*=\s*{([^}]+)}/s);
  if (topLevelMatch) {
    const topLevelContent = topLevelMatch[1];
    
    // 递归解析嵌套对象
    function parseObject(objContent, prefix = '') {
      const obj = {};
      
      // 匹配对象中的键值对
      const keyValuePairs = objContent.match(/(\w+):\s*{([^}]+)}/g);
      if (keyValuePairs) {
        keyValuePairs.forEach(pair => {
          const [key, valueContent] = pair.split(/:\s*{/, 2);
          if (key && valueContent) {
            const cleanKey = key.trim();
            const cleanValueContent = valueContent.slice(0, -1); // 移除最后的 }
            
            // 检查是否是嵌套对象
            if (cleanValueContent.includes(':')) {
              obj[cleanKey] = parseObject(cleanValueContent, prefix + cleanKey + '.');
            } else {
              // 解析字符串值
              const stringMatches = cleanValueContent.match(/'([^']+)'/g);
              if (stringMatches) {
                stringMatches.forEach((str, index) => {
                  const cleanStr = str.slice(1, -1); // 移除引号
                  obj[prefix + cleanKey + (index > 0 ? `_${index}` : '')] = cleanStr;
                });
              }
            }
          }
        });
      }
      
      // 解析直接的键值对
      const directPairs = objContent.match(/'([^']+)':\s*'([^']+)'/g);
      if (directPairs) {
        directPairs.forEach(pair => {
          const match = pair.match(/'([^']+)':\s*'([^']+)'/);
          if (match) {
            obj[prefix + match[1]] = match[2];
          }
        });
      }
      
      return obj;
    }
    
    return parseObject(topLevelContent);
  }
  
  return {};
}

// 解析中英文翻译键
const zhKeys = parseTranslationKeys(zhContent);
const enKeys = parseTranslationKeys(enContent);

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
  chineseInEn: []
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
  
  // 检查中文环境下是否有英文
  if (hasZh && hasEn && /[\x00-\x7F]/.test(zhValue) && !/[\u4e00-\u9fff]/.test(zhValue) && zhValue.length > 2) {
    // 如果中文值主要是ASCII字符且长度大于2，可能是英文
    issues.englishInZh.push({ key, zhValue, enValue });
  }
  
  // 检查英文环境下是否有中文
  if (hasZh && hasEn && /[\u4e00-\u9fff]/.test(enValue)) {
    issues.chineseInEn.push({ key, zhValue, enValue });
  }
});

// 输出问题
console.log('\n❌ 缺失的翻译键：');

if (issues.missingInZh.length > 0) {
  console.log(`\n🇨🇳 中文缺失 (${issues.missingInZh.length}个)：`);
  issues.missingInZh.forEach(({ key, enValue }) => {
    console.log(`  ❌ ${key}: "${enValue}" (英文存在，中文缺失)`);
  });
}

if (issues.missingInEn.length > 0) {
  console.log(`\n🇺🇸 英文缺失 (${issues.missingInEn.length}个)：`);
  issues.missingInEn.forEach(({ key, zhValue }) => {
    console.log(`  ❌ ${key}: "${zhValue}" (中文存在，英文缺失)`);
  });
}

if (issues.emptyInZh.length > 0) {
  console.log(`\n🇨🇳 中文空值 (${issues.emptyInZh.length}个)：`);
  issues.emptyInZh.forEach(({ key, enValue }) => {
    console.log(`  ⚠️  ${key}: "" (中文为空，英文: "${enValue}")`);
  });
}

if (issues.emptyInEn.length > 0) {
  console.log(`\n🇺🇸 英文空值 (${issues.emptyInEn.length}个)：`);
  issues.emptyInEn.forEach(({ key, zhValue }) => {
    console.log(`  ⚠️  ${key}: "" (英文为空，中文: "${zhValue}")`);
  });
}

if (issues.englishInZh.length > 0) {
  console.log(`\n🇨🇳 中文环境中的英文 (${issues.englishInZh.length}个)：`);
  issues.englishInZh.forEach(({ key, zhValue, enValue }) => {
    console.log(`  ⚠️  ${key}: "${zhValue}" (可能是英文，应该翻译)`);
    console.log(`     建议翻译: "${enValue}"`);
  });
}

if (issues.chineseInEn.length > 0) {
  console.log(`\n🇺🇸 英文环境中的中文 (${issues.chineseInEn.length}个)：`);
  issues.chineseInEn.forEach(({ key, zhValue, enValue }) => {
    console.log(`  ⚠️  ${key}: "${enValue}" (包含中文，应该是英文)`);
    console.log(`     建议翻译: "${zhValue}"`);
  });
}

// 检查分类键的特殊情况
console.log('\n🏷️ 分类键特殊检查：');

// 检查categories对象
const zhCategoriesMatch = zhContent.match(/categories:\s*{([^}]+)}/s);
const enCategoriesMatch = enContent.match(/categories:\s*{([^}]+)}/s);

if (zhCategoriesMatch && enCategoriesMatch) {
  const zhCategories = {};
  const enCategories = {};
  
  // 解析中文分类
  zhCategoriesMatch[1].split('\n').forEach(line => {
    const match = line.match(/'([^']+)':\s*'([^']+)'/);
    if (match) {
      zhCategories[match[1]] = match[2];
    }
  });
  
  // 解析英文分类
  enCategoriesMatch[1].split('\n').forEach(line => {
    const match = line.match(/'([^']+)':\s*'([^']+)'/);
    if (match) {
      enCategories[match[1]] = match[2];
    }
  });
  
  const allCategoryKeys = new Set([...Object.keys(zhCategories), ...Object.keys(enCategories)]);
  
  console.log(`\n📋 分类键检查 (${allCategoryKeys.size}个)：`);
  
  allCategoryKeys.forEach(key => {
    const zhCat = zhCategories[key];
    const enCat = enCategories[key];
    
    const hasZh = zhCat !== undefined;
    const hasEn = enCat !== undefined;
    
    if (!hasZh && hasEn) {
      console.log(`  ❌ ${key}: 中文缺失 ("${enCat}")`);
    } else if (hasZh && !hasEn) {
      console.log(`  ❌ ${key}: 英文缺失 ("${zhCat}")`);
    } else if (hasZh && hasEn) {
      console.log(`  ✅ ${key}: "${zhCat}" / "${enCat}"`);
    }
  });
}

// 生成修复建议
console.log('\n🔧 修复建议：');

const totalIssues = issues.missingInZh.length + issues.missingInEn.length + 
                   issues.emptyInZh.length + issues.emptyInEn.length + 
                   issues.englishInZh.length + issues.chineseInEn.length;

if (totalIssues === 0) {
  console.log('🎉 所有翻译键都完整且一致！');
} else {
  console.log(`发现 ${totalIssues} 个问题需要修复：`);
  
  if (issues.missingInZh.length > 0) {
    console.log(`1. 补充 ${issues.missingInZh.length} 个缺失的中文翻译`);
  }
  if (issues.missingInEn.length > 0) {
    console.log(`2. 补充 ${issues.missingInEn.length} 个缺失的英文翻译`);
  }
  if (issues.emptyInZh.length > 0) {
    console.log(`3. 修复 ${issues.emptyInZh.length} 个中文空值`);
  }
  if (issues.emptyInEn.length > 0) {
    console.log(`4. 修复 ${issues.emptyInEn.length} 个英文空值`);
  }
  if (issues.englishInZh.length > 0) {
    console.log(`5. 翻译 ${issues.englishInZh.length} 个中文环境中的英文`);
  }
  if (issues.chineseInEn.length > 0) {
    console.log(`6. 翻译 ${issues.chineseInEn.length} 个英文环境中的中文`);
  }
}

// 生成统计报告
console.log('\n📊 统计报告：');
console.log(`总键数: ${allKeys.size}`);
console.log(`中文键数: ${Object.keys(zhKeys).length}`);
console.log(`英文键数: ${Object.keys(enKeys).length}`);
console.log(`问题总数: ${totalIssues}`);
console.log(`问题率: ${((totalIssues / allKeys.size) * 100).toFixed(1)}%`);

if (totalIssues === 0) {
  console.log('\n🎯 结论：书籍详情页的翻译键完全一致，没有遗漏或错误！');
} else {
  console.log(`\n⚠️  结论：发现 ${totalIssues} 个问题需要修复，建议优先处理缺失的翻译键。`);
}

console.log('\n🚀 检查完成！');
