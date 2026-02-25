const fs = require('fs');
const path = require('path');
function listMd(dir) { return fs.readdirSync(dir).filter(f => f.endsWith('.md')); }
function readText(p) { return fs.readFileSync(p, 'utf8'); }
function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }
function isMarkdownHeading(line) { return /^#{1,6}\s/.test(line.trim()); }
function isChineseEnumerated(line) {
  const t = line.trim();
  return /^[（(]?[一二三四五六七八九十百千]+[）)]?/.test(t);
}
function isArabicEnumeratedTop(line) {
  const t = line.trim();
  const m = t.match(/^([★▲]?\s*)?(\d+)/);
  if (!m) return false;
  const after = t.slice(m[0].length);
  if (/^\.\d/.test(after)) return false; // exclude subpoints like 3.3, 4.2
  // allow "5." (dot not followed by digit), allow space/、/．/。 or immediate text, allow lines ending with ： or :
  if (/^\.(?!\d)/.test(after)) return true;
  if (/^(\s|、|．|。)/.test(after)) return true;
  if (/^.*(：|:)$/.test(t)) return true;
  // also allow immediate Chinese/letter without separator (e.g., "3具备射频发射系统")
  if (/^[^\d]/.test(after)) return true;
  return false;
}
function normalize(line) {
  return line.replace(/\s+/g, ' ').trim();
}
function extractHeadingsFromText(text) {
  const lines = text.split(/\r?\n/);
  const out = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    if (isMarkdownHeading(line) || isChineseEnumerated(line) || isArabicEnumeratedTop(line)) {
      out.push(normalize(line));
    }
  }
  return out;
}
function main() {
  const root = process.cwd();
  const srcDir = path.join(root, 'data', 'rawdata', 'specifications');
  const outDir = path.join(srcDir, 'headings');
  ensureDir(outDir);
  const files = listMd(srcDir);
  for (const f of files) {
    const full = path.join(srcDir, f);
    const text = readText(full);
    const headings = extractHeadingsFromText(text);
    const outName = f.replace(/\.md$/i, '.headings.txt');
    const outPath = path.join(outDir, outName);
    fs.writeFileSync(outPath, headings.join('\n'), 'utf8');
    console.log(`Wrote ${path.relative(root, outPath)} (${headings.length} headings)`);
  }
}
main();
