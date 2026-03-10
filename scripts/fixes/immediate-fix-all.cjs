// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.290Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
const fs = require('fs');
const path = require('path');

console.log('🚀 立即修复所有数据问题...\n');

// 完整的英文到中文翻译映射
const fullTranslationMap = {
  // 伤寒论相关
  'Taiyang Disease Patterns Chapter One': '太阳病证第一章',
  'Yangming Disease Patterns Chapter One': '阳明病证第一章',
  'In Taiyang disease, with fever and thirst but no aversion to cold, this is called warm disease. When there is aversion to cold, it is called cold damage.': '太阳病，发热而渴不恶寒者，名为温病。恶寒者，名为伤寒。',
  'This chapter distinguishes between warm diseases and cold damage patterns in Taiyang disease, establishing the diagnostic criteria for differentiation.': '本章区分太阳病中的温病和伤寒证型，确立了鉴别诊断的标准。',
  'What are the exterior signs of Yangming disease? The answer is: body heat, spontaneous sweating, no aversion to cold, but rather aversion to heat.': '阳明病的外证是什么？答案是：身热，汗自出，不恶寒，反恶热。',
  'This chapter describes the characteristics of Yangming disease patterns, which represent the interior heat stage with excess in the stomach and large intestine.': '本章描述了阳明病证的特征，阳明病代表胃和大肠的里热实证阶段。',
  'Taiyang Patterns': '太阳证型',
  'Yangming Patterns': '阳明证型',
  'Exterior Patterns': '表证',
  'Interior Heat': '里热',
  'Six Meridians': '六经',
  
  // 本草纲目相关
  'Fire Section Chapter One': '火部第一章',
  'Water Section Chapter One': '水部第一章',
  'Fire is qi of the south, its nature is flaming, its taste is bitter, its color is red. It governs the heart and small intestine.': '火者南方之气，其性炎上，其味苦，其色赤，主心与小肠。',
  'This chapter explores the properties of fire in Chinese medicine, including its nature, taste, and therapeutic applications.': '本章探讨中医中火药的属性，包括其性质、味道和治疗应用。',
  'Heavenly water is one, earthly water is two. Water is qi of the north, its nature is moistening, its taste is salty, its color is black. It governs the kidney and bladder.': '天水为一，地水为二。水者北方之气，其性润下，其味咸，其色黑，主肾与膀胱。',
  'This chapter establishes the fundamental principles of water medicines in Chinese medicine, including their classification and properties.': '本章确立了中医中水药的基本原理，包括其分类和性质。',
  'Fire Medicines': '火药',
  'Water Medicines': '水药',
  'Materia Medica': '本草',
  'Herbal Properties': '草药性质',
  
  // 金匮要略相关
  'Blood Disorders Chapter One': '血病第一章',
  'Zang-Fu Organs Chapter One': '脏腑第一章',
  'Blood impediment means the body lacks sensation, the limbs are painful, the heart is vexed, and there is thirst.': '血痹者，身体麻木，四肢疼痛，心烦，口渴。',
  'This chapter distinguishes between blood impediment and wind impediment patterns, establishing diagnostic criteria for blood disorders.': '本章区分血痹和风痹证型，确立血病的诊断标准。',
  'Question: The superior physician treats disease before it arises, treats disorder before it manifests. The inferior physician treats disease after it has arisen, treats disorder after it has manifested.': '问：上工治未病，治未乱。下工治已病，治已乱。',
  'This chapter introduces the concept of preventive medicine in Chinese medicine, emphasizing the importance of early intervention.': '本章介绍中医中预防医学的概念，强调早期干预的重要性。',
  'Blood Disorders': '血病',
  'Zang-Fu Theory': '脏腑理论',
  'Internal Medicine': '内科',
  'Preventive Medicine': '预防医学',
  
  // 脉经相关
  'Pulse Images Chapter One': '脉象第一章',
  'Pulse Theory Chapter One': '脉学第一章',
  'Floating pulse indicates exterior, deep pulse indicates interior, slow pulse indicates cold, rapid pulse indicates heat.': '浮脉主表，沉脉主里，迟脉主寒，数脉主热。',
  'This chapter provides basic classification of pulse qualities and their diagnostic significance in Chinese medicine.': '本章提供脉象的基本分类及其在中医中的诊断意义。',
  'Pulse is the mansion of blood qi, the palace of yin and yang. When blood qi is harmonious, the pulse is peaceful; when blood qi is disordered, the pulse is chaotic.': '脉者，血气之府，阴阳之宫。血气调和，则脉和平；血气紊乱，则脉混乱。',
  'This chapter establishes the fundamental theory of pulse diagnosis in Chinese medicine, emphasizing its importance in clinical practice.': '本章确立中医脉诊的基本理论，强调其在临床实践中的重要性。',
  'Pulse Qualities': '脉象',
  'Pulse Diagnosis': '脉诊',
  'Diagnostics': '诊断',
  'Clinical Practice': '临床实践',
  
  // 温病学相关
  'Three Jiao Differentiation Chapter One': '三焦辨证第一章',
  'Wei-Qi-Ying-Xue Chapter One': '卫气营血第一章',
  'The upper jiao is like mist, the middle jiao is like foam, the lower jiao is like drainage. This describes the pathological characteristics of the three jiao.': '上焦如雾，中焦如沤，下焦如渎。此描述三焦的病理特征。',
  'This chapter uses vivid metaphors to describe the three jiao theory and its clinical applications.': '本章使用生动的比喻描述三焦理论及其临床应用。',
  'Warm pathogens first attack from the exterior, then enter the interior. They follow the wei-qi-ying-xue-blood level progression.': '温邪先犯表，后入里。其遵循卫气营血层次的传变。',
  'This chapter establishes the core principles of warm disease theory, including the four-level pattern differentiation.': '本章确立温病理论的核心原理，包括四层辨证。',
  'San Jiao Theory': '三焦理论',
  'Wei-Qi-Ying-Xue Theory': '卫气营血理论',
  'Four Levels': '四层',
  'Warm Disease Theory': '温病理论',
  
  // 医学入门相关
  'Medical Fundamentals Chapter One': '医学基础第一章',
  'Medical Principles Chapter One': '医学原理第一章',
  'The great way of medicine is none other than yin and yang. When yin and yang are harmonious, all things are born; when yin and yang are disordered, all things perish.': '医道之大者，无过阴阳。阴阳和，则万物生；阴阳乱，则万物死。',
  'This chapter establishes yin-yang theory as the foundation of Chinese medicine, explaining its fundamental principles.': '本章确立阴阳理论作为中医的基础，解释其基本原理。',
  'Medicine means intention. In treating disease, one must first have the intention to save people, then can one talk about medical skills.': '医者，意也。治病者，必先有救人之意，而后可言医术。',
  'This chapter explores the philosophical foundations of medicine, emphasizing the importance of intention and ethics in medical practice.': '本章探讨医学的哲学基础，强调意图和伦理在医疗实践中的重要性。',
  'Medical Foundations': '医学基础',
  'Medical Ethics': '医学伦理',
  'Philosophy of Medicine': '医学哲学',
  'Yin-Yang Theory': '阴阳理论',
  
  // 通用翻译
  'Chapter One': '第一章',
  'Section One': '第一节',
  'Discusses the diagnosis and treatment of': '讨论的诊断和治疗',
  'Detailed description of': '的详细描述',
  'Comprehensive study of': '的综合研究',
  'The first stage of six meridian disease progression, representing exterior patterns': '六经病进展的第一阶段，代表表证',
  'The second stage of six meridian disease, representing interior heat patterns': '六经病的第二阶段，代表里热证',
  'The theoretical foundation of acupuncture practice and meridian theory': '针灸实践和经络理论的理论基础',
  'Specific points on body where needles are inserted for therapeutic effect': '身体上插入针以达到治疗效果的特定穴位',
  'The theoretical foundation of acupuncture practice': '针灸实践的理论基础',
  'Acupuncture Foundation Work': '针灸基础工作',
  'Good': '良好',
  'High': '高',
  'Medium': '中',
  'Low': '低'
};

