// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.339Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distClient = fs.existsSync(path.resolve(root, 'dist/client'))
  ? path.resolve(root, 'dist/client')
  : path.resolve(root, 'dist');
const distServer = path.resolve(root, 'dist/server');
const functionsDir = path.resolve(root, 'functions');

async function main() {
  // Ensure dist exists
  if (!fs.existsSync(distClient) || !fs.existsSync(distServer)) {
    console.error('Build output not found. Run build first.');
    process.exit(1);
  }

  // Read index.html for assets
  const templatePath = path.join(distClient, 'index.html');
  const template = fs.readFileSync(templatePath, 'utf-8');
  const headAssets = extractHeadAssets(template);
  
  // Read prerender routes to gate SSR paths (allow custom path via argv[2])
  const argPath = process.argv[2] ? path.resolve(process.argv[2]) : null;
  const routesPath = argPath && fs.existsSync(argPath) ? argPath : path.join(root, 'prerender-routes.json');
  const prerenderRoutes = loadRoutes(routesPath);

  // Create functions directory
  if (!fs.existsSync(functionsDir)) {
    fs.mkdirSync(functionsDir, { recursive: true });
  }

  // Generate head-assets.ts and ssr-paths.ts for Functions to import
  const headAssetsModule = `export const HEAD_ASSETS = \`${headAssets.replace(/`/g, '\\`')}\`;`;
  fs.writeFileSync(path.join(functionsDir, 'head-assets.ts'), headAssetsModule);

  // Normalize prerender routes by removing trailing slash except root
  const normalized = Array.from(new Set(
    prerenderRoutes.map((p) => {
      if (!p) return '/';
      let x = String(p);
      if (x.length > 1 && x.endsWith('/')) x = x.slice(0, -1);
      return x || '/';
    })
  ));
  if (!normalized.length) {
    throw new Error('SSR paths empty. Ensure prerender-routes.json or sitemap.xml is generated.');
  }
  const ssrPathsModule = `export const SSR_PATHS = new Set(${JSON.stringify(normalized)});`;
  fs.writeFileSync(path.join(functionsDir, 'ssr-paths.ts'), ssrPathsModule);

  console.log('Wrote Cloudflare modules: functions/head-assets.ts and functions/ssr-paths.ts');
}

function extractHeadAssets(html) {
  // Same extraction logic as generate-static.mjs
  const assets = [];
  
  // Match CSS links
  const cssRegex = /<link[^>]+rel="stylesheet"[^>]*>/g;
  const cssMatches = html.match(cssRegex);
  if (cssMatches) assets.push(...cssMatches);
  
  // Match Module Scripts (entry point)
  const scriptRegex = /<script[^>]+type="module"[^>]*>.*?<\/script>/g;
  const scriptMatches = html.match(scriptRegex);
  if (scriptMatches) assets.push(...scriptMatches);

  // Match Module Preload
  const preloadRegex = /<link[^>]+rel="modulepreload"[^>]*>/g;
  const preloadMatches = html.match(preloadRegex);
  if (preloadMatches) assets.push(...preloadMatches);

  // Filter out any dev-time asset paths like /src/*
  const filtered = assets.filter((tag) => !/href="\/src\//.test(tag) && !/src="\/src\//.test(tag));

  // Join and escape backticks for template string
  return filtered.join('\\n').replace(/`/g, '\\`'); 
}

function loadRoutes(routesPath) {
  if (routesPath && fs.existsSync(routesPath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(routesPath, 'utf-8'));
      if (Array.isArray(parsed) && parsed.length) return parsed;
    } catch (e) {
      throw new Error(`Failed to parse routes file: ${routesPath}`);
    }
  }
  const sitemapCandidates = [
    path.join(root, 'public', 'sitemap.xml'),
    path.join(distClient, 'sitemap.xml')
  ];
  for (const p of sitemapCandidates) {
    if (!fs.existsSync(p)) continue;
    const xml = fs.readFileSync(p, 'utf-8');
    const routes = parseSitemap(xml);
    if (routes.length) return routes;
  }
  return [];
}

function parseSitemap(xml) {
  const out = [];
  const regex = /<loc>(.*?)<\/loc>/g;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    const raw = match[1];
    try {
      const url = new URL(raw);
      out.push(url.pathname || '/');
    } catch (e) {
      if (raw.startsWith('/')) out.push(raw);
    }
  }
  return out;
}

main().catch(console.error);
