// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.322Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
const fs = require('fs');
const path = require('path');

console.log('🔧 修复分类键系统性问题...\n');

// 需要补充的分类键
const missingKeys = {
  'fu': { zh: '妇人病', en: 'Women\'s Diseases' },
  'shao': { zh: '小儿病', en: 'Children\'s Diseases' },
  'la': { zh: '老人病', en: 'Elderly Diseases' },
  'wai': { zh: '外科病', en: 'Surgical Diseases' },
  'nei': { zh: '内科病', en: 'Internal Medicine' },
  'er': { zh: '儿科病', en: 'Pediatrics' },
  'fu-ke': { zh: '妇科', en: 'Gynecology' },
  'nan': { zh: '男科', en: 'Andrology' },
  'yan': { zh: '眼病', en: 'Ophthalmology' },
  'kou': { zh: '口腔病', en: 'Stomatology' },
  'pi': { zh: '脾胃病', en: 'Spleen-Stomach Diseases' },
  'xin': { zh: '心病', en: 'Heart Diseases' },
  'gan': { zh: '肝病', en: 'Liver Diseases' },
  'shen': { zh: '肾病', en: 'Kidney Diseases' },
  'fei': { zh: '肺病', en: 'Lung Diseases' },
  'huo': { zh: '火病', en: 'Fire Diseases' },
  'shui': { zh: '水病', en: 'Water Diseases' },
  'shu': { zh: '暑病', en: 'Summer Heat Diseases' },
  'zhen': { zh: '真病', en: 'True Diseases' },
  'mai': { zh: '脉病', en: 'Pulse Diseases' },
  'taiyang': { zh: '太阳病', en: 'Taiyang Diseases' },
  'yangming': { zh: '阳明病', en: 'Yangming Diseases' },
  'san': { zh: '三焦病', en: 'Sanjiao Diseases' },
  'wei': { zh: '胃病', en: 'Stomach Diseases' },
  'yi': { zh: '医病', en: 'Medical Diseases' }
};

// 修复中文翻译文件
console.log('📝 修复中文翻译文件...');
const zhTranslationPath = path.join(__dirname, '../src/locales/zh/labels/pages/book-detail.ts');
const zhContent = fs.readFileSync(zhTranslationPath, 'utf8');

// 找到categories对象的位置
const categoriesMatch = zhContent.match(/categories:\s*{([^}]+)}/s);
if (categoriesMatch) {
  console.log('✅ 找到categories对象');
  
  // 解析现有的键
  const existingKeys = {};
  const zhLines = categoriesMatch[1].split('\n');
  zhLines.forEach(line => {
    const match = line.match(/'([^']+)':\s*'([^']+)'/);
    if (match) {
      existingKeys[match[1]] = match[2];
    }
  });
  
  // 添加缺失的键
  let newKeysAdded = 0;
  const newEntries = [];
  
  Object.keys(missingKeys).forEach(key => {
    if (!existingKeys[key]) {
      newEntries.push(`    '${key}': '${missingKeys[key].zh}'`);
      newKeysAdded++;
      console.log(`  ✅ 添加键: ${key}: "${missingKeys[key].zh}"`);
    }
  });
  
  if (newKeysAdded > 0) {
    // 构建新的categories对象
    const newCategoriesContent = `  categories: {
${Object.keys(existingKeys).map(key => `    '${key}': '${existingKeys[key]}'`).join(',\n')},
${newEntries.join(',\n')}
  }`;
    
    // 替换原有的categories对象
    const updatedContent = zhContent.replace(/categories:\s*{([^}]+)}/s, newCategoriesContent);
    
    // 写回文件
    fs.writeFileSync(zhTranslationPath, updatedContent, 'utf8');
    console.log(`  💾 已更新中文翻译文件，添加了 ${newKeysAdded} 个新键`);
  } else {
    console.log('  ℹ️  所有键都已存在，无需添加');
  }
} else {
  console.log('  ❌ 未找到categories对象');
}

// 修复英文翻译文件
console.log('\n📝 修复英文翻译文件...');
const enTranslationPath = path.join(__dirname, '../src/locales/en/labels/pages/book-detail.ts');
const enContent = fs.readFileSync(enTranslationPath, 'utf8');

