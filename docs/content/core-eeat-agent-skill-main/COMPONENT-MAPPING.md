# Component & Schema Mapping Guide

Quick reference for which components and schemas to use per content type.

---

## Component Mapping by Content Type

### Blog Post

| Component | Required | Props Source |
|-----------|----------|--------------|
| DirectAnswerBox | ✓ | `excerpt` field |
| SummaryBox (key-takeaways) | ✓ | `keyTakeaways` field |
| TableOfContents | ✓ | Auto-generated |
| FAQAccordion | ✓ | `faqs` in content |
| DataTable (comparison) | If comparing | Content tables |
| MethodologySection | If testing | Content section |
| ShareButtons | ✓ | `title`, `slug` |
| ArticleRating | ✓ | `slug` |
| PageNavigation | ✓ | Previous/next posts |
| CitationsList | If citations | `eeat.externalCitations` |
| AuthorCard | Optional | `eeat.authorInfo` |
| RelatedResourcesSection | ✓ | `relatedPosts`, `relatedTools` |

### Alternative Page

| Component | Required | Props Source |
|-----------|----------|--------------|
| DirectAnswerBox (comparison) | ✓ | `directAnswer` field |
| SummaryBox (verdict) | ✓ | `verdict` field |
| DataTable (comparison) | ✓ | `comparisons` field |
| ProConsList | ✓ | `competitorPros`, `competitorCons` |
| FAQAccordion | ✓ | `faqs` field |
| VerificationBadge | ✓ | `pricingLastVerified` |
| CitationsList | ✓ | Competitor pricing sources |

### Use Case Page

| Component | Required | Props Source |
|-----------|----------|--------------|
| SummaryBox (key-takeaways) | ✓ | `keyTakeaways` field |
| DataTable (specs) | Optional | `benefits` with stats |
| StepList | ✓ | `steps` field |
| FAQAccordion | ✓ | `faqs` field |
| RelatedResourcesSection | ✓ | `relatedTools`, `relatedUseCases` |

### Best-Of Listicle

| Component | Required | Props Source |
|-----------|----------|--------------|
| DirectAnswerBox | ✓ | `introduction` (first paragraph) |
| SummaryBox (key-takeaways) | ✓ | `keyTakeaways` field |
| DataTable (ranking) | ✓ | `tools` field |
| DataTable (comparison) | ✓ | `comparisonTable` field |
| FAQAccordion | ✓ | `faqs` field |
| MethodologySection | ✓ | `selectionCriteria` field |

### FAQ Page

| Component | Required | Props Source |
|-----------|----------|--------------|
| FAQAccordion (with schema) | ✓ | `faqs` field, `includeSchema=true` |
| RelatedResourcesSection | Optional | `relatedArticles`, `relatedFAQs` |

### Landing/Tool Page

| Component | Required | Props Source |
|-----------|----------|--------------|
| SummaryBox (at-a-glance) | Optional | `features` summary |
| DataTable (specs) | Optional | Feature comparison |
| StepList | ✓ | `howItWorks` field |
| FAQAccordion | ✓ | `faqs` field |

### Testimonial Page

| Component | Required | Props Source |
|-----------|----------|--------------|
| SummaryBox (results-dashboard) | ✓ | `keyResults` field |
| DataTable (before-after) | ✓ | `beforeAfter` field |
| FAQAccordion | ✓ | `faqs` field |
| VerificationBadge | ✓ | `user.isVerified`, `lastVerified` |

### Utility Components (All Content Types)

| Component | When to Use | Props |
|-----------|-------------|-------|
| ReadingProgress | Long-form content (>1500 words) | Auto-detects scroll |
| PrintButton | Reference content (guides, checklists) | n/a |
| BackToTop | All pages | Auto-shows on scroll |
| CopyCodeButton | Code snippets | Auto-attaches to code blocks |

**Recommendation**:
- Blog posts (guides, tools): Include ReadingProgress + PrintButton
- FAQ pages: PrintButton only
- Landing pages: Neither (short content)

---

## Schema Mapping by Content Type

### Blog Post

| Schema | Required | Condition |
|--------|----------|-----------|
| ArticleSchema | ✓ | Always |
| BreadcrumbSchema | ✓ | Always |
| FAQSchema | If FAQ | Has FAQ section |
| HowToSchema | If guide | Category = `guides` |
| VideoSchema | If video | Embedded video |
| ReviewSchema | If review | Category = `tools` with ratings |

### Alternative Page

| Schema | Required | Condition |
|--------|----------|-----------|
| ComparisonSchema | ✓ | Always |
| BreadcrumbSchema | ✓ | Always |
| FAQSchema | ✓ | Always has FAQ |
| AggregateRatingSchema | Optional | If showing ratings |

