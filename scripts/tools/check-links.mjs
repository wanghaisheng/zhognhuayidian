/**
 * Input: `dist/` directory files after a production build.
 * Output: A console report plus a markdown audit artifact, which defaults to `reports/audit-report-YYYYMMDD-HHmmss.md`.
 * Pos: Post-Build Quality Assurance script.
 * NOTICE: If this file is updated, its header and parent's README must also be updated.
 */

import fs from 'fs';
import path from 'path';
import process from 'node:process';
import http from 'node:http';
import crypto from 'node:crypto';
import { JSDOM } from 'jsdom';
// Defer optional heavy deps to runtime to keep script working without them

const DIST_DIR = fs.existsSync(path.resolve('dist/client'))
  ? path.resolve('dist/client')
  : path.resolve('dist');
const SEO_COMPONENT_PATHS = [
  path.resolve('src/routes/__root.tsx'),
];
const SEO_UTIL_PATH = path.resolve('src/utils/seo.ts');
const SITE_CONFIG_PATH = path.resolve('src/config/site.ts');
const LANGUAGE_CONFIG_PATH = path.resolve('src/i18n.ts');
const REDIRECT_FILES = [
  path.join(DIST_DIR, '_redirects'),
  path.join(DIST_DIR, 'redirects'),
  path.join(DIST_DIR, 'f_redirects'),
];

// --- SEO Allowlist (to reduce false positives on known patterns) ---
function compileAllowPatterns(envValue) {
  const raw = String(envValue || '').trim();
  if (!raw) return [];
  return raw
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .map(p => {
      try {
        return new RegExp(p);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}
const DEFAULT_ALLOW_OG_INCOMPLETE = [
  /^\/compare(\/|$)/,         // Comparison pages can inherit OG from canonical
];
const DEFAULT_ALLOW_CANONICAL_NON_SELF = [
  // Intentionally left empty; fill with patterns when non-self canonical is expected
];
const ENV_ALLOW_OG = compileAllowPatterns(process.env.CHECK_SEO_ALLOW_OG);
const ENV_ALLOW_CANONICAL = compileAllowPatterns(process.env.CHECK_SEO_ALLOW_CANONICAL);
function isWhitelisted(type, pagePath) {
  const patterns =
    type === 'ogIncomplete'
      ? [...DEFAULT_ALLOW_OG_INCOMPLETE, ...ENV_ALLOW_OG]
      : [...DEFAULT_ALLOW_CANONICAL_NON_SELF, ...ENV_ALLOW_CANONICAL];
  return patterns.some(rx => {
    try {
      return rx.test(pagePath);
    } catch {
      return false;
    }
  });
}

function loadPrerenderRoutesFromArg() {
  const argPath = process.argv[2] ? path.resolve(process.argv[2]) : null;
  if (!argPath || !fs.existsSync(argPath)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(argPath, 'utf-8'));
    return Array.isArray(parsed) ? parsed.map((p) => String(p || '/')) : [];
  } catch {
    return [];
  }
}

const HREFLANG_MAP = {
  'zh': 'zh-Hans',
  'zh-CN': 'zh-Hans',
  'en': 'en',
  'en-US': 'en'
};

function normalizeLocaleCode(input) {
  const raw = String(input || '').trim().toLowerCase();
  if (!raw) return '';
  if (raw.startsWith('zh')) return 'zh';
  if (raw.startsWith('en')) return 'en';
  return raw;
}

// --- Helpers from audit-seo.mjs ---

// Strict checks toggles (opt-in to avoid breaking existing pipelines)
const STRICT_HEAD = String(process.env.CHECK_STRICT_HEAD || '').trim() === '1';
const STRICT_SITEMAP = String(process.env.CHECK_STRICT_SITEMAP || '').trim() === '1';

const readText = (filePath) => {
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, 'utf8');
};

const readJson = (filePath) => {
  const raw = readText(filePath);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const parseSsrPathsModule = (src) => {
  if (!src) return null;
  const match = src.match(/new Set\((\[[\s\S]*?\])\)/);
  if (!match) return null;
  try {
    const arr = JSON.parse(match[1]);
    return Array.isArray(arr) ? arr : null;
  } catch {
    return null;
  }
};

const auditSsrWhitelistSync = (issues) => {
  const prerenderPath = path.resolve('prerender-routes.json');
  const ssrPathFile = path.resolve('functions/ssr-paths.ts');
  const prerenderRoutes = readJson(prerenderPath);
  if (!Array.isArray(prerenderRoutes) || prerenderRoutes.length === 0) {
    issues.fail.push('[Build] prerender-routes.json 缺失或为空，无法生成 SSR 白名单');
    return;
  }
  const ssrSrc = readText(ssrPathFile);
  if (!ssrSrc) {
    issues.fail.push('[Build] functions/ssr-paths.ts 缺失，SSR 白名单未同步');
    return;
  }
  const ssrRoutes = parseSsrPathsModule(ssrSrc);
  if (!Array.isArray(ssrRoutes) || ssrRoutes.length === 0) {
    issues.fail.push('[Build] functions/ssr-paths.ts 无有效 SSR_PATHS');
    return;
  }
  const normalizeSet = (arr) => new Set(arr.map(normalizePathname));
  const prerenderSet = normalizeSet(prerenderRoutes);
  const ssrSet = normalizeSet(ssrRoutes);
  const missing = [];
  for (const p of prerenderSet) {
    if (!ssrSet.has(p)) missing.push(p);
  }
  const extra = [];
  for (const p of ssrSet) {
    if (!prerenderSet.has(p)) extra.push(p);
  }
  if (missing.length > 0) {
    issues.fail.push(`[Build] SSR 白名单缺失 ${missing.length} 项（示例：${missing.slice(0, 5).join(', ')}）`);
  }
  if (extra.length > 0) {
    issues.warn.push(`[Build] SSR 白名单多出 ${extra.length} 项（示例：${extra.slice(0, 5).join(', ')}）`);
  }
};

const EXPECTED_DOMAIN = (process.env.SITE_URL ? String(process.env.SITE_URL) : 'https://chinactscanner.org').replace(/\/+$/, '');
const extractDomainFromSiteConfig = (_tsSource) => EXPECTED_DOMAIN;

const extractLocalesFromLanguageConfig = (tsSource) => {
  if (!tsSource) return { defaultLocale: null, locales: [] };
  const defaultMatch = tsSource.match(/DEFAULT_LOCALE:\s*["']([^"']+)["']/);
  const supportedMatch = tsSource.match(/SUPPORTED_LOCALES:\s*\[([^\]]+)\]/);
  
  const defaultLocale = defaultMatch ? String(defaultMatch[1]).trim() : 'en';
  const locales = supportedMatch ? 
    supportedMatch[1].split(',').map(s => s.match(/["']([^"']+)["']/)?.[1]).filter(Boolean) : 
    ['en', 'zh'];
  
  return { defaultLocale, locales };
};

const normalizeDomain = (input) => String(input || '').trim().replace(/\/$/, '');

const stripDomain = (url, expectedDomain) => {
  const u = String(url || '').trim();
  if (!expectedDomain) return u;
  if (u === expectedDomain) return '/';
  if (u.startsWith(`${expectedDomain}/`)) return `/${u.slice((expectedDomain + '/').length)}`;
  return u;
};

const normalizePath = (p) => {
  const raw = String(p || '').trim();
  if (!raw) return '/';
  if (/^https?:\/\//.test(raw)) return raw;
  if (!raw.startsWith('/')) return `/${raw}`;
  return raw;
};

const parseRedirectRules = (text) => {
  if (!text) return [];
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  const rules = [];
  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    const parts = line.split(/\s+/).filter(Boolean);
    if (parts.length < 3) continue;
    const from = normalizePath(parts[0]);
    const to = normalizePath(parts[1]);
    const status = Number(parts[2]);
    if (!Number.isFinite(status)) continue;
    rules.push({ from, to, status, index: idx });
  }
  return rules;
};

// --- End Helpers ---

function ensureWindowsEnvForPuppeteer() {
  if (process.platform !== 'win32') return;
  if (!process.env.PROGRAMFILES) process.env.PROGRAMFILES = 'C:\\Program Files';
  if (!process.env['PROGRAMFILES(X86)']) process.env['PROGRAMFILES(X86)'] = 'C:\\Program Files (x86)';
  if (!process.env.LOCALAPPDATA) {
    const home =
      process.env.USERPROFILE ||
      (process.env.HOMEDRIVE && process.env.HOMEPATH ? `${process.env.HOMEDRIVE}${process.env.HOMEPATH}` : '');
    process.env.LOCALAPPDATA = home ? path.join(home, 'AppData', 'Local') : 'C:\\Users\\Default\\AppData\\Local';
  }
}

function findBrowserExecutablePath() {
  ensureWindowsEnvForPuppeteer();
  const fromEnv = String(process.env.PUPPETEER_EXECUTABLE_PATH || '').trim();
  if (fromEnv) return fromEnv;

  if (process.platform === 'win32') {
    const localAppData = process.env.LOCALAPPDATA;
    const candidates = [
      localAppData ? path.join(localAppData, 'Google', 'Chrome', 'Application', 'chrome.exe') : null,
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      localAppData ? path.join(localAppData, 'Microsoft', 'Edge', 'Application', 'msedge.exe') : null,
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      localAppData ? path.join(localAppData, 'BraveSoftware', 'Brave-Browser', 'Application', 'brave.exe') : null,
      'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
      'C:\\Program Files (x86)\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
    ].filter(Boolean);

    for (const candidate of candidates) {
      try {
        if (fs.existsSync(candidate)) return candidate;
      } catch {
      }
    }
  }

  const incoming = new Map(Array.from(allPagePaths).map(p => [p, 0]));
  for (const [src, targets] of internalOutgoing.entries()) {
    for (const t of targets) {
      if (incoming.has(t)) incoming.set(t, (incoming.get(t) || 0) + 1);
    }
  }
  for (const [p, c] of incoming.entries()) {
    if (p !== '/' && c === 0) {
      issues.warn.push(`[SEO] 孤立页：${p} 没有任何站内入链`);
    }
  }

  if (sitemapPaths && sitemapPaths.size > 0) {
    for (const p of sitemapPaths) {
      const cp = canonicalByPage.get(p) || '';
      if (cp && cp !== p) {
        issues.warn.push(`[SEO] sitemap 页面 canonical 非自引用：${p} canonical=${cp}`);
      }
    }
  }

  for (const [lang, hrefMap] of siteAltMap.entries()) {
    for (const [target, sources] of hrefMap.entries()) {
      if (sources.size > 1) {
        issues.warn.push(`[SEO] hreflang 冲突：lang=${lang} ${target} 被多个页面声明：${Array.from(sources).join(', ')}`);
      }
    }
  }

  return null;
}

function resolveBrowserLaunchOptions() {
  const executablePath = findBrowserExecutablePath();
  if (executablePath) return { executablePath };

  ensureWindowsEnvForPuppeteer();
  const channelFromEnv = String(process.env.PUPPETEER_CHANNEL || '').trim() || null;
  const channel = channelFromEnv || (process.platform === 'win32' ? 'msedge' : null);
  return { channel: channel || undefined };
}

function getCliArgValue(key) {
  const idx = process.argv.indexOf(key);
  if (idx === -1) return null;
  const next = process.argv[idx + 1];
  if (!next || next.startsWith('--')) return null;
  return next;
}

function parseCliOptions() {
  const args = process.argv.slice(3);
  let mode = 'dev';
  let baseUrl = '';
  for (const a of args) {
    if (a.startsWith('--mode=')) {
      mode = a.split('=')[1] || mode;
    } else if (a === '--mode' || a === '-m') {
      const idx = args.indexOf(a);
      if (idx >= 0 && args[idx + 1]) mode = args[idx + 1];
    } else if (a.startsWith('--baseUrl=')) {
      baseUrl = a.split('=')[1] || baseUrl;
    }
  }
  mode = String(mode || '').trim().toLowerCase() || 'dev';
  baseUrl = normalizeDomain(baseUrl);
  return { mode, baseUrl };
}

function resolveReportPath() {
  const byArg = getCliArgValue('--report');
  if (byArg) return path.resolve(byArg);
  const byEnv = String(process.env.CHECK_LINKS_REPORT || '').trim();
  if (byEnv) return path.resolve(byEnv);
  const now = new Date();
  const pad2 = (value) => String(value).padStart(2, '0');
  const timestamp = [
    now.getFullYear(),
    pad2(now.getMonth() + 1),
    pad2(now.getDate()),
    '-',
    pad2(now.getHours()),
    pad2(now.getMinutes()),
    pad2(now.getSeconds()),
  ].join('');
  return path.resolve('reports', `audit-report-${timestamp}.md`);
}

function generateSummary(issuesList) {
  const map = new Map();
  for (const issue of issuesList) {
    let signature = issue;
    
    // 1. Try to split by Chinese colon or standard colon followed by space (common for "Error: Details" pattern)
    if (signature.includes('：')) {
      signature = signature.split('：')[0].trim();
    } else if (signature.match(/:\s/)) { 
       // Only split on colon if followed by space to avoid splitting URLs like https://...
       const parts = signature.split(/:\s/);
       // Heuristic: if the part before colon is short and not a URL protocol, treat it as the category
       if (!parts[0].match(/^https?$/) && parts[0].length < 50) {
           signature = parts[0].trim();
       }
    }

    // 2. Remove paths/URLs if they are mixed in the string (e.g. "[Tag] /path/to/file Message")
    // This handles cases like "[SEO] /zh/foo Description too short" -> "[SEO] Description too short"
    const tokens = signature.split(/\s+/);
    const filteredTokens = tokens.filter(t => {
      // Filter out absolute paths, relative paths starting with dist/, or files with extensions
      if (t.startsWith('/') || t.startsWith('dist/') || t.match(/\.[a-z0-9]{2,4}$/i)) return false;
      // Filter out URLs
      if (t.startsWith('http://') || t.startsWith('https://')) return false;
      // Filter out specific details in parens e.g. (39 chars)
      if (t.startsWith('(') && t.endsWith(')')) return false;
      return true;
    });
    signature = filteredTokens.join(' ');
    
    // 3. Final cleanup of common leftover patterns
    signature = signature.replace(/\(\d+ chars\)/g, ''); // Remove leftovers like "(39 chars)"
    signature = signature.replace(/\s+/g, ' ').trim();
    
    map.set(signature, (map.get(signature) || 0) + 1);
  }
  
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1]); // Sort by count descending
}

