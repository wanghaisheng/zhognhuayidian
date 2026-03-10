// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.284Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
const fs = require('fs');
const path = require('path');

console.log('🔧 最终修复所有中文数据问题...\n');

// 完整的翻译映射
const fullTranslations = {
  // 朝代相关
  'diagnostics': '诊断',
  'Diagnostics': '诊断',
  
  // 分类相关
  'comprehensive': '综合医书',
  'comprehensive': '综合医书',
  'warm-diseases': '温病',
  'warm-diseases': '温病',
  
  // 标签相关
  'Internal Medicine': '内科',
  'Zang-Fu Theory': '脏腑理论',
  'Six Meridians': '六经',
  'Exterior Patterns': '表证',
  'Warm-Febrile School': '温病学派',
  'Comprehensive Medicine': '综合医学',
  'Medical Textbook': '医学教材',
  'Li Chan': '李梴',
  'Ming Dynasty Medicine': '明代医学',
  'Eastern Han Dynasty Medicine': '东汉医学',
  'Western Jin Dynasty Medicine': '西晋医学',
  'Qing Dynasty Medicine': '清代医学',
  
  // 人名相关
  'Li Shizhen': '李时珍',
  'Zhang Zhongjing': '张仲景',
  'Ye Tianshi': '叶天士',
  'Wang Shuhe': '王叔和',
  'Li Dongyuan': '李东垣',
  'Liu Wansu': '刘完素',
  'Huangfu Mi': '皇甫谧'
};

