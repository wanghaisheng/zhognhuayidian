import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '..', '..');

const normalizePath = (value: string) => {
  if (!value) return '/';
  let normalized = value.replace(/\/{2,}/g, '/');
  if (normalized.length > 1 && normalized.endsWith('/')) normalized = normalized.slice(0, -1);
  return normalized;
};

const readJsonArray = (filePath: string) => {
  const raw = readFileSync(filePath, 'utf-8');
  const parsed = JSON.parse(raw) as string[];
  return parsed.map(normalizePath);
};

const readSsrPaths = (filePath: string) => {
  const raw = readFileSync(filePath, 'utf-8');
  const match = raw.match(/new Set\((\[[\s\S]*\])\)/);
  if (!match) throw new Error('SSR_PATHS 未找到');
  const parsed = JSON.parse(match[1]) as string[];
  return parsed.map(normalizePath);
};

const setDiff = (left: string[], right: string[]) => {
  const rightSet = new Set(right);
  return Array.from(new Set(left)).filter((value) => !rightSet.has(value));
};

describe('openspec tanstack-optimizations 验收', () => {
  it('SSR 白名单与 prerender 路由清单一致', () => {
    const prerenderRoutes = readJsonArray(path.join(repoRoot, 'prerender-routes.json'));
    const ssrPaths = readSsrPaths(path.join(repoRoot, 'functions', 'ssr-paths.ts'));
    const missingInSsr = setDiff(prerenderRoutes, ssrPaths);
    const missingInPrerender = setDiff(ssrPaths, prerenderRoutes);
    expect(missingInSsr).toEqual([]);
    expect(missingInPrerender).toEqual([]);
  });

  it('SSR 入口对静态资源与非 HTML 请求绕行', () => {
    const entry = readFileSync(path.join(repoRoot, 'functions', '[[path]].ts'), 'utf-8');
    const requiredMarkers = [
      'IMPORTED_SSR_PATHS',
      'acceptsHtml',
      'method !== \'GET\'',
      "p.startsWith('/assets/')",
      "p.startsWith('/images/')",
      "p.startsWith('/fonts/')",
      "p.startsWith('/icons/')",
      "p === '/favicon.ico'",
      "p === '/robots.txt'",
      "p === '/sitemap.xml'",
      "p === '/site.webmanifest'",
      "p === '/ads.txt'",
      '!acceptsHtml',
    ];
    const missingMarkers = requiredMarkers.filter((marker) => !entry.includes(marker));
    expect(missingMarkers).toEqual([]);
  });

  it('SSR 入口对白名单外路径回退到静态层', () => {
    const entry = readFileSync(path.join(repoRoot, 'functions', '[[path]].ts'), 'utf-8');
    const requiredMarkers = [
      'not-ssr-path',
      'matchesPath',
      'context.next()',
    ];
    const missingMarkers = requiredMarkers.filter((marker) => !entry.includes(marker));
    expect(missingMarkers).toEqual([]);
  });
});
