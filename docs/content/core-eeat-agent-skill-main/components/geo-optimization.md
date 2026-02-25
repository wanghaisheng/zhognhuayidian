# GEO Optimization Components

Generative Engine Optimization - Component reference for AI search engines (ChatGPT, Perplexity, Google AI Overview, Claude).

> **Related Files**:
> - [geo-strategies.md](geo-strategies.md) - Strategies and AI engine optimization
> - [geo-measurement.md](geo-measurement.md) - Metrics and testing

---

## GEO vs SEO Comparison

| Dimension | SEO (Traditional Search) | GEO (AI Search) |
|-----------|-------------------------|-----------------|
| **Target Engines** | Google, Bing | ChatGPT, Perplexity, AI Overview |
| **Optimization Goal** | Rank on first page | Be cited as source |
| **Core Signals** | Keywords, backlinks, structured data | Clarity, citability, authority |
| **Key Positions** | Title, H1, first paragraph | First-paragraph answer, Key Takeaways |
| **Data Format** | JSON-LD Schema | Natural language + structured data |

---

## GEO CORE Components

### DirectAnswerBox

First-screen direct answer component, satisfies CORE C01 principle.

```typescript
interface DirectAnswerBoxProps {
  question?: string;             // Optional question title
  answer: string | ReactNode;    // Direct answer (150 words max)
  highlights?: string[];         // Highlight points (3-5)
  ctaText?: string;              // CTA button
  ctaHref?: string;              // CTA link
  variant?: 'default' | 'comparison' | 'recommendation';
}
```

**Variants**:

| Variant | Use Case | Example |
|---------|----------|---------|
| `default` | General answer | "The best method is..." |
| `comparison` | Comparison conclusion | "[Product A] wins for..." |
| `recommendation` | Recommendation | "We recommend X for..." |

**Markdown Implementation**:

```markdown
> **TL;DR:** [Product A] is the best free alternative to [Product B]
> for [use case]. It's completely free, requires no account, and
> delivers 94% accuracy in 2-5 seconds.
```

---

### KeyTakeawaysBox

Key takeaways summary, commonly cited by AI engines.

```typescript
interface KeyTakeawaysBoxProps {
  items: string[];               // 5-7 key points
  title?: string;                // Default "Key Takeaways"
}
```

**Format Requirements**:

```markdown
## Key Takeaways

- **[Point 1]**: [Specific conclusion with data]
- **[Point 2]**: [Specific conclusion]
- **[Point 3]**: [Specific conclusion]
```

**Best Practices**:
- Each point independently understandable
- Include specific data (numbers, percentages)
- Avoid vague expressions
- 5-7 points optimal

---

### ComparisonMatrix

Comparison matrix, commonly used by AI engines for "X vs Y" questions.

```typescript
interface ComparisonMatrixProps {
  headers: string[];             // [Feature, ToolA, ToolB, Winner]
  rows: ComparisonRow[];
  highlightWinner?: boolean;
}

interface ComparisonRow {
  feature: string;
  values: (string | boolean)[];
  winner?: 'a' | 'b' | 'tie';
}
```

**Markdown Format**:

```markdown
| Feature | Product A | Product B | Winner |
|---------|-----------|-----------|--------|
| Price | Free | $8.33/mo | Product A |
| Feature X | Direct support | Limited | Product A |
| Feature Y | No | Yes | Product B |
```

---

### QuickFactsBox

Quick facts box, used by AI engines to extract specific data.

```typescript
interface QuickFactsBoxProps {
  facts: {
    label: string;
    value: string;
    source?: string;
  }[];
}
```

**Markdown Format**:

```markdown
**Quick Facts:**
- **Price**: Free (unlimited)
- **Accuracy**: 94%
- **Speed**: 2-5 seconds
- **Languages**: 100+
```

---

### DecisionFramework

Decision framework, helps AI engines answer "Should I use X or Y?" questions.

```typescript
interface DecisionFrameworkProps {
  options: {
    name: string;
    bestFor: string[];
    notIdealFor: string[];
  }[];
}
```

**Markdown Format**:

