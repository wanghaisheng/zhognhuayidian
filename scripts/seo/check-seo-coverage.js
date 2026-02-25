// Node ESM script to check SEO file coverage for routes across supported languages
import { promises as fs } from 'fs';
import path from 'path';

const ROOT = path.resolve(process.cwd());
const LANG_FILE = path.join(ROOT, 'src', 'config', 'language.ts');
const ROUTES_DIR = path.join(ROOT, 'src', 'lib', 'routes');
const ROUTES_SLICES_DIR = path.join(ROUTES_DIR, 'slices');
const ROUTER_INIT = path.join(ROOT, 'src', 'lib', 'routerInit.tsx');
const LOCALES_DIR = path.join(ROOT, 'src', 'locales');

const readText = async (p) => fs.readFile(p, 'utf8');
const exists = async (p) => !!(await fs.stat(p).catch(() => null));
const walk = async (dir, filter = () => true) => {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...await walk(p, filter));
    } else if (filter(p)) {
      out.push(p);
    }
  }
  return out;
};

const normalizeRoute = (r) => {
  if (!r) return '/';
  let x = r.trim();
  if (!x.startsWith('/')) x = `/${x}`;
  // remove trailing slash except root
  if (x.length > 1 && x.endsWith('/')) x = x.slice(0, -1);
  return x.replace(/\/+/g, '/');
};

const parseSupportedLanguages = async () => {
  const txt = await readText(LANG_FILE);
  const blockMatch = txt.match(/export const LANGUAGES\s*=\s*\[(.*?)\]\s*;/s);
  const block = blockMatch ? blockMatch[1] : txt;
  // Remove line comments and block comments
  const noLineComments = block.replace(/^\s*\/\/.*$/gm, '');
  const noBlockComments = noLineComments.replace(/\/\*[\s\S]*?\*\//g, '');
  const codes = [];
  const re = /code:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(noBlockComments)) !== null) {
    codes.push(m[1]);
  }
  return Array.from(new Set(codes));
};

const parseExpectedRoutes = async () => {
  const files = [
    ...(await walk(ROUTES_SLICES_DIR, (p) => p.endsWith('.tsx'))),
    ROUTER_INIT,
  ].filter(Boolean);
  const routes = new Set(['/']);
  const rxComponent = /componentRoutes(?:WithLoader)?\([^,]+,\s*['"]([^'"]+)['"]/g;
  const rxAliasCr = /cr\(\s*['"]([^'"]+)['"]/g;
  for (const f of files) {
    const txt = await readText(f);
    let m;
    while ((m = rxComponent.exec(txt)) !== null) {
      const base = m[1];
      if (!base || base.includes(':')) continue; // skip dynamic
      routes.add(normalizeRoute(base));
    }
    while ((m = rxAliasCr.exec(txt)) !== null) {
      const base = m[1];
      if (!base || base.includes(':')) continue;
      routes.add(normalizeRoute(base));
    }
  }
  return Array.from(routes).sort();
};

const collectSeoPathsForLang = async (lang) => {
  const dir = path.join(LOCALES_DIR, lang, 'seo');
  const have = new Set();
  if (!(await exists(dir))) return have;
  const files = await walk(dir, (p) => p.endsWith(path.sep + 'index.ts') || p.endsWith(path.sep + 'index.json'));
  for (const f of files) {
    const rel = path.relative(path.join(LOCALES_DIR, lang, 'seo'), f).replace(/\\/g, '/');
    const withoutIndex = rel.replace(/\/?index\.(ts|json)$/i, '');
    const route = normalizeRoute(withoutIndex);
    have.add(route);
  }
  return have;
};

const run = async () => {
  const langs = await parseSupportedLanguages();
  const routes = await parseExpectedRoutes();
  const byLang = Object.fromEntries(await Promise.all(langs.map(async (l) => [l, await collectSeoPathsForLang(l)])));

  const lines = [];
  lines.push('=== SEO Coverage Report ===');
  lines.push(`Languages: ${langs.join(', ')}`);
  lines.push(`Routes scanned: ${routes.length}`);
  lines.push('');
  const missingSummary = [];
  for (const r of routes) {
    const missing = langs.filter(l => {
      const set = byLang[l];
      return !(set.has(r) || set.has(r + '') || set.has(r === '/' ? '/' : r));
    });
    const present = langs.filter(l => !missing.includes(l));
    const status = missing.length === 0 ? 'OK' : 'MISSING';
    lines.push(`${status}  ${r}  | present: [${present.join(', ')}]${missing.length ? `  missing: [${missing.join(', ')}]` : ''}`);
    if (missing.length) {
      missingSummary.push({ route: r, missing });
    }
  }
  lines.push('');
  // Extra files that don't map to expected routes
  for (const l of langs) {
    const extras = Array.from(byLang[l]).filter(p => !routes.includes(p));
    if (extras.length) {
      lines.push(`Extras (${l}) not mapped to routes: ${extras.join(', ')}`);
    }
  }
  console.log(lines.join('\n'));

  // Non-zero exit if any missing to use in CI
  if (missingSummary.length) {
    process.exitCode = 2;
  }
};

run().catch(err => {
  console.error('SEO coverage check failed:', err);
  process.exitCode = 1;
});
