/* @vitest-environment node */
import { describe, it, expect } from 'vitest'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync, existsSync } from 'fs'
import { tmpdir } from 'os'
import { join, resolve } from 'path'
import { spawnSync } from 'node:child_process'
import { baseRoutes, generateLanguageRoutePaths } from '../../src/utils/multilingualRoutes'

const script = resolve(__dirname, '../../scripts/check-links.mjs')

const SITE = 'https://chinactscanner.org'

function toFilePath(dist: string, path: string) {
  const p = path === '/' ? '' : path.replace(/^\//, '')
  const dir = join(dist, p)
  const file = join(dir, 'index.html')
  mkdirSync(dir, { recursive: true })
  return file
}

function htmlFor(path: string) {
  const isZh = path.startsWith('/zh') || path === '/zh'
  const enPath = path.startsWith('/zh') ? path.replace(/^\/zh/, '') || '/' : path
  const zhPath = path.startsWith('/zh') ? path : (path === '/' ? '/zh' : `/zh${path}`)
  const longText = 'This page contains sufficient visible text content to satisfy render checks. '.repeat(3)
  return `<!doctype html>
<html lang="${isZh ? 'zh-Hans' : 'en'}">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta name="theme-color" content="#000000"/>
    <link rel="manifest" href="/manifest.json"/>
    <link rel="canonical" href="${path}"/>
    <link rel="alternate" hreflang="en" href="${enPath}"/>
    <link rel="alternate" hreflang="zh-Hans" href="${zhPath}"/>
    <link rel="alternate" hreflang="x-default" href="/"/>
    <title>Route ${path}</title>
    <meta name="description" content="SEO test page for ${path}. ${longText}"/>
    <meta property="og:title" content="Route ${path}"/>
    <meta property="og:description" content="OpenGraph description for ${path}. ${longText}"/>
    <meta property="og:url" content="${SITE}${path === '/' ? '' : path}"/>
    <meta property="og:image" content="${SITE}/og.png"/>
  </head>
  <body>
    <main>
      <h1>Heading for ${path}</h1>
      <p>${longText}</p>
    </main>
  </body>
  </html>`
}

function writeSsrWhitelist(dir: string, routes: string[]) {
  mkdirSync(join(dir, 'functions'), { recursive: true })
  writeFileSync(join(dir, 'prerender-routes.json'), JSON.stringify(routes, null, 2), 'utf-8')
  writeFileSync(join(dir, 'functions', 'ssr-paths.ts'), `export const SSR_PATHS = new Set(${JSON.stringify(routes)});`, 'utf-8')
}

describe('scripts/check-links.mjs (All Routes)', () => {
  it('audits all language-expanded routes without failures', () => {
    const dir = mkdtempSync(join(tmpdir(), 'seo-all-'))
    try {
      const dist = join(dir, 'dist', 'client')
      const routes = baseRoutes
        .map((r) => r.replace(/:id/g, 'sample'))
      const paths = Array.from(new Set(routes.flatMap((r) => generateLanguageRoutePaths(r))))
      for (const p of paths) {
        const file = toFilePath(dist, p)
        writeFileSync(file, htmlFor(p), 'utf-8')
      }
      writeFileSync(join(dist, 'manifest.json'), JSON.stringify({
        name: "Demo App",
        short_name: "Demo",
        start_url: "/",
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" }
        ]
      }, null, 2))
      writeFileSync(join(dist, 'robots.txt'),
        `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`)
      // Generate sitemap with all paths
      const sitemapUrls = paths.map((p) => `  <url><loc>${SITE}${p === '/' ? '/' : p}</loc></url>`).join('\n')
      writeFileSync(join(dist, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>`)
      writeFileSync(join(dist, '_redirects'), `/en / 308\n`)
      writeFileSync(join(dist, 'llms.txt'), `# ${SITE}\n`)
      writeFileSync(join(dist, 'prerender-report.json'), `{}`)
      writeSsrWhitelist(dir, paths)

      const r = spawnSync(process.execPath, [script, '--mode=dev'], { cwd: dir, encoding: 'utf-8' })
      expect(r.status).toBe(0)
      expect(r.stdout).not.toMatch(/🚩 FAIL \(/)
      const reportPath = resolve(dist, 'audit-report.md')
      expect(existsSync(reportPath)).toBe(true)
      const md = readFileSync(reportPath, 'utf-8')
      expect(md).toMatch(/SEO\/UX Audit Report/)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })
})

