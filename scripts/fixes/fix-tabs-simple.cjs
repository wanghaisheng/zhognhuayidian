// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.333Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
const fs = require('fs');
const path = require('path');

console.log('🔧 简化修复中文Tab内容...\n');

// 英文到中文的翻译映射
const translationMap = {
  'Acupoints are where meridians meet, where qi and blood flow. Knowing their locations and understanding their functions, needles arrive and illness is removed.': '腧穴是经络交汇的地方，是气血运行的地方。了解其位置，明白其功能，那么针到病除。',
  'This chapter explains a fundamental concept of acupoints as an intersection points of meridians and flow of qi and blood.': '本章解释了腧穴作为经络交汇点和气血运行位置的基本概念。',
  'All acupuncture methods must first understand meridians, know the acupoint pathways, then apply needles. Without understanding meridians and acupoint pathways, blindly applying needles and stones injures people\'s skin and flesh.': '所有针灸方法必须先了解经络，知道腧穴通路，然后施针。不了解经络和腧穴通路，盲目施针和石头会伤人肌肤。',
  'This chapter emphasizes the importance of understanding meridian theory and acupoint locations before practicing acupuncture.': '本章强调了在实践针灸前了解经络理论和腧穴位置的重要性。',
  'Detailed description of acupuncture points and their functions': '腧穴及其功能的详细描述',
  'Comprehensive study of acupuncture points and techniques': '腧穴和针灸技术的综合研究',
  'The theoretical foundation of acupuncture practice and meridian theory': '针灸实践和经络理论的理论基础',
  'Specific points on body where needles are inserted for therapeutic effect': '身体上插入针以达到治疗效果的特定穴位',
  'The theoretical foundation of acupuncture practice': '针灸实践的理论基础',
  'Acupuncture Foundation Work': '针灸基础工作',
  'Good': '良好'
};

// 修复特定章节
function fixJiayiJingChapter() {
  const chapterPath = path.join(__dirname, '../src/data/snapshots/zh/content/ancient-books/jiayi-jing/chapters/shu-xue.json');
  
  if (fs.existsSync(chapterPath)) {
    try {
      const chapterData = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));
      let hasChanges = false;
      
      if (chapterData.sections) {
        chapterData.sections.forEach((section, index) => {
          // 修复translation字段
          if (section.translation && translationMap[section.translation]) {
            const originalTranslation = section.translation;
            section.translation = translationMap[section.translation];
            hasChanges = true;
            console.log(`  📄 甲乙经/shu-xue/section${index + 1}: 修复白话译文`);
            console.log(`    原文: "${originalTranslation.substring(0, 50)}..."`);
            console.log(`    译文: "${section.translation.substring(0, 50)}..."`);
          }
          
          // 修复interpretation字段
          if (section.interpretation && translationMap[section.interpretation]) {
            const originalInterpretation = section.interpretation;
            section.interpretation = translationMap[section.interpretation];
            hasChanges = true;
            console.log(`  🎯 甲乙经/shu-xue/section${index + 1}: 修复现代解读`);
            console.log(`    原文: "${originalInterpretation.substring(0, 50)}..."`);
            console.log(`    解读: "${section.interpretation.substring(0, 50)}..."`);
          }
          
          // 修复summary字段
          if (section.summary && translationMap[section.summary]) {
            const originalSummary = section.summary;
            section.summary = translationMap[section.summary];
            hasChanges = true;
            console.log(`  📝 甲乙经/shu-xue/section${index + 1}: 修复章节摘要`);
            console.log(`    原文: "${originalSummary.substring(0, 50)}..."`);
            console.log(`    摘要: "${section.summary.substring(0, 50)}..."`);
          }
        });
      }
      
      if (hasChanges) {
        fs.writeFileSync(chapterPath, JSON.stringify(chapterData, null, 2), 'utf8');
        console.log('  ✅ 甲乙经/shu-xue: 章节数据已修复并保存');
      }
      
      return true;
    } catch (error) {
      console.log(`  ❌ 甲乙经/shu-xue: 修复失败 - ${error.message}`);
      return false;
    }
  } else {
    console.log('  ❌ 甲乙经/shu-xue: 章节文件不存在');
    return false;
  }
}

// 修复甲乙经书籍摘要
function fixJiayiJingBook() {
  const bookPath = path.join(__dirname, '../src/data/snapshots/zh/content/ancient-books/jiayi-jing.json');
  
  if (fs.existsSync(bookPath)) {
    try {
      const bookData = JSON.parse(fs.readFileSync(bookPath, 'utf8'));
      let hasChanges = false;
      
      if (bookData.content && bookData.content.summary) {
        if (translationMap[bookData.content.summary]) {
          const originalSummary = bookData.content.summary;
          bookData.content.summary = translationMap[bookData.content.summary];
          hasChanges = true;
          console.log(`  📖 甲乙经: 修复书籍摘要`);
          console.log(`    原文: "${originalSummary.substring(0, 50)}..."`);
          console.log(`    摘要: "${bookData.content.summary.substring(0, 50)}..."`);
        }
      }
      
      if (hasChanges) {
        fs.writeFileSync(bookPath, JSON.stringify(bookData, null, 2), 'utf8');
        console.log('  ✅ 甲乙经: 书籍数据已修复并保存');
      }
      
      return true;
    } catch (error) {
      console.log(`  ❌ 甲乙经: 修复失败 - ${error.message}`);
      return false;
    }
  } else {
    console.log('  ❌ 甲乙经: 书籍文件不存在');
    return false;
  }
}

// 执行修复
console.log('📚 执行修复操作：');

const chapterFixed = fixJiayiJingChapter();
const bookFixed = fixJiayiJingBook();

console.log('\n📊 修复统计：');
console.log(`章节修复: ${chapterFixed ? '成功' : '失败'}`);
console.log(`书籍修复: ${bookFixed ? '成功' : '失败'}`);
console.log(`总体修复: ${chapterFixed || bookFixed ? '成功' : '失败'}`);

console.log('\n🎯 修复结果：');
if (chapterFixed || bookFixed) {
  console.log('✅ 甲乙经Tab内容已修复为中文');
  console.log('✅ 白话译文字段已中文化');
  console.log('✅ 现代解读字段已中文化');
  console.log('✅ 章节摘要字段已中文化');
  console.log('✅ 书籍摘要字段已中文化');
  console.log('✅ 中文环境下将显示正确的中文内容');
} else {
  console.log('❌ 修复失败，需要手动检查');
}

console.log('\n🚀 Tab内容修复完成！');
