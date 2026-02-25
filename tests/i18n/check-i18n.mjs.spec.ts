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

const script = resolve(__dirname, '../../scripts/i18n/check-i18n.mjs')

describe('scripts/i18n/check-i18n.mjs', () => {
  it('passes when en/zh keys align', () => {
    const dir = mkdtempSync(join(tmpdir(), 'i18n-mjs-pass-'))
    try {
      w(dir, 'src/i18n.ts', `
import { enCommon } from './locales/en/common';
import { zhCommon } from './locales/zh/common';
const resources = {
  en: { translation: { ...enCommon } },
  zh: { translation: { ...zhCommon } }
};
export default resources;
`)
      w(dir, 'src/locales/en/common.ts', `
export const enCommon = {
  header: { title: "Home" },
  about: { title: "About" }
}
`)
      w(dir, 'src/locales/zh/common.ts', `
export const zhCommon = {
  header: { title: "首页" },
  about: { title: "关于" }
}
`)
      const r = spawnSync(process.execPath, [script], { cwd: dir, encoding: 'utf-8' })
      expect(r.status).toBe(0)
      expect(r.stdout).toMatch(/i18n Check Passed/i)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('fails when zh misses keys', () => {
    const dir = mkdtempSync(join(tmpdir(), 'i18n-mjs-fail-'))
    try {
      w(dir, 'src/i18n.ts', `
import { enCommon } from './locales/en/common';
import { zhCommon } from './locales/zh/common';
const resources = {
  en: { translation: { ...enCommon } },
  zh: { translation: { ...zhCommon } }
};
export default resources;
`)
      w(dir, 'src/locales/en/common.ts', `
export const enCommon = {
  header: { title: "Home" },
  about: { title: "About" }
}
`)
      w(dir, 'src/locales/zh/common.ts', `
export const zhCommon = {
  header: { }
}
`)
      const r = spawnSync(process.execPath, [script], { cwd: dir, encoding: 'utf-8' })
      expect(r.status).toBe(1)
      expect(r.stdout).toMatch(/i18n Check Failed/i)
      expect(r.stdout).toMatch(/Missing Keys/i)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })
})

