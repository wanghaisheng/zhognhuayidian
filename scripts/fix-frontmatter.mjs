import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'content');

const FRONTMATTER_RE = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/;

const toTitleCase = (s) => s.replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim().replace(/\b\w/g, c => c.toUpperCase());

const extractH1 = (body) => {
  const lines = body.split('\n');
  for (const line of lines) {
    const m = line.match(/^\s*#\s+(.+)\s*$/);
    if (m) return m[1].trim();
  }
  return '';
};

const makeExcerpt = (body, maxLen = 180) => {
  const text = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\n+/g, ' ')
    .trim();
  if (!text) return '';
  if (text.length <= maxLen) return text;
  const truncated = text.slice(0, maxLen);
  const idx = truncated.lastIndexOf(' ');
  return (idx > 0 ? truncated.slice(0, idx) : truncated) + '...';
};

const ensureFrontmatter = (fm, fileCtx) => {
  const out = { ...fm };
  // 必填字段：title
  if (typeof out.title !== 'string' || !out.title.trim()) {
    const byH1 = extractH1(fileCtx.body);
    const byName = toTitleCase(fileCtx.basename);
    out.title = byH1 || byName;
  }
  // 描述
  if (typeof out.description !== 'string' || !out.description.trim()) {
    out.description = makeExcerpt(fileCtx.body);
  }
  // slug
  if (typeof out.slug !== 'string' || !out.slug.trim()) {
    out.slug = fileCtx.basename;
  } else {
    out.slug = String(out.slug).trim();
  }
  // category 以目录为准
  if (typeof out.category !== 'string' || !out.category.trim()) {
    out.category = fileCtx.category;
  }
  // tags
  if (!Array.isArray(out.tags)) {
    out.tags = [];
  }
  // status
  if (out.status !== 'draft' && out.status !== 'published' && out.status !== 'archived') {
    out.status = 'published';
  }
  // seo
  if (typeof out.seo !== 'object' || !out.seo) {
    out.seo = {};
  }
  if (typeof out.seo.title !== 'string' || !out.seo.title.trim()) {
    out.seo.title = out.title;
  }
  if (typeof out.seo.description !== 'string' || !out.seo.description.trim()) {
    out.seo.description = out.description || out.title;
  }
  if (typeof out.seo.keywords !== 'string') {
    out.seo.keywords = '';
  }
  if (typeof out.seo.canonical !== 'string') {
    out.seo.canonical = '';
  } else {
    out.seo.canonical = '';
  }
  // 兼容字段：canonical 顶层统一清空
  if (typeof out.canonical === 'string') {
    out.canonical = '';
  }
  // 作者/时间等可选字段保持不强制
  // readingTime 粗略估算
  if (typeof out.readingTime !== 'number') {
    const words = String(fileCtx.body || '').split(/\s+/).filter(Boolean).length;
    out.readingTime = Math.ceil(words / 200);
  }
  // contentType 默认
  if (!['guide', 'tutorial', 'reference', 'analysis', 'report'].includes(out.contentType)) {
    out.contentType = 'guide';
  }
  return out;
};

const parseFile = (text) => {
  const m = text.match(FRONTMATTER_RE);
  if (!m) return { fm: {}, body: text, hasFm: false };
  try {
    const data = yaml.load(m[1]) || {};
    return { fm: data, body: m[2], hasFm: true };
  } catch (e) {
    console.warn('YAML parse error, will back up and regenerate frontmatter:', e.message);
    // 返回无FM，之后重建
    return { fm: {}, body: m[2], hasFm: false };
  }
};

const dump = (obj) => yaml.dump(obj, { lineWidth: 100, noRefs: true });

const walk = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const ent of entries) {
    if (ent.name.startsWith('.')) continue;
    const fp = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      files.push(...walk(fp));
    } else if (ent.isFile() && ent.name.endsWith('.md')) {
      files.push(fp);
    }
  }
  return files;
};

const run = () => {
  const files = walk(CONTENT_DIR);
  let updated = 0;
  let checked = 0;
  const problems = [];

  for (const file of files) {
    const rel = path.relative(CONTENT_DIR, file).replace(/\\/g, '/');
    const parts = rel.split('/');
    const category = parts[0] || '';
    const locale = parts[1] || '';
    const basename = path.basename(file, '.md');

    const raw = fs.readFileSync(file, 'utf8');
    const { fm, body, hasFm } = parseFile(raw);

    const fixed = ensureFrontmatter(fm || {}, { body, basename, category, locale });

    // 记录问题
    const issues = [];
    if (!fm || typeof fm.title !== 'string' || !fm.title?.trim()) issues.push('missing:title');
    if (!fm || typeof fm.seo !== 'object' || !fm.seo || typeof fm.seo.title !== 'string') issues.push('missing:seo.title');
    if (!fm || !fm.seo || typeof fm.seo.description !== 'string') issues.push('missing:seo.description');
    if (!fm || typeof fm.slug !== 'string' || !fm.slug?.trim()) issues.push('missing:slug');
    if (!fm || typeof fm.category !== 'string' || !fm.category?.trim()) issues.push('missing:category');
    if (issues.length > 0) {
      problems.push({ file: rel, issues });
    }

    const newText = `---\n${dump(fixed)}---\n\n${body}`;
    if (newText !== raw) {
      // 仅在变更时写回
      if (!hasFm) {
        // 备份无效/缺失FM版本
        fs.writeFileSync(file + '.bak', raw, 'utf8');
      }
      fs.writeFileSync(file, newText, 'utf8');
      updated++;
    }
    checked++;
  }

  console.log(`Checked ${checked} markdown files.`);
  console.log(`Updated ${updated} files with normalized frontmatter.`);
  if (problems.length > 0) {
    console.log('Detected issues before fix (for record):');
    problems.slice(0, 50).forEach(p => {
      console.log(` - ${p.file}: ${p.issues.join(', ')}`);
    });
    if (problems.length > 50) {
      console.log(` ... and ${problems.length - 50} more`);
    }
  }
};

run();

