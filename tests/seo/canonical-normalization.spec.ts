/* @vitest-environment node */
import { describe, it, expect } from 'vitest'
import { generateCanonicalUrl, generateHreflangLinks, buildPageHead } from '@/utils/seo'

describe('Canonical normalization and hreflang generation', () => {
  it('generates absolute canonical for root without trailing slash (en)', () => {
    const url = generateCanonicalUrl('/', 'en')
    expect(url).toBe('https://chinactscanner.org')
  })

  it('generates absolute canonical for zh root with prefix and no trailing slash', () => {
    const url = generateCanonicalUrl('/', 'zh')
    expect(url).toBe('https://chinactscanner.org/zh')
  })

  it('removes language prefix, query and hash, and removes trailing slash for inner paths', () => {
    const url = generateCanonicalUrl('/zh/devices/?q=ct#section', 'zh')
    expect(url).toBe('https://chinactscanner.org/zh/devices')
    const enUrl = generateCanonicalUrl('/devices/?utm_source=xx#top', 'en')
    expect(enUrl).toBe('https://chinactscanner.org/devices')
  })

  it('produces hreflang set with en, zh-Hans and x-default using absolute URLs', () => {
    const links = generateHreflangLinks('/devices/ct-scanners/')
    const hrefs = new Map(links.map(l => [l.hreflang, l.href]))
    expect(hrefs.get('en')).toBe('https://chinactscanner.org/devices/ct-scanners')
    expect(hrefs.get('zh-Hans')).toBe('https://chinactscanner.org/zh/devices/ct-scanners')
    expect(hrefs.get('x-default')).toBe('https://chinactscanner.org/devices/ct-scanners')
  })
})

describe('Head centralization contract', () => {
  it('buildPageHead does not output canonical/hreflang links (centralized at root)', () => {
    const head = buildPageHead('/devices', 'en')
    expect(Array.isArray(head.links)).toBe(true)
    expect(head.links.length).toBe(0)
    const metas = head.meta.map((m) => ('name' in m && m.name) || ('property' in m && m.property) || 'title')
    expect(metas).toContain('og:url')
  })
})
