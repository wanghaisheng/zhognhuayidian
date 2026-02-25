# Content Generator Framework

A universal content generation framework based on CORE + EEAT principles, optimized for both traditional SEO and AI search engines (GEO).

---

## Quick Reference

| Need | File |
|------|------|
| **🚨 Batch generation safety** ⭐ | `framework/batch-generation-safety.md` |
| **🚨 Quality gates (mandatory)** ⭐ | `framework/quality-gates.md` |
| **🔧 Failure recovery** ⭐ | `framework/failure-recovery.md` |
| **Content type decisions** | `content-type-decisions.md` |
| **Keyword research data** | `keyword-research/GUIDE.md` |
| CORE principles | `framework/core-principles.md` |
| EEAT signals | `framework/eeat-signals.md` |
| Quality checklist | `framework/quality-checklist.md` |
| Quality (TypeScript) | `framework/quality-technical.md` |
| Quality (lifecycle) | `framework/content-operations.md` |
| Page components | `components/page-enhancements.md` |
| SEO schemas | `components/seo-schemas.md` |
| GEO components | `components/geo-optimization.md` |
| GEO strategies | `components/geo-strategies.md` |
| GEO measurement | `components/geo-measurement.md` |
| Component/Schema mapping | `COMPONENT-MAPPING.md` |
| Content types | `content-types/{type}/GUIDE.md` |
| Type definitions (reference) | `types/content-data.ts` |
| Keyword research types | `keyword-research/types.ts` |
| Keyword research parsers | `keyword-research/parsers.ts` |
| **Create project skill** | `PROJECT-DATA-CREATOR.md` |

> **Note**: `types/content-data.ts` is a reference document. Actual types live in your project's `src/lib/` directory.

---

## Supported Content Types

| Type | Purpose | Guide |
|------|---------|-------|
| `blog` | How-to guides, tutorials, insights | `content-types/blog/GUIDE.md` |
| `alternative` | Competitor comparison pages | `content-types/alternative/GUIDE.md` |
| `use-case` | Industry/persona use cases | `content-types/use-case/GUIDE.md` |
| `landing` | Product/tool landing pages | `content-types/landing/GUIDE.md` |
| `faq` | FAQ topic pages | `content-types/faq/GUIDE.md` |
| `best-of` | Listicle/roundup pages | `content-types/best-of/GUIDE.md` |
| `testimonial` | Case studies, user stories | `content-types/testimonial/GUIDE.md` |

---

## Content Type Decision Flowchart

```
START: What is the primary goal?
│
├─► Teach HOW to do something? → blog (guides)
├─► Compare YOUR product vs competitor? → alternative
├─► Compare MULTIPLE products (listicle)? → best-of
├─► Show WHO benefits from your product? → use-case
├─► Answer common questions? → faq (or faqs[] field)
├─► Showcase CUSTOMER SUCCESS? → testimonial
├─► Describe PRODUCT features? → landing
└─► Share INSIGHTS or trends? → blog (insights)
```

**Edge cases?** See `content-type-decisions.md` for detailed decision trees.

---

## Framework Layers

```
┌─────────────────────────────────────────┐
│           CORE + EEAT Principles        │  ← Universal methodology
├─────────────────────────────────────────┤
│     Components (SEO + GEO + UI)         │  ← Reusable patterns
├─────────────────────────────────────────┤
│         Content Type Guides             │  ← Type-specific rules
├─────────────────────────────────────────┤
│      Types (TypeScript Interfaces)      │  ← Data structures
└─────────────────────────────────────────┘
```

---

## Core Principles Summary

### CORE (Content Optimization)

| Principle | Focus |
|-----------|-------|
| **C** - Clarity | Direct answers, scannable structure |
| **O** - Organization | Logical hierarchy, semantic markup |
| **R** - Referenceability | Citable data, verified sources |
| **E** - Exclusivity | Unique insights, original value |

### EEAT (Trust Signals)

| Signal | Implementation |
|--------|----------------|
| **E** - Experience | Real usage examples, case studies |
| **E** - Expertise | Author credentials, technical depth |
| **A** - Authority | External citations, industry recognition |
| **T** - Trust | Data verification, transparent sourcing |

---

## Generation Workflow

```
🚨 PRE-FLIGHT (MANDATORY):
   → Read batch-generation-safety.md
   → Complete quality-gates.md Gate 1
   → Set batch size (max 10 articles)

0. Research keywords → Read keyword-research/GUIDE.md, check CSV data
1. Select content type → Read GUIDE.md
2. Apply CORE principles → Check core-principles.md
3. Add EEAT signals → Check eeat-signals.md
4. Include components → Check page-enhancements.md
5. Add SEO schema → Check seo-schemas.md
6. Optimize for GEO → Check geo-optimization.md, geo-strategies.md
7. Validate per batch → Run quality-gates.md Gates 2-4
8. Final check → Run quality-checklist.md, quality-technical.md

⚠️ IF ERRORS: See failure-recovery.md
```

---

## Keyword Research Integration

Use keyword data from SEMrush, Ahrefs, and GSC to inform content:

### Data Sources

| Source | Location | Key Data |
|--------|----------|----------|
| SEMrush | `data/keyword-research/semrush/` | Volume, difficulty, SERP features, intents |
| Ahrefs | `data/keyword-research/ahrefs/` | Volume, difficulty, trends, intents |
| GSC | `data/keyword-research/gsc/` | Clicks, impressions, CTR, position |

### Workflow

1. **Find target keyword** in CSV data
2. **Extract metrics**: volume, difficulty, current position
3. **Identify SERP features**: AI Overview, Featured Snippet
4. **Populate content fields**: `targetKeyword`, `monthlySearchVolume`, `keywords`

### Quick Reference

```typescript
// From keyword research
targetKeyword: 'youtube transcript download',
monthlySearchVolume: 2400,  // From SEMrush/Ahrefs
```

See `keyword-research/GUIDE.md` for detailed instructions.

---

## Usage with Project-Specific Data

This framework is designed to be used alongside a project-specific data skill:

```
content-generator-framework/    ← This skill (universal)
├── keyword-research/           # CSV parsing tools & guides
│   ├── GUIDE.md               # Usage guide
│   ├── types.ts               # Type definitions (reference)
│   └── parsers.ts             # CSV parsing functions (reference)
└── ...

your-project-content-data/      ← Your project skill (specific)
├── SKILL.md                    # Products, competitors, author, Step 0
├── types.md                    # Type reference (actual types in src/lib/)
├── brand.md                    # Voice, CTAs, positioning
├── data/
│   ├── statistics.md           # Verified stats
│   └── citations.md            # Source library
└── examples/                   # Content examples (.md format)

data/keyword-research/          ← Project root (gitignored CSVs)
├── semrush/                    # SEMrush exports
├── ahrefs/                     # Ahrefs exports
└── gsc/                        # GSC exports
```

> **Note**: Use `.md` files for skills. Actual TypeScript types live in your project's `src/lib/` directory. Keyword research CSVs are stored in `data/keyword-research/` at project root.

**Create yours**: See `PROJECT-DATA-CREATOR.md`
