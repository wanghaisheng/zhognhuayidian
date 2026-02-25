# SEO Schema Components

JSON-LD structured data component type reference.

> **Related**: [COMPONENT-MAPPING.md](../COMPONENT-MAPPING.md) for which schemas to use per content type

---

## Overview

| Schema | Purpose | Applicable Pages |
|--------|---------|------------------|
| ArticleSchema | Article metadata | Blog posts |
| FAQSchema | FAQ structure | FAQ pages, article FAQ sections |
| BreadcrumbSchema | Breadcrumb navigation | All pages |
| HowToSchema | Step-by-step guide | How-To guides |
| ComparisonSchema | Product comparison | Comparison pages, tool comparison articles |
| ReviewSchema | Product review | Review articles |
| ItemListSchema | List/ranking | Best-Of listicles |
| WebPageSchema | Page metadata | Landing pages |
| SoftwareApplicationSchema | Software info | Tool pages |
| OrganizationSchema | Organization info | Homepage, about page |
| PersonSchema | Author info | Author pages |

---

## ArticleSchema

Article structured data with EEAT enhancements.

### Props

```typescript
interface ArticleSchemaProps {
  title: string;
  description: string;
  author: string;
  publishDate: string;           // YYYY-MM-DD
  updateDate: string;            // YYYY-MM-DD
  slug: string;
  keywords?: string[];
  wordCount?: number;
  // EEAT enhancements
  authorJobTitle?: string;
  authorDescription?: string;
  reviewedBy?: string;           // Reviewer
}
```

### Output Example

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to [Topic]",
  "author": {
    "@type": "Person",
    "name": "[Author Name]",
    "jobTitle": "[Job Title]"
  },
  "datePublished": "2026-01-15",
  "dateModified": "2026-01-15"
}
```

---

## FAQSchema

FAQ structured data for search result rich snippets.

### Props

```typescript
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  items: readonly FAQItem[];
}

// Page-level FAQ
interface FAQPageSchemaProps {
  faqs: { question: string; answer: string }[];
}
```

### Auto-Extraction from Content

FAQ sections written in this format are auto-extracted:

```markdown
## Frequently Asked Questions

### [Question 1]?

[Answer to question 1]...

### [Question 2]?

[Answer to question 2]...
```

---

## BreadcrumbSchema

Breadcrumb navigation structured data.

### Props

```typescript
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}
```

### Example

```typescript
// Blog article
items: [
  { name: 'Home', url: 'https://example.com' },
  { name: 'Blog', url: 'https://example.com/blog' },
  { name: 'Guides', url: 'https://example.com/blog/category/guides' },
  { name: 'Article Title', url: '...' }
]
```

---

## HowToSchema

How-to guide structured data.

### Props

```typescript
interface HowToStep {
  name: string;        // Step title
  text: string;        // Step description
  url?: string;        // Step link
  image?: string;      // Step image
}

interface HowToSchemaProps {
  name: string;                // Guide title
  description: string;         // Guide description
  steps: HowToStep[];
  totalTime?: string;          // ISO 8601 format "PT5M"
  estimatedCost?: {
    value: number | string;
    currency: string;
  };
  tool?: string[];             // Required tools
  supply?: string[];           // Required materials
}
```

---

## ComparisonSchema

Product comparison structured data (GEO optimized).

### Props

```typescript
interface ProductItem {
  name: string;
  description: string;
  url?: string;
  image?: string;
  brand?: string;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
  };
  offers?: {
    price: number | string;
    priceCurrency?: string;
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  };
  category?: string;
}

interface ComparisonSchemaProps {
  mainProduct: ProductItem;           // Main product
  comparedProducts: ProductItem[];    // Compared products
  comparisonUrl: string;
  datePublished?: string;
  dateModified?: string;
  author?: {
    name: string;
    url?: string;
  };
}
```

---

## ReviewSchema

Product review structured data.

### Props

```typescript
interface ReviewSchemaProps {
  itemReviewed: {
    name: string;
    type?: 'Product' | 'SoftwareApplication' | 'Organization' | 'Service';
    description?: string;
    url?: string;
  };
  reviewRating: {
    ratingValue: number;
    bestRating?: number;     // Default 5
    worstRating?: number;    // Default 1
  };
  author: {
    name: string;
    jobTitle?: string;
    worksFor?: string;
  };
  reviewBody: string;        // Review body
  datePublished?: string;
}
```

---

## ItemListSchema

List/ranking structured data.

### Props

```typescript
interface RankedItem {
  name: string;
  description: string;
  url?: string;
  image?: string;
  position?: number;         // Rank position
  rating?: number;
  reviewCount?: number;
  price?: {
    value: number | string;
    currency?: string;
  };
}

