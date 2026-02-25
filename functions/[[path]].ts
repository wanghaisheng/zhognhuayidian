
import { HEAD_ASSETS } from './head-assets';
import { SSR_PATHS as IMPORTED_SSR_PATHS } from './ssr-paths';

export const onRequest = async (context) => {
  const url = new URL(context.request.url);
  const normalize = (p) => {
    if (!p) return '/';
    let x = p.replace(/\/{2,}/g, '/');
    if (x.length > 1 && x.endsWith('/')) x = x.slice(0, -1);
    return x;
  };
  const pathname = normalize(url.pathname);
  const accept = context.request.headers.get('accept') || '';
  const method = context.request.method || 'GET';
  const qs = url.searchParams;
  const startedAt = Date.now();
  const log = (event, extra = {}) => {
    try {
      console.log(JSON.stringify({ event, path: pathname, method, ...extra }));
    } catch (e) { void e; }
  };
  if (qs && qs.get('csr') === '1') {
    const html = '<!doctype html><html><head><meta charset="utf-8"><title>CSR Safe</title></head><body><h1>CSR Safe</h1><p>Static layer reachable.</p></body></html>';
    return new Response(html, { headers: { 'Content-Type': 'text/html' } });
  }
  
  // Toggle SSR gate for non-health routes (set to false to enable SSR)
  if (pathname !== '/_health') {
    const TEMP_DISABLE_SSR = false;
    if (TEMP_DISABLE_SSR) {
      return context.next();
    }
  }
  
  if (pathname === '/_health') {
    return new Response('ok', { headers: { 'Content-Type': 'text/plain' } });
  }
  

  
  // Static files are served by Pages (has extension or non-HTML Accept)
  const hasExt = (p) => /\/[^/]+\.[^/]+$/.test(p);
  const acceptsHtml = (a) => /\btext\/html\b/i.test(a);
  const isStaticPath = (p) =>
    p.startsWith('/assets/') ||
    p.startsWith('/images/') ||
    p.startsWith('/fonts/') ||
    p.startsWith('/icons/') ||
    p === '/favicon.ico' ||
    p === '/robots.txt' ||
    p === '/sitemap.xml' ||
    p === '/site.webmanifest' ||
    p === '/ads.txt';
  
  if (method !== 'GET' || hasExt(pathname) || isStaticPath(pathname) || !acceptsHtml(accept)) {
    return context.next();
  }
  
  // Gate SSR by prerender-routes.json to avoid unexpected SSR on unsupported paths
  const PATHS = IMPORTED_SSR_PATHS as Set<string>;
  if (!PATHS || PATHS.size === 0) {
    log('bypass', { reason: 'empty-ssr-paths' });
    return context.next();
  }
  const matchesPath = (p) => {
    if (PATHS.has(p)) return true;
    if (p !== '/' && PATHS.has(p + '/')) return true;
    if (p.endsWith('/') && PATHS.has(p.replace(/\/+$/, ''))) return true;
    return false;
  };
  if (!matchesPath(pathname)) {
    log('bypass', { reason: 'not-ssr-path' });
    return context.next();
  }

  // Dynamically import the server bundle and gracefully fall back to static if unavailable
  let renderFn: ((url: string, headAssets: string) => Promise<{ appHtml: string; dehydratedRouter: Record<string, unknown> }>) | null = null;
  let renderStreamFn: ((url: string, headAssets: string) => Promise<{ headHtml: string; headAssets: string; locale: string; dehydratedRouter: Record<string, unknown>; bodyStream: ReadableStream }>) | null = null;
  try {
    const mod: unknown = await import('../dist/server/entry-server.js');
    const renderExport = (mod as { render?: (u: string, h: string) => Promise<{ appHtml: string; dehydratedRouter: Record<string, unknown> }> }).render;
    const renderStreamExport = (mod as { renderStream?: (u: string, h: string) => Promise<{ headHtml: string; headAssets: string; locale: string; dehydratedRouter: Record<string, unknown>; bodyStream: ReadableStream }> }).renderStream;
    renderFn = renderExport || null;
    renderStreamFn = renderStreamExport || null;
  } catch (e) {
    console.error('SSR Import Error:', e, 'Pathname:', pathname);
    return context.next();
  }
  if (typeof renderFn !== 'function' && typeof renderStreamFn !== 'function') {
    console.error('SSR render function not found in server bundle. Pathname:', pathname);
    return context.next();
  }

  try {
    const useStream = context?.env?.STREAMING_SSR === '1' && typeof renderStreamFn === 'function';
    if (useStream) {
      const { headHtml, dehydratedRouter, locale, bodyStream } = await renderStreamFn!(url.href, HEAD_ASSETS);
      const prefix = [
        '<!DOCTYPE html>',
        `<html lang="${locale}">`,
        '<head>',
        HEAD_ASSETS || '',
        headHtml || '',
        '</head>',
        '<body>',
        '<div id="root">',
      ].join('');
      const suffix = [
        '</div>',
        `<script>window.__TANSTACK_ROUTER_CONTEXT__ = ${JSON.stringify(dehydratedRouter)}</script>`,
        '</body>',
        '</html>',
      ].join('');
      const encoder = new TextEncoder();
      const combined = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(prefix));
          const reader = bodyStream.getReader();
          const pump = () => reader.read().then(({ done, value }) => {
            if (done) {
              controller.enqueue(encoder.encode(suffix));
              controller.close();
              return;
            }
            controller.enqueue(value);
            return pump();
          });
          return pump();
        }
      });
      const hasQueryParams = (() => {
        try { return qs && Array.from(qs.keys()).length > 0; } catch (_) { return false; }
      })();
      const sMax = hasQueryParams
        ? 0
        : (pathname.startsWith('/glossary/')
            ? 1800
            : pathname.startsWith('/technology/')
              ? 1800
              : pathname.startsWith('/stats/')
                ? 1800
                : pathname.startsWith('/reports/')
                  ? 1800
                  : pathname === '/glossary' || pathname === '/technology' || pathname === '/stats' || pathname === '/reports'
                    ? 1200
                    : (pathname === '/' || pathname.startsWith('/learn') || pathname.startsWith('/blog'))
                      ? 600
                      : 120);
      const res = new Response(combined, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': `public, max-age=0, s-maxage=${sMax}`,
          'Vary': 'Accept'
        }
      });
      log('hit', { ms: Date.now() - startedAt, mode: 'stream' });
      return res;
    } else {
      const { appHtml, dehydratedRouter } = await renderFn!(url.href, HEAD_ASSETS);
      let html = appHtml;
      const dehydratedScript = `<script>window.__TANSTACK_ROUTER_CONTEXT__ = ${JSON.stringify(dehydratedRouter)}</script>`;
      if (html.includes('</body>')) {
        html = html.replace('</body>', `${dehydratedScript}</body>`);
      } else {
        html += dehydratedScript;
      }
      const hasQueryParams = (() => {
        try { return qs && Array.from(qs.keys()).length > 0; } catch (_) { return false; }
      })();
      const sMax = hasQueryParams
        ? 0
        : (pathname.startsWith('/glossary/')
            ? 1800
            : pathname.startsWith('/technology/')
              ? 1800
              : pathname.startsWith('/stats/')
                ? 1800
                : pathname.startsWith('/reports/')
                  ? 1800
                  : pathname === '/glossary' || pathname === '/technology' || pathname === '/stats' || pathname === '/reports'
                    ? 1200
                    : (pathname === '/' || pathname.startsWith('/learn') || pathname.startsWith('/blog'))
                      ? 600
                      : 120);
      const res = new Response(html, {
        headers: { 
          'Content-Type': 'text/html',
          'Cache-Control': `public, max-age=0, s-maxage=${sMax}`,
          'Vary': 'Accept'
        },
      });
      log('hit', { ms: Date.now() - startedAt, mode: 'string' });
      return res;
    }
  } catch (e) {
    log('error', { stage: 'render', message: String(e?.message || e) });
    return context.next();
  }
};