### Use Case Page

| Schema | Required | Condition |
|--------|----------|-----------|
| WebPageSchema | ✓ | Always |
| BreadcrumbSchema | ✓ | Always |
| FAQSchema | ✓ | Always has FAQ |

### Best-Of Listicle

| Schema | Required | Condition |
|--------|----------|-----------|
| ItemListSchema | ✓ | Always |
| BreadcrumbSchema | ✓ | Always |
| FAQSchema | ✓ | Always has FAQ |
| AggregateRatingSchema | Per tool | Each tool with rating |

### FAQ Page

| Schema | Required | Condition |
|--------|----------|-----------|
| FAQPageSchema | ✓ | Always (full page) |
| BreadcrumbSchema | ✓ | Always |

### Landing/Tool Page

| Schema | Required | Condition |
|--------|----------|-----------|
| SoftwareApplicationSchema | ✓ | Always |
| BreadcrumbSchema | ✓ | Always |
| FAQSchema | ✓ | Always has FAQ |
| WebPageSchema | Optional | Additional metadata |

### Testimonial Page

| Schema | Required | Condition |
|--------|----------|-----------|
| ReviewSchema | ✓ | Always |
| BreadcrumbSchema | ✓ | Always |
| FAQSchema | If FAQ | Has FAQ section |
| PersonSchema | Optional | For verified user |

---

## Data Field to Component Props Mapping

| Data Field | Component | Prop Name |
|------------|-----------|-----------|
| `keyTakeaways` | SummaryBox | `items` |
| `excerpt` | DirectAnswerBox | `answer` |
| `directAnswer` | DirectAnswerBox | `answer` |
| `faqs` | FAQAccordion | `faqs` |
| `comparisons` | DataTable | `comparisonData` |
| `steps` | StepList | `steps` |
| `howItWorks` | StepList | `steps` |
| `beforeAfter` | DataTable | `beforeAfterData` |
| `tools` | DataTable | `rankingData` |
| `eeat.externalCitations` | CitationsList | `citations` |
| `eeat.authorInfo` | AuthorCard | `author` |
| `lastVerified` | VerificationBadge | `lastVerified` |
| `relatedPosts` + `relatedTools` | RelatedResourcesSection | `resources` (generated) |

---

## Component Variant Selection

### SummaryBox Variants

| Variant | Use When |
|---------|----------|
| `key-takeaways` | Article opening, after DirectAnswerBox |
| `tldr` | Very long articles (>3000 words) |
| `quick-answer` | FAQ pages, simple answers |
| `verdict` | Comparison/alternative page conclusions |
| `results-dashboard` | Testimonials, case studies with metrics |
| `at-a-glance` | Tool pages, feature overview |
| `methodology` | Testing/research methodology explanation |

### DirectAnswerBox Variants

| Variant | Use When |
|---------|----------|
| `default` | General articles, how-to guides |
| `comparison` | Alternative pages, tool vs tool |
| `recommendation` | Best-of listicles, tool recommendations |

### DataTable Variants

| Variant | Use When |
|---------|----------|
| `comparison` | Feature comparison across products |
| `pricing` | Pricing plan comparison |
| `specs` | Technical specifications |
| `before-after` | Testimonials, case studies |
| `ranking` | Best-of listicles with rankings |

---

## Citation Tier Requirements

> **Single Source of Truth**: See `framework/quality-technical.md` for the complete Citation Tier Requirements table with detailed notes per content type.

---

## Verification Schedule

| Field Type | Verify Every | Notes |
|------------|--------------|-------|
| `pricingLastVerified` | Monthly | Check official pricing pages |
| `lastVerified` (stats) | Quarterly | Verify statistics still accurate |
| `lastVerified` (features) | Monthly | Check feature availability |
| `updateDate` | On any change | Update when content changes |
| `accessDate` (citations) | On use | When you access the source |

**Verification Workflow**:
1. Open citation URL
2. Confirm data still matches
3. Update `accessDate` to today
4. Update `lastVerified` in content
5. Note any changes in commit message

---

## Internal Link Field Standards

### Field Definitions

| Field | Points To | Description |
|-------|-----------|-------------|
| `relatedPosts` | BlogPostData slugs | Related blog articles |
| `relatedTools` | ToolPageData slugs | Related tool/product pages |
| `relatedUseCases` | UseCasePageData slugs | Related use case pages |
| `relatedAlternatives` | AlternativePageData slugs | Related comparison pages |
| `relatedFAQs` | FAQPageData slugs | Related FAQ pages |
| `relatedArticles` | Any content slugs | Generic related content |
| `relatedProducts` | ToolPageData slugs | **Deprecated**: Use `relatedTools` |

### Field Applicability by Content Type

