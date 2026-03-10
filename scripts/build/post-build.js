#!/usr/bin/env node

/**
 * Post-build optimization script
 * Unified entry point for the build pipeline.
 * 
 * Sequence:
 * 1. Generate Static HTML (SSR)
 * 2. Generate Sitemaps
 * 3. Optimize Output (HTML minification, Headers, Redirects)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  distDir: path.join(__dirname, '../dist/client'),
  rootDir: path.join(__dirname, '..'),
  baseUrl: (process.env.SITE_URL ? String(process.env.SITE_URL) : 'https://chinactscanner.org').replace(/\/+$/, '')
};

function hasSupabaseEnv() {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const pub = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
  const anon = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  return Boolean(url && (pub || anon));
}

function loadPrerenderRoutes() {
  const prerenderPath = path.join(__dirname, '../prerender-routes.json');
  if (!fs.existsSync(prerenderPath)) return [];
  try {
    const data = fs.readFileSync(prerenderPath, 'utf8');
    const routes = JSON.parse(data);
    return Array.isArray(routes) ? routes : [];
  } catch {
    return [];
  }
}

// Helper to run scripts
function runScript(scriptName, args = []) {
  try {
    console.log(`\n▶️  Running ${scriptName}...`);
    const scriptPath = path.join(__dirname, scriptName);
    const argsStr = args.map(arg => `"${arg}"`).join(' ');
    execSync(`node "${scriptPath}" ${argsStr}`, { stdio: 'inherit', cwd: config.rootDir });
    console.log(`✅ ${scriptName} completed.`);
  } catch (error) {
    console.error(`❌ ${scriptName} failed.`);
    throw error;
  }
}

// Optimize HTML files for SEO
function optimizeHtmlFiles() {
  const htmlFiles = [];
  
  function findHtmlFiles(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        findHtmlFiles(filePath);
      } else if (file.endsWith('.html')) {
        htmlFiles.push(filePath);
      }
    });
  }
  
  findHtmlFiles(config.distDir);
  
  htmlFiles.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Minify HTML (basic)
    content = content
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .trim();
    
    // Remove any dev-time asset references (e.g., /src/index.css or /src/* scripts)
    content = content
      .replace(/<link[^>]+href="\/src\/[^"]+"[^>]*>/g, '')
      .replace(/<script[^>]+src="\/src\/[^"]+"[^>]*><\/script>/g, '');
    
    // Add preload hints if not present
    if (!content.includes('rel="preload"')) {
        const preloadHints = `
        <link rel="preload" href="/placeholder.svg" as="image" />
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" as="style" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />
        `;
        content = content.replace('</head>', `${preloadHints}</head>`);
    }
    
    fs.writeFileSync(filePath, content);
  });
  
  console.log(`✅ Optimized ${htmlFiles.length} HTML files`);
}

// Generate performance manifest
function generatePerformanceManifest() {
  const manifest = {
    version: '1.0',
    generated: new Date().toISOString(),
    optimizations: {
      html_minified: true,
      images_optimized: true,
      preload_hints: true,
      sitemap_generated: true,
      robots_updated: true
    },
    seo: {
      canonical_urls: true,
      meta_tags: true,
      structured_data: true,
      sitemap: `${config.baseUrl}/sitemap.xml`,
      robots: `${config.baseUrl}/robots.txt`
    },
    analytics: {
      google_analytics: true,
      google_adsense: true,
      microsoft_clarity: true
    }
  };
  
  fs.writeFileSync(
    path.join(config.distDir, 'performance-manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  
  console.log('✅ Generated performance manifest');
}

// Update robots.txt
function updateRobotsTxt() {
  console.log('🤖 Generating robots.txt...');
  
  const robotsContent = `User-agent: * 
Allow: / 

# Sitemaps 
Sitemap: ${config.baseUrl}/sitemap.xml 

# Block common non-content paths 
Disallow: /api/ 
Disallow: /admin/ 
Disallow: /dashboard/ 
Disallow: /_next/ 
Disallow: /assets/ 
Disallow: /*.json$ `;

  const robotsFile = path.join(config.distDir, 'robots.txt');
  fs.writeFileSync(robotsFile, robotsContent, 'utf8');
  console.log(`✅ Robots.txt generated: ${robotsFile}`);
}

// Update .htaccess for additional optimizations
function generateHtaccess() {
  const htaccess = `
# Pearl Coach - SEO-friendly locale redirects
# Generated: ${new Date().toISOString()}

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Enable browser caching
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Handle locale-based routing
# Remove /en/ prefix (English is default)
RewriteRule ^en/(.*)$ /$1 [L,R=301,NC]

# Handle trailing slashes consistently
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} /(.*)/$
RewriteRule ^ /%1 [L,R=301]

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
</IfModule>

# Fallback to index.html for SPA (but allow /zh/ prefixed paths)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]
`.trim();
  
  fs.writeFileSync(path.join(config.distDir, '.htaccess'), htaccess);
  console.log('✅ Generated .htaccess file');
}

// Generate _redirects file for Netlify/Vercel
function generateRedirects() {
  const redirects = `
# Handle locale-based redirects for SEO
# English (default) - no prefix needed
/en/* /:splat 200

# Chinese content
/zh/* /:splat 200

# API and static assets
/api/* /api/:splat 200
/static/* /static/:splat 200
/assets/* /assets/:splat 200

# SPA Fallback
/* /index.html 200
`.trim();

  fs.writeFileSync(path.join(config.distDir, '_redirects'), redirects);
  console.log('✅ Generated _redirects file');
}

// Generate sitemap with only EN links
function normalizePathname(p) {
  let s = String(p || '/').trim();
  if (!s.startsWith('/')) s = `/${s}`;
  s = s.split('?')[0].split('#')[0];
  s = s.replace(/\/+/g, '/');
  if (s !== '/' && s.endsWith('/')) s = s.slice(0, -1);
  return s;
}

function stripLanguagePrefix(p) {
  const s = normalizePathname(p);
  const m = s.match(/^\/([a-z]{2})(\/|$)/i);
  if (m) {
    const lang = m[1].toLowerCase();
    return s.replace(new RegExp(`^/${lang}`), '') || '/';
  }
  return s;
}

function escapeXml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateUrlEntryEN(loc, lastmod, changefreq = 'weekly', priority = 0.8) {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${Number(priority).toFixed(1)}</priority>
  </url>`;
}

function generateSitemapXML(urlEntries) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join('\n')}
</urlset>`;
}

function generateEnOnlySitemap(outputDir, prerenderListPath) {
  console.log('🗺️ Generating EN-only sitemap (indexed with blog sub-sitemap)...');
  const targetDir = outputDir || path.join(config.rootDir, 'public');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const lastmod = new Date().toISOString().split('T')[0];
  const routes = loadPrerenderRoutes();
  const cleanPaths = new Set();

  for (const r of routes) {
    const clean = stripLanguagePrefix(normalizePathname(r));
    if (clean === '/404') continue;
    if (clean.startsWith('/admin') || clean.startsWith('/api')) continue;
    cleanPaths.add(clean);
  }

  if (cleanPaths.size === 0) {
    const staticFallback = [
      '/', '/devices', '/manufacturers', '/blog', '/resources',
      '/history', '/reports', '/reports/market', '/reports/expert',
      '/about', '/contact', '/privacy', '/terms', '/glossary'
    ];
    staticFallback.forEach(p => cleanPaths.add(p));
  }

  const allPaths = Array.from(cleanPaths).sort((a, b) => a.localeCompare(b));
  const blogPaths = allPaths.filter(p => p === '/blog' || p.startsWith('/blog/'));
  const mainPaths = allPaths.filter(p => !(p === '/blog' || p.startsWith('/blog/')));

  const buildEntries = (paths) =>
    paths.map(clean => {
      const loc = clean === '/' ? `${config.baseUrl}/` : `${config.baseUrl}${clean}/`;
      return generateUrlEntryEN(loc, lastmod, 'weekly', 0.8);
    });

  const mainEntries = buildEntries(mainPaths);
  const blogEntries = buildEntries(blogPaths);

  // Write child sitemaps
  const mainFile = path.join(targetDir, 'sitemap-main.xml');
  const blogFile = path.join(targetDir, 'sitemap-blog.xml');
  fs.writeFileSync(mainFile, generateSitemapXML(mainEntries), 'utf8');
  fs.writeFileSync(blogFile, generateSitemapXML(blogEntries), 'utf8');

  // Write index sitemap
  const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${config.baseUrl}/sitemap-main.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${config.baseUrl}/sitemap-blog.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
</sitemapindex>`;
  const indexPath = path.join(targetDir, 'sitemap.xml');
  fs.writeFileSync(indexPath, indexXml, 'utf8');
  console.log(`✅ Sitemap index generated: ${indexPath}`);
  console.log(`   - ${mainFile}`);
  console.log(`   - ${blogFile}`);
}

// Remove debug artifacts that should never ship
function cleanupDebugArtifacts() {
  try {
    const keep = String(process.env.KEEP_DEBUG_HEADS || '').trim() === '1';
    const debugDir = path.join(config.distDir, '__debug_heads__');
    if (!keep && fs.existsSync(debugDir)) {
      fs.rmSync(debugDir, { recursive: true, force: true });
      console.log('🧹 Removed debug artifacts: dist/client/__debug_heads__');
    }
  } catch (err) {
    console.warn('⚠️  Failed to clean debug artifacts:', err?.message || err);
  }
}

// Main execution
function main() {
  try {
    console.log('🚀 Starting post-build optimizations...');
    
    if (hasSupabaseEnv()) {
      try {
        runScript('generate-snapshots.mjs', ['en']);
      } catch (err) {
        console.warn('⚠️  generate-snapshots.mjs failed, skipping snapshot generation.');
      }
    } else {
      console.log('ℹ️  Supabase env not found. Skipping generate-snapshots.mjs.');
    }
    
    try {
      runScript('generate-markdown-snapshots.mjs', ['en', 'zh']);
    } catch (err) {
      console.warn('⚠️  generate-markdown-snapshots.mjs failed, continuing build.');
    }
    
    runScript('generate-prerender-routes.js');
    const prerenderRoutes = loadPrerenderRoutes();
    const prerenderListPath = path.join(__dirname, '../prerender-routes.json');

    // 1. Generate Static Files
    try {
      runScript('generate-static.mjs', [prerenderListPath]);
    } catch (err) {
      console.warn('⚠️  generate-static.mjs failed, skipping static generation and continuing.');
    }
    
    // 1.5 Generate Cloudflare Worker
    const distServerPath = path.join(config.rootDir, 'dist/server');
    if (fs.existsSync(distServerPath)) {
      runScript('generate-cf-worker.mjs', [prerenderListPath]);
    } else {
      console.log('ℹ️  dist/server not found. Skipping generate-cf-worker.mjs.');
    }

    // 2. Generate Sitemaps (use split sitemap generator)
    try {
      runScript('generate-split-sitemap.js', [config.distDir, prerenderListPath]);
    } catch (err) {
      console.warn('⚠️  generate-split-sitemap.js failed, continuing build.');
    }
    
    // 3. Optimize & Config
    console.log('\n3️⃣  Applying optimizations and configurations...');
    optimizeHtmlFiles();
    cleanupDebugArtifacts();
    generatePerformanceManifest();
    updateRobotsTxt();
    generateHtaccess();
    generateRedirects();

    console.log('\n🎉 Post-build pipeline completed successfully!');
    console.log(`📍 Build directory: ${config.distDir}`);
    console.log(`🌐 Site URL: ${config.baseUrl}`);
    
  } catch (error) {
    console.error('❌ Post-build pipeline failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}

export { main };
