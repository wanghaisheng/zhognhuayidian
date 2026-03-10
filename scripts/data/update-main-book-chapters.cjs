// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.393Z
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

console.log('🔄 更新主文件中的章节列表...\n');

let updatedBooks = 0;
let errorBooks = 0;

bookDirs.forEach(bookId => {
  console.log(`📚 更新书籍: ${bookId}`);
  
  try {
    // 读取主文件
    const mainFilePath = path.join(booksDir, `${bookId}.json`);
    const mainFile = JSON.parse(fs.readFileSync(mainFilePath, 'utf8'));
    
    // 读取章节目录
    const chaptersDir = path.join(booksDir, bookId, 'chapters');
    if (!fs.existsSync(chaptersDir)) {
      console.log(`  ❌ 缺少chapters目录`);
      errorBooks++;
      return;
    }
    
    // 获取所有章节文件
    const chapterFiles = fs.readdirSync(chaptersDir)
      .filter(file => file.endsWith('.json'))
      .sort(); // 按文件名排序
    
    console.log(`  📁 找到章节文件: ${chapterFiles.length}个`);
    
    // 读取每个章节文件并构建章节列表
    const chapters = [];
    chapterFiles.forEach((fileName, index) => {
      const chapterFilePath = path.join(chaptersDir, fileName);
      const chapterFile = JSON.parse(fs.readFileSync(chapterFilePath, 'utf8'));
      
      // 构建章节对象，只包含基本信息
      const chapter = {
        id: chapterFile.id,
        title: chapterFile.title,
        order: chapterFile.order || index,
        summary: chapterFile.summary,
        sections: chapterFile.sections || []
      };
      
      chapters.push(chapter);
      console.log(`  ✅ 添加章节: ${chapterFile.id}`);
    });
    
    // 更新主文件
    mainFile.content.chapters = chapters;
    
    // 更新章节数量
    mainFile.content.metadata.chapters = chapters.length;
    
    // 更新统计信息
    if (mainFile.metrics) {
      mainFile.metrics.totalChapters = chapters.length;
      mainFile.metrics.totalSections = chapters.reduce((total, chapter) => {
        return total + (chapter.sections ? chapter.sections.length : 0);
      }, 0);
    }
    
    // 写回主文件
    fs.writeFileSync(mainFilePath, JSON.stringify(mainFile, null, 2), 'utf8');
    
    console.log(`  ✅ 主文件更新完成，包含${chapters.length}个章节`);
    updatedBooks++;
    
  } catch (error) {
    console.log(`  ❌ 更新失败: ${error.message}`);
    errorBooks++;
  }
  
  console.log('');
});

// 输出总结
console.log('📊 更新结果总结:');
console.log(`成功更新书籍数: ${updatedBooks}`);
console.log(`更新失败书籍数: ${errorBooks}`);
console.log(`总书籍数: ${bookDirs.length}`);

if (updatedBooks === bookDirs.length) {
  console.log('\n🎉 所有书籍的主文件都已更新！');
} else {
  console.log('\n⚠️  部分书籍更新失败，请检查错误信息。');
}
