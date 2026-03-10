#!/usr/bin/env node

/**
 * 修复 about.tsx 和 contact.tsx 文件的硬编码中文
 */

import fs from 'fs';
import path from 'path';

const SRC_ROUTES = path.resolve(process.cwd(), 'src', 'routes');

// 修复 about.tsx
function fixAboutRoute() {
  const aboutFile = path.join(SRC_ROUTES, 'about.tsx');
  const backupFile = path.join(SRC_ROUTES, 'about-backup.tsx');
  
  try {
    let content = fs.readFileSync(aboutFile, 'utf8');
    
    // 备份原文件
    fs.copyFileSync(aboutFile, backupFile);
    
    // 替换硬编码中文
    content = content.replace(
      /const title = \(localized\?\.title as string\) \|\| \(i18n\.t\('about\.seo\.title'\) as string\) \|\| \(i18n\.language === 'zh' \? '关于我们' : 'About Us'\);/,
      "const title = (localized?.title as string) || (i18n.t('about.seo.title') as string) || i18n.t('about.pageTitle', 'About Us');"
    );
    
    fs.writeFileSync(aboutFile, content, 'utf8');
    console.log('✅ Fixed about.tsx');
    console.log('💾 Backup:', backupFile);
    
  } catch (error) {
    console.error('❌ Error fixing about.tsx:', error.message);
  }
}

// 修复 contact.tsx
function fixContactRoute() {
  const contactFile = path.join(SRC_ROUTES, 'contact.tsx');
  const backupFile = path.join(SRC_ROUTES, 'contact-backup.tsx');
  
  try {
    let content = fs.readFileSync(contactFile, 'utf8');
    
    // 备份原文件
    fs.copyFileSync(contactFile, backupFile);
    
    // 替换硬编码中文
    content = content.replace(
      /const title = \(localized\?\.title as string\) \|\| \(i18n\.t\('contact\.pageTitle'\) as string\) \|\| \(i18n\.language === 'zh' \? '联系我们' : 'Contact Us'\);/,
      "const title = (localized?.title as string) || (i18n.t('contact.pageTitle') as string) || i18n.t('contact.pageTitle', 'Contact Us');"
    );
    
    fs.writeFileSync(contactFile, content, 'utf8');
    console.log('✅ Fixed contact.tsx');
    console.log('💾 Backup:', backupFile);
    
  } catch (error) {
    console.error('❌ Error fixing contact.tsx:', error.message);
  }
}

// 执行修复
console.log('🔧 Starting to fix about.tsx and contact.tsx...');
fixAboutRoute();
fixContactRoute();
console.log('✅ All fixes completed!');
