/* @vitest-environment jsdom */
import { describe, it, expect } from 'vitest'
import { shouldHydrate } from '@/lib/hydrationStrategy'

describe('shouldHydrate', () => {
  it('returns true when both hasChildNodes and hasRouterContext are true', () => {
    expect(shouldHydrate(true, true)).toBe(true)
  })

  it('returns false when hasChildNodes is true but hasRouterContext is false', () => {
    expect(shouldHydrate(true, false)).toBe(false)
  })

  it('returns false when hasChildNodes is false but hasRouterContext is true', () => {
    expect(shouldHydrate(false, true)).toBe(false)
  })

  it('returns false when both are false', () => {
    expect(shouldHydrate(false, false)).toBe(false)
  })
})

