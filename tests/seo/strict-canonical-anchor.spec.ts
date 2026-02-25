/* @vitest-environment node */
import { describe, it, expect } from 'vitest'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from 'fs'
import { tmpdir } from 'os'
import { join, resolve } from 'path'
import { spawnSync } from 'node:child_process'

const script = resolve(__dirname, '../../scripts/check-links.mjs')

function w(dir: string, file: string, content: string) {
  const p = join(dir, file)
  mkdirSync(join(p, '..'), { recursive: true })
  writeFileSync(p, content, 'utf-8')
}

describe('scripts/check-links.mjs (Strict canonical with a11y hash allowlist)', () => {
  it('does not warn for canonical with allowed a11y anchor hash (#main) under strict mode', () => {
    const dir = mkdtempSync(join(tmpdir(), 'seo-strict-a11y-'))
    try {
      const dist = join(dir, 'dist', 'client')
      w(dir, 'dist/client/index.html', `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta name="theme-color" content="#000000"/>
    <link rel="manifest" href="/manifest.json"/>
    <link rel="canonical" href="https://chinactscanner.org/#main"/>
    <link rel="alternate" hreflang="en" href="https://chinactscanner.org/"/>
    <link rel="alternate" hreflang="zh-Hans" href="https://chinactscanner.org/zh"/>
    <link rel="alternate" hreflang="x-default" href="https://chinactscanner.org/"/>
    <title>Home</title>
    <meta name="description" content="Long enough description to pass checks for the home page. This should be over fifty characters."/>
    <meta property="og:title" content="Home"/>
    <meta property="og:description" content="OG description long enough to avoid warnings."/>
    <meta property="og:url" content="https://chinactscanner.org/"/>
    <meta property="og:image" content="https://chinactscanner.org/og.png"/>
  </head>
  <body>
    <div id="root">
      <h1>Welcome</h1>
      <p>${'Visible content '.repeat(30)}</p>
    </div>
  </body>
</html>`)
      w(dir, 'dist/client/manifest.json', JSON.stringify({
        name: "Demo App",
        short_name: "Demo",
        start_url: "/",
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" }
        ]
      }, null, 2))
      w(dir, 'dist/client/robots.txt', `User-agent: *\nAllow: /\nSitemap: https://chinactscanner.org/sitemap.xml\n`)
      w(dir, 'dist/client/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://chinactscanner.org/</loc></url>
</urlset>`)
      w(dir, 'dist/client/_redirects', `/en / 308\n/* /index.html 200\n`)
      w(dir, 'dist/client/llms.txt', `# https://chinactscanner.org\n`)
      w(dir, 'dist/client/prerender-report.json', `{}`)

      const r = spawnSync(process.execPath, [script, '--mode=dev'], {
        cwd: dir,
        encoding: 'utf-8',
        env: { ...process.env, CHECK_STRICT_HEAD: '1' }
      })
      // In strict mode we only care the allowlist prevents the hash warning
      expect(r.stdout).not.toMatch(/canonical 包含参数或 hash/)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })
})