| Content Type | relatedPosts | relatedTools | relatedUseCases | relatedAlternatives | relatedFAQs |
|--------------|--------------|--------------|-----------------|---------------------|-------------|
| **Blog** | ✓ (3-5) | ✓ (1-3) | ✓ (1-3) | ✓ (0-2) | ✓ (0-2) |
| **Alternative** | ✓ (2-3) | ✓ (1-2) | - | - | ✓ (1-2) |
| **Use Case** | ✓ (2-3) | ✓ (1-3) | ✓ (2-3) | - | - |
| **FAQ** | ✓ (2-3) | ✓ (1-2) | - | - | ✓ (2-3) |
| **Best-Of** | ✓ (2-3) | ✓ (1-2) | - | - | - |
| **Testimonial** | ✓ (2-3) | ✓ (1) | ✓ (1-2) | - | - |
| **Landing** | ✓ (2-3) | ✓ (1-3) | ✓ (1-3) | - | - |

**Notes**:
- Numbers in parentheses = recommended count range
- `relatedProducts` is legacy; migrate to `relatedTools`
- `-` means field not typically used for this content type
- Empty arrays `[]` should be omitted, not included

---

## Gradient Color Reference

Standard gradient classes for page headers/heroes.

### Available Gradients

| Name | Class | Use Case |
|------|-------|----------|
| Blue-Purple | `from-blue-500 to-purple-500` | Default, tools, guides |
| Green-Teal | `from-green-500 to-teal-500` | Success, growth, eco |
| Amber-Orange | `from-amber-500 to-orange-500` | Warnings, energy, creative |
| Purple-Pink | `from-purple-500 to-pink-500` | Premium, AI, innovation |
| Blue-Cyan | `from-blue-500 to-cyan-500` | Tech, water, fresh |
| Red-Orange | `from-red-500 to-orange-500` | Urgent, hot, competitive |
| Indigo-Purple | `from-indigo-500 to-purple-500` | Deep tech, enterprise |
| Emerald-Green | `from-emerald-500 to-green-500` | Nature, health, positive |

### Content Type Recommendations

| Content Type | Recommended Gradient |
|--------------|---------------------|
| Blog (guides) | `from-blue-500 to-purple-500` |
| Blog (tools) | `from-indigo-500 to-purple-500` |
| Blog (growth) | `from-green-500 to-teal-500` |
| Blog (ai-features) | `from-purple-500 to-pink-500` |
| Blog (insights) | `from-blue-500 to-cyan-500` |
| Alternative | `from-amber-500 to-orange-500` |
| Use Case (education) | `from-blue-500 to-purple-500` |
| Use Case (business) | `from-indigo-500 to-purple-500` |
| Use Case (creators) | `from-purple-500 to-pink-500` |
| FAQ | `from-blue-500 to-cyan-500` |
| Best-Of | `from-amber-500 to-orange-500` |
| Testimonial | `from-green-500 to-teal-500` |
| Landing | `from-blue-500 to-purple-500` |

### Usage

```typescript
// In content data
gradient: 'from-blue-500 to-purple-500',

// In component
<div className={`bg-gradient-to-r ${gradient}`}>
  ...
</div>
```

---

## A/B Testing Guide

### What to Test

| Element | Test Variants | Impact |
|---------|---------------|--------|
| **Title** | Number vs no number, question vs statement | CTR |
| **First paragraph** | Short vs detailed answer | Bounce rate |
| **Key Takeaways** | 5 vs 7 items, with/without icons | Time on page |
| **CTA** | Text, color, placement | Conversion |
| **FAQ count** | 5 vs 8 questions | Engagement |

### Test Setup

```typescript
// Variant A (Control)
export const blogPostA: BlogPostData = {
  slug: 'how-to-guide',
  title: 'How to Download YouTube Subtitles',
  // ...
};

// Variant B (Test)
export const blogPostB: BlogPostData = {
  slug: 'how-to-guide',
  title: '5 Ways to Download YouTube Subtitles (2026)',
  // ...
};

// AB test config
{
  testId: 'title-format-001',
  variants: ['A', 'B'],
  trafficSplit: [50, 50],
  metric: 'ctr',
  duration: '2 weeks',
  minSampleSize: 1000
}
```

### Test Results Template

```markdown
## Test: [Test Name]

**Hypothesis**: [What you expected]
**Duration**: [Start] - [End]
**Sample Size**: [Number per variant]

| Metric | Control (A) | Test (B) | Difference | Significant? |
|--------|-------------|----------|------------|--------------|
| CTR | X% | Y% | +Z% | Yes/No |
| Bounce | X% | Y% | -Z% | Yes/No |

**Winner**: [A/B/Tie]
**Action**: [Roll out B / Keep A / Further test]
```