```markdown
## Who Should Choose [Product A]

[Product A] is the better choice if you:
- Need [specific feature]
- Want a free tool with no limits
- Prefer no-account access

## Who Should Choose [Product B]

[Product B] is the better choice if you:
- Need [different feature]
- Require team collaboration features
- Have [specific integration] needs
```

---

### FAQAccordion (GEO Critical)

FAQ sections are heavily cited by AI engines for question-answer extraction.

```typescript
interface FAQAccordionProps {
  items: FAQItem[];
  includeSchema?: boolean;       // Add FAQPage schema (default: true)
}
```

**GEO Optimization**:
- Use natural language questions (how users actually ask)
- Start answers with direct response, then elaborate
- Keep answers 2-4 sentences for clean extraction
- Include specific data in answers

```markdown
### Can I download subtitles without an account?

Yes, NoteLM allows unlimited subtitle downloads without creating an account.
Simply paste the video URL and click "Download" - no signup required.
```

---

### StepList (GEO Critical)

Numbered steps are used for HowTo extraction by AI engines.

```typescript
interface StepListProps {
  steps: {
    step: number;
    title: string;
    description: string;
  }[];
}
```

**GEO Optimization**:
- Number steps explicitly (1, 2, 3...)
- Each step title is self-explanatory
- Include expected outcomes or time per step

```markdown
## How to Download YouTube Subtitles

1. **Copy the video URL** - Navigate to YouTube and copy the video link
2. **Paste into NoteLM** - Open notelm.ai and paste the URL
3. **Select format** - Choose SRT or TXT format
4. **Download** - Click download and save to your device
```

---

### DataTable (GEO Critical)

Comparison tables are commonly extracted by AI engines for "X vs Y" queries.

```typescript
interface DataTableProps {
  headers: string[];
  rows: (string | boolean)[][];
  variant?: 'comparison' | 'pricing' | 'specs' | 'before-after';
}
```

**GEO Optimization**:
- Include "Winner" column for comparisons
- Use ✓/✗ or Yes/No for boolean features
- Add specific numbers, not vague terms
- Keep tables under 15 rows for clean extraction

---

### MethodologySection (GEO Trust)

Transparency about testing methodology builds AI engine trust.

```typescript
interface MethodologySectionProps {
  title?: string;                // Default "How We Tested"
  methodology: string;
  testParameters?: string[];
  testPeriod?: string;
  sampleSize?: number;
}
```

**Markdown Format**:
```markdown
## How We Tested

We tested 10 transcription tools across 50 videos over 2 weeks:

**Test Parameters:**
- 50 videos (5-90 minutes each)
- 8 content categories
- 3 languages (English, Spanish, Chinese)

**Evaluation Criteria:**
- Accuracy (word error rate)
- Speed (time to completion)
- Language support
```

---

## Component Selection Guide

| User Query Type | Primary Component | Supporting Components |
|-----------------|-------------------|----------------------|
| "How do I..." | StepList | FAQAccordion, DirectAnswerBox |
| "X vs Y" | ComparisonMatrix | DecisionFramework, DataTable |
| "What is the best..." | DirectAnswerBox | KeyTakeawaysBox, DataTable |
| "Should I use..." | DecisionFramework | ComparisonMatrix, FAQAccordion |
| "Quick facts about..." | QuickFactsBox | KeyTakeawaysBox |
| "Explain..." | DirectAnswerBox | FAQAccordion |

---

## Component Priority by Content Type

| Content Type | Must Have | Recommended | Optional |
|--------------|-----------|-------------|----------|
| **Blog (guides)** | DirectAnswerBox, StepList | KeyTakeawaysBox, FAQAccordion | ComparisonMatrix |
| **Blog (tools)** | ComparisonMatrix, DataTable | KeyTakeawaysBox, DecisionFramework | MethodologySection |
| **Alternative** | ComparisonMatrix, DecisionFramework | DirectAnswerBox, FAQAccordion | QuickFactsBox |
| **Best-Of** | DataTable, KeyTakeawaysBox | MethodologySection, FAQAccordion | ComparisonMatrix |
| **Use Case** | DirectAnswerBox, StepList | FAQAccordion | QuickFactsBox |
| **FAQ** | FAQAccordion | DirectAnswerBox | - |
