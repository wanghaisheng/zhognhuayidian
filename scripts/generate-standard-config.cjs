const fs = require('fs');
const path = require('path');
function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }
function listMd(dir) { return fs.readdirSync(dir).filter(f => f.endsWith('.md')); }
function readText(p) { return fs.readFileSync(p, 'utf8'); }
function isTopChineseHeading(line) { return /^[（(]?[一二三四五六七八九十百千]+[）)]?[、\.．]/.test(line.trim()); }
function isTopArabicHeading(line) {
  const t = line.trim();
  const m = t.match(/^([★▲]?\s*)?(\d+)/);
  if (!m) return false;
  const after = t.slice(m[0].length);
  if (/^\.\d/.test(after)) return false;
  if (/^\.(?!\d)/.test(after)) return true;
  if (/^(\s|、|．|。)/.test(after)) return true;
  if (/^.*(：|:)$/.test(t)) return true;
  if (/^[^\d]/.test(after)) return true;
  return false;
}
function findConfigRanges(lines) {
  const ranges = [];
  for (let i = 0; i < lines.length; i++) {
    if (/标准配置清单|具体配置清单|配置清单|默认包含下列清单|货物配置明细|设备配置/.test(lines[i])) {
      let start = i + 1;
      let end = lines.length;
      for (let j = start; j < lines.length; j++) {
        const s = lines[j].trim();
        if (isTopChineseHeading(s) || isTopArabicHeading(s)) { end = j; break; }
      }
      ranges.push([i, start, end]);
    }
  }
  return ranges;
}
function parseItemFromLine(line) {
  let m = line.match(/^\s*([★▲]?\s*)?\d+(\.\d+)?[、\.\s\t]\s*([^\t]+?)\s+(\d+)\s*(套|台|个|项|年|批)/);
  if (m) return { name: m[3].trim(), qty: parseInt(m[4], 10), unit: m[5], raw: line };
  m = line.match(/^\s*([★▲]?\s*)?\d+(\.\d+)?\s*\t\s*([^\t]+?)\s*\t\s*(\d+)\s*\t\s*(套|台|个|项|年|批)/);
  if (m) return { name: m[3].trim(), qty: parseInt(m[4], 10), unit: m[5], raw: line };
  m = line.match(/^\s*([★▲]?\s*)?\d+(\.\d+)?[、\.\s]\s*([^\d]+?)(\d+)\s*(套|台|个|项|年|批)/);
  if (m) return { name: m[3].trim(), qty: parseInt(m[4], 10), unit: m[5], raw: line };
  return null;
}
function main() {
  const root = process.cwd();
  const srcDir = path.join(root, 'data', 'rawdata', 'specifications');
  const files = listMd(srcDir);
  const byFile = {};
  for (const f of files) {
    const text = readText(path.join(srcDir, f));
    const lines = text.split(/\r?\n/);
    const ranges = findConfigRanges(lines);
    const items = [];
    for (const [headingIdx, start] of ranges) {
      let started = false;
      for (let i = start; i < lines.length; i++) {
        const line = lines[i];
        const t = line.trim();
        if (!t) { continue; }
        if (/^序号\s+货物名称\s+数量\s+单位/.test(line) || /^序号\t货物名称\t数量\t单位/.test(line)) { continue; }
        const item = parseItemFromLine(line);
        if (item) { items.push(item); started = true; continue; }
        if (isTopChineseHeading(t) || isTopArabicHeading(t)) {
          if (i !== start) break;
          continue;
        }
        if (started) break;
      }
    }
    byFile[f] = { ranges: ranges.map(r => ({ heading_line_index: r[0], start: r[1], end: r[2] })), items };
  }
  const outDir = path.join(root, 'data', 'processed', 'analysis');
  ensureDir(outDir);
  const outJson = path.join(outDir, 'standard-config.json');
  fs.writeFileSync(outJson, JSON.stringify({ generated_at: new Date().toISOString(), by_file: byFile }, null, 2), 'utf8');
  let md = `# Standard Configuration Extract\n\nGenerated: ${new Date().toISOString()}\n`;
  for (const [fname, info] of Object.entries(byFile)) {
    md += `\n## ${fname}\n`;
    md += `Ranges: ${info.ranges.length}\n`;
    info.items.slice(0, 50).forEach(x => { md += `- ${x.name} | ${x.qty} ${x.unit}\n`; });
  }
  fs.writeFileSync(path.join(outDir, 'standard-config.md'), md, 'utf8');
  console.log(`Generated ${path.relative(root, outJson)} and standard-config.md`);
}
main();
