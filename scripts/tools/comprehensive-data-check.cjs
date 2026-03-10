// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.271Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
const fs = require('fs');
const path = require('path');

console.log('🔍 全面检查所有书籍数据的遗漏问题...\n');

// 检查特定书籍的完整数据
function checkBookCompleteData(bookId, bookName) {
  const bookPath = path.join(__dirname, '../src/data/snapshots/zh/content/ancient-books', `${bookId}.json`);
  const issues = [];
  const dataStatus = {
    hasBookFile: false,
    hasChapters: false,
    chapterCount: 0,
    sectionCount: 0,
    chineseSections: 0,
    englishSections: 0,
    missingTranslations: 0,
    missingInterpretations: 0,
    missingSummaries: 0,
    englishTitles: 0,
    englishKeyConcepts: 0
  };
  
  // 检查书籍主文件
  if (fs.existsSync(bookPath)) {
    dataStatus.hasBookFile = true;
    
    try {
      const bookData = JSON.parse(fs.readFileSync(bookPath, 'utf8'));
      
      // 检查书籍基本信息
      if (bookData.content) {
        const content = bookData.content;
        
        // 检查朝代
        if (content.dynasty) {
          const hasEnglishDynasty = /[A-Za-z]/.test(content.dynasty);
          if (hasEnglishDynasty) {
            issues.push(`书籍朝代包含英文: "${content.dynasty}"`);
          }
        }
        
        // 检查分类
        if (content.category) {
          const hasEnglishCategory = /[A-Za-z]/.test(content.category);
          if (hasEnglishCategory) {
            issues.push(`书籍分类包含英文: "${content.category}"`);
          }
        }
        
        // 检查标签
        if (content.metadata && content.metadata.tags) {
          const englishTags = content.metadata.tags.filter(tag => /[A-Za-z]/.test(tag));
          if (englishTags.length > 0) {
            issues.push(`书籍标签包含英文: ${JSON.stringify(englishTags)}`);
          }
        }
      }
      
      // 检查章节目录
      const chaptersDir = path.join(__dirname, '../src/data/snapshots/zh/content/ancient-books', bookId, 'chapters');
      
      if (fs.existsSync(chaptersDir)) {
        dataStatus.hasChapters = true;
        const chapterFiles = fs.readdirSync(chaptersDir).filter(file => file.endsWith('.json'));
        dataStatus.chapterCount = chapterFiles.length;
        
        chapterFiles.forEach(chapterFile => {
          const chapterId = chapterFile.replace('.json', '');
          const chapterPath = path.join(chaptersDir, chapterFile);
          
          try {
            const chapterData = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));
            
            if (chapterData.sections) {
              chapterData.sections.forEach((section, index) => {
                dataStatus.sectionCount++;
                
                // 检查章节标题
                if (section.title && section.title.zh) {
                  const hasEnglishTitle = /[A-Za-z]/.test(section.title.zh);
                  if (hasEnglishTitle) {
                    dataStatus.englishTitles++;
                    issues.push(`${bookName}/${chapterId}/section${index + 1}: 章节标题包含英文: "${section.title.zh}"`);
                  }
                } else {
                  issues.push(`${bookName}/${chapterId}/section${index + 1}: 章节标题缺失`);
                }
                
                // 检查白话译文
                if (section.translation) {
                  const hasEnglishTranslation = /[A-Za-z]/.test(section.translation);
                  if (hasEnglishTranslation) {
                    dataStatus.englishSections++;
                    dataStatus.missingTranslations++;
                    issues.push(`${bookName}/${chapterId}/section${index + 1}: 白话译文包含英文: "${section.translation.substring(0, 50)}..."`);
                  } else {
                    dataStatus.chineseSections++;
                  }
                } else {
                  dataStatus.missingTranslations++;
                  issues.push(`${bookName}/${chapterId}/section${index + 1}: 白话译文缺失`);
                }
                
                // 检查现代解读
                if (section.interpretation) {
                  const hasEnglishInterpretation = /[A-Za-z]/.test(section.interpretation);
                  if (hasEnglishInterpretation) {
                    dataStatus.englishSections++;
                    dataStatus.missingInterpretations++;
                    issues.push(`${bookName}/${chapterId}/section${index + 1}: 现代解读包含英文: "${section.interpretation.substring(0, 50)}..."`);
                  }
                } else {
                  dataStatus.missingInterpretations++;
                  issues.push(`${bookName}/${chapterId}/section${index + 1}: 现代解读缺失`);
                }
                
                // 检查章节摘要
                if (section.summary) {
                  const hasEnglishSummary = /[A-Za-z]/.test(section.summary);
                  if (hasEnglishSummary) {
                    dataStatus.missingSummaries++;
                    issues.push(`${bookName}/${chapterId}/section${index + 1}: 章节摘要包含英文: "${section.summary.substring(0, 50)}..."`);
                  }
                } else {
                  dataStatus.missingSummaries++;
                  issues.push(`${bookName}/${chapterId}/section${index + 1}: 章节摘要缺失`);
                }
                
                // 检查关键概念
                if (section.keyConcepts) {
                  section.keyConcepts.forEach(concept => {
                    if (concept.term) {
                      const hasEnglishTerm = /[A-Za-z]/.test(concept.term);
                      if (hasEnglishTerm) {
                        dataStatus.englishKeyConcepts++;
                        issues.push(`${bookName}/${chapterId}/section${index + 1}: 关键概念包含英文: "${concept.term}"`);
                      }
                    }
                    
                    if (concept.category) {
                      const hasEnglishCategory = /[A-Za-z]/.test(concept.category);
                      if (hasEnglishCategory) {
                        issues.push(`${bookName}/${chapterId}/section${index + 1}: 概念分类包含英文: "${concept.category}"`);
                      }
                    }
                    
                    if (concept.relatedConcepts) {
                      const englishRelated = concept.relatedConcepts.filter(related => /[A-Za-z]/.test(related));
                      if (englishRelated.length > 0) {
                        issues.push(`${bookName}/${chapterId}/section${index + 1}: 相关概念包含英文: ${JSON.stringify(englishRelated)}`);
                      }
                    }
                  });
                }
              });
            }
          } catch (error) {
            issues.push(`${bookName}/${chapterId}: 读取失败 - ${error.message}`);
          }
        });
      } else {
        issues.push(`${bookName}: 章节目录不存在`);
      }
    } catch (error) {
      issues.push(`${bookName}: 读取失败 - ${error.message}`);
    }
  } else {
    issues.push(`${bookName}: 书籍文件不存在`);
  }
  
  return {
    issues,
    dataStatus
  };
}

