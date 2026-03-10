// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.345Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
const fs = require('fs');
const path = require('path');
function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }
function listMd(dir) { return fs.readdirSync(dir).filter(f => f.endsWith('.md')); }
function readText(p) { return fs.readFileSync(p, 'utf8'); }
function normalizeTitle(s) { return s.replace(/\s+/g, ' ').trim(); }
function isChineseEnumerated(line) { const t = line.trim(); return /^[（(]?[一二三四五六七八九十百千]+[）)]?/.test(t); }
function isArabicEnumeratedTop(line) { const t = line.trim(); const m = t.match(/^([★▲]?\s*)?(\d+)/); if (!m) return false; const after = t.slice(m[0].length); if (/^\.\d/.test(after)) return false; if (/^\.(?!\d)/.test(after)) return true; if (/^(\s|、|．|。)/.test(after)) return true; if (/^.*(：|:)$/.test(t)) return true; if (/^[^\d]/.test(after)) return true; return false; }
function normalize(s) { return s.replace(/\s+/g, ' ').trim(); }
function isConfigTitle(text) { const t = normalize(text); return /(标准配置清单|配置清单|设备配置|第三方增配设备|第三方附属|增配设备|附属|配件)/.test(t); }
function isLikelyConfigTitle(text) {
  const t = normalize(text);
  if (!t) return false;
  const hasQtyWord = /(台|套|个|批|项)/.test(t);
  const hasCoreKeywords = /(系统|要求|参数|软件|工作站|控制台|扫描床|X线|探测器|能谱|临床应用|图像|后处理)/.test(t);
  return hasQtyWord && !hasCoreKeywords;
}
function buildHeadingRanges(lines, headings) {
  const all = [];
  for (const h of headings) {
    const idx = lines.findIndex(l => normalize(l).startsWith(normalize(h)));
    if (idx >= 0) all.push({ idx, heading: h });
  }
  all.sort((a, b) => a.idx - b.idx);
  const ranges = [];
  for (let i = 0; i < all.length; i++) {
    const start = all[i].idx;
    const end = i + 1 < all.length ? all[i + 1].idx : lines.length;
    const hText = normalize(all[i].heading);
    const isConfig = isConfigTitle(hText) || /(标准配置|配置清单)/.test(hText);
    ranges.push({ start, end, isConfig });
  }
  for (let i = 0; i < lines.length; i++) {
    const t = normalize(lines[i]);
    if (/(标准配置清单|标准配置|配置清单)/.test(t)) {
      const next = all.find(x => x.idx > i && !isConfigTitle(x.heading) && !/(标准配置|配置清单)/.test(normalize(x.heading)) && !isLikelyConfigTitle(x.heading));
      const end = next ? next.idx : lines.length;
      ranges.push({ start: i, end, isConfig: true });
    }
  }
  return ranges;
}
function buildSectionsWithHeadings(lines, headings) {
  const anchorIdx = lines.findIndex(l => /(关键词|技术要求|招标技术要求|采购技术要求|技术规格|技术参数|技术指标)/.test(l));
  const useLines = anchorIdx >= 0 ? lines.slice(anchorIdx + 1) : lines;
  const dimHeadings = headings.filter(h => isChineseEnumerated(h) || isArabicEnumeratedTop(h)).map(h => normalize(h));
  const ranges = buildHeadingRanges(useLines, headings);
  const positions = [];
  for (const h of dimHeadings) {
    const idx = useLines.findIndex(l => normalize(l).startsWith(h));
    if (idx >= 0) {
      const inBlocked = ranges.some(r => r.isConfig && idx >= r.start && idx < r.end);
      if (!inBlocked) positions.push(idx);
    }
  }
  positions.sort((a, b) => a - b);
  const fieldRe = /^\s*([★▲]?\s*)?\d+\.\d+(\.\d+)?/;
  const kvLineRe = /[：:].+\S/;
  const sections = [];
  for (let p = 0; p < positions.length; p++) {
    const start = positions[p];
    const end = p + 1 < positions.length ? positions[p + 1] : useLines.length;
    const rawTitle = useLines[start].trim();
    const display_title = normalizeTitle(rawTitle.replace(/[：:]\s*$/, ''));
    const title = normalizeTitle(rawTitle.replace(/^\s*\d+(\.\d+)?\s*/, '').replace(/^[（(]?[一二三四五六七八九十百千]+[）)]?[、\.．]\s*/, '').replace(/[：:]\s*$/, ''));
    if (isConfigTitle(rawTitle) || isConfigTitle(title) || isLikelyConfigTitle(rawTitle) || isLikelyConfigTitle(title)) continue;
    const sec = { title, display_title, start_line_index: anchorIdx >= 0 ? (anchorIdx + 1 + start) : start, fields: [] };
    for (let j = start + 1; j < end; j++) {
      const t = useLines[j].trim();
      if (!t) continue;
      if (fieldRe.test(t) || kvLineRe.test(t)) sec.fields.push(t);
    }
    sections.push(sec);
  }
  return { anchor_line_index: anchorIdx, sections };
}
function parseDimFieldSections(lines) {
  const anchorIdx = lines.findIndex(l => /(关键词|技术要求|招标技术要求|采购技术要求|技术规格|技术参数|技术指标)/.test(l));
  const useLines = anchorIdx >= 0 ? lines.slice(anchorIdx + 1) : lines;
  const dimIs = (t) => isChineseEnumerated(t) || isArabicEnumeratedTop(t);
  const fieldRe = /^\s*([★▲]?\s*)?\d+\.\d+(\.\d+)?/;
  const topCnHeadingRe = /^[（(]?[一二三四五六七八九十百千]+[）)]?/;
  const kvLineRe = /[：:].+\S/;
  const sections = [];
  let current = null;
  let inConfigBlock = false;
  for (let i = 0; i < useLines.length; i++) {
    const line = useLines[i];
    const t = line.trim();
    if (!t) continue;
    if (dimIs(t) || topCnHeadingRe.test(t)) {
      if (current && current.fields.length) sections.push(current);
      const display_title = normalizeTitle(t.replace(/[：:]\s*$/, ''));
      const title = normalizeTitle(t.replace(/^\s*\d+(\.\d+)?\s*/, '').replace(/^[（(]?[一二三四五六七八九十百千]+[）)]?[、\.．]\s*/, '').replace(/[：:]\s*$/, ''));
      inConfigBlock = isConfigTitle(t) || isConfigTitle(title) || /(标准配置|配置清单)/.test(title);
      if (inConfigBlock || isLikelyConfigTitle(t) || isLikelyConfigTitle(title)) { current = null; continue; }
      current = { title, display_title, start_line_index: anchorIdx >= 0 ? (anchorIdx + 1 + i) : i, fields: [] };
      continue;
    }
    if (inConfigBlock) continue;
    if (current && fieldRe.test(t)) {
      current.fields.push(t);
      continue;
    }
    if (current && kvLineRe.test(t)) {
      current.fields.push(t);
      continue;
    }
    if (current && (topCnHeadingRe.test(t) || dimIs(t))) {
      if (current.fields.length) sections.push(current);
      current = null;
    }
  }
  if (current && current.fields.length) sections.push(current);
  return { anchor_line_index: anchorIdx, sections };
}
function parseByFileFromMd(mdText) {
  const lines = mdText.split(/\r?\n/);
  const byFile = {};
  let currentFile = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headerMatch = line.match(/^##\s+(.+?)\s*$/);
    if (headerMatch) {
      currentFile = headerMatch[1].trim();
      if (!byFile[currentFile]) byFile[currentFile] = { anchor_line_index: -1, dimensions: [] };
      continue;
    }
    if (!currentFile) continue;
    const anchorMatch = line.match(/-\s*anchor_after:\s*line\s*(\d+)/i);
    if (anchorMatch) {
      byFile[currentFile].anchor_line_index = parseInt(anchorMatch[1], 10) - 1;
      continue;
    }
    const bulletMatch = line.match(/^\-\s*(.+?)\s*(\(fields:\s*\d+\))?\s*$/i);
    if (bulletMatch) {
      const rawDisplay = bulletMatch[1].trim();
      const display = normalizeTitle(rawDisplay.replace(/\(fields:\s*\d+\)\s*$/i, ''));
      const cleanTitle = display
        .replace(/^\s*([★▲]?\s*)?\d+(\.\d+)?\s*/, '')
        .replace(/^[（(]?[一二三四五六七八九十百千]+[）)]?[、\.．]?\s*/, '')
        .replace(/\(fields:\s*\d+\)\s*$/i, '');
      byFile[currentFile].dimensions.push({ title: normalizeTitle(cleanTitle), display_title: normalizeTitle(display), start_line_index: -1, fields: [] });
    }
  }
  return byFile;
}
function stripEnumPrefix(s) {
  return s
    .replace(/^\s*([★▲]?\s*)?\d+(\.\d+)?\s*/, '')
    .replace(/^[（(]?[一二三四五六七八九十百千]+[）)]?[、\.．]?\s*/, '');
}
function enrichFieldsFromSrc(byFile, srcDir) {
  const fieldRe = /^\s*([★▲]?\s*)?\d+\.\d+(\.\d+)?/;
  const kvLineRe = /[：:].+\S/;
  for (const [file, obj] of Object.entries(byFile)) {
    const full = path.join(srcDir, file);
    if (!fs.existsSync(full)) continue;
    const lines = readText(full).split(/\r?\n/);
    const anchorIdx = typeof obj.anchor_line_index === 'number' && obj.anchor_line_index >= 0
      ? obj.anchor_line_index
      : lines.findIndex(l => /(关键词|技术要求|招标技术要求|采购技术要求|技术规格|技术参数|技术指标)/.test(l));
    const useLines = anchorIdx >= 0 ? lines.slice(anchorIdx + 1) : lines;
    const positions = [];
    for (const dim of obj.dimensions) {
      if (isConfigTitle(dim.display_title || dim.title) || isLikelyConfigTitle(dim.display_title || dim.title)) {
        positions.push({ start: -1, dim });
        continue;
      }
      let found = -1;
      const targetDisplay = normalize(dim.display_title || '');
      const targetTitle = normalize(dim.title || '');
      for (let i = 0; i < useLines.length; i++) {
        const normLine = normalize(useLines[i]);
        if (targetDisplay && normLine.startsWith(targetDisplay)) { found = i; break; }
        const stripped = normalizeTitle(stripEnumPrefix(useLines[i]));
        if (targetTitle && stripped.startsWith(targetTitle)) { found = i; break; }
      }
      positions.push({ start: found, dim });
    }
    for (let p = 0; p < positions.length; p++) {
      const { start, dim } = positions[p];
      if (start < 0) { dim.fields = []; continue; }
      const end = (p + 1 < positions.length && positions[p + 1].start >= 0) ? positions[p + 1].start : useLines.length;
      const fields = [];
      const numMatch = (dim.display_title || '').match(/^([★▲]?\s*)?(\d+)/);
      const dimNum = numMatch ? parseInt(numMatch[2], 10) : null;
      for (let j = start + 1; j < end; j++) {
        const t = useLines[j].trim();
        if (!t) continue;
        if (isConfigTitle(t)) break;
        if (isLikelyConfigTitle(t)) continue;
        if (dimNum) {
          const headNumMatch = t.match(/^([★▲]?\s*)?(\d+)\./);
          if (headNumMatch && parseInt(headNumMatch[2], 10) !== dimNum) break;
        }
        if (fieldRe.test(t) || kvLineRe.test(t)) fields.push(t);
      }
      dim.fields = fields;
      dim.start_line_index = anchorIdx >= 0 ? (anchorIdx + 1 + start) : start;
    }
  }
}
function main() {
  const root = process.cwd();
  const srcDir = path.join(root, 'data', 'rawdata', 'specifications');
  const outDir = path.join(root, 'data', 'processed', 'analysis');
  ensureDir(outDir);
  const mdPath = path.join(outDir, 'dimension-field-map.md');
  let byFile = {};
  if (fs.existsSync(mdPath)) {
    const mdText = readText(mdPath);
    byFile = parseByFileFromMd(mdText);
    enrichFieldsFromSrc(byFile, srcDir);
  } else {
    const files = listMd(srcDir);
    byFile = {};
    for (const f of files) {
      const full = path.join(srcDir, f);
      const lines = readText(full).split(/\r?\n/);
      const headingsPath = path.join(srcDir, 'headings', f.replace(/\.md$/i, '.headings.txt'));
      let anchor_line_index = -1;
      let sections = [];
      if (fs.existsSync(headingsPath)) {
        const headings = readText(headingsPath).split(/\r?\n/).filter(Boolean);
        const res = buildSectionsWithHeadings(lines, headings);
        anchor_line_index = res.anchor_line_index;
        sections = res.sections;
      } else {
        const res = parseDimFieldSections(lines);
        anchor_line_index = res.anchor_line_index;
        sections = [];
      }
      byFile[f] = { anchor_line_index, dimensions: sections };
    }
  }
  const jsonPath = path.join(outDir, 'dimension-field-map.json');
  fs.writeFileSync(jsonPath, JSON.stringify({ generated_at: new Date().toISOString(), by_file: byFile }, null, 2), 'utf8');
  let md = `# Dimension → Field Map\n\nGenerated: ${new Date().toISOString()}\n`;
  if (!fs.existsSync(mdPath)) {
    for (const [file, obj] of Object.entries(byFile)) {
      md += `\n## ${file}\n`;
      if (typeof obj.anchor_line_index === 'number' && obj.anchor_line_index >= 0) {
        md += `- anchor_after: line ${obj.anchor_line_index + 1}\n`;
      }
      obj.dimensions.forEach(sec => {
        const show = sec.display_title || sec.title;
        md += `- ${show} (fields: ${sec.fields.length})\n`;
      });
    }
    fs.writeFileSync(mdPath, md, 'utf8');
    console.log(`Generated ${path.relative(root, jsonPath)} and dimension-field-map.md`);
  } else {
    console.log(`Regenerated ${path.relative(root, jsonPath)} from existing dimension-field-map.md`);
  }
}
main();
