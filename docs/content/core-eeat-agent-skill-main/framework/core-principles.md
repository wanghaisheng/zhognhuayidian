# CORE Principles

GEO (Generative Engine Optimization) content quality framework with four core principles.

> **Related**: [eeat-signals.md](eeat-signals.md) for E-E-A-T trust signals

---

## Overview

| Principle | Full Name | Core Goal | Weight |
|-----------|-----------|-----------|--------|
| **C** | Clarity | Direct answers, scannable | 30% |
| **O** | Organization | Logical structure | 25% |
| **R** | Referenceability | Citable, verifiable | 25% |
| **E** | Exclusivity | Unique value | 20% |

---

## C - Clarity

### Core Concept

Users search to **get answers quickly**, not to read long articles. AI search engines extract first-paragraph content as direct answers.

### Checklist

| ID | Check Item | Requirement | Priority |
|----|------------|-------------|----------|
| C01 | **First-Screen Answer** | First paragraph answers title promise in 150 words | ⭐⭐⭐ |
| C02 | **Intent Alignment** | Title promise = content delivery, no clickbait | ⭐⭐⭐ |
| C03 | **Term Definitions** | Define technical terms on first use | ⭐⭐ |
| C04 | **Scope Boundaries** | Clearly state what is/isn't covered | ⭐⭐ |
| C05 | **Core First** | Most important information comes first | ⭐⭐ |
| C10 | **Conclusion Loop** | End with summary + next steps | ⭐⭐⭐ |

### C01 First-Screen Answer - Details

**Requirement**: First paragraph must directly answer the title's promise within 150 words.

**Why It Matters**:
- Google AI Overview extracts answers from first paragraph
- ChatGPT/Perplexity cite first paragraph as source
- Users decide in 3 seconds whether to continue reading

**Correct Example**:
```markdown
# How to [Accomplish Task] in 2026

The fastest way to [accomplish task] is using **[Tool Name]** -
[brief steps in one sentence]. No account required, completely free.
This guide covers 5 tested methods to [accomplish task], from online
tools to browser extensions.
```

**Wrong Example**:
```markdown
# How to [Accomplish Task] in 2026

[Topic] is a popular platform with billions of users. Many users
want to [accomplish task] for various reasons. In this comprehensive
guide, we will explore different methods... [No direct answer]
```

### C02 Intent Alignment

**Requirement**: What title promises = what content delivers.

**Verification**:
- Title says "5 Methods" → Content has 5 methods
- Title says "Free" → Tools are actually free
- Title says "2026" → Information is up-to-date

### C03 Term Definitions

**Requirement**: Define technical terms on first use.

**Example**:
```markdown
Download the file in SRT (SubRip Subtitle) format, which includes
timestamps for each line.
```

### C10 Conclusion Loop

**Requirement**: Article ending must have:
1. Summary that echoes opening
2. Clear next-step recommendations
3. Optional: CTA (Call to Action)

---

## O - Organization

### Core Concept

Good structure helps users and search engines **quickly locate** needed information.

### Checklist

| ID | Check Item | Requirement | Priority |
|----|------------|-------------|----------|
| O01 | **Heading Hierarchy** | H1 unique, H2→H3 strict nesting, no skipping | ⭐⭐⭐ |
| O02 | **Paragraph Length** | 3-5 sentences per paragraph, single topic | ⭐⭐ |
| O03 | **Logical Order** | Important to secondary, simple to complex | ⭐⭐ |
| O04 | **Bullet Lists** | 3+ parallel points use lists | ⭐⭐⭐ |
| O05 | **Summary Box** | Long articles (>1000 words) need Key Takeaways | ⭐⭐⭐ |
| O06 | **Step Numbers** | Action steps use 1-2-3 numbering | ⭐⭐ |
| O07 | **Table of Contents** | Long articles provide jumpable TOC | ⭐⭐ |

### O01 Heading Hierarchy

**Rules**:
- H1 (`#`) - Only 1 per article
- H2 (`##`) - Major sections
- H3 (`###`) - Subsections
- No skipping: `##` cannot jump to `####`

**Correct**:
```markdown
# Main Title (H1 - Only one)

## Section 1 (H2)

### Subsection 1.1 (H3)

### Subsection 1.2 (H3)

## Section 2 (H2)
```

**Wrong**:
```markdown
# Title

## Section

#### Subsection  ← Wrong: skipped H3
```

### O04 Bullet Lists

**Rule**: 3+ parallel points must use lists, not long paragraphs.

**Correct**:
```markdown
### Features

- Free with unlimited usage
- No account required
- Works with 100+ languages
- Includes timestamps
```

**Wrong**:
```markdown
### Features

This tool is free with unlimited usage, and it doesn't require
an account. It also works with 100+ languages and includes timestamps.
```

### O05 Key Takeaways

**Rule**: Articles over 1000 words must have Key Takeaways after first paragraph.

