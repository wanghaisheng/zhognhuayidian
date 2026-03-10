import fs from 'fs';
import path from 'path';

function loadLanguageCodes() {
  const langTs = path.join(process.cwd(), 'src', 'config', 'language.ts');
  const codes = new Set(['en']);
  try {
    const src = fs.readFileSync(langTs, 'utf-8');
    const arrMatch = src.match(/export\s+const\s+LANGUAGES[^=]*=\s*\[([\s\S]*?)\]\s*;/);
    if (arrMatch) {
      const body = arrMatch[1];
      const objRegex = /(^|\n)\s*\{\s*([\s\S]*?)\}/gm;
      let m;
      while ((m = objRegex.exec(body)) !== null) {
        const obj = m[2];
        const objStartIndex = m.index + (m[1] ? m[1].length : 0);
        const lineStart = body.lastIndexOf('\n', objStartIndex) + 1;
        const line = body.slice(lineStart, objStartIndex).trim();
        if (line.startsWith('//')) continue;
        const codeMatch = obj.match(/code:\s*'([^']+)'/);
        if (codeMatch) {
          codes.add(codeMatch[1]);
        }
      }
    }
  } catch {}
  return Array.from(codes);
}

function readFrontmatter(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const start = raw.indexOf('---');
  if (start !== 0) return null;
  const end = raw.indexOf('---', start + 3);
  if (end === -1) return null;
  const fm = raw.slice(start + 3, end).trim();
  const obj = {};
  fm.split(/\r?\n/).forEach(line => {
    const m = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (m) {
      const key = m[1];
      let val = m[2].trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
      obj[key] = val;
    }
  });
  return obj;
}

function collectContent(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  const items = [];
  for (const f of files) {
    const filePath = path.join(dir, f);
    const fm = readFrontmatter(filePath) || {};
    const slug = fm.slug || f.replace(/\.md$/, '');
    const title = fm.title || slug;
    const description = fm.description || '';
    const category = fm.category || '';
    items.push({ id: slug, slug, name: title, description, category });
  }
  return items;
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function writeJson(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf-8');
}

function generateDevices(locale = 'en') {
  const srcDir = path.join(process.cwd(), 'content', 'devices', locale);
  const items = collectContent(srcDir).map(it => {
    const isMri = Array.isArray(it.tags) ? it.tags.some(t => String(t).toLowerCase().includes('mri')) : (String(it.category).toLowerCase().includes('mri'));
    return {
      id: it.id,
      slug: it.slug,
      name: it.name,
      description: it.description,
      category: isMri ? 'mri' : 'ct'
    };
  });
  const outDir = path.join(process.cwd(), 'src', 'data', 'snapshots', locale);
  ensureDir(outDir);
  writeJson(path.join(outDir, 'devices.json'), { updatedAt: new Date().toISOString(), items });
}

function generateManufacturers(locale = 'en') {
  const srcDir = path.join(process.cwd(), 'content', 'manufacturers', locale);
  const items = collectContent(srcDir).map(it => ({
    id: it.id,
    slug: it.slug,
    name: it.name,
    description: it.description,
    country: '',
    is_chinese: false
  }));
  const outDir = path.join(process.cwd(), 'src', 'data', 'snapshots', locale);
  ensureDir(outDir);
  writeJson(path.join(outDir, 'manufacturers.json'), { updatedAt: new Date().toISOString(), items });
}

function main() {
  const locales = loadLanguageCodes();
  locales.forEach(locale => {
    generateDevices(locale);
    generateManufacturers(locale);
  });
  console.log('Snapshots generated for locales:', locales.join(', '));
}

main();
