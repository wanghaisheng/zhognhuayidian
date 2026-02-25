
# 🌐 Growth Spec: International SEO Strategy (Module F)

**Goal:** Global reach via technical correctness and true localization.

---

## 1. Technical Implementation (Hreflang)

### A. Architecture: Subdirectories
*   **Strategy:** Use `domain.com/[lang-code]/` (e.g., `/fr/`, `/zh/`).
*   **Why:** Aggregates domain authority (DA) into a single root domain.
*   **Configuration:** Managed via the project's localization registry.

### B. Hreflang Tags (The Law)
Every page MUST contain a set of `<link rel="alternate" ... />` tags in the `<head>`:
1.  **Self-referencing**: Link to current page.
2.  **Alternates**: Links to all other language versions.
3.  **x-default**: Link to the fallback version (usually English).

```html
<link rel="alternate" hreflang="en" href="https://site.com/en/page" />
<link rel="alternate" hreflang="zh" href="https://site.com/zh/page" />
<link rel="alternate" hreflang="x-default" href="https://site.com/en/page" />
```

---

## 2. Content Strategy: Localization > Translation

### A. Beyond Machine Translation
*   **Culture**: Adapt images, currency, and local social proof.
*   **Tone**: Use local idioms. [Action CTA] should reflect cultural search intent.

### B. Market-Specific Keyword Research
*   **Rule:** **NEVER** directly translate keywords.
*   **Workflow:**
    1.  Define target market.
    2.  Brainstorm native seed keywords with a local speaker or AI.
    3.  Run keyword research tools with location set to target country.
    4.  Create new Content Briefs based on local search intent.
