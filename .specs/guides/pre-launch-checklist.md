# 🚀 Guide: Pre-Launch Checklist (The Final Gate)

**Objective:** Ensure the product is technically sound, SEO-ready, and legally compliant before the "Go Live" button is pressed.

---

## 0. GitHub Initial Setup (First Time Only)
- [ ] **Rename Directory**: Is the `github/` folder renamed to **`.github/`**?
- [ ] **Action Permissions**: Is `Settings > Actions > General > Workflow permissions` set to **"Read and write permissions"**?
- [ ] **Clean Sync Check**: Ensure no files or folders starting with `.` or `_` exist in the source directory (except the newly renamed `.github/`).

## 1. Technical SEO & Indexing
- [ ] **Sitemap Check**: Run `npm run build` and verify `dist/sitemap.xml` contains all active routes.
- [ ] **Robots.txt**: Ensure `robots.txt` points to the correct sitemap URL.
- [ ] **Canonical Tags**: Verify that `<link rel="canonical">` matches your production domain in `site.config.ts`.
- [ ] **Metadata Audit**: Run `node scripts/ai-seo-optimizer.mjs` to ensure TDK descriptions are high-density and GEO-optimized.

## 2. Infrastructure & Edge (MD-Clean Protocol)
- [ ] **redirects.md**: Confirm `public/redirects.md` exists (will be converted to `_redirects` by CI).
- [ ] **headers.md**: Confirm `public/headers.md` exists (will be converted to `_headers` by CI).
- [ ] **SSL/TLS**: Ensure Cloudflare "Always Use HTTPS" is enabled.

## 3. Analytics & Compliance
- [ ] **GA4 Measurement ID**: Update `site.config.ts` with your Google Analytics ID.
- [ ] **Microsoft Clarity**: Update `site.config.ts` with your Project ID.
- [ ] **Privacy Policy**: Ensure the `/privacy` route is populated and legal links in the footer are active.

## 4. Quality & i18n
- [ ] **i18n Integrity**: Run `npm run check-i18n` to ensure no empty translation keys or missing translations.
- [ ] **Language Toggle**: Verify the language switcher persists after refresh (localStorage check).
- [ ] **Broken Link Scan**: Run `npm run audit` to check for 404s and missing `alt` tags in the production build.
- [ ] **PWA Manifest**: Test the PWA install prompt in Chrome DevTools to ensure the manifest and service worker are linked.

---
*Success Metric: 100/100 Lighthouse + Successful Google Search Console validation.*
