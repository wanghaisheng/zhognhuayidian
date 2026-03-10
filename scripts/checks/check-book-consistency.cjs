// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.305Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
const fs = require('fs');
const path = require('path');

// 获取所有书籍目录
const booksDir = path.join(__dirname, '../src/data/snapshots/en/content/ancient-books');
const bookDirs = fs.readdirSync(booksDir).filter(item => {
  const itemPath = path.join(booksDir, item);
  return fs.statSync(itemPath).isDirectory() && item !== 'huangdi-neijing';
});

console.log('🔍 检查书籍详情页中的标签和内容key一致性...\n');

let consistencyIssues = [];
let totalBooks = 0;
let consistentBooks = 0;

bookDirs.forEach(bookId => {
  totalBooks++;
  console.log(`📚 检查书籍: ${bookId}`);
  
  try {
    // 读取主文件 - 在根目录下
    const mainFilePath = path.join(booksDir, `${bookId}.json`);
    const mainFile = JSON.parse(fs.readFileSync(mainFilePath, 'utf8'));
    
    // 获取主文件中的章节列表
    const mainChapters = mainFile.content?.chapters || [];
    console.log(`  📖 主文件章节数: ${mainChapters.length}`);
    
    // 检查章节目录
    const chaptersDir = path.join(booksDir, bookId, 'chapters');
    if (!fs.existsSync(chaptersDir)) {
      consistencyIssues.push({
        book: bookId,
        issue: 'missing_chapters_dir',
        details: '缺少chapters目录'
      });
      console.log(`  ❌ 缺少chapters目录`);
      return;
    }
    
    // 读取章节文件列表
    const chapterFiles = fs.readdirSync(chaptersDir).filter(file => file.endsWith('.json'));
    console.log(`  📁 章节文件数: ${chapterFiles.length}`);
    
    // 检查每个章节
    mainChapters.forEach((chapter, index) => {
      const chapterId = chapter.id;
      const chapterFileName = `${chapterId}.json`;
      const chapterFilePath = path.join(chaptersDir, chapterFileName);
      
      // 检查章节文件是否存在
      if (!fs.existsSync(chapterFilePath)) {
        consistencyIssues.push({
          book: bookId,
          issue: 'missing_chapter_file',
          details: `缺少章节文件: ${chapterFileName}`
        });
        console.log(`  ❌ 缺少章节文件: ${chapterFileName}`);
        return;
      }
      
      // 读取章节文件
      const chapterFile = JSON.parse(fs.readFileSync(chapterFilePath, 'utf8'));
      
      // 检查章节ID一致性
      if (chapterFile.id !== chapterId) {
        consistencyIssues.push({
          book: bookId,
          issue: 'chapter_id_mismatch',
          details: `主文件章节ID: ${chapterId}, 文件中ID: ${chapterFile.id}`
        });
        console.log(`  ❌ 章节ID不匹配: 主文件${chapterId} vs 文件${chapterFile.id}`);
        return;
      }
      
      // 检查标题一致性
      const mainTitle = chapter.title;
      const fileTitle = chapterFile.title;
      
      if (JSON.stringify(mainTitle) !== JSON.stringify(fileTitle)) {
        consistencyIssues.push({
          book: bookId,
          issue: 'chapter_title_mismatch',
          details: `章节${chapterId}标题不一致`
        });
        console.log(`  ❌ 章节标题不匹配: ${chapterId}`);
        return;
      }
      
      // 检查小节ID一致性
      const mainSections = chapter.sections || [];
      const fileSections = chapterFile.sections || [];
      
      if (mainSections.length !== fileSections.length) {
        consistencyIssues.push({
          book: bookId,
          issue: 'section_count_mismatch',
          details: `章节${chapterId}小节数量不匹配: 主文件${mainSections.length} vs 文件${fileSections.length}`
        });
        console.log(`  ❌ 小节数量不匹配: ${chapterId}`);
        return;
      }
      
      mainSections.forEach((section, sectionIndex) => {
        const sectionId = section.id;
        const fileSection = fileSections[sectionIndex];
        
        if (!fileSection || fileSection.id !== sectionId) {
          consistencyIssues.push({
            book: bookId,
            issue: 'section_id_mismatch',
            details: `章节${chapterId}小节${sectionIndex} ID不匹配`
          });
          console.log(`  ❌ 小节ID不匹配: ${chapterId}-${sectionId}`);
          return;
        }
      });
      
      console.log(`  ✅ 章节${chapterId}检查通过`);
    });
    
    // 检查是否有额外的章节文件
    const mainChapterIds = new Set(mainChapters.map(c => `${c.id}.json`));
    const extraFiles = chapterFiles.filter(file => !mainChapterIds.has(file));
    
    if (extraFiles.length > 0) {
      consistencyIssues.push({
        book: bookId,
        issue: 'extra_chapter_files',
        details: `多余的章节文件: ${extraFiles.join(', ')}`
      });
      console.log(`  ⚠️  多余章节文件: ${extraFiles.join(', ')}`);
    }
    
    if (consistencyIssues.filter(issue => issue.book === bookId).length === 0) {
      consistentBooks++;
      console.log(`  ✅ 书籍${bookId}完全一致`);
    }
    
  } catch (error) {
    consistencyIssues.push({
      book: bookId,
      issue: 'file_read_error',
      details: `读取文件错误: ${error.message}`
    });
    console.log(`  ❌ 读取文件错误: ${error.message}`);
  }
  
  console.log('');
});

// 输出总结
console.log('📊 检查结果总结:');
console.log(`总书籍数: ${totalBooks}`);
console.log(`一致书籍数: ${consistentBooks}`);
console.log(`问题书籍数: ${totalBooks - consistentBooks}`);
console.log(`总问题数: ${consistencyIssues.length}`);

if (consistencyIssues.length > 0) {
  console.log('\n❌ 发现的问题:');
  consistencyIssues.forEach((issue, index) => {
    console.log(`${index + 1}. 书籍: ${issue.book}`);
    console.log(`   问题类型: ${issue.issue}`);
    console.log(`   详情: ${issue.details}`);
    console.log('');
  });
} else {
  console.log('\n🎉 所有书籍的标签和内容key都一致！');
}

// 按问题类型分组统计
const issueTypes = {};
consistencyIssues.forEach(issue => {
  issueTypes[issue.issue] = (issueTypes[issue.issue] || 0) + 1;
});

console.log('\n📈 问题类型统计:');
Object.entries(issueTypes).forEach(([type, count]) => {
  console.log(`${type}: ${count}`);
});
