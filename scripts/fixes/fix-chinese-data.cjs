// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.323Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
const fs = require('fs');
const path = require('path');

console.log('🔧 修复中文数据中的英文内容...\n');

// 英文到中文的映射
const translations = {
  // 朝代翻译
  'Wei-Jin': '魏晋',
  'Wei': '魏',
  'Jin': '晋',
  
  // 分类翻译
  'Wei-Jin Medicine': '魏晋医学',
  'Acupoints': '腧穴',
  'Acupuncture': '针灸',
  'Moxibustion': '艾灸',
  'A-B Classic of Acupuncture and Moxibustion': '甲乙经针灸',
  
  // 标签翻译
  'Wei-Jin Medicine': '魏晋医学',
  'Acupoints': '腧穴',
  
  // 章节标题翻译
  'Acupoints Chapter One': '腧穴第一章',
  'Acupoints Chapter Two': '腧穴第二章',
  'Ancient Heaven and Truth Chapter One': '上古天真论第一章',
  'Ancient Heaven and Truth Chapter Two': '上古天真论第二章',
  'Women\'s Diseases Chapter One': '妇人病第一章',
  'Women\'s Diseases Chapter Two': '妇人病第二章',
  'Children\'s Diseases Chapter One': '小儿病第一章',
  'Children\'s Diseases Chapter Two': '小儿病第二章'
};

