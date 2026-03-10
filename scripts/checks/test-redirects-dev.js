// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.385Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
// Dev redirect checks using Puppeteer
// Navigate to legacy paths and assert we end up at the new location (pathname)
import puppeteer from 'puppeteer';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

const redirects = [
  { from: '/analysis', to: '/reports' },
  { from: '/analysis/market', to: '/reports/market' },
  { from: '/analysis/expert', to: '/reports/expert' },
  { from: '/manufacturers-old', to: '/manufacturers' },
  { from: '/manufacturers-old/foo', to: '/manufacturers' },
  { from: '/ct-scanner', to: '/devices/ct-scanners' },
  { from: '/mri-scanner', to: '/devices/mri-scanners' },
  { from: '/ct-manufacturers', to: '/manufacturers', search: { category: 'ct' } },
  { from: '/china-ct-manufacturers', to: '/manufacturers', search: { country: 'china', category: 'ct' } },
  { from: '/mri-manufacturers', to: '/manufacturers', search: { category: 'mri' } },
  { from: '/china-mri-manufacturers', to: '/manufacturers', search: { country: 'china', category: 'mri' } },
  { from: '/brands', to: '/manufacturers' },
  { from: '/brands/abc', to: '/manufacturers' },
  { from: '/tags', to: '/devices' },
  { from: '/guides', to: '/resources' },
  { from: '/knowledge', to: '/resources' },
  { from: '/knowledge/history', to: '/history' },
  { from: '/knowledge/technology', to: '/resources/technology' },
];

const buildSearch = (obj) => {
  if (!obj) return '';
  const usp = new URLSearchParams(obj);
  const s = usp.toString();
  return s ? `?${s}` : '';
};

const run = async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  try {
    for (const r of redirects) {
      const url = `${BASE_URL}${r.from}`;
      await page.goto(url, { waitUntil: 'networkidle0' });
      const pathname = new URL(page.url()).pathname;
      const search = new URL(page.url()).search;
      const expectedPath = r.to;
      const expectedSearch = buildSearch(r.search);
      if (pathname !== expectedPath || search !== expectedSearch) {
        throw new Error(`Redirect mismatch for ${r.from}: got "${pathname}${search}" expected "${expectedPath}${expectedSearch}"`);
      }
    }
    console.log('[test:redirects-dev] OK');
    await browser.close();
    process.exit(0);
  } catch (e) {
    console.error('[test:redirects-dev] FAILED:', e.message);
    await browser.close();
    process.exit(1);
  }
};

run();