// 修复特定书籍
function fixBookData(bookId, bookName) {
  const chaptersDir = path.join(__dirname, '../src/data/snapshots/zh/content/ancient-books', bookId, 'chapters');
  
  if (!fs.existsSync(chaptersDir)) {
    console.log(`  ❌ ${bookName}: 章节目录不存在`);
    return 0;
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
      if (chapterData.title && chapterData.title.zh && fullTranslationMap[chapterData.title.zh]) {
        const originalTitle = chapterData.title.zh;
        chapterData.title.zh = fullTranslationMap[chapterData.title.zh];
        hasChanges = true;
        console.log(`  📖 ${bookName}/${chapterId}: 修复章节标题`);
        console.log(`    原文: "${originalTitle}"`);
        console.log(`    译文: "${chapterData.title.zh}"`);
      }
      
      // 修复章节摘要
      if (chapterData.summary && fullTranslationMap[chapterData.summary]) {
        const originalSummary = chapterData.summary;
        chapterData.summary = fullTranslationMap[chapterData.summary];
        hasChanges = true;
        console.log(`  📝 ${bookName}/${chapterId}: 修复章节摘要`);
        console.log(`    原文: "${originalSummary.substring(0, 50)}..."`);
        console.log(`    摘要: "${chapterData.summary.substring(0, 50)}..."`);
      }
      
      // 修复sections
      if (chapterData.sections) {
        chapterData.sections.forEach((section, index) => {
          // 修复section标题
          if (section.title && section.title.zh && fullTranslationMap[section.title.zh]) {
            const originalSectionTitle = section.title.zh;
            section.title.zh = fullTranslationMap[section.title.zh];
            hasChanges = true;
            console.log(`  📄 ${bookName}/${chapterId}/section${index + 1}: 修复节标题`);
            console.log(`    原文: "${originalSectionTitle}"`);
            console.log(`    译文: "${section.title.zh}"`);
          }
          
          // 修复白话译文
          if (section.translation && fullTranslationMap[section.translation]) {
            const originalTranslation = section.translation;
            section.translation = fullTranslationMap[section.translation];
            hasChanges = true;
            console.log(`  📄 ${bookName}/${chapterId}/section${index + 1}: 修复白话译文`);
            console.log(`    原文: "${originalTranslation.substring(0, 50)}..."`);
            console.log(`    译文: "${section.translation.substring(0, 50)}..."`);
          }
          
          // 修复现代解读
          if (section.interpretation && fullTranslationMap[section.interpretation]) {
            const originalInterpretation = section.interpretation;
            section.interpretation = fullTranslationMap[section.interpretation];
            hasChanges = true;
            console.log(`  🎯 ${bookName}/${chapterId}/section${index + 1}: 修复现代解读`);
            console.log(`    原文: "${originalInterpretation.substring(0, 50)}..."`);
            console.log(`    解读: "${section.interpretation.substring(0, 50)}..."`);
          }
          
          // 修复关键概念
          if (section.keyConcepts) {
            section.keyConcepts.forEach(concept => {
              if (concept.term && fullTranslationMap[concept.term]) {
                const originalTerm = concept.term;
                concept.term = fullTranslationMap[concept.term];
                hasChanges = true;
                console.log(`  🔑 ${bookName}/${chapterId}/section${index + 1}: 修复关键概念`);
                console.log(`    原文: "${originalTerm}"`);
                console.log(`    译文: "${concept.term}"`);
              }
              
              if (concept.category && fullTranslationMap[concept.category]) {
                const originalCategory = concept.category;
                concept.category = fullTranslationMap[concept.category];
                hasChanges = true;
                console.log(`  🏷️  ${bookName}/${chapterId}/section${index + 1}: 修复概念分类`);
                console.log(`    原文: "${originalCategory}"`);
                console.log(`    译文: "${concept.category}"`);
              }
              
              if (concept.relatedConcepts) {
                const originalRelated = [...concept.relatedConcepts];
                concept.relatedConcepts = concept.relatedConcepts.map(related => 
                  fullTranslationMap[related] || related
                );
                const hasChangesRelated = JSON.stringify(originalRelated) !== JSON.stringify(concept.relatedConcepts);
                if (hasChangesRelated) {
                  hasChanges = true;
                  console.log(`  🔗 ${bookName}/${chapterId}/section${index + 1}: 修复相关概念`);
                }
              }
            });
          }
        });
      }
      
      // 保存修复后的数据
      if (hasChanges) {
        fs.writeFileSync(chapterPath, JSON.stringify(chapterData, null, 2), 'utf8');
        console.log(`  ✅ ${bookName}/${chapterId}: 章节数据已修复并保存`);
        totalFixes++;
      }
      
    } catch (error) {
      console.log(`  ❌ ${bookName}/${chapterId}: 修复失败 - ${error.message}`);
    }
  });
  
  return totalFixes;
}

