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

const script = resolve(__dirname, '../../scripts/i18n/check-missing-labels.js')

describe('scripts/i18n/check-missing-labels.js', () => {
  it('reports missing labels for zh when page uses t()', () => {
    const dir = mkdtempSync(join(tmpdir(), 'i18n-missing-labels-'))
    try {
      w(dir, 'src/locales/en/labels/about.ts', `
export default {
  about: {
    title: "About Page"
  }
}
`)
      w(dir, 'src/locales/zh/labels/about.ts', `
export default {
  about: {
  }
}
`)
      w(dir, 'src/pages/About.tsx', `
import React from 'react'
import { useTranslation } from 'react-i18next'
export default function About() {
  const { t } = useTranslation('about')
  return <h1>{t('title')}</h1>
}
`)
      const r = spawnSync(process.execPath, [script], { cwd: dir, encoding: 'utf-8' })
      expect(r.status).toBe(1)
      expect(r.stdout).toMatch(/缺失的属性/)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })
})
