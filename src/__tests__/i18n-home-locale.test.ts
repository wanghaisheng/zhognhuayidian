import { describe, it, expect, vi } from 'vitest';

// Helper to import i18n with a controlled window.location
const importI18nWithPath = async (pathname: string) => {
  Object.defineProperty(window, 'location', {
    value: { pathname },
    writable: true,
  });
  Object.defineProperty(window, '__TANSTACK_ROUTER_CONTEXT__', {
    value: undefined,
    writable: true,
  });
  vi.resetModules();
  const mod = await import('@/lib/i18n');
  return mod.default;
};

describe('i18n locale initialization based on URL prefix (home)', () => {
  it('initializes English on "/" and returns English home hero title', async () => {
    const i18n = await importI18nWithPath('/');
    expect(i18n.language).toBe('en');
    expect(i18n.t('home.hero.title')).toContain('Global Medical Imaging Equipment');
  }, 10000);

  it('initializes Chinese on "/zh/" and returns Chinese home hero title', async () => {
    const i18n = await importI18nWithPath('/zh/');
    expect(i18n.language).toBe('zh');
    expect(i18n.t('home.hero.title')).toContain('全球医学影像设备');
  }, 10000);
});
