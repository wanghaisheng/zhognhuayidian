import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '..', '..');

describe('openspec tanstack-i18n-ssr-state 验收', () => {
  it('服务端注入 i18n 状态', () => {
    const entryServer = readFileSync(path.join(repoRoot, 'src', 'entry-server.tsx'), 'utf-8');
    expect(entryServer).toMatch(/i18nState/);
  });

  it('客户端复水 i18n 状态', () => {
    const entryClient = readFileSync(path.join(repoRoot, 'src', 'entry-client.tsx'), 'utf-8');
    const routerCreate = readFileSync(path.join(repoRoot, 'src', 'router.create.tsx'), 'utf-8');
    // entry-client 应该调用 router.hydrate
    expect(entryClient).toMatch(/hydrate\(ctx\)/);
    // router.create 应该包含 hydrate 逻辑处理 i18nState
    expect(routerCreate).toMatch(/i18nState/);
  });
});
