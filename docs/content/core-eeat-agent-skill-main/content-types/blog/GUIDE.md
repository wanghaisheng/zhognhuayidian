# Blog Post Generation Guide

## Overview

| Field | Value |
|-------|-------|
| Output Type | `BlogPostData` |
| Output Location | Project-specific blog directory |
| Core Principles | CORE C01 + EEAT |
| Categories | `guides`, `tools`, `growth`, `ai-features`, `insights` |

---

## Generation Workflow

```
1. Define target keyword → Research search intent
2. Choose category → Select appropriate template
3. Fill TypeScript fields → slug, title, meta, keywords
4. Write content with CORE principles
5. Add EEAT signals → citations, author, testing
6. Internal linking → related content
7. Quality check → Run checklist
```

---

## TypeScript Structure

```typescript
import { BlogPostData } from '../types/content-data';

export const myBlogPost: BlogPostData = {
  // === Basic Info ===
  slug: 'how-to-accomplish-task',
  category: 'guides',
  title: 'How to [Accomplish Task]: 5 Best Methods (2026)',  // < 60 chars
  excerpt: 'The fastest way to [accomplish task] is...',     // 150 words, direct answer
  metaDescription: 'Learn how to [accomplish task] with 5 proven methods...', // < 160 chars

  // === SEO ===
  keywords: [
    'primary keyword',
    'secondary keyword',
    'long-tail keyword',
    // 5-10 total
  ],
  targetKeyword: 'primary keyword',
  monthlySearchVolume: 1900,

  // === Time ===
  publishDate: '2026-01-15',
  updateDate: '2026-01-15',
  readTime: 8,

  // === Content ===
  author: 'Team Name',
  content: `
# How to [Accomplish Task]

[First-paragraph direct answer - 150 words max]

## Key Takeaways

- **[Point 1]**: [Specific data]
- **[Point 2]**: [Specific data]
...

## Method 1: [Tool/Approach A] (Recommended)

### Steps
1. [Step 1]
2. [Step 2]
...

### Features
- [Feature 1]
- [Feature 2]

### Limitations
- [Limitation 1]

### Best For
- [Use case 1]

[Continue with more methods...]

## Quick Comparison

| Method | Speed | Price | Best For |
|--------|-------|-------|----------|
| [A] | Fast | Free | [Use case] |
| [B] | Medium | Paid | [Use case] |

## FAQ

### [Question 1]?
[Answer]

### [Question 2]?
[Answer]

## Conclusion

[Summary + recommendation + CTA]
  `,

  // === Internal Links ===
  relatedPosts: ['related-post-1', 'related-post-2'],
  relatedTools: ['tool-1'],
  relatedUseCases: ['use-case-1'],

  // === EEAT ===
  keyTakeaways: [
    '[Tool A] is the fastest method (2-5 seconds)',
    '[Tool B] is best for [specific format]',
    'All methods support [feature]',
    'No account required for [Tool A]',
    'Pricing: [Tool A] free, [Tool B] $X/mo'
  ],
  eeat: {
    authorInfo: {
      name: 'Team Name',
      bio: 'Description of team expertise...',
      credentials: ['Credential 1', 'Credential 2']
    },
    externalCitations: [
      {
        title: 'Official Documentation',
        url: 'https://example.com/docs',
        tier: 'tier1',
        accessDate: '2026-01-15',
        description: 'Official docs'
      }
    ],
    lastVerified: '2026-01-15'
  },
  lastVerified: '2026-01-15'
};
```

---

## Content Structure by Category

### How-To Guide (`guides`)

```markdown
# How to [Task]

[Direct answer paragraph]

## Key Takeaways
[5-7 bullet points]

## Method 1: [Name] (Recommended)
### Steps
### Features
### Limitations
### Best For

[Repeat for each method]

## Quick Comparison
[Table]

## FAQ
[8-10 questions]

## Conclusion
```

### Tool Comparison (`tools`)

```markdown
# Best [Category] Tools: [N] Options Compared (2026)

[Direct answer - winner + test methodology]

## Key Takeaways
[5-7 points]

## How We Tested
[Methodology]

## Quick Comparison
[Table with all tools]

## 1. [Tool Name] - Best for [Use Case]
### What We Tested
### Results
### Features
### Pricing
### Limitations

[Repeat for each tool]

## Selection Guide
[Your Need → Best Choice table]

## FAQ
[8-10 questions]

## Conclusion
```

### Growth (`growth`)

Content about channel growth, monetization, SEO, and audience building.

**Target Audience**: YouTubers, content creators, online business owners

