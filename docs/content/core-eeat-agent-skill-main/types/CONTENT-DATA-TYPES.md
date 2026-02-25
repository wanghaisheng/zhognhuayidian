# Content Data Types Reference

Universal TypeScript data structure definitions for all content types.
These types are framework-level and project-agnostic.

## Date Field Convention

- `lastUpdated`: When content text was last modified (editorial changes)
- `lastVerified`: When data/facts were last verified for accuracy
- `publishDate` / `updateDate`: Blog-specific publication dates
- `pricingLastVerified`: Alternative pages - when pricing was checked
- `accessDate`: Citation-specific - when source was accessed

Use `lastUpdated` for content freshness, `lastVerified` for data accuracy.

## Project-Specific Type Extension

This framework uses generic names like `product` and `competitor`. Projects should create type aliases in their project-specific data skill:

```typescript
// In your-project/types.ts

// Option 1: Type alias for semantic clarity
type MyComparisonWinner = 'competitor' | 'notelm' | 'tie';

// Option 2: Extend the interface with project-specific fields
interface MyAlternativePageData extends AlternativePageData {
  notelmBestFor: string[];  // Rename productBestFor
}

// Option 3: Create a mapped type for field renaming
type RenameField<T, K extends keyof T, N extends string> =
  Omit<T, K> & { [P in N]: T[K] };

type MyComparison = RenameField<ComparisonItem, 'product', 'notelm'>;
```

The framework uses `product` as placeholder. Replace with your brand name (e.g., `notelm`, `acme`, `myapp`) in your implementation.

---

## E-E-A-T Types

### CitationTier

```typescript
type CitationTier = 'tier1' | 'tier2' | 'tier3';
```

### ExternalCitation

```typescript
interface ExternalCitation {
  title: string;
  url: string;
  tier: CitationTier;
  accessDate: string;        // YYYY-MM-DD
  description?: string;
}
```

### AuthorInfo

```typescript
interface AuthorInfo {
  name: string;
  bio: string;
  title?: string;
  avatar?: string;
  credentials?: string[];
  linkedIn?: string;
  twitter?: string;
  website?: string;
}
```

### EEATEnhancement

```typescript
interface EEATEnhancement {
  authorInfo?: AuthorInfo;
  externalCitations?: ExternalCitation[];
  lastVerified?: string;
  dataDisclaimer?: string;
  keyTakeaways?: string[];
}
```

---

## Blog Post

### BlogCategory

Blog post categories:
- **guides**: Step-by-step tutorials, how-to guides, problem-solving
- **tools**: Tool comparisons, reviews, recommendations
- **growth**: Channel growth, monetization, SEO optimization
- **ai-features**: AI-powered features, automation, productivity
- **insights**: Industry trends, statistics, data-driven analysis

```typescript
type BlogCategory = 'guides' | 'tools' | 'growth' | 'ai-features' | 'insights';
```

### BlogPostData

```typescript
interface BlogPostData {
  // Basic
  slug: string;
  category: BlogCategory;
  title: string;                   // < 60 chars
  excerpt: string;                 // 150 words max, direct answer
  metaDescription: string;         // < 160 chars

  // SEO
  keywords: string[];              // 5-10 keywords
  targetKeyword: string;
  monthlySearchVolume?: number;

  // Time
  publishDate: string;             // YYYY-MM-DD
  updateDate: string;
  readTime: number;                // minutes

  // Content
  author: string;
  content: string;                 // Markdown

  // Internal Links
  relatedPosts: string[];
  relatedTools?: string[];
  relatedUseCases?: string[];
  relatedIntegrations?: string[];
  relatedAlternatives?: string[];
  relatedFAQs?: string[];

  // EEAT
  eeat?: EEATEnhancement;
  keyTakeaways?: string[];         // 5-7 items
  lastVerified?: string;
}
```

---

## Alternative Page (Competitor Comparison)

### ComparisonWinner

```typescript
type ComparisonWinner = 'competitor' | 'product' | 'tie';
```

### ComparisonItem

```typescript
interface ComparisonItem {
  feature: string;
  competitor: string;
  product: string;
  winner: ComparisonWinner;
}
```

### ReasonItem

```typescript
interface ReasonItem {
  title: string;
  description: string;
  icon: string;
}
```

### AlternativePageData

