// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.374Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
const fs = require('fs');
const path = require('path');

console.log('🔍 简单检查中文locale下的tab内容...\n');

// 检查特定书籍的章节内容
function checkBookTabs(bookId, bookName) {
  const chapterPath = path.join(__dirname, '../src/data/snapshots/zh/content/ancient-books', bookId, 'chapters');
  
  if (!fs.existsSync(chapterPath)) {
    console.log(`  ❌ ${bookName}: 章节目录不存在`);
    return;
  }
  
  const chapterFiles = fs.readdirSync(chapterPath).filter(file => file.endsWith('.json'));
  console.log(`\n📖 ${bookName} (${chapterFiles.length}个章节):`);
  
  let hasChineseTranslation = false;
  let hasChineseInterpretation = false;
  let hasChineseOriginal = false;
  let totalSections = 0;
  let chineseTranslationSections = 0;
  let chineseInterpretationSections = 0;
  let chineseOriginalSections = 0;
  
  chapterFiles.forEach(chapterFile => {
    try {
      const chapterPath = path.join(chapterPath, chapterFile);
      const chapterData = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));
      
      if (chapterData.sections) {
        chapterData.sections.forEach((section, index) => {
          totalSections++;
          
          // 检查白话译文 (translation字段)
          if (section.translation) {
            hasChineseTranslation = true;
            if (/[\u4e00-\u9fff]/.test(section.translation)) {
              chineseTranslationSections++;
            }
          }
          
          // 检查现代解读 (interpretation字段)
          if (section.interpretation) {
            hasChineseInterpretation = true;
            if (/[\u4e00-\u9fff]/.test(section.interpretation)) {
              chineseInterpretationSections++;
            }
          }
          
          // 检查古籍原文 (originalText字段)
          if (section.originalText) {
            hasChineseOriginal = true;
            if (/[\u4e00-\u9fff]/.test(section.originalText)) {
              chineseOriginalSections++;
            }
          }
          
          // 显示前3个section的详细信息
          if (index < 3) {
            console.log(`    📄 第${index + 1}节:`);
            if (section.translation) {
              const isChinese = /[\u4e00-\u9fff]/.test(section.translation);
              console.log(`      白话译文: ${isChinese ? '✅ 中文' : '❌ 英文'} - "${section.translation.substring(0, 50)}${section.translation.length > 50 ? '...' : ''}"`);
            } else {
              console.log(`      白话译文: ❌ 缺失`);
            }
            
            if (section.interpretation) {
              const isChinese2 = /[\u4e00-\u9fff]/.test(section.interpretation);
              console.log(`      现代解读: ${isChinese2 ? '✅ 中文' : '❌ 英文'} - "${section.interpretation.substring(0, 50)}${section.interpretation.length > 50 ? '...' : ''}"`);
            } else {
              console.log(`      现代解读: ❌ 缺失`);
            }
            
            if (section.originalText) {
              const isChinese3 = /[\u4e00-\u9fff]/.test(section.originalText);
              console.log(`      古籍原文: ${isChinese3 ? '✅ 中文' : '❌ 英文'} - "${section.originalText.substring(0, 50)}${section.originalText.length > 50 ? '...' : ''}"`);
            } else {
              console.log(`      古籍原文: ❌ 缺失`);
            }
          }
        });
      }
    } catch (error) {
      console.log(`  ❌ ${chapterFile}: 读取失败 - ${error.message}`);
    }
  });
  
  // 显示统计
  console.log(`\n📊 ${bookName} 统计:`);
  console.log(`  总节数: ${totalSections}`);
  console.log(`  有白话译文: ${hasChineseTranslation ? '是' : '否'}`);
  if (hasChineseTranslation) {
    console.log(`  中文译文节数: ${chineseTranslationSections}/${totalSections} (${((chineseTranslationSections / totalSections) * 100).toFixed(1)}%)`);
  }
  
  console.log(`  有现代解读: ${hasChineseInterpretation ? '是' : '否'}`);
  if (hasChineseInterpretation) {
    console.log(`  中文解读节数: ${chineseInterpretationSections}/${totalSections} (${((chineseInterpretationSections / totalSections) * 100).toFixed(1)}%)`);
  }
  
  console.log(`  有古籍原文: ${hasChineseOriginal ? '是' : '否'}`);
  if (hasChineseOriginal) {
    console.log(`  中文原文节数: ${chineseOriginalSections}/${totalSections} (${((chineseOriginalSections / totalSections) * 100).toFixed(1)}%)`);
  }
  
  return {
    totalSections,
    hasChineseTranslation,
    chineseTranslationRate: hasChineseTranslation ? (chineseTranslationSections / totalSections) * 100 : 0,
    hasChineseInterpretation,
    chineseInterpretationRate: hasChineseInterpretation ? (chineseInterpretationSections / totalSections) * 100 : 0,
    hasChineseOriginal,
    chineseOriginalRate: hasChineseOriginal ? (chineseOriginalSections / totalSections) * 100 : 0
  };
}

