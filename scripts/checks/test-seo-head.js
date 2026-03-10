// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.386Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
// SEO head check using Puppeteer on dev server
// Checks canonical and hreflang on several routes
import puppeteer from 'puppeteer';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

const assert = (cond, msg) => {
  if (!cond) throw new Error(msg);
};

const getHeadHtml = async (page) => {
  return await page.evaluate(() => document.head.innerHTML);
};

const checkCanonicalAndAlternate = async (page, path, expectedCanonical, expectedAlternate) => {
  await page.goto(`${BASE_URL}${path}`, { waitUntil: 'networkidle0' });
  const headHtml = await getHeadHtml(page);
  assert(headHtml.includes(`rel="canonical"`), `Missing canonical for ${path}`);
  assert(headHtml.includes(`href="${expectedCanonical}"`), `Canonical mismatch for ${path}`);
  if (expectedAlternate) {
    const { href, hrefLang } = expectedAlternate;
    assert(headHtml.includes(`rel="alternate"`), `Missing alternate for ${path}`);
    assert(headHtml.includes(`hrefLang="${hrefLang}"`), `Missing alternate hreflang="${hrefLang}" for ${path}`);
    assert(headHtml.includes(`href="${href}"`), `Alternate href mismatch for ${path}`);
  }
};

const run = async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  try {
    await checkCanonicalAndAlternate(page, '/', 'https://chinactscanner.org/', { href: 'https://chinactscanner.org/zh/', hrefLang: 'zh' });
    await checkCanonicalAndAlternate(page, '/zh/', 'https://chinactscanner.org/zh/', { href: 'https://chinactscanner.org/', hrefLang: 'en' });
    await checkCanonicalAndAlternate(page, '/reports/expert', 'https://chinactscanner.org/reports/expert');
    await checkCanonicalAndAlternate(page, '/reports/premium', 'https://chinactscanner.org/premium-reports');
    console.log('[test:seo-head] OK');
    await browser.close();
    process.exit(0);
  } catch (e) {
    console.error('[test:seo-head] FAILED:', e.message);
    await browser.close();
    process.exit(1);
  }
};

run();