```typescript
interface AlternativePageData {
  slug: string;
  competitorName: string;
  competitorDescription: string;
  title: string;
  tagline: string;
  metaDescription: string;
  keywords: string[];
  targetKeyword: string;
  monthlySearchVolume?: number;
  gradient: string;

  // GEO CORE
  directAnswer?: string;
  comparisons: ComparisonItem[];     // 10-15 rows
  reasons: ReasonItem[];             // 4 items

  // Fair Analysis
  competitorPros?: string[];         // 3 items
  competitorCons?: string[];         // 3 items
  competitorBestFor?: string[];
  productBestFor?: string[];
  verdict?: string;

  // Pricing Verification
  competitorPricingUrl?: string;
  pricingLastVerified?: string;

  // FAQ
  faqs: FAQItem[];

  // EEAT
  keyTakeaways?: string[];
  eeat?: EEATEnhancement;
}
```

---

## Use Case Page

### UseCaseCategory

Use case page categories:
- **education**: Students, researchers, educators
- **business**: Teams, enterprises, professionals
- **content-creators**: YouTubers, podcasters, streamers
- **personal**: Individual productivity, hobbyists

```typescript
type UseCaseCategory = 'education' | 'business' | 'content-creators' | 'personal';
```

### StatisticData

```typescript
interface StatisticData {
  value: string;
  source: string;
  sourceUrl?: string;
}
```

### BenefitItem

```typescript
interface BenefitItem {
  title: string;
  description: string;
  icon: string;
  statistic?: StatisticData;
}
```

### FeatureItem

```typescript
interface FeatureItem {
  title: string;
  description: string;
}
```

### StepItem

```typescript
interface StepItem {
  step: number;
  title: string;
  description: string;
}
```

### TestimonialItem

```typescript
interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  avatar?: string;
  isVerified?: boolean;
}
```

### IndustryStat

```typescript
interface IndustryStat {
  stat: string;
  source: string;
  sourceUrl?: string;
}
```

### UseCasePageData

```typescript
interface UseCasePageData {
  slug: string;
  category: UseCaseCategory;
  name: string;
  tagline: string;
  description: string;
  metaDescription: string;
  keywords: string[];
  targetKeyword: string;
  monthlySearchVolume?: number;
  icon: string;
  gradient: string;
  heroImage?: string;

  benefits: BenefitItem[];           // 5-7 items
  features: FeatureItem[];           // 4-6 items
  steps: StepItem[];                 // 3-5 items
  testimonial?: TestimonialItem;
  faqs: FAQItem[];
  industryStats?: IndustryStat[];

  relatedProducts: string[];
  relatedTools: string[];
  relatedUseCases: string[];

  eeat?: EEATEnhancement;
  keyTakeaways?: string[];
  lastVerified?: string;
}
```

---

## FAQ Page

### FAQItem

```typescript
interface FAQItem {
  question: string;
  answer: string;
  relatedLink?: string;
}
```

### FAQPageData

```typescript
interface FAQPageData {
  slug: string;
  toolSlug: string;
  toolName: string;
  topic: string;
  title: string;
  metaDescription: string;
  keywords: string[];
  targetKeyword: string;
  monthlySearchVolume?: number;
  gradient: string;
  introduction: string;
  faqs: FAQItem[];
  relatedFAQs?: string[];
  relatedArticles?: string[];
  eeat?: EEATEnhancement;
  lastUpdated: string;
}
```

---

## Best-Of Page (Listicle)

### PricingType

```typescript
type PricingType = 'free' | 'freemium' | 'paid' | 'enterprise';
```

### BestOfTool

```typescript
interface BestOfTool {
  rank: number;
  name: string;
  slug?: string;
  description: string;
  rating: number;
  pricingType: PricingType;
  pricing: string;
  pros: string[];
  cons: string[];
  bestFor: string;
  isOwnProduct: boolean;
  officialUrl?: string;
}
```

### BestOfPageData

```typescript
interface BestOfPageData {
  slug: string;
  title: string;
  tagline: string;
  introduction: string;
  gradient: string;
  tools: BestOfTool[];
  keyTakeaways?: string[];
  selectionCriteria?: string[];
  comparisonTable: {
    feature: string;
    values: Record<string, string | boolean>;
  }[];
  faqs: FAQItem[];
  authorNote?: string;
  relatedTools?: string[];
  eeat?: EEATEnhancement;
  lastUpdated: string;
  monthlySearchVolume?: number;
}
```

---

## Tool/Landing Page

### ToolStatus

```typescript
type ToolStatus = 'live' | 'redirect' | 'coming-soon';
```

### ToolType

