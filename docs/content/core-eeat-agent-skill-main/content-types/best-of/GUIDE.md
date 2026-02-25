# Best-Of Listicle Page Generation Guide

## Overview

| Field | Value |
|-------|-------|
| Output Type | `BestOfPageData` |
| Output Location | Project-specific best-of directory |
| Core Principles | Ranking + Testing Methodology |

---

## TypeScript Structure

```typescript
import { BestOfPageData } from '../types/content-data';

export const myBestOfPage: BestOfPageData = {
  slug: 'best-category-tools',
  title: 'Best [Category] Tools in 2026: Top [N] Picks',
  tagline: '[Value proposition]',
  introduction: 'First-paragraph direct answer with #1 recommendation...',
  gradient: 'from-blue-500 to-purple-500',

  // === Ranked Tools (5-10) ===
  tools: [
    {
      rank: 1,
      name: 'Tool Name',
      slug: 'tool-slug',  // Internal link if applicable
      description: 'Brief description...',
      rating: 4.8,
      pricingType: 'freemium',  // 'free' | 'freemium' | 'paid' | 'enterprise'
      pricing: 'Free tier available, Pro from $10/mo',
      pros: ['Pro 1', 'Pro 2', 'Pro 3'],
      cons: ['Con 1', 'Con 2'],
      bestFor: 'Users who need [specific feature]',
      isOwnProduct: false,  // Mark true for your own product
      officialUrl: 'https://tool.com'
    },
    // ... 5-10 items
  ],

  // === Key Takeaways ===
  keyTakeaways: [
    '[Tool A] is best for [use case]',
    '[Tool B] offers best value at [price]',
    'All tools support [common feature]'
  ],

  // === Selection Criteria ===
  selectionCriteria: [
    'Ease of use',
    'Feature completeness',
    'Pricing/value',
    'Customer support',
    'Integration options'
  ],

  // === Comparison Table ===
  comparisonTable: [
    {
      feature: 'Free Tier',
      values: { 'Tool A': true, 'Tool B': 'Limited', 'Tool C': false }
    },
    {
      feature: 'Feature X',
      values: { 'Tool A': 'Full', 'Tool B': 'Basic', 'Tool C': 'Full' }
    }
  ],

  // === FAQ (5-8) ===
  faqs: [
    { question: 'Which tool is best for beginners?', answer: '...' },
    // ... 5-8 items
  ],

  // === Optional ===
  authorNote: 'Disclosure: We may earn a commission...',
  relatedTools: ['related-tool'],

  // === EEAT ===
  eeat: {
    authorInfo: { name: 'Team', bio: '...' },
    externalCitations: [
      // Official pricing pages for each tool
    ],
    lastVerified: '2026-01-15',
    dataDisclaimer: 'Pricing verified as of January 2026.'
  },
  lastUpdated: '2026-01-15',
  monthlySearchVolume: 3200
};
```

---

## Content Structure

```markdown
# Best [Category] Tools in 2026

[Introduction with #1 recommendation - CORE C01]

## Key Takeaways
[5-7 bullet points]

## How We Selected These Tools
[Selection criteria]

## Quick Comparison
[Comparison table]

## 1. [Tool Name] - Best for [Use Case]
### Rating: [X.X/5]
### Pricing: [Details]
### Pros
### Cons
### Best For
[CTA link]

[Repeat for each tool...]

## FAQ
[5-8 questions]

## Conclusion
[Summary + top recommendation]
```

---

## Quality Checklist

```
[ ] CORE
    [ ] Introduction names #1 pick
    [ ] Clear ranking order
    [ ] Ratings/data are precise
    [ ] Selection criteria explained

[ ] EEAT
    [ ] Testing methodology described
    [ ] Pricing from official sources
    [ ] isOwnProduct marks your product
    [ ] authorNote for disclosures

[ ] Structure
    [ ] 5-10 tools ranked
    [ ] Each has: rank, rating, pros, cons, bestFor
    [ ] selectionCriteria present
    [ ] comparisonTable complete
    [ ] faqs 5-8 items

[ ] Fairness
    [ ] Pros and cons balanced
    [ ] Competitor strengths acknowledged
    [ ] Own product not unfairly favored
```

---

## Pricing Type Options

| Type | Description |
|------|-------------|
| `free` | Completely free, no paid tiers |
| `freemium` | Free tier + paid upgrades |
| `paid` | Requires payment (may have trial) |
| `enterprise` | Custom/contact pricing |
