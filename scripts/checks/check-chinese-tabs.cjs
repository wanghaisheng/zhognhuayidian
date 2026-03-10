// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.312Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
const fs = require('fs');
const path = require('path');

console.log('🔍 检查中文locale下的tab内容...\n');

// 检查书籍详情页的tab内容
function checkTabContent(bookId, tabName) {
  const chapterPath = path.join(__dirname, '../src/data/snapshots/zh/content/ancient-books', bookId, 'chapters');
  
  if (!fs.existsSync(chapterPath)) {
    console.log(`  ❌ ${bookId}: 章节目录不存在`);
    return { hasChinese: false, hasIssues: true, details: '章节目录不存在' };
  }
  
  const chapterFiles = fs.readdirSync(chapterPath).filter(file => file.endsWith('.json'));
  let hasChineseContent = false;
  let issues = [];
  
  chapterFiles.forEach(chapterFile => {
    const filePath = path.join(chapterPath, chapterFile);
    try {
      const chapterData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      if (chapterData.sections) {
        chapterData.sections.forEach(section => {
          if (section.translation && /[\u4e00-\u9fff]/.test(section.translation)) {
            hasChineseContent = true;
          }
          if (section.interpretation && /[\u4e00-\u9fff]/.test(section.interpretation)) {
            hasChineseContent = true;
          }
          if (section.originalText && /[\u4e00-\u9fff]/.test(section.originalText)) {
            hasChineseContent = true;
          }
        });
      }
    } catch (error) {
      issues.push(`${chapterFile}: 解析失败 - ${error.message}`);
    }
  });
  
  return {
    hasChineseContent,
    hasIssues: issues.length > 0,
    issues,
    details: issues.length > 0 ? issues.join('; ') : '内容检查完成'
  };
}

// 检查所有书籍
const booksDir = path.join(__dirname, '../src/data/snapshots/zh/content/ancient-books');
const books = fs.readdirSync(booksDir).filter(item => {
  const itemPath = path.join(booksDir, item);
  return fs.statSync(itemPath).isDirectory();
});

console.log(`📚 检查 ${books.length} 本书籍的中文tab内容...\n`);

let overallStats = {
  totalBooks: books.length,
  booksWithChineseContent: 0,
  booksWithIssues: 0,
  totalChapters: 0,
  totalSections: 0,
  sectionsWithChineseTranslation: 0,
  sectionsWithChineseInterpretation: 0,
  sectionsWithChineseOriginal: 0,
  sectionsWithIssues: 0
};

books.forEach(bookId => {
  console.log(`\n📖 检查 ${bookId}:`);
  
  const result = checkTabContent(bookId, 'chapters');
  
  if (result.hasChineseContent) {
    overallStats.booksWithChineseContent++;
    console.log('  ✅ 包含中文内容');
  } else {
    console.log('  ❌ 缺少中文内容');
  }
  
  if (result.hasIssues) {
    overallStats.booksWithIssues++;
    console.log(`  ⚠️  发现问题: ${result.details}`);
  }
  
  // 统计章节数据
  const chapterPath = path.join(booksDir, bookId, 'chapters');
  if (fs.existsSync(chapterPath)) {
    const chapterFiles = fs.readdirSync(chapterPath).filter(file => file.endsWith('.json'));
    overallStats.totalChapters += chapterFiles.length;
    
    chapterFiles.forEach(chapterFile => {
      const chapterPath = path.join(chapterPath, chapterFile);
      try {
        const chapterData = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));
        
        if (chapterData.sections) {
          chapterData.sections.forEach(section => {
            overallStats.totalSections++;
            
            // 检查translation字段
            if (section.translation) {
              const hasChineseChars = /[\u4e00-\u9fff]/.test(section.translation);
              if (hasChineseChars) {
                overallStats.sectionsWithChineseTranslation++;
              } else {
                overallStats.sectionsWithIssues++;
              }
            } else {
              overallStats.sectionsWithIssues++;
            }
            
            // 检查interpretation字段
            if (section.interpretation) {
              const hasChineseChars2 = /[\u4e00-\u9fff]/.test(section.interpretation);
              if (hasChineseChars2) {
                overallStats.sectionsWithChineseInterpretation++;
              } else {
                overallStats.sectionsWithIssues++;
              }
            } else {
              overallStats.sectionsWithIssues++;
            }
            
            // 检查originalText字段
            if (section.originalText) {
              const hasChineseChars3 = /[\u4e00-\u9fff]/.test(section.originalText);
              if (hasChineseChars3) {
                overallStats.sectionsWithChineseOriginal++;
              } else {
                overallStats.sectionsWithIssues++;
              }
            } else {
              overallStats.sectionsWithIssues++;
            }
          });
        }
      } catch (error) {
        console.log(`  ❌ ${bookId}/${chapterFile}: 读取失败 - ${error.message}`);
      }
    });
  }
  
  console.log(`  章节数: ${result.chapterCount || 0}`);
  console.log(`  有中文内容: ${result.hasChineseContent ? '是' : '否'}`);
  console.log(`  有问题: ${result.hasIssues ? '是' : '否'}`);
});

