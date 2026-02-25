#!/usr/bin/env node

/**
 * 翻译模板生成脚本
 * 为新语言生成翻译模板文件
 */

const fs = require('fs');
const path = require('path');

// 创建目录（如果不存在）
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 生成翻译文件模板
function generateTranslationTemplate(langCode, templateLang = 'en') {
  const templateDir = path.join(__dirname, '..', 'src', 'locales', templateLang);
  const targetDir = path.join(__dirname, '..', 'src', 'locales', langCode);
  
  if (!fs.existsSync(templateDir)) {
    console.error(`模板语言目录不存在: ${templateDir}`);
    return;
  }
  
  if (fs.existsSync(targetDir)) {
    console.error(`目标语言目录已存在: ${targetDir}`);
    return;
  }
  
  // 创建目标目录
  ensureDir(targetDir);
  
  // 复制目录结构
  function copyStructure(srcDir, destDir) {
    const items = fs.readdirSync(srcDir);
    
    for (const item of items) {
      const srcPath = path.join(srcDir, item);
      const destPath = path.join(destDir, item);
      const stat = fs.statSync(srcPath);
      
      if (stat.isDirectory()) {
        ensureDir(destPath);
        copyStructure(srcPath, destPath);
      } else if (item.endsWith('.ts')) {
        // 读取模板文件内容
        let content = fs.readFileSync(srcPath, 'utf8');
        
        // 添加翻译提示注释
        const langName = getLangName(langCode);
        content = content.replace(
          /\/\/ .* translations - English/g,
          `// ${langName} translations - ${langName}`
        );
        content = content.replace(
          /\/\/ .* - English/g,
          `// ${langName} - ${langName}`
        );
        
        // 添加待翻译标记
        content = content.replace(
          /: '([^']+)'/g,
          ": '[TODO: Translate] $1'"
        );
        content = content.replace(
          /: "([^"]+)"/g,
          ': "[TODO: Translate] $1"'
        );
        
        // 写入目标文件
        fs.writeFileSync(destPath, content);
        console.log(`创建文件: ${destPath}`);
      }
    }
  }
  
  copyStructure(templateDir, targetDir);
  
  console.log(`\n✓ 已为 ${langCode} 语言生成翻译模板`);
  console.log(`目录位置: ${targetDir}`);
  console.log('\n请完成以下步骤:');
  console.log('1. 翻译所有标记为 [TODO: Translate] 的文本');
  console.log('2. 在 src/locales/index.ts 中添加新语言资源');
  console.log('3. 更新语言配置文件');
}

// 获取语言名称
function getLangName(langCode) {
  const langNames = {
    'zh': '中文',
    'en': 'English',
    'ja': '日本語',
    'ko': '한국어',
    'fr': 'Français',
    'de': 'Deutsch',
    'es': 'Español',
    'pt': 'Português',
    'ru': 'Русский',
    'ar': 'العربية'
  };
  
  return langNames[langCode] || langCode.toUpperCase();
}

// 命令行参数处理
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('用法: node generate-translation-template.js <语言代码> [模板语言]');
  console.log('示例: node generate-translation-template.js ja en');
  console.log('\n支持的语言代码: zh, en, ja, ko, fr, de, es, pt, ru, ar');
  process.exit(1);
}

const langCode = args[0];
const templateLang = args[1] || 'en';

generateTranslationTemplate(langCode, templateLang);