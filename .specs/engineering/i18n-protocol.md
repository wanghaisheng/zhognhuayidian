# 🌐 Engineering Spec: i18n & Global Authority Protocol

**Objective:** To ensure true global reach where translation is not just UI replacement, but a synchronized SEO signal.

---

## 1. Core Architecture
*   **Engine**: `i18next` with `react-i18next`.
*   **Storage**: 
    *   `locales/en/[namespace].ts` (Source)
    *   `locales/zh/[namespace].ts` (Target)
*   **Routing**: All routes must be prefixed with `/$lang` (e.g., `/en/pricing`, `/zh/pricing`) to enable sub-directory SEO strategies.

## 2. SEO Signal Synchronization
We automatically generate the following tags to aggregate domain authority across languages:

*   **Hreflang Tags**:
    ```html
    <link rel="alternate" hreflang="en" href="https://site.com/en/page" />
    <link rel="alternate" hreflang="zh" href="https://site.com/zh/page" />
    ```
*   **X-Default**:
    ```html
    <link rel="alternate" hreflang="x-default" href="https://site.com/en/page" />
    ```
*   **HTML Lang Attribute**: `<html lang="en">` dynamically updates on route change.

## 3. The "Anti-Entropy" Quality Gate
To prevent "Translation Drift" (where keys exist in English but are missing in Chinese), we enforce strict CI/CD checks.

### The `check-i18n` Script
*   **Trigger**: Runs on `git push` and `npm run build`.
*   **Logic**:
    1.  Flattens the English JSON tree.
    2.  Compares every key against target languages.
    3.  **Fails Build** if:
        *   Key is missing in target.
        *   Value is empty string.
        *   Structure mismatch.

## 4. Implementation Rules for Developers
1.  **No Hardcoding**: Never write text directly in JSX.
    *   ❌ `<h1>Welcome</h1>`
    *   ✅ `<h1>{t('home.welcome')}</h1>`
2.  **Namespace Separation**: Group keys by feature (e.g., `nav`, `home`, `pricing`) to keep bundles small.
3.  **Dynamic URLs**: When linking, always helper functions to preserve current language or switch explicitly.
    *   `getLocalizedPath('/about')` -> `/en/about` or `/zh/about`

---
*Strategy: One Codebase, Many Voices, Unified Authority.*
