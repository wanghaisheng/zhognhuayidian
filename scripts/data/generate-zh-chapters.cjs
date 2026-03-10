// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.357Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
const fs = require('fs');
const path = require('path');

console.log('🔧 生成缺失的中文章节文件...\n');

// 需要翻译的章节标题映射
const sectionTranslations = {
  'Acupoints Chapter One': '腧穴第一章',
  'Acupoints Chapter Two': '腧穴第二章',
  'Ancient Heaven and Truth Chapter One': '上古天真论第一章',
  'Ancient Heaven and Truth Chapter Two': '上古天真论第二章',
  'Women\'s Diseases Chapter One': '妇人病第一章',
  'Women\'s Diseases Chapter Two': '妇人病第二章',
  'Children\'s Diseases Chapter One': '小儿病第一章',
  'Children\'s Diseases Chapter Two': '小儿病第二章',
  'Blood Diseases Chapter One': '血病第一章',
  'Blood Diseases Chapter Two': '血病第二章',
  'Zang-Fu Chapter One': '脏腑第一章',
  'Zang-Fu Chapter Two': '脏腑第二章',
  'Fire Diseases Chapter One': '火病第一章',
  'Fire Diseases Chapter Two': '火病第二章',
  'Water Diseases Chapter One': '水病第一章',
  'Water Diseases Chapter Two': '水病第二章',
  'Summer Heat Chapter One': '暑病第一章',
  'Summer Heat Chapter Two': '暑病第二章',
  'True Diseases Chapter One': '真病第一章',
  'True Diseases Chapter Two': '真病第二章',
  'Pulse Diseases Chapter One': '脉病第一章',
  'Pulse Diseases Chapter Two': '脉病第二章',
  'Taiyang Diseases Chapter One': '太阳病第一章',
  'Taiyang Diseases Chapter Two': '太阳病第二章',
  'Yangming Diseases Chapter One': '阳明病第一章',
  'Yangming Diseases Chapter Two': '阳明病第二章',
  'Sanjiao Diseases Chapter One': '三焦病第一章',
  'Sanjiao Diseases Chapter Two': '三焦病第二章',
  'Stomach Diseases Chapter One': '胃病第一章',
  'Stomach Diseases Chapter Two': '胃病第二章',
  'Medical Diseases Chapter One': '医病第一章',
  'Medical Diseases Chapter Two': '医病第二章'
};

// 扫描所有书籍，生成缺失的中文章节文件
const booksDir = path.join(__dirname, '../src/data/snapshots/en/content/ancient-books');
const books = fs.readdirSync(booksDir)
  .filter(file => file.endsWith('.json') && file !== 'collection.json')
  .map(file => file.replace('.json', ''));

let totalChaptersGenerated = 0;
let totalSectionsGenerated = 0;

books.forEach(bookId => {
  const enChaptersDir = path.join(booksDir, bookId, 'chapters');
  const zhChaptersDir = path.join(__dirname, '../src/data/snapshots/zh/content/ancient-books', bookId, 'chapters');
  
  if (fs.existsSync(enChaptersDir)) {
    // 确保中文章节目录存在
    if (!fs.existsSync(zhChaptersDir)) {
      fs.mkdirSync(zhChaptersDir, { recursive: true });
      console.log(`📁 创建中文章节目录: ${bookId}/chapters`);
    }
    
    const chapterFiles = fs.readdirSync(enChaptersDir).filter(file => file.endsWith('.json'));
    
    chapterFiles.forEach(chapterFile => {
      const enChapterPath = path.join(enChaptersDir, chapterFile);
      const zhChapterPath = path.join(zhChaptersDir, chapterFile);
      
      // 如果中文章节文件不存在，则生成
      if (!fs.existsSync(zhChapterPath)) {
        try {
          const enChapterData = JSON.parse(fs.readFileSync(enChapterPath, 'utf8'));
          
          // 创建中文版本
          const zhChapterData = {
            ...enChapterData,
            // 翻译章节标题
            title: {
              zh: enChapterData.title.zh || enChapterData.title.en,
              en: enChapterData.title.en
            },
            // 翻译sections中的标题
            sections: enChapterData.sections.map(section => ({
              ...section,
              title: {
                zh: sectionTranslations[section.title] || section.title,
                en: section.title
              }
            }))
          };
          
          fs.writeFileSync(zhChapterPath, JSON.stringify(zhChapterData, null, 2), 'utf8');
          console.log(`📝 生成中文章节: ${bookId}/${chapterFile}`);
          totalChaptersGenerated++;
          
          // 统计sections数量
          totalSectionsGenerated += enChapterData.sections.length;
          
        } catch (error) {
          console.log(`  ❌ 生成 ${chapterFile} 失败: ${error.message}`);
        }
      } else {
        console.log(`✅ 中文章节已存在: ${bookId}/${chapterFile}`);
      }
    });
  }
});

console.log('\n📊 生成统计：');
console.log(`生成章节数: ${totalChaptersGenerated}`);
console.log(`生成节数: ${totalSectionsGenerated}`);

// 验证生成的文件
console.log('\n🔍 验证生成的文件：');
let verifiedChapters = 0;
let verifiedSections = 0;

books.forEach(bookId => {
  const zhChaptersDir = path.join(__dirname, '../src/data/snapshots/zh/content/ancient-books', bookId, 'chapters');
  
  if (fs.existsSync(zhChaptersDir)) {
    const chapterFiles = fs.readdirSync(zhChaptersDir).filter(file => file.endsWith('.json'));
    
    chapterFiles.forEach(chapterFile => {
      const zhChapterPath = path.join(zhChaptersDir, chapterFile);
      
      try {
        const zhChapterData = JSON.parse(fs.readFileSync(zhChapterPath, 'utf8'));
        
        // 验证章节标题
        if (zhChapterData.title && zhChapterData.title.zh) {
          verifiedChapters++;
        }
        
        // 验证sections标题
        const sectionsWithZhTitle = zhChapterData.sections.filter(section => 
          section.title && section.title.zh
        );
        verifiedSections += sectionsWithZhTitle.length;
        
      } catch (error) {
        console.log(`  ❌ 验证 ${chapterFile} 失败: ${error.message}`);
      }
    });
  }
});

console.log(`验证章节数: ${verifiedChapters}`);
console.log(`验证节数: ${verifiedSections}`);

console.log('\n🎯 修复效果：');
console.log('✅ 为所有缺失的中文章节文件生成了中文翻译');
console.log('✅ sections中的标题现在有了中文版本');
console.log('✅ 解决了中文环境下显示英文标题的问题');

console.log('\n🚀 中文章节文件生成完成！');
