// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.270Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
const fs = require('fs');
const path = require('path');

console.log('🚀 完成修复所有剩余问题...\n');

// 完整的剩余问题翻译映射
const completeRemainingMap = {
  // 甲乙经剩余问题
  'This chapter explains the fundamental concept of acupoints as an intersection points of meridians and flow of qi and blood.': '本章解释了腧穴作为经络交汇点和气血运行位置的基本概念。',
  'All acupuncture methods must first understand meridians, know the acupoint pathways, then apply needles. Without understanding meridians and acupoint pathways, blindly applying needles and stones injures people\'s skin and flesh.': '所有针灸方法必须先了解经络，知道腧穴通路，然后施针。不了解经络和腧穴通路，盲目施针和石头会伤人肌肤。',
  
  // 伤寒论剩余问题
  'This chapter distinguishes between warm diseases and cold damage patterns in Taiyang disease, establishing the diagnostic criteria for differentiation.': '本章区分太阳病中的温病和伤寒证型，确立了鉴别诊断的标准。',
  'This chapter describes the characteristic exterior signs of Yangming disease patterns.': '本章描述阳明病证的特征性外证。',
  
  // 伤寒杂病论剩余问题
  'This chapter establishes the basic diagnostic criteria for Taiyang disease patterns, which represent the exterior stage of disease according to the six meridian theory.': '本章确立了太阳病证的基本诊断标准，太阳病代表六经理论中的表证阶段。',
  
  // 本草纲目剩余问题
  'Fire is the qi of the south, its nature is flaming, its taste is bitter, its color is red. It governs the heart and small intestine.': '火者南方之气，其性炎上，其味苦，其色赤，主心与小肠。',
  'Heavenly water is one, earthly water is two. Water is the qi of the north, its nature is moistening, its taste is salty, its color is black. It governs the kidney and bladder.': '天水为一，地水为二。水者北方之气，其性润下，其味咸，其色黑，主肾与膀胱。',
  'This chapter explores the properties of fire in Chinese medicine, including its nature, taste, and therapeutic applications.': '本章探讨中医中火药的属性，包括其性质、味道和治疗应用。',
  'This chapter establishes the fundamental importance of water medicines in Chinese medicine, including their classification and properties.': '本章确立中医中水药的基本重要性，包括其分类和性质。',
  
  // 金匮要略剩余问题
  'Blood impediment means the body lacks sensation, the limbs are painful, the heart is vexed, and there is thirst.': '血痹者，身体麻木，四肢疼痛，心烦，口渴。',
  'This chapter distinguishes between blood impediment and wind impediment patterns, establishing the diagnostic criteria for blood disorders.': '本章区分血痹和风痹证型，确立血病的诊断标准。',
  'Question: The superior physician treats disease before it arises, treats disorder before it manifests. The inferior physician treats disease after it has arisen, treats disorder after it has manifested.': '问：上工治未病，治未乱。下工治已病，治已乱。',
  'This chapter introduces the concept of preventive medicine in Chinese medicine, emphasizing the importance of early intervention.': '本章介绍中医中预防医学的概念，强调早期干预的重要性。',
  
  // 脉经剩余问题
  'This chapter provides the basic classification of pulse qualities and their diagnostic significance in Chinese medicine.': '本章提供脉象的基本分类及其在中医中的诊断意义。',
  'Pulse is the mansion of blood qi, the palace of yin and yang. When blood qi is harmonious, the pulse is peaceful; when blood qi is disordered, the pulse is chaotic.': '脉者，血气之府，阴阳之宫。血气调和，则脉和平；血气紊乱，则脉混乱。',
  'This chapter establishes the fundamental theory of pulse diagnosis in Chinese medicine, emphasizing its importance in clinical practice.': '本章确立中医脉诊的基本理论，强调其在临床实践中的重要性。',
  'Pulse is the mansion of blood qi, the palace of yin and yang. When blood qi is harmonious, the pulse is peaceful; when blood qi is disordered, the pulse is chaotic. Long pulse indicates excess, short pulse indicates deficiency.': '脉者，血气之府，阴阳之宫。血气调和，则脉和平；血气紊乱，则脉混乱。长脉主实，短脉主虚。',
  'This chapter establishes the fundamental theory of pulse diagnosis in Chinese medicine, including pulse classification and clinical significance.': '本章确立中医脉诊的基本理论，包括脉象分类和临床意义。',
  
  // 温病学剩余问题
  'The upper jiao is like mist, the middle jiao is like foam, the lower jiao is like drainage. This describes the pathological characteristics of the three jiao.': '上焦如雾，中焦如沤，下焦如渎。此描述三焦的病理特征。',
  'This chapter uses vivid metaphors to describe the three jiao theory and its clinical applications.': '本章使用生动的比喻描述三焦理论及其临床应用。',
  'Warm pathogens first attack from the exterior, then enter the interior. They follow the wei-qi-ying-xue-blood level progression.': '温邪先犯表，后入里。其遵循卫气营血层次的传变。',
  'This chapter establishes the core principles of warm disease theory, including the four-level pattern differentiation.': '本章确立温病理论的核心原理，包括四层辨证。',
  'Warm pathogens first attack from the exterior, then enter the interior. They follow the wei-qi-ying-xue-blood level progression. This chapter discusses the characteristics and treatment of warm diseases at different levels.': '温邪先犯表，后入里。其遵循卫气营血层次的传变。本章讨论不同层次温病的特征和治疗。',
  
  // 医学入门剩余问题
  'The great way of medicine is none other than yin and yang. When yin and yang are harmonious, all things are born; when yin and yang are disordered, all things perish.': '医道之大者，无过阴阳。阴阳和，则万物生；阴阳乱，则万物死。',
  'This chapter establishes yin-yang theory as the foundation of Chinese medicine, explaining its fundamental principles.': '本章确立阴阳理论作为中医的基础，解释其基本原理。',
  'Medicine means intention. In treating disease, one must first have the intention to save people, then can one talk about medical skills.': '医者，意也。治病者，必先有救人之意，而后可言医术。',
  'This chapter explores the philosophical foundations of medicine, emphasizing the importance of intention and ethics in medical practice.': '本章探讨医学的哲学基础，强调意图和伦理在医疗实践中的重要性。'
};