```markdown
# [Growth Topic]: How to [Achieve Goal]

[Key strategy in first paragraph]

## Key Takeaways
[5-7 actionable points]

## The Strategy
[Detailed approach]

## Step-by-Step Implementation
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Case Study / Example
[Real or illustrative example with numbers]

## Common Mistakes to Avoid
[3-5 pitfalls]

## FAQ
[5-8 questions]

## Conclusion
[Summary + next action]
```

**Min Length**: 1,800 words | **Read Time**: 9 min

---

### AI Features (`ai-features`)

Content about AI-powered tools, automation, and productivity features.

**Target Audience**: Users wanting to leverage AI for efficiency

```markdown
# [AI Feature]: How [Product] Uses AI for [Benefit]

[What the AI feature does + key benefit]

## Key Takeaways
[5-7 points]

## How It Works
[Technical explanation in simple terms]

## Use Cases
### Use Case 1
### Use Case 2
### Use Case 3

## Step-by-Step Guide
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Tips for Best Results
[3-5 pro tips]

## FAQ
[5-8 questions]

## Conclusion
```

**Min Length**: 1,200 words | **Read Time**: 6 min

---

### Insights (`insights`)

Industry trends, statistics, platform analysis, and data-driven insights.

**Target Audience**: Researchers, analysts, strategic planners

```markdown
# [Insight Topic]: What [Data/Research] Reveals

[Key finding in first paragraph]

## Key Takeaways
[5-7 points]

## The Data
[Statistics with sources]

## What This Means
[Analysis]

## Implications for [Audience]
[Practical takeaways]

## FAQ
[5-8 questions]

## Conclusion
```

**Min Length**: 2,000 words | **Read Time**: 10 min

---

## Category Selection Guide

| If content is about... | Use Category |
|------------------------|--------------|
| Step-by-step tutorial | `guides` |
| Tool comparison/review | `tools` |
| Channel/audience growth | `growth` |
| AI-powered features | `ai-features` |
| Industry trends/data | `insights` |

---

## CORE Checklist

```
[ ] C01 - First paragraph answers title in <150 words
[ ] C02 - Title promise matches content delivery
[ ] C10 - Conclusion loops back with summary + CTA
[ ] O01 - Heading hierarchy H1→H2→H3, no skips
[ ] O04 - 3+ parallel items use bullet lists
[ ] O05 - Key Takeaways present (5-7 items)
[ ] O06 - Steps use numbered lists
[ ] R01 - All data has units (%, seconds, $/mo)
[ ] R02 - Statistics cite sources
[ ] E01 - At least 1 unique value point
[ ] E04 - Practical tools (checklist/table)
```

---

## EEAT Checklist

```
[ ] First-person narrative ("We tested...", "I found...")
[ ] Test methodology described
[ ] Sample size/duration mentioned
[ ] Limitations honestly shared
[ ] tier1/tier2 citations present
[ ] Author credentials included
[ ] lastVerified date set
```

---

## SEO Checklist

```
[ ] title < 60 characters
[ ] metaDescription < 160 characters
[ ] targetKeyword in title, H1, first paragraph
[ ] keywords array has 5-10 items
[ ] keyTakeaways has 5-7 items
[ ] slug uses hyphens, no special chars
```

---

## Internal Linking

| Field | Count | Source |
|-------|-------|--------|
| relatedPosts | 3-5 | Same category blog posts |
| relatedTools | 1-3 | Tool landing pages |
| relatedUseCases | 1-3 | Use case pages |
| relatedAlternatives | 0-2 | Comparison pages |
| relatedFAQs | 0-2 | FAQ topic pages |

---

## readTime Calculation

The `readTime` field should be calculated based on actual content length.

### Formula

```typescript
// Average reading speed: 200-250 words per minute
// Use 225 wpm for technical content

function calculateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 225);
  return Math.max(minutes, 1); // Minimum 1 minute
}
```

### Guidelines by Category

| Category | Min Words | Typical readTime |
|----------|-----------|------------------|
| `guides` | 1,500 | 7-10 min |
| `tools` | 2,000 | 9-12 min |
| `growth` | 1,800 | 8-10 min |
| `ai-features` | 1,200 | 5-7 min |
| `insights` | 2,000 | 9-12 min |

### What Counts

- ✅ Body text
- ✅ Headings
- ✅ List items
- ✅ Table content
- ❌ Code blocks (scan, not read)
- ❌ Image alt text
- ❌ Metadata fields

### Display Format

```typescript
// In data
readTime: 8,

// In UI
`${readTime} min read`  // "8 min read"
```
