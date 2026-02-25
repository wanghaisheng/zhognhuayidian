import { describe, it, expect } from 'vitest';
import { pickTextFields } from '../useDomainContent';

function normalizeLangCode(lang?: string) {
  return (lang || 'en').split('-')[0];
}

describe('language normalization and text picking', () => {
  it('normalizes zh-CN to zh', () => {
    expect(normalizeLangCode('zh-CN')).toBe('zh');
  });
  it('normalizes en-US to en', () => {
    expect(normalizeLangCode('en-US')).toBe('en');
  });
  it('falls back to en when empty', () => {
    expect(normalizeLangCode('')).toBe('en');
    expect(normalizeLangCode(undefined)).toBe('en');
  });
  it('picks db title/description over frontmatter', () => {
    const { title, description } = pickTextFields({
      dbTitle: 'Database Title',
      dbDescription: 'Database Description',
      fmTitle: 'FM Title',
      fmDescription: 'FM Description',
    });
    expect(title).toBe('Database Title');
    expect(description).toBe('Database Description');
  });
  it('falls back to frontmatter when db missing', () => {
    const { title, description } = pickTextFields({
      fmTitle: 'FM Title',
      fmDescription: 'FM Description',
    });
    expect(title).toBe('FM Title');
    expect(description).toBe('FM Description');
  });
})
