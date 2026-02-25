import { describe, it, expect, vi, beforeEach } from 'vitest'

type LoaderFn = (args: unknown) => unknown | Promise<unknown>
const captured: Record<string, { loader?: LoaderFn }> = {}

vi.mock('@tanstack/react-router', async () => {
  return {
    defer: <T,>(value: T) => value,
    createFileRoute:
      (path: string) =>
      (opts: { loader?: LoaderFn }) => {
        captured[path] = { loader: opts.loader }
        // Return a minimal route object to satisfy module execution
        return { id: path }
      },
  }
})

vi.mock('@/hooks/useSupabaseData', async () => {
  return {
    getArticlesAllQueryKey: (locale: string) => ['supabase', 'articles', 'all', locale],
    getArticlesByCategoryQueryKey: (category: string, locale: string) => ['supabase', 'articles', 'byCategory', category, locale],
    getArticleBySlugQueryKey: (slug: string, locale: string) => ['supabase', 'articles', 'bySlug', slug, locale],
    fetchArticlesAll: async () => ({ data: [] }),
    fetchArticlesByCategory: async () => ({ data: [] }),
    fetchArticleBySlug: async (slug: string) => ({
      data: { slug, title: 'Mock Title', excerpt: 'Mock Excerpt', featured_image: '', category: 'analysis' },
    }),
    mapLocalizedFields: (data: Record<string, unknown>) => data,
  }
})

const makeQC = () => {
  const calls: Array<{ kind: 'ensure' | 'prefetch'; key: unknown[] }> = []
  const qc = {
    ensureQueryData: vi.fn(async (opts: { queryKey: unknown[]; queryFn: () => Promise<unknown> }) => {
      calls.push({ kind: 'ensure', key: opts.queryKey })
      return await opts.queryFn()
    }),
    prefetchQuery: vi.fn(async (opts: { queryKey: unknown[]; queryFn: () => Promise<unknown> }) => {
      calls.push({ kind: 'prefetch', key: opts.queryKey })
      await opts.queryFn()
    }),
    __calls: calls,
  }
  return qc
}

