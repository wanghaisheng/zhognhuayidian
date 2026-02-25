import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '..', '..');

describe('openspec tanstack-ssr-handler-migration 验收', () => {
  it('服务端入口使用标准 SSR handler', () => {
    const entryServer = readFileSync(path.join(repoRoot, 'src', 'entry-server.tsx'), 'utf-8');
    expect(entryServer).toMatch(/defaultRenderHandler|renderRouterToStream|defaultStreamHandler/);
  });
});
