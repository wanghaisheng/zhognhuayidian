/* @vitest-environment node */
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

describe('CF Functions cache s-maxage mapping', () => {
  const file = resolve(__dirname, '../../functions/[[path]].ts')
  const src = readFileSync(file, 'utf-8')

  it('sets 1800s for glossary/technology/stats subpages', () => {
    expect(src).toMatch(/pathname\.startsWith\('\/glossary\/'\)\s*\?\s*1800/)
    expect(src).toMatch(/pathname\.startsWith\('\/technology\/'\)\s*\?\s*1800/)
    expect(src).toMatch(/pathname\.startsWith\('\/stats\/'\)\s*\?\s*1800/)
  })

  it('sets 1800s for reports subpages', () => {
    expect(src).toMatch(/pathname\.startsWith\('\/reports\/'\)\s*\?\s*1800/)
  })

  it('sets 1200s for glossary/technology/stats/reports root pages', () => {
    expect(src).toMatch(/pathname === '\/glossary' \|\| pathname === '\/technology' \|\| pathname === '\/stats' \|\| pathname === '\/reports'\s*\?\s*1200/)
  })

  it('keeps 0s when query params exist', () => {
    expect(src).toMatch(/\?\s*0\s*:/) // simple presence check of the ternary branch
  })
})
