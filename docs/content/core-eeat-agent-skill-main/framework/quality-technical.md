# Quality Technical Validation

TypeScript output validation, edge case handling, and unified reference tables.

> **Related Files**:
> - [quality-checklist.md](quality-checklist.md) - Content type checklists
> - [content-operations.md](content-operations.md) - Lifecycle, KPIs, common mistakes
> - [batch-generation-safety.md](batch-generation-safety.md) - Batch generation safety protocol ⭐ NEW
> - [quality-gates.md](quality-gates.md) - Mandatory validation checkpoints ⭐ NEW
> - [failure-recovery.md](failure-recovery.md) - Recovery from generation failures ⭐ NEW

---

## ⚠️ CRITICAL: Read Before Generating

### Pre-Generation Mandatory Steps

**DO NOT SKIP THESE** - They prevent 90% of failures:

1. **Read actual type definitions** (5 min)
   ```bash
   cat src/lib/blog-types.ts       # BlogPostData interface
   cat src/lib/eeat-types.ts       # EEATEnhancement structure
   ```

2. **Copy from working template** (2 min)
   ```bash
   # Find golden template
   ls src/lib/blog-posts/*.ts | head -5

   # Open and copy structure
   cat src/lib/blog-posts/deepseek-v4-api-guide.ts
   ```

3. **Test build** (1 min)
   ```bash
   npm run build  # Must succeed before starting
   ```

### Common Mistakes (Anti-Patterns)

| ❌ Mistake | ✅ Fix | Why |
|-----------|--------|-----|
| Used `publishedAt` | Use `publishDate` | Wrong field name |
| Used `readingTime: "10 min"` | Use `readTime: 10` | Wrong type (string vs number) |
| `eeat: { experience: {} }` | `eeat: { authorInfo: DEFAULT_AUTHOR }` | Wrong structure |
| Wrote from scratch | Copied from template | Type/structure errors |
| Generated 50 articles | Max 10 per batch | Error accumulation |
| Skipped validation | `npm run build` per batch | Late error discovery |

### Batch Size Guidelines

| Experience Level | Batch Size | Validation Frequency |
|-----------------|------------|---------------------|
| First time | 5 articles | After each batch |
| Experienced | 10 articles | After each batch |
| Expert | 15 articles | After each batch |
| **NEVER** | **>20 articles** | **Disaster waiting** |

**See**: [batch-generation-safety.md](batch-generation-safety.md) for detailed workflow

---

## TypeScript Output Check

### Required Fields

```typescript
// All content types must have
slug: string;              // ✓ Non-empty
title: string;             // ✓ < 60 characters
metaDescription: string;   // ✓ < 160 characters
keywords: string[];        // ✓ 5-10 items
```

### Time Fields

> **Single Source of Truth**: See `types/content-data.ts` header comment for complete date field conventions.

```typescript
publishDate: string;       // ✓ YYYY-MM-DD format - when published
updateDate: string;        // ✓ YYYY-MM-DD format - when content edited
lastVerified?: string;     // ✓ YYYY-MM-DD format - when facts verified
pricingLastVerified?: string;  // ✓ Alternative pages - pricing check date
accessDate?: string;       // ✓ Citations - when source accessed
```

### EEAT Fields

```typescript
eeat?: {
  authorInfo?: AuthorInfo;           // Or use DEFAULT_AUTHOR
  externalCitations?: ExternalCitation[];
  lastVerified?: string;
  dataDisclaimer?: string;
};
keyTakeaways?: string[];             // ✓ 5-7 items
```

### Internal Link Fields

```typescript
relatedPosts?: string[];             // ✓ 2-5 valid slugs
relatedTools?: string[];             // ✓ 1-3 valid slugs
relatedUseCases?: string[];          // ✓ 1-3 valid slugs
relatedAlternatives?: string[];      // ✓ If applicable
relatedFAQs?: string[];              // ✓ If applicable
```

---

## File Output Check

### File Header Comment

```typescript
// ============================================================================
// Article: {{Title}}
// Target Keyword: {{Keyword}} ({{Volume}}/mo)
// Category: {{Category}}
// Published: {{Date}}
// ============================================================================
```

### Import Statements

```typescript
import { BlogPostData } from '../blog-types';
import { DEFAULT_AUTHOR } from '../eeat-types';
```

### Export Naming

```typescript
// camelCase version of slug
export const myArticleSlug: BlogPostData = { ... };
```

---

## Edge Case Handling

### Empty/Missing Data

```typescript
// ❌ Wrong - will break rendering
relatedPosts: [],  // Empty array

// ✅ Correct - omit optional fields
// relatedPosts: undefined (or don't include the field)

// ✅ Or provide minimum valid data
relatedPosts: ['fallback-post-1', 'fallback-post-2'],
```

