// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.384Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
// Locale rendering test for Home page using Puppeteer and Vite dev server (port 8080)
// Checks: documentElement.lang and key text content for '/' (en) and '/zh/' (zh)
import puppeteer from 'puppeteer';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

const checkPage = async (page, path, expectedLang, expectedTextSnippets) => {
  await page.goto(`${BASE_URL}${path}`, { waitUntil: 'networkidle0' });
  const lang = await page.evaluate(() => document.documentElement.lang);
  assert(lang === expectedLang, `Expected document.lang "${expectedLang}" for path "${path}", got "${lang}"`);
  
  const content = await page.content();
  for (const snippet of expectedTextSnippets) {
    assert(
      content.includes(snippet),
      `Expected to find text "${snippet}" in rendered HTML for path "${path}"`
    );
  }
};

const run = async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  try {
    // EN: no prefix
    await checkPage(page, '/', 'en', [
      'Global Medical Imaging Equipment',
      'China CT Scanner'
    ]);

    // ZH: /zh prefix
    await checkPage(page, '/zh/', 'zh', [
      '全球医学影像设备',
      '中国CT扫描仪网'
    ]);

    console.log('[test:locale-home] OK: locale load/render verified for "/" and "/zh/"');
    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('[test:locale-home] FAILED:', err.message);
    await browser.close();
    process.exit(1);
  }
};

run();