describe('file-route loaders queryKey conventions', () => {
  beforeEach(() => {
    Object.keys(captured).forEach((k) => delete captured[k])
    vi.resetModules()
  })

  it('devices/$category/$slug uses unified keys and prefetch', async () => {
    await import('../../src/routes/devices.$category.$slug')
    const loader = captured['/devices/$category/$slug']?.loader
    expect(typeof loader).toBe('function')
    const qc = makeQC()
    const fakeCtx = { context: { queryClient: qc }, params: { slug: 'somedevice' }, location: { pathname: '/zh/devices/mri-scanners/somedevice' } }
    await loader!(fakeCtx)
    const keys = qc.__calls.map((c) => c.key.join('|'))
    expect(keys).toContain(['supabase', 'devices', 'bySlug', 'somedevice', 'zh'].join('|'))
    expect(keys).toContain(['supabase', 'devices', 'all', 'zh'].join('|'))
    // manufacturer prefetch key may be absent if manufacturer_id is missing; allow either 2 or 3 calls
    expect(qc.ensureQueryData).toHaveBeenCalledTimes(1)
  }, 10000)

  it('devices/$category/$specification/$slug uses unified keys and prefetch', async () => {
    await import('../../src/routes/devices.$category.$specification.$slug')
    const loader = captured['/devices/$category/$specification/$slug']?.loader
    expect(typeof loader).toBe('function')
    const qc = makeQC()
    const fakeCtx = { context: { queryClient: qc }, params: { slug: 'specdevice' }, location: { pathname: '/devices/ct-scanners/specs/specdevice' } }
    await loader!(fakeCtx)
    const keys = qc.__calls.map((c) => c.key.join('|'))
    expect(keys).toContain(['supabase', 'devices', 'bySlug', 'specdevice', 'en'].join('|'))
    expect(keys).toContain(['supabase', 'devices', 'all', 'en'].join('|'))
  })

  it('/glossary prefetches list with markdown key', async () => {
    await import('../../src/routes/glossary')
    const loader = captured['/glossary']?.loader
    expect(typeof loader).toBe('function')
    const qc = makeQC()
    const fakeCtx = { context: { queryClient: qc }, location: { pathname: '/zh/glossary' } }
    await loader!(fakeCtx)
    const keys = qc.__calls.map((c) => c.key.join('|'))
    expect(keys).toContain(['markdown', 'glossary', 'list', 'zh'].join('|'))
  }, 10000)

  it('/manufacturers prefetches list with unified supabase key', async () => {
    await import('../../src/routes/manufacturers')
    const loader = captured['/manufacturers']?.loader
    expect(typeof loader).toBe('function')
    const qc = makeQC()
    const fakeCtx = { context: { queryClient: qc }, location: { pathname: '/zh/manufacturers' } }
    await loader!(fakeCtx)
    const keys = qc.__calls.map((c) => c.key.join('|'))
    expect(keys).toContain(['supabase', 'manufacturers', 'all', 'zh'].join('|'))
  })

  it('/manufacturers/$slug ensures detail with unified supabase key', async () => {
    await import('../../src/routes/manufacturers.$slug')
    const loader = captured['/manufacturers/$slug']?.loader
    expect(typeof loader).toBe('function')
    const qc = makeQC()
    const fakeCtx = { context: { queryClient: qc }, params: { slug: 'siemens-healthineers' }, location: { pathname: '/manufacturers/siemens-healthineers' } }
    await loader!(fakeCtx)
    const keys = qc.__calls.map((c) => c.key.join('|'))
    expect(keys).toContain(['supabase', 'manufacturers', 'bySlug', 'siemens-healthineers', 'en'].join('|'))
  })

  it('technology/$slug ensures content and prefetches list with markdown keys', async () => {
    await import('../../src/routes/technology.$slug')
    const loader = captured['/technology/$slug']?.loader
    expect(typeof loader).toBe('function')
    const qc = makeQC()
    const fakeCtx = { context: { queryClient: qc }, params: { slug: 'image-reconstruction' }, location: { pathname: '/zh/technology/image-reconstruction' } }
    await loader!(fakeCtx)
    const keys = qc.__calls.map((c) => c.key.join('|'))
    expect(keys).toContain(['markdown', 'technology', 'image-reconstruction', 'zh'].join('|'))
    expect(keys).toContain(['markdown', 'technology', 'list', 'zh'].join('|'))
  })

  it('stats/$slug ensures content and prefetches list with markdown keys', async () => {
    await import('../../src/routes/stats.$slug')
    const loader = captured['/stats/$slug']?.loader
    expect(typeof loader).toBe('function')
    const qc = makeQC()
    const fakeCtx = { context: { queryClient: qc }, params: { slug: 'market-overview' }, location: { pathname: '/stats/market-overview' } }
    await loader!(fakeCtx)
    const keys = qc.__calls.map((c) => c.key.join('|'))
    expect(keys).toContain(['markdown', 'stats', 'market-overview', 'en'].join('|'))
    expect(keys).toContain(['markdown', 'stats', 'list', 'en'].join('|'))
  })

  it('/history prefetches list with markdown key', async () => {
    await import('../../src/routes/history')
    const loader = captured['/history']?.loader
    expect(typeof loader).toBe('function')
    const qc = makeQC()
    const fakeCtx = { context: { queryClient: qc }, location: { pathname: '/zh/history' } }
    await loader!(fakeCtx)
    const keys = qc.__calls.map((c) => c.key.join('|'))
    expect(keys).toContain(['markdown', 'history', 'list', 'zh'].join('|'))
  })

  it('/blog/$slug ensures article and prefetches category list', async () => {
    await import('../../src/routes/blog.$slug')
    const loader = captured['/blog/$slug']?.loader
    expect(typeof loader).toBe('function')
    const qc = makeQC()
    const fakeCtx = { context: { queryClient: qc }, params: { slug: 'first-ct-scanner' }, location: { pathname: '/zh/blog/first-ct-scanner' } }
    await loader!(fakeCtx)
    const keys = qc.__calls.map((c) => c.key.join('|'))
    expect(keys).toContain(['supabase', 'articles', 'bySlug', 'first-ct-scanner', 'zh'].join('|'))
    expect(keys).toContain(['supabase', 'articles', 'byCategory', 'analysis', 'zh'].join('|'))
  })

  it('/reports prefetches analysis list with markdown key', async () => {
    await import('../../src/routes/reports/index')
    const loader = captured['/reports/']?.loader
    expect(typeof loader).toBe('function')
    const qc = makeQC()
    const fakeCtx = { context: { queryClient: qc }, location: { pathname: '/reports' } }
    await loader!(fakeCtx)
    const keys = qc.__calls.map((c) => c.key.join('|'))
    expect(keys).toContain(['markdown', 'analysis', 'list', 'en'].join('|'))
  })

  it('/reports/market prefetches analysis list with markdown key', async () => {
    await import('../../src/routes/reports/market')
    const loader = captured['/reports/market']?.loader
    expect(typeof loader).toBe('function')
    const qc = makeQC()
    const fakeCtx = { context: { queryClient: qc }, location: { pathname: '/zh/reports/market' } }
    await loader!(fakeCtx)
    const keys = qc.__calls.map((c) => c.key.join('|'))
    expect(keys).toContain(['markdown', 'analysis', 'list', 'zh'].join('|'))
  })

  it('/reports/market/$reportId ensures content and prefetches analysis list', async () => {
    await import('../../src/routes/reports/market.$reportId')
    const loader = captured['/reports/market/$reportId']?.loader
    expect(typeof loader).toBe('function')
    const qc = makeQC()
    const fakeCtx = { context: { queryClient: qc }, params: { reportId: 'ct-china-2024-q3' }, location: { pathname: '/reports/market/ct-china-2024-q3' } }
    await loader!(fakeCtx)
    const keys = qc.__calls.map((c) => c.key.join('|'))
    expect(keys).toContain(['markdown', 'analysis', 'ct-china-2024-q3', 'en'].join('|'))
    expect(keys).toContain(['markdown', 'analysis', 'list', 'en'].join('|'))
  })

  it('/reports/expert prefetches analysis list with markdown key', async () => {
    await import('../../src/routes/reports/expert')
    const loader = captured['/reports/expert']?.loader
    expect(typeof loader).toBe('function')
    const qc = makeQC()
    const fakeCtx = { context: { queryClient: qc }, location: { pathname: '/zh/reports/expert' } }
    await loader!(fakeCtx)
    const keys = qc.__calls.map((c) => c.key.join('|'))
    expect(keys).toContain(['markdown', 'analysis', 'list', 'zh'].join('|'))
  })

  it('/compare prefetches ct devices with unified supabase key', async () => {
    await import('../../src/routes/compare/index')
    const loader = captured['/compare/']?.loader
    expect(typeof loader).toBe('function')
    const qc = makeQC()
    const fakeCtx = { context: { queryClient: qc }, location: { pathname: '/compare' } }
    await loader!(fakeCtx)
    const keys = qc.__calls.map((c) => c.key.join('|'))
    expect(keys).toContain(['supabase', 'devices', 'byCategory', 'ct', 'en'].join('|'))
  })

  it('/compare/ct-scanners prefetches ct devices with unified supabase key', async () => {
    await import('../../src/routes/compare/ct-scanners')
    const loader = captured['/compare/ct-scanners']?.loader
    expect(typeof loader).toBe('function')
    const qc = makeQC()
    const fakeCtx = { context: { queryClient: qc }, location: { pathname: '/zh/compare/ct-scanners' } }
    await loader!(fakeCtx)
    const keys = qc.__calls.map((c) => c.key.join('|'))
    expect(keys).toContain(['supabase', 'devices', 'byCategory', 'ct', 'zh'].join('|'))
  })

  it('/compare/mri-scanners prefetches mri devices with unified supabase key', async () => {
    await import('../../src/routes/compare/mri-scanners')
    const loader = captured['/compare/mri-scanners']?.loader
    expect(typeof loader).toBe('function')
    const qc = makeQC()
    const fakeCtx = { context: { queryClient: qc }, location: { pathname: '/compare/mri-scanners' } }
    await loader!(fakeCtx)
    const keys = qc.__calls.map((c) => c.key.join('|'))
    expect(keys).toContain(['supabase', 'devices', 'byCategory', 'mri', 'en'].join('|'))
  })

  it('/customers/$id prefetches detail with unified supabase key', async () => {
    await import('../../src/routes/customers.$id')
    const loader = captured['/customers/$id']?.loader
    expect(typeof loader).toBe('function')
    const qc = makeQC()
    const fakeCtx = { context: { queryClient: qc }, params: { id: 'first-affiliated' }, location: { pathname: '/zh/customers/first-affiliated' } }
    await loader!(fakeCtx)
    const keys = qc.__calls.map((c) => c.key.join('|'))
    expect(keys).toContain(['supabase', 'customers', 'bySlug', 'first-affiliated', 'zh'].join('|'))
  })

  it('/devices prefetches all devices with unified supabase key', async () => {
    await import('../../src/routes/devices')
    const loader = captured['/devices']?.loader
    expect(typeof loader).toBe('function')
    const qc = makeQC()
    const fakeCtx = { context: { queryClient: qc }, location: { pathname: '/devices' } }
    await loader!(fakeCtx)
    const keys = qc.__calls.map((c) => c.key.join('|'))
    expect(keys).toContain(['supabase', 'devices', 'all', 'en'].join('|'))
  })

  it('/devices/$category prefetches category devices with unified supabase key', async () => {
    await import('../../src/routes/devices.$category')
    const loader = captured['/devices/$category']?.loader
    expect(typeof loader).toBe('function')
    const qc = makeQC()
    const fakeCtx = { context: { queryClient: qc }, params: { category: 'ct-scanners' }, location: { pathname: '/zh/devices/ct-scanners' } }
    await loader!(fakeCtx)
    const keys = qc.__calls.map((c) => c.key.join('|'))
    expect(keys).toContain(['supabase', 'devices', 'byCategory', 'ct', 'zh'].join('|'))
  })

  it('/customers prefetches list with unified supabase key', async () => {
    await import('../../src/routes/customers')
    const loader = captured['/customers']?.loader
    expect(typeof loader).toBe('function')
    const qc = makeQC()
    const fakeCtx = { context: { queryClient: qc }, location: { pathname: '/zh/customers' } }
    await loader!(fakeCtx)
    const keys = qc.__calls.map((c) => c.key.join('|'))
    expect(keys).toContain(['supabase', 'customers', 'all', 'zh'].join('|'))
  })

  it('/history/$slug ensures content and prefetches list with markdown keys', async () => {
    await import('../../src/routes/history.$slug')
    const loader = captured['/history/$slug']?.loader
    expect(typeof loader).toBe('function')
    const qc = makeQC()
    const fakeCtx = { context: { queryClient: qc }, params: { slug: 'ct-scanner-history' }, location: { pathname: '/history/ct-scanner-history' } }
    await loader!(fakeCtx)
    const keys = qc.__calls.map((c) => c.key.join('|'))
    expect(keys).toContain(['markdown', 'history', 'ct-scanner-history', 'en'].join('|'))
    expect(keys).toContain(['markdown', 'history', 'list', 'en'].join('|'))
  })

  it('/blog prefetches list with unified supabase key', async () => {
    await import('../../src/routes/blog')
    const loader = captured['/blog']?.loader
    expect(typeof loader).toBe('function')
    const qc = makeQC()
    const fakeCtx = { context: { queryClient: qc }, location: { pathname: '/blog' } }
    await loader!(fakeCtx)
    const keys = qc.__calls.map((c) => c.key.join('|'))
    expect(keys).toContain(['supabase', 'articles', 'all', 'en'].join('|'))
  })
})
