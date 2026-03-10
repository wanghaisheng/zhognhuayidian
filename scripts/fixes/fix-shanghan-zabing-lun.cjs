// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.332Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
const fs = require('fs');
const path = require('path');

console.log('🔧 修复伤寒杂病论的Tab内容...\n');

// 英文到中文的翻译映射
const translationMap = {
  // 伤寒杂病论相关
  'When Taiyang is diseased, the pulse is floating, there is stiffness and pain in the head and neck, and aversion to cold. In Taiyang disease with fever and sweating, there is aversion to wind; when the pulse is slow, it is called wind strike. In Taiyang disease, whether there is already fever or not, there is necessarily aversion to cold, body pain, vomiting, and when both yin and yang pulses are tight, it is called cold damage.': '太阳病时，脉浮，头项强痛而恶寒。太阳病，发热汗出者，恶风也，其脉缓者，名为中风。太阳病，或已发热，或未发热，必恶寒，体痛呕逆，脉阴阳俱紧者，名为伤寒。',
  'This chapter establishes the basic diagnostic criteria for Taiyang disease patterns, which represent the exterior stage of disease according to the six meridian theory.': '本章确立了太阳病证的基本诊断标准，太阳病代表六经理论中的表证阶段。',
  'When Yangming is diseased, the stomach house is replete. In Yangming disease, if one can eat, it is called wind strike; if one cannot eat, it is called cold strike. What are the exterior signs of Yangming disease? The answer is: body heat, spontaneous sweating, no aversion to cold, but rather aversion to heat.': '阳明病时，胃家实。阳明病，若能食，名中风；不能食，名中寒。阳明病，外证云何？答曰：身热，汗自出，不恶寒，反恶热也。',
  'This chapter describes Yangming disease patterns, which represent the interior heat stage with excess in the stomach and large intestine meridians.': '本章描述了阳明病证，阳明病代表胃和大肠经络的里热实证阶段。',
  
  // 章节标题
  'Taiyang Disease Chapter One': '太阳病第一章',
  'Yangming Disease Chapter One': '阳明病第一章',
  
  // 章节摘要
  'Discusses the diagnosis and treatment of Taiyang disease patterns according to six meridian theory': '根据六经理论讨论太阳病证的诊断和治疗',
  'Discusses the diagnosis and treatment of Yangming disease patterns': '讨论阳明病证的诊断和治疗',
  
  // 关键概念
  'Taiyang Disease': '太阳病',
  'Yangming Disease': '阳明病',
  'The first stage of six meridian disease progression, representing exterior patterns': '六经病进展的第一阶段，代表表证',
  'The second stage of six meridian disease, representing interior heat patterns': '六经病的第二阶段，代表里热证',
  'Six Meridians': '六经',
  'Yangming Disease': '阳明病',
  'Shaoyang Disease': '少阳病',
  'Taiyin Disease': '太阴病',
  'Shaoyin Disease': '少阴病'
};

