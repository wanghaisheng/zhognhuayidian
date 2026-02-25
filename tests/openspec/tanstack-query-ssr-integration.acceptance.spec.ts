import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '..', '..');

describe('openspec tanstack-query-ssr-integration 验收', () => {
  it('已接入官方 Query SSR 集成包', () => {
    const pkg = JSON.parse(readFileSync(path.join(repoRoot, 'package.json'), 'utf-8')) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
    expect(deps['@tanstack/react-router-ssr-query']).toBeDefined();
  });

  it('入口已使用 Query SSR 集成渲染流程', () => {
    const entryServer = readFileSync(path.join(repoRoot, 'src', 'entry-server.tsx'), 'utf-8');
    const entryClient = readFileSync(path.join(repoRoot, 'src', 'entry-client.tsx'), 'utf-8');
    const routerCreate = readFileSync(path.join(repoRoot, 'src', 'router.create.tsx'), 'utf-8');
    const combined = `${entryServer}\n${entryClient}\n${routerCreate}`;
    expect(combined).toMatch(/react-router-ssr-query/);
  });
});
