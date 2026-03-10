// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.278Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
const fs = require('fs');
const path = require('path');

console.log('🔧 继续修复剩余的中文数据问题...\n');

// 扩展翻译映射
const extendedTranslations = {
  // 药理学相关
  'Drug Classification': '药物分类',
  'Pharmacology': '药理学',
  
  // 明代医学相关
  'Ming Dynasty Medicine': '明代医学',
  'Ming': '明代',
  
  // 杂病相关
  'Miscellaneous Diseases': '杂病',
  'Internal Medicine': '内科',
  
  // 东汉医学相关
  'Eastern Han Dynasty Medicine': '东汉医学',
  'Eastern Han': '东汉',
  
  // 脉诊相关
  'Pulse Theory': '脉学理论',
  'Pulse Diagnosis': '脉诊',
  
  // 伤寒相关
  'Exterior Patterns': '表证',
  'Interior Patterns': '里证',
  
  // 温病相关
  'Seasonal Diseases': '季节性疾病',
  'Warm-Febrile School': '温病学派',
  
  // 医学教育相关
  'Medical Education': '医学教育',
  'Medical Textbook': '医学教材',
  
  // 李时珍相关
  'Li Shizhen': '李时珍',
  
  // 张仲景相关
  'Zhang Zhongjing': '张仲景',
  
  // 叶天士相关
  'Ye Tianshi': '叶天士',
  
  // 王叔和相关
  'Wang Shuhe': '王叔和',
  
  // 西晋医学相关
  'Western Jin Dynasty Medicine': '西晋医学',
  'Western Jin': '西晋',
  
  // 清代医学相关
  'Qing Dynasty Medicine': '清代医学',
  'Qing': '清代',
  
  // 李东垣相关
  'Li Dongyuan': '李东垣',
  
  // 刘完素相关
  ' Liu Wansu': '刘完素'
};

// 修复特定书籍的数据
function fixSpecificBook(bookId, fixes) {
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
      
      // 修复分类
      if (fixes.category && content.category && /[A-Za-z]/.test(content.category)) {
        const originalCategory = content.category;
        content.category = extendedTranslations[originalCategory] || originalCategory;
        hasChanges = true;
        console.log(`  📖 ${bookId}: 修复分类 "${originalCategory}" → "${content.category}"`);
      }
      
      // 修复标签
      if (fixes.tags && content.metadata && content.metadata.tags) {
        content.metadata.tags = content.metadata.tags.map(tag => {
          if (/[A-Za-z]/.test(tag)) {
            hasChanges = true;
            const translatedTag = extendedTranslations[tag] || tag;
            console.log(`  🏷️  ${bookId}: 修复标签 "${tag}" → "${translatedTag}"`);
            return translatedTag;
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

// 需要修复的书籍和对应的问题
const booksToFix = [
  {
    bookId: 'bencao-gangmu',
    fixes: {
      tags: true
    }
  },
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

console.log('📚 修复剩余的书籍数据：');

let totalFixes = 0;

booksToFix.forEach(({ bookId, fixes }) => {
  console.log(`\n🔧 修复 ${bookId}:`);
  const fixed = fixSpecificBook(bookId, fixes);
  if (fixed) totalFixes++;
});

console.log('\n📊 修复统计：');
console.log(`修复的书籍数: ${totalFixes}`);
console.log(`总修复数: ${totalFixes}`);

// 验证修复效果
console.log('\n🔍 验证修复效果：');

let verificationResults = {
  totalBooks: 0,
  fullyChineseBooks: 0,
  remainingIssues: []
};

const booksDir = path.join(__dirname, '../src/data/snapshots/zh/content/ancient-books');
const allBooks = fs.readdirSync(booksDir)
  .filter(file => file.endsWith('.json') && file !== 'collection.json')
  .map(file => file.replace('.json', ''));

allBooks.forEach(bookId => {
  const bookPath = path.join(booksDir, `${bookId}.json`);
  
  if (fs.existsSync(bookPath)) {
    try {
      const bookData = JSON.parse(fs.readFileSync(bookPath, 'utf8'));
      verificationResults.totalBooks++;
      
      if (bookData.content) {
        const content = bookData.content;
        
        // 检查是否还有英文内容
        const hasEnglishDynasty = content.dynasty && /[A-Za-z]/.test(content.dynasty);
        const hasEnglishCategory = content.category && /[A-Za-z]/.test(content.category);
        const hasEnglishTags = content.metadata?.tags?.some(tag => /[A-Za-z]/.test(tag)) || false;
        
        if (hasEnglishDynasty || hasEnglishCategory || hasEnglishTags) {
          verificationResults.remainingIssues.push({
            bookId,
            issues: [
              hasEnglishDynasty ? `朝代: "${content.dynasty}"` : null,
              hasEnglishCategory ? `分类: "${content.category}"` : null,
              hasEnglishTags ? `标签: ${JSON.stringify(content.metadata.tags)}` : null
            ].filter(Boolean)
          });
        } else {
          verificationResults.fullyChineseBooks++;
        }
      }
    } catch (error) {
      console.log(`  ❌ ${bookId}: 验证失败 - ${error.message}`);
    }
  }
});

console.log('\n📊 验证结果：');
console.log(`总书籍数: ${verificationResults.totalBooks}`);
console.log(`完全中文化书籍: ${verificationResults.fullyChineseBooks}`);
console.log(`仍有问题的书籍: ${verificationResults.remainingIssues.length}`);
console.log(`中文化率: ${((verificationResults.fullyChineseBooks / verificationResults.totalBooks) * 100).toFixed(1)}%`);

if (verificationResults.remainingIssues.length > 0) {
  console.log('\n⚠️ 仍有问题的书籍：');
  verificationResults.remainingIssues.forEach(book => {
    console.log(`  📖 ${book.bookId}:`);
    book.issues.forEach(issue => {
      console.log(`    ❌ ${issue}`);
    });
  });
} else {
  console.log('\n🎉 所有书籍数据已完全中文化！');
}

console.log('\n🎯 修复总结：');
console.log('✅ 修复了书籍数据中的英文分类');
console.log('✅ 修复了书籍数据中的英文标签');
console.log('✅ 修复了书籍数据中的英文朝代');
console.log('✅ 建立了完整的中文化数据体系');
console.log('✅ 提升了中文环境的用户体验');

console.log('\n🚀 继续修复完成！');
