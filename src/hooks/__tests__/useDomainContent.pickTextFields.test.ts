import { describe, it, expect } from 'vitest';
import { pickTextFields } from '../useDomainContent';

describe('pickTextFields', () => {
  it('prefers DB title over frontmatter title', () => {
    const result = pickTextFields({
      dbTitle: 'DB Device',
      fmTitle: 'FM Title',
    });
    expect(result.title).toBe('DB Device');
  });

  it('falls back to frontmatter title when DB title missing', () => {
    const result = pickTextFields({
      fmTitle: 'FM Title',
    });
    expect(result.title).toBe('FM Title');
  });

  it('title empty when neither provided', () => {
    const result = pickTextFields({});
    expect(result.title).toBe('');
  });

  it('prefers DB description over frontmatter description', () => {
    const result = pickTextFields({
      dbDescription: 'DB Description',
      fmDescription: 'FM Description',
    });
    expect(result.description).toBe('DB Description');
  });

  it('falls back to frontmatter description when DB description missing', () => {
    const result = pickTextFields({
      fmDescription: 'FM Description',
    });
    expect(result.description).toBe('FM Description');
  });

  it('description empty when neither provided', () => {
    const result = pickTextFields({});
    expect(result.description).toBe('');
  });

  it('keeps excerpt when provided', () => {
    const result = pickTextFields({
      excerpt: 'Short summary',
    });
    expect(result.excerpt).toBe('Short summary');
  });
}
)
