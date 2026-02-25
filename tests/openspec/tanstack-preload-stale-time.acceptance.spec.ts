import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '..', '..');

describe('openspec tanstack-preload-stale-time 验收', () => {
  it('Router 预加载新鲜度已设置为 0', () => {
    const routerCreate = readFileSync(path.join(repoRoot, 'src', 'router.create.tsx'), 'utf-8');
    expect(routerCreate).toMatch(/defaultPreloadStaleTime\s*:\s*0/);
  });
});
