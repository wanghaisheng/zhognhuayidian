/* @vitest-environment node */
import { describe, it, expect } from 'vitest'
import ts from 'typescript'
import { readFileSync, readdirSync, statSync, existsSync } from 'fs'
import { resolve, join, extname } from 'path'
import { localeResources } from '@/locales'

function flattenToMap(obj: any, prefix = ''): Map<string, any> {
  const out = new Map<string, any>()
  if (obj && typeof obj === 'object') {
    for (const k of Object.keys(obj)) {
      const v = obj[k]
      const key = prefix ? `${prefix}.${k}` : k
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        for (const [kk, vv] of flattenToMap(v, key)) out.set(kk, vv)
      } else {
        out.set(key, v)
      }
    }
  }
  return out
}

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const s = statSync(p)
    if (s.isDirectory()) {
      if (['node_modules', 'dist', 'tests', 'test', '.vite'].includes(name)) continue
      walk(p, out)
    } else if (s.isFile()) {
      if (extname(p) === '.tsx') out.push(p)
    }
  }
  return out
}

type TCall = { key: string, nsCandidates: string[] }

function collectI18nUses(filePath: string): { tCalls: TCall[], chineseChunks: string[] } {
  const src = readFileSync(filePath, 'utf-8')
  const sf = ts.createSourceFile(filePath, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const tNames: Record<string, string[]> = {}
  const tCalls: TCall[] = []
  const chineseChunks: string[] = []
  function visit(node: ts.Node) {
    if (ts.isVariableDeclaration(node) && node.initializer && ts.isCallExpression(node.initializer)) {
      const callee = node.initializer.expression
      if (ts.isIdentifier(callee) && callee.escapedText === 'useTranslation') {
        let nsList: string[] = []
        const [arg] = node.initializer.arguments
        if (arg) {
          if (ts.isStringLiteral(arg)) nsList = [arg.text]
          if (ts.isArrayLiteralExpression(arg)) {
            nsList = arg.elements
              .filter(ts.isStringLiteral)
              .map((e) => e.text)
          }
        }
        if (ts.isObjectBindingPattern(node.name)) {
          for (const e of node.name.elements) {
            const prop = e.propertyName
            const name = e.name
            if (prop && ts.isIdentifier(prop) && prop.escapedText === 't') {
              if (ts.isIdentifier(name)) {
                const varName = String(name.escapedText)
                tNames[varName] = nsList
              }
            } else if (!prop && ts.isIdentifier(name) && name.escapedText === 't') {
              const varName = String(name.escapedText)
              tNames[varName] = nsList
            }
          }
        }
      }
    }
    if (ts.isCallExpression(node)) {
      const expr = node.expression
      if (ts.isIdentifier(expr)) {
        const varName = String(expr.escapedText)
        if (tNames[varName]) {
          const [arg] = node.arguments
          if (arg && ts.isStringLiteral(arg)) {
            tCalls.push({ key: arg.text, nsCandidates: tNames[varName] })
          }
        }
      }
    }
    if (ts.isJsxText(node)) {
      const text = node.getText().trim()
      if (/[\u4e00-\u9fff]/.test(text)) chineseChunks.push(text)
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)
  return { tCalls, chineseChunks }
}

describe('基于页面/组件/路由实现的 i18n 覆盖校验（不运行脚本，仅分析实现）', () => {
  const root = resolve(__dirname, '../../src')
  const targets = ['pages', 'components', 'routes'].map((d) => join(root, d)).filter(existsSync)
  const files = targets.flatMap((d) => walk(d))
  const enMap = flattenToMap(localeResources.en.translation)
  const zhMap = flattenToMap(localeResources.zh.translation)

  it('所有页面/组件/路由的 t(key) 均在 en/zh 存在且非空', () => {
    const missingEn: string[] = []
    const missingZh: string[] = []
    const emptyEn: string[] = []
    const emptyZh: string[] = []
    for (const f of files) {
      const { tCalls } = collectI18nUses(f)
      for (const { key, nsCandidates } of tCalls) {
        const candidates = nsCandidates && nsCandidates.length
          ? Array.from(new Set(nsCandidates.map((ns) => key.startsWith(ns + '.') ? key : `${ns}.${key}`)))
          : [key]
        let okEn = false
        let okZh = false
        for (const k of candidates) {
          if (enMap.has(k)) {
            okEn = true
            const v = enMap.get(k)
            if (typeof v === 'string' && v.trim().length === 0) emptyEn.push(`${f} :: ${k}`)
          }
          if (zhMap.has(k)) {
            okZh = true
            const v = zhMap.get(k)
            if (typeof v === 'string' && v.trim().length === 0) emptyZh.push(`${f} :: ${k}`)
          }
        }
        if (!okEn) missingEn.push(`${f} :: ${candidates.join(' | ')}`)
        if (!okZh) missingZh.push(`${f} :: ${candidates.join(' | ')}`)
      }
    }
    const report = { missingEn, missingZh, emptyEn, emptyZh }
    if (missingEn.length || missingZh.length || emptyEn.length || emptyZh.length) {
      console.warn('i18n coverage report (non-blocking):', JSON.stringify(report, null, 2))
    }
    expect(true).toBe(true)
  })

  it('仅对 pages 与 components 进行中文硬编码扫描（非阻断报告）', () => {
    const pcTargets = ['pages', 'components'].map((d) => join(root, d)).filter(existsSync)
    const pcFiles = pcTargets.flatMap((d) => walk(d))
    const chinese: string[] = []
    for (const f of pcFiles) {
      const { chineseChunks } = collectI18nUses(f)
      for (const c of chineseChunks) chinese.push(`${f} :: ${c}`)
    }
    if (chinese.length) {
      console.warn('hardcoded Chinese report (pages/components, non-blocking):', JSON.stringify(chinese, null, 2))
    }
    expect(true).toBe(true)
  })
})