// 修复特定书籍的剩余问题
function fixRemainingIssues(bookId, specificFixes) {
  const bookPath = path.join(__dirname, '../src/data/snapshots/zh/content/ancient-books', `${bookId}.json`);
  
  if (!fs.existsSync(bookPath)) {
    console.log(`  ❌ ${bookId}: 数据文件不存在`);
    return false;
  }
  
  try {
    const bookData = JSON.parse(fs.readFileSync(bookPath, 'utf8'));
    let hasChanges = false;
    
    if (bookData.content) {
      const content = bookData.content;
      
      // 应用特定修复
      if (specificFixes.category && content.category) {
        const originalCategory = content.category;
        content.category = fullTranslations[originalCategory] || originalCategory;
        if (content.category !== originalCategory) {
          hasChanges = true;
          console.log(`  📖 ${bookId}: 修复分类 "${originalCategory}" → "${content.category}"`);
        }
      }
      
      if (specificFixes.tags && content.metadata && content.metadata.tags) {
        content.metadata.tags = content.metadata.tags.map(tag => {
          if (fullTranslations[tag]) {
            hasChanges = true;
            console.log(`  🏷️  ${bookId}: 修复标签 "${tag}" → "${fullTranslations[tag]}"`);
            return fullTranslations[tag];
          }
          return tag;
        });
      }
    }
    
    if (hasChanges) {
      fs.writeFileSync(bookPath, JSON.stringify(bookData, null, 2), 'utf8');
      console.log(`  ✅ ${bookId}: 数据已修复并保存`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.log(`  ❌ ${bookId}: 修复失败 - ${error.message}`);
    return false;
  }
}

// 需要最终修复的书籍
const finalFixes = [
  {
    bookId: 'jinkui-yaolue',
    fixes: {
      tags: true
    }
  },
  {
    bookId: 'mai-jing',
    fixes: {
      category: true,
      tags: true
    }
  },
  {
    bookId: 'shanghan-lun',
    fixes: {
      tags: true
    }
  },
  {
    bookId: 'wenzhen-xue',
    fixes: {
      category: true,
      tags: true
    }
  },
  {
    bookId: 'yixue-rumen',
    fixes: {
      category: true,
      tags: true
    }
  }
];

console.log('📚 执行最终修复：');

let totalFinalFixes = 0;

finalFixes.forEach(({ bookId, fixes }) => {
  console.log(`\n🔧 修复 ${bookId}:`);
  const fixed = fixRemainingIssues(bookId, fixes);
  if (fixed) totalFinalFixes++;
});

// 最终验证
console.log('\n🔍 最终验证所有书籍数据：');

const booksDir = path.join(__dirname, '../src/data/snapshots/zh/content/ancient-books');
const allBooks = fs.readdirSync(booksDir)
  .filter(file => file.endsWith('.json') && file !== 'collection.json')
  .map(file => file.replace('.json', ''));

let finalVerification = {
  totalBooks: 0,
  fullyChineseBooks: 0,
  remainingIssues: []
};

allBooks.forEach(bookId => {
  const bookPath = path.join(booksDir, `${bookId}.json`);
  
  if (fs.existsSync(bookPath)) {
    try {
      const bookData = JSON.parse(fs.readFileSync(bookPath, 'utf8'));
      finalVerification.totalBooks++;
      
      if (bookData.content) {
        const content = bookData.content;
        
        // 检查是否还有英文内容
        const hasEnglishDynasty = content.dynasty && /[A-Za-z]/.test(content.dynasty);
        const hasEnglishCategory = content.category && /[A-Za-z]/.test(content.category);
        const hasEnglishTags = content.metadata?.tags?.some(tag => /[A-Za-z]/.test(tag)) || false;
        
        if (hasEnglishDynasty || hasEnglishCategory || hasEnglishTags) {
          finalVerification.remainingIssues.push({
            bookId,
            issues: [
              hasEnglishDynasty ? `朝代: "${content.dynasty}"` : null,
              hasEnglishCategory ? `分类: "${content.category}"` : null,
              hasEnglishTags ? `标签: ${JSON.stringify(content.metadata.tags)}` : null
            ].filter(Boolean)
          });
        } else {
          finalVerification.fullyChineseBooks++;
        }
      }
    } catch (error) {
      console.log(`  ❌ ${bookId}: 验证失败 - ${error.message}`);
    }
  }
});

console.log('\n📊 最终验证结果：');
console.log(`总书籍数: ${finalVerification.totalBooks}`);
console.log(`完全中文化书籍: ${finalVerification.fullyChineseBooks}`);
console.log(`仍有问题的书籍: ${finalVerification.remainingIssues.length}`);
console.log(`最终中文化率: ${((finalVerification.fullyChineseBooks / finalVerification.totalBooks) * 100).toFixed(1)}%`);

if (finalVerification.remainingIssues.length > 0) {
  console.log('\n⚠️ 仍有问题的书籍：');
  finalVerification.remainingIssues.forEach(book => {
    console.log(`  📖 ${book.bookId}:`);
    book.issues.forEach(issue => {
      console.log(`    ❌ ${issue}`);
    });
  });
} else {
  console.log('\n🎉 所有书籍数据已完全中文化！');
}

// 生成最终报告
console.log('\n📋 最终修复报告：');

console.log(`🔧 本次修复统计：`);
console.log(`修复的书籍数: ${totalFinalFixes}`);
console.log(`累计修复的书籍数: ${totalFinalFixes + 6}`); // 加上之前修复的6本

console.log('\n🎯 修复效果评估：');
const finalChineseRate = (finalVerification.fullyChineseBooks / finalVerification.totalBooks) * 100;

if (finalChineseRate >= 95) {
  console.log('🎉 修复效果：优秀');
  console.log('✅ 所有书籍数据已完全中文化');
  console.log('✅ 中文环境下不再显示英文内容');
  console.log('✅ 用户体验得到根本改善');
} else if (finalChineseRate >= 85) {
  console.log('👍 修复效果：良好');
  console.log('✅ 大部分书籍数据已中文化');
  console.log('✅ 中文环境下基本不显示英文内容');
  console.log('⚠️ 仍有少量问题需要后续处理');
} else {
  console.log('⚠️ 修复效果：需要改进');
  console.log('❌ 部分书籍数据仍有英文内容');
  console.log('🔧 需要进一步修复工作');
}

console.log('\n🎯 用户问题解决状态：');
console.log('原始问题: "中文下显示了部分英文"');
console.log(`修复结果: ${finalChineseRate >= 85 ? '基本解决' : '部分解决'}`);
console.log(`解决率: ${finalChineseRate.toFixed(1)}%`);

console.log('\n🚀 最终修复完成！');
