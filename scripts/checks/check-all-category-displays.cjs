// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.303Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
const fs = require('fs');
const path = require('path');

console.log('🔍 系统性检查所有详情页面的分类显示问题...\n');

// 模拟翻译函数
function mockTranslate(key, locale = 'zh') {
  const translationPath = locale === 'zh' 
    ? path.join(__dirname, '../src/locales/zh/labels/pages/book-detail.ts')
    : path.join(__dirname, '../src/locales/en/labels/pages/book-detail.ts');
  
  const content = fs.readFileSync(translationPath, 'utf8');
  
  const categoriesMatch = content.match(/categories:\s*{([^}]+)}/s);
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

// 扫描所有书籍数据，找出所有使用的分类
console.log('📊 扫描所有书籍数据中的分类使用情况...\n');

const booksDir = path.join(__dirname, '../src/data/snapshots/zh/content/ancient-books');
const books = fs.readdirSync(booksDir)
  .filter(file => file.endsWith('.json') && file !== 'collection.json')
  .map(file => file.replace('.json', ''));

console.log(`📚 发现 ${books.length} 个书籍文件`);

// 收集所有使用的分类
const allCategories = new Set();
const categoryUsage = {};

books.forEach(bookId => {
  try {
    const bookPath = path.join(booksDir, `${bookId}.json`);
    const bookData = JSON.parse(fs.readFileSync(bookPath, 'utf8'));
    
    // 检查主文件的category字段
    if (bookData.content && bookData.content.category) {
      const category = bookData.content.category;
      allCategories.add(category);
      
      if (!categoryUsage[category]) {
        categoryUsage[category] = [];
      }
      categoryUsage[category].push({
        bookId,
        location: '主文件content.category',
        value: category
      });
    }
    
    // 检查章节文件的分类
    const chaptersDir = path.join(__dirname, '../src/data/snapshots/en/content/ancient-books', bookId, 'chapters');
    if (fs.existsSync(chaptersDir)) {
      const chapterFiles = fs.readdirSync(chaptersDir).filter(file => file.endsWith('.json'));
      
      chapterFiles.forEach(chapterFile => {
        const chapterId = chapterFile.replace('.json', '');
        const chapterPath = path.join(chaptersDir, chapterFile);
        
        try {
          const chapterData = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));
          
          // 检查章节中的分类相关字段
          if (chapterData.category) {
            const category = chapterData.category;
            allCategories.add(category);
            
            if (!categoryUsage[category]) {
              categoryUsage[category] = [];
            }
            categoryUsage[category].push({
              bookId,
              location: `章节文件${chapterId}.category`,
              value: category
            });
          }
          
          // 检查sections中的分类相关字段
          if (chapterData.sections) {
            chapterData.sections.forEach((section, index) => {
              if (section.category) {
                const category = section.category;
                allCategories.add(category);
                
                if (!categoryUsage[category]) {
                  categoryUsage[category] = [];
                }
                categoryUsage[category].push({
                  bookId,
                  location: `章节文件${chapterId}.sections[${index}].category`,
                  value: category
                });
              }
            });
          }
        } catch (error) {
          console.log(`  ⚠️  读取章节 ${chapterId} 失败: ${error.message}`);
        }
      });
    }
  } catch (error) {
    console.log(`  ❌ 读取书籍 ${bookId} 失败: ${error.message}`);
  }
});

console.log(`📈 发现 ${allCategories.size} 个不同的分类键:`);
Array.from(allCategories).sort().forEach(category => {
  console.log(`  - ${category}`);
});

// 检查每个分类的翻译状态
console.log('\n🔍 检查每个分类的翻译状态：');

const translationIssues = [];

Array.from(allCategories).sort().forEach(category => {
  const zhTranslation = mockTranslate(category, 'zh');
  const enTranslation = mockTranslate(category, 'en');
  
  const zhHasTranslation = zhTranslation !== category;
  const enHasTranslation = enTranslation !== category;
  
  const status = zhHasTranslation && enHasTranslation ? '✅' : '❌';
  
  console.log(`  ${status} ${category}`);
  console.log(`    中文: "${zhTranslation}" ${zhHasTranslation ? '✅' : '❌'}`);
  console.log(`    英文: "${enTranslation}" ${enHasTranslation ? '✅' : '❌'}`);
  
  if (!zhHasTranslation || !enHasTranslation) {
    translationIssues.push({
      category,
      zhIssue: !zhHasTranslation,
      enIssue: !enHasTranslation,
      usage: categoryUsage[category]
    });
  }
  
  console.log(`    使用次数: ${categoryUsage[category].length}`);
  console.log(`    使用位置: ${categoryUsage[category].map(u => u.location).join(', ')}`);
  console.log('');
});

// 汇总问题
console.log('📋 翻译问题汇总:');
if (translationIssues.length === 0) {
  console.log('🎉 所有分类都有完整的中英文翻译！');
} else {
  console.log(`⚠️  发现 ${translationIssues.length} 个分类存在翻译问题:`);
  
  translationIssues.forEach(issue => {
    console.log(`\n📖 ${issue.category}:`);
    if (issue.zhIssue) {
      console.log(`  ❌ 缺少中文翻译`);
    }
    if (issue.enIssue) {
      console.log(`  ❌ 缺少英文翻译`);
    }
    console.log(`  📍 使用位置: ${issue.usage.map(u => `${u.bookId}:${u.location}`).join(', ')}`);
    console.log(`  📝 需要补充的翻译键: ${issue.category}`);
  });
}

// 生成修复建议
console.log('\n🔧 修复建议:');
if (translationIssues.length > 0) {
  console.log('1. 补充缺失的翻译键到翻译文件中');
  console.log('2. 确保中英文翻译的一致性');
  console.log('3. 建立分类键命名规范');
  console.log('4. 定期运行验证工具');
  
  console.log('\n📝 需要补充的翻译键:');
  translationIssues.forEach(issue => {
    console.log(`  - ${issue.category}: "${issue.category}"`);
    if (issue.zhIssue) console.log(`    中文建议: "${issue.category}"`);
    if (issue.enIssue) console.log(`    英文建议: "${issue.category}"`);
  });
} else {
  console.log('✅ 所有翻译键都已完整，无需修复');
}

// 检查用户特别提到的分类
console.log('\n🎯 检查用户特别提到的分类:');
const specialCategories = ['伤寒金匮', '方剂', '医经', '本草', '针灸'];

specialCategories.forEach(category => {
  const zhTranslation = mockTranslate(category, 'zh');
  const status = zhTranslation === category ? '✅' : '❌';
  
  console.log(`  ${status} ${category} → "${zhTranslation}"`);
  
  if (zhTranslation !== category) {
    console.log(`    🔧 需要添加翻译键: '${category}': '${zhTranslation}'`);
  }
});

console.log('\n📊 检查统计:');
console.log(`总分类数: ${allCategories.length}`);
console.log(`有问题的分类: ${translationIssues.length}`);
console.log(`问题率: ${((translationIssues.length / allCategories.length) * 100).toFixed(1)}%`);

if (translationIssues.length === 0) {
  console.log('\n🎉 所有分类显示问题都已解决！');
} else {
  console.log(`\n⚠️  还有 ${translationIssues.length} 个分类需要修复`);
}

console.log('\n🚀 检查完成！');
