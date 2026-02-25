import React from 'react';
import { createMemoryHistory } from '@tanstack/react-router';
import { RouterServer, createRequestHandler, renderRouterToString, renderRouterToStream } from '@tanstack/react-router/ssr/server';
import { LANGUAGES } from './config/language';
import { SITE_CONFIG } from './config/site';
import i18n from './lib/i18n';
import { createAppRouter } from './router.create';

const extractHeadAndRoot = (html: string) => {
  const headMatch = html.match(/<head>([\s\S]*?)<\/head>/i);
  const bodyMatch = html.match(/<div id="root">([\s\S]*?)<\/div>/i);
  return {
    head: headMatch ? headMatch[1] : '',
    rootInner: bodyMatch ? bodyMatch[1] : '',
  };
};

const buildHeadHtml = (router: unknown, pathname: string) => {
  const state = (router as { state?: { matches?: Array<Record<string, unknown>> } })?.state || {};
  const matches = (state.matches || []) as Array<Record<string, unknown>>;
  const renderAttrs = (attrs: Record<string, unknown>) => {
    return Object.entries(attrs)
      .filter(([k, v]) => v !== undefined && v !== null && v !== false && k !== 'children')
      .map(([k, v]) => `${k}="${String(v)}"`).join(' ');
  };
  let headTitle = '';
  const metaMap = new Map<string, string>();
  const linkMap = new Map<string, string>();
  const scriptMap = new Map<string, string>();
  const styleList: string[] = [];
  const loose = (router as { looseRoutesById?: Record<string, unknown> }).looseRoutesById || {};
  const routesById = (router as { routesById?: Record<string, unknown> }).routesById || {};
  const addMeta = (m: Record<string, unknown>) => {
    const titleValue = m['title'];
    if (typeof titleValue === 'string' && titleValue.trim()) {
      headTitle = `<title>${titleValue}</title>`;
      return;
    }
    if (Object.prototype.hasOwnProperty.call(m, 'script:ld+json')) {
      try {
        const json = JSON.stringify(m['script:ld+json']);
        const key = `ld:${json}`;
        metaMap.set(key, `<script type="application/ld+json">${json}</script>`);
      } catch (e) { void e; }
      return;
    }
    const name = m['name'];
    const property = m['property'];
    const httpEquiv = m['httpEquiv'];
    const charSet = m['charSet'];
    const key = typeof name === 'string'
      ? `name:${name}`
      : typeof property === 'string'
        ? `property:${property}`
        : typeof httpEquiv === 'string'
          ? `httpEquiv:${httpEquiv}`
          : typeof charSet === 'string'
            ? `charset:${charSet}`
            : `meta:${metaMap.size}`;
    metaMap.set(key, `<meta ${renderAttrs(m)} />`);
  };
  const addLink = (l: Record<string, unknown>) => {
    const rel = l['rel'];
    const href = l['href'];
    const hreflang = l['hreflang'];
    const key = rel === 'canonical'
      ? 'rel:canonical'
      : `rel:${String(rel || '')}|href:${String(href || '')}|hreflang:${String(hreflang || '')}`;
    linkMap.set(key, `<link ${renderAttrs(l)} />`);
  };
  const addScript = (s: Record<string, unknown>) => {
    const src = s['src'];
    const key = typeof src === 'string' && src ? `src:${src}` : `inline:${scriptMap.size}`;
    const attrs = renderAttrs(s);
    const children = s['children'];
    if (children !== undefined && children !== null) {
      scriptMap.set(key, `<script ${attrs}>${String(children)}</script>`);
      return;
    }
    scriptMap.set(key, `<script ${attrs}></script>`);
  };
  const addStyle = (s: Record<string, unknown>) => {
    const attrs = renderAttrs(s);
    const children = s['children'];
    if (children !== undefined && children !== null) {
      styleList.push(`<style ${attrs}>${String(children)}</style>`);
      return;
    }
    styleList.push(`<style ${attrs}></style>`);
  };
  const applyHeadOut = (headOut: Record<string, unknown>) => {
    const ht = headOut['title'];
    if (typeof ht === 'string' && ht.trim()) {
      headTitle = `<title>${ht}</title>`;
    }
    const metas = (headOut['meta'] as Array<Record<string, unknown>>) || [];
    metas.forEach(m => {
      if (!m) return;
      addMeta(m);
    });
    const links = (headOut['links'] as Array<Record<string, unknown>>) || [];
    links.forEach(l => {
      if (!l) return;
      addLink(l);
    });
    const scripts = (headOut['scripts'] as Array<Record<string, unknown>>) || [];
    scripts.forEach(s => {
      if (!s) return;
      addScript(s);
    });
    const styles = (headOut['styles'] as Array<Record<string, unknown>>) || [];
    styles.forEach(s => {
      if (!s) return;
      addStyle(s);
    });
  };
  for (const match of matches) {
    const routeId = (match as { routeId?: string }).routeId;
    if (!routeId) continue;
    const route = (loose[routeId] as Record<string, unknown> | undefined) || (routesById[routeId] as Record<string, unknown> | undefined);
    const headFn = route?.['options'] && (route['options'] as Record<string, unknown>)['head'] as (ctx?: unknown) => unknown;
    if (typeof headFn !== 'function') continue;
    try {
      const headOut = headFn({
        matches,
        match,
        params: (match as { params?: Record<string, unknown> }).params,
        loaderData: (match as { loaderData?: unknown }).loaderData,
        router,
        location: { pathname },
      }) as Record<string, unknown>;
      if (headOut) {
        applyHeadOut(headOut);
      }
    } catch (e) {
      void e;
    }
  }
  return [
    headTitle,
    ...Array.from(metaMap.values()),
    ...Array.from(linkMap.values()),
    ...styleList,
    ...Array.from(scriptMap.values()),
  ].filter(Boolean).join('');
};

