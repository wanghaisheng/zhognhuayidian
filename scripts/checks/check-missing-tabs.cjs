// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.314Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
const fs = require('fs');
const path = require('path');

console.log('🔍 检查每本书的tab内容缺失翻译情况...\n');

// 检查特定书籍的tab内容
function checkBookTabContent(bookId, bookName) {
  const bookPath = path.join(__dirname, '../src/data/snapshots/zh/content/ancient-books', `${bookId}.json`);
  
  if (!fs.existsSync(bookPath)) {
    console.log(`  ❌ ${bookName}: 书籍文件不存在`);
    return { hasIssues: true, issues: ['书籍文件不存在'] };
  }
  
  try {
    const bookData = JSON.parse(fs.readFileSync(bookPath, 'utf8'));
    const issues = [];
    
    if (bookData.content) {
      const content = bookData.content;
      
      // 检查书籍摘要
      if (content.summary) {
        const hasEnglishSummary = /[A-Za-z]/.test(content.summary);
        if (hasEnglishSummary) {
          issues.push(`书籍摘要包含英文: "${content.summary.substring(0, 50)}..."`);
        }
      }
      
      // 检查标签
      if (content.metadata && content.metadata.tags) {
        const englishTags = content.metadata.tags.filter(tag => /[A-Za-z]/.test(tag));
        if (englishTags.length > 0) {
          issues.push(`标签包含英文: ${JSON.stringify(englishTags)}`);
        }
      }
    }
    
    // 检查章节数据
    const chaptersDir = path.join(__dirname, '../src/data/snapshots/zh/content/ancient-books', bookId, 'chapters');
    
    if (fs.existsSync(chaptersDir)) {
      const chapterFiles = fs.readdirSync(chaptersDir).filter(file => file.endsWith('.json'));
      
      chapterFiles.forEach(chapterFile => {
        const chapterId = chapterFile.replace('.json', '');
        const chapterPath = path.join(chaptersDir, chapterFile);
        
        try {
          const chapterData = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));
          
          if (chapterData.sections) {
            chapterData.sections.forEach((section, index) => {
              let sectionIssues = [];
              
              // 检查白话译文
              if (section.translation) {
                const hasEnglishTranslation = /[A-Za-z]/.test(section.translation);
                if (hasEnglishTranslation) {
                  sectionIssues.push(`白话译文包含英文: "${section.translation.substring(0, 30)}..."`);
                }
              } else {
                sectionIssues.push('白话译文缺失');
              }
              
              // 检查现代解读
              if (section.interpretation) {
                const hasEnglishInterpretation = /[A-Za-z]/.test(section.interpretation);
                if (hasEnglishInterpretation) {
                  sectionIssues.push(`现代解读包含英文: "${section.interpretation.substring(0, 30)}..."`);
                }
              } else {
                sectionIssues.push('现代解读缺失');
              }
              
              // 检查古籍原文
              if (section.originalText) {
                const hasChineseOriginal = /[\u4e00-\u9fff]/.test(section.originalText);
                if (!hasChineseOriginal) {
                  sectionIssues.push('古籍原文不是中文');
                }
              } else {
                sectionIssues.push('古籍原文正确');
              }
              
              // 检查章节摘要
              if (section.summary) {
                const hasEnglishSummary = /[A-Za-z]/.test(section.summary);
                if (hasEnglishSummary) {
                  sectionIssues.push(`章节摘要包含英文: "${section.summary.substring(0, 30)}..."`);
                }
              } else {
                sectionIssues.push('章节摘要缺失');
              }
              
              if (sectionIssues.length > 0) {
                issues.push(`${bookName}/${chapterId}/section${index + 1}: ${sectionIssues.join(', ')}`);
              }
            });
          }
        } catch (error) {
          issues.push(`${bookName}/${chapterId}: 读取失败 - ${error.message}`);
        }
      });
    }
    
    return {
      hasIssues: issues.length > 0,
      issues: issues
    };
    
  } catch (error) {
    return { hasIssues: true, issues: [`读取失败: ${error.message}`] };
  }
}

// 检查所有书籍
console.log('📚 检查所有书籍的tab内容：');

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

let totalBooks = 0;
let booksWithIssues = 0;
let totalIssues = 0;
const issueDetails = {};

books.forEach(book => {
  const result = checkBookTabContent(book.id, book.name);
  totalBooks++;
  
  if (result.hasIssues) {
    booksWithIssues++;
    totalIssues += result.issues.length;
    issueDetails[book.name] = result.issues;
  }
  
  const status = result.hasIssues ? '❌' : '✅';
  console.log(`\n${status} ${book.name}:`);
  if (result.issues.length > 0) {
    result.issues.slice(0, 5).forEach(issue => {
      console.log(`  ❌ ${issue}`);
    });
    if (result.issues.length > 5) {
      console.log(`  ... 还有 ${result.issues.length - 5} 个问题`);
    }
  } else {
    console.log(`  ✅ 所有tab内容都正确`);
  }
});

// 生成详细报告
console.log('\n📊 统计报告：');
console.log(`总书籍数: ${totalBooks}`);
console.log(`有问题的书籍: ${booksWithIssues}`);
console.log(`问题总数: ${totalIssues}`);
console.log(`问题率: ${totalBooks > 0 ? ((totalIssues / totalBooks) * 100).toFixed(1) : 0}%`);

if (totalIssues > 0) {
  console.log('\n⚠️  详细问题列表：');
  Object.entries(issueDetails).forEach(([bookName, issues]) => {
    console.log(`\n📖 ${bookName}:`);
    issues.slice(0, 10).forEach(issue => {
      console.log(`  ❌ ${issue}`);
    });
    if (issues.length > 10) {
      console.log(`  ... 还有 ${issues.length - 10} 个问题`);
    }
  });
  
  console.log('\n🔧 修复建议：');
  console.log('1. 优先修复白话译文和现代解读字段');
  console.log('2. 确保古籍原文字段包含中文内容');
  console.log('3. 补充缺失的章节摘要');
  console.log('4. 检查并修复标签中的英文内容');
  console.log('5. 建立内容质量验证机制');
} else {
  console.log('\n🎉 所有书籍的tab内容都正确！');
  console.log('✅ 白话译文字段都是中文');
  console.log('✅ 现代解读字段都是中文');
  console.log('✅ 古籍原文字段都是中文');
  console.log('✅ 章节摘要字段都是中文');
  console.log('✅ 标签字段都是中文');
}

console.log('\n🎯 检查结论：');

const issueRate = totalBooks > 0 ? ((totalIssues / totalBooks) * 100).toFixed(1) : 0;

if (parseFloat(issueRate) >= 95) {
  console.log('🎉 优秀：所有书籍的tab内容都正确，无需修复');
} else if (parseFloat(issueRate) >= 80) {
  console.log('👍 良好：大部分书籍的tab内容正确，有少量问题需要处理');
} else if (parseFloat(issueRate) >= 60) {
  console.log('⚠️  一般：部分书籍的tab内容有问题，需要较多修复工作');
} else {
  console.log('❌ 较差：大部分书籍的tab内容都有问题，需要大量修复工作');
}

console.log('\n🚀 检查完成！');