interface ItemListSchemaProps {
  name: string;              // List title
  description: string;
  url: string;
  items: RankedItem[];
  itemListOrder?: 'Ascending' | 'Descending' | 'Unordered';
  datePublished?: string;
  dateModified?: string;
  author?: {
    name: string;
    url?: string;
  };
}
```

---

## WebPageSchema

Web page metadata structured data.

### Props

```typescript
interface WebPageSchemaProps {
  name: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  author?: {
    name: string;
    url?: string;
  };
  about?: string[];          // Page topics
  mentions?: string[];       // Mentioned entities
  lastReviewed?: string;     // Last reviewed date
}
```

---

## SoftwareApplicationSchema

Software application structured data.

### Props

```typescript
interface SoftwareApplicationSchemaProps {
  name: string;
  description: string;
  applicationCategory?: string;   // "WebApplication", "BrowserExtension"
  operatingSystem?: string;       // "Web", "Chrome", "Windows"
  softwareVersion?: string;
  offers?: {
    price: number | string;       // 0 = free
    priceCurrency: string;
  };
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}
```

---

## VideoSchema

Video content structured data for embedded videos.

### Props

```typescript
interface VideoSchemaProps {
  name: string;                    // Video title
  description: string;             // Video description
  thumbnailUrl: string | string[]; // Thumbnail URL(s)
  uploadDate: string;              // YYYY-MM-DD
  duration?: string;               // ISO 8601 duration "PT1H30M"
  contentUrl?: string;             // Direct video URL
  embedUrl?: string;               // Embed URL
  interactionStatistic?: {
    interactionType: 'WatchAction';
    userInteractionCount: number;
  };
  publication?: {
    isLiveBroadcast: boolean;
    startDate?: string;
    endDate?: string;
  };
}
```

### Usage

```typescript
// For YouTube video embedding
<VideoSchema
  name="How to Download YouTube Subtitles"
  description="Step-by-step guide..."
  thumbnailUrl="https://i.ytimg.com/vi/VIDEO_ID/maxresdefault.jpg"
  uploadDate="2026-01-15"
  duration="PT5M30S"
  embedUrl="https://www.youtube.com/embed/VIDEO_ID"
/>
```

---

## TechArticleSchema

Technical article structured data for developer/technical content.

### Props

```typescript
interface TechArticleSchemaProps {
  headline: string;
  description: string;
  author: {
    name: string;
    url?: string;
    jobTitle?: string;
  };
  datePublished: string;
  dateModified?: string;
  proficiencyLevel?: 'Beginner' | 'Intermediate' | 'Expert';
  dependencies?: string[];          // Required software/libraries
  programmingLanguage?: string;     // Primary language
  codeRepository?: string;          // GitHub/GitLab URL
}
```

### Usage

```typescript
// For technical tutorials
<TechArticleSchema
  headline="Building a YouTube Transcript API with Python"
  description="Learn how to build..."
  author={{ name: "Dev Team", jobTitle: "Software Engineers" }}
  datePublished="2026-01-15"
  proficiencyLevel="Intermediate"
  dependencies={["Python 3.10+", "yt-dlp"]}
  programmingLanguage="Python"
/>
```

---

## AggregateRatingSchema

Standalone aggregate rating for products/tools.

### Props

```typescript
interface AggregateRatingSchemaProps {
  itemReviewed: {
    name: string;
    type: 'Product' | 'SoftwareApplication' | 'Organization';
    url?: string;
  };
  ratingValue: number;
  ratingCount?: number;
  reviewCount?: number;
  bestRating?: number;     // Default 5
  worstRating?: number;    // Default 1
}
```

---

## Schema Composition Patterns

### Multi-Schema Article

For articles that need multiple schema types:

```typescript
// Article with embedded video and FAQ
<>
  <ArticleSchema {...articleProps} />
  <VideoSchema {...videoProps} />
  <FAQSchema items={faqs} />
  <BreadcrumbSchema items={breadcrumbs} />
