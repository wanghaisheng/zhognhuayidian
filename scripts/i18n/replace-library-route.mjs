#!/usr/bin/env node

/**
 * 替换 library.tsx 文件的脚本
 * 将修复后的 library-fixed.tsx 内容替换到 library.tsx
 */

import fs from 'fs';
import path from 'path';

const SRC_ROUTES = path.resolve(process.cwd(), 'src', 'routes');
const BACKUP_FILE = path.join(SRC_ROUTES, 'library-backup.tsx');
const TARGET_FILE = path.join(SRC_ROUTES, 'library.tsx');
const FIXED_FILE = path.join(SRC_ROUTES, 'library-fixed.tsx');

try {
  // 检查文件是否存在
  if (!fs.existsSync(FIXED_FILE)) {
    console.error('❌ Fixed file not found:', FIXED_FILE);
    process.exit(1);
  }

  if (!fs.existsSync(TARGET_FILE)) {
    console.error('❌ Target file not found:', TARGET_FILE);
    process.exit(1);
  }

  // 读取修复后的内容
  const fixedContent = fs.readFileSync(FIXED_FILE, 'utf8');
  
  // 备份原文件
  if (fs.existsSync(TARGET_FILE)) {
    fs.copyFileSync(TARGET_FILE, BACKUP_FILE);
    console.log('✅ Backup created:', BACKUP_FILE);
  }
  
  // 写入修复后的内容
  fs.writeFileSync(TARGET_FILE, fixedContent, 'utf8');
  
  console.log('✅ Successfully replaced library.tsx with fixed version');
  console.log('📁 File:', TARGET_FILE);
  console.log('💾 Backup:', BACKUP_FILE);
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
