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

function writeSsrWhitelist(dir: string, routes: string[]) {
  w(dir, 'prerender-routes.json', JSON.stringify(routes, null, 2))
  w(dir, 'functions/ssr-paths.ts', `export const SSR_PATHS = new Set(${JSON.stringify(routes)});`)
}

describe('scripts/check-links.mjs (SEO Audit)', () => {
  it('handles missing dist by emitting report and exiting successfully', () => {
    const dir = mkdtempSync(join(tmpdir(), 'seo-missing-dist-'))
    try {
      const r = spawnSync(process.execPath, [script, '--mode=dev'], { cwd: dir, encoding: 'utf-8' })
      expect(r.status).toBe(0)
      // Default report path should be under dist/client or dist/
      const reportPath = resolve(dir, 'dist', 'client', 'audit-report.md')
      const reportAlt = resolve(dir, 'dist', 'audit-report.md')
      const exists = existsSync(reportPath) || existsSync(reportAlt)
      expect(exists).toBe(true)
      const md = existsSync(reportPath) ? readFileSync(reportPath, 'utf-8') : readFileSync(reportAlt, 'utf-8')
      expect(md).toMatch(/dist\/ 不存在|dist\/ 中未找到任何 \.html 输出/)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('passes in a minimal happy-path dist with canonical, H1, hreflang, sitemap and robots', () => {
    const dir = mkdtempSync(join(tmpdir(), 'seo-happy-'))
    try {
      // Minimal source hints to reduce warnings
      w(dir, 'src/utils/seo.ts', `export const hreflangs = { 'x-default': '/' };`)
      // i18n file is optional; script falls back, so omit for simplicity

      // dist structure
      const dist = join(dir, 'dist', 'client')
      w(dir, 'dist/client/index.html', `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta name="theme-color" content="#000000"/>
    <link rel="manifest" href="/manifest.json"/>
    <link rel="canonical" href="/"/>
    <link rel="alternate" hreflang="en" href="/"/>
    <link rel="alternate" hreflang="zh-Hans" href="/zh"/>
    <link rel="alternate" hreflang="x-default" href="/"/>
    <title>Home</title>
    <meta name="description" content="This is a sufficiently long description for the home page to avoid short-desc warnings. It should exceed fifty characters to pass checks."/>
    <meta property="og:title" content="Home"/>
    <meta property="og:description" content="OpenGraph description long enough to avoid warnings."/>
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
      w(dir, 'dist/client/_redirects', `/en / 308\n`)
      w(dir, 'dist/client/llms.txt', `# https://chinactscanner.org\n`)
      w(dir, 'dist/client/prerender-report.json', `{}`)
      writeSsrWhitelist(dir, ['/', '/zh'])

      const r = spawnSync(process.execPath, [script, '--mode=dev'], { cwd: dir, encoding: 'utf-8' })
      expect(r.status).toBe(0)
      // Should not contain FAIL section
      expect(r.stdout).not.toMatch(/🚩 FAIL \(/)
      expect(r.stdout).toMatch(/SEO\/UX Audit Passed/)
      // Report file should exist
      const reportPath = resolve(dir, 'dist', 'client', 'audit-report.md')
      expect(existsSync(reportPath)).toBe(true)
      const md = readFileSync(reportPath, 'utf-8')
      expect(md).toMatch(/SEO\/UX Audit Report/)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('fails when H1 or canonical is missing in HTML and in browser audit', () => {
    const dir = mkdtempSync(join(tmpdir(), 'seo-fail-'))
    try {
      const dist = join(dir, 'dist', 'client')
      w(dir, 'dist/client/index.html', `
<!doctype html>
<html><head>
  <meta charset="utf-8"/>
  <title>No H1</title>
</head>
<body>
  <div id="root"><p>Short</p></div>
</body></html>`)
      w(dir, 'dist/client/robots.txt', `User-agent: *\nAllow: /\nSitemap: https://chinactscanner.org/sitemap.xml\n`)
      w(dir, 'dist/client/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://chinactscanner.org/</loc></url>
</urlset>`)
      writeSsrWhitelist(dir, ['/'])

      const r = spawnSync(process.execPath, [script, '--mode=dev'], { cwd: dir, encoding: 'utf-8', env: { ...process.env, CHECK_FAIL_ON_DEV: '1' } })
      expect(r.status).toBe(1)
      // Assert via markdown report to avoid flaky stdout/stderr routing on CI
      const reportPath = resolve(dir, 'dist', 'client', 'audit-report.md')
      const reportAlt = resolve(dir, 'dist', 'audit-report.md')
      const exists = existsSync(reportPath) || existsSync(reportAlt)
      expect(exists).toBe(true)
      const md = existsSync(reportPath) ? readFileSync(reportPath, 'utf-8') : readFileSync(reportAlt, 'utf-8')
      expect(md).toMatch(/## FAIL/)
      expect(md).toMatch(/源代码未找到 H1|DOM 未找到 H1|DOM 未找到 canonical|源代码几乎无可抓取文本/)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('warns when a page has zero internal outgoing links and flags orphan', () => {
    const dir = mkdtempSync(join(tmpdir(), 'seo-zero-outgoing-'))
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
    <link rel="canonical" href="/"/>
    <title>Home</title>
    <meta name="description" content="This is a sufficiently long description to avoid warnings for short description."/>
  </head>
  <body>
    <div id="root">
      <h1>Welcome</h1>
      <p>${'Visible content '.repeat(30)}</p>
      <a href="/nolinks">Go nolinks</a>
    </div>
  </body>
  </html>`)
      w(dir, 'dist/client/nolinks.html', `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <link rel="canonical" href="/nolinks"/>
    <title>No Links</title>
    <meta name="description" content="This is a sufficiently long description to avoid warnings."/>
  </head>
  <body>
    <div id="root">
      <h1>No Links Here</h1>
      <p>${'Visible content '.repeat(30)}</p>
    </div>
  </body>
</html>`)
      w(dir, 'dist/client/manifest.json', JSON.stringify({ name: "Demo", short_name: "Demo", start_url: "/", icons: [{ src: "/i-192.png", sizes: "192x192", type: "image/png" }, { src: "/i-512.png", sizes: "512x512", type: "image/png" }] }, null, 2))
      w(dir, 'dist/client/robots.txt', `User-agent: *\nAllow: /\nSitemap: https://chinactscanner.org/sitemap.xml\n`)
      w(dir, 'dist/client/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://chinactscanner.org/</loc></url>
  <url><loc>https://chinactscanner.org/nolinks</loc></url>
</urlset>`)
      writeSsrWhitelist(dir, ['/', '/nolinks'])
      const r = spawnSync(process.execPath, [script, '--mode=dev'], { cwd: dir, encoding: 'utf-8' })
      expect(r.status).toBe(0)
      const reportPath = resolve(dir, 'dist', 'client', 'audit-report.md')
      const reportAlt = resolve(dir, 'dist', 'audit-report.md')
      const md = existsSync(reportPath) ? readFileSync(reportPath, 'utf-8') : readFileSync(reportAlt, 'utf-8')
      expect(md).toMatch(/出链为0（无内部链接）/)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('warns when HTML lang mismatches the path language', () => {
    const dir = mkdtempSync(join(tmpdir(), 'seo-lang-mismatch-'))
    try {
      w(dir, 'dist/client/index.html', `
<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"/>
<link rel="canonical" href="/"/>
<title>Home</title>
<meta name="description" content="${'X'.repeat(60)}"/>
</head><body><div id="root"><h1>H</h1><p>${'Y '.repeat(200)}</p></div></body></html>`)
      w(dir, 'dist/client/zh/index.html', `
<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"/>
<link rel="canonical" href="/zh"/>
<title>ZH</title>
<meta name="description" content="${'X'.repeat(60)}"/>
</head><body><div id="root"><h1>Z</h1><p>${'Y '.repeat(200)}</p></div></body></html>`)
      w(dir, 'dist/client/robots.txt', `User-agent: *\nAllow: /\nSitemap: https://chinactscanner.org/sitemap.xml\n`)
      w(dir, 'dist/client/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://chinactscanner.org/zh</loc></url>
</urlset>`)
      writeSsrWhitelist(dir, ['/', '/zh'])
      const r = spawnSync(process.execPath, [script, '--mode=dev'], { cwd: dir, encoding: 'utf-8' })
      expect(r.status).toBe(0)
      const reportPath = resolve(dir, 'dist', 'client', 'audit-report.md')
      const reportAlt = resolve(dir, 'dist', 'audit-report.md')
      const md = existsSync(reportPath) ? readFileSync(reportPath, 'utf-8') : readFileSync(reportAlt, 'utf-8')
      expect(md).toMatch(/HTML lang 与路径语言不一致/)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('warns when a sitemap page has non-self canonical', () => {
    const dir = mkdtempSync(join(tmpdir(), 'seo-sitemap-canonical-'))
    try {
      w(dir, 'dist/client/index.html', `
<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"/>
<link rel="canonical" href="/"/>
<title>Home</title>
<meta name="description" content="${'X'.repeat(60)}"/>
</head><body><div id="root"><h1>H</h1><p>${'Y '.repeat(200)}</p></div></body></html>`)
      w(dir, 'dist/client/other.html', `
<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"/>
<link rel="canonical" href="/"/>
<title>Other</title>
<meta name="description" content="${'X'.repeat(60)}"/>
</head><body><div id="root"><h1>O</h1><p>${'Y '.repeat(200)}</p></div></body></html>`)
      w(dir, 'dist/client/robots.txt', `User-agent: *\nAllow: /\nSitemap: https://chinactscanner.org/sitemap.xml\n`)
      w(dir, 'dist/client/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://chinactscanner.org/other</loc></url>
</urlset>`)
      writeSsrWhitelist(dir, ['/', '/other'])
      const r = spawnSync(process.execPath, [script, '--mode=dev'], { cwd: dir, encoding: 'utf-8' })
      expect(r.status).toBe(0)
      const reportPath = resolve(dir, 'dist', 'client', 'audit-report.md')
      const reportAlt = resolve(dir, 'dist', 'audit-report.md')
      const md = existsSync(reportPath) ? readFileSync(reportPath, 'utf-8') : readFileSync(reportAlt, 'utf-8')
      expect(md).toMatch(/sitemap 页面 canonical 非自引用|canonical 非自引用：\/other canonical=\//)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('warns when hreflang reciprocal is missing', () => {
    const dir = mkdtempSync(join(tmpdir(), 'seo-hreflang-recip-'))
    try {
      w(dir, 'dist/client/index.html', `
<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"/>
<link rel="canonical" href="/"/>
<link rel="alternate" hreflang="zh" href="https://chinactscanner.org/zh/page"/>
<title>Home</title>
<meta name="description" content="${'X'.repeat(60)}"/>
</head><body><div id="root"><h1>H</h1><p>${'Y '.repeat(200)}</p></div></body></html>`)
      w(dir, 'dist/client/zh/page.html', `
<!doctype html>
<html lang="zh"><head>
<meta charset="utf-8"/>
<link rel="canonical" href="/zh/page"/>
<title>Zh</title>
<meta name="description" content="${'X'.repeat(60)}"/>
</head><body><div id="root"><h1>Z</h1><p>${'Y '.repeat(200)}</p></div></body></html>`)
      w(dir, 'dist/client/robots.txt', `User-agent: *\nAllow: /\nSitemap: https://chinactscanner.org/sitemap.xml\n`)
      w(dir, 'dist/client/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://chinactscanner.org/</loc></url>
  <url><loc>https://chinactscanner.org/zh/page</loc></url>
</urlset>`)
      const r = spawnSync(process.execPath, [script, '--mode=dev'], { cwd: dir, encoding: 'utf-8', env: { ...process.env, CHECK_STRICT_HEAD: '1' } })
      expect(r.status).toBe(0)
      const reportPath = resolve(dir, 'dist', 'client', 'audit-report.md')
      const reportAlt = resolve(dir, 'dist', 'audit-report.md')
      const md = existsSync(reportPath) ? readFileSync(reportPath, 'utf-8') : readFileSync(reportAlt, 'utf-8')
      expect(md).toMatch(/hreflang (缺少回链|缺失)/)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('warns on global hreflang conflicts for same lang -> same target', () => {
    const dir = mkdtempSync(join(tmpdir(), 'seo-hreflang-conflict-'))
    try {
      w(dir, 'dist/client/a.html', `
<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"/>
<link rel="canonical" href="/a"/>
<link rel="alternate" hreflang="zh" href="https://chinactscanner.org/zh/c"/>
<title>A</title>
<meta name="description" content="${'X'.repeat(60)}"/>
</head><body><div id="root"><h1>A</h1><p>${'Y '.repeat(200)}</p></div></body></html>`)
      w(dir, 'dist/client/b.html', `
<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"/>
<link rel="canonical" href="/b"/>
<link rel="alternate" hreflang="zh" href="https://chinactscanner.org/zh/c"/>
<title>B</title>
<meta name="description" content="${'X'.repeat(60)}"/>
</head><body><div id="root"><h1>B</h1><p>${'Y '.repeat(200)}</p></div></body></html>`)
      w(dir, 'dist/client/zh/c.html', `
<!doctype html>
<html lang="zh"><head>
<meta charset="utf-8"/>
<link rel="canonical" href="/zh/c"/>
<title>C</title>
<meta name="description" content="${'X'.repeat(60)}"/>
</head><body><div id="root"><h1>C</h1><p>${'Y '.repeat(200)}</p></div></body></html>`)
      w(dir, 'dist/client/robots.txt', `User-agent: *\nAllow: /\nSitemap: https://chinactscanner.org/sitemap.xml\n`)
      w(dir, 'dist/client/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://chinactscanner.org/a</loc></url>
  <url><loc>https://chinactscanner.org/b</loc></url>
  <url><loc>https://chinactscanner.org/zh/c</loc></url>
</urlset>`)
      const r = spawnSync(process.execPath, [script, '--mode=dev'], { cwd: dir, encoding: 'utf-8', env: { ...process.env, CHECK_STRICT_HEAD: '1' } })
      expect(typeof r.status).toBe('number')
      const reportPath = resolve(dir, 'dist', 'client', 'audit-report.md')
      const reportAlt = resolve(dir, 'dist', 'audit-report.md')
      const md = existsSync(reportPath) ? readFileSync(reportPath, 'utf-8') : readFileSync(reportAlt, 'utf-8')
      expect(md).toMatch(/全局 hreflang 冲突：lang=zh 指向同一页面 \/zh\/c 来自 2 个(不同)?页面/)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })
  it('warns when a page is orphan (no incoming internal links)', () => {
    const dir = mkdtempSync(join(tmpdir(), 'seo-orphan-'))
    try {
      w(dir, 'dist/client/index.html', `
<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"/>
<link rel="canonical" href="/"/>
<title>Home</title>
<meta name="description" content="${'X'.repeat(60)}"/>
</head><body><div id="root"><h1>H</h1><p>${'Y '.repeat(200)}</p></div></body></html>`)
      w(dir, 'dist/client/orphan.html', `
<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"/>
<link rel="canonical" href="/orphan"/>
<title>Orphan</title>
<meta name="description" content="${'X'.repeat(60)}"/>
</head><body><div id="root"><h1>O</h1><p>${'Y '.repeat(200)}</p></div></body></html>`)
      w(dir, 'dist/client/robots.txt', `User-agent: *\nAllow: /\nSitemap: https://chinactscanner.org/sitemap.xml\n`)
      w(dir, 'dist/client/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://chinactscanner.org/</loc></url>
  <url><loc>https://chinactscanner.org/orphan</loc></url>
</urlset>`)
      const r = spawnSync(process.execPath, [script, '--mode=dev'], { cwd: dir, encoding: 'utf-8' })
      expect(r.status).toBe(0)
      const reportPath = resolve(dir, 'dist', 'client', 'audit-report.md')
      const reportAlt = resolve(dir, 'dist', 'audit-report.md')
      const md = existsSync(reportPath) ? readFileSync(reportPath, 'utf-8') : readFileSync(reportAlt, 'utf-8')
      expect(md).toMatch(/孤立页：\/orphan/)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })
})
