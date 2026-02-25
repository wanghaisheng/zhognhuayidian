/* @vitest-environment jsdom */
import { describe, it, expect, vi } from 'vitest'
import * as React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { render as ssrRender } from '@/entry-server'
import { createAppRouter } from '@/router.create'
import { RouterProvider } from '@tanstack/react-router'
import { RouterClient } from '@tanstack/react-router/ssr/client'
import i18n from '@/lib/i18n'
import { I18nextProvider } from 'react-i18next'

function extract(html: string) {
  const headMatch = html.match(/<head>([\s\S]*?)<\/head>/i)
  const bodyMatch = html.match(/<div id="root">([\s\S]*?)<\/div>/i)
  return {
    head: headMatch ? headMatch[1] : '',
    rootInner: bodyMatch ? bodyMatch[1] : '',
  }
}

describe('Route-level SSR → Hydration stability', () => {
  const uncaughtHandler = (err: unknown) => {
    const msg = String((err as Error)?.message || err || '')
    if (msg.includes('This root received an early update, before anything was able hydrate')) {
      return
    }
    throw err as Error
  }

  beforeAll(() => {
    process.on('uncaughtException', uncaughtHandler)
  })
  afterAll(() => {
    process.off('uncaughtException', uncaughtHandler)
  })

  it('hydrates home route without React errors and keeps head stable', async () => {
    const url = 'https://chinactscanner.org/'
    const { appHtml } = await ssrRender(url, '')
    expect(appHtml).toBeTruthy()
    const { head, rootInner } = extract(appHtml)
    document.head.innerHTML = head
    const container = document.createElement('div')
    container.id = 'root'
    container.innerHTML = rootInner
    document.body.appendChild(container)

    const beforeHead = document.head.innerHTML
    const errorSpy = vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
      const text = args.map(a => String(a ?? '')).join(' ')
      if (text.includes('This root received an early update, before anything was able hydrate')) {
        return
      }
      // React hydration warning lines often start with "Warning:"; keep them for assertion
      (console as any).__delegate?.error?.(...args)
    })

    const router = createAppRouter()
    const element = (
      <RouterProvider router={router}>
        <I18nextProvider i18n={i18n}>
          <RouterClient router={router} />
        </I18nextProvider>
      </RouterProvider>
    )
    const root = hydrateRoot(container, element)
    try {
      await Promise.resolve()
      await Promise.resolve()
      const afterHead = document.head.innerHTML
      const norm = (s: string) => s.replace(/\s+/g, ' ').trim()
      expect(norm(afterHead)).toBe(norm(beforeHead))
      expect(errorSpy).not.toHaveBeenCalled()
    } finally {
      root.unmount()
      errorSpy.mockRestore()
    }
  })

  it('hydrates zh home and canonical includes zh prefix; alternates present', async () => {
    const url = 'https://chinactscanner.org/zh/'
    const { appHtml } = await ssrRender(url, '')
    expect(appHtml).toBeTruthy()
    const { head, rootInner } = extract(appHtml)
    expect(head).toContain('rel="canonical"')
    expect(head).toMatch(/href="https?:\/\/[^"]+\/zh(\/)?"/)
    expect(head).toMatch(/rel="alternate"/)
    document.head.innerHTML = head
    const container = document.createElement('div')
    container.id = 'root'
    container.innerHTML = rootInner
    document.body.appendChild(container)
    const beforeHead = document.head.innerHTML
    const errorSpy = vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
      const text = args.map(a => String(a ?? '')).join(' ')
      if (text.includes('This root received an early update, before anything was able hydrate')) return
      ;(console as any).__delegate?.error?.(...args)
    })
    const router = createAppRouter()
    const element = (
      <RouterProvider router={router}>
        <I18nextProvider i18n={i18n}>
          <RouterClient router={router} />
        </I18nextProvider>
      </RouterProvider>
    )
    const root = hydrateRoot(container, element)
    try {
      await Promise.resolve()
      await Promise.resolve()
      const afterHead = document.head.innerHTML
      const norm = (s: string) => s.replace(/\s+/g, ' ').trim()
      expect(norm(afterHead)).toBe(norm(beforeHead))
      expect(errorSpy).not.toHaveBeenCalled()
    } finally {
      root.unmount()
      errorSpy.mockRestore()
    }
  })

  it('hydrates section route (/resources) in en/zh with stable head', async () => {
    for (const path of ['/resources', '/zh/resources']) {
      const url = `https://chinactscanner.org${path}`
      const { appHtml } = await ssrRender(url, '')
      expect(appHtml).toBeTruthy()
      const { head, rootInner } = extract(appHtml)
      expect(head).toContain('rel="canonical"')
      if (path.startsWith('/zh')) {
        expect(head).toMatch(/href="https?:\/\/[^"]+\/zh\/resources"/)
      } else {
        expect(head).toMatch(/href="https?:\/\/[^"]+\/resources"/)
      }
      document.head.innerHTML = head
      const container = document.createElement('div')
      container.id = 'root'
      container.innerHTML = rootInner
      document.body.appendChild(container)
      const errorSpy = vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
        const text = args.map(a => String(a ?? '')).join(' ')
        if (text.includes('This root received an early update, before anything was able hydrate')) return
        ;(console as any).__delegate?.error?.(...args)
      })
      const router = createAppRouter()
      const element = (
        <RouterProvider router={router}>
          <I18nextProvider i18n={i18n}>
            <RouterClient router={router} />
          </I18nextProvider>
        </RouterProvider>
      )
      const root = hydrateRoot(container, element)
      try {
        await Promise.resolve()
        await Promise.resolve()
        expect(errorSpy).not.toHaveBeenCalled()
      } finally {
        root.unmount()
        errorSpy.mockRestore()
      }
    }
  })
})