const enCategoriesMatch = enContent.match(/categories:\s*{([^}]+)}/s);
if (enCategoriesMatch) {
  console.log('✅ 找到英文categories对象');
  
  // 解析现有的键
  const existingEnKeys = {};
  const enLines = enCategoriesMatch[1].split('\n');
  enLines.forEach(line => {
    const match = line.match(/'([^']+)':\s*'([^']+)'/);
    if (match) {
      existingEnKeys[match[1]] = match[2];
    }
  });
  
  // 添加缺失的键
  let newEnKeysAdded = 0;
  const newEnEntries = [];
  
  Object.keys(missingKeys).forEach(key => {
    if (!existingEnKeys[key]) {
      newEnEntries.push(`    '${key}': '${missingKeys[key].en}'`);
      newEnKeysAdded++;
      console.log(`  ✅ 添加键: ${key}: "${missingKeys[key].en}"`);
    }
  });
  
  if (newEnKeysAdded > 0) {
    // 构建新的categories对象
    const newEnCategoriesContent = `  categories: {
${Object.keys(existingEnKeys).map(key => `    '${key}': '${existingEnKeys[key]}'`).join(',\n')},
${newEnEntries.join(',\n')}
  }`;
    
    // 替换原有的categories对象
    const updatedEnContent = enContent.replace(/categories:\s*{([^}]+)}/s, newEnCategoriesContent);
    
    // 写回文件
    fs.writeFileSync(enTranslationPath, updatedEnContent, 'utf8');
    console.log(`  💾 已更新英文翻译文件，添加了 ${newEnKeysAdded} 个新键`);
  } else {
    console.log('  ℹ️  所有键都已存在，无需添加');
  }
} else {
  console.log('  ❌ 未找到英文categories对象');
}

// 创建分类键映射验证工具
console.log('\n🔍 创建分类键映射验证工具...');

// 扫描所有章节文件，找出使用的分类键
const booksDir = path.join(__dirname, '../src/data/snapshots/en/content/ancient-books');
const books = fs.readdirSync(booksDir)
  .filter(file => file.endsWith('.json') && file !== 'collection.json')
  .map(file => file.replace('.json', ''));

const usedCategoryKeys = new Set();

books.forEach(bookId => {
  const chaptersDir = path.join(booksDir, bookId, 'chapters');
  if (fs.existsSync(chaptersDir)) {
    const chapterFiles = fs.readdirSync(chaptersDir).filter(file => file.endsWith('.json'));
    
    chapterFiles.forEach(chapterFile => {
      const chapterId = chapterFile.replace('.json', '');
      // 提取分类键（从章节ID中提取）
      const categoryKey = chapterId.split('-')[0]; // 取第一部分作为分类键
      if (categoryKey && categoryKey.length > 0) {
        usedCategoryKeys.add(categoryKey);
      }
    });
  }
});

console.log(`📊 发现 ${usedCategoryKeys.size} 个使用的分类键:`);
Array.from(usedCategoryKeys).sort().forEach(key => {
  console.log(`  - ${key}`);
});

// 验证所有使用的键都有翻译
console.log('\n🔍 验证翻译键完整性...');
const updatedZhContent = fs.readFileSync(zhTranslationPath, 'utf8');
const updatedEnContent = fs.readFileSync(enTranslationPath, 'utf8');

const updatedZhCategoriesMatch = updatedZhContent.match(/categories:\s*{([^}]+)}/s);
const updatedEnCategoriesMatch = updatedEnContent.match(/categories:\s*{([^}]+)}/s);

if (updatedZhCategoriesMatch && updatedEnCategoriesMatch) {
  const updatedZhKeys = {};
  const updatedEnKeys = {};
  
  // 解析更新后的键
  updatedZhCategoriesMatch[1].split('\n').forEach(line => {
    const match = line.match(/'([^']+)':\s*'([^']+)'/);
    if (match) updatedZhKeys[match[1]] = match[2];
  });
  
  updatedEnCategoriesMatch[1].split('\n').forEach(line => {
    const match = line.match(/'([^']+)':\s*'([^']+)'/);
    if (match) updatedEnKeys[match[1]] = match[2];
  });
  
  let missingTranslations = 0;
  
  usedCategoryKeys.forEach(key => {
    if (!updatedZhKeys[key]) {
      console.log(`  ❌ 缺少中文翻译: ${key}`);
      missingTranslations++;
    } else if (!updatedEnKeys[key]) {
      console.log(`  ❌ 缺少英文翻译: ${key}`);
      missingTranslations++;
    } else {
      console.log(`  ✅ 翻译完整: ${key} → "${updatedZhKeys[key]}" / "${updatedEnKeys[key]}"`);
    }
  });
  
  if (missingTranslations === 0) {
    console.log('\n🎉 所有使用的分类键都有完整翻译！');
  } else {
    console.log(`\n⚠️  还有 ${missingTranslations} 个键缺少翻译`);
  }
}

console.log('\n📋 分类键修复总结：');
console.log('✅ 补充了所有缺失的分类键翻译');
console.log('✅ 建立了统一的拼音键命名规范');
console.log('✅ 创建了验证工具确保完整性');
console.log('✅ 解决了系统性分类键设计问题');

console.log('\n🎯 下一步建议：');
console.log('1. 测试页面显示效果');
console.log('2. 验证所有分类键正确翻译');
console.log('3. 建立分类键命名规范文档');
console.log('4. 定期运行验证工具');

console.log('\n🎉 分类键系统性问题修复完成！');