</>
```

### Review with Rating

```typescript
// Product review with aggregate rating
<>
  <ReviewSchema {...reviewProps} />
  <AggregateRatingSchema
    itemReviewed={{ name: "Product", type: "SoftwareApplication" }}
    ratingValue={4.5}
    reviewCount={127}
  />
</>
```

---

## Usage Recommendations

### Blog Posts

```typescript
// Required
ArticleSchema
BreadcrumbSchema

// Optional (based on content)
FAQSchema          // If has FAQ section
HowToSchema        // If is How-To guide
ComparisonSchema   // If is comparison article
ReviewSchema       // If is review article
ItemListSchema     // If is listicle
```

### Tool Landing Pages

```typescript
SoftwareApplicationSchema
BreadcrumbSchema
FAQSchema
WebPageSchema
```

### Comparison Pages

```typescript
ComparisonSchema
BreadcrumbSchema
FAQSchema
```

### Best-Of Listicles

```typescript
ItemListSchema
BreadcrumbSchema
FAQSchema
```

---

## Schema Best Practices

### DO ✅

```typescript
// 1. Always include BreadcrumbSchema on all pages
<BreadcrumbSchema items={[...]} />

// 2. Use consistent date formats
datePublished: '2026-01-15'  // YYYY-MM-DD

// 3. Match schema data with visible content
// If page shows "4.5 stars", schema should also be 4.5

// 4. Include all required fields
// Check schema.org for each type's requirements

// 5. Use specific types over generic ones
type: 'SoftwareApplication'  // Not just 'Product'
```

### DON'T ❌

```typescript
// 1. Don't add schemas for content not on page
// No FAQSchema if no visible FAQ section

// 2. Don't inflate ratings
ratingValue: 5.0  // Only if genuinely 5.0

// 3. Don't use future dates
datePublished: '2027-01-15'  // Invalid if not yet published

// 4. Don't duplicate schemas
// One FAQSchema per page, not per section

// 5. Don't leave required fields empty
name: ''  // Invalid - must have value
```

### Validation

Test schemas at:
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)

### Priority Order

When a page could use multiple schemas, prioritize:

1. **BreadcrumbSchema** - Always include (navigation)
2. **Primary Schema** - Main content type (Article, FAQ, etc.)
3. **FAQSchema** - If FAQ section exists
4. **Supporting Schemas** - Video, Review, Rating as needed

### Schema Selection Matrix

**BreadcrumbSchema is ALWAYS required on every page type.**

| Page Type | Primary | Secondary | Optional | Conditions |
|-----------|---------|-----------|----------|------------|
| Blog (guides) | Article | HowTo | FAQ, Video | HowTo if category=guides |
| Blog (tools) | Article | Comparison | FAQ, Review | Comparison if comparing tools |
| Blog (insights) | Article | - | FAQ | - |
| Alternative | Comparison | FAQ | AggregateRating | - |
| Use Case | WebPage | FAQ | - | - |
| FAQ Page | FAQPage | - | - | Full page schema |
| Best-Of | ItemList | FAQ | AggregateRating | AggregateRating per tool |
| Landing | SoftwareApp | FAQ | WebPage | - |
| Testimonial | Review | Person | - | Person if user verified |

### Minimum Viable Schema

Every page requires at minimum:
1. **BreadcrumbSchema** - Navigation (always)
2. **Primary Schema** - Main content type (from table above)

### Schema Selection Logic

```
1. Always add BreadcrumbSchema
2. Add Primary Schema based on page type
3. Add Secondary Schema if:
   - FAQ section exists → FAQSchema
   - Guide has steps → HowToSchema
   - Comparison data exists → ComparisonSchema
4. Add Optional Schema if:
   - Video embedded → VideoSchema
   - Ratings displayed → AggregateRatingSchema
   - Author verified → PersonSchema
```

### FAQ Schema Decision

```
Does page have FAQ section?
├─ YES → Is it dedicated FAQ page?
│        ├─ YES → Use FAQPageSchema (full page)
│        └─ NO  → Use FAQSchema (section only)
└─ NO  → Don't add FAQ schema
```