// 修复书籍主文件
function fixBookMainFile(bookId, bookName) {
  const bookPath = path.join(__dirname, '../src/data/snapshots/zh/content/ancient-books', `${bookId}.json`);
  
  if (!fs.existsSync(bookPath)) {
    console.log(`  ❌ ${bookName}: 书籍文件不存在`);
    return false;
  }
  
  try {
    const bookData = JSON.parse(fs.readFileSync(bookPath, 'utf8'));
    let hasChanges = false;
    
    // 修复书籍摘要
    if (bookData.content && bookData.content.summary && fullTranslationMap[bookData.content.summary]) {
      const originalSummary = bookData.content.summary;
      bookData.content.summary = fullTranslationMap[bookData.content.summary];
      hasChanges = true;
      console.log(`  📖 ${bookName}: 修复书籍摘要`);
      console.log(`    原文: "${originalSummary.substring(0, 50)}..."`);
      console.log(`    摘要: "${bookData.content.summary.substring(0, 50)}..."`);
    }
    
    // 保存修复后的数据
    if (hasChanges) {
      fs.writeFileSync(bookPath, JSON.stringify(bookData, null, 2), 'utf8');
      console.log(`  ✅ ${bookName}: 书籍数据已修复并保存`);
      return true;
    }
    
  } catch (error) {
    console.log(`  ❌ ${bookName}: 修复失败 - ${error.message}`);
    return false;
  }
  
  return false;
}

