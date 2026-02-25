const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const includeDirs = ['src', 'public'];
const excludeDirs = ['node_modules', '.next', 'dist', 'build', 'scripts', 'coverage', 'out'];
const excludePaths = [
  path.join('src', 'data', 'common'),
  path.join('src', 'locales'),
  path.join('src', 'data', 'en'),
  path.join('src', 'data', 'zh'),
  path.join('src', 'data', 'guideFAQs.ts'),
  path.join('src', 'utils', 'fixCustomerDeviceIds.ts'),
  path.join('src', 'utils', 'urlStructure.ts'),
  path.join('src', 'utils', 'multilingualUtils.ts'),
  path.join('src', 'utils', 'priceFormatter.ts'),
  path.join('src', 'scripts'),
  path.join('public', 'api-docs.json')
];
const includeExts = new Set(['.ts', '.tsx', '.js', '.jsx', '.json']);

const patterns = [
  { key: 'secret_token', re: /\b(ghp_[A-Za-z0-9]{36}|AKIA[0-9A-Z]{16}|sk_(live|test)_[A-Za-z0-9]{20,}|ssh-rsa\s+[A-Za-z0-9/+]+=*|-----BEGIN [A-Z ]+-----|\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)/ },
  { key: 'hardcoded_url', re: /\bhttps?:\/\/[^\s'"`)<]+/ },
  { key: 'supabase_inline', re: /\b(supabase\.co)\b/ },
  { key: 'mock_import', re: /from\s+['"`]@\/data\/mock\/[^'"`]+['"`]/ },
  { key: 'common_data_import', re: /from\s+['"`]@\/data\/common\/[^'"`]+['"`]/ },
  { key: 'zh_text_literal', re: /['"`][^'"`]*[\u4e00-\u9fff][^'"`]*['"`]/ },
  { key: 'numeric_plus_percent', re: /['"`][^'"`]*\b\d{1,4}(\+|%|\s*-\s*\d{1,4}%)[^'"`]*['"`]/ }
];
const allowedUrlHosts = [
  'www.sitemaps.org',
  'www.w3.org',
  'gumroad.com',
  'schema.org',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'www.google-analytics.com',
  'www.googletagmanager.com',
  'beian.miit.gov.cn',
  'pagead2.googlesyndication.com',
  'googleads.g.doubleclick.net',
  'www.clarity.ms',
  'avatars.githubusercontent.com',
  'x.com',
  'github.com',
  'www.linkedin.com',
  'ko-fi.com',
  'patreon.com',
  'lucide.dev'
];

function shouldExclude(fp) {
  const rel = path.relative(root, fp).replace(/\\/g, '/');
  if (excludeDirs.some(d => rel.startsWith(d + '/'))) return true;
  const normalizedPaths = excludePaths.map(p => p.replace(/\\/g, '/'));
  if (normalizedPaths.some(p => rel.startsWith(p + '/'))) return true;
  if (normalizedPaths.some(p => rel === p)) return true;
  return false;
}

function listFiles(dir) {
  const result = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (shouldExclude(full)) continue;
    if (e.isDirectory()) {
      result.push(...listFiles(full));
    } else {
      const ext = path.extname(e.name).toLowerCase();
      if (includeExts.has(ext)) result.push(full);
    }
  }
  return result;
}

function scanFile(fp) {
  const content = fs.readFileSync(fp, 'utf8');
  const lines = content.split(/\r?\n/);
  const findings = [];
  const ext = path.extname(fp).toLowerCase();
  const rel = path.relative(root, fp).replace(/\\/g, '/');
  if (ext === '.css' || ext === '.scss') return findings;
  let inStyleBlock = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!inStyleBlock && /<style(\s|>)/i.test(line)) {
      inStyleBlock = true;
      continue;
    }
    if (inStyleBlock) {
      if (/<\/style>/i.test(line)) {
        inStyleBlock = false;
      }
      continue;
    }
    for (const p of patterns) {
      const m = line.match(p.re);
      if (!m) continue;
      if (p.key === 'mock_import') {
        continue;
      }
      if (p.key === 'hardcoded_url') {
        if (line.includes('process.env.SITE_URL')) continue;
        try {
          const u = new URL(m[0]);
          if (allowedUrlHosts.includes(u.hostname)) continue;
        } catch {}
      }
      if (p.key === 'numeric_plus_percent') {
        const isClassName = /className\s*=/.test(line) || /className/.test(line);
        const isStyleAttr = /style\s*=\s*\{/.test(line);
        const isCssPercentToken = /\[\-?\d+%]/.test(line) || /translate-[xy]-\[\-?\d+%]/.test(line);
        const isWidthHeightStyle = /\b(width|height|minHeight)\s*:\s*/.test(line);
        const isDimensionProp = /\b(width|height|cx|cy)\s*=\s*["']\d+%["']/.test(line);
        const isUiLibPath = fp.includes(path.join('src', 'components', 'ui')) || fp.includes(path.join('src', 'lib', 'imageOptimizer.ts'));
        const isRootMarginString = /['"`]-?\d+px\s+\d+px\s+-?\d+%\s+\d+px['"`]/.test(line) || /rootMargin/.test(line) || /IntersectionObserver/.test(line);
        if (isClassName || isStyleAttr || isCssPercentToken || isWidthHeightStyle || isDimensionProp || isUiLibPath) {
          continue;
        }
        if (isRootMarginString) {
          continue;
        }
      }
      findings.push({ key: p.key, line: i + 1, snippet: m[0] });
    }
    // Detect Chinese text in TSX JSX nodes (not in quotes)
    if (ext === '.tsx' && /[\u4e00-\u9fff]/.test(line)) {
      const trimmed = line.trim();
      const isComment = trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*');
      const hasQuotes = /['"`]/.test(line);
      const isImport = /^\s*import\s/.test(trimmed);
      if (!isComment && !hasQuotes && !isImport) {
        findings.push({ key: 'zh_jsx_text', line: i + 1, snippet: trimmed.slice(0, 160) });
      }
    }
    // Detect English hardcoded UI text in pages/components/router
    if (
      (rel.startsWith('src/pages') || rel.startsWith('src/components') || rel === 'src/router.tsx')
    ) {
      const isClassName = /className\s*=/.test(line) || /className/.test(line);
      const isClassKey = /\b(class(Name)?|[A-Za-z0-9]*Class)\s*[:=]/.test(line);
      const isVariantOrSizeKey = /\b(variant|size|rel|target)\s*[:=]/.test(line);
      const isStyleAttr = /style\s*=\s*\{/.test(line);
      const isImport = /^\s*import\s/.test(line.trim());
      const hasTranslateCall = /t\(/.test(line);
      const containsUrl = /\bhttps?:\/\/[^\s'"`)<]+/.test(line);
      const isKeyLike = /labelKey\s*:/.test(line) || /\bdata-key\b/.test(line) || /\bnavigation\./.test(line);
      const englishQuoted = line.match(/['"`]([A-Za-z][A-Za-z0-9 ,.'“”"?!:;()\-:]{14,})['"`]/);
      const isTailwindUtilityString = (s) =>
        /\b(bg|text|border|shadow|ring|rounded|p|px|py|pl|pr|pt|pb|m|mx|my|mt|mb|ml|mr|grid|flex|items|justify|w|h|min|max|container|space-x|space-y|hover:|focus:|active:|sm:|md|lg|xl|2xl):/.test(s) ||
        /\b[a-z0-9-]+(?:\:[a-z0-9-]+)?\b/.test(s) && /[-]/.test(s);
      const allowedUiTokens = new Set(['default','outline','destructive','secondary','ghost','link','icon','sm','md','lg']);
      if (
        englishQuoted &&
        englishQuoted[1].includes(' ') &&
        !isClassName &&
        !isClassKey &&
        !isVariantOrSizeKey &&
        !isStyleAttr &&
        !isImport &&
        !hasTranslateCall &&
        !containsUrl &&
        !isKeyLike &&
        !isTailwindUtilityString(englishQuoted[1]) &&
        !englishQuoted[1].toLowerCase().includes('noopener') &&
        !englishQuoted[1].toLowerCase().includes('noreferrer') &&
        !allowedUiTokens.has(englishQuoted[1].trim().toLowerCase())
      ) {
        findings.push({ key: 'en_text_literal_ui', line: i + 1, snippet: englishQuoted[0] });
      }
      if (ext === '.tsx') {
        const trimmed = line.trim();
        const isComment = trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*');
        const hasQuotes = /['"`]/.test(line);
        const jsxEnglish = line.match(/>\s*([A-Za-z][A-Za-z0-9 ,.'“”"?!:;()\-:]{10,})\s*</);
        if (
          jsxEnglish &&
          !isComment &&
          !hasQuotes &&
          !hasTranslateCall &&
          !isTailwindUtilityString(jsxEnglish[1]) &&
          !jsxEnglish[1].toLowerCase().includes('noopener') &&
          !jsxEnglish[1].toLowerCase().includes('noreferrer') &&
          !allowedUiTokens.has(jsxEnglish[1].trim().toLowerCase())
        ) {
          findings.push({ key: 'en_jsx_text', line: i + 1, snippet: jsxEnglish[1].slice(0, 160) });
        }
      }
    }
  }
  return findings;
}

function main() {
  const targets = [];
  for (const d of includeDirs) {
    const abs = path.join(root, d);
    if (fs.existsSync(abs)) targets.push(abs);
  }
  const files = targets.flatMap(listFiles);
  const report = [];
  for (const f of files) {
    const fnds = scanFile(f);
    if (fnds.length) {
      report.push({ file: path.relative(root, f), findings: fnds });
    }
  }
  if (!report.length) {
    console.log('No hardcode issues found.');
    process.exit(0);
  }
  const grouped = {};
  for (const item of report) {
    for (const f of item.findings) {
      if (!grouped[f.key]) grouped[f.key] = [];
      grouped[f.key].push({ file: item.file, line: f.line, snippet: f.snippet });
    }
  }
  const keys = Object.keys(grouped);
  console.log('Hardcode scan report:');
  for (const k of keys) {
    console.log(`\n[${k}]`);
    for (const g of grouped[k]) {
      console.log(`${g.file}:${g.line} ${g.snippet}`);
    }
  }
  process.exit(1);
}

main();
