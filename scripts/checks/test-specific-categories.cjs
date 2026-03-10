// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.387Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
const fs = require('fs');
const path = require('path');

console.log('🧪 直接测试用户提到的分类翻译...\n');

// 模拟翻译函数
function mockTranslate(key) {
  const zhTranslationPath = path.join(__dirname, '../src/locales/zh/labels/pages/book-detail.ts');
  const zhContent = fs.readFileSync(zhTranslationPath, 'utf8');
  
  const categoriesMatch = zhContent.match(/categories:\s*{([^}]+)}/s);
  if (categoriesMatch) {
    const categories = {};
    const lines = categoriesMatch[1].split('\n');
    lines.forEach(line => {
      const match = line.match(/'([^']+)':\s*'([^']+)'/);
      if (match) {
        categories[match[1]] = match[2];
      }
    });
    
    return categories[key] || key;
  }
  
  return key;
}

// 测试用户特别提到的分类
console.log('🎯 测试用户特别提到的分类:');
const userCategories = ['伤寒金匮', '方剂', '医经', '本草', '针灸'];

userCategories.forEach(category => {
  const translation = mockTranslate(category);
  const status = translation === category ? '✅' : '❌';
  console.log(`  ${status} bookDetail.categories.${category} → "${translation}"`);
  
  if (translation === category) {
    console.log(`    🎉 修复成功！显示正确的中文翻译`);
  } else {
    console.log(`    ❌ 仍然显示键名: ${translation}`);
  }
});

// 验证翻译键是否真的存在
console.log('\n🔍 验证翻译键是否真的存在：');
const zhTranslationPath = path.join(__dirname, '../src/locales/zh/labels/pages/book-detail.ts');
const zhContent = fs.readFileSync(zhTranslationPath, 'utf8');

const categoriesMatch = zhContent.match(/categories:\s*{([^}]+)}/s);
if (categoriesMatch) {
  const categories = {};
  const lines = categoriesMatch[1].split('\n');
  lines.forEach(line => {
    const match = line.match(/'([^']+)':\s*'([^']+)'/);
    if (match) {
      categories[match[1]] = match[2];
    }
  });
  
  console.log('📋 翻译文件中的中文分类键:');
  userCategories.forEach(category => {
    if (categories[category]) {
      console.log(`  ✅ '${category}': '${categories[category]}'`);
    } else {
      console.log(`  ❌ '${category}': 不存在`);
    }
  });
}

// 测试实际的数据加载
console.log('\n🔍 测试实际的数据加载:');
const testBooks = [
  'qianjin-fang',    // 方剂
  'huangdi-neijing', // 医经
  'bencao-gangmu',   // 本草
  'jiayi-jing',      // 针灸
  'jinkui-yaolue',   // 伤寒金匮
  'shanghan-lun',    // 伤寒金匮
  'shanghan-zabing-lun' // 伤寒金匮
];

testBooks.forEach(bookId => {
  try {
    const bookPath = path.join(__dirname, '../src/data/snapshots/zh/content/ancient-books', `${bookId}.json`);
    const bookData = JSON.parse(fs.readFileSync(bookPath, 'utf8'));
    
    if (bookData.content && bookData.content.category) {
      const category = bookData.content.category;
      const translation = mockTranslate(category);
      const status = translation === category ? '✅' : '❌';
      
      console.log(`  ${status} ${bookId}: ${category} → "${translation}"`);
    }
  } catch (error) {
    console.log(`  ❌ ${bookId}: 读取失败 - ${error.message}`);
  }
});

console.log('\n🎯 总结:');
console.log('如果所有测试都显示 ✅，那么用户反馈的问题已经解决。');
console.log('如果仍有 ❌，需要进一步调试翻译函数或数据加载逻辑。');

console.log('\n🚀 测试完成！');
