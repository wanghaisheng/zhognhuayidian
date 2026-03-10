// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.329Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
const fs = require('fs');
const path = require('path');

console.log('🔧 修复中英文字段值不一致问题...\n');

// 获取英文和中文数据目录
const enDir = path.join(__dirname, '../src/data/snapshots/en/content/ancient-books');
const zhDir = path.join(__dirname, '../src/data/snapshots/zh/content/ancient-books');

// 获取书籍列表
const books = fs.readdirSync(enDir)
  .filter(file => file.endsWith('.json') && file !== 'collection.json')
  .map(file => file.replace('.json', ''));

console.log(`📚 需要修复的书籍数量: ${books.length}`);

// 字段值映射表
const fieldMappings = {
  // 朝代映射
  dynasty: {
    'Pre-Qin': '先秦',
    'Eastern Han': '东汉',
    'Three Kingdoms': '三国',
    'Western Jin': '西晋',
    'Tang': '唐代',
    'Song': '宋代',
    'Ming': '明代',
    'Qing': '清代'
  },
  
  // 作者映射
  author: {
    'Anonymous': '佚名',
    'Zhang Zhongjing': '张仲景',
    'Huangfu Mi': '皇甫谧',
    'Wang Shuhe': '王叔和',
    'Sun Simiao': '孙思邈',
    'Ye Tianshi': '叶天士',
    'Li Ting': '李梴',
    'Li Shizhen': '李时珍'
  },
  
  // 分类映射
  category: {
    'medical-classics': '医经',
    'materia-medica': '本草',
    'shanghan': '伤寒金匮',
    'jinkui': '伤寒金匮',
    'acupuncture': '针灸',
    'prescriptions': '方剂',
    'clinical-medicine': '临床医学',
    'basic-theory': '基础理论',
    'wenzhen': '温病'
  }
};

// 修复每个书籍
books.forEach(bookId => {
  console.log(`\n🔧 修复书籍: ${bookId}`);
  
  try {
    // 读取英文数据
    const enFilePath = path.join(enDir, `${bookId}.json`);
    const enData = JSON.parse(fs.readFileSync(enFilePath, 'utf8'));
    
    // 读取中文数据
    const zhFilePath = path.join(zhDir, `${bookId}.json`);
    const zhData = JSON.parse(fs.readFileSync(zhFilePath, 'utf8'));
    
    let hasChanges = false;
    
    // 修复content层面的字段
    if (enData.content && zhData.content) {
      // 修复朝代
      if (enData.content.dynasty && fieldMappings.dynasty[enData.content.dynasty]) {
        const correctDynasty = fieldMappings.dynasty[enData.content.dynasty];
        if (zhData.content.dynasty !== correctDynasty) {
          zhData.content.dynasty = correctDynasty;
          hasChanges = true;
          console.log(`  ✅ 修复朝代: ${enData.content.dynasty} -> ${correctDynasty}`);
        }
      }
      
      // 修复作者
      if (enData.content.author && fieldMappings.author[enData.content.author]) {
        const correctAuthor = fieldMappings.author[enData.content.author];
        if (zhData.content.author !== correctAuthor) {
          zhData.content.author = correctAuthor;
          hasChanges = true;
          console.log(`  ✅ 修复作者: ${enData.content.author} -> ${correctAuthor}`);
        }
      }
      
      // 修复分类
      if (enData.content.category && fieldMappings.category[enData.content.category]) {
        const correctCategory = fieldMappings.category[enData.content.category];
        if (zhData.content.category !== correctCategory) {
          zhData.content.category = correctCategory;
          hasChanges = true;
          console.log(`  ✅ 修复分类: ${enData.content.category} -> ${correctCategory}`);
        }
      }
      
      // 修复metadata层面的字段
      if (zhData.content.metadata) {
        // 修复metadata中的朝代
        if (enData.content.metadata?.dynasty && fieldMappings.dynasty[enData.content.metadata.dynasty]) {
          const correctDynasty = fieldMappings.dynasty[enData.content.metadata.dynasty];
          if (zhData.content.metadata.dynasty !== correctDynasty) {
            zhData.content.metadata.dynasty = correctDynasty;
            hasChanges = true;
            console.log(`  ✅ 修复metadata朝代: ${enData.content.metadata.dynasty} -> ${correctDynasty}`);
          }
        }
        
        // 修复metadata中的作者
        if (enData.content.metadata?.author && fieldMappings.author[enData.content.metadata.author]) {
          const correctAuthor = fieldMappings.author[enData.content.metadata.author];
          if (zhData.content.metadata.author !== correctAuthor) {
            zhData.content.metadata.author = correctAuthor;
            hasChanges = true;
            console.log(`  ✅ 修复metadata作者: ${enData.content.metadata.author} -> ${correctAuthor}`);
          }
        }
      }
    }
    
    // 如果有修改，写回文件
    if (hasChanges) {
      fs.writeFileSync(zhFilePath, JSON.stringify(zhData, null, 2), 'utf8');
      console.log(`  💾 已更新: ${zhFilePath}`);
    } else {
      console.log(`  ✅ 无需修改`);
    }
    
  } catch (error) {
    console.error(`  ❌ 修复失败: ${error.message}`);
  }
});

console.log('\n🎉 字段值一致性修复完成！');

// 再次运行一致性检查验证结果
console.log('\n🔍 验证修复结果...');
const { execSync } = require('child_process');
try {
  const result = execSync('node scripts/check-locale-consistency.cjs', { 
    encoding: 'utf8',
    cwd: __dirname.replace('/scripts', '')
  });
  console.log(result);
} catch (error) {
  console.log('验证执行失败:', error.message);
}