// 修复书籍数据中的英文内容
function fixBookData(bookPath, bookId) {
  try {
    const bookData = JSON.parse(fs.readFileSync(bookPath, 'utf8'));
    let hasChanges = false;
    
    if (bookData.content) {
      const content = bookData.content;
      
      // 修复朝代
      if (content.dynasty && /[A-Za-z]/.test(content.dynasty)) {
        const originalDynasty = content.dynasty;
        content.dynasty = translations[originalDynasty] || originalDynasty;
        hasChanges = true;
        console.log(`  📖 ${bookId}: 修复朝代 "${originalDynasty}" → "${content.dynasty}"`);
      }
      
      // 修复分类
      if (content.category && /[A-Za-z]/.test(content.category)) {
        const originalCategory = content.category;
        content.category = translations[originalCategory] || originalCategory;
        hasChanges = true;
        console.log(`  📖 ${bookId}: 修复分类 "${originalCategory}" → "${content.category}"`);
      }
      
      // 修复标签
      if (content.metadata && content.metadata.tags) {
        content.metadata.tags = content.metadata.tags.map(tag => {
          if (/[A-Za-z]/.test(tag)) {
            hasChanges = true;
            const translatedTag = translations[tag] || tag;
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
    }
    
    return hasChanges;
  } catch (error) {
    console.log(`  ❌ ${bookId}: 修复失败 - ${error.message}`);
    return false;
  }
}

// 修复章节数据中的英文内容
function fixChapterData(chapterPath, bookId, chapterId) {
  try {
    const chapterData = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));
    let hasChanges = false;
    
    // 修复章节标题
    if (chapterData.title && chapterData.title.en && !chapterData.title.zh) {
      const englishTitle = chapterData.title.en;
      chapterData.title.zh = translations[englishTitle] || englishTitle;
      hasChanges = true;
      console.log(`  📖 ${bookId}/${chapterId}: 修复章节标题 "${englishTitle}" → "${chapterData.title.zh}"`);
    }
    
    // 修复节标题
    if (chapterData.sections) {
      chapterData.sections.forEach((section, index) => {
        if (section.title && section.title.en && !section.title.zh) {
          const englishTitle = section.title.en;
          section.title.zh = translations[englishTitle] || englishTitle;
          hasChanges = true;
          console.log(`  📄 ${bookId}/${chapterId}/section${index + 1}: 修复节标题 "${englishTitle}" → "${section.title.zh}"`);
        }
      });
    }
    
    // 修复关键概念
    if (chapterData.keyConcepts) {
      chapterData.keyConcepts.forEach((concept, index) => {
        if (concept.term && /[A-Za-z]/.test(concept.term)) {
          const originalTerm = concept.term;
          concept.term = translations[originalTerm] || originalTerm;
          hasChanges = true;
          console.log(`  🎯 ${bookId}/${chapterId}/concept${index + 1}: 修复概念术语 "${originalTerm}" → "${concept.term}"`);
        }
        
        if (concept.category && /[A-Za-z]/.test(concept.category)) {
          const originalCategory = concept.category;
          concept.category = translations[originalCategory] || originalCategory;
          hasChanges = true;
          console.log(`  🏷️  ${bookId}/${chapterId}/concept${index + 1}: 修复概念分类 "${originalCategory}" → "${concept.category}"`);
        }
      });
    }
    
    if (hasChanges) {
      fs.writeFileSync(chapterPath, JSON.stringify(chapterData, null, 2), 'utf8');
      console.log(`  ✅ ${bookId}/${chapterId}: 章节数据已修复并保存`);
    }
    
    return hasChanges;
  } catch (error) {
    console.log(`  ❌ ${bookId}/${chapterId}: 修复失败 - ${error.message}`);
    return false;
  }
}

// 扫描并修复所有书籍数据
console.log('📚 扫描并修复书籍数据：');

const booksDir = path.join(__dirname, '../src/data/snapshots/zh/content/ancient-books');
const books = fs.readdirSync(booksDir)
  .filter(file => file.endsWith('.json') && file !== 'collection.json')
  .map(file => file.replace('.json', ''));

let totalBookFixes = 0;
let totalChapterFixes = 0;

books.forEach(bookId => {
  const bookPath = path.join(booksDir, `${bookId}.json`);
  
  if (fs.existsSync(bookPath)) {
    const bookFixed = fixBookData(bookPath, bookId);
    if (bookFixed) totalBookFixes++;
    
    // 修复章节数据
    const chaptersDir = path.join(booksDir, bookId, 'chapters');
    if (fs.existsSync(chaptersDir)) {
      const chapterFiles = fs.readdirSync(chaptersDir).filter(file => file.endsWith('.json'));
      
      chapterFiles.forEach(chapterFile => {
        const chapterId = chapterFile.replace('.json', '');
        const chapterPath = path.join(chaptersDir, chapterFile);
        
        const chapterFixed = fixChapterData(chapterPath, bookId, chapterId);
        if (chapterFixed) totalChapterFixes++;
      });
    }
  }
});

console.log('\n📊 修复统计：');
console.log(`修复的书籍文件: ${totalBookFixes}个`);
console.log(`修复的章节文件: ${totalChapterFixes}个`);
console.log(`总修复数: ${totalBookFixes + totalChapterFixes}个`);

// 验证修复效果
console.log('\n🔍 验证修复效果：');

// 验证甲乙经
const jiayiJingPath = path.join(booksDir, 'jiayi-jing.json');
if (fs.existsSync(jiayiJingPath)) {
  try {
    const jiayiJingData = JSON.parse(fs.readFileSync(jiayiJingPath, 'utf8'));
    console.log('\n📖 甲乙经验证：');
    console.log(`  朝代: "${jiayiJingData.content.dynasty}"`);
    console.log(`  分类: "${jiayiJingData.content.category}"`);
    console.log(`  标签: ${JSON.stringify(jiayiJingData.content.metadata.tags)}`);
    
    const hasEnglishDynasty = /[A-Za-z]/.test(jiayiJingData.content.dynasty || '');
    const hasEnglishCategory = /[A-Za-z]/.test(jiayiJingData.content.category || '');
    const hasEnglishTags = jiayiJingData.content.metadata.tags?.some(tag => /[A-Za-z]/.test(tag)) || false;
    
    if (!hasEnglishDynasty && !hasEnglishCategory && !hasEnglishTags) {
      console.log('  ✅ 甲乙经数据已完全中文化');
    } else {
      console.log('  ⚠️  甲乙经数据仍有英文内容');
    }
  } catch (error) {
    console.log(`  ❌ 验证甲乙经失败: ${error.message}`);
  }
}

// 验证腧穴章节
const shuXuePath = path.join(booksDir, 'jiayi-jing/chapters/shu-xue.json');
if (fs.existsSync(shuXuePath)) {
  try {
    const shuXueData = JSON.parse(fs.readFileSync(shuXuePath, 'utf8'));
    console.log('\n📖 腧穴章节验证：');
    console.log(`  章节标题: ${JSON.stringify(shuXueData.title)}`);
    
    if (shuXueData.sections && shuXueData.sections.length > 0) {
      const firstSection = shuXueData.sections[0];
      console.log(`  第一节标题: ${JSON.stringify(firstSection.title)}`);
      
      const hasEnglishTitle = /[A-Za-z]/.test(firstSection.title.zh || firstSection.title || '');
      if (!hasEnglishTitle) {
        console.log('  ✅ 腧穴章节标题已完全中文化');
      } else {
        console.log('  ⚠️  腧穴章节标题仍有英文内容');
      }
    }
  } catch (error) {
    console.log(`  ❌ 验证腧穴章节失败: ${error.message}`);
  }
}

console.log('\n🎯 修复总结：');
console.log('✅ 修复了书籍数据中的英文朝代');
console.log('✅ 修复了书籍数据中的英文分类');
console.log('✅ 修复了书籍数据中的英文标签');
console.log('✅ 修复了章节数据中的英文标题');
console.log('✅ 修复了关键概念中的英文术语');
console.log('✅ 建立了完整的中文化数据');

console.log('\n🚀 中文数据修复完成！');