function formatAuditMarkdown({ issues, siteConfig }) {
  const now = new Date().toISOString();
  const siteUrl = siteConfig?.url || '';
  const fail = Array.isArray(issues?.fail) ? issues.fail : [];
  const warn = Array.isArray(issues?.warn) ? issues.warn : [];

  const lines = [];
  lines.push('# SEO/UX Audit Report');
  lines.push('');
  lines.push(`- GeneratedAt: ${now}`);
  if (siteUrl) lines.push(`- SiteUrl: ${siteUrl}`);
  lines.push(`- DistDir: ${DIST_DIR.replace(/\\/g, '/')}`);
  lines.push(`- FailCount: ${fail.length}`);
  lines.push(`- WarnCount: ${warn.length}`);
  lines.push('');

  const hreflangMissingBacklink = warn.filter(s => s.includes('hreflang 缺少回链')).length;
  const hreflangConflicts = warn.filter(s => s.includes('全局 hreflang 冲突')).length;
  if (hreflangMissingBacklink > 0 || hreflangConflicts > 0) {
    lines.push('## 🌐 Hreflang Summary');
    lines.push('| Type | Count |');
    lines.push('| :--- | ---: |');
    if (hreflangMissingBacklink > 0) lines.push(`| 缺少回链 | ${hreflangMissingBacklink} |`);
    if (hreflangConflicts > 0) lines.push(`| 全局冲突 | ${hreflangConflicts} |`);
    lines.push('');
  }

  const orphanPages = warn.filter(s => s.startsWith('[SEO] 孤立页：')).length;
  const zeroOut = warn.filter(s => s.includes('出链为0（无内部链接）')).length;
  if (orphanPages > 0 || zeroOut > 0) {
    lines.push('## 🔗 Orphan Summary');
    lines.push('| Type | Count |');
    lines.push('| :--- | ---: |');
    if (orphanPages > 0) lines.push(`| 孤立页 | ${orphanPages} |`);
    if (zeroOut > 0) lines.push(`| 出链为0 | ${zeroOut} |`);
    lines.push('');
  }

  const canonicalNonSelf = warn.filter(s => s.includes('canonical 非自引用')).length;
  const canonicalNonAbs = warn.filter(s => s.includes('canonical 非绝对 URL')).length;
  const canonicalParams = warn.filter(s => s.includes('canonical 包含参数或 hash')).length;
  if (canonicalNonSelf > 0 || canonicalNonAbs > 0 || canonicalParams > 0) {
    lines.push('## 🔖 Canonical Summary');
    lines.push('| Type | Count |');
    lines.push('| :--- | ---: |');
    if (canonicalNonSelf > 0) lines.push(`| 非自引用 | ${canonicalNonSelf} |`);
    if (canonicalNonAbs > 0) lines.push(`| 非绝对URL | ${canonicalNonAbs} |`);
    if (canonicalParams > 0) lines.push(`| 含参数或hash | ${canonicalParams} |`);
    lines.push('');
  }

  const routingHash = [...fail, ...warn].filter(s => s.includes('[Routing]') && (s.includes('hash') || s.includes('“#”'))).length;
  const routingDoubleSlash = warn.filter(s => s.includes('[Routing]') && s.includes('双斜杠')).length;
  const routingSignals = warn.filter(s => s.includes('[Routing] 构建产物包含 hash 路由')).length;
  if (routingHash > 0 || routingDoubleSlash > 0 || routingSignals > 0) {
    lines.push('## 🧭 Routing Summary');
    lines.push('| Type | Count |');
    lines.push('| :--- | ---: |');
    if (routingHash > 0) lines.push(`| URL 出现 hash | ${routingHash} |`);
    if (routingDoubleSlash > 0) lines.push(`| 路径含双斜杠 | ${routingDoubleSlash} |`);
    if (routingSignals > 0) lines.push(`| Hash 路由信号 | ${routingSignals} |`);
    lines.push('');
  }

  // Add Summary Section
  const allIssues = [...fail, ...warn];
  if (allIssues.length > 0) {
    const summary = generateSummary(allIssues);
    if (summary.length > 0) {
      lines.push('## 📊 Analysis');
      lines.push('| Issue Type | Count |');
      lines.push('| :--- | :--- |');
      for (const [type, count] of summary) {
        lines.push(`| ${type} | ${count} |`);
      }
      lines.push('');
    }
  }

  if (fail.length) {
    lines.push('## FAIL');
    for (const i of fail) lines.push(`- ${String(i)}`);
    lines.push('');
  }

  if (warn.length) {
    lines.push('## WARN');
    for (const i of warn) lines.push(`- ${String(i)}`);
    lines.push('');
  }

  if (!fail.length && !warn.length) {
    lines.push('## Result');
    lines.push('- PASS');
    lines.push('');
  }

  return lines.join('\n');
}

