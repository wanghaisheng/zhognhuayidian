import { describe, it, expect } from 'vitest';
import { getLanguageFromPath, addLanguagePrefix, removeLanguagePrefix, getAlternateLanguagePaths } from '@/utils/multilingualRoutes';

describe('multilingualRoutes helpers', () => {
  it('detects language from path', () => {
    expect(getLanguageFromPath('/')).toBe('en');
    expect(getLanguageFromPath('/devices')).toBe('en');
    expect(getLanguageFromPath('/zh/')).toBe('zh');
    expect(getLanguageFromPath('/zh/devices')).toBe('zh');
  });

  it('adds/removes language prefix correctly', () => {
    expect(addLanguagePrefix('/', 'en')).toBe('/');
    expect(addLanguagePrefix('/', 'zh')).toBe('/zh');
    expect(addLanguagePrefix('/devices', 'en')).toBe('/devices');
    expect(addLanguagePrefix('/devices', 'zh')).toBe('/zh/devices');

    expect(removeLanguagePrefix('/zh')).toBe('/');
    expect(removeLanguagePrefix('/zh/')).toBe('/');
    expect(removeLanguagePrefix('/zh/devices')).toBe('/devices');
    expect(removeLanguagePrefix('/devices')).toBe('/devices');
  });

  it('provides alternate language paths', () => {
    const altsRoot = getAlternateLanguagePaths('/');
    expect(altsRoot.en).toBe('/');
    expect(altsRoot.zh).toBe('/zh');

    const altsDevices = getAlternateLanguagePaths('/devices');
    expect(altsDevices.en).toBe('/devices');
    expect(altsDevices.zh).toBe('/zh/devices');
  });
});
