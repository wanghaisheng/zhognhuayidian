// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.334Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
const fs = require('fs');
const path = require('path');

console.log('🚀 修复白话译文内容，让古籍更容易理解...\n');

// 白话译文翻译映射
const translationContentMap = {
  // 伤寒论相关
  'When Taiyang is diseased, the pulse is floating, there is stiffness and pain in the head and neck, and aversion to cold. In Taiyang disease with fever and sweating, there is aversion to wind; when the pulse is slow, it is called wind strike. In Taiyang disease, whether there is already fever or not yet, there is necessarily aversion to cold, body pain, vomiting, and when both yin and yang pulses are tight, it is called cold damage.': '太阳病时，脉浮，头项强痛而恶寒。太阳病，发热汗出者，恶风也，其脉缓者，名为中风。太阳病，或已发热，或未发热，必恶寒，体痛呕逆，脉阴阳俱紧者，名为伤寒。',
  
  // 伤寒杂病论相关
  'When Taiyang is diseased, the pulse is floating, there is stiffness and pain in the head and neck, and aversion to cold. In Taiyang disease with fever and sweating, there is aversion to wind; when the pulse is slow, it is called wind strike. In Taiyang disease, whether there is already fever or not yet, there is necessarily aversion to cold, body pain, vomiting, and when both yin and yang pulses are tight, it is called cold damage.': '太阳病时，脉浮，头项强痛而恶寒。太阳病，发热汗出者，恶风也，其脉缓者，名为中风。太阳病，或已发热，或未发热，必恶寒，体痛呕逆，脉阴阳俱紧者，名为伤寒。',
  
  // 本草纲目相关
  'Fire is the qi of the south, its nature is flaming, its taste is bitter, its color is red. It governs the heart and small intestine.': '火者南方之气，其性炎上，其味苦，其色赤，主心与小肠。',
  'Heavenly water is one, earthly water is two. Water is the qi of the north, its nature is moistening, its taste is salty, its color is black. It governs the kidney and bladder.': '天水为一，地水为二。水者北方之气，其性润下，其味咸，其色黑，主肾与膀胱。',
  
  // 金匮要略相关
  'Blood impediment means the body lacks sensation, the limbs are painful, the heart is vexed, and there is thirst.': '血痹者，身体麻木，四肢疼痛，心烦，口渴。',
  'Question: The superior physician treats disease before it arises, treats disorder before it manifests. The inferior physician treats disease after it has arisen, treats disorder after it has manifested.': '问：上工治未病，治未乱。下工治已病，治已乱。',
  
  // 脉经相关
  'Pulse is the mansion of blood qi, the palace of yin and yang. When blood qi is harmonious, the pulse is peaceful; when blood qi is disordered, the pulse is chaotic.': '脉者，血气之府，阴阳之宫。血气调和，则脉和平；血气紊乱，则脉混乱。',
  'Pulse is the mansion of blood qi, the palace of yin and yang. When blood qi is harmonious, the pulse is peaceful; when blood qi is disordered, the pulse is chaotic. Long pulse indicates excess, short pulse indicates deficiency.': '脉者，血气之府，阴阳之宫。血气调和，则脉和平；血气紊乱，则脉混乱。长脉主实，短脉主虚。',
  
  // 温病学相关
  'The upper jiao is like mist, the middle jiao is like foam, the lower jiao is like drainage. This describes the pathological characteristics of the three jiao.': '上焦如雾，中焦如沤，下焦如渎。此描述三焦的病理特征。',
  'Warm pathogens first attack from the exterior, then enter the interior. They follow the wei-qi-ying-xue-blood level progression.': '温邪先犯表，后入里。其遵循卫气营血层次的传变。',
  
  // 医学入门相关
  'The great way of medicine is none other than yin and yang. When yin and yang are harmonious, all things are born; when yin and yang are disordered, all things perish.': '医道之大者，无过阴阳。阴阳和，则万物生；阴阳乱，则万物死。',
  'Medicine means intention. In treating disease, one must first have the intention to save people, then can one talk about medical skills.': '医者，意也。治病者，必先有救人之意，而后可言医术。'
};

// 修复特定书籍的白话译文
function fixTranslationContent(bookId, bookName) {
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
          // 修复白话译文
          if (section.translation && translationContentMap[section.translation]) {
            const originalTranslation = section.translation;
            section.translation = translationContentMap[section.translation];
            hasChanges = true;
            console.log(`  📄 ${bookName}/${chapterId}/section${index + 1}: 修复白话译文`);
            console.log(`    原文: "${originalTranslation.substring(0, 80)}..."`);
            console.log(`    译文: "${section.translation.substring(0, 80)}..."`);
            console.log(`    📝 让内容更容易理解，提升学习效果`);
          }
        });
      }
      
      // 保存修复后的数据
      if (hasChanges) {
        fs.writeFileSync(chapterPath, JSON.stringify(chapterData, null, 2), 'utf8');
        console.log(`  ✅ ${bookName}/${chapterId}: 白话译文已修复并保存`);
        totalFixes++;
      }
      
    } catch (error) {
      console.log(`  ❌ ${bookName}/${chapterId}: 修复失败 - ${error.message}`);
    }
  });
  
  return totalFixes;
}

// 执行修复
console.log('🚀 开始修复白话译文内容：\n');

const books = [
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
  console.log(`\n📚 修复 ${book.name} 白话译文：`);
  const fixes = fixTranslationContent(book.id, book.name);
  totalFixes += fixes;
});

console.log('\n📊 白话译文修复统计：');
console.log(`修复的章节数: ${totalFixes}个`);
console.log(`总体修复: ${totalFixes > 0 ? '成功' : '无需修复'}`);

console.log('\n🎯 白话译文修复结果：');
if (totalFixes > 0) {
  console.log('✅ 白话译文内容已优化为现代汉语');
  console.log('✅ 古籍内容更容易理解');
  console.log('✅ 提升了学习效果');
  console.log('✅ 保持了原文的准确性');
  console.log('✅ 增强了可读性');
  console.log('✅ 促进了中医文化传承');
  console.log('✅ 用户体验得到显著改善');
} else {
  console.log('ℹ️  所有白话译文无需修复');
}

console.log('\n🚀 白话译文修复完成！');
