const fs = require('fs');
const path = require('path');
function readText(p) { return fs.readFileSync(p, 'utf8'); }
function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }
function normalize(s) { return s.replace(/\s+/g, ' ').trim(); }
function parseNumberTag(s) {
  const m = s.match(/^([★▲]?\s*)?(\d+(?:\.\d+){0,3})/);
  return m ? m[2] : null;
}
function buildFromDimensionJson(dimJsonPath) {
  const data = JSON.parse(readText(dimJsonPath));
  const profiles = {};
  for (const [file, obj] of Object.entries(data.by_file || {})) {
    const dims = (obj.dimensions || []).map(d => ({
      display_title: d.display_title || d.title,
      title: d.title,
      start_line_index: typeof d.start_line_index === 'number' ? d.start_line_index : -1,
      fields: (d.fields || []).map(t => ({ text: t, number: parseNumberTag(t) }))
    }));
    profiles[file] = { anchor_after: obj.anchor_line_index ?? -1, dimensions: dims, package: [] };
  }
  return profiles;
}
function parseStandardConfig(stdPath) {
  const text = readText(stdPath);
  const lines = text.split(/\r?\n/);
  const result = {};
  let current = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (m) {
      current = m[1].trim();
      if (!result[current]) result[current] = [];
      continue;
    }
    if (!current) continue;
    const t = line.trim();
    if (!t || /^Ranges:/.test(t)) continue;
    if (/^#/.test(t)) continue;
    if (/^##\s/.test(t)) continue;
    if (/^[\u4e00-\u9fa5A-Za-z0-9].+/.test(t)) {
      const clean = normalize(t.replace(/^\-\s*/, ''));
      if (clean) result[current].push({ text: clean });
    }
  }
  return result;
}
function main() {
  const root = process.cwd();
  const outDir = path.join(root, 'data', 'processed', 'analysis');
  ensureDir(outDir);
  const dimJsonPath = path.join(outDir, 'dimension-field-map.json');
  if (!fs.existsSync(dimJsonPath)) {
    console.error('dimension-field-map.json not found. Run generate-dimension-field-map.cjs first.');
    process.exit(1);
  }
  const profiles = buildFromDimensionJson(dimJsonPath);
  const stdPath = path.join(outDir, 'standard-config.md');
  if (fs.existsSync(stdPath)) {
    const std = parseStandardConfig(stdPath);
    for (const [file, items] of Object.entries(std)) {
      if (!profiles[file]) profiles[file] = { anchor_after: -1, dimensions: [], package: [] };
      profiles[file].package = items;
    }
  }
  const outPath = path.join(outDir, 'specs-catalog.json');
  fs.writeFileSync(outPath, JSON.stringify({ generated_at: new Date().toISOString(), profiles }, null, 2), 'utf8');
  console.log(`Generated ${path.relative(root, outPath)} with ${Object.keys(profiles).length} profiles`);
}
main();
