# GEO Optimization Strategies

Strategies and AI engine-specific optimization for Generative Engine Optimization.

> **Related Files**:
> - [geo-optimization.md](geo-optimization.md) - GEO components reference
> - [geo-measurement.md](geo-measurement.md) - Metrics and testing

---

## GEO Optimization Strategies

### Strategy 1: First-Paragraph Answer (C01)

**Goal**: Enable AI engines to directly extract answers

**Implementation**:
```markdown
# How to [Accomplish Task]

The fastest way to [accomplish task] is using **[Tool A]** -
[brief steps]. No account required, completely free.
```

**Checklist**:
- [ ] First paragraph contains complete answer
- [ ] Under 150 words
- [ ] Contains keywords
- [ ] Contains specific data

---

### Strategy 2: Structured Q&A (FAQ)

**Goal**: Match natural language questions

**Implementation**:
```markdown
### Can I [do specific thing]?

Yes, as long as [condition]. [Tool A] works with [feature]
in [number]+ languages.
```

**Best Practices**:
- Questions use natural language
- Answer starts with direct response
- 2-4 sentences complete answer
- 5-10 FAQs (see faq/GUIDE.md for context-specific counts)

---

### Strategy 3: Citable Data (R01)

**Goal**: Provide precise data AI engines can trust and cite

**Implementation**:
```markdown
In our testing of 50 samples across 8 categories, [Tool A] achieved
94% accuracy, compared to [Tool B]'s 91% and [Tool C]'s 89%.
(Source: Internal testing, January 2026)
```

**Checklist**:
- [ ] Data has units
- [ ] Source attributed
- [ ] Verifiable
- [ ] No vague terms

---

### Strategy 4: Authority Signals (A-Authority)

**Goal**: Build content credibility so AI engines prioritize citing it

**Implementation**:
```typescript
eeat: {
  authorInfo: {
    name: '[Team Name]',
    credentials: ['Credential 1', 'Credential 2']
  },
  externalCitations: [
    { tier: 'tier1', title: 'Official Docs', url: '...' }
  ],
  lastVerified: '2026-01-15'
}
```

---

### Strategy 5: Semantic Structure (O-Organization)

**Goal**: Help AI engines correctly understand content hierarchy

**Hierarchy Rules**:
```
H1: Topic (unique, one per page)
├── H2: Major section
│   ├── H3: Subsection
│   └── H3: Subsection
└── H2: Major section
    └── H3: Subsection
```

**H4 Usage**: Avoid H4 for most content. If deep nesting is needed, consider:
- Restructuring content to reduce depth
- Using bold text instead of H4
- Breaking into multiple pages

**Semantic Markup**:
- Use semantic heading text
- Avoid "Part 1", "Section A" meaningless titles
- Headings should express meaning independently
- H1 → H2 → H3 only (no level skipping, H4 discouraged)

---

## GEO-Specific Schemas

### Speakable Schema

Marks content that can be read by voice assistants.

```typescript
interface SpeakableSchemaProps {
  cssSelector: string[];         // CSS selectors for speakable areas
}
```

```json
{
  "@type": "WebPage",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".direct-answer", ".key-takeaways"]
  }
}
```

### ClaimReview Schema

For fact-check type content.

```typescript
interface ClaimReviewSchemaProps {
  claimReviewed: string;
  reviewRating: {
    ratingValue: number;         // 1-5
    bestRating: number;
    worstRating: number;
    alternateName: string;       // "True", "False", "Mixed"
  };
  itemReviewed: {
    author: { name: string };
    datePublished: string;
  };
}
```

---

## GEO Checklist

### Content Level

```
[ ] First-Paragraph Answer (C01)
    [ ] Under 150 words
    [ ] Contains complete answer
    [ ] Contains key data

[ ] Key Takeaways
    [ ] 5-7 points
    [ ] Each independently understandable
    [ ] Contains specific data

[ ] Citability (R01)
    [ ] Data has units
    [ ] Sources attributed
    [ ] No vague terms

[ ] FAQ Section
    [ ] 5-10 questions (context-dependent)
    [ ] Natural language questions
    [ ] Direct answers
```

### Structure Level

```
[ ] Heading hierarchy correct
[ ] Comparison table complete
[ ] Decision framework clear
[ ] Conclusion explicit
```

### Technical Level

```
[ ] Schema markup complete
[ ] Crawlable by AI engines
[ ] Page load speed
[ ] Mobile-friendly
```

---

## AI Engine Citation Patterns

