// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.313Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
const fs = require('fs');
const path = require('path');

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist' && file !== 'build') {
        scanDirectory(filePath);
      }
    } else {
      if (['.ts', '.tsx', '.js', '.jsx', '.json', '.md'].includes(path.extname(file))) {
        checkFile(filePath);
      }
    }
  });
}

function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    // Check if file is valid UTF-8
    const contentStr = content.toString('utf8');
    
    // Check for replacement character  (U+FFFD) which often indicates encoding issues
    if (contentStr.includes('\uFFFD')) {
      console.log(`[ENCODING ERROR] File contains replacement character: ${filePath}`);
    }
    
    // Check for non-ASCII characters (just for information)
    // const hasNonAscii = /[^\x00-\x7F]/.test(contentStr);
    // if (hasNonAscii) {
    //   console.log(`[NON-ASCII] File contains non-ASCII characters: ${filePath}`);
    // }
    
  } catch (e) {
    console.log(`[ERROR] Could not read file: ${filePath}`);
  }
}

console.log('Scanning for encoding issues...');
scanDirectory(process.cwd());
console.log('Scan complete.');