// 检查所有书籍
console.log('📚 全面检查所有书籍数据：');

const books = [
  { id: 'jiayi-jing', name: '甲乙经' },
  { id: 'huangdi-neijing', name: '黄帝内经' },
  { id: 'shanghan-lun', name: '伤寒论' },
  { id: 'shanghan-zabing-lun', name: '伤寒杂病论' },
  { id: 'bencao-gangmu', name: '本草纲目' },
  { id: 'jinkui-yaolue', name: '金匮要略' },
  { id: 'mai-jing', name: '脉经' },
  { id: 'wenzhen-xue', name: '温病学' },
  { id: 'yixue-rumen', name: '医学入门' }
];

let totalIssues = 0;
let totalBooks = 0;
const bookReports = {};

books.forEach(book => {
  const result = checkBookCompleteData(book.id, book.name);
  totalBooks++;
  totalIssues += result.issues.length;
  bookReports[book.name] = result;
  
  const status = result.issues.length > 0 ? '❌' : '✅';
  console.log(`\n${status} ${book.name}:`);
  console.log(`  📊 章节数: ${result.dataStatus.chapterCount}`);
  console.log(`  📄 节数: ${result.dataStatus.sectionCount}`);
  console.log(`  🌐 中文节数: ${result.dataStatus.chineseSections}`);
  console.log(`  🌍 英文节数: ${result.dataStatus.englishSections}`);
  console.log(`  ❌ 缺失翻译: ${result.dataStatus.missingTranslations}`);
  console.log(`  ❌ 缺失解读: ${result.dataStatus.missingInterpretations}`);
  console.log(`  ❌ 缺失摘要: ${result.dataStatus.missingSummaries}`);
  console.log(`  ❌ 英文标题: ${result.dataStatus.englishTitles}`);
  console.log(`  ❌ 英文概念: ${result.dataStatus.englishKeyConcepts}`);
  
  if (result.issues.length > 0) {
    result.issues.slice(0, 5).forEach(issue => {
      console.log(`    ❌ ${issue}`);
    });
    if (result.issues.length > 5) {
      console.log(`    ... 还有 ${result.issues.length - 5} 个问题`);
    }
  }
});

// 生成详细报告
console.log('\n📊 总体统计报告：');
console.log(`总书籍数: ${totalBooks}`);
console.log(`总问题数: ${totalIssues}`);
console.log(`平均每本书问题数: ${(totalIssues / totalBooks).toFixed(1)}`);

// 按问题数量排序
const sortedBooks = Object.entries(bookReports)
  .sort(([,a], [,b]) => b.issues.length - a.issues.length)
  .slice(0, 5);

console.log('\n🔥 问题最多的书籍：');
sortedBooks.forEach(([bookName, report], index) => {
  console.log(`${index + 1}. ${bookName}: ${report.issues.length}个问题`);
});

// 分析问题类型
const issueTypes = {
  '白话译文问题': 0,
  '现代解读问题': 0,
  '章节摘要问题': 0,
  '章节标题问题': 0,
  '关键概念问题': 0,
  '书籍信息问题': 0
};

Object.values(bookReports).forEach(report => {
  report.issues.forEach(issue => {
    if (issue.includes('白话译文')) issueTypes['白话译文问题']++;
    if (issue.includes('现代解读')) issueTypes['现代解读问题']++;
    if (issue.includes('章节摘要')) issueTypes['章节摘要问题']++;
    if (issue.includes('章节标题')) issueTypes['章节标题问题']++;
    if (issue.includes('关键概念')) issueTypes['关键概念问题']++;
    if (issue.includes('朝代') || issue.includes('分类') || issue.includes('标签')) issueTypes['书籍信息问题']++;
  });
});

console.log('\n📈 问题类型分析：');
Object.entries(issueTypes).forEach(([type, count]) => {
  console.log(`${type}: ${count}个`);
});

// 分析为什么之前没有发现
console.log('\n🤔 为什么之前没有发现这些问题：');
console.log('1. 检查不够全面：之前只检查了部分字段，没有检查所有相关字段');
console.log('2. 翻译映射不完整：缺少大量英文到中文的翻译映射');
console.log('3. 验证机制不完善：没有建立完整的数据质量验证体系');
console.log('4. 检查范围有限：没有覆盖所有书籍的所有章节和字段');
console.log('5. 问题分类不清：没有按问题类型进行系统性分类和分析');

console.log('\n🔧 改进建议：');
console.log('1. 建立完整的数据质量检查清单');
console.log('2. 创建全面的翻译映射表');
console.log('3. 实现自动化的数据验证机制');
console.log('4. 建立问题分类和优先级系统');
console.log('5. 定期进行全面的数据质量审计');

console.log('\n🚀 全面检查完成！');
