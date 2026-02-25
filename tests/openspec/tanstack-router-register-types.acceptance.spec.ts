import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '..', '..');

describe('openspec tanstack-router-register-types 验收', () => {
  it('Register 类型与 createAppRouter 返回类型对齐', () => {
    const routerFile = readFileSync(path.join(repoRoot, 'src', 'router.tsx'), 'utf-8');
    expect(routerFile).toMatch(/createAppRouter/);
    expect(routerFile).toMatch(/ReturnType<typeof\s+createAppRouter>/);
  });
});