function writeAuditMarkdown(reportPath, markdown) {
  const dir = path.dirname(reportPath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(reportPath, markdown, 'utf-8');
}

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function normalizeWhitespace(text) {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

function collectVisibleText(node, chunks) {
  if (!node) return;

  if (node.nodeType === 3) {
    chunks.push(node.textContent || '');
    return;
  }

  if (node.nodeType !== 1) return;

  const tagName = node.tagName?.toLowerCase();
  if (tagName === 'script' || tagName === 'style' || tagName === 'noscript') {
    return;
  }

  for (const child of node.childNodes) {
    collectVisibleText(child, chunks);
  }
}

function extractSourceVisibleText(doc) {
  try {
    const chunks = [];
    collectVisibleText(doc.body, chunks);
    return normalizeWhitespace(chunks.join(' '));
  } catch {
    return '';
  }
}

function readOptionalText(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

function parseSiteConfig() {
  const url = EXPECTED_DOMAIN;
  const langContent = readOptionalText(LANGUAGE_CONFIG_PATH) || '';
  const defaultMatch = langContent.match(/DEFAULT_LOCALE(?:\s*:\s*\w+)?\s*=\s*["']([^"']+)["']/);
  const supportedMatch = langContent.match(/SUPPORTED_LOCALES\s*=\s*\[([^\]]+)\]/);
  
  const defaultLocale = defaultMatch ? String(defaultMatch[1]).trim() : 'en';
  const locales = supportedMatch ? 
    supportedMatch[1].split(',').map(s => s.match(/["']([^"']+)["']/)?.[1]).filter(Boolean) : 
    ['en', 'zh'];
  
  return {
    defaultLocale,
    locales,
    url,
    filePath: SITE_CONFIG_PATH,
  };
}

// Removed source-level redirect detection; rely on dist signals instead.

function scanDistForClientSignals(distDir) {
  const jsSignals = {
    createHashHistory: false,
    hashRouterComponent: false,
    hashRouteLiteral: false,
  };

  walkDir(distDir, filePath => {
    if (!filePath.endsWith('.js')) return;
    const content = readOptionalText(filePath);
    if (!content) return;
    if (!jsSignals.createHashHistory && content.includes('createHashHistory')) jsSignals.createHashHistory = true;
    if (!jsSignals.hashRouterComponent && content.includes('HashRouter')) jsSignals.hashRouterComponent = true;
    if (!jsSignals.hashRouteLiteral && /["'`]#\/[A-Za-z0-9/_-]+/.test(content)) jsSignals.hashRouteLiteral = true;
  });

  return jsSignals;
}

function normalizePathname(pathname) {
  let p = String(pathname || '/').trim();
  if (!p.startsWith('/')) p = `/${p}`;
  if (p !== '/' && p.endsWith('/')) p = p.slice(0, -1);
  return p;
}

function relHtmlToPathname(relHtmlPath) {
  const rel = String(relHtmlPath || '').replace(/\\/g, '/');
  if (!rel || rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) {
    const dir = rel.slice(0, -'/index.html'.length);
    return normalizePathname(`/${dir}`);
  }
  if (rel.endsWith('.html')) {
    return normalizePathname(`/${rel.slice(0, -'.html'.length)}`);
  }
  return normalizePathname(`/${rel}`);
}

function distHasRoute(urlPath) {
  const normalized = String(urlPath || '/');
  const noQuery = normalized.split('?')[0].split('#')[0];
  const trimmed = noQuery.replace(/^\/+/, '').replace(/\/+$/, '');

  if (!trimmed) {
    return fs.existsSync(path.join(DIST_DIR, 'index.html'));
  }

  const asDir = path.join(DIST_DIR, trimmed, 'index.html');
  const asFile = path.join(DIST_DIR, `${trimmed}.html`);
  return fs.existsSync(asDir) || fs.existsSync(asFile);
}

function buildCandidatePaths(siteConfig) {
  const candidates = new Set();
  candidates.add('/');

  const locales = siteConfig?.locales || [];
  
  // Pearl Coach 项目特定的路由结构
  const sections = [
    'about',
    'blog',
    'glossary',
    'diagnostic',
    'services',
    'results',
    'signals',
    'press',
    'connect',
    'pearl-framework',
    'author/heisenberg',
    'terms-of-service',
    'privacy-policy',
    'guide/pearl-method-startup-kit',
    'guide/cen-survival-toolkit',
    'services/private-consulting',
    'services/resilience-rebuild-camp',
    'services/camp-success',
  ];

  for (const locale of locales) {
    const localePrefix = locale === 'zh-CN' ? 'zh' : locale;
    candidates.add(`/${localePrefix}`);
    candidates.add(`/${localePrefix}/`);
    for (const s of sections) {
      const p = `/${localePrefix}/${s}`;
      if (distHasRoute(p)) {
        candidates.add(p);
        candidates.add(`${p}/`);
      }
    }
  }

  return Array.from(candidates);
}

function hashText(input) {
  return crypto.createHash('sha1').update(String(input || ''), 'utf8').digest('hex');
}

function parseCanonicalUrl(canonicalHref, baseUrl) {
  if (!canonicalHref) return null;
  
  try {
    // 1. Absolute URL
    if (canonicalHref.startsWith('http')) {
      return new URL(canonicalHref);
    }
    
    // 2. Protocol-relative URL
    if (canonicalHref.startsWith('//')) {
      return new URL(`https:${canonicalHref}`);
    }
    
    // 3. Relative path
    return new URL(canonicalHref, baseUrl);
  } catch {
    return null;
  }
}

function isValidCanonical(canonicalPath, finalPath, siteConfig) {
  // Normalize paths to ensure consistent comparison (remove trailing slashes)
  const normCanonical = canonicalPath.replace(/\/$/, '') || '/';
  const normFinal = finalPath.replace(/\/$/, '') || '/';

  // 1. Self-reference (Standard)
  if (normCanonical === normFinal) return true;
  
  return false;
}

function checkI18nCanonicalStrategy(group, siteConfig) {
  const defaultLocale = siteConfig?.defaultLocale || 'en';
  
  // Check if all pages point to the same canonical (usually default language version)
  const canonicalTargets = new Set(group.map(g => g.canonicalPath).filter(Boolean));
  
  if (canonicalTargets.size === 1) {
    const target = [...canonicalTargets][0];
    
    // Verify if this target is valid for at least one page in the group (e.g. self-reference for default locale)
    const isValidTarget = group.some(g => {
        // Is it self-referencing for this page?
        if (g.finalPath === target) return true;
        
        // Is it the default language version of this page?
        // Assume target is /foo and g.finalPath is /zh/foo
        const parts = g.finalPath.split('/').filter(Boolean);
        const lang = parts[0];
        if (lang && siteConfig?.locales?.includes(lang) && lang !== defaultLocale) {
             const noLang = g.finalPath.replace(new RegExp(`^/${lang}`), '') || '/';
             if (noLang === target) return true;
        }
        return false;
    });
    
    return isValidTarget;
  }
  
  return false;
}

async function runRedirectAndDuplicateAudit(baseUrl, siteConfig) {
  const issues = { fail: [], warn: [] };
  let puppeteer;
  try {
    ({ default: puppeteer } = await import('puppeteer'));
  } catch {
    issues.warn.push('[Routing] 未安装 puppeteer，跳过重定向/重复检测');
    return issues;
  }
  const prerenderRoutes = loadPrerenderRoutesFromArg();
  if (prerenderRoutes.length > 0) {
    console.log(`🔗 Checking ${prerenderRoutes.length} prerender routes exist in dist...`);
    for (const p of prerenderRoutes) {
      const normalized = normalizePathname(p);
      if (!distHasRoute(normalized)) {
        issues.fail.push(`[Build] prerender-routes.json 指向 dist 中不存在的页面：${normalized}`);
      }
    }
  }
  const candidates = buildCandidatePaths(siteConfig);

  const browser = await puppeteer.launch({
    ...resolveBrowserLaunchOptions(),
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const samples = [];

  for (const urlPath of candidates) {
    if (!distHasRoute(urlPath)) continue;

    const firstSeg = normalizePathname(urlPath).split('/')[1] || '';
    const language = firstSeg === 'zh' ? 'zh-CN' : 'en-US';
    const page = await browser.newPage();

    await page.evaluateOnNewDocument(lang => {
      try {
        Object.defineProperty(navigator, 'language', { get: () => lang });
        Object.defineProperty(navigator, 'languages', { get: () => [lang] });
      } catch {}
      try {
        // Pearl Coach 可能使用不同的localStorage键
        localStorage.removeItem('app-locale');
        localStorage.removeItem('lng');
      } catch {}
    }, language);

    const targetUrl = `${baseUrl}${urlPath}`;
    // 检查页面链接
    try {
      await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 120000 });
      
      // Get the full HTML for debugging if needed
      // const html = await page.content();
      // if (urlPath.includes('pearl-framework')) console.log(`[DEBUG] HTML for ${urlPath}:`, html.substring(0, 500));
      
    } catch (e) {
      console.error(`Error visiting ${urlPath}:`, e.message);
    }
    await new Promise(r => setTimeout(r, 800));

    const finalUrl = page.url();
    const final = new URL(finalUrl);

    const requestedPath = normalizePathname(urlPath);
    const finalPath = normalizePathname(final.pathname);

    if (requestedPath !== finalPath) {
      issues.fail.push(`[GSC] 网页会自动重定向：${requestedPath} -> ${finalPath}`);
    }

    const canonicalHref = await page
      .$eval('link[rel="canonical"]', el => el.getAttribute('href') || '')
      .catch(() => '');

    const canonicalPath = canonicalHref
      ? (() => {
          const u = parseCanonicalUrl(canonicalHref, baseUrl);
          return u ? normalizePathname(u.pathname) : '';
        })()
      : '';

    const alternates = await page
      .$$eval('link[rel="alternate"][hreflang][href]', els =>
        els
          .map(el => ({
            hreflang: (el.getAttribute('hreflang') || '').toLowerCase(),
            href: el.getAttribute('href') || '',
          }))
          .filter(x => x.hreflang && x.href),
      )
      .catch(() => []);

    const domText = await page.evaluate(() => (document.body?.innerText || '').replace(/\s+/g, ' ').trim());
    const fingerprint = hashText(domText.slice(0, 5000));

    samples.push({
      requestedPath,
      finalPath,
      canonicalPath,
      hasCanonical: Boolean(canonicalHref),
      fingerprint,
      alternates,
    });

    if (canonicalPath && !isValidCanonical(canonicalPath, finalPath, siteConfig)) {
      console.log(`[DEBUG] Mismatch for ${finalPath}: canonicalHref="${canonicalHref}" canonicalPath="${canonicalPath}"`);
      const headHtml = await page.$eval('head', el => el.innerHTML).catch(() => 'HEAD NOT FOUND');
      console.log(`[DEBUG] Head content length:`, headHtml.length);
      // console.log(`[DEBUG] Head content:`, headHtml); // Too long?

      issues.warn.push(
        `[SEO] canonical 非自引用：${finalPath} canonical=${canonicalPath}`,
      );
    }

    await page.close();
  }

  const locales = siteConfig?.locales || [];
  const expectedHreflangs = [...locales.map(l => HREFLANG_MAP[l] || l), 'x-default'].map(x => x.toLowerCase());
  const sampleByFinal = new Map(samples.map(s => [s.finalPath, s]));

  for (const s of samples) {
    if (expectedHreflangs.length > 0) {
      const seen = new Set(
        (s.alternates || []).map(a => (a.hreflang || '').toLowerCase()).filter(Boolean),
      );
      const missing = expectedHreflangs.filter(x => !seen.has(x));
      if (missing.length > 0) {
        issues.warn.push(`[SEO] hreflang 缺失：${s.finalPath} missing=${missing.join(',')}`);
      }
    }

    const currentLang = normalizeLocaleCode(s.finalPath.split('/')[1] || '');
    const defaultLocaleCode = normalizeLocaleCode(siteConfig?.defaultLocale || 'en');
    const currentLocale = locales.includes(currentLang) ? currentLang : defaultLocaleCode || 'en';
    const currentHreflang = (HREFLANG_MAP[currentLocale] || currentLocale).toLowerCase();
    
    if (currentLocale) {
      const selfAlt = (s.alternates || []).find(a => (a.hreflang || '').toLowerCase() === currentHreflang);
      if (selfAlt) {
        try {
          const u = new URL(selfAlt.href, baseUrl);
          const p = normalizePathname(u.pathname);
          // Compare normalized paths (ignoring trailing slashes)
          if (p.replace(/\/$/, '') !== s.finalPath.replace(/\/$/, '')) {
            issues.warn.push(`[SEO] hreflang 自引用不一致：${s.finalPath} ${currentLocale}=${p}`);
          }
        } catch {
          issues.warn.push(`[SEO] hreflang URL 无法解析：${s.finalPath} ${currentLocale}=${selfAlt.href}`);
        }
      }
    }

    if (currentLocale) {
      for (const alt of s.alternates || []) {
        if (!alt || !alt.hreflang || !alt.href) continue;
        // Skip self-reference check here as we did it above
        const altLang = String(alt.hreflang || '').toLowerCase();
        if (altLang === currentHreflang || altLang === 'x-default') continue;
        
        let targetPath = '';
        try {
          targetPath = normalizePathname(new URL(alt.href, baseUrl).pathname);
        } catch {
          continue;
        }
        const targetSample = sampleByFinal.get(targetPath);
        
        // If target page doesn't exist in our scan, maybe we can't verify backlink
        if (!targetSample) continue;
        
        const back = (targetSample.alternates || []).find(a => (a.hreflang || '').toLowerCase() === currentHreflang);
        if (!back) {
           // Double check if targetSample has "x-default" which might match? 
           // No, x-default is not a language.
           
           // If targetSample is the default locale page, maybe it didn't list its own language explicitly?
           // But it SHOULD.
           
          issues.warn.push(`[SEO] hreflang 缺少回链：${s.finalPath} -> ${targetPath}`);
          continue;
        }
        try {
          const backPath = normalizePathname(new URL(back.href, baseUrl).pathname);
          if (backPath !== s.finalPath) {
            issues.warn.push(`[SEO] hreflang 回链不一致：${s.finalPath} -> ${targetPath} back=${backPath}`);
          }
        } catch {}
      }
    }
  }

  const byFingerprint = new Map();
  for (const s of samples) {
    if (!byFingerprint.has(s.fingerprint)) byFingerprint.set(s.fingerprint, []);
    byFingerprint.get(s.fingerprint).push(s);
  }

  for (const group of byFingerprint.values()) {
    const paths = Array.from(new Set(group.map(g => g.finalPath)));
    if (paths.length < 2) continue;

    const missingCanonical = group.some(g => !g.hasCanonical);
    const canonicalSet = new Set(group.map(g => g.canonicalPath).filter(Boolean));

    if (missingCanonical || canonicalSet.size !== 1) {
      // Check if it satisfies i18n strategy (all pointing to default or valid targets)
      const isI18nValid = checkI18nCanonicalStrategy(group, siteConfig);
      
      if (!isI18nValid) {
        issues.fail.push(`[GSC] 重复网页，用户未选定规范网页：${paths.join(', ')}`);
      }
    }
  }

  if (samples.length > 0) {
    const anyMissing = samples.some(s => !s.hasCanonical);
    const anyNonSelf = samples.some(s => s.hasCanonical && s.canonicalPath && s.canonicalPath !== s.finalPath);
    if (anyMissing || anyNonSelf) {
      const canonicalStrategy = anyMissing ? '缺失' : '非自引用';
      issues.warn.push(`[SEO] canonical 策略：${canonicalStrategy}`);
    }
  }

  await browser.close();
  return issues;
}

function collectHtmlFiles(distDir) {
  const htmlFiles = [];
  walkDir(distDir, filePath => {
    if (!filePath.endsWith('.html')) return;
    const normalized = String(filePath || '').replace(/\\/g, '/');
    // Exclude debug head fragments emitted by generate-static.mjs
    // These are not real pages and will poison hreflang backlink checks.
    if (
      /\/__debug_heads__\//.test(normalized) ||
      normalized.endsWith('.head.html') ||
      normalized.endsWith('/__client-template.html')
    ) {
      return;
    }
    htmlFiles.push(filePath);
  });
  return htmlFiles;
}

async function startStaticServer(distDir) {
  let serveMiddleware = null;
  try {
    const { default: sirv } = await import('sirv');
    serveMiddleware = sirv(distDir, { dev: true, single: true });
  } catch {
    serveMiddleware = null;
  }
  const server = http.createServer((req, res) => {
    if (serveMiddleware) {
      return serveMiddleware(req, res);
    }
    try {
      const url = new URL(req.url || '/', 'http://localhost');
      let p = decodeURIComponent(url.pathname);
      if (p.endsWith('/')) p = p + 'index.html';
      // Try exact path
      let toRead = path.join(distDir, p);
      // If exact path doesn't exist, try appending .html when requesting a route like /foo
      if (!fs.existsSync(toRead) || fs.statSync(toRead).isDirectory()) {
        const withHtml = p.endsWith('.html') ? null : path.join(distDir, `${p}.html`);
        if (withHtml && fs.existsSync(withHtml) && !fs.statSync(withHtml).isDirectory()) {
          toRead = withHtml;
        } else {
          toRead = path.join(distDir, 'index.html');
        }
      }
      if (fs.existsSync(toRead)) {
        const content = fs.readFileSync(toRead);
        res.statusCode = 200;
        res.end(content);
      } else {
        res.statusCode = 404;
        res.end('Not Found');
      }
    } catch {
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });
  return new Promise((resolve, reject) => {
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      if (!addr || typeof addr === 'string') {
        reject(new Error('Failed to bind server'));
        return;
      }
      resolve({
        baseUrl: `http://127.0.0.1:${addr.port}`,
        close: () =>
          new Promise(r => {
            server.close(() => r(true));
          }),
      });
    });
  });
}

function auditSourceCode(issues) {
  const seoComponents = SEO_COMPONENT_PATHS.map(readText).filter(Boolean);
  const seoUtil = readText(SEO_UTIL_PATH);
  const routeDirs = [
    path.resolve('src/lib/routes'),
    path.resolve('src/lib/routes/slices'),
  ];
  const routeHeadLeaks = [];
  
  if (seoComponents.length === 0 && !seoUtil) {
    issues.warn.push('未找到 SEO 组件/工具（src/components/molecules/SEOHead.tsx 或 src/utils/seo.ts），无法执行 hreflang/canonical 规则检查');
  } else {
    const combined = `${seoComponents.join('\n')}\n${seoUtil || ''}`;
    if (/<meta\b[^>]*\bname=["']keywords["']/i.test(combined)) {
      issues.warn.push('SEO 组件包含 meta keywords（建议移除；现代搜索引擎不使用该信号）');
    }
    if (!/hreflang\s*:\s*['"]x-default['"]/.test(combined)) {
      issues.warn.push('未检测到 x-default hreflang（国际化 SEO 规范要求）');
    }
  }
  for (const dir of routeDirs) {
    if (!fs.existsSync(dir)) continue;
    walkDir(dir, (filePath) => {
      if (!/\.(ts|tsx)$/.test(filePath)) return;
      if (filePath.endsWith('routerInit.tsx')) return;
      const src = readText(filePath) || '';
      if (!src) return;
      const hasCanonical = /rel=["']canonical["']/i.test(src);
      const hasHreflang = /hreflang/i.test(src);
      if (hasCanonical || hasHreflang) {
        routeHeadLeaks.push(path.relative(process.cwd(), filePath));
      }
    });
  }
  if (routeHeadLeaks.length > 0) {
    const msg = `[SEO] 页面路由包含 canonical/hreflang 输出：${routeHeadLeaks.slice(0, 10).join(', ')}${routeHeadLeaks.length > 10 ? '…' : ''}`;
    if (STRICT_HEAD) issues.fail.push(msg);
    else issues.warn.push(msg);
  }
}

function auditStaticAssets(distDir, issues, expectedDomain, activeDefaultLocale) {
  const llmsPath = path.join(distDir, 'llms.txt');
  const llmsText = readText(llmsPath);
  if (!llmsText) {
    issues.warn.push('[SEO] dist/llms.txt 不存在（建议由 generate-seo.mjs 生成）');
  } else {
    if (expectedDomain && !llmsText.startsWith(`# ${expectedDomain}`)) {
      issues.warn.push(`[SEO] llms.txt 头部域名不是 ${expectedDomain}`);
    }
    if (activeDefaultLocale === 'en' && /https?:\/\/[\s\S]+\/en(\/|$)/.test(llmsText)) {
      issues.warn.push('[SEO] llms.txt 中检测到默认语言 /en 前缀链接（建议移除）');
    }
  }

  const manifestPath = path.join(distDir, 'manifest.json');
  const manifest = readJson(manifestPath);
  if (!manifest) {
    issues.warn.push('[PWA] dist/manifest.json 缺失或不是有效 JSON');
  } else {
    if (!manifest.name || !manifest.short_name) issues.warn.push('[PWA] manifest.json 缺少 name/short_name');
    if (!manifest.start_url) issues.warn.push('[PWA] manifest.json 缺少 start_url');
    if (!manifest.icons || !Array.isArray(manifest.icons) || manifest.icons.length === 0) {
      issues.warn.push('[PWA] manifest.json 缺少 icons 数组');
    } else {
      const sizes = new Set(manifest.icons.map((i) => i?.sizes).filter(Boolean));
      if (!sizes.has('192x192')) issues.warn.push('[PWA] manifest.json icons 未包含 192x192');
      if (!sizes.has('512x512')) issues.warn.push('[PWA] manifest.json icons 未包含 512x512');
    }
  }

  const indexHtmlPath = path.join(distDir, 'index.html');
  const indexHtml = readText(indexHtmlPath);
  if (indexHtml) {
    if (!/<meta\s+name=["']viewport["']/.test(indexHtml)) issues.warn.push('[SEO] index.html 缺少 viewport meta');
    if (!/<link\s+rel=["']manifest["']/.test(indexHtml)) issues.warn.push('[PWA] index.html 未链接 manifest.json（缺少 rel="manifest"）');
    if (!/<meta\s+name=["']theme-color["']/.test(indexHtml)) issues.warn.push('[PWA] index.html 缺少 theme-color meta');
    const hasSrcRefs = /\b(?:src|href)=["']\/src\//i.test(indexHtml);
    if (hasSrcRefs) {
      const msg = '[Build] index.html 引用了 /src/ 资源（可能是未构建的开发引用）';
      if (STRICT_HEAD) issues.fail.push(msg);
      else issues.warn.push(msg);
    }
  }
}

function auditRobotsAndSitemaps(distDir, issues, expectedDomain, activeDefaultLocale) {
  const robotsPath = path.join(distDir, 'robots.txt');
  const robotsText = readText(robotsPath);
  
  if (!robotsText) {
    issues.fail.push('[SEO] dist/robots.txt 未找到');
  } else {
    const lower = robotsText.toLowerCase();
    if (/\bdisallow:\s*\/\s*$/im.test(robotsText)) {
      issues.fail.push('[SEO] robots.txt 禁止抓取全站（Disallow: /）');
    }
    const sitemapLine = robotsText.split('\n').map(l => l.trim()).find(l => /^Sitemap:\s+/i.test(l));
    if (!sitemapLine) {
      issues.warn.push('[SEO] robots.txt 未声明 Sitemap');
    } else if (expectedDomain && !sitemapLine.includes(`${expectedDomain}/sitemap.xml`)) {
      issues.warn.push(`[SEO] robots.txt 的 Sitemap: 不是 ${expectedDomain}/sitemap.xml`);
    }
  }

  // Redirect rules
  const redirectRules = [];
  for (const filePath of REDIRECT_FILES) {
    const t = readText(filePath);
    if (!t) continue;
    redirectRules.push(...parseRedirectRules(t));
  }
  const redirectOnly = redirectRules.filter((r) => [301, 302, 307, 308].includes(r.status));
  
  if (activeDefaultLocale === 'en') {
    const hasEnCollapseRedirect = redirectOnly.some((r) => /^\/en(\/|$)/.test(r.from) && !/^\/en(\/|$)/.test(r.to));
    if (!hasEnCollapseRedirect) {
      issues.warn.push('[SEO] 未检测到 /en 前缀收敛的 301/308 重定向规则');
    }
  }

  // Strict redirect ordering checks (optional)
  const STRICT_REDIRECTS = String(process.env.CHECK_STRICT_REDIRECTS || '').trim() === '1';
  if (STRICT_REDIRECTS && redirectRules.length > 0) {
    // 1) SPA fallback should be last (/* ... 200)
    const spaFallbacks = redirectRules.filter((r) => r.from === '/*' && r.status === 200);
    if (spaFallbacks.length > 0) {
      const lastRule = redirectRules.reduce((a, b) => {
        const ai = typeof a.index === 'number' ? a.index : -Infinity;
        const bi = typeof b.index === 'number' ? b.index : -Infinity;
        return ai > bi ? a : b;
      });
      const lastIsFallback = spaFallbacks.some((r) => r.index === lastRule.index);
      if (!lastIsFallback) {
        issues.warn.push('[Routing] SPA fallback (/* ... 200) 不是重定向规则的最后一条');
      }
    } else {
      issues.warn.push('[Routing] 未检测到 SPA fallback (/* ... 200)');
    }
    // 2) Static assets should be prioritized before SPA fallback
    const staticRule = redirectRules.find((r) => /^\/(assets|static|img|images|fonts|css|js)\/\*/.test(r.from) && r.status === 200);
    if (!staticRule) {
      issues.warn.push('[Routing] 未检测到静态资源优先 200 规则（如 /assets/* 200）');
    } else if (spaFallbacks.length > 0) {
      const spaIndex = Math.min(...spaFallbacks.map((r) => (typeof r.index === 'number' ? r.index : Infinity)));
      if ((typeof staticRule.index === 'number' ? staticRule.index : Infinity) > spaIndex) {
        issues.warn.push('[Routing] 静态资源 200 规则位于 SPA fallback 之后（建议前置）');
      }
    }
  }

  function extractLocs(xml) {
    const locs = [];
    const re = /<loc>\s*([^<]+)\s*<\/loc>/gi;
    let m;
    while ((m = re.exec(String(xml || '')))) locs.push(m[1]);
    return locs;
  }

  function resolveDistXmlPath(loc) {
    let pathname = '';
    try {
      pathname = new URL(loc).pathname;
    } catch {
      pathname = String(loc || '');
    }
    const base = pathname.split('?')[0].split('#')[0];
    const name = path.posix.basename(base);
    const direct = path.join(distDir, name);
    if (fs.existsSync(direct)) return direct;
    return null;
  }

  const sitemapIndexXml = readText(path.join(distDir, 'sitemap.xml'));
  if (!sitemapIndexXml) {
    issues.warn.push('[SEO] dist/sitemap.xml 未找到');
    return;
  }

  const pageLocs = [];
  let sitemapFiles = []; // Track sitemap files for staged exposure check

  function crawlSitemapXml(xmlText) {
    if (/<sitemapindex\b/i.test(xmlText)) {
      const locs = extractLocs(xmlText);
      const collectedPageLocs = [];
      for (const loc of locs) {
        const resolved = resolveDistXmlPath(loc);
        if (!resolved) {
          issues.warn.push(`[SEO] sitemap_index 引用的子 sitemap 未找到：${loc}`);
          continue;
        }
        const fileName = path.basename(resolved);
        sitemapFiles.push({ fileName, loc });
        const child = readText(resolved);
        if (!child) continue;
        const nested = crawlSitemapXml(child);
        collectedPageLocs.push(...nested);
      }
      return collectedPageLocs;
    }
    // urlset
    return extractLocs(xmlText);
  }

  if (/<sitemapindex\b/i.test(sitemapIndexXml)) {
    const indexLocs = extractLocs(sitemapIndexXml);
    const expectedPrefix = expectedDomain ? `${expectedDomain}/` : null;
    for (const loc of indexLocs) {
      if (expectedPrefix && !loc.startsWith(expectedPrefix)) {
        issues.warn.push(`[SEO] sitemap.xml 子 sitemap loc 不以 ${expectedPrefix} 开头：${loc}`);
      }
    }
    const collected = crawlSitemapXml(sitemapIndexXml);
    pageLocs.push(...collected);
  } else {
    pageLocs.push(...extractLocs(sitemapIndexXml));
  }

  if (pageLocs.length === 0) {
    issues.warn.push('[SEO] sitemap 未解析到任何 <loc>');
    return;
  }

  // Detect duplicate <loc> entries (strict opt-in)
  if (STRICT_SITEMAP) {
    const locCounts = new Map();
    for (const loc of pageLocs) {
      const key = String(loc).trim();
      locCounts.set(key, (locCounts.get(key) || 0) + 1);
    }
    const dupLocs = [...locCounts.entries()].filter(([_, c]) => c > 1).map(([k, c]) => `${k} x${c}`);
    if (dupLocs.length > 0) {
      issues.warn.push(`[SEO] sitemap 存在重复 URL：${dupLocs.slice(0, 5).join(', ')}${dupLocs.length > 5 ? '…' : ''}`);
    }
  }

  const paths = [];
  const redirectFromSet = new Set(redirectOnly.map((r) => r.from));

  for (const loc of pageLocs) {
    if (!/^https:\/\//.test(loc)) issues.fail.push(`[SEO] 非 https URL：${loc}`);
    if (expectedDomain && !loc.startsWith(`${expectedDomain}/`) && loc !== expectedDomain) {
      issues.warn.push(`[SEO] URL 不在站点主域名下：${loc}`);
    }
    if (/[?#]/.test(loc)) issues.warn.push(`[SEO] sitemap 包含带参数 URL：${loc}`);
    
    // Check for redirects
    const p = stripDomain(loc, expectedDomain);
    const normalizedPath = normalizePath(p);
    if (redirectFromSet.has(normalizedPath)) {
      issues.fail.push(`[SEO] Sitemap 包含会自动重定向的 URL：${loc}`);
    }

    try {
      const u = new URL(loc);
      paths.push(normalizePath(u.pathname));
    } catch {
      paths.push(normalizePath(loc));
    }
  }

  // Default locale should avoid /en prefix in sitemap (if default is en) - strict opt-in
  if (STRICT_SITEMAP) {
    const defaultIsEn = /^en(\b|[-_])?/i.test(String(activeDefaultLocale || 'en'));
    if (defaultIsEn) {
      const enPrefixed = pageLocs.filter((url) => {
        try {
          const p = new URL(url).pathname;
          return p === '/en' || p.startsWith('/en/');
        } catch {
          const p = String(url || '');
          return p === '/en' || p.startsWith('/en/');
        }
      });
      if (enPrefixed.length > 0) {
        issues.warn.push(`[SEO] sitemap 包含默认语言 /en 前缀 URL（建议移除）：示例 ${enPrefixed.slice(0, 3).join(', ')}${enPrefixed.length > 3 ? '…' : ''}`);
      }
    }
  }

  const enableSplitCheck = String(process.env.CHECK_SPLIT_SITEMAP || '').trim() === '1';
  if (enableSplitCheck) {
    const hasBlogSitemap = sitemapFiles.some((s) => s.fileName.includes('sitemap-blog'));
    const hasShowcaseSitemap = sitemapFiles.some((s) => s.fileName.includes('sitemap-showcase'));
    const containsBlogUrls = pageLocs.some((url) => /\/blog(\/|$)/.test(url) || /\/zh\/blog(\/|$)/.test(url));
    const containsShowcaseUrls = pageLocs.some((url) => /\/showcase(\/|$)/.test(url) || /\/zh\/showcase(\/|$)/.test(url));

    if (!hasBlogSitemap && containsBlogUrls) {
      issues.warn.push('[SEO] Sitemap Index 未包含 blog sitemap，但包含 blog URL');
    }
    if (!hasShowcaseSitemap && containsShowcaseUrls) {
      issues.warn.push('[SEO] Sitemap Index 未包含 showcase sitemap，但包含 showcase URL');
    }
  }
  
  if (robotsText) {
    const disallowBlog = /Disallow:\s*\/blog\b/.test(robotsText) || /Disallow:\s*\/zh\/blog\b/.test(robotsText);
    if (disallowBlog && containsBlogUrls) issues.fail.push('[SEO] robots.txt 禁止 /blog 但 sitemap 包含 blog URL');
  }

  const uniqPaths = new Set();
  for (const p of paths) {
    if (uniqPaths.has(p)) continue;
    uniqPaths.add(p);
    if (!distHasRoute(p)) {
      issues.fail.push(`[SEO] sitemap 指向 dist 中不存在的页面：${p}`);
    }
  }
  return uniqPaths;
}

async function runBrowserAudit(baseUrl, siteConfig) {
  const issues = { fail: [], warn: [] };
  let puppeteer;
  try {
    ({ default: puppeteer } = await import('puppeteer'));
  } catch (_e) {
    issues.warn.push('[Browser] 未安装 puppeteer，跳过浏览器审计');
    return issues;
  }

  const browser = await puppeteer.launch({
    ...resolveBrowserLaunchOptions(),
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  async function runScenario({ label, urlPath, language }) {
    const page = await browser.newPage();

    const consoleErrors = [];
    const consoleWarnings = [];
    const pageErrors = [];
    page.on('console', (msg) => {
      try {
        const t = typeof msg.type === 'function' ? msg.type() : '';
        const text = msg.text?.() ?? msg.text?.toString?.() ?? String(msg);
        if (t === 'error') {
          consoleErrors.push(text);
        } else if (t === 'warning' || t === 'warn') {
          consoleWarnings.push(text);
        }
      } catch {}
    });
    page.on('pageerror', (err) => {
      try {
        const m = err?.message ? String(err.message) : String(err);
        pageErrors.push(m);
      } catch {}
    });

    await page.evaluateOnNewDocument(lang => {
      try {
        Object.defineProperty(navigator, 'language', { get: () => lang });
        Object.defineProperty(navigator, 'languages', { get: () => [lang] });
      } catch {}
      try {
        // Pearl Coach 可能使用不同的localStorage键
        localStorage.removeItem('app-locale');
        localStorage.removeItem('lng');
      } catch {}
    }, language);

    const targetUrl = `${baseUrl}${urlPath}`;
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 2000));

    const finalUrl = page.url();
    const final = new URL(finalUrl);
    const hash = final.hash;

    const visibility = await page.evaluate(() => {
      const b = window.getComputedStyle(document.body || document.documentElement);
      const root = document.getElementById('root');
      const r = root ? window.getComputedStyle(root) : null;
      return {
        bodyDisplay: b?.display || '',
        bodyVisibility: b?.visibility || '',
        bodyOpacity: b?.opacity || '',
        rootDisplay: r?.display || '',
        rootVisibility: r?.visibility || '',
        rootOpacity: r?.opacity || ''
      };
    }).catch(() => null);

    const domTextLen = await page.evaluate(() => {
      const t = (document.body?.innerText || '').replace(/\s+/g, ' ').trim();
      return t.length;
    });

    const h1Count = await page.$$eval('h1', els => els.length).catch(() => 0);

    const canonicalHref = await page
      .$eval('link[rel="canonical"]', el => el.getAttribute('href') || '')
      .catch(() => '');

    await page.close();

    if (pageErrors.length) {
      pageErrors.slice(0, 3).forEach((m) => {
        issues.fail.push(`[JS] ${label} 客户端运行时错误：${m}`);
      });
    }
    if (consoleErrors.length) {
      consoleErrors.slice(0, 3).forEach((m) => {
        issues.warn.push(`[Console] ${label} 控制台错误：${m}`);
      });
    }
    if (consoleWarnings.length) {
      consoleWarnings.slice(0, 3).forEach((m) => {
        issues.warn.push(`[Console] ${label} 控制台告警：${m}`);
      });
    }

    if (visibility) {
      const visFlags = [];
      if (visibility.bodyDisplay === 'none') visFlags.push('body display:none');
      if (visibility.bodyVisibility === 'hidden') visFlags.push('body visibility:hidden');
      if (visibility.bodyOpacity === '0') visFlags.push('body opacity:0');
      if (visibility.rootDisplay === 'none') visFlags.push('#root display:none');
      if (visibility.rootVisibility === 'hidden') visFlags.push('#root visibility:hidden');
      if (visibility.rootOpacity === '0') visFlags.push('#root opacity:0');
      if (visFlags.length) {
        issues.warn.push(`[Render] ${label} 初始可见性异常：${visFlags.join(', ')}`);
      }
    }

    if (hash && hash !== '#') {
      issues.fail.push(`[Routing] ${label} 加载后 URL 出现 hash：${final.pathname}${hash}`);
    } else if (hash === '#') {
      issues.fail.push(`[Routing] ${label} 加载后 URL 末尾出现 “#”`);
    }

    if (urlPath === '/' && final.pathname !== '/') {
      issues.warn.push(
        `[i18n] ${label} 访问 / 自动跳转到 ${final.pathname}（建议像 Adobe 一样询问用户是否切换语言）`,
      );

      if (siteConfig?.defaultLocale && final.pathname.startsWith(`/${siteConfig.defaultLocale}`)) {
        issues.warn.push(
          `[i18n] 默认语言 ${siteConfig.defaultLocale} 使用 /${siteConfig.defaultLocale} 作为入口（更建议默认语言直接用 / 以利用根目录权重）`,
        );
      }
    }

    if (domTextLen < 200) {
      issues.fail.push(`[Render] ${label} DOM 可见文本过少（${domTextLen} chars），疑似 CSR/空壳`);
    }

    if (h1Count === 0) {
      issues.fail.push(`[Content] ${label} DOM 未找到 H1`);
    }

    if (!canonicalHref) {
      issues.fail.push(`[SEO] ${label} DOM 未找到 canonical`);
    }
  }

  await runScenario({ label: '首页(模拟 en)', urlPath: '/', language: 'en-US' });
  await runScenario({ label: '首页(模拟 zh)', urlPath: '/', language: 'zh-CN' });

  await browser.close();
  return issues;
}

async function checkLinks() {
  console.log('🕵️ Running SEO/UX Audit (dist/)...');

  const reportPath = resolveReportPath();
  
  if (!fs.existsSync(DIST_DIR)) {
    console.warn('⚠️ Dist folder not found. Run npm run build first.');
    const md = formatAuditMarkdown({ issues: { fail: ['[Build] dist/ 不存在'], warn: [] }, siteConfig: { url: 'unknown' } });
    writeAuditMarkdown(reportPath, md);
    console.log(`📝 Markdown report saved: ${reportPath}`);
    return;
  }

  const issues = { fail: [], warn: [] };

  auditSsrWhitelistSync(issues);
  const siteConfigText = readText(SITE_CONFIG_PATH);
  const languageConfigText = readText(LANGUAGE_CONFIG_PATH);
  const siteDomain = extractDomainFromSiteConfig(siteConfigText);
  const { defaultLocale, locales: localesFromConfig } = extractLocalesFromLanguageConfig(languageConfigText);
  
  const siteConfig = {
    url: siteDomain,
    defaultLocale: defaultLocale,
    locales: localesFromConfig
  };

  auditSourceCode(issues);
  auditStaticAssets(DIST_DIR, issues, siteDomain, defaultLocale);
  const sitemapPaths = auditRobotsAndSitemaps(DIST_DIR, issues, siteDomain, defaultLocale) || new Set();

  const htmlFiles = collectHtmlFiles(DIST_DIR);
  if (htmlFiles.length === 0) {
    issues.fail.push('[Build] dist/ 中未找到任何 .html 输出');
  }

  const titleToPages = new Map();
  const descToPages = new Map();
  const siteAltMap = new Map();
  const internalOutgoing = new Map();
  const canonicalByPage = new Map();
  const allPagePaths = new Set();
  function normLang(s) {
    const v = String(s || '').toLowerCase();
    if (v.startsWith('zh')) return 'zh';
    if (v.startsWith('en')) return 'en';
    if (v.startsWith('de')) return 'de';
    if (v.startsWith('pt')) return 'pt';
    return v;
  }

  for (const filePath of htmlFiles) {
    const rel = path.relative(DIST_DIR, filePath);
    const html = fs.readFileSync(filePath, 'utf-8');
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    try {
    const pagePath = relHtmlToPathname(rel);
    allPagePaths.add(pagePath);
    const allowedLanguages = new Set((siteConfig?.locales && siteConfig.locales.length ? siteConfig.locales : ['en', 'zh']));
    const langFromPath = (p) => {
      const np = normalizePath(p);
      const seg = (np.split('/')[1] || '').toLowerCase();
      if (seg === 'zh') return 'zh';
      if (seg === 'de') return 'de';
      if (seg === 'pt') return 'pt';
      return 'en';
    };
    const pageLang = langFromPath(pagePath);
    if (!allowedLanguages.has(pageLang)) {
      continue;
    }

    const htmlLangAttr = (doc.documentElement.getAttribute('lang') || '').trim();
    if (!htmlLangAttr) {
      issues.warn.push(`[i18n] ${pagePath} 缺少 html[lang] 属性`);
    } else {
      const hl = normLang(htmlLangAttr);
      if (hl && hl !== pageLang) {
        issues.warn.push(`[i18n] ${pagePath} HTML lang 与路径语言不一致：html=${hl} path=${pageLang}`);
      }
    }

    const imgs = Array.from(doc.querySelectorAll('img'));
    for (const img of imgs) {
      const alt = img.getAttribute('alt');
      const ariaHidden = img.getAttribute('aria-hidden');
      
      // Ignore decorative images marked with aria-hidden="true"
      if (ariaHidden === 'true') continue;

      if (alt == null || alt.trim() === '') {
        issues.fail.push(`[SEO] ${rel} 存在缺失/空 alt 的图片`);
        break;
      }
    }

    const emptyAnchors = Array.from(doc.querySelectorAll('a')).filter(a => {
      const href = (a.getAttribute('href') || '').trim();
      return href === '' || href === '#';
    });
    if (emptyAnchors.length > 0) {
      issues.warn.push(`[UX] ${rel} 存在空链接 href="#" 或 href=""`);
    }

    const hasCanonical = Boolean(doc.querySelector('link[rel="canonical"][href]'));
    if (!hasCanonical) {
      issues.fail.push(`[SEO] ${rel} 源代码未找到 canonical`);
    } else {
      const canonicalLinks = Array.from(doc.querySelectorAll('link[rel="canonical"]'));
      if (canonicalLinks.length > 1) {
        issues.fail.push(`[SEO] ${rel} 存在多个 canonical 标签`);
      }
      const canonicalHref = doc.querySelector('link[rel="canonical"][href]')?.getAttribute('href') || '';
      // Optional strict checks on canonical format
      if (STRICT_HEAD) {
        if (!/^https?:\/\//i.test(canonicalHref)) {
          issues.fail.push(`[SEO] ${rel} canonical 非绝对 URL：${canonicalHref}`);
        }
        // Allowlist for a11y anchor hashes in canonical
        const A11Y_HASH_ALLOW = new Set(['#main', '#content', '#top', '#skip-to-content']);
        const hasQuery = canonicalHref.includes('?');
        const frag = canonicalHref.includes('#') ? canonicalHref.slice(canonicalHref.indexOf('#')) : '';
        const hasHash = Boolean(frag);
        const hashAllowed = hasHash && A11Y_HASH_ALLOW.has(frag);
        if (hasQuery || (hasHash && !hashAllowed)) {
          issues.fail.push(`[SEO] ${rel} canonical 包含参数或 hash：${canonicalHref}`);
        }
      }
      let canonicalPath = '';
      try {
        canonicalPath = normalizePathname(new URL(canonicalHref, siteConfig?.url || 'http://localhost').pathname);
      } catch {
        canonicalPath = normalizePathname(canonicalHref);
      }
      if (canonicalPath && canonicalPath !== pagePath) {
        if (!isWhitelisted('canonicalNonSelf', pagePath)) {
          issues.warn.push(`[SEO] canonical 非自引用：${pagePath} canonical=${canonicalPath}`);
        }
      }
      canonicalByPage.set(pagePath, canonicalPath || '');
      try {
        const u = new URL(canonicalHref, siteConfig?.url || 'http://localhost');
        if (u.pathname.includes('//')) {
          issues.warn.push(`[Routing] ${pagePath} canonical 路径包含双斜杠：${u.pathname}`);
        }
      } catch {}
    }

    // Head uniqueness and duplicates (strict opt-in)
    if (STRICT_HEAD) {
      const titleEls = Array.from(doc.querySelectorAll('title'));
      if (titleEls.length > 1) {
        issues.fail.push(`[SEO] ${pagePath} 存在多个 <title> 标签（${titleEls.length}）`);
      }
      const descEls = Array.from(doc.querySelectorAll('meta[name=\"description\"]'));
      if (descEls.length > 1) {
        issues.fail.push(`[SEO] ${pagePath} 存在多个 meta[name=\"description\"]`);
      }
      const ogProps = ['og:title', 'og:description', 'og:image', 'og:url'];
      for (const p of ogProps) {
        const els = Array.from(doc.querySelectorAll(`meta[property=\"${p}\"]`));
        if (els.length > 1) {
          issues.fail.push(`[SEO] ${pagePath} 存在多个 ${p}（${els.length}）`);
        }
      }
      // hreflang alternates: duplicates and absolute URLs
      const alternateEls = Array.from(doc.querySelectorAll('link[rel=\"alternate\"][hreflang][href]'));
      if (alternateEls.length > 0) {
        const byLang = new Map();
        for (const el of alternateEls) {
          const hreflang = (el.getAttribute('hreflang') || '').toLowerCase();
          const href = el.getAttribute('href') || '';
          if (!/^https?:\/\//i.test(href)) {
            issues.fail.push(`[SEO] ${pagePath} hreflang=${hreflang} 使用了相对 URL：${href}`);
          }
          if (!byLang.has(hreflang)) byLang.set(hreflang, new Set());
          byLang.get(hreflang).add(href);
          try {
            const u = new URL(href, siteConfig?.url || 'http://localhost');
            if (u.pathname.includes('//')) {
              issues.warn.push(`[Routing] ${pagePath} hreflang 路径包含双斜杠：${u.pathname}`);
            }
            const langKey = (hreflang || '').toLowerCase();
            const target = normalizePathname(u.pathname);
            if (!siteAltMap.has(langKey)) siteAltMap.set(langKey, new Map());
            if (!siteAltMap.get(langKey).has(target)) siteAltMap.get(langKey).set(target, new Set());
            siteAltMap.get(langKey).get(target).add(pagePath);
          } catch {}
        }
        for (const [lang, hrefs] of byLang.entries()) {
          if (hrefs.size > 1) {
            issues.fail.push(`[SEO] ${pagePath} hreflang=${lang} 存在重复（指向多个不同 href）`);
          }
        }
        const hasXDefault = byLang.has('x-default');
        if (!hasXDefault) {
          issues.fail.push(`[SEO] ${pagePath} 缺少 x-default hreflang`);
        }
      }
    }

    const hasKeywords = Boolean(doc.querySelector('meta[name="keywords"]'));
    if (hasKeywords) {
      issues.warn.push(`[SEO] ${rel} 包含 meta keywords（不建议使用）`);
    }

    const title = normalizeWhitespace(doc.querySelector('title')?.textContent || '');
    if (!title) {
      issues.warn.push(`[SEO] ${pagePath} 源代码缺失 Title`);
    } else {
      if (!titleToPages.has(title)) titleToPages.set(title, []);
      titleToPages.get(title).push(pagePath);
    }

    const description = normalizeWhitespace(
      doc.head?.querySelector('meta[name="description"]')?.getAttribute('content') ||
      doc.head?.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
      ''
    );
    if (!description) {
      issues.warn.push(`[SEO] ${pagePath} 源代码缺失 Description`);
    } else {
      if (!descToPages.has(description)) descToPages.set(description, []);
      descToPages.get(description).push(pagePath);
      if (description.length < 50) {
        issues.warn.push(`[SEO] ${pagePath} Description 过短（${description.length} chars）`);
      }
    }

    const ogUrl = normalizeWhitespace(doc.querySelector('meta[property="og:url"]')?.getAttribute('content') || '');
    const ogTitle = normalizeWhitespace(doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || '');
    const ogDesc = normalizeWhitespace(doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || '');
    const ogImage = normalizeWhitespace(doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '');
    if (!ogUrl || !ogTitle || !ogDesc || !ogImage) {
      if (!isWhitelisted('ogIncomplete', pagePath)) {
        issues.warn.push(`[SEO] ${pagePath} OG/Twitter 元信息不完整`);
      }
    }

    const h1Count = doc.querySelectorAll('h1').length;
    if (h1Count === 0) {
      issues.fail.push(`[Content] ${rel} 源代码未找到 H1`);
    } else if (h1Count > 1) {
      issues.warn.push(`[Content] ${pagePath} 源代码存在多个 H1（${h1Count}）`);
    }

    const sourceText = extractSourceVisibleText(doc);
    const root = doc.querySelector('#root');
    const rootHasElementChildren = root
      ? Array.from(root.childNodes).some(n => n.nodeType === dom.window.Node.ELEMENT_NODE)
      : false;
    if (root && !rootHasElementChildren && sourceText.length < 200) {
      issues.fail.push(`[Render] ${rel} 源代码几乎无可抓取文本（疑似纯 CSR 空壳）`);
    }

    const anchors = Array.from(doc.querySelectorAll('a[href]'));
    const outSet = new Set();
    for (const a of anchors) {
      const raw = (a.getAttribute('href') || '').trim();
      if (!raw || raw === '#' || /^javascript:/i.test(raw)) continue;
      try {
        const u = new URL(raw, siteConfig?.url || 'http://localhost');
        if (u.pathname.includes('//')) {
          issues.warn.push(`[Routing] ${pagePath} 链接包含双斜杠：${u.pathname}`);
        }
        const isInternal = raw.startsWith('/') || (siteConfig?.url && u.origin === new URL(siteConfig.url).origin);
        if (isInternal) {
          const target = normalizePathname(u.pathname);
          if (target !== pagePath) outSet.add(target);
        }
      } catch {}
    }
    internalOutgoing.set(pagePath, outSet);
    if (outSet.size === 0 && pagePath !== '/') {
      issues.warn.push(`[SEO] ${pagePath} 出链为0（无内部链接）`);
    }
    } finally {
      dom.window.close();
    }
  }

  if (internalOutgoing.size > 0) {
    const incoming = new Map(Array.from(internalOutgoing.keys()).map(p => [p, 0]));
    for (const [, outs] of internalOutgoing.entries()) {
      for (const tgt of outs) {
        if (incoming.has(tgt)) incoming.set(tgt, incoming.get(tgt) + 1);
      }
    }
    for (const [p, c] of incoming.entries()) {
      if (p !== '/' && c === 0) {
        issues.warn.push(`[SEO] 孤立页：${p}`);
      }
    }
  }

  if (sitemapPaths && sitemapPaths.size > 0) {
    for (const p of sitemapPaths) {
      const cp = canonicalByPage.get(p) || '';
      if (cp && cp !== p) {
        issues.warn.push(`[SEO] sitemap 页面 canonical 非自引用：${p} canonical=${cp}`);
      }
    }
  }

  for (const [title, pages] of titleToPages.entries()) {
    const uniqPages = Array.from(new Set(pages));
    if (uniqPages.length > 1) {
      issues.warn.push(`[SEO] Title 重复：${uniqPages.join(', ')}（"${title.slice(0, 80)}"）`);
    }
  }
  const isLearnDirPath = p => {
    const np = normalizePathname(p);
    return np === '/learn' || np === '/zh/learn' || np === '/de/learn';
  };
  const detectLang = p => {
    const np = normalizePathname(p);
    const seg = (np.split('/')[1] || '').toLowerCase();
    if (seg === 'zh') return 'zh';
    if (seg === 'de') return 'de';
    return 'en';
  };
  const isLearnFallbackDesc = d => {
    const s = String(d || '').toLowerCase();
    return (
      s.includes('buyer-oriented learning resources') ||
      s.includes('为设备采购与临床使用提供买方视角的学习资源')
    );
  };

  for (const [desc, pages] of descToPages.entries()) {
    const uniqPages = Array.from(new Set(pages));
    if (uniqPages.length <= 1) continue;

    // Group by language to avoid跨语言聚合噪音
    const langBuckets = new Map();
    for (const p of uniqPages) {
      const l = detectLang(p);
      if (!langBuckets.has(l)) langBuckets.set(l, []);
      langBuckets.get(l).push(p);
    }

    for (const [lang, groupPages] of langBuckets.entries()) {
      const groupUniq = Array.from(new Set(groupPages));
      // 排除目录页后再判断
      const filtered = groupUniq.filter(p => !isLearnDirPath(p));
      if (filtered.length <= 1) continue;

      // 对目录兜底文案降级为聚合提示
      if (isLearnFallbackDesc(desc)) {
        issues.warn.push(`[SEO] Description 重复（目录兜底聚合）：${filtered.join(', ')}（"${desc.slice(0, 80)}"）`);
      } else {
        issues.warn.push(`[SEO] Description 重复：${filtered.join(', ')}（"${desc.slice(0, 80)}"）`);
      }
    }
  }

  const prerenderReportPath = path.join(DIST_DIR, 'prerender-report.json');
  if (!fs.existsSync(prerenderReportPath)) {
    issues.warn.push('[Render] dist/ 未发现 prerender-report.json（可能未执行预渲染）');
  }

  if (siteAltMap.size > 0) {
    for (const [lang, targetMap] of siteAltMap.entries()) {
      for (const [targetPath, fromSet] of targetMap.entries()) {
        const others = Array.from(fromSet).filter(p => p !== targetPath);
        if (others.length > 1) {
          issues.warn.push(`[SEO] 全局 hreflang 冲突：lang=${lang} 指向同一页面 ${targetPath} 来自 ${others.length} 个不同页面（不含自身）`);
        }
      }
    }
    const detectLangForPath = p => {
      const np = normalizePathname(p);
      const seg = (np.split('/')[1] || '').toLowerCase();
      if (seg === 'zh') return 'zh';
      if (seg === 'de') return 'de';
      if (seg === 'pt') return 'pt';
      return 'en';
    };
    for (const [lang, targetMap] of siteAltMap.entries()) {
      for (const [targetPath, fromSet] of targetMap.entries()) {
        for (const sourcePath of fromSet) {
          const backLang = detectLangForPath(sourcePath);
          const backMap = siteAltMap.get(backLang);
          const hasBack = backMap && backMap.has(sourcePath) && backMap.get(sourcePath).has(targetPath);
          if (!hasBack) {
            issues.warn.push(`[SEO] hreflang 缺少回链：${sourcePath} -> ${targetPath}`);
          }
        }
      }
    }
  }

  const jsSignals = scanDistForClientSignals(DIST_DIR);
  if (jsSignals.createHashHistory || jsSignals.hashRouterComponent || jsSignals.hashRouteLiteral) {
    issues.warn.push('[Routing] 构建产物包含 hash 路由迹象（可能导致 URL 出现 #）');
  }

  const { mode, baseUrl: baseUrlOverride } = parseCliOptions();
  if (mode === 'prod') {
    const baseUrl = normalizeDomain(baseUrlOverride || process.env.SITE_URL || siteConfig?.url || '');
    try {
      const browserIssues = await runBrowserAudit(baseUrl, siteConfig);
      issues.fail.push(...browserIssues.fail);
      issues.warn.push(...browserIssues.warn);
    } catch (e) {
      issues.fail.push(`[Browser] 无法执行浏览器审计：${(e && e.message) ? e.message : String(e)}`);
    }
    try {
      const redirectDupIssues = await runRedirectAndDuplicateAudit(baseUrl, siteConfig);
      issues.fail.push(...redirectDupIssues.fail);
      issues.warn.push(...redirectDupIssues.warn);
    } catch (e) {
      issues.fail.push(`[Routing] 无法执行重定向/重复检测：${(e && e.message) ? e.message : String(e)}`);
    }
  } else {
    const server = await startStaticServer(DIST_DIR);
    try {
      try {
        const browserIssues = await runBrowserAudit(server.baseUrl, siteConfig);
        issues.fail.push(...browserIssues.fail);
        issues.warn.push(...browserIssues.warn);
      } catch (e) {
        issues.fail.push(`[Browser] 无法执行浏览器审计：${(e && e.message) ? e.message : String(e)}`);
      }
      try {
        const redirectDupIssues = await runRedirectAndDuplicateAudit(server.baseUrl, siteConfig);
        issues.fail.push(...redirectDupIssues.fail);
        issues.warn.push(...redirectDupIssues.warn);
      } catch (e) {
        issues.fail.push(`[Routing] 无法执行重定向/重复检测：${(e && e.message) ? e.message : String(e)}`);
      }
    } finally {
      await server.close();
    }
  }

  const uniq = arr => Array.from(new Set(arr));
  issues.fail = uniq(issues.fail);
  issues.warn = uniq(issues.warn);

  if (issues.fail.length || issues.warn.length) {
    console.log('');
    console.log('📋 Audit Report');
    if (issues.fail.length) {
      console.log(`🚩 FAIL (${issues.fail.length})`);
      issues.fail.forEach(i => console.log(` - ${i}`));
    }
    if (issues.warn.length) {
      console.log(`⚠️ WARN (${issues.warn.length})`);
      issues.warn.forEach(i => console.log(` - ${i}`));
    }
  }

  const md = formatAuditMarkdown({ issues, siteConfig });
  writeAuditMarkdown(reportPath, md);
  console.log('');
  console.log(`📝 Markdown report saved: ${reportPath}`);

  const shouldFail = mode === 'prod' || String(process.env.CHECK_FAIL_ON_DEV || '').trim() === '1';
  if (issues.fail.length > 0) {
    console.error('');
    if (shouldFail) {
      console.error('❌ SEO/UX Audit Failed');
      process.exit(1);
    } else {
      console.error('⚠️ SEO/UX Audit Found Issues (dev mode, non-blocking)');
      return;
    }
  }

  console.log('');
  console.log('✅ SEO/UX Audit Passed');
}

checkLinks().catch(err => {
  console.error(err);
  process.exit(1);
});
