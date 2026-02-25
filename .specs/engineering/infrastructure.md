# 🏗️ Engineering Spec: Infrastructure & Deployment

**Target Runtime:** Cloudflare Pages (Static/Edge).

## 1. The MD-Clean Protocol
**Context:** Sandbox environments often hide dotfiles (`.env`, `.gitignore`) or treat them as system files.
**Rule:** We store configuration as **Markdown** in `public/` and transform them at build time.

| Source (Dev) | Destination (Prod) | Purpose |
| :--- | :--- | :--- |
| `public/headers.md` | `_headers` | Security headers & Caching rules. |
| `public/redirects.md` | `_redirects` | SPA Routing (`/* /index.html 200`). |
| `public/env.md` | `.env` | Environment variables (if needed). |

## 2. Build Pipeline (`vite.config.ts`)
*   **HTML Sanitization**: We use a custom Vite plugin to strip `importmap` and CDN scripts during `vite build`.
*   **Reason**: Cloudflare Pages expects a bundled asset, not runtime CDN dependencies.

## 3. GitHub Actions Integration
*   **Directory**: Workflows live in `.github/workflows`.
*   **Permissions**: The repository must have "Read and write permissions" enabled for Actions to allow auto-generation of `sitemap.xml` and `llms.txt`.

## 4. Environment Variables
*   **VITE_GA_ID**: Google Analytics 4 ID.
*   **VITE_CLARITY_ID**: Microsoft Clarity ID.
*   **API_KEY**: Google Gemini API Key (for AI features).