### Optional Fields with Defaults

| Field | If Missing | Default Behavior |
|-------|------------|------------------|
| `monthlySearchVolume` | Omit | Don't display volume |
| `testimonial` | Omit | Don't render testimonial section |
| `heroImage` | Omit | Use gradient background |
| `eeat.authorInfo` | Omit | Use DEFAULT_AUTHOR |
| `eeat.externalCitations` | Omit | No citations section |

### Invalid Data Patterns

```typescript
// ❌ Invalid date format
lastVerified: '15-01-2026'    // Wrong order
lastVerified: '2026/01/15'    // Wrong separator

// ✅ Valid date format
lastVerified: '2026-01-15'    // YYYY-MM-DD

// ❌ Invalid slug
slug: 'My Blog Post!'         // Spaces and special chars

// ✅ Valid slug
slug: 'my-blog-post'          // Lowercase, hyphens only

// ❌ Exceeds limits
title: 'This is a very long title that exceeds the 60 character limit for SEO'

// ✅ Within limits
title: 'How to Download YouTube Subtitles (5 Methods)'  // 49 chars
```

---

## Unified Reference Tables

### Minimum Content Requirements

| Content Type | Min FAQs | Min Keywords | Min keyTakeaways |
|--------------|----------|--------------|------------------|
| Blog | 5 | 5 | 5 |
| Alternative | 6 | 5 | 5 |
| Use Case | 5 | 5 | 5 |
| FAQ | 6 | 5 | - |
| Best-Of | 5 | 5 | 5 |
| Testimonial | 3 | 5 | 5 |
| Landing | 4 | 5 | - |

### FAQ Count Matrix (Single Source of Truth)

**This is the authoritative reference for FAQ counts. Other files should reference this table.**

| Content Type | Min | Recommended | Max | Notes |
|--------------|-----|-------------|-----|-------|
| **Blog (guides)** | 5 | 6-8 | 10 | Focus on "how to" questions |
| **Blog (tools)** | 6 | 8-10 | 12 | Include pricing/comparison questions |
| **Blog (insights)** | 4 | 5-6 | 8 | Data interpretation questions |
| **Alternative** | 6 | 6-8 | 10 | Migration, pricing, feature questions |
| **Use Case** | 5 | 5-7 | 8 | Persona-specific questions |
| **FAQ Page** | 6 | 8-12 | 15 | Dedicated page needs more depth |
| **Best-Of** | 5 | 5-8 | 10 | "Which is best for X" questions |
| **Testimonial** | 3 | 3-5 | 6 | Focus on verification, results |
| **Landing** | 4 | 4-6 | 8 | Feature and getting started questions |

**Decision Guide**:
- **< 5 FAQs**: Embed as `faqs[]` field in another content type
- **5-9 FAQs**: Can be standalone or embedded
- **10+ FAQs**: Should be dedicated FAQ page

### Citation Tier Requirements

| Content Type | Tier 1 (Official) | Tier 2 (Industry) | Tier 3 (Community) | Notes |
|--------------|-------------------|-------------------|---------------------|-------|
| **Blog (guides)** | 1+ | 0-1 | 0 | Official docs for tools |
| **Blog (tools)** | 2+ | 1+ | 0-1 | Pricing pages required |
| **Blog (insights)** | 2+ | 2+ | 0-1 | Research sources |
| **Alternative** | 1+ | 0-1 | 0 | Competitor pricing page |
| **Use Case** | 0-1 | 1+ | 0 | Industry statistics |
| **Best-Of** | 3+ | 1+ | 0-1 | All tool pricing pages |
| **FAQ** | 0 | 0 | 0 | User-generated answers |
| **Testimonial** | 0 | 0 | 0 | Verified user data |
| **Landing** | 0-1 | 0 | 0 | Own product data |

**Notes**:
- FAQ and Testimonial prioritize user-generated content over external citations
- Tier 1 = Official docs, pricing pages, primary sources
- Tier 2 = Industry reports, major publications (TechCrunch, HBR)
- Tier 3 = Community sources (Reddit, reviews) - use sparingly

---

## Post-Generation Checklist Template

Add as comment at end of generated file:

```typescript
/*
QUALITY CHECKLIST - {{Content Type}}

CORE:
- [x] C01 First-screen answer (<150 words)
- [x] O01 Heading hierarchy correct
- [ ] R01 Data has units
- [ ] E01 Unique value point

EEAT:
- [ ] First-person narrative
- [ ] tier1/tier2 citation
- [ ] lastVerified date

SEO:
- [x] title < 60 chars
- [x] metaDescription < 160 chars
- [x] keywords 5-10 items
- [x] keyTakeaways 5-7 items

Internal Links:
- [ ] relatedPosts
- [ ] relatedTools
*/
```
