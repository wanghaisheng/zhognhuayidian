# Landing/Tool Page Generation Guide

## Overview

| Field | Value |
|-------|-------|
| Output Type | `ToolPageData` |
| Output Location | Project-specific tools directory |
| Core Principles | Value Proposition + Features + CTA |
| Types | `interactive` (functional tool), `landing` (marketing page) |

---

## TypeScript Structure

```typescript
import { ToolPageData } from '../types/content-data';

export const myToolPage: ToolPageData = {
  slug: 'tool-name',
  name: 'Tool Display Name',
  tagline: '[Primary value proposition]',
  description: '[2-3 sentence description]',
  metaDescription: '...',
  keywords: ['...'],
  targetKeyword: '[primary keyword]',
  monthlySearchVolume: 2400,
  icon: 'tool-icon',
  gradient: 'from-blue-500 to-purple-500',

  // === Features (4-6) ===
  features: [
    {
      title: 'Feature Name',
      description: 'Description of feature...',
      icon: 'icon-name'
    },
    // ... 4-6 items
  ],

  // === How It Works (3-5 steps) ===
  howItWorks: [
    { step: 1, title: 'Step Title', description: 'Description...' },
    // ... 3-5 items
  ],

  // === FAQ (5-8) ===
  faqs: [
    { question: 'Question?', answer: 'Answer...' },
    // ... 5-8 items
  ],

  // === Internal Links ===
  relatedTools: ['related-tool-1'],
  relatedProducts: ['product-1'],
  useCases: ['use-case-1', 'use-case-2'],

  // === Tool Config ===
  status: 'live',              // 'live' | 'redirect' | 'coming-soon'
  toolType: 'interactive',     // 'interactive' | 'landing'
  ctaText: 'Get Started Free',
  externalUrl: 'https://...',  // If external tool

  // === Powered By (if applicable) ===
  poweredBy: {
    slug: 'main-product',
    name: 'Main Product Name'
  },

  // === EEAT ===
  keyTakeaways: ['...'],
  eeat: {
    authorInfo: { name: 'Team', bio: '...' },
    lastVerified: '2026-01-15'
  },
  lastVerified: '2026-01-15'
};
```

---

## Page Structure

```markdown
# [Tool Name]

[Hero section with tagline + CTA]

## Features
[4-6 feature cards with icons]

## How It Works
[3-5 numbered steps]

## Use Cases
[Links to use case pages]

## FAQ
[5-8 questions]

## CTA Section
[Final call to action]
```

---

## Quality Checklist

```
[ ] Core Content
    [ ] Tagline clearly states value
    [ ] Features have icons and descriptions
    [ ] How It Works is actionable
    [ ] CTA is compelling

[ ] SEO
    [ ] title < 60 chars
    [ ] metaDescription < 160 chars
    [ ] targetKeyword in title

[ ] Structure
    [ ] features 4-6 items
    [ ] howItWorks 3-5 steps
    [ ] faqs 5-8 items

[ ] Links
    [ ] relatedTools
    [ ] useCases
    [ ] relatedProducts
```

---

## Status Options

| Status | Description |
|--------|-------------|
| `live` | Tool is active and functional |
| `redirect` | Redirects to another page/tool |
| `coming-soon` | Planned but not yet available |
