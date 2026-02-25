# FAQ Page Generation Guide

## Overview

| Field | Value |
|-------|-------|
| Output Type | `FAQPageData` |
| Output Location | Project-specific FAQ directory |
| Core Principles | Natural Language Q&A |

---

## FAQ Page vs FAQ Field: When to Use Which

| Scenario | Use | Reason |
|----------|-----|--------|
| 10+ questions on one topic | `FAQPageData` (dedicated page) | Deserves own page for SEO |
| 3-8 questions supporting main content | `faqs[]` field in other types | Supplements primary content |
| Topic-specific FAQ hub | `FAQPageData` | e.g., "/faq/pricing", "/faq/features" |
| General product questions | `faqs[]` on landing page | Part of conversion flow |

### Decision Flow

```
How many FAQs do you have on this topic?

< 5 questions  → Embed as faqs[] field in related content
5-9 questions  → Either works; consider search volume
10+ questions  → Create dedicated FAQPageData

Is this topic searched independently?
YES → Dedicated FAQ page (for SEO)
NO  → Embed in related content
```

---

## TypeScript Structure

```typescript
import { FAQPageData } from '../types/content-data';

export const myFAQPage: FAQPageData = {
  slug: 'tool-topic',
  toolSlug: 'tool-name',
  toolName: 'Tool Display Name',
  topic: 'Topic Name',
  title: '[Tool] FAQ: [Topic]',
  metaDescription: '...',
  keywords: ['...'],
  targetKeyword: '[primary keyword]',
  monthlySearchVolume: 800,
  gradient: 'from-blue-500 to-purple-500',

  // === Introduction ===
  introduction: 'Brief introduction to the topic and what questions are covered...',

  // === FAQs (6-10) ===
  faqs: [
    {
      question: 'Natural language question?',
      answer: 'Direct answer in 2-4 sentences. Include specific data when relevant.',
      relatedLink: '/related-page'  // Optional internal link
    },
    // ... 6-10 items
  ],

  // === Related Content ===
  relatedFAQs: ['other-faq-topic'],
  relatedArticles: ['blog-post-slug'],

  // === EEAT ===
  eeat: {
    externalCitations: [/* tier1 sources if applicable */],
    lastVerified: '2026-01-15'
  },
  lastUpdated: '2026-01-15'
};
```

---

## FAQ Writing Guidelines

### Question Format

- Use natural language (how users actually ask)
- Start with question words: Can, How, What, Why, Is, Does
- End with question mark
- Be specific, not vague

**Good Examples**:
- "Can I download subtitles from private videos?"
- "How long does processing take?"
- "Is there a limit on file size?"

**Bad Examples**:
- "About downloading" (not a question)
- "Features?" (too vague)
- "More info" (not specific)

### Answer Format

- First sentence directly answers the question
- 2-4 sentences total
- Include specific data when possible
- Add relatedLink for deeper content

**Good Example**:
```typescript
{
  question: 'Is the tool free?',
  answer: 'Yes, the tool is completely free with no limits. There are no hidden charges or premium tiers. You can use all features without creating an account.',
  relatedLink: '/pricing'
}
```

---

## FAQ Depth Guidelines

### FAQ Count by Context

| Context | FAQ Count | Notes |
|---------|-----------|-------|
| Dedicated FAQ Page | 6-10 | Comprehensive topic coverage |
| Blog Post FAQ Section | 5-8 | Support main content |
| Tool/Landing Page | 4-6 | Address common concerns |
| Alternative Page | 6-8 | Comparison-focused |
| Use Case Page | 5-7 | Persona-specific |

### Answer Length Guidelines

| Question Type | Sentences | Words |
|---------------|-----------|-------|
| Yes/No question | 2-3 | 30-50 |
| How-to question | 3-4 | 50-80 |
| Why question | 3-5 | 60-100 |
| Comparison question | 3-4 | 50-80 |
| Technical question | 4-5 | 80-120 |

### Question Categories to Cover

For a **Dedicated FAQ Page**, include questions from each category:

1. **Basic Questions** (2-3)
   - "What is [tool]?"
   - "Is [tool] free?"
   - "Do I need an account?"

2. **How-To Questions** (2-3)
   - "How do I [action]?"
   - "How long does [process] take?"
   - "How do I get started?"

3. **Limitation Questions** (1-2)
   - "What are the limitations?"
   - "Does it work with [edge case]?"

4. **Comparison Questions** (1-2)
   - "How is [tool] different from [competitor]?"
   - "Which tool is better for [use case]?"

5. **Technical Questions** (1-2)
   - "What formats are supported?"
   - "Is my data secure?"

### Example Complete FAQ Set

```typescript
faqs: [
  // Basic
  {
    question: 'What is [Tool] and what does it do?',
    answer: '[Tool] is a [brief description]. It allows you to [main function] in [time/ease]. No account or payment required.'
  },
  {
    question: 'Is [Tool] completely free?',
    answer: 'Yes, [Tool] is 100% free with no hidden costs. There are no premium tiers, usage limits, or trial periods. All features are available immediately.'
  },
  // How-To
  {
    question: 'How do I use [Tool]?',
    answer: 'Using [Tool] takes 3 simple steps: 1) [Step 1], 2) [Step 2], 3) [Step 3]. The entire process takes [X] seconds.',
    relatedLink: '/guides/how-to-use-tool'
  },
  {
    question: 'How long does [process] take?',
    answer: '[Process] typically takes [X-Y] seconds for [standard case]. Longer [inputs] may take up to [Z] seconds.'
  },
  // Limitations
  {
    question: 'Does [Tool] work with [edge case]?',
    answer: '[Tool] works with [supported cases]. However, it does not currently support [unsupported case]. For [alternative], try [suggestion].'
  },
  // Comparison
  {
    question: 'How is [Tool] different from [Competitor]?',
    answer: 'The main differences are: [Tool] is [advantage 1] while [Competitor] [their approach]. [Tool] also [advantage 2], whereas [Competitor] [their limitation].',
    relatedLink: '/alternatives/competitor-alternative'
  },
  // Technical
  {
    question: 'What formats does [Tool] support?',
    answer: '[Tool] supports [format 1], [format 2], and [format 3]. You can export in [output formats]. For [specific need], use [recommendation].'
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, [Tool] processes data [security method]. We do not store [sensitive data]. All connections use [encryption method].'
  }
]
```

---

## Quality Checklist

```
[ ] CORE
    [ ] Introduction clearly states topic
    [ ] Questions use natural language
    [ ] Answers start with direct response
    [ ] Each answer 2-4 sentences

[ ] Structure
    [ ] 6-10 FAQs
    [ ] relatedFAQs linked
    [ ] relatedArticles linked

[ ] SEO
    [ ] title < 60 chars
    [ ] metaDescription < 160 chars
    [ ] Questions match search queries
```

---

## FAQ Schema Integration

FAQ pages automatically generate FAQPage JSON-LD schema for rich snippets:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question text?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Answer text..."
      }
    }
  ]
}
```
