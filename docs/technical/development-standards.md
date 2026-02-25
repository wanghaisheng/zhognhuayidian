# Development Standards & Technical Requirements

This document outlines the technical standards, coding requirements, and architectural decisions for the CT Scanner Compass project. It reflects the latest fixes and improvements aimed at ensuring type safety, SEO performance, and maintainability.

## 1. TypeScript & Type Safety

We enforce strict TypeScript standards to prevent runtime errors and ensure code quality.

### 1.1 No Implicit Any
*   **Rule**: The `noImplicitAny` compiler option is effectively enforced.
*   **Requirement**: Do not use the `any` type.
    *   **Bad**: `function processData(data: any) { ... }`
    *   **Good**: `function processData(data: unknown) { ... }` (then use type narrowing) or `function processData(data: DataInterface) { ... }`
*   **Exception**: If an external library has incorrect types, use `as unknown as TargetType` with a comment explaining why.
*   **Validation**: Run `npm run check:syntax` before committing to verify zero errors.

### 1.2 Strict Type Casting
*   **Rule**: Avoid `@ts-ignore`.
*   **Requirement**: Use type assertions `as` or type guards.
    *   **Example**: `(CONSTANT as readonly string[]).includes(value)` ensures type safety for array inclusions.
*   **Constants**: Use `as const` for configuration objects to prevent type widening.

## 2. SEO & Rendering Architecture

To solve client-side rendering issues (crawlers seeing empty HTML), we use a Static Site Generation (SSG) approach.

### 2.1 Static Site Generation (SSG)
*   **Mechanism**: We use Puppeteer to prerender static HTML files after the Vite build.
*   **Build Command**: Always use `npm run build` which runs `vite build && npm run prerender`.
*   **Output**: The `dist` folder will contain fully rendered HTML files with H1 tags and content visible to crawlers.

### 2.2 Semantic HTML
*   **Heading Structure**: Use the `<Heading level={n}>` component instead of raw `<h1>`-`<h6>` tags.
    *   Ensures consistent styling and semantic hierarchy.
    *   **Requirement**: Each page must have exactly one `<Heading level={1}>`.

### 2.3 Metadata
*   **Component**: Use `<SEOHead>` in every page component.
*   **Keywords**: Do **not** use the `keywords` meta tag (deprecated/spam signal).
*   **Canonical URLs**: The `<SEOHead>` component automatically generates `rel="canonical"` links. Ensure `SITE_CONFIG.url` is correctly set.

## 3. Internationalization (i18n) Strategy

We follow an "Adobe-style" approach that respects user choice rather than forcing redirects.

### 3.1 URL Structure
*   **English (Default)**: Served at root `/`. Do not use `/en` prefix.
*   **Chinese**: Served at `/zh`.
*   **Redirects**: Old `/en` URLs should redirect to `/` (handled by `LanguageRouteProvider`).

### 3.2 Language Detection
*   **Rule**: Do **not** automatically redirect based on `navigator.language` (browser settings).
*   **Logic**:
    1. Check URL path (e.g., `/zh` -> Chinese).
    2. Check LocalStorage (user preference).
    3. Default to English (Root).
*   **User Interface**: Use `LanguageSelectorModal` for explicit user selection (Adobe-style region grouping).

## 4. Data Management

### 4.1 Single Source of Truth
*   **Location**: `src/locales/{lang}/data` is the authoritative source for domain data (devices, manufacturers).
*   **Migration**: "Core" data files (`src/data/production`) should be merged into locale files to prevent synchronization issues.
*   **Access**: Use `dataManager` or specific hooks (`useSupabaseData`) to access data.

### 4.2 Runtime Merging
*   **Pattern**: Use `deepMerge` utilities to overlay translations onto base data structures.

## 5. Development Workflow

### 5.1 Verification Scripts
Run these scripts to ensure quality before pushing:
*   `npm run check:syntax`: Checks for TypeScript errors and ESLint issues.
*   `npm run i18n:check`: Verifies translation key integrity.
