const fs = require('fs');
const path = require('path');
function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }
function readText(p) { return fs.readFileSync(p, 'utf8'); }
function listMd(dir) { return fs.readdirSync(dir).filter(f => f.endsWith('.md')); }
function extractFrontmatter(text) {
  const m = text.match(/^---\s*\n([\s\S]*?)\n---\s*/);
  return m ? m[1] : '';
}
function getField(block, key) {
  const re = new RegExp(`^${key}:\\s*"?([^"\\n]+)"?\\s*$`, 'm');
  const m = block.match(re);
  return m ? m[1].trim() : null;
}
function extractPrice(block) {
  const hasPrice = /^price:\s*$/m.test(block);
  if (!hasPrice) return null;
  const currency = getField(block, '\\s{2}currency');
  const unit = getField(block, '\\s{2}unit');
  const minStr = getField(block, '\\s{2}min');
  const maxStr = getField(block, '\\s{2}max');
  const min = minStr ? parseFloat(minStr) : null;
  const max = maxStr ? parseFloat(maxStr) : null;
  return { currency, unit, min, max };
}
function unitFactor(unit) {
  const u = String(unit || '').toLowerCase();
  if (u.includes('万元')) return 10000;
  return 1;
}
function main() {
  const root = process.cwd();
  const contentDir = path.join(root, 'content', 'devices', 'en');
  const outDir = path.join(root, 'supabase', 'migrations');
  ensureDir(outDir);
  const filename = `${new Date().toISOString().slice(0,10).replace(/-/g,'')}_device_price_from_frontmatter.sql`;
  const outPath = path.join(outDir, filename);
  const files = listMd(contentDir);
  const stmts = [];
  for (const f of files) {
    const p = path.join(contentDir, f);
    const text = readText(p);
    const fm = extractFrontmatter(text);
    if (!fm) continue;
    const slug = getField(fm, 'slug');
    const price = extractPrice(fm);
    if (!slug || !price || typeof price.min !== 'number' || typeof price.max !== 'number') continue;
    const factor = unitFactor(price.unit);
    const min = (price.min || 0) * factor;
    const max = (price.max || 0) * factor;
    const currency = price.currency || 'CNY';
    const sql = `UPDATE devices
SET price_range_min = COALESCE(price_range_min, ${min}),
    price_range_max = COALESCE(price_range_max, ${max}),
    price_currency  = COALESCE(price_currency, '${currency}')
WHERE slug = '${slug}';`;
    stmts.push(sql);
  }
  if (stmts.length === 0) {
    fs.writeFileSync(outPath, '-- No price data found in frontmatter\n', 'utf8');
  } else {
    fs.writeFileSync(outPath, stmts.join('\n') + '\n', 'utf8');
  }
  console.log(`Wrote migration: ${outPath} with ${stmts.length} statements`);
}
main();
