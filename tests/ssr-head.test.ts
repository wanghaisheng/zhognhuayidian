import { describe, it, expect } from 'vitest';
import { render } from '../src/entry-server';

const extract = (html: string, rel: string) => {
  const re = new RegExp(`<link[^>]+rel=["']${rel}["'][^>]*href=["']([^"']+)["']`, 'i');
  const m = html.match(re);
  return m ? m[1] : null;
};

describe('SSR head canonical/hreflang', () => {
  it('generates canonical and alternates for "/"', async () => {
    const { headHtml } = await render('/', '');
    const canonical = extract(headHtml, 'canonical');
    expect(canonical).toBe('https://chinactscanner.org');
    // en should have zh alternate (accept hreflang/hrefLang and optional trailing slash)
    const zhAlt = /rel="alternate"/i.test(headHtml)
      && /href(lang|hreflang)="zh"/i.test(headHtml)
      && /href="https:\/\/chinactscanner\.org\/zh\/?"/i.test(headHtml);
    expect(zhAlt).toBe(true);
  });

  it('generates canonical and alternates for "/zh/"', async () => {
    const { headHtml } = await render('/zh/', '');
    const canonical = extract(headHtml, 'canonical');
    expect(canonical).toBe('https://chinactscanner.org/zh');
    // zh should have en alternate (accept hreflang/hrefLang and optional trailing slash)
    const enAlt = /rel="alternate"/i.test(headHtml)
      && /href(lang|hreflang)="en"/i.test(headHtml)
      && /href="https:\/\/chinactscanner\.org\/?"/i.test(headHtml);
    expect(enAlt).toBe(true);
  });

  it('generates canonical for simple child routes using root fallback', async () => {
    const { headHtml } = await render('/reports/expert', '');
    const canonical = extract(headHtml, 'canonical');
    expect(canonical).toBe('https://chinactscanner.org/reports/expert');
  });
});