**Format**:
```markdown
## Key Takeaways

- **Fastest Method**: [Tool A] (2-5 seconds, free)
- **Best for [Format]**: [Tool B] (direct download)
- **All methods work with**: [Feature X] and [Feature Y]
- **No account required**: [Tool A] and [Tool B]
```

---

## R - Referenceability

### Core Concept

Content should be **citable**, **verifiable**, and **reproducible**.

### Checklist

| ID | Check Item | Requirement | Priority |
|----|------------|-------------|----------|
| R01 | **Data Precision** | Numbers must have units, avoid "about" "roughly" | ⭐⭐⭐ |
| R02 | **Source Attribution** | Statistics cite sources | ⭐⭐⭐ |
| R03 | **Valid Links** | All external links accessible | ⭐⭐ |
| R04 | **Entity Precision** | Product/company names in full | ⭐⭐ |
| R05 | **Version Labels** | Note software/API versions | ⭐⭐ |
| R06 | **Reproducible Steps** | Action steps actually work | ⭐⭐⭐ |
| R07 | **Logical Connectors** | Transition words between paragraphs | ⭐⭐ |
| R10 | **Time Stamps** | Mark last update date | ⭐⭐⭐ |

### R01 Data Precision

**Rule**: All numbers must be precise, avoid vague expressions.

**Correct**:
```markdown
- 94% accuracy rate
- 2-5 seconds processing time
- 300 minutes per month (free tier)
- $8.33/month (annual billing)
```

**Wrong**:
```markdown
- Very high accuracy
- Fast processing
- Limited free tier
- Around $10/month
```

### R02 Source Attribution

**Rule**: Statistics must cite sources.

**Format**:
```markdown
95% of viewers retain video content vs 10% for text
(Source: [Research Name])

71% of meetings are considered unproductive
(Source: Harvard Business Review)
```

**TypeScript Implementation**:
```typescript
statistic: {
  value: '95% retention rate',
  source: 'Research Name',
  sourceUrl: 'https://example.com/source'
}
```

### R10 Time Stamps

**Rule**: All content must have last update date.

**Implementation**:
- `updateDate`: Article update date
- `lastVerified`: Data verification date
- `pricingLastVerified`: Pricing verification date

---

## E - Exclusivity

### Core Concept

Content must provide **unique value that other articles don't have**, otherwise there's no reason to exist.

### Checklist

| ID | Check Item | Requirement | Priority |
|----|------------|-------------|----------|
| E01 | **Unique Value** | At least 1 unique insight/data/framework | ⭐⭐⭐ |
| E02 | **Original Data** | Own test data or analysis | ⭐⭐⭐ |
| E03 | **Unique Perspective** | Evidence-based non-mainstream view | ⭐⭐ |
| E04 | **Practical Tools** | Copyable templates/checklists/code | ⭐⭐⭐ |
| E05 | **Deep Analysis** | Not just information aggregation | ⭐⭐ |

### E01 Unique Value - Details

**What Counts as Unique Value**:
1. **Original Test Data**: "We tested 50 videos, accuracy was 94%"
2. **Unique Framework**: "CORE-EEAT Principles"
3. **Exclusive Info**: Comparison dimensions others don't have
4. **Practical Templates**: Directly copyable checklists/code

**Example**:
```markdown
## How We Tested

We tested 10 tools across 50+ videos to find the best options:

| Tool | Accuracy | Speed | Languages |
|------|----------|-------|-----------|
| Tool A | 94% | 2-5 sec | 100+ |
| Tool B | 91% | 5-10 sec | 3 |
```

### E04 Practical Tools

**Types**:
- Checklist (checkable list)
- Template (copyable template)
- Code snippet
- Comparison table

**Example**:
```markdown
## Quick Checklist

- [ ] Verified prerequisites are met
- [ ] Used the correct format
- [ ] Selected the right options
- [ ] Downloaded in preferred format
```

---

## CORE Priority by Content Type

| Content Type | C | O | R | E |
|--------------|---|---|---|---|
| How-To Guide | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| Tool Comparison | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| Alternative Page | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| Use Case Page | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| Best-Of Listicle | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| FAQ Page | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐ |
| Landing Page | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐ |
| Testimonial | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |

### Priority Rationale

| Content Type | Why This Priority |
|--------------|-------------------|
| **How-To Guide** | C+O high: Users need clear, organized steps. R/E moderate: Process clarity > unique data. |
| **Tool Comparison** | R+E high: Unique test data and verifiable pricing are key differentiators. |
| **Alternative Page** | C+R high: Direct answer to "which is better" + cited competitor data. |
| **Use Case Page** | R high: Industry statistics prove value proposition. |
| **Best-Of Listicle** | O+R+E high: Ranking requires structure, data, and original methodology. |
| **FAQ Page** | C high: Direct answers to questions. E low: Answering questions, not creating new insights. |
| **Landing Page** | C high: Value proposition must be immediately clear. Features over data. |
| **Testimonial** | R+E high: Verified results and unique customer story are the content's value. |
