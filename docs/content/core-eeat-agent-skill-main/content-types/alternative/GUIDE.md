# Alternative Page Generation Guide

## Overview

| Field | Value |
|-------|-------|
| Output Type | `AlternativePageData` |
| Output Location | Project-specific alternatives directory |
| Core Principles | Fair Analysis + Decision Framework |

---

## ⚠️ IMPORTANT: Project-Specific Field Naming

**Before implementing**, understand that this guide uses generic field names. Your project MUST customize these:

```typescript
// ❌ Generic (framework documentation only)
productBestFor: ['Users who want...']
winner: 'product'

// ✅ Project-specific (production code)
// Example: NoteLM project
notelmBestFor: ['Users who want...']
winner: 'notelm'

// Example: Acme project
acmeBestFor: ['Users who want...']
winner: 'acme'
```

**Requirements**:
- Replace `productBestFor` with `[yourproduct]BestFor` in your TypeScript interface
- Update `ComparisonWinner` type: `'competitor' | '[yourproduct]' | 'tie'`
- Be consistent throughout all alternative page files
- See `types/content-data.ts` in your project for the actual field names

---

## Generation Workflow

```
1. Identify competitor → Gather official info
2. Fill TypeScript fields
3. Build comparison table (10-15 rows)
4. Write fair analysis (pros + cons)
5. Add decision framework
6. Verify pricing data
```

---

## TypeScript Structure

```typescript
import { AlternativePageData } from '../types/content-data';

export const competitorAlternative: AlternativePageData = {
  slug: 'competitor-alternative',
  competitorName: '[Competitor]',
  competitorDescription: '[Brief competitor description]...',
  title: '[Competitor] Alternative: [Value Proposition]',
  tagline: 'Get [benefit] without [competitor limitation]',
  metaDescription: '...',
  keywords: ['[competitor] alternative', '...'],
  targetKeyword: '[competitor] alternative',
  monthlySearchVolume: 1900,
  gradient: 'from-blue-500 to-purple-500',

  // === GEO CORE C01 First-Screen Answer ===
  directAnswer: '[Your Product] is the best free [Competitor] alternative for [use case]...',

  // === Comparison Table (10-15 rows) ===
  comparisons: [
    { feature: 'Price', competitor: '$X/mo', product: 'Free', winner: 'product' },
    { feature: 'Feature A', competitor: 'Limited', product: 'Full', winner: 'product' },
    { feature: 'Feature B', competitor: 'Yes', product: 'No', winner: 'competitor' },
    // ... 10-15 rows
  ],

  // === Reasons to Choose (4 items) ===
  reasons: [
    { title: 'Completely Free', description: '...', icon: 'gift' },
    { title: 'No Account Required', description: '...', icon: 'zap' },
    // ... 4 items
  ],

  // === Fair Analysis ===
  competitorPros: [
    '[Strength 1]',
    '[Strength 2]',
    '[Strength 3]'
  ],
  competitorCons: [
    '[Limitation 1]',
    '[Limitation 2]',
    '[Limitation 3]'
  ],

  // === Decision Framework ===
  competitorBestFor: [
    'Users needing [specific feature]',
    'Teams with [specific need]'
  ],
  productBestFor: [
    '[Your use case 1]',
    '[Your use case 2]',
    'Users who want [benefit]'
  ],

  // === Verdict ===
  verdict: '[Your Product] is the better choice for [use case]...',

  // === Pricing Verification ===
  competitorPricingUrl: 'https://competitor.com/pricing',
  pricingLastVerified: '2026-01-15',

  // === FAQ (6-8 items) ===
  faqs: [
    { question: 'Is [Your Product] really free?', answer: '...' },
    // ... 6-8 items
  ],

  // === EEAT ===
  keyTakeaways: ['...'],
  eeat: {
    authorInfo: {
      name: 'Team Name',
      bio: '...',
    },
    externalCitations: [
      {
        title: '[Competitor] Pricing',
        url: 'https://competitor.com/pricing',
        tier: 'tier1',
        accessDate: '2026-01-15'
      }
    ],
    lastVerified: '2026-01-15',
    dataDisclaimer: 'Pricing verified as of January 2026.'
  }
};
```

---

## Comparison Table Guidelines

### Required Dimensions

| Dimension | Description |
|-----------|-------------|
| Price | Free tier + paid pricing |
| Free Tier | Free tier limitations |
| [Core Feature 1] | Primary differentiator |
| [Core Feature 2] | ... |
| Account Required | Registration requirement |
| Languages | Language support count |

### Winner Assignment Rules

| Value | Use Case |
|-------|----------|
| `'product'` | Your product is clearly better |
| `'competitor'` | Competitor is clearly better |
| `'tie'` | Both equal or each has advantages |

---

## Fair Analysis Principles

### Requirements

1. **Acknowledge competitor strengths** - At least 3 real strengths
2. **Objective limitations** - Based on facts, not disparaging
3. **Decision framework** - Clear guidance on who should choose what
4. **Source attribution** - Pricing must cite official source

### Prohibited Language

- "is terrible at..."
- "Nobody should use..."
- "Fails to deliver..."

### Recommended Language

- "[Competitor] excels at..."
- "Users often report..."
- "May be better if..."

---

## Quality Checklist

```
[ ] Structure Complete
    [ ] directAnswer one-sentence summary
    [ ] comparisons 10-15 rows
    [ ] reasons 4 items
    [ ] competitorPros 3 items
    [ ] competitorCons 3 items
    [ ] competitorBestFor
    [ ] productBestFor
    [ ] verdict conclusion
    [ ] faqs 6-8 items

[ ] Fairness
    [ ] No disparaging language
    [ ] Competitor strengths accurate
    [ ] winner labels reasonable
    [ ] Decision framework present

[ ] Data Verification
    [ ] competitorPricingUrl valid
    [ ] pricingLastVerified date set
    [ ] Pricing data accurate
    [ ] eeat.dataDisclaimer present

[ ] EEAT
    [ ] externalCitations tier1 (official pricing)
    [ ] keyTakeaways 5-7 items
```

---

## Icon Options

| Icon | Code | Use Case |
|------|------|----------|
| Gift | `gift` | Free/discount |
| Lightning | `zap` | Speed/efficiency |
| Globe | `globe` | Languages/global |
| Shield | `shield` | Security/privacy |
| Users | `users` | Team/collaboration |
| Code | `code` | Developer/API |

---

## Gradient Options

```typescript
'from-blue-500 to-purple-500'    // Blue-purple
'from-green-500 to-teal-500'     // Green-teal
'from-amber-500 to-orange-500'   // Amber-orange
'from-purple-500 to-pink-500'    // Purple-pink
```