### ChatGPT/Perplexity Commonly Cite

1. **First-paragraph answer** - Used directly as response
2. **Key Takeaways** - Used as summary
3. **Comparison tables** - For "X vs Y" questions
4. **FAQ sections** - For specific questions
5. **Step lists** - For How-to questions

### Google AI Overview Commonly Cites

1. **First paragraph** - As overview
2. **Lists** - As key points
3. **Tables** - As comparison data
4. **FAQ** - As related questions

---

## Example: GEO-Optimized Blog Structure

```markdown
# How to [Accomplish Task] in 2026

[First-paragraph answer - 150 words, includes method, tool, key data]

## Key Takeaways
- [5-7 independently understandable points]

## Quick Comparison
| Method | Speed | Price | Format |
[Comparison table]

## Method 1: [Tool A] (Recommended)
### Steps
[Numbered steps]

### Why It's Best
[Specific data support]

[More methods...]

## FAQ
### [Natural language question]?
[Direct answer]

[8-10 FAQs]

## Conclusion
[Echo first paragraph + clear recommendation]
```

---

## AI Engine-Specific Optimization

### Google AI Overview (SGE)

**How It Works**: Extracts and synthesizes content from multiple sources.

**Optimization Strategies**:

| Strategy | Implementation | Priority |
|----------|----------------|----------|
| **Direct Answer** | First paragraph answers query directly | ⭐⭐⭐ |
| **Structured Lists** | Use bullet points for key info | ⭐⭐⭐ |
| **Entity Clarity** | Name products/brands precisely | ⭐⭐ |
| **Recency Signals** | Include dates, "2026" in title | ⭐⭐ |
| **Schema Markup** | FAQPage, HowTo, Article schemas | ⭐⭐ |

**What Gets Cited**:
- First paragraph (most common)
- Bulleted lists
- Tables (especially comparison)
- FAQ Q&A pairs

---

### ChatGPT (with Browse)

**How It Works**: Retrieves content via Bing, synthesizes response.

**Optimization Strategies**:

| Strategy | Implementation | Priority |
|----------|----------------|----------|
| **Conversational Answers** | Write as if answering a question | ⭐⭐⭐ |
| **Complete Answers** | Don't require clicks for full info | ⭐⭐⭐ |
| **Citation-Worthy Data** | Specific stats with sources | ⭐⭐ |
| **Step-by-Step** | Clear numbered instructions | ⭐⭐ |

**Best Format for Citation**:
```markdown
[Direct statement]. According to [Source], [specific data point].
For example, [concrete example with numbers].
```

---

### Perplexity AI

**How It Works**: Multi-source synthesis with inline citations.

**Optimization Strategies**:

| Strategy | Implementation | Priority |
|----------|----------------|----------|
| **Unique Data** | Original research, testing results | ⭐⭐⭐ |
| **Clear Attribution** | "(Source: X)" format | ⭐⭐⭐ |
| **Expert Signals** | Author credentials, methodology | ⭐⭐ |
| **Comparison Tables** | Side-by-side feature comparisons | ⭐⭐ |

**What Gets Cited**:
- Pages with original data
- Well-structured comparisons
- Clear methodology sections
- FAQ with specific answers

---

### Claude (Anthropic)

**How It Works**: Focuses on accuracy, cites authoritative sources.

**Optimization Strategies**:

| Strategy | Implementation | Priority |
|----------|----------------|----------|
| **Accuracy First** | Verify all claims | ⭐⭐⭐ |
| **Nuance** | Acknowledge limitations | ⭐⭐ |
| **Primary Sources** | Link to official docs | ⭐⭐ |
| **Balanced View** | Show multiple perspectives | ⭐⭐ |

---

## Cross-Engine Best Practices

### Universal GEO Principles

1. **Answer First, Explain Later**
   - Lead with the answer, not context
   - AI engines extract the first relevant sentence

2. **One Idea Per Paragraph**
   - AI engines chunk by paragraph
   - Mixed paragraphs get partially cited

3. **Use Semantic HTML**
   - `<h2>` not `<div class="heading">`
   - AI engines parse structure semantically

4. **Cite Primary Sources**
   - Link to official docs, not aggregators
   - AI engines evaluate source authority

5. **Include Specific Numbers**
   ```markdown
   ❌ "Very fast processing"
   ✅ "Processes in 2-5 seconds"
   ```

6. **Use Natural Language Questions**
   ```markdown
   ❌ "FAQ: Pricing"
   ✅ "How much does [Product] cost?"
   ```
