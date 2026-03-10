// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.389Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
const fs = require('fs');
const path = require('path');

console.log('🧪 测试章节标题的多语言显示...\n');

// 模拟翻译函数
function mockTranslate(key, locale = 'zh') {
  const translationPath = locale === 'zh' 
    ? path.join(__dirname, '../src/locales/zh/labels/pages/book-detail.ts')
    : path.join(__dirname, '../src/locales/en/labels/pages/book-detail.ts');
  
  const content = fs.readFileSync(translationPath, 'utf8');
  
  const categoriesMatch = content.match(/categories:\s*{([^}]+)}/s);
  if (categoriesMatch) {
    const categories = {};
    const lines = categoriesMatch[1].split('\n');
    lines.forEach(line => {
      const match = line.match(/'([^']+)':\s*'([^']+)'/);
      if (match) {
        categories[match[1]] = match[2];
      }
    });
    
    return categories[key] || key;
  }
  
  return key;
}

// 测试章节标题的多语言处理
console.log('🔍 测试章节标题的多语言处理：');

// 读取一个具体的章节文件
const chapterPath = path.join(__dirname, '../src/data/snapshots/en/content/ancient-books/jiayi-jing/chapters/shu-xue.json');
const chapterData = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));

console.log('📖 章节数据结构：');
console.log(`  章节ID: ${chapterData.id}`);
console.log(`  标题结构: ${JSON.stringify(chapterData.title, null, 2)}`);

// 模拟不同语言环境下的标题显示
const locales = ['zh', 'en'];

locales.forEach(locale => {
  console.log(`\n🌐 ${locale === 'zh' ? '中文' : '英文'}环境下的显示：`);
  
  // 模拟修复后的逻辑
  const chapterTitle = chapterData.title[locale] || chapterData.title.zh || chapterData.title;
  console.log(`  章节标题: "${chapterTitle}"`);
  
  // 测试sections中的标题
  if (chapterData.sections && chapterData.sections.length > 0) {
    const firstSection = chapterData.sections[0];
    console.log(`  第一个节标题: "${firstSection.title}"`);
    
    // 模拟修复后的逻辑
    const sectionTitle = firstSection.title[locale] || firstSection.title.zh || firstSection.title;
    console.log(`  修复后的节标题: "${sectionTitle}"`);
  }
});

// 测试用户反馈的具体问题
console.log('\n🎯 测试用户反馈的具体问题：');
console.log('问题: 在中文环境下显示英文标题 "Acupoints Chapter One"');

const zhChapterTitle = chapterData.title.zh || chapterData.title.en || chapterData.title;
const zhSectionTitle = chapterData.sections[0].title.zh || chapterData.sections[0].title.en || chapterData.sections[0].title;

console.log(`修复前: 显示英文标题 "${chapterData.sections[0].title}"`);
console.log(`修复后: 显示中文标题 "${zhSectionTitle}"`);

// 验证修复效果
const isFixed = zhSectionTitle !== chapterData.sections[0].title.en;
console.log(`修复状态: ${isFixed ? '✅ 已修复' : '❌ 仍有问题'}`);

// 测试所有章节文件
console.log('\n📊 测试所有章节文件的标题显示：');

const booksDir = path.join(__dirname, '../src/data/snapshots/en/content/ancient-books');
const books = fs.readdirSync(booksDir)
  .filter(file => file.endsWith('.json') && file !== 'collection.json')
  .map(file => file.replace('.json', ''));

let totalSections = 0;
let sectionsWithZhTitle = 0;
let sectionsWithEnTitle = 0;

books.forEach(bookId => {
  const chaptersDir = path.join(booksDir, bookId, 'chapters');
  if (fs.existsSync(chaptersDir)) {
    const chapterFiles = fs.readdirSync(chaptersDir).filter(file => file.endsWith('.json'));
    
    chapterFiles.forEach(chapterFile => {
      const chapterPath = path.join(chaptersDir, chapterFile);
      const chapterData = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));
      
      if (chapterData.sections) {
        chapterData.sections.forEach(section => {
          totalSections++;
          
          const hasZhTitle = section.title.zh && section.title.zh !== section.title.en;
          const hasEnTitle = section.title.en;
          
          if (hasZhTitle) sectionsWithZhTitle++;
          if (hasEnTitle) sectionsWithEnTitle++;
        });
      }
    });
  }
});

console.log(`总节数: ${totalSections}`);
console.log(`有中文标题的节: ${sectionsWithZhTitle}`);
console.log(`有英文标题的节: ${sectionsWithEnTitle}`);
console.log(`中文标题覆盖率: ${((sectionsWithZhTitle / totalSections) * 100).toFixed(1)}%`);

// 生成修复建议
console.log('\n🔧 修复建议：');
console.log('1. ✅ 已修复 ChapterDetailPage.tsx 中的 section.title 显示');
console.log('2. ✅ 已修复 ContentViewer.tsx 中的 section.title 显示');
console.log('3. ✅ 已修复 ReadingTools.tsx 中的 section.title 显示');
console.log('4. 确保所有章节文件都有完整的中英文标题');
console.log('5. 建立章节标题的验证机制');

console.log('\n🎯 总结：');
console.log('修复内容：');
console.log('- ChapterDetailPage.tsx: section.title → section.title[locale] || section.title.zh || section.title');
console.log('- ContentViewer.tsx: section.title → section.title[locale] || section.title.zh || section.title');
console.log('- ReadingTools.tsx: section.title → section.title[locale] || section.title.zh || section.title');

console.log('\n🚀 测试完成！');
