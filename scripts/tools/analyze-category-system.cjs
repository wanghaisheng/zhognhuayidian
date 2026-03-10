// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.301Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
const fs = require('fs');
const path = require('path');

console.log('🔍 系统性分析分类键设计问题...\n');

// 分析分类键的问题
console.log('📊 分类键问题分析：\n');

// 1. 数据中的分类键
console.log('1️⃣ 数据中的分类键：');
console.log('   - 主文件category字段：使用中文值（如"方剂"、"医经"）');
console.log('   - 英文主文件：使用英文键值（如"prescriptions"、"medical-classics"）');
console.log('   - 章节文件：使用拼音键（如"fu-ren-bing"、"shao-er-bing"）');

// 2. 翻译键中的映射
console.log('\n2️⃣ 翻译键中的映射：');
console.log('   - categories.fangji: "方剂"');
console.log('   - categories.fu: "血病" (不存在)');
console.log('   - categories.shao: "脏腑" (不存在)');

// 3. 问题根源
console.log('\n3️⃣ 问题根源分析：');
console.log('   ❌ 混合使用多种键命名方式');
console.log('   ❌ 章节ID使用拼音，但翻译键没有对应');
console.log('   ❌ 分类映射不完整');
console.log('   ❌ 缺乏统一的分类键设计规范');

// 4. 具体问题
console.log('\n4️⃣ 具体问题：');
console.log('   - 千金要方章节：fu-ren-bing → 试图翻译 bookDetail.categories.fu');
console.log('   - 千金要方章节：shao-er-bing → 试图翻译 bookDetail.categories.shao');
console.log('   - 但翻译键中只有 xue 和 zang，没有 fu 和 shao');

// 5. 系统性解决方案
console.log('\n5️⃣ 系统性解决方案：');

console.log('\n📋 方案A：统一使用拼音键（推荐）');
console.log('   - 所有分类使用拼音键：fangji, xue, zang, fu, shao');
console.log('   - 翻译键中补充所有缺失的拼音键');
console.log('   - 数据保持现有的拼音章节ID');

console.log('\n📋 方案B：统一使用英文键');
console.log('   - 所有分类使用英文键：prescriptions, blood, zang-fu, women, children');
console.log('   - 需要修改所有章节ID为英文');
console.log('   - 工作量较大，但更规范');

console.log('\n📋 方案C：混合映射（当前问题）');
console.log('   - 主分类用英文，章节用拼音');
console.log('   - 需要复杂的映射逻辑');
console.log('   - 不推荐，维护困难');

// 选择方案A并实施
console.log('\n🚀 实施方案A：统一使用拼音键\n');

// 读取现有翻译键
const zhTranslationPath = path.join(__dirname, '../src/locales/zh/labels/pages/book-detail.ts');
const enTranslationPath = path.join(__dirname, '../src/locales/en/labels/pages/book-detail.ts');

const zhContent = fs.readFileSync(zhTranslationPath, 'utf8');
const enContent = fs.readFileSync(enTranslationPath, 'utf8');

// 提取现有的categories对象
const zhCategoriesMatch = zhContent.match(/categories:\s*{([^}]+)}/s);
const enCategoriesMatch = enContent.match(/categories:\s*{([^}]+)}/s);

if (zhCategoriesMatch && enCategoriesMatch) {
  console.log('📝 现有翻译键：');
  
  // 解析现有键
  const existingKeys = {};
  const zhLines = zhCategoriesMatch[1].split('\n');
  zhLines.forEach(line => {
    const match = line.match(/'([^']+)':\s*'([^']+)'/);
    if (match) {
      existingKeys[match[1]] = match[2];
    }
  });
  
  Object.keys(existingKeys).forEach(key => {
    console.log(`   - ${key}: "${existingKeys[key]}"`);
  });
  
  // 识别缺失的键
  console.log('\n🔍 需要补充的拼音键：');
  const neededKeys = [
    { key: 'fu', zh: '妇人病', en: 'Women\'s Diseases' },
    { key: 'shao', zh: '小儿病', en: 'Children\'s Diseases' },
    { key: 'fangji', zh: '方剂', en: 'Prescriptions' },
    { key: 'bencao', zh: '本草', en: 'Materia Medica' },
    { key: 'zhenjiu', zh: '针灸', en: 'Acupuncture' },
    { key: 'shanghan', zh: '伤寒', en: 'Cold Damage' },
    { key: 'jinkui', zh: '金匮', en: 'Jinkui' }
  ];
  
  neededKeys.forEach(item => {
    if (!existingKeys[item.key]) {
      console.log(`   - ${item.key}: "${item.zh}" / "${item.en}"`);
    }
  });
  
  // 生成修复建议
  console.log('\n🔧 修复建议：');
  console.log('1. 在翻译键中补充所有缺失的拼音键');
  console.log('2. 确保章节ID与翻译键对应');
  console.log('3. 建立统一的分类键命名规范');
  console.log('4. 创建分类键映射验证工具');
}

console.log('\n🎯 总结：');
console.log('这是一个系统性设计问题，需要：');
console.log('✅ 统一分类键命名规范');
console.log('✅ 补充所有缺失的翻译键');
console.log('✅ 建立验证机制防止类似问题');
console.log('✅ 文档化分类键设计原则');

console.log('\n📊 影响范围：');
console.log('- 所有书籍的章节显示');
console.log('- 分类导航功能');
console.log('- 搜索和筛选功能');
console.log('- SEO和结构化数据');

console.log('\n🚀 下一步：创建修复脚本并实施解决方案');