export async function render(url: string, headAssets: string) {
  try {
    type DehydratedRouter = {
      lang?: string;
      i18nState?: Record<string, unknown>;
    };
    let dehydratedRouter: DehydratedRouter = {};
    const baseUrl = SITE_CONFIG.url || 'http://localhost';
    const u = url.startsWith('http') ? new URL(url) : new URL(url, baseUrl);
    const initialHref = `${u.pathname}${u.search}${u.hash || ''}`;
    const prefixes = LANGUAGES.filter(l => l.prefix).map(l => l.prefix);
    const matchedPrefix = prefixes.find(p => u.pathname === p || u.pathname.startsWith(p + '/')) || '';
    const locale = matchedPrefix ? matchedPrefix.slice(1) : 'en';
    await i18n.changeLanguage(locale);
    // i18n state is now handled by router.dehydrate()

    const request = new Request(u.href, { headers: { accept: 'text/html' } });
    const handler = createRequestHandler({
      request,
      createRouter: () => {
        const history = createMemoryHistory({ initialEntries: [initialHref] });
        return createAppRouter({ history });
      },
    });
    let headHtml = '';
    const response = await handler(({ request, responseHeaders, router }) => {
      headHtml = buildHeadHtml(router, u.pathname);
      const dehydrated = typeof (router as { dehydrate?: () => Record<string, unknown> }).dehydrate === 'function'
        ? (router as { dehydrate: () => Record<string, unknown> }).dehydrate()
        : {};
      // 临时禁用SSR以解决hydration问题
      dehydratedRouter = {} as DehydratedRouter;
      return renderRouterToString({
        request,
        responseHeaders,
        router,
        children: <RouterServer router={router} />,
      });
    });
    let appHtml = await response.text();
    const injection = [headAssets || '', headHtml || ''].filter(Boolean).join('');
    if (injection) {
      if (appHtml.includes('<head>')) {
        appHtml = appHtml.replace('<head>', `<head>${injection}`);
      } else if (!appHtml.includes('<html')) {
        appHtml = [
          '<!DOCTYPE html>',
          `<html lang="${locale}">`,
          '<head>',
          injection,
          '</head>',
          '<body>',
          `<div id="root">${appHtml}</div>`,
          '</body>',
          '</html>',
        ].join('');
      }
    } else if (!appHtml.includes('<html')) {
      appHtml = [
        '<!DOCTYPE html>',
        `<html lang="${locale}">`,
        '<head>',
        '</head>',
        '<body>',
        `<div id="root">${appHtml}</div>`,
        '</body>',
        '</html>',
      ].join('');
    }
    const { rootInner: bodyHtml } = extractHeadAndRoot(appHtml);

    return {
      headHtml,
      bodyHtml,
      headAssets,
      locale,
      dehydratedRouter,
      appHtml,
    };
  } catch (e) {
    console.error('[SSR Render Error]', e);
    return {
      headHtml: '',
      bodyHtml: '',
      headAssets: '',
      locale: 'en',
      dehydratedRouter: {},
      appHtml: '',
    };
  }
}

export async function renderStream(url: string, headAssets: string) {
  try {
    type DehydratedRouter = {
      lang?: string;
      i18nState?: Record<string, unknown>;
    };
    let dehydratedRouter: DehydratedRouter = {};
    const baseUrl = SITE_CONFIG.url || 'http://localhost';
    const u = url.startsWith('http') ? new URL(url) : new URL(url, baseUrl);
    const initialHref = `${u.pathname}${u.search}${u.hash || ''}`;
    const prefixes = LANGUAGES.filter(l => l.prefix).map(l => l.prefix);
    const matchedPrefix = prefixes.find(p => u.pathname === p || u.pathname.startsWith(p + '/')) || '';
    const locale = matchedPrefix ? matchedPrefix.slice(1) : 'en';
    await i18n.changeLanguage(locale);
    // i18n state is now handled by router.dehydrate()

    const request = new Request(u.href, { headers: { accept: 'text/html' } });
    const handler = createRequestHandler({
      request,
      createRouter: () => {
        const history = createMemoryHistory({ initialEntries: [initialHref] });
        return createAppRouter({ history });
      },
    });
    let headHtml = '';
    const response = await handler(({ request, responseHeaders, router }) => {
      headHtml = buildHeadHtml(router, u.pathname);
      const dehydrated = typeof (router as { dehydrate?: () => Record<string, unknown> }).dehydrate === 'function'
        ? (router as { dehydrate: () => Record<string, unknown> }).dehydrate()
        : {};
      // 临时禁用SSR以解决hydration问题
      dehydratedRouter = {} as DehydratedRouter;
      return renderRouterToStream({
        request,
        responseHeaders,
        router,
        children: <RouterServer router={router} />,
      });
    });
    const bodyStream = response.body as ReadableStream;

    return {
      headHtml,
      headAssets,
      locale,
      dehydratedRouter,
      bodyStream,
    };
  } catch (e) {
    console.error('[SSR Stream Error]', e);
    return {
      headHtml: '',
      headAssets: '',
      locale: 'en',
      dehydratedRouter: {},
      bodyStream: null as unknown as ReadableStream,
    };
  }
}