```typescript
type ToolType = 'interactive' | 'landing';
```

### ToolFeature

```typescript
interface ToolFeature {
  title: string;
  description: string;
  icon: string;
}
```

### HowItWorksStep

```typescript
interface HowItWorksStep {
  step: number;
  title: string;
  description: string;
}
```

### ToolPageData

```typescript
interface ToolPageData {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  metaDescription: string;
  keywords: string[];
  targetKeyword: string;
  monthlySearchVolume?: number;
  icon: string;
  gradient: string;

  features: ToolFeature[];
  howItWorks?: HowItWorksStep[];
  faqs: FAQItem[];

  relatedTools?: string[];
  relatedProducts?: string[];
  useCases?: string[];

  status?: ToolStatus;
  toolType?: ToolType;
  ctaText?: string;
  externalUrl?: string;

  poweredBy?: {
    slug: string;
    name: string;
  };

  eeat?: EEATEnhancement;
  keyTakeaways?: string[];
  lastVerified?: string;
}
```

---

## Testimonial/Case Study Page

### BeforeAfterMetric

```typescript
interface BeforeAfterMetric {
  metric: string;
  before: string;
  after: string;
  improvement: string;
}
```

### TestimonialUser

```typescript
interface TestimonialUser {
  name: string;
  title: string;
  company?: string;
  location?: string;
  background?: string;
  isVerified: boolean;
  verificationNote?: string;
}
```

### KeyResult

```typescript
interface KeyResult {
  value: string;
  metric: string;
  context?: string;
  icon?: string;
}
```

### TestimonialPageData

```typescript
interface TestimonialPageData {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  gradient: string;
  industry: string;
  tool: string;
  user: TestimonialUser;
  quote: string;
  extendedQuote?: string;
  keyResults: KeyResult[];
  challenge: {
    title: string;
    description: string;
    painPoints: string[];
  };
  solution: {
    title: string;
    description: string;
    howTheyUsedIt: string[];
  };
  beforeAfter?: BeforeAfterMetric[];
  storyContent: {
    background?: string;
    discovery?: string;
    implementation?: string;
    results?: string;
    future?: string;
  };
  keyTakeaways: string[];
  faqs: FAQItem[];
  eeat?: EEATEnhancement;
  lastVerified?: string;
}
```

---

## Usage in Code

When creating content data objects, use these type definitions:

```typescript
// Example: Blog post
const myBlogPost: BlogPostData = {
  slug: 'how-to-download-youtube-videos',
  category: 'guides',
  title: 'How to Download YouTube Videos in 2026',
  excerpt: 'Learn the easiest ways to download YouTube videos...',
  metaDescription: 'Complete guide to downloading YouTube videos...',
  keywords: ['youtube download', 'video downloader', 'save youtube'],
  targetKeyword: 'how to download youtube videos',
  monthlySearchVolume: 74000,
  publishDate: '2026-01-15',
  updateDate: '2026-01-15',
  readTime: 8,
  author: 'NoteLM Team',
  content: '...',
  relatedPosts: ['youtube-transcript-download', 'youtube-subtitle-extractor'],
};
```

```typescript
// Example: Alternative page
const myAlternativePage: AlternativePageData = {
  slug: 'notegpt-alternative',
  competitorName: 'NoteGPT',
  competitorDescription: 'AI-powered note-taking tool for YouTube videos',
  title: 'NoteLM vs NoteGPT: Free Alternative Comparison',
  tagline: 'Compare NoteLM and NoteGPT features, pricing, and capabilities',
  metaDescription: 'Detailed comparison of NoteLM vs NoteGPT...',
  keywords: ['notegpt alternative', 'notelm vs notegpt'],
  targetKeyword: 'notegpt alternative',
  monthlySearchVolume: 8100,
  gradient: 'from-purple-500/20 to-pink-500/20',
  directAnswer: 'NoteLM offers 100% free YouTube AI tools with unlimited usage...',
  comparisons: [
    {
      feature: 'Pricing',
      competitor: 'Freemium ($9.99-19.99/mo)',
      product: '100% Free Forever',
      winner: 'product',
    },
    // ... more comparisons
  ],
  reasons: [
    {
      title: 'Always Free',
      description: 'No subscription fees or usage limits',
      icon: 'Gift',
    },
    // ... more reasons
  ],
  faqs: [
    {
      question: 'Is NoteLM really free?',
      answer: 'Yes, NoteLM is 100% free with no hidden costs...',
    },
  ],
};
```