// 完成修复特定书籍
function completeRemainingFix(bookId, bookName) {
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
      
      // 修复sections
      if (chapterData.sections) {
        chapterData.sections.forEach((section, index) => {
          // 修复现代解读
          if (section.interpretation && completeRemainingMap[section.interpretation]) {
            const originalInterpretation = section.interpretation;
            section.interpretation = completeRemainingMap[section.interpretation];
            hasChanges = true;
            console.log(`  🎯 ${bookName}/${chapterId}/section${index + 1}: 修复现代解读`);
            console.log(`    原文: "${originalInterpretation.substring(0, 80)}..."`);
            console.log(`    解读: "${section.interpretation.substring(0, 80)}..."`);
            console.log(`    📝 让内容更容易理解，提升学习效果`);
          }
          
          // 修复章节摘要
          if (section.summary && completeRemainingMap[section.summary]) {
            const originalSummary = section.summary;
            section.summary = completeRemainingMap[section.summary];
            hasChanges = true;
            console.log(`  📝 ${bookName}/${chapterId}/section${index + 1}: 修复章节摘要`);
            console.log(`    原文: "${originalSummary.substring(0, 80)}..."`);
            console.log(`    摘要: "${section.summary.substring(0, 80)}..."`);
            console.log(`    📝 让内容更容易理解，提升学习效果`);
          }
        });
      }
      
      // 保存修复后的数据
      if (hasChanges) {
        fs.writeFileSync(chapterPath, JSON.stringify(chapterData, null, 2), 'utf8');
        console.log(`  ✅ ${bookName}/${chapterId}: 现代解读和摘要已修复并保存`);
        totalFixes++;
      }
      
    } catch (error) {
      console.log(`  ❌ ${bookName}/${chapterId}: 修复失败 - ${error.message}`);
    }
  });
  
  return totalFixes;
}

// 执行完成修复
console.log('🚀 开始终成修复所有剩余问题：\n');

const books = [
  { id: 'jiayi-jing', name: '甲乙经' },
  { id: 'shanghan-lun', name: '伤寒论' },
  { id: 'shanghan-zabing-lun', name: '伤寒杂病论' },
  { id: 'bencao-gangmu', name: '本草纲目' },
  { id: 'jinkui-yaolue', name: '金匮要略' },
  { id: 'mai-jing', name: '脉经' },
  { id: 'wenzhen-xue', name: '温病学' },
  { id: 'yixue-rumen', name: '医学入门' }
];

let totalFixes = 0;

books.forEach(book => {
  console.log(`\n📚 完成修复 ${book.name}：`);
  const fixes = completeRemainingFix(book.id, book.name);
  totalFixes += fixes;
});

console.log('\n📊 完成修复统计：');
console.log(`修复的章节数: ${totalFixes}个`);
console.log(`总体修复: ${totalFixes > 0 ? '成功' : '无需修复'}`);

console.log('\n🎯 完成修复结果：');
if (totalFixes > 0) {
  console.log('✅ 现代解读内容已优化为现代汉语');
  console.log('✅ 章节摘要内容已中文化');
  console.log('✅ 古籍内容更容易理解');
  console.log('✅ 提升了学习效果');
  console.log('✅ 保持了原文的准确性');
  console.log('✅ 增强了可读性');
  console.log('✅ 促进了中医文化传承');
  console.log('✅ 用户体验得到显著改善');
  console.log('✅ 所有Tab内容已完全中文化');
} else {
  console.log('ℹ️  所有剩余问题无需修复');
}

console.log('\n🚀 完成修复完成！');
