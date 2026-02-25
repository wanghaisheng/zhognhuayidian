# Testimonial/Case Study Page Generation Guide

## Overview

| Field | Value |
|-------|-------|
| Output Type | `TestimonialPageData` |
| Output Location | Project-specific testimonials directory |
| Core Principles | Real Stories + Verified Results |

---

## TypeScript Structure

```typescript
import { TestimonialPageData } from '../types/content-data';

export const myTestimonial: TestimonialPageData = {
  slug: 'user-case-study',
  title: 'How [User] Achieved [Result] with [Product]',
  tagline: '[Compelling one-line result]',
  description: '[2-3 sentence description]',
  gradient: 'from-blue-500 to-purple-500',
  industry: 'Education',        // Education, Business, Content Creator, etc.
  tool: 'product-slug',

  // === User Information ===
  user: {
    name: 'Jane Doe',
    title: 'Student',
    company: 'University Name',
    location: 'New York, USA',
    background: 'Brief background on user...',
    isVerified: true,           // Has this been verified?
    verificationNote: 'Verified via email confirmation'
  },

  // === Quote ===
  quote: 'Short, impactful quote (1-2 sentences)',
  extendedQuote: 'Longer quote with more detail for case study format...',

  // === Key Results (3-5) ===
  keyResults: [
    {
      value: '5 hours',
      metric: 'saved per week',
      context: 'On video research',
      icon: 'clock'
    },
    {
      value: '40%',
      metric: 'improvement in grades',
      context: 'After one semester',
      icon: 'trending-up'
    }
  ],

  // === Challenge ===
  challenge: {
    title: 'The Problem',
    description: 'Description of what problem user faced...',
    painPoints: [
      'Pain point 1',
      'Pain point 2',
      'Pain point 3'
    ]
  },

  // === Solution ===
  solution: {
    title: 'The Solution',
    description: 'How product solved the problem...',
    howTheyUsedIt: [
      'Step/use case 1',
      'Step/use case 2',
      'Step/use case 3'
    ]
  },

  // === Before/After (optional) ===
  beforeAfter: [
    {
      metric: 'Time per video',
      before: '45 minutes',
      after: '5 minutes',
      improvement: '-89%'
    },
    {
      metric: 'Weekly study hours',
      before: '30 hours',
      after: '25 hours',
      improvement: '-5 hours'
    }
  ],

  // === Story Content ===
  storyContent: {
    background: 'Detailed background on user situation...',
    discovery: 'How they found the product...',
    implementation: 'How they started using it...',
    results: 'What results they achieved...',
    future: 'How they plan to continue using it...'
  },

  // === Key Takeaways (5-7) ===
  keyTakeaways: [
    'Key insight 1 from this case study',
    'Key insight 2',
    'Key insight 3'
  ],

  // === FAQ (3-5) ===
  faqs: [
    {
      question: 'How long did it take to see results?',
      answer: 'Answer...'
    }
  ],

  // === EEAT ===
  eeat: {
    authorInfo: { name: 'Team', bio: '...' },
    externalCitations: [
      // If user/company is well-known, cite their profile
    ],
    lastVerified: '2026-01-15',
    dataDisclaimer: 'Results may vary. This case study reflects one user experience.'
  },
  lastVerified: '2026-01-15'
};
```

---

## Content Structure

```markdown
# How [User] [Achieved Result] with [Product]

[Hero with key result and user photo/avatar]

## Key Results
[3-5 metric cards]

## The Challenge
[Problem description]
- Pain point 1
- Pain point 2
- Pain point 3

## The Solution
[How product helped]
- How they used it 1
- How they used it 2
- How they used it 3

## Before & After
[Comparison table]

## The Story
### Background
[User context]

### Discovery
[How they found product]

### Implementation
[How they started]

### Results
[What they achieved]

### Looking Forward
[Future plans]

## Key Takeaways
[5-7 insights]

## FAQ
[3-5 questions]
```

---

## Verification Levels

| Level | Requirements | Badge |
|-------|--------------|-------|
| **Verified** | Email confirmation + real name | "Verified User" |
| **Attributed** | Real name, public profile | "Real User" |
| **Anonymous** | Permission granted, identity protected | "Anonymous User" |
| **Example** | Illustrative, not real | "Example Case" |

**Important**: Always mark `isVerified` accurately. Never claim verification without actual verification.

---

## Quality Checklist

```
[ ] User Verification
    [ ] isVerified matches actual verification status
    [ ] verificationNote explains how verified
    [ ] User consented to publication

[ ] Results
    [ ] keyResults are specific and measurable
    [ ] beforeAfter data is accurate
    [ ] Results are realistic (not exaggerated)

[ ] Story
    [ ] challenge clearly describes problem
    [ ] solution shows product usage
    [ ] storyContent is detailed and authentic

[ ] Trust Signals
    [ ] dataDisclaimer present
    [ ] eeat.lastVerified set
    [ ] No misleading claims

[ ] Structure
    [ ] keyResults 3-5 items
    [ ] keyTakeaways 5-7 items
    [ ] faqs 3-5 items
```

---

## Result Icons (KeyResult.icon)

| Icon | Code | Use Case |
|------|------|----------|
| Clock | `clock` | Time saved |
| Trending Up | `trending-up` | Growth/improvement |
| Dollar | `dollar` | Money saved |
| Users | `users` | Team/reach |
| Zap | `zap` | Speed/efficiency |
| Star | `star` | Quality/rating |
| Check | `check` | Goals achieved |
| Target | `target` | Accuracy/precision |

---

## BeforeAfter Data Guidelines

The `beforeAfter` field creates a compelling comparison table.

### BeforeAfterMetric Structure

```typescript
interface BeforeAfterMetric {
  metric: string;      // What is being measured
  before: string;      // Value before using product
  after: string;       // Value after using product
  improvement: string; // Calculated change (include + or - sign)
}
```

### Writing Effective Metrics

| Good Metric | Bad Metric |
|-------------|------------|
| "Time per video" | "Time" (too vague) |
| "Weekly study hours" | "Hours" (no context) |
| "Monthly costs" | "Money" (not measurable) |

### Improvement Formatting

```typescript
// Time reduction
{ metric: 'Research time', before: '2 hours', after: '15 min', improvement: '-87%' }

// Absolute savings
{ metric: 'Weekly hours', before: '30', after: '25', improvement: '-5 hours' }

// Growth
{ metric: 'Engagement', before: '10%', after: '45%', improvement: '+350%' }

// Money
{ metric: 'Monthly cost', before: '$99', after: '$0', improvement: '-$99' }
```

### Recommended Metrics by Industry

| Industry | Suggested Metrics |
|----------|-------------------|
| Education | Study time, Retention rate, GPA change, Research speed |
| Business | Productivity, Meeting time, Report generation, Costs |
| Content Creator | Production time, Output volume, Engagement, Revenue |
| Personal | Hours saved, Tasks completed, Learning speed |

---

## Ethical Guidelines

1. **Never fabricate testimonials** - All case studies must be real
2. **Get explicit consent** - User must agree to publication
3. **Verify claims** - Confirm results are accurate
4. **Allow review** - Let user review before publishing
5. **Mark examples clearly** - If illustrative, mark as "Example"
6. **Include disclaimers** - Note that results may vary
