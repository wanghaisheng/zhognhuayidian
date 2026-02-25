/* @vitest-environment node */
import { describe, it, expect } from 'vitest'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'fs'
import { tmpdir } from 'os'
import { join, resolve } from 'path'
import { spawnSync } from 'node:child_process'

const script = resolve(__dirname, '../../scripts/check-links.mjs')

function w(dir: string, file: string, content: string) {
  const p = join(dir, file)
  mkdirSync(join(p, '..'), { recursive: true })
  writeFileSync(p, content, 'utf-8')
}

describe.skip('Redirects order and static priority (strict)', () => {
  it('warns when SPA fallback is not last and static rule is after fallback', () => {
    const dir = mkdtempSync(join(tmpdir(), 'redirects-order-'))
    try {
      w(dir, 'dist/client/index.html', `<!doctype html><html><head><title>x</title><meta name="description" content="y"/><link rel="canonical" href="https://chinactscanner.org/"/></head><body><div id="root"></div></body></html>`)
      w(dir, 'dist/client/robots.txt', `User-agent: *\nAllow: /\n`)
      w(dir, 'dist/client/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`)
      // Intentionally put SPA fallback before static rule
      w(dir, 'dist/client/_redirects', [
        '/* /index.html 200',
        '/assets/* /assets/:splat 200',
        '/en / 308',
      ].join('\n'))
      const r = spawnSync(process.execPath, [script, '--mode=dev'], {
        cwd: dir,
        encoding: 'utf-8',
        env: { ...process.env, CHECK_STRICT_REDIRECTS: '1' }
      })
      const report = readFileSync(join(dir, 'dist', 'client', 'audit-report.md'), 'utf-8')
      expect(report).toMatch(/SPA fallback \(\/\* \.\.\. 200\) 不是重定向规则的最后一条/)
      expect(report).toMatch(/静态资源 200 规则位于 SPA fallback 之后（建议前置）/)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })
})