// 检查主要书籍
console.log('📚 检查主要书籍的tab内容：');

const books = [
  { id: 'jiayi-jing', name: '甲乙经' },
  { id: 'huangdi-neijing', name: '黄帝内经' },
  { id: 'shanghan-lun', name: '伤寒论' },
  { id: 'bencao-gangmu', name: '本草纲目' }
];

let totalStats = {
  totalBooks: books.length,
  totalSections: 0,
  booksWithChineseTranslation: 0,
  booksWithChineseInterpretation: 0,
  booksWithChineseOriginal: 0,
  avgTranslationRate: 0,
  avgInterpretationRate: 0,
  avgOriginalRate: 0
};

books.forEach(book => {
  const stats = checkBookTabs(book.id, book.name);
  totalStats.totalSections += stats.totalSections;
  
  if (stats.hasChineseTranslation) totalStats.booksWithChineseTranslation++;
  if (stats.hasChineseInterpretation) totalStats.booksWithChineseInterpretation++;
  if (stats.hasChineseOriginal) totalStats.booksWithChineseOriginal++;
  
  totalStats.avgTranslationRate += stats.chineseTranslationRate;
  totalStats.avgInterpretationRate += stats.chineseInterpretationRate;
  totalStats.avgOriginalRate += stats.chineseOriginalRate;
});

// 计算平均值
totalStats.avgTranslationRate = totalStats.avgTranslationRate / books.length;
totalStats.avgInterpretationRate = totalStats.avgInterpretationRate / books.length;
totalStats.avgOriginalRate = totalStats.avgOriginalRate / books.length;

// 生成总结报告
console.log('\n📋 总体统计报告：');
console.log(`总书籍数: ${totalStats.totalBooks}`);
console.log(`总节数: ${totalStats.totalSections}`);
console.log(`有白话译文的书籍: ${totalStats.booksWithChineseTranslation}/${totalStats.totalBooks}`);
console.log(`有现代解读的书籍: ${totalStats.booksWithChineseInterpretation}/${totalStats.totalBooks}`);
console.log(`有古籍原文的书籍: ${totalStats.booksWithChineseOriginal}/${totalStats.totalBooks}`);

console.log('\n📈 内容质量统计：');
console.log(`平均白话译文中文率: ${totalStats.avgTranslationRate.toFixed(1)}%`);
console.log(`平均现代解读中文率: ${totalStats.avgInterpretationRate.toFixed(1)}%`);
console.log(`平均古籍原文中文率: ${totalStats.avgOriginalRate.toFixed(1)}%`);

// 生成结论
console.log('\n🎯 检查结论：');

const overallQuality = (totalStats.avgTranslationRate + totalStats.avgInterpretationRate + totalStats.avgOriginalRate) / 3;

if (overallQuality >= 95) {
  console.log('🎉 中文tab内容质量优秀，所有内容都是中文');
} else if (overallQuality >= 85) {
  console.log('👍 中文tab内容质量良好，大部分内容是中文');
} else if (overallQuality >= 70) {
  console.log('⚠️  中文tab内容质量一般，需要改进');
} else {
  console.log('❌ 中文tab内容质量较差，需要大量修复');
}

console.log('\n🔧 修复建议：');
if (totalStats.avgTranslationRate < 95) {
  console.log('1. 补充缺失的白话译文内容');
}
if (totalStats.avgInterpretationRate < 95) {
  console.log('2. 补充缺失的现代解读内容');
}
if (totalStats.avgOriginalRate < 95) {
  console.log('3. 检查并修复古籍原文内容');
}

console.log('\n🚀 检查完成！');
