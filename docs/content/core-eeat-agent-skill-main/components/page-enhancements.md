# Page Enhancement Components

Reusable page enhancement component Props type reference.

> **Related**: [COMPONENT-MAPPING.md](../COMPONENT-MAPPING.md) for which components to use per content type

---

## SummaryBox

7 summary box variants for article openings or key sections.

### Props

```typescript
type SummaryVariant =
  | 'key-takeaways'     // Blue-purple gradient - Key points
  | 'tldr'              // Amber-orange gradient - Too long; didn't read
  | 'quick-answer'      // Emerald-teal gradient - Quick answer
  | 'verdict'           // Indigo-purple gradient - Verdict/conclusion
  | 'results-dashboard' // Rose-pink gradient - Results dashboard
  | 'at-a-glance'       // Cyan-blue gradient - At a glance
  | 'methodology';      // Teal-green gradient - Methodology

interface SummaryBoxProps {
  variant: SummaryVariant;
  title?: string;                    // Custom title
  items?: string[];                  // Point list
  content?: string | ReactNode;      // Custom content
  metrics?: {                        // Metrics (results-dashboard)
    label: string;
    value: string;
    change?: string;
  }[];
  children?: ReactNode;
}
```

### Usage Scenarios

| Variant | Use Case | Example Title |
|---------|----------|---------------|
| key-takeaways | Article opening points | "Key Takeaways" |
| tldr | Long article summary | "TL;DR" |
| quick-answer | FAQ direct answer | "Quick Answer" |
| verdict | Comparison conclusion | "Our Verdict" |
| results-dashboard | Test results display | "Test Results" |
| at-a-glance | Feature/spec overview | "At a Glance" |
| methodology | Test method explanation | "Our Methodology" |

---

## DataTable

5 data table types for comparison, pricing, and spec displays.

### Props

```typescript
type TableVariant = 'comparison' | 'pricing' | 'specs' | 'before-after' | 'ranking';

interface DataTableProps {
  variant: TableVariant;
  title?: string;
  headers?: string[];                    // Table headers
  comparisonData?: ComparisonRow[];      // comparison variant
  pricingData?: PricingRow[];            // pricing variant
  specsData?: SpecRow[];                 // specs variant
  beforeAfterData?: BeforeAfterRow[];    // before-after variant
  rankingData?: RankingRow[];            // ranking variant
  winner?: number;                       // Highlighted column index
}
```

### Row Data Types

```typescript
// comparison - Feature comparison
interface ComparisonRow {
  feature: string;
  values: (boolean | string)[];  // true/false or text
  highlight?: boolean;
}

// pricing - Pricing plans
interface PricingRow {
  plan: string;
  price: string;
  period?: string;               // "/mo", "/year"
  features: string[];
  recommended?: boolean;
}

// specs - Specifications
interface SpecRow {
  label: string;
  value: string | ReactNode;
}

// before-after - Before/after comparison
interface BeforeAfterRow {
  metric: string;
  before: string;
  after: string;
  improvement?: string;          // "+50%", "-2h"
}

// ranking - Ranking list
interface RankingRow {
  rank: number;
  name: string;
  score: number;
  badge?: string;                // "Best Value", "Editor's Choice"
  highlight?: boolean;
}
```

---

## DirectAnswerBox

GEO-optimized first-screen direct answer component.

### Props

```typescript
interface DirectAnswerBoxProps {
  question?: string;             // Optional question title
  answer: string | ReactNode;    // Direct answer
  highlights?: string[];         // Highlight points
  ctaText?: string;              // CTA button text
  ctaHref?: string;              // CTA link
  variant?: 'default' | 'comparison' | 'recommendation';
}
```

### Variants

| Variant | Use Case | Features |
|---------|----------|----------|
| default | General answer | Simple answer + points |
| comparison | Comparison page | Highlights winner |
| recommendation | Recommendation type | Emphasizes recommended option |

---

## TableOfContents

Auto/manual generated table of contents navigation.

### Props

```typescript
interface TOCItem {
  id: string;      // Anchor ID
  text: string;    // Display text
  level: number;   // Level (2=H2, 3=H3)
}

interface TableOfContentsProps {
  mode?: 'auto' | 'manual' | 'generate';
  items?: TOCItem[];           // Required for manual mode
  title?: string;              // Default "Table of Contents"
  showOnMobile?: boolean;      // Show on mobile
}
```

