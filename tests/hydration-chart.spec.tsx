/* @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest'
import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'
import { hydrateRoot } from 'react-dom/client'

// Mock recharts so ChartContainer can render in JSDOM
vi.mock('recharts', async () => {
  const React = await import('react')
  return {
    ResponsiveContainer: ({ children }: { children?: React.ReactNode | (() => React.ReactNode) }) => (
      <div data-testid="responsive">
        {typeof children === 'function' ? (children as () => React.ReactNode)() : children}
      </div>
    ),
    Tooltip: () => null,
    Legend: () => null,
  }
})

import { ChartContainer } from '@/components/ui/chart'
import { Heading } from '@/components/ui/heading'

describe('SSR/CSR hydration stability', () => {
  const uncaughtHandler = (err: unknown) => {
    const msg = String((err as Error)?.message || err || '')
    if (msg.includes('This root received an early update, before anything was able hydrate')) {
      return
    }
    // Re-throw unexpected errors
    throw err as Error
  }

  beforeAll(() => {
    process.on('uncaughtException', uncaughtHandler)
  })
  afterAll(() => {
    process.off('uncaughtException', uncaughtHandler)
  })
  let container: HTMLDivElement
  let errorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    errorSpy.mockRestore()
    document.body.innerHTML = ''
  })

  it('ChartContainer uses a stable data-chart id across SSR and hydration', async () => {
    const config = { seriesA: { color: '#123456' }, seriesB: { color: '#abcdef' } }
    const element = (
      <ChartContainer config={config}>
        {() => <div>Chart Body</div>}
      </ChartContainer>
    )

    const ssrHtml = ReactDOMServer.renderToString(element)
    container.innerHTML = ssrHtml

    const before = container.querySelector('[data-chart]') as HTMLElement | null
    expect(before).not.toBeNull()
    const beforeId = before?.getAttribute('data-chart')
    expect(beforeId).toBeTruthy()

    const root = hydrateRoot(container, element)
    await Promise.resolve()
    await Promise.resolve()
    const after = container.querySelector('[data-chart]') as HTMLElement | null
    const afterId = after?.getAttribute('data-chart')

    expect(afterId).toBe(beforeId)
    expect(errorSpy).not.toHaveBeenCalled()
    root.unmount()
  })

  it('Heading renders h1 on SSR and remains after hydration', async () => {
    const element = <Heading level={1}>Hello Title</Heading>
    const ssrHtml = ReactDOMServer.renderToString(element)
    container.innerHTML = ssrHtml

    let h1 = container.querySelector('h1')
    expect(h1).not.toBeNull()
    expect(h1?.textContent).toContain('Hello Title')

    const root = hydrateRoot(container, element)
    await Promise.resolve()
    await Promise.resolve()
    h1 = container.querySelector('h1')
    expect(h1).not.toBeNull()
    expect(h1?.textContent).toContain('Hello Title')
    expect(errorSpy).not.toHaveBeenCalled()
    root.unmount()
  })
})
