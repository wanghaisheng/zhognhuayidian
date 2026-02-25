/* @vitest-environment node */
import { describe, it, expect } from 'vitest'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join, resolve } from 'path'
import { spawnSync } from 'node:child_process'

function w(dir: string, file: string, content: string) {
  const p = join(dir, file)
  mkdirSync(join(p, '..'), { recursive: true })
  writeFileSync(p, content, 'utf-8')
}

const script = resolve(__dirname, '../../scripts/i18n/check-i18n-consistency.js')

describe('scripts/i18n/check-i18n-consistency.js', () => {
  it('runs and reports analysis output', () => {
    const dir = mkdtempSync(join(tmpdir(), 'i18n-consistency-'))
    try {
      w(dir, 'src/locales/en/resources.ts', `
export const enResources = {
  home: { title: "Home" },
  about: { title: "About" }
}
`)
      w(dir, 'src/locales/zh/resources.ts', `
export const zhResources = {
  about: { title: "关于" }
}
`)
      w(dir, 'src/locales/index.ts', `
import { enResources } from './en/resources'
import { zhResources } from './zh/resources'
export const localeResources = {
  en: { translation: enResources },
  zh: { translation: zhResources }
}
`)
      const r = spawnSync(process.execPath, [script], { cwd: dir, encoding: 'utf-8' })
      expect(typeof r.status).toBe('number')
      expect(r.stdout).toMatch(/多语言内容和调用的一致性/)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })
})
