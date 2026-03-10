#!/usr/bin/env node

/**
 * 修复中文翻译文件的语法错误
 */

import fs from 'fs';
import path from 'path';

const zhHomeFile = path.resolve(process.cwd(), 'src', 'locales', 'zh', 'labels', 'pages', 'home.ts');

try {
  let content = fs.readFileSync(zhHomeFile, 'utf8');
  
  // 修复语法错误：移除多余的右括号
  content = content.replace(
    /}\s*}\s*}\s*};/,
    '  }\n};'
  );
  
  fs.writeFileSync(zhHomeFile, content, 'utf8');
  console.log('✅ Fixed syntax error in zh home.ts');
  
} catch (error) {
  console.error('❌ Error:', error.message);
}
