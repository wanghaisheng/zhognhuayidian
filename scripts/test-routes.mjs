import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Testing route generation...');

// Test ancient books paths
const enBooksPath = path.join(__dirname, '../src/data/snapshots/en/content/ancient-books');
const zhBooksPath = path.join(__dirname, '../src/data/snapshots/zh/content/ancient-books');

console.log(`📁 EN path: ${enBooksPath}`);
console.log(`📁 ZH path: ${zhBooksPath}`);
console.log(`📁 EN exists: ${fs.existsSync(enBooksPath)}`);
console.log(`📁 ZH exists: ${fs.existsSync(zhBooksPath)}`);

const routes = [];

if (fs.existsSync(enBooksPath)) {
  const enFiles = fs.readdirSync(enBooksPath).filter(f => f.endsWith('.json') && !f.includes('collection'));
  const enSlugs = enFiles.map(f => f.replace('.json', ''));
  routes.push(...enSlugs.map(slug => `/book/${slug}`));
  console.log(`📚 EN ancient books: ${enSlugs.join(', ')}`);
}

if (fs.existsSync(zhBooksPath)) {
  const zhFiles = fs.readdirSync(zhBooksPath).filter(f => f.endsWith('.json') && !f.includes('collection'));
  const zhSlugs = zhFiles.map(f => f.replace('.json', ''));
  routes.push(...zhSlugs.map(slug => `/zh/book/${slug}`));
  console.log(`📚 ZH ancient books: ${zhSlugs.join(', ')}`);
}

// Add static routes
routes.push('/', '/zh');

console.log('\n📋 Generated Routes:');
routes.forEach(route => console.log(`  ${route}`));

// Write to file
const outputPath = path.join(__dirname, '../prerender-routes.json');
fs.writeFileSync(outputPath, JSON.stringify(routes, null, 2));
console.log(`\n✅ Route list saved: ${outputPath}`);