// 生成统计报告
console.log('\n📊 统计报告：');
console.log(`总书籍数: ${overallStats.totalBooks}`);
console.log(`有中文内容的书籍: ${overallStats.booksWithChineseContent}`);
console.log(`有问题的书籍: ${overallStats.booksWithIssues}`);
console.log(`总章节数: ${overallStats.totalChapters}`);
console.log(`总节数: ${overallStats.totalSections}`);
console.log(`有中文翻译的节: ${overallStats.sectionsWithChineseTranslation}`);
console.log(`有中文解读的节: ${overallStats.sectionsWithChineseInterpretation}`);
console.log(`有中文原文的节: ${overallStats.sectionsWithChineseOriginal}`);
console.log(`有问题的节: ${overallStats.sectionsWithIssues}`);

// 计算百分比
const translationRate = overallStats.totalSections > 0 ? 
  ((overallStats.sectionsWithChineseTranslation / overallStats.totalSections) * 100).toFixed(1) : 0;
const interpretationRate = overallStats.totalSections > 0 ? 
  ((overallStats.sectionsWithChineseInterpretation / overallStats.totalSections) * 100).toFixed(1) : 0;
const originalRate = overallStats.totalSections > 0 ? 
  ((overallStats.sectionsWithChineseOriginal / overallStats.totalSections) * 100).toFixed(1) : 0;
const issueRate = overallStats.totalSections > 0 ? 
  ((overallStats.sectionsWithIssues / overallStats.totalSections) * 100).toFixed(1) : 0;

console.log('\n📈 完成度统计：');
console.log(`中文翻译完成度: ${translationRate}%`);
console.log(`中文解读完成度: ${interpretationRate}%`);
console.log(`中文原文完成度: ${originalRate}%`);
console.log(`问题率: ${issueRate}%`);

// 生成修复建议
console.log('\n🔧 修复建议：');

if (parseFloat(translationRate) < 95) {
  console.log('1. 补充缺失的中文翻译内容');
}

if (parseFloat(interpretationRate) < 95) {
  console.log('2. 补充缺失的中文解读内容');
}

if (parseFloat(originalRate) < 95) {
  console.log('3. 检查并修复原文内容');
}

if (parseFloat(issueRate) > 5) {
  console.log('4. 修复数据结构问题');
}

console.log('\n🎯 检查结论：');

const overallQuality = (parseFloat(translationRate) + parseFloat(interpretationRate) + parseFloat(originalRate)) / 3;

if (overallQuality >= 95) {
  console.log('🎉 中文tab内容质量优秀，所有内容都是中文');
} else if (overallQuality >= 85) {
  console.log('👍 中文tab内容质量良好，大部分内容是中文');
} else if (overallQuality >= 70) {
  console.log('⚠️  中文tab内容质量一般，需要改进');
} else {
  console.log('❌ 中文tab内容质量较差，需要大量修复');
}

console.log('\n🚀 检查完成！');
