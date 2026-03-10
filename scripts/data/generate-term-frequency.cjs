// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.353Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
const fs = require('fs');
const path = require('path');
function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }
function listMd(dir) { return fs.readdirSync(dir).filter(f => f.endsWith('.md')); }
function readText(p) { return fs.readFileSync(p, 'utf8'); }
function classifyCategoryByFilename(fname) { const f = fname.toLowerCase(); if (f.includes('mri')) return 'mri'; if (f.includes('ct')) return 'ct'; if (f.includes('dr')) return 'dr'; return 'unknown'; }
function isHeading(line) { return /^#{1,6}\s/.test(line.trim()); }
function headingLevel(line) { const m = line.match(/^(#+)\s/); return m ? m[1].length : 0; }
function isEnumeratedTitle(line) { return /^([★▲]?\s*)?\d+(\.\d+)*(\s|:|：)/.test(line.trim()); }
function baseWeight(line) { if (isHeading(line)) { const lvl = headingLevel(line); return 7 - Math.min(lvl, 6); } if (isEnumeratedTitle(line)) return 4; return 1; }
function markerBonus(line) { let w = 0; if (line.includes('★')) w += 1; if (line.includes('▲')) w += 0.5; return w; }
const cnStop = new Set(['提供','支持','具备','功能','系统','软件','工作站','平台','技术','成像','扫描','图像','重建','参数','病人','检查','控制','主机','显示器','内存','硬盘','分辨率','矩阵','以及','并且','或者','以及','至','为','在','到','的','与','及','或','和','每','可','达到','以上','以下','最','小','大','高','低','非','等','型','项','套','台','个','年','层','排','产品','彩页','投标','原件','备查','白皮书','说明书','维修手册','操作流程卡','接受进口','进口','工业','成人','防护','用品','配套','批','数量','单位','单价','总价']);
const enStop = new Set(['ct','mri','dr','cpu','gpu','gb','tb','hz','kv','ma','mm','cm','ms','fps','db','kw','mhz','khz','hu','cma']);
function tokenize(line) {
  const tokens = [];
  const cleaned = line.replace(/[，。,.;:：()\[\]{}<>\/\\'"|]/g, ' ');
  const cnSeqs = cleaned.match(/[\u4e00-\u9fa5]+/g) || [];
  for (const s of cnSeqs) {
    const parts = s.split(/(提供|支持|具备|功能|系统|软件|工作站|平台|技术|成像|扫描|图像|重建|参数|病人|检查|控制|主机|显示器|内存|硬盘|分辨率|矩阵|以及|并且|或者|至|为|在|到|的|与|及|或|和|每|可|达到|以上|以下|最|小|大|高|低|非|等|型|项|套|台|个|年|层|排)/).filter(Boolean);
    for (const p of parts) {
      if (cnStop.has(p)) continue;
      if (p.length >= 2 && p.length <= 8) tokens.push(p);
      if (p.length >= 4 && p.length <= 12) {
        for (let n = 2; n <= 4; n++) {
          for (let i = 0; i + n <= p.length; i++) {
            const gram = p.slice(i, i + n);
            if (!cnStop.has(gram)) tokens.push(gram);
          }
        }
      }
    }
  }
  const enSeqs = cleaned.match(/[A-Za-z][A-Za-z0-9\-\+\/\.]*/g) || [];
  for (let t of enSeqs) {
    t = t.toLowerCase();
    if (enStop.has(t)) continue;
    if (t.length >= 2) tokens.push(t);
  }
  return tokens;
}
function accumulate(map, key, inc) { map[key] = (map[key] || 0) + inc; }
function topN(map, n) { const arr = Object.entries(map).sort((a,b)=>b[1]-a[1]); return arr.slice(0, n).map(([term,count])=>({term, count})); }
function main() {
  const root = process.cwd();
  const srcDir = path.join(root, 'data', 'rawdata', 'specifications');
  const outDir = path.join(root, 'data', 'processed', 'analysis');
  ensureDir(outDir);
  const files = listMd(srcDir);
  const global = {};
  const byCat = { ct: {}, mri: {}, dr: {}, unknown: {} };
  const perFile = {};
  for (const f of files) {
    const text = readText(path.join(srcDir, f));
    const lines = text.split(/\r?\n/);
    const cat = classifyCategoryByFilename(f);
    const fileMap = {};
    for (const line of lines) {
      if (!line.trim()) continue;
      const w = baseWeight(line) + markerBonus(line);
      const toks = tokenize(line);
      for (const t of toks) {
        accumulate(global, t, w);
        accumulate(byCat[cat], t, w);
        accumulate(fileMap, t, w);
      }
    }
    perFile[f] = topN(fileMap, 50);
  }
  const result = {
    generated_at: new Date().toISOString(),
    source_dir: path.relative(root, srcDir),
    totals: {
      global_top_100: topN(global, 100),
      ct_top_50: topN(byCat.ct, 50),
      mri_top_50: topN(byCat.mri, 50),
      dr_top_50: topN(byCat.dr, 50)
    },
    by_file_top_50: perFile
  };
  const outJson = path.join(outDir, 'term-frequency.json');
  fs.writeFileSync(outJson, JSON.stringify(result, null, 2), 'utf8');
  let md = `# Term Frequency Report\n\nGenerated: ${result.generated_at}\n\n## Global Top 100\n`;
  for (const {term, count} of result.totals.global_top_100) md += `- ${term}: ${count}\n`;
  md += `\n## CT Top 50\n`;
  for (const {term, count} of result.totals.ct_top_50) md += `- ${term}: ${count}\n`;
  md += `\n## MRI Top 50\n`;
  for (const {term, count} of result.totals.mri_top_50) md += `- ${term}: ${count}\n`;
  md += `\n## DR Top 50\n`;
  for (const {term, count} of result.totals.dr_top_50) md += `- ${term}: ${count}\n`;
  md += `\n## Files Top 50\n`;
  for (const [fname, terms] of Object.entries(result.by_file_top_50)) {
    md += `\n### ${fname}\n`;
    for (const {term, count} of terms) md += `- ${term}: ${count}\n`;
  }
  fs.writeFileSync(path.join(outDir, 'term-frequency.md'), md, 'utf8');
  console.log(`Generated ${path.relative(root, outJson)} and term-frequency.md`);
}
main();