### Mode Descriptions

| Mode | Description |
|------|-------------|
| auto | Auto-extract H2/H3 from DOM |
| manual | Use passed items |
| generate | Generate from structured data |

---

## MethodologySection

Testing methodology explanation component.

### Props

```typescript
interface MethodologySectionProps {
  title?: string;              // Default "Our Methodology"
  description: string;         // Method description
  criteria: {
    name: string;              // Criterion name
    weight?: string;           // Weight "30%"
    description?: string;      // Criterion description
  }[];
  dataSource?: string;         // Data source
  lastTested?: string;         // Last tested date
  tester?: {
    name: string;
    role?: string;
    avatar?: string;
  };
}
```

---

## ShareButtons

Social share button group.

### Props

```typescript
interface ShareButtonsProps {
  title: string;       // Share title
  url: string;         // Share URL
  content?: string;    // Share description
}
```

### Supported Platforms

- Twitter/X
- LinkedIn
- Reddit
- Copy Link

---

## ArticleRating

Article rating/feedback component.

### Props

```typescript
interface ArticleRatingProps {
  slug: string;                                    // Article identifier
  type?: 'article' | 'page' | 'guide' | 'review'; // Content type
}
```

---

## PageNavigation

Previous/Next article navigation.

### Props

```typescript
interface PageNavigationProps {
  prevPage: { slug: string; title: string } | null;
  nextPage: { slug: string; title: string } | null;
  basePath?: string;   // Default ""
}
```

---

## MobileTOC

Mobile table of contents dropdown component.

### Props

```typescript
interface MobileTOCProps {
  headings: TOCItem[];
  title?: string;
}
```

---

## StepList

Numbered step-by-step guide component.

### Props

```typescript
interface StepItem {
  step: number;
  title: string;
  description: string;
  image?: string;
  tip?: string;
}

interface StepListProps {
  steps: StepItem[];
  variant?: 'numbered' | 'timeline' | 'cards';
}
```

---

## ProConsList

Pros and cons comparison component.

### Props

```typescript
interface ProsConsListProps {
  pros: string[];
  cons: string[];
  title?: string;
  variant?: 'side-by-side' | 'stacked';
}
```

---

## FAQAccordion

FAQ accordion component with JSON-LD support.

### Props

```typescript
interface FAQItem {
  question: string;
  answer: string;
  relatedLink?: string;
}

interface FAQAccordionProps {
  faqs: FAQItem[];
  title?: string;
  includeSchema?: boolean;  // Include FAQPage JSON-LD
}
```

---

## Component Usage Examples

### In Markdown Content

```markdown
## Key Takeaways

- **Fastest Method**: [Tool A] (2-5 seconds, free)
- **Best for [Format]**: [Tool B] (direct download)

[This section rendered by SummaryBox variant="key-takeaways"]
```

### In TypeScript Data

```typescript
// keyTakeaways field rendered by SummaryBox
keyTakeaways: [
  '[Tool A] is the fastest method (2-5 seconds)',
  '[Tool B] is best for [specific format]',
  'All methods support [feature]'
]
```

### Component Composition

```typescript
// Page structure example
<article>
  <DirectAnswerBox answer="..." highlights={[...]} />
  <SummaryBox variant="key-takeaways" items={keyTakeaways} />
  <TableOfContents mode="auto" />

  {/* Main content */}

  <DataTable variant="comparison" comparisonData={...} />
  <FAQAccordion faqs={faqs} includeSchema />
  <ShareButtons title={title} url={url} />
  <PageNavigation prevPage={prev} nextPage={next} />
</article>
```

---

## RelatedResourcesSection

Displays related content links organized by type.

### Props

```typescript
type ResourceType =
  | 'blog'           // Blog posts
  | 'tool'           // Tool pages
  | 'use-case'       // Use case pages
  | 'alternative'    // Alternative/comparison pages
  | 'faq'            // FAQ pages
  | 'integration';   // Integration pages

interface RelatedResource {
  slug: string;
  title: string;
  type: ResourceType;
  description?: string;
}

interface RelatedResourcesSectionProps {
  resources: RelatedResource[];
  title?: string;              // Default "Related Resources"
  maxItems?: number;           // Default 6
  groupByType?: boolean;       // Group by resource type
}
```

### Usage

```typescript
// Auto-generate from content data
function generateRelatedResources(data: BlogPostData): RelatedResource[] {
  return [
    ...data.relatedPosts.map(slug => ({ slug, type: 'blog' as ResourceType })),
    ...data.relatedTools?.map(slug => ({ slug, type: 'tool' as ResourceType })) || [],
    ...data.relatedUseCases?.map(slug => ({ slug, type: 'use-case' as ResourceType })) || [],
  ];
}
```

---

## EEAT Display Components

Components for displaying E-E-A-T trust signals.

### CitationsList

Displays external citations with tier indicators.

```typescript
interface CitationsListProps {
  citations: ExternalCitation[];
  title?: string;              // Default "Sources"
  showTierBadge?: boolean;     // Show tier1/tier2/tier3 badge
  showAccessDate?: boolean;    // Show when source was accessed
}
```

### AuthorCard

Displays author information with credentials.

```typescript
interface AuthorCardProps {
  author: AuthorInfo;
  showCredentials?: boolean;   // Show credential badges
  showSocial?: boolean;        // Show social links
  variant?: 'compact' | 'full';
}
```

### KeyTakeawaysDisplay

Styled key takeaways box for article headers.

```typescript
interface KeyTakeawaysDisplayProps {
  items: string[];
  title?: string;              // Default "Key Takeaways"
  icon?: string;               // Default "lightbulb"
}
```

### VerificationBadge

Shows content verification status.

```typescript
interface VerificationBadgeProps {
  lastVerified: string;        // YYYY-MM-DD
  verifiedBy?: string;         // Who verified
  type?: 'pricing' | 'data' | 'content';
}
```

### EEATSection

Complete EEAT display section combining all signals.

```typescript
interface EEATSectionProps {
  eeat: EEATEnhancement;
  showAuthor?: boolean;
  showCitations?: boolean;
  showVerification?: boolean;
  showDisclaimer?: boolean;
}
```

---

## ReadingProgress

Shows reading progress bar at top of page.

### Props

```typescript
interface ReadingProgressProps {
  color?: string;              // Progress bar color
  height?: number;             // Bar height in pixels (default 3)
  showPercentage?: boolean;    // Show percentage text
}
```

---

## BackToTop

Floating back-to-top button.

### Props

```typescript
interface BackToTopProps {
  showAfter?: number;          // Scroll distance to show (default 300px)
  position?: 'left' | 'right'; // Screen position (default 'right')
  smooth?: boolean;            // Smooth scroll (default true)
}
```

---

## PrintButton

Print-friendly button with custom print styles.

### Props

```typescript
interface PrintButtonProps {
  label?: string;              // Button text (default "Print")
  hideElements?: string[];     // CSS selectors to hide when printing
  includeStyles?: boolean;     // Include print-optimized styles
}
```

---

## Common Page Layouts

### Article Layout

```typescript
<article>
  <ReadingProgress />

  {/* Header */}
  <DirectAnswerBox answer={excerpt} />
  <KeyTakeawaysDisplay items={keyTakeaways} />
  <EEATSection eeat={eeat} showAuthor />

  {/* Navigation */}
  <TableOfContents mode="auto" />

  {/* Content */}
  <div className="prose">
    {content}
  </div>

  {/* Footer */}
  <CitationsList citations={eeat.externalCitations} />
  <RelatedResourcesSection resources={related} />
  <FAQAccordion faqs={faqs} includeSchema />
  <ShareButtons title={title} url={url} />
  <ArticleRating slug={slug} />
  <PageNavigation prevPage={prev} nextPage={next} />

  <BackToTop />
  <PrintButton />
</article>
```

### Comparison Page Layout

```typescript
<article>
  {/* Hero */}
  <DirectAnswerBox variant="comparison" answer={directAnswer} />
  <SummaryBox variant="verdict" content={verdict} />

  {/* Comparison */}
  <DataTable variant="comparison" comparisonData={comparisons} />
  <ProConsList pros={productPros} cons={productCons} />

  {/* Decision Framework */}
  <DecisionFramework options={[competitor, product]} />

  {/* Footer */}
  <FAQAccordion faqs={faqs} includeSchema />
  <VerificationBadge lastVerified={pricingLastVerified} type="pricing" />
</article>
```
