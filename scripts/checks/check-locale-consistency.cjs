const fs = require('fs');
const path = require('path');

console.log('🔍 检查中英文locale下的数据结构一致性...\n');

// 获取英文和中文数据目录
const enDir = path.join(__dirname, '../src/data/snapshots/en/content/ancient-books');
const zhDir = path.join(__dirname, '../src/data/snapshots/zh/content/ancient-books');

// 读取英文书籍文件
const enBooks = fs.readdirSync(enDir)
  .filter(file => file.endsWith('.json') && file !== 'collection.json')
  .map(file => file.replace('.json', ''));

// 读取中文书籍文件
const zhBooks = fs.existsSync(zhDir) 
  ? fs.readdirSync(zhDir)
    .filter(file => file.endsWith('.json') && file !== 'collection.json')
    .map(file => file.replace('.json', ''))
  : [];

console.log(`📚 英文书籍数量: ${enBooks.length}`);
console.log(`📚 中文书籍数量: ${zhBooks.length}`);
console.log('');

// 检查每个英文书籍的数据结构
let structureIssues = [];
let missingZhBooks = [];

enBooks.forEach(bookId => {
  console.log(`🔍 检查书籍: ${bookId}`);
  
  try {
    const enFilePath = path.join(enDir, `${bookId}.json`);
    const enData = JSON.parse(fs.readFileSync(enFilePath, 'utf8'));
    
    // 检查英文数据结构
    const enStructureCheck = checkBookStructure(enData, bookId, 'en');
    if (enStructureCheck.issues.length > 0) {
      structureIssues.push({
        bookId,
        locale: 'en',
        issues: enStructureCheck.issues
      });
    }
    
    // 检查中文版本是否存在
    const zhFilePath = path.join(zhDir, `${bookId}.json`);
    if (!fs.existsSync(zhFilePath)) {
      missingZhBooks.push(bookId);
      console.log(`  ❌ 缺少中文版本`);
    } else {
      const zhData = JSON.parse(fs.readFileSync(zhFilePath, 'utf8'));
      
      // 检查中文数据结构
      const zhStructureCheck = checkBookStructure(zhData, bookId, 'zh');
      if (zhStructureCheck.issues.length > 0) {
        structureIssues.push({
          bookId,
          locale: 'zh',
          issues: zhStructureCheck.issues
        });
      }
      
      // 对比中英文结构一致性
      const consistencyCheck = compareBookStructures(enData, zhData, bookId);
      if (consistencyCheck.issues.length > 0) {
        structureIssues.push({
          bookId,
          locale: 'consistency',
          issues: consistencyCheck.issues
        });
      }
      
      console.log(`  ✅ 中英文结构一致`);
    }
    
  } catch (error) {
    structureIssues.push({
      bookId,
      locale: 'en',
      issues: [`文件读取错误: ${error.message}`]
    });
    console.log(`  ❌ 文件读取错误: ${error.message}`);
  }
  
  console.log('');
});

// 输出检查结果
console.log('📊 检查结果总结:');
console.log(`结构问题数: ${structureIssues.length}`);
console.log(`缺少中文版本书籍数: ${missingZhBooks.length}`);
console.log('');

if (structureIssues.length > 0) {
  console.log('❌ 发现的结构问题:');
  structureIssues.forEach(issue => {
    console.log(`\n📖 ${issue.bookId} (${issue.locale}):`);
    issue.issues.forEach(problem => {
      console.log(`  - ${problem}`);
    });
  });
} else {
  console.log('✅ 所有书籍数据结构都符合标准！');
}

if (missingZhBooks.length > 0) {
  console.log('\n⚠️  缺少中文版本的书籍:');
  missingZhBooks.forEach(bookId => {
    console.log(`  - ${bookId}`);
  });
}

