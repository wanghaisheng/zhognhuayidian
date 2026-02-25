
# 📈 Growth Spec: SEO Implementation Protocol

**Role:** Growth Engineer
**Context:** When implementing pages, layouts, or content rendering logic.

## 1. The "Money Tag" Requirement
Every public route **MUST** implement the following Meta Tags via `site.config.ts` or the `<SEO />` component.

*   **`<title>`**: Format: `[Page Keyword] | [Brand Name]`. Max 60 chars.
*   **`<meta name="description">`**: Must include the primary keyword in the first sentence. Max 160 chars.
*   **`canonical`**: 
    *   **Rule**: MUST be present and self-referencing by default (e.g., Page A links to Page A).
    *   **Purpose**: Prevents "Duplicate without user-selected canonical" errors.
    *   **Consistency**: Ensure the canonical URL matches the exact URL structure in the Sitemap (trailing slashes, protocol, www vs non-www) to avoid "Google chose different canonical" warnings.

## 2. Semantic Hierarchy (The H-Tree)
AI Crawlers (GEO) rely on semantic structure.
*   **H1**: Exactly **ONE** per page. Must contain the core intent keyword.
*   **H2/H3**: Must follow strict nesting. No skipping levels (e.g., H1 -> H3 is forbidden).

## 3. Generative Optimization (GEO)
*   **Structure**: Use `<ul>` and `<ol>` lists wherever possible. AI models prefer structured lists over dense paragraphs.
*   **Data Attributes**: Use `data-nosnippet` on non-essential UI elements (navbars, footers) to guide AI summarization to the main content.

## 4. Internationalization (i18n)
*   **Hreflang**: All pages must generate `alternate` links for all supported locales defined in `site.config.ts`.
*   **x-default**: Must point to the English version (or primary language).
