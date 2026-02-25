# Use Case Page Generation Guide

## Overview

| Field | Value |
|-------|-------|
| Output Type | `UseCasePageData` |
| Output Location | Project-specific use-cases directory |
| Core Principles | Industry Stats + Decision Framework |
| Categories | `education`, `business`, `content-creators`, `personal` |

---

## Use Case vs Testimonial: Key Differences

| Aspect | Use Case | Testimonial |
|--------|----------|-------------|
| **Focus** | Persona/industry benefits | Specific customer results |
| **Data Source** | Industry statistics | Verified customer data |
| **User** | Hypothetical/general persona | Real, named customer |
| **Verification** | Industry sources cited | Customer consent + verification |
| **Best For** | "Students can save time" | "Jane saved 5 hours/week" |

### When to Use Which

```
Do you have a REAL customer with VERIFIED results?
├─ YES → testimonial
│       - Named user with consent
│       - Specific metrics (before/after)
│       - Verified by email/interview
│
└─ NO  → use-case
        - Persona-based ("Students", "Marketers")
        - Industry statistics as proof
        - Optional: illustrative testimonial marked as "Example"
```

### Migration Path

```
use-case → testimonial

When you:
1. Get real customer feedback
2. Verify their results
3. Get publication consent

Then: Create testimonial page, link from use-case
```

---

## TypeScript Structure

```typescript
import { UseCasePageData } from '../types/content-data';

export const myUseCase: UseCasePageData = {
  slug: 'use-case-name',
  category: 'education',
  name: '[Persona/Industry] Use Case',
  tagline: '[Value proposition in one line]',
  description: '[2-3 sentence description]',
  metaDescription: '...',
  keywords: ['...'],
  targetKeyword: '[primary keyword]',
  monthlySearchVolume: 1200,
  icon: 'graduation-cap',
  gradient: 'from-blue-500 to-purple-500',

  // === Benefits (5-7 with statistics) ===
  benefits: [
    {
      title: 'Better Retention',
      description: 'Description of benefit...',
      icon: 'brain',
      statistic: {
        value: '95% retention rate for video vs 10% for text',
        source: 'Research Name',
        sourceUrl: 'https://example.com/source'
      }
    },
    // ... 5-7 items
  ],

  // === Features (4-6) ===
  features: [
    { title: 'Feature Name', description: 'Description...' },
    // ... 4-6 items
  ],

  // === Steps (3-5) ===
  steps: [
    { step: 1, title: 'Step Title', description: 'Description...' },
    // ... 3-5 items
  ],

  // === Testimonial (optional) ===
  testimonial: {
    quote: 'This tool changed how I work...',
    author: 'Jane Doe',
    role: 'Student, University Name',
    isVerified: true
  },

  // === FAQ (5-7) ===
  faqs: [
    { question: 'Question?', answer: 'Answer...' },
    // ... 5-7 items
  ],

  // === Industry Stats ===
  industryStats: [
    {
      stat: '65% of the population are visual learners',
      source: 'Social Science Research Network',
      sourceUrl: 'https://example.com/source'
    }
  ],

  // === Internal Links ===
  relatedProducts: ['product-1'],
  relatedTools: ['tool-1', 'tool-2'],
  relatedUseCases: ['related-use-case'],

  // === EEAT ===
  keyTakeaways: ['...'],
  eeat: {
    authorInfo: { name: 'Team', bio: '...' },
    externalCitations: [/* tier2 industry sources */],
    lastVerified: '2026-01-15'
  },
  lastVerified: '2026-01-15'
};
```

---

## Category Icons

| Category | Suggested Icons |
|----------|-----------------|
| education | `graduation-cap`, `book`, `brain` |
| business | `briefcase`, `chart`, `users` |
| content-creators | `video`, `mic`, `palette` |
| personal | `user`, `heart`, `star` |

---

## Quality Checklist

```
[ ] CORE
    [ ] Tagline directly states value
    [ ] Benefits have statistics with sources
    [ ] Steps are actionable (3-5 items)

[ ] EEAT
    [ ] industryStats from tier2 sources
    [ ] testimonial is real or marked as example
    [ ] Specific scenario descriptions

[ ] Structure
    [ ] benefits 5-7 items
    [ ] features 4-6 items
    [ ] steps 3-5 items
    [ ] faqs 5-7 items

[ ] Internal Links
    [ ] relatedProducts
    [ ] relatedTools
    [ ] relatedUseCases (similar personas)
```