// 辅助函数
function checkBookStructure(data, bookId, locale) {
  const issues = [];
  
  // 检查顶层结构
  if (!data.labels) {
    issues.push('缺少 labels 字段');
  } else {
    if (!data.labels.title) issues.push('缺少 labels.title 字段');
    if (!data.labels.description) issues.push('缺少 labels.description 字段');
  }
  
  if (!data.content) {
    issues.push('缺少 content 字段');
  } else {
    const content = data.content;
    
    // 检查必需字段
    const requiredFields = ['id', 'title', 'dynasty', 'author', 'category', 'metadata', 'chapters'];
    requiredFields.forEach(field => {
      if (!content[field]) {
        issues.push(`缺少 content.${field} 字段`);
      }
    });
    
    // 检查title结构
    if (content.title && typeof content.title !== 'object') {
      issues.push('content.title 应该是对象格式');
    } else if (content.title) {
      if (!content.title.en) issues.push('缺少 content.title.en 字段');
      if (!content.title.zh) issues.push('缺少 content.title.zh 字段');
    }
    
    // 检查metadata结构
    if (content.metadata) {
      const metadata = content.metadata;
      const metadataFields = ['dynasty', 'author', 'chapters', 'wordCount', 'publishYear', 'tags', 'coverImage', 'difficulty', 'influence', 'preservation'];
      metadataFields.forEach(field => {
        if (metadata[field] === undefined) {
          issues.push(`缺少 content.metadata.${field} 字段`);
        }
      });
      
      if (!Array.isArray(metadata.tags)) {
        issues.push('content.metadata.tags 应该是数组');
      }
    }
    
    // 检查chapters结构
    if (content.chapters && Array.isArray(content.chapters)) {
      content.chapters.forEach((chapter, index) => {
        const chapterPrefix = `content.chapters[${index}]`;
        
        if (!chapter.id) issues.push(`${chapterPrefix} 缺少 id 字段`);
        if (!chapter.title) issues.push(`${chapterPrefix} 缺少 title 字段`);
        if (chapter.order === undefined) issues.push(`${chapterPrefix} 缺少 order 字段`);
        if (!chapter.summary) issues.push(`${chapterPrefix} 缺少 summary 字段`);
        if (!chapter.sections || !Array.isArray(chapter.sections)) {
          issues.push(`${chapterPrefix} 缺少 sections 数组字段`);
        }
      });
    }
    
    // 检查其他字段
    const optionalFields = ['relatedBooks', 'readingTime', 'studyNotes'];
    optionalFields.forEach(field => {
      if (content[field] && typeof content[field] !== 'object') {
        issues.push(`content.${field} 应该是对象格式`);
      }
    });
  }
  
  if (!data.metrics) {
    issues.push('缺少 metrics 字段');
  } else {
    const metrics = data.metrics;
    const metricsFields = ['totalChapters', 'totalWords', 'totalSections', 'relatedBooks', 'keyConcepts', 'readingTime', 'difficulty'];
    metricsFields.forEach(field => {
      if (metrics[field] === undefined) {
        issues.push(`缺少 metrics.${field} 字段`);
      }
    });
  }
  
  if (!data.updatedAt) {
    issues.push('缺少 updatedAt 字段');
  }
  
  if (!data.metadata) {
    issues.push('缺少 metadata 字段');
  } else {
    const fileMetadata = data.metadata;
    if (!fileMetadata.sourceFlags || !Array.isArray(fileMetadata.sourceFlags)) {
      issues.push('缺少 metadata.sourceFlags 数组字段');
    }
    if (!fileMetadata.version) issues.push('缺少 metadata.version 字段');
    if (!fileMetadata.lastReviewed) issues.push('缺少 metadata.lastReviewed 字段');
    }
  
  return { issues };
}

function compareBookStructures(enData, zhData, bookId) {
  const issues = [];
  
  // 比较基本结构
  const structureFields = ['labels', 'content', 'metrics', 'updatedAt', 'metadata'];
  structureFields.forEach(field => {
    if (!!enData[field] !== !!zhData[field]) {
      issues.push(`${field} 字段存在性不一致`);
    }
  });
  
  // 比较content结构
  if (enData.content && zhData.content) {
    const contentFields = ['id', 'dynasty', 'author', 'category'];
    contentFields.forEach(field => {
      if (enData.content[field] !== zhData.content[field]) {
        issues.push(`content.${field} 值不一致`);
      }
    });
  }
  
  return { issues };
}