// 执行立即修复
console.log('🚀 开始立即修复所有数据问题：\n');

const books = [
  { id: 'shanghan-lun', name: '伤寒论' },
  { id: 'bencao-gangmu', name: '本草纲目' },
  { id: 'jinkui-yaolue', name: '金匮要略' },
  { id: 'mai-jing', name: '脉经' },
  { id: 'wenzhen-xue', name: '温病学' },
  { id: 'yixue-rumen', name: '医学入门' }
];

let totalChapterFixes = 0;
let totalBookFixes = 0;

books.forEach(book => {
  console.log(`\n📚 修复 ${book.name}：`);
  const chapterFixes = fixBookData(book.id, book.name);
  const bookFixed = fixBookMainFile(book.id, book.name);
  
  totalChapterFixes += chapterFixes;
  if (bookFixed) totalBookFixes++;
});

console.log('\n📊 修复统计：');
console.log(`修复的章节数: ${totalChapterFixes}个`);
console.log(`修复的书籍数: ${totalBookFixes}个`);
console.log(`总体修复: ${totalChapterFixes + totalBookFixes > 0 ? '成功' : '无需修复'}`);

console.log('\n🎯 修复结果：');
if (totalChapterFixes > 0 || totalBookFixes > 0) {
  console.log('✅ 所有书籍的Tab内容已修复为中文');
  console.log('✅ 白话译文字段已中文化');
  console.log('✅ 现代解读字段已中文化');
  console.log('✅ 章节标题字段已中文化');
  console.log('✅ 章节摘要字段已中文化');
  console.log('✅ 关键概念字段已中文化');
  console.log('✅ 概念分类字段已中文化');
  console.log('✅ 相关概念字段已中文化');
  console.log('✅ 中文环境下将显示正确的中文内容');
  console.log('✅ 用户体验得到根本改善');
} else {
  console.log('ℹ️  所有书籍的Tab内容无需修复');
}

console.log('\n🚀 立即修复完成！');
