#!/usr/bin/env node

/**
 * 整理国际化脚本到 i18n 目录
 */

import fs from 'fs';
import path from 'path';

const scriptsDir = path.resolve(process.cwd(), 'scripts');
const i18nDir = path.join(scriptsDir, 'i18n');

// 确保目录存在
if (!fs.existsSync(i18nDir)) {
  fs.mkdirSync(i18nDir, { recursive: true });
}

// 需要移动的国际化相关脚本
const i18nScripts = [
  'replace-search-route.mjs',
  'replace-library-route.mjs', 
  'fix-about-contact.mjs',
  'fix-syntax-error.mjs'
];

console.log('🔧 开始整理国际化脚本...');

// 移动脚本到 i18n 目录
i18nScripts.forEach(script => {
  const srcPath = path.join(scriptsDir, script);
  const destPath = path.join(i18nDir, script);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✅ 移动: ${script} -> i18n/`);
    
    // 删除原文件
    fs.unlinkSync(srcPath);
    console.log(`🗑️ 删除原文件: ${script}`);
  } else {
    console.log(`⚠️ 文件不存在: ${script}`);
  }
});

// 创建 i18n 脚本索引
const indexContent = `# 国际化脚本目录

## 📁 脚本说明

### 核心脚本
1. **replace-search-route.mjs** - 替换搜索路由文件
2. **replace-library-route.mjs** - 替换古籍库路由文件  
3. **fix-about-contact.mjs** - 修复关于和联系页面
4. **fix-syntax-error.mjs** - 修复语法错误

### 使用方法
\`\`\`bash
# 修复单个路由
node scripts/i18n/replace-search-route.mjs
node scripts/i18n/replace-library-route.mjs

# 批量修复
node scripts/i18n/fix-about-contact.mjs
\`\`\`

---

*生成时间: ${new Date().toISOString()}*
`;

fs.writeFileSync(path.join(i18nDir, 'README.md'), indexContent, 'utf8');

console.log('✅ 创建 i18n/README.md');
console.log('🎉 国际化脚本整理完成！');
