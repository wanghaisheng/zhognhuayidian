// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.346Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
const fs = require('fs');
const path = require('path');
function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }
function listFiles(dir, ext) { return fs.readdirSync(dir).filter(f => f.endsWith(ext)); }
function readText(p) { return fs.readFileSync(p, 'utf8'); }
function classifyModel(fname) {
  const f = fname.toLowerCase();
  if (f.includes('64-ct')) return 'ct_64';
  if (f.includes('128-ct')) return 'ct_128';
  if (f.includes('256-ct')) return 'ct_256';
  if (f.includes('1.5t')) return 'mri_1_5t';
  if (f.includes('3.0t') || f.includes('mri-3.0-t')) return 'mri_3_0t';
  if (f.includes('5.0t')) return 'mri_5_0t';
  if (f.includes('7.0t')) return 'mri_7_0t';
  if (f.includes('ct')) return 'ct_unknown';
  if (f.includes('mri')) return 'mri_unknown';
  if (f.includes('dr')) return 'dr';
  return 'unknown';
}
function isCT(model) { return /^ct_/.test(model); }
function isMRI(model) { return /^mri_/.test(model); }
function mapDimension(line, model) {
  const t = line.toLowerCase();
  if (isCT(model)) {
    if (/机架|gantry/.test(t)) return 'gantry';
    if (/x线|球管|发生器|高压发生器|管电压|管电流|球管/.test(t)) return 'xraySystem';
    if (/扫描床|病人床|检查病床/.test(t)) return 'patientBed';
    if (/重建|矩阵|fov|图像扫描矩阵/.test(t)) return 'reconstruction';
    if (/扫描.*功能|重建功能|门控|心脏成像|灌注|能谱|序列/.test(t)) return 'scanningFunctions';
    if (/主控制台|控制台|工作站|医生工作站|后处理工作站/.test(t)) return 'console';
    if (/软件包|软件|功能/.test(t)) return 'software';
    if (/安装场地|场地|机房|屏蔽|电源|空调|除湿|装修/.test(t)) return 'siteRequirements';
    if (/标准配置清单|具体配置清单|配置清单/.test(t)) return 'configuration';
    if (/配件|增配|第三方增配/.test(t)) return 'accessories';
    return 'other';
  }
  if (isMRI(model)) {
    if (/超导磁体|磁体系统|磁体/.test(t)) return 'magnetSystem';
    if (/射频发射系统/.test(t)) return 'rfTransmit';
    if (/射频接收系统/.test(t)) return 'rfReceive';
    if (/梯度系统|梯度/.test(t)) return 'gradientSystem';
    if (/主控计算机|计算机系统/.test(t)) return 'computerSystem';
    if (/检查病床|病床系统|病人床/.test(t)) return 'patientBed';
    if (/扫描序列/.test(t)) return 'sequences';
    if (/高级成像|先进成像/.test(t)) return 'advancedTech';
    if (/安装场地|场地要求|机房|屏蔽|电源|空调|除湿|装修/.test(t)) return 'siteRequirements';
    if (/增配设备|第三方增配/.test(t)) return 'accessories';
    if (/标准配置清单|具体配置清单|配置清单/.test(t)) return 'configuration';
    return 'other';
  }
  return 'other';
}
function main() {
  const root = process.cwd();
  const srcDir = path.join(root, 'data', 'rawdata', 'specifications');
  const headingsDir = path.join(srcDir, 'headings');
  const useDir = fs.existsSync(headingsDir) ? headingsDir : srcDir;
  const files = listFiles(useDir, '.headings.txt');
  const byFile = {};
  const byModel = {};
  function buildDimensionSectionsFromMd(mdFilePath) {
    const linesAll = readText(mdFilePath).split(/\r?\n/);
    const anchorIdx = linesAll.findIndex(l => /(关键词|技术要求|招标技术要求|采购技术要求|技术规格|技术参数|技术指标)/.test(l));
    const lines = anchorIdx >= 0 ? linesAll.slice(anchorIdx + 1) : linesAll;
    const dimRe = /^\s*\d+\s+[^\n：:]+[：:]/;
    const fieldRe = /^\s*([★▲]?\s*)?\d+\.\d+(\.\d+)?/;
    const sections = [];
    let current = null;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;
      if (dimRe.test(line)) {
        if (current && current.fields.length) sections.push(current);
        const title = line.replace(/^\s*\d+\s+/, '').replace(/[：:]\s*$/, '');
        current = { title, start_line_index: i, fields: [] };
        continue;
      }
      if (current && fieldRe.test(line)) {
        current.fields.push(line.trim());
        continue;
      }
      if (current && /^\s*[一二三四五六七八九十百千]+\s*[、\.．]/.test(line)) {
        if (current.fields.length) sections.push(current);
        current = null;
      }
    }
    if (current && current.fields.length) sections.push(current);
    return sections;
  }
  for (const f of files) {
    const model = classifyModel(f);
    const linesAll = readText(path.join(useDir, f)).split(/\r?\n/).filter(Boolean);
    const anchorIdx = linesAll.findIndex(l => /(关键词|技术要求|招标技术要求|采购技术要求|技术规格|技术参数|技术指标)/.test(l));
    const lines = anchorIdx >= 0 ? linesAll.slice(anchorIdx + 1) : linesAll;
    const dims = [];
    const dimSet = new Set();
    for (const line of lines) {
      const d = mapDimension(line, model);
      if (d !== 'other') {
        dims.push({ heading: line, dimension: d });
        dimSet.add(d);
      }
    }
    const rawMd = f.replace(/\.headings\.txt$/i, '.md');
    const rawMdPath = path.join(srcDir, rawMd);
    const dimension_sections = fs.existsSync(rawMdPath) ? buildDimensionSectionsFromMd(rawMdPath) : [];
    byFile[f] = { model, anchor_line_index: anchorIdx, dimensions: dims, dimension_sections };
    const m = byModel[model] || new Set();
    dims.forEach(x => m.add(x.dimension));
    byModel[model] = m;
  }
  const byModelPlain = {};
  for (const [k, v] of Object.entries(byModel)) byModelPlain[k] = Array.from(v);
  const outDir = path.join(root, 'data', 'processed', 'analysis');
  ensureDir(outDir);
  const outJson = path.join(outDir, 'dimension-index.json');
  fs.writeFileSync(outJson, JSON.stringify({ generated_at: new Date().toISOString(), by_file: byFile, by_model: byModelPlain }, null, 2), 'utf8');
  let md = `# Dimension Index\n\nGenerated: ${new Date().toISOString()}\n\n## By Model\n`;
  for (const [model, dims] of Object.entries(byModelPlain)) {
    md += `\n### ${model}\n`;
    dims.forEach(d => { md += `- ${d}\n`; });
  }
  md += `\n## Files\n`;
  for (const [file, obj] of Object.entries(byFile)) {
    md += `\n### ${file} (${obj.model})\n`;
    if (typeof obj.anchor_line_index === 'number' && obj.anchor_line_index >= 0) {
      md += `- anchor_after: line ${obj.anchor_line_index + 1}\n`;
    }
    obj.dimensions.forEach(x => { md += `- ${x.dimension}: ${x.heading}\n`; });
    if (obj.dimension_sections?.length) {
      md += `- sections:\n`;
      obj.dimension_sections.forEach(sec => {
        md += `  - ${sec.title} (fields: ${sec.fields.length})\n`;
      });
    }
  }
  fs.writeFileSync(path.join(outDir, 'dimension-index.md'), md, 'utf8');
  console.log(`Generated ${path.relative(root, outJson)} and dimension-index.md`);
}
main();
