// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.378Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
const fs = require('fs');
const path = require('path');

console.log('🧪 测试书籍数据加载和显示...\n');

// 模拟数据加载逻辑
function testBookDataLoading(bookId, locale = 'zh') {
  console.log(`📚 测试书籍: ${bookId} (locale: ${locale})`);
  
  try {
    // 模拟数据路径
    const dataDir = path.join(__dirname, '../src/data/snapshots');
    const bookPath = path.join(dataDir, locale, 'content/ancient-books', `${bookId}.json`);
    
    if (!fs.existsSync(bookPath)) {
      console.log(`  ❌ 文件不存在: ${bookPath}`);
      return null;
    }
    
    // 读取数据
    const rawData = fs.readFileSync(bookPath, 'utf8');
    const data = JSON.parse(rawData);
    
    console.log(`  ✅ 文件存在: ${bookPath}`);
    
    // 模拟数据加载逻辑
    let bookData = null;
    
    if (data && typeof data === 'object') {
      // 中文数据：直接返回（扁平格式）
      if (locale === 'zh' && !('content' in data)) {
        console.log(`  📖 使用中文扁平格式`);
        bookData = data;
      }
      
      // 英文数据：提取content
      if ('content' in data) {
        console.log(`  📖 使用嵌套格式`);
        bookData = data.content;
      }
      
      // 如果是扁平格式，转换为嵌套格式
      if ('id' in data && 'title' in data) {
        console.log(`  📖 使用扁平格式`);
        bookData = data;
      }
    }
    
    if (bookData) {
      console.log(`  ✅ 数据加载成功`);
      console.log(`  📋 书籍信息:`);
      console.log(`    - ID: ${bookData.id}`);
      console.log(`    - 标题: ${bookData.title?.zh || bookData.title?.en || 'N/A'}`);
      console.log(`    - 朝代: ${bookData.dynasty || 'N/A'}`);
      console.log(`    - 作者: ${bookData.author || 'N/A'}`);
      console.log(`    - 分类: ${bookData.category || 'N/A'}`);
      console.log(`    - 章节数: ${bookData.metadata?.chapters || 'N/A'}`);
      console.log(`    - 字数: ${bookData.metadata?.wordCount || 'N/A'}`);
      
      if (bookData.metadata?.tags && bookData.metadata.tags.length > 0) {
        console.log(`    - 标签: ${bookData.metadata.tags.join(', ')}`);
      }
      
      return bookData;
    } else {
      console.log(`  ❌ 数据格式无法识别`);
      return null;
    }
    
  } catch (error) {
    console.log(`  ❌ 加载失败: ${error.message}`);
    return null;
  }
}

// 测试几个关键书籍
const testBooks = [
  'qianjin-fang',      // 用户反馈的书籍
  'huangdi-neijing',   // 标准书籍
  'bencao-gangmu',     // 本草类书籍
  'shanghan-zabing-lun' // 伤寒类书籍
];

console.log('🔍 开始测试数据加载...\n');

testBooks.forEach(bookId => {
  console.log(`\n${'='.repeat(50)}`);
  const zhData = testBookDataLoading(bookId, 'zh');
  const enData = testBookDataLoading(bookId, 'en');
  
  if (zhData && enData) {
    console.log(`\n🔍 中英文数据对比:`);
    console.log(`  - 中文标题: ${zhData.title?.zh || 'N/A'}`);
    console.log(`  - 英文标题: ${enData.title?.en || 'N/A'}`);
    console.log(`  - 中文朝代: ${zhData.dynasty || 'N/A'}`);
    console.log(`  - 英文朝代: ${enData.dynasty || 'N/A'}`);
    console.log(`  - 中文作者: ${zhData.author || 'N/A'}`);
    console.log(`  - 英文作者: ${enData.author || 'N/A'}`);
    console.log(`  - 中文分类: ${zhData.category || 'N/A'}`);
    console.log(`  - 英文分类: ${enData.category || 'N/A'}`);
  }
});

console.log(`\n${'='.repeat(50)}`);
console.log('🎉 数据加载测试完成！');

// 测试翻译键
console.log('\n🔍 测试翻译键...');

const zhTranslations = path.join(__dirname, '../src/locales/zh/labels/pages/book-detail.ts');
const enTranslations = path.join(__dirname, '../src/locales/en/labels/pages/book-detail.ts');

if (fs.existsSync(zhTranslations) && fs.existsSync(enTranslations)) {
  // 读取TypeScript文件内容
  const zhContent = fs.readFileSync(zhTranslations, 'utf8');
  const enContent = fs.readFileSync(enTranslations, 'utf8');
  
  console.log('✅ 翻译文件存在');
  
  // 提取categories对象
  const zhCategoriesMatch = zhContent.match(/categories:\s*{([^}]+)}/s);
  const enCategoriesMatch = enContent.match(/categories:\s*{([^}]+)}/s);
  
  if (zhCategoriesMatch && enCategoriesMatch) {
    console.log('\n📋 分类翻译键检查:');
    
    // 简单解析键值对
    const zhCategories = {};
    const enCategories = {};
    
    // 提取键值对
    const zhLines = zhCategoriesMatch[1].split('\n');
    zhLines.forEach(line => {
      const match = line.match(/'([^']+)':\s*'([^']+)'/);
      if (match) {
        zhCategories[match[1]] = match[2];
      }
    });
    
    const enLines = enCategoriesMatch[1].split('\n');
    enLines.forEach(line => {
      const match = line.match(/'([^']+)':\s*'([^']+)'/);
      if (match) {
        enCategories[match[1]] = match[2];
      }
    });
    
    Object.keys(zhCategories).forEach(key => {
      const zhValue = zhCategories[key];
      const enValue = enCategories[key];
      console.log(`  - ${key}: "${zhValue}" / "${enValue}"`);
    });
    
    // 检查用户反馈的键
    const problemKeys = ['xue', 'zang', 'fangji'];
    console.log('\n🔧 问题键检查:');
    problemKeys.forEach(key => {
      if (zhCategories[key]) {
        console.log(`  ✅ ${key}: "${zhCategories[key]}"`);
      } else {
        console.log(`  ❌ ${key}: 缺失`);
      }
    });
  } else {
    console.log('❌ 无法解析categories对象');
  }
} else {
  console.log('❌ 翻译文件不存在');
}

console.log('\n🎉 翻译键测试完成！');
