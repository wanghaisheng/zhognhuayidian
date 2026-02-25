import { describe, it, expect } from 'vitest';
import { markdownContentManager } from '../markdown';

describe('MarkdownContentManager locale fallback', () => {
  it('falls back to English when zh content missing', async () => {
    const slug = 'frontmatter-notes-example';
    const contentFallback = await markdownContentManager.getContent('devices', slug, 'fr');
    expect(contentFallback).toBeTruthy();
    expect(contentFallback?.frontMatter.slug).toBe(slug);
    expect(contentFallback?.frontMatter.title).toContain('Example Device Notes');
  });
});
