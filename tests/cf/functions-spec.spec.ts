/* @vitest-environment node */
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

describe('Cloudflare Pages Functions [[path]].ts', () => {
  const file = resolve(__dirname, '../../functions/[[path]].ts')
  const src = readFileSync(file, 'utf-8')

  it('contains static bypass logic for extensions and Accept header', () => {
    expect(src).toContain("const hasExt = (p) => /\\/[^/]+\\.[^/]+$/")
    expect(src).toContain("const acceptsHtml = (a) => /\\btext\\/html\\b/i.test(a)")
    expect(src).toContain("const isStaticPath = (p)")
    expect(src).toContain("p.startsWith('/assets/')")
    expect(src).toContain("p.startsWith('/images/')")
    expect(src).toContain("p.startsWith('/fonts/')")
    expect(src).toContain("method !== 'GET' || hasExt(pathname) || isStaticPath(pathname) || !acceptsHtml(accept)")
  })

  it('gates SSR by SSR path whitelist', () => {
    const hasInline = /const SSR_PATHS = new Set\(/.test(src)
    const hasImported = /from '\.\/ssr-paths'/.test(src) && /const PATHS = IMPORTED_SSR_PATHS/.test(src) && /if \(!matchesPath\(pathname\)\)/.test(src)
    expect(hasImported).toBe(true)
    expect(hasInline).toBe(false)
  })
})
