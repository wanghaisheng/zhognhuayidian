# Development Standards & Technical Requirements

This document outlines technical standards, coding requirements, and architectural decisions for the 中华医典 (Zhonghua Yidian) TCM Platform. It reflects the latest v1.7.0 improvements including scripts organization and development workflow optimization.

## 1. TypeScript & Type Safety

We enforce strict TypeScript standards to prevent runtime errors and ensure code quality.

### 1.1 No Implicit Any
*   **Rule**: The `noImplicitAny` compiler option is effectively enforced.
*   **Requirement**: Do not use `any` type.
    *   **Bad**: `function processData(data: any) { ... }`
    *   **Good**: `function processData(data: unknown) { ... }` (then use type narrowing) or `function processData(data: DataInterface) { ... }`
*   **Exception**: If an external library has incorrect types, use `as unknown as TargetType` with a comment explaining why.
*   **Validation**: Run `npm run check:syntax` before committing to verify zero errors.

## 2. SEO & Rendering Architecture

To solve client-side rendering issues (crawlers seeing empty HTML), we use a Static Site Generation (SSG) approach.

### 2.1 Static Site Generation (SSG)
*   **Mechanism**: We use Puppeteer to prerender static HTML files after Vite build.
*   **Build Command**: Always use `npm run build` which runs the complete build pipeline including scripts organization.
*   **Output**: The `dist` folder will contain fully rendered HTML files with H1 tags and content visible to crawlers.

### 2.2 Semantic HTML
*   **Heading Structure**: Use `<Heading level={n}>` component instead of raw `<h1>`-`<h6>` tags.
    *   Ensures consistent styling and semantic hierarchy.
    *   **Requirement**: Each page must have exactly one `<Heading level={1}>`.

### 2.3 Metadata
*   **Component**: Use `<SEOHead>` in every page component.
*   **Keywords**: Do **not** use `keywords` meta tag (deprecated/spam signal).
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

## 4. Scripts Organization & Development Workflow

### 4.1 Scripts Directory Structure
The `scripts/` directory is organized into 10 logical categories for better maintainability:

```
scripts/
├── data/          # Data processing and generation (14 scripts)
├── checks/        # Validation and verification (24 scripts)
├── fixes/         # Bug fixes and corrections (25 scripts)
├── build/         # Build and generation (16 scripts)
├── migration/     # Data migration (8 scripts)
├── i18n/         # Internationalization (12 scripts)
├── seo/          # SEO optimization (1 script)
├── tools/        # Utilities and tools (23 scripts)
├── docs/         # Documentation and reports (4 files)
└── scripts/      # Script management (14 files)
```

### 4.2 Development Workflow
Follow the 6-stage development workflow for optimal results:

1. **Project Initialization**: `npm run migration:*` && `npm run data:generate-*`
2. **Content Development**: `npm run data:align-*` && `npm run generate:*`
3. **Quality Assurance**: `npm run check:*` && `npm run test:*`
4. **Issue Resolution**: `npm run fix:*`
5. **Build & Deploy**: `npm run generate:*` && `npm run build`
6. **Internationalization**: `npm run i18n:*` && `npm run check:hardcode`

### 4.3 Script Usage Standards
*   **Prefer NPM Scripts**: Always use the defined npm scripts rather than direct script execution.
*   **Check Dependencies**: Verify script dependencies before execution.
*   **Use Proper Parameters**: Follow the documented parameters and options.
*   **Backup Before Operations**: Critical scripts automatically create backups.

## 5. Data Management

### 5.1 Single Source of Truth
*   **Location**: `src/locales/{lang}/data` is the authoritative source for domain data (books, chapters, etc.).
*   **Migration**: Use the organized migration scripts in `scripts/migration/`.
*   **Access**: Use `dataManager` or specific hooks (`useSupabaseData`) to access data.

### 5.2 Runtime Merging
*   **Pattern**: Use `deepMerge` utilities to overlay translations onto base data structures.
*   **Validation**: Run `npm run check:locale-consistency` to ensure data integrity.

## 6. Quality Assurance

### 6.1 Automated Checks
Run these scripts to ensure quality before pushing:
*   `npm run check:syntax`: Checks for TypeScript errors and ESLint issues.
*   `npm run check:hardcode`: Detects hardcoded text that should be internationalized.
*   `npm run check:book-consistency`: Validates book data consistency.
*   `npm run check:chinese-display`: Ensures proper Chinese text display.

### 6.2 Testing Framework
*   **Unit Tests**: Use Vitest for component and utility testing.
*   **Integration Tests**: Use the scripts in `scripts/checks/` for comprehensive testing.
*   **E2E Tests**: Use the test scripts in `scripts/checks/test-*.js`.

## 7. Build & Deployment

### 7.1 Build Process
The build process follows the organized scripts workflow:
```bash
npm run prebuild        # Generate snapshots, routes, sitemap
npm run build:client    # Vite client build
npm run build:server    # Vite SSR build (optional)
npm run build           # Complete build pipeline with optimizations
```

### 7.2 Optimization Scripts
*   `scripts/build/post-build.js`: Post-build optimizations
*   `scripts/build/generate-cf-worker.mjs`: Cloudflare Worker generation
*   `scripts/tools/check-links.mjs`: Link validation
*   `scripts/seo/check-seo-coverage.js`: SEO coverage analysis

## 8. Performance Standards

### 8.1 Script Performance
*   **Execution Time**: Scripts should complete within reasonable time limits.
*   **Memory Usage**: Monitor memory consumption for data-intensive scripts.
*   **Error Handling**: All scripts must have proper error handling and logging.

### 8.2 Build Performance
*   **Incremental Builds**: Use Vite's incremental build capabilities.
*   **Bundle Analysis**: Regularly analyze bundle sizes and optimize.
*   **Caching**: Implement appropriate caching strategies.

## 9. Documentation Standards

### 9.1 Code Documentation
*   **JSDoc**: Use JSDoc comments for all public functions and classes.
*   **Type Comments**: Add explanatory comments for complex types.
*   **README Updates**: Update relevant documentation when making changes.

### 9.2 Scripts Documentation
*   **README.md**: Maintain the comprehensive scripts index in `scripts/README.md`.
*   **Inline Help**: Scripts should support `--help` or `--usage` parameters.
*   **Change Logs**: Document significant changes in CHANGELOG.md.

## 10. Security Standards

### 10.1 Data Security
*   **Input Validation**: Validate all user inputs and external data.
*   **Sanitization**: Sanitize data before processing or displaying.
*   **Environment Variables**: Use environment variables for sensitive configuration.

### 10.2 Script Security
*   **File Operations**: Validate file paths and permissions before operations.
*   **Command Injection**: Avoid command injection vulnerabilities in script execution.
*   **Dependency Security**: Regularly audit and update dependencies.

---

*Last Updated: March 11, 2026*
*Version: 1.7.0*