// 修复伤寒杂病论的章节
function fixShanghanZabingLunChapters() {
  const chaptersDir = path.join(__dirname, '../src/data/snapshots/zh/content/ancient-books/shanghan-zabing-lun/chapters');
  
  if (!fs.existsSync(chaptersDir)) {
    console.log('  ❌ 伤寒杂病论章节目录不存在');
    return false;
  }
  
  const chapterFiles = fs.readdirSync(chaptersDir).filter(file => file.endsWith('.json'));
  let totalFixes = 0;
  
  chapterFiles.forEach(chapterFile => {
    const chapterPath = path.join(chaptersDir, chapterFile);
    const chapterId = chapterFile.replace('.json', '');
    
    try {
      const chapterData = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));
      let hasChanges = false;
      
      // 修复章节标题
      if (chapterData.title && chapterData.title.zh && translationMap[chapterData.title.zh]) {
        const originalTitle = chapterData.title.zh;
        chapterData.title.zh = translationMap[chapterData.title.zh];
        hasChanges = true;
        console.log(`  📖 ${chapterId}: 修复章节标题`);
        console.log(`    原文: "${originalTitle}"`);
        console.log(`    译文: "${chapterData.title.zh}"`);
      }
      
      // 修复章节摘要
      if (chapterData.summary && translationMap[chapterData.summary]) {
        const originalSummary = chapterData.summary;
        chapterData.summary = translationMap[chapterData.summary];
        hasChanges = true;
        console.log(`  📝 ${chapterId}: 修复章节摘要`);
        console.log(`    原文: "${originalSummary.substring(0, 50)}..."`);
        console.log(`    摘要: "${chapterData.summary.substring(0, 50)}..."`);
      }
      
      // 修复sections
      if (chapterData.sections) {
        chapterData.sections.forEach((section, index) => {
          // 修复section标题
          if (section.title && section.title.zh && translationMap[section.title.zh]) {
            const originalSectionTitle = section.title.zh;
            section.title.zh = translationMap[section.title.zh];
            hasChanges = true;
            console.log(`  📄 ${chapterId}/section${index + 1}: 修复节标题`);
            console.log(`    原文: "${originalSectionTitle}"`);
            console.log(`    译文: "${section.title.zh}"`);
          }
          
          // 修复白话译文
          if (section.translation && translationMap[section.translation]) {
            const originalTranslation = section.translation;
            section.translation = translationMap[section.translation];
            hasChanges = true;
            console.log(`  📄 ${chapterId}/section${index + 1}: 修复白话译文`);
            console.log(`    原文: "${originalTranslation.substring(0, 50)}..."`);
            console.log(`    译文: "${section.translation.substring(0, 50)}..."`);
          }
          
          // 修复现代解读
          if (section.interpretation && translationMap[section.interpretation]) {
            const originalInterpretation = section.interpretation;
            section.interpretation = translationMap[section.interpretation];
            hasChanges = true;
            console.log(`  🎯 ${chapterId}/section${index + 1}: 修复现代解读`);
            console.log(`    原文: "${originalInterpretation.substring(0, 50)}..."`);
            console.log(`    解读: "${section.interpretation.substring(0, 50)}..."`);
          }
          
          // 修复关键概念
          if (section.keyConcepts) {
            section.keyConcepts.forEach(concept => {
              if (concept.term && translationMap[concept.term]) {
                const originalTerm = concept.term;
                concept.term = translationMap[concept.term];
                hasChanges = true;
                console.log(`  🔑 ${chapterId}/section${index + 1}: 修复关键概念`);
                console.log(`    原文: "${originalTerm}"`);
                console.log(`    译文: "${concept.term}"`);
              }
              
              if (concept.category && translationMap[concept.category]) {
                const originalCategory = concept.category;
                concept.category = translationMap[concept.category];
                hasChanges = true;
                console.log(`  🏷️  ${chapterId}/section${index + 1}: 修复概念分类`);
                console.log(`    原文: "${originalCategory}"`);
                console.log(`    译文: "${concept.category}"`);
              }
              
              if (concept.relatedConcepts) {
                concept.relatedConcepts = concept.relatedConcepts.map(related => 
                  translationMap[related] || related
                );
                hasChanges = true;
                console.log(`  🔗 ${chapterId}/section${index + 1}: 修复相关概念`);
              }
            });
          }
        });
      }
      
      // 保存修复后的数据
      if (hasChanges) {
        fs.writeFileSync(chapterPath, JSON.stringify(chapterData, null, 2), 'utf8');
        console.log(`  ✅ ${chapterId}: 章节数据已修复并保存`);
        totalFixes++;
      } else {
        console.log(`  ℹ️  ${chapterId}: 无需修复`);
      }
      
    } catch (error) {
      console.log(`  ❌ ${chapterId}: 修复失败 - ${error.message}`);
    }
  });
  
  return totalFixes;
}

// 修复伤寒杂病论主文件
function fixShanghanZabingLunBook() {
  const bookPath = path.join(__dirname, '../src/data/snapshots/zh/content/ancient-books/shanghan-zabing-lun.json');
  
  if (!fs.existsSync(bookPath)) {
    console.log('  ❌ 伤寒杂病论主文件不存在');
    return false;
  }
  
  try {
    const bookData = JSON.parse(fs.readFileSync(bookPath, 'utf8'));
    let hasChanges = false;
    
    // 修复书籍摘要
    if (bookData.content && bookData.content.summary && translationMap[bookData.content.summary]) {
      const originalSummary = bookData.content.summary;
      bookData.content.summary = translationMap[bookData.content.summary];
      hasChanges = true;
      console.log(`  📖 伤寒杂病论: 修复书籍摘要`);
      console.log(`    原文: "${originalSummary.substring(0, 50)}..."`);
      console.log(`    摘要: "${bookData.content.summary.substring(0, 50)}..."`);
    }
    
    // 保存修复后的数据
    if (hasChanges) {
      fs.writeFileSync(bookPath, JSON.stringify(bookData, null, 2), 'utf8');
      console.log(`  ✅ 伤寒杂病论: 书籍数据已修复并保存`);
      return true;
    } else {
      console.log(`  ℹ️  伤寒杂病论: 无需修复`);
      return false;
    }
    
  } catch (error) {
    console.log(`  ❌ 伤寒杂病论: 修复失败 - ${error.message}`);
    return false;
  }
}

// 执行修复
console.log('📚 执行伤寒杂病论修复操作：');

const chapterFixes = fixShanghanZabingLunChapters();
const bookFixed = fixShanghanZabingLunBook();

console.log('\n📊 修复统计：');
console.log(`修复的章节数: ${chapterFixes}个`);
console.log(`书籍修复: ${bookFixed ? '成功' : '无需修复'}`);
console.log(`总体修复: ${chapterFixes > 0 || bookFixed ? '成功' : '无需修复'}`);

console.log('\n🎯 修复结果：');
if (chapterFixes > 0 || bookFixed) {
  console.log('✅ 伤寒杂病论Tab内容已修复为中文');
  console.log('✅ 白话译文字段已中文化');
  console.log('✅ 现代解读字段已中文化');
  console.log('✅ 章节标题字段已中文化');
  console.log('✅ 章节摘要字段已中文化');
  console.log('✅ 关键概念字段已中文化');
  console.log('✅ 中文环境下将显示正确的中文内容');
} else {
  console.log('ℹ️  伤寒杂病论Tab内容无需修复');
}

console.log('\n🚀 伤寒杂病论Tab内容修复完成！');
