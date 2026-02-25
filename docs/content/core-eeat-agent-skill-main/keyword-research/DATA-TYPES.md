# Keyword Research Data Types

Unified types for keyword research data from multiple sources:
- **SEMrush** (Keywords Explorer broad-match exports) - stored in `semrush/` directory
- **Ahrefs** (SERP Analysis exports) - stored in `ahrefs/` directory
- **Google Search Console** (GSC performance exports) - stored in `gsc/` directory

These types standardize data from different tools into a common format that can be used for content planning and SEO optimization.

---

## Common Types

### SearchIntent

Search intent types (unified across tools):

```typescript
type SearchIntent =
  | 'informational'
  | 'navigational'
  | 'commercial'
  | 'transactional'
  | 'branded'
  | 'non-branded'
  | 'local'
  | 'non-local';
```

### DataSource

Data source identifier:

```typescript
type DataSource = 'semrush' | 'ahrefs' | 'gsc';
```

### CountryCode

ISO 3166-1 alpha-2 country codes:

```typescript
type CountryCode = 'us' | 'uk' | 'de' | 'fr' | 'jp' | 'cn' | string;
```

---

## SEMrush Types

**Note:** SEMrush data is stored in `semrush/` directory.

File pattern: `*broad-match*.csv`

### SEMrushKeyword

SEMrush keyword data from broad-match export (stored in `semrush/` directory).

**CSV columns:**
- Keyword, Intent, Volume, Trend, Keyword Difficulty, CPC (USD), Competitive Density, SERP Features, Number of Results

```typescript
interface SEMrushKeyword {
  keyword: string;
  intents: SearchIntent[];
  volume: number;
  trend: number[];                 // 12 monthly values (0-1 scale)
  difficulty: number;              // 0-100
  cpc: number;                     // USD
  competitiveDensity: number;      // 0-1 scale
  serpFeatures: string[];          // SERP features list
  numberOfResults: number;         // SERP result count
}
```

### SEMrushRawRow

Raw SEMrush CSV row (before parsing):

```typescript
interface SEMrushRawRow {
  'Keyword': string;
  'Intent': string;
  'Volume': string;
  'Trend': string;
  'Keyword Difficulty': string;
  'CPC (USD)': string;
  'Competitive Density': string;
  'SERP Features': string;
  'Number of Results': string;
}
```

---

## Ahrefs Types

**Note:** Ahrefs data is stored in `ahrefs/` directory.

File pattern: `*serps*.csv`

### AhrefsSerpAnalysis

Ahrefs SERP Analysis data (stored in `ahrefs/` directory).

This export includes competitor analysis data, ranking URLs, SEO metrics, and search volume trends.

**CSV columns:**
- Keyword, URL, Country, Difficulty, Volume, CPS, Parent Topic, Parent Topic Volume
- Last Update, Referring Domains, Domain rating, Ahrefs Rank, Traffic, Keywords
- CPC, Position, Type, Title, Global volume, Traffic potential, Global traffic potential
- First seen, Intents, Languages, Page type, SV trend, SV Forecasting trend

```typescript
interface AhrefsSerpAnalysis {
  // Basic keyword data
  keyword: string;
  url: string;                     // Ranking URL
  country: CountryCode;
  difficulty: number;              // 0-100
  volume: number;
  cps: number;

  // Topic clustering
  parentTopic: string;
  parentTopicVolume: number;

  // Competitor SEO metrics
  referringDomains: number;
  domainRating: number;            // 0-100
  ahrefsRank: number;
  traffic: number;                 // Estimated traffic
  keywords: number;                // Keyword count

  // Ranking data
  position: number;                // Current SERP position
  type: string;                    // 'Organic' | 'Paid'
  title: string;                   // Page title

  // Standard SEMrush fields
  cpc: number;
  globalVolume: number;
  trafficPotential: number;
  globalTrafficPotential: number;
  lastUpdate: string;
  firstSeen: string;
  intents: SearchIntent[];
  languages: string[];

  // Additional fields
  pageType?: string;
  svTrend?: number[];              // 24-month search volume history
  svForecastingTrend?: number[];   // 12-month forecasted trend
}
```

### AhrefsSerpAnalysisRawRow

Raw Ahrefs SERP Analysis CSV row:

```typescript
interface AhrefsSerpAnalysisRawRow {
  'Keyword': string;
  'URL': string;
  'Country': string;
  'Difficulty': string;
  'Volume': string;
  'CPS': string;
  'Parent Topic': string;
  'Parent Topic Volume': string;
  'Last Update': string;
  'Referring Domains': string;
  'Domain rating': string;
  'Ahrefs Rank': string;
  'Traffic': string;
  'Keywords': string;
  'CPC': string;
  'Position': string;
  'Type': string;
  'Title': string;
  'Global volume': string;
  'Traffic potential': string;
  'Global traffic potential': string;
  'First seen': string;
  'Intents': string;
  'Languages': string;
  'Page type': string;
  'SV trend (02-2024 - 01-2026)': string;         // 24-month trend
  'SV Forecasting trend (02-2026 - 02-2027)': string;  // 12-month forecast
}
```

---

## Google Search Console Types

### GSCQuery

GSC Query data from Queries.csv export.

**CSV columns:** Top queries, Clicks, Impressions, CTR, Position

```typescript
interface GSCQuery {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;                     // 0-100 percentage
  position: number;                // Average position
}
```

### GSCPage

GSC Page data from Pages.csv export.

**CSV columns:** Top pages, Clicks, Impressions, CTR, Position

```typescript
interface GSCPage {
  url: string;
  path: string;                    // URL path only
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}
```

### GSCCountry

GSC Country data from Countries.csv export:

```typescript
interface GSCCountry {
  country: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}
```

### GSCDevice

GSC Device data from Devices.csv export:

```typescript
interface GSCDevice {
  device: 'MOBILE' | 'DESKTOP' | 'TABLET';
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}
```

### GSCSearchAppearance

GSC Search Appearance data from "Search appearance.csv" export:

```typescript
interface GSCSearchAppearance {
  searchAppearance: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}
```

### GSC Raw Rows

Raw GSC CSV rows (before parsing):

```typescript
interface GSCRawQueryRow {
  'Top queries': string;
  'Clicks': string;
  'Impressions': string;
  'CTR': string;
  'Position': string;
}

interface GSCRawPageRow {
  'Top pages': string;
  'Clicks': string;
  'Impressions': string;
  'CTR': string;
  'Position': string;
}
```

---

## Unified Keyword Data

### UnifiedKeyword

Unified keyword data structure that combines data from all sources:

```typescript
interface UnifiedKeyword {
  keyword: string;
  slug: string;                    // URL-safe version

  // Search metrics (from SEMrush/Ahrefs)
  volume?: number;
  globalVolume?: number;
  difficulty?: number;
  cpc?: number;
  trafficPotential?: number;

  // Intent (from SEMrush/Ahrefs)
  intents?: SearchIntent[];
  primaryIntent?: SearchIntent;

  // SERP features (from SEMrush)
  serpFeatures?: string[];
  hasAIOverview?: boolean;
  hasFeaturedSnippet?: boolean;

  // Performance (from GSC)
  gscClicks?: number;
  gscImpressions?: number;
  gscCtr?: number;
  gscPosition?: number;

  // Ranking pages (from GSC)
  rankingPages?: {
    url: string;
    clicks: number;
    impressions: number;
    position: number;
  }[];

  // Metadata
  sources: DataSource[];
  lastUpdated: string;
  country?: CountryCode;

  // Content opportunity scoring
  opportunityScore?: number;       // Calculated score 0-100
  opportunityReason?: string;
}
```

### PagePerformance

Page performance data with associated keywords:

```typescript
interface PagePerformance {
  url: string;
  path: string;

  // GSC metrics
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;

  // Associated keywords
  topKeywords: {
    keyword: string;
    clicks: number;
    impressions: number;
    position: number;
  }[];

  // Content gap analysis
  potentialKeywords?: UnifiedKeyword[];

  lastUpdated: string;
}
```

---

## Keyword Research Dataset

### KeywordResearchData

Complete keyword research dataset:

```typescript
interface KeywordResearchData {
  // Metadata
  projectName: string;
  generatedAt: string;
  dataSources: {
    source: DataSource;
    file: string;
    recordCount: number;
    dateRange?: string;
  }[];

  // Keywords
  keywords: UnifiedKeyword[];

  // Pages (from GSC)
  pages?: PagePerformance[];

  // Summaries
  summary: {
    totalKeywords: number;
    totalVolume: number;
    avgDifficulty: number;
    avgPosition?: number;
    topIntents: { intent: SearchIntent; count: number }[];
    topSerpFeatures: { feature: string; count: number }[];
  };
}
```

---

## Content Opportunity Types

### ContentOpportunity

Content opportunity analysis result:

```typescript
interface ContentOpportunity {
  keyword: string;
  type: 'new-content' | 'optimize-existing' | 'content-gap' | 'quick-win';
  priority: 'high' | 'medium' | 'low';
  reason: string;

  // Metrics
  volume: number;
  difficulty: number;
  currentPosition?: number;
  potentialTraffic: number;

  // Recommendations
  suggestedContentType?: 'blog' | 'landing' | 'faq' | 'alternative' | 'use-case';
  suggestedTitle?: string;
  existingPage?: string;

  // Related data
  relatedKeywords?: string[];
  competitorUrls?: string[];
}
```

### ContentGapAnalysis

Content gap analysis between keyword research and existing pages:

```typescript
interface ContentGapAnalysis {
  // Keywords we should target but don't
  missingKeywords: UnifiedKeyword[];

  // Pages underperforming their potential
  underperformingPages: {
    page: PagePerformance;
    targetKeywords: UnifiedKeyword[];
    recommendation: string;
  }[];

  // Quick wins (position 4-20 with high volume)
  quickWins: ContentOpportunity[];

  // New content opportunities
  newContentOpportunities: ContentOpportunity[];
}
```

---

## Filter and Query Types

### KeywordFilter

Keyword filter options:

```typescript
interface KeywordFilter {
  minVolume?: number;
  maxVolume?: number;
  minDifficulty?: number;
  maxDifficulty?: number;
  intents?: SearchIntent[];
  hasAIOverview?: boolean;
  hasFeaturedSnippet?: boolean;
  serpFeatures?: string[];
  minCpc?: number;
  maxCpc?: number;

  // GSC filters
  minClicks?: number;
  minImpressions?: number;
  minCtr?: number;
  maxPosition?: number;
  minPosition?: number;
}
```

### KeywordSort

Sort options for keyword lists:

```typescript
type KeywordSortField =
  | 'volume'
  | 'difficulty'
  | 'cpc'
  | 'trafficPotential'
  | 'gscClicks'
  | 'gscImpressions'
  | 'gscPosition'
  | 'opportunityScore';

type SortDirection = 'asc' | 'desc';

interface KeywordSort {
  field: KeywordSortField;
  direction: SortDirection;
}
```

---

## Usage Examples

### Filtering Keywords

```typescript
const filter: KeywordFilter = {
  minVolume: 1000,
  maxDifficulty: 40,
  intents: ['informational', 'commercial'],
  hasAIOverview: true,
};

const filteredKeywords = keywords.filter(kw => {
  if (filter.minVolume && kw.volume < filter.minVolume) return false;
  if (filter.maxDifficulty && kw.difficulty > filter.maxDifficulty) return false;
  if (filter.intents && !kw.intents?.some(i => filter.intents.includes(i))) return false;
  if (filter.hasAIOverview && !kw.hasAIOverview) return false;
  return true;
});
```

### Sorting Keywords

```typescript
const sort: KeywordSort = {
  field: 'opportunityScore',
  direction: 'desc',
};

const sortedKeywords = [...keywords].sort((a, b) => {
  const aVal = a[sort.field] ?? 0;
  const bVal = b[sort.field] ?? 0;
  return sort.direction === 'asc' ? aVal - bVal : bVal - aVal;
});
```

### Identifying Quick Wins

```typescript
const quickWins = keywords.filter(kw =>
  kw.gscPosition >= 4 &&
  kw.gscPosition <= 20 &&
  kw.volume >= 1000 &&
  kw.gscImpressions >= 100
);
```

### Content Gap Analysis

```typescript
const contentGaps = keywords.filter(kw =>
  !kw.gscPosition &&           // Not ranking yet
  kw.volume >= 500 &&          // Decent volume
  kw.difficulty < 60           // Achievable difficulty
);
```
