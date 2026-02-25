# Keyword Research CSV Parsing Functions

Utility functions to parse CSV exports from SEMrush, Ahrefs, and GSC into unified keyword research data structures.

## Overview

This document describes the parsing logic for converting raw CSV data from different SEO tools into standardized TypeScript objects.

**Directory Structure:**
- `semrush/` - Contains Ahrefs Keywords Explorer exports (broad-match)
- `ahrefs/` - Contains SEMrush Organic Research exports (SERP Analysis)
- `gsc/` - Contains Google Search Console exports

**Note:** Directory names are historical. Files are organized by export type, not tool name.

**Workflow:**
1. Place CSV files in `data/keyword-research/` subdirectories
2. Run the parse functions to convert to typed data
3. Use the unified data for content planning

---

## CSV Parsing Utilities

### parseCSV<T>()

Generic CSV parser that converts CSV string into array of objects.

**Logic:**
```typescript
function parseCSV<T extends Record<string, string>>(csvContent: string): T[]
```

1. Split content by newlines
2. Parse first line as headers
3. For each subsequent line:
   - Parse line values (handling quoted strings)
   - Map values to headers
   - Return as typed object

**Example:**
```
Input CSV:
  Keyword,Volume,Difficulty
  "youtube download",74000,45
  "video converter",12000,38

Output:
  [
    { Keyword: "youtube download", Volume: "74000", Difficulty: "45" },
    { Keyword: "video converter", Volume: "12000", Difficulty: "38" }
  ]
```

### parseCSVLine()

Parses a single CSV line, handling quoted values with commas.

**Logic:**
```typescript
function parseCSVLine(line: string): string[]
```

1. Iterate through each character
2. Track whether inside quotes (`inQuotes` flag)
3. When encountering comma:
   - If inside quotes: add to current value
   - If outside quotes: end current field, start new one
4. Handle escaped quotes (`""` → `"`)

**Example:**
```
Input: 'youtube,1000,"AI Overview,Featured snippet",informational'
Output: ['youtube', '1000', 'AI Overview,Featured snippet', 'informational']
```

### parseNumber()

Converts string to number, handling empty values and formatting.

**Logic:**
```typescript
function parseNumber(value: string): number
```

1. Return 0 if empty
2. Remove formatting characters: `$`, `,`, `%`
3. Parse as float
4. Return 0 if NaN

**Examples:**
```
"74,000" → 74000
"$12.99" → 12.99
"5.99%" → 5.99
"" → 0
```

### slugify()

Creates URL-safe slug from keyword.

**Logic:**
```typescript
function slugify(text: string): string
```

1. Convert to lowercase
2. Remove non-alphanumeric characters (except spaces/hyphens)
3. Replace spaces with hyphens
4. Remove duplicate hyphens
5. Trim

**Examples:**
```
"How to Download YouTube Videos?" → "how-to-download-youtube-videos"
"Best AI Tools (2026)" → "best-ai-tools-2026"
```

---

## SEMrush Parser

### parseSEMrushIntents()

Parse SEMrush intent string into SearchIntent array.

**Input format:** `"Informational,Commercial,Branded,Non-local"`

**Logic:**
```typescript
function parseSEMrushIntents(intentStr: string): SearchIntent[]
```

1. Split by comma
2. Lowercase and trim each value
3. Map to valid SearchIntent values
4. Filter out invalid intents

**Example:**
```
"Informational,Commercial" → ['informational', 'commercial']
"Branded,Non-local" → ['branded', 'non-local']
```

### parseSerpFeatures()

Parse SEMrush SERP features string.

**Input format:** `"AI Overview,Featured snippet,Sitelinks,Video preview"`

**Logic:**
```typescript
function parseSerpFeatures(featuresStr: string): string[]
```

1. Split by comma
2. Trim each value
3. Filter out empty strings

**Example:**
```
"AI Overview,Featured snippet" → ['AI Overview', 'Featured snippet']
```

### parseSEMrushCSV() [Legacy]

Legacy SEMrush CSV parser for Keyword Magic Tool exports.

**Input:** SEMrush matching-terms CSV export

**Output:** `SEMrushKeyword[]`

**Column mapping:**
- `#` → `rank` (number)
- `Keyword` → `keyword` (string)
- `Country` → `country` (lowercase CountryCode)
- `Difficulty` → `difficulty` (0-100)
- `Volume` → `volume` (number)
- `CPC` → `cpc` (USD)
- `CPS` → `cps` (number)
- `Parent Keyword` → `parentKeyword`
- `Last Update` → `lastUpdate` (YYYY-MM-DD HH:mm:ss)
- `SERP Features` → `serpFeatures` (array)
- `Global volume` → `globalVolume`
- `Traffic potential` → `trafficPotential`
- `Global traffic potential` → `globalTrafficPotential`
- `First seen` → `firstSeen` (YYYY-MM-DD)
- `Intents` → `intents` (array)
- `Languages` → `languages` (array)

### parseSEMrushSerpAnalysisCSV() [Current]

Current SEMrush CSV parser for Organic Research SERP Analysis exports (files stored in `ahrefs/` directory).

**Input:** SEMrush Organic Research SERP Analysis CSV export

**Output:** `SEMrushSerpAnalysis[]`

**Column mapping:**
- `Keyword` → `keyword`
- `URL` → `url` (ranking URL)
- `Country` → `country` (lowercase CountryCode)
- `Difficulty` → `difficulty` (0-100)
- `Volume` → `volume`
- `CPS` → `cps`
- `Parent Topic` → `parentTopic`
- `Parent Topic Volume` → `parentTopicVolume`
- `Last Update` → `lastUpdate` (YYYY-MM-DD HH:mm:ss)
- `Referring Domains` → `referringDomains`
- `Domain rating` → `domainRating` (0-100)
- `Ahrefs Rank` → `ahrefsRank`
- `Traffic` → `traffic`
- `Keywords` → `keywords` (keyword count)
- `CPC` → `cpc`
- `Position` → `position` (current SERP position)
- `Type` → `type` ('Organic' | 'Paid')
- `Title` → `title` (page title)
- `Global volume` → `globalVolume`
- `Traffic potential` → `trafficPotential`
- `Global traffic potential` → `globalTrafficPotential`
- `First seen` → `firstSeen` (YYYY-MM-DD)
- `Intents` → `intents` (array, parseSEMrushIntents)
- `Languages` → `languages` (array, split by comma)
- `Page type` → `pageType`
- `SV trend (02-2024 - 01-2026)` → `svTrend` (array, parseSVTrend24)
- `SV Forecasting trend (02-2026 - 02-2027)` → `svForecastingTrend` (array, parseSVTrend12)

### parseSVTrend24()

Parse 24-month search volume trend data.

**Input format:** `"51888, 48325, 48450, 39392, 35616, 41040, ..."`

**Logic:**
```typescript
function parseSVTrend24(trendStr: string): number[]
```

1. Split by comma
2. Trim whitespace
3. Parse each as integer
4. Return array of 24 values

**Example:**
```
"51888, 48325, 48450" → [51888, 48325, 48450]
```

### parseSVTrend12()

Parse 12-month forecasted search volume trend data.

**Input format:** `"45214, 43064, 42162, 53278, ..."`

**Logic:**
```typescript
function parseSVTrend12(trendStr: string): number[]
```

1. Split by comma
2. Trim whitespace
3. Parse each as integer
4. Return array of 12 values

**Example:**
```
"45214, 43064, 42162" → [45214, 43064, 42162]
```

---

## Ahrefs Parser

### parseAhrefsIntents()

Parse Ahrefs intent string into SearchIntent array.

**Input format:** `"Informational, Commercial"` or `"Navigational, Transactional"`

**Logic:**
```typescript
function parseAhrefsIntents(intentStr: string): SearchIntent[]
```

1. Split by comma
2. Lowercase and trim
3. Map to valid SearchIntent values (4 types only)
4. Filter out invalid

**Supported intents:**
- informational
- navigational
- commercial
- transactional

### parseAhrefsTrend()

Parse Ahrefs trend string into number array.

**Input format:** `"1.00,0.81,0.81,1.00,0.67,0.67,1.00,0.44,0.54,0.54,0.81,1.00"`

**Logic:**
```typescript
function parseAhrefsTrend(trendStr: string): number[]
```

1. Split by comma
2. Parse each as float
3. Return array of 12 values (0-1 scale)

**Example:**
```
"1.00,0.81,0.67" → [1.00, 0.81, 0.67]
```

### parseAhrefsCSV()

Main Ahrefs CSV parser (files stored in `semrush/` directory).

**Input:** Ahrefs Keywords Explorer broad-match CSV export

**Output:** `AhrefsKeyword[]`

**Column mapping:**
- `Keyword` → `keyword`
- `Intent` → `intents` (array, parseAhrefsIntents)
- `Volume` → `volume`
- `Trend` → `trend` (12-month array, parseAhrefsTrend)
- `Keyword Difficulty` → `difficulty` (0-100)
- `CPC (USD)` → `cpc`
- `Competitive Density` → `competitiveDensity` (NEW: 0-1 scale)
- `SERP Features` → `serpFeatures` (NEW: array, parseSerpFeatures)
- `Number of Results` → `numberOfResults`

---

## GSC Parsers

### parseCTR()

Parse GSC CTR string.

**Input format:** `"5.99%"`

**Logic:**
```typescript
function parseCTR(ctrStr: string): number
```

1. Remove `%` character
2. Parse as float
3. Return as number (5.99% → 5.99)

### parseGSCQueriesCSV()

Parse GSC Queries.csv export.

**Input:** GSC Queries CSV

**Output:** `GSCQuery[]`

**Column mapping:**
- `Top queries` → `query`
- `Clicks` → `clicks`
- `Impressions` → `impressions`
- `CTR` → `ctr` (percentage)
- `Position` → `position`

### parseGSCPagesCSV()

Parse GSC Pages.csv export.

**Input:** GSC Pages CSV

**Output:** `GSCPage[]`

**Column mapping:**
- `Top pages` → `url` (full URL)
- Extract pathname → `path` (URL path only)
- `Clicks` → `clicks`
- `Impressions` → `impressions`
- `CTR` → `ctr`
- `Position` → `position`

**Logic:**
```typescript
function parseGSCPagesCSV(csvContent: string): GSCPage[]
```

1. Parse CSV rows
2. For each row:
   - Get full URL from "Top pages"
   - Extract pathname using URL API
   - If parsing fails, use original value
3. Map other columns to numbers

### parseGSCCountriesCSV()

Parse GSC Countries.csv export.

**Column mapping:**
- `Country` or `Countries` → `country`
- Standard metrics (clicks, impressions, ctr, position)

### parseGSCDevicesCSV()

Parse GSC Devices.csv export.

**Column mapping:**
- `Device` or `Devices` → `device` (uppercase: MOBILE/DESKTOP/TABLET)
- Standard metrics

---

## Unified Keyword Builder

### buildUnifiedKeywords()

Build unified keyword data from multiple sources.

**Input:**
- `semrushData?: SEMrushKeyword[]`
- `ahrefsData?: AhrefsKeyword[]`
- `gscQueries?: GSCQuery[]`

**Output:** `UnifiedKeyword[]`

**Logic:**

1. **Create keyword map** (keyed by lowercase keyword)

2. **Process SEMrush data:**
   - For each keyword:
     - Create UnifiedKeyword with SEMrush data
     - Extract SERP features
     - Check for AI Overview, Featured Snippet
     - Add 'semrush' to sources

3. **Process Ahrefs data:**
   - For each keyword:
     - If exists in map, merge data
     - If new, create UnifiedKeyword
     - Add 'ahrefs' to sources

4. **Process GSC data:**
   - For each query:
     - If exists, add GSC metrics
     - If new, create minimal UnifiedKeyword
     - Add 'gsc' to sources

5. **Calculate opportunity scores:**
   - For each keyword:
     - Calculate `opportunityScore` (0-100)
     - Generate `opportunityReason`

6. **Return array** of all unified keywords

**Example:**
```typescript
// Input: SEMrush has "youtube download" with volume 74000
//        GSC has "youtube download" with position 12.5

// Output: UnifiedKeyword {
//   keyword: "youtube download",
//   slug: "youtube-download",
//   volume: 74000,
//   gscPosition: 12.5,
//   sources: ['semrush', 'gsc'],
//   opportunityScore: 75,
//   opportunityReason: "Quick win: Position 12.5 with 5000 impressions"
// }
```

---

## Opportunity Analysis

### calculateOpportunityScore()

Calculate opportunity score (0-100). Higher score = better content opportunity.

**Scoring logic:**

1. **Volume contribution (0-30 points):**
   - ≥ 10,000: 30 points
   - ≥ 1,000: 20 points
   - ≥ 100: 10 points
   - < 100: 5 points

2. **Difficulty contribution (0-25 points, lower is better):**
   - ≤ 20: 25 points
   - ≤ 40: 20 points
   - ≤ 60: 10 points
   - > 60: 5 points

3. **Position opportunity (0-25 points):**
   - **Quick win (position 4-20):** 25 points
   - **Good potential (position 21-50):** 15 points
   - **Long shot (position > 50):** 5 points
   - **New keyword (no ranking) with good metrics:** 15 points

4. **SERP feature opportunity (0-10 points):**
   - Has AI Overview: +5 points
   - Has Featured Snippet: +5 points

5. **Traffic potential bonus (0-10 points):**
   - Traffic potential ≥ 1000: 10 points

**Max score:** 100

**Example:**
```
Keyword: "youtube transcript download"
- Volume: 8,100 (20 points)
- Difficulty: 35 (20 points)
- Position: 8.5 (25 points - quick win)
- Has AI Overview: yes (5 points)
- Traffic potential: 1,200 (10 points)
Total: 80/100
```

### getOpportunityReason()

Get human-readable opportunity reason.

**Reasons generated:**

1. **Quick win:** Position 4-20 with impressions
   - "Quick win: Position 8.5 with 5000 impressions"

2. **Low difficulty + high volume:**
   - "Low difficulty (35) with high volume (8,100)"

3. **AI Overview available:**
   - "AI Overview SERP feature available"

4. **Featured snippet:**
   - "Featured snippet opportunity"

5. **Content gap:**
   - "Not ranking yet - content gap opportunity"

**Example:**
```
"Quick win: Position 12.3 with 3500 impressions; AI Overview SERP feature available"
```

### findContentOpportunities()

Find content opportunities based on unified keyword data.

**Input:**
- `keywords: UnifiedKeyword[]`
- `pages?: PagePerformance[]`

**Output:** `ContentOpportunity[]`

**Opportunity types identified:**

1. **Quick wins** (type: 'quick-win')
   - Ranking 4-20
   - ≥ 100 impressions
   - Priority: high if position ≤ 10, else medium
   - Reason: "Can likely reach top 3 with optimization"

2. **Content gaps** (type: 'content-gap')
   - Not ranking yet
   - Volume ≥ 500
   - Difficulty < 60
   - Priority: high if volume ≥ 5000, medium if ≥ 1000, else low
   - Includes suggested content type and title

3. **Optimization opportunities** (type: 'optimize-existing')
   - Ranking ≤ 10
   - CTR < 5%
   - Impressions ≥ 500
   - Priority: medium
   - Reason: "Needs title/description optimization"

**Output is sorted by:**
1. Priority (high → medium → low)
2. Potential traffic (descending)

---

## Traffic Estimation

### estimateTrafficGain()

Estimate traffic gain from improving position.

**CTR by position estimates:**
```
Position 1:  32%
Position 2:  17%
Position 3:  11%
Position 4:   8%
Position 5:   6%
Position 6-10: 2-5%
```

**Logic:**
```typescript
function estimateTrafficGain(kw: UnifiedKeyword): number
```

1. Get current CTR (from GSC or position estimate)
2. Assume target CTR = 11% (position 3)
3. Calculate: `impressions × (targetCTR - currentCTR)`

**Example:**
```
Keyword at position 8 with 5,000 impressions:
- Current CTR: ~3%
- Target CTR: 11%
- Gain: 5,000 × (0.11 - 0.03) = 400 clicks/month
```

### estimateNewContentTraffic()

Estimate traffic for new content.

**Capture rate assumptions:**
- Difficulty < 30: 10% of volume
- Difficulty ≥ 30: 5% of volume

**Example:**
```
Keyword with 10,000 volume, difficulty 25:
- Estimated traffic: 10,000 × 0.10 = 1,000 clicks/month
```

---

## Content Type Suggestion

### suggestContentType()

Suggest content type based on keyword characteristics.

**Rules:**

1. **Alternative page:**
   - Keyword contains "alternative" or "vs "

2. **Blog post:**
   - Keyword contains "how to", "guide", "tutorial"

3. **FAQ page:**
   - Keyword contains "what is", "?", "faq"

4. **Landing page:**
   - Intent is commercial or transactional

5. **Use case page:**
   - Keyword contains "for " or "use case"

6. **Default:** Blog post

**Examples:**
```
"notegpt alternative" → 'alternative'
"how to download youtube videos" → 'blog'
"what is youtube premium" → 'faq'
"best youtube downloader" → 'landing' (commercial intent)
"youtube summarizer for students" → 'use-case'
```

### suggestTitle()

Suggest title based on keyword.

**Rules:**

1. **Already has good format:**
   - "How to..." → Capitalize words
   - "What is..." → Capitalize words

2. **Informational intent:**
   - "How to {keyword}: Complete Guide"

3. **Commercial intent:**
   - "Best {keyword} in 2026"

4. **Default:**
   - "{keyword} Guide"

**Examples:**
```
"how to download youtube videos" → "How to Download YouTube Videos"
"best youtube downloader" → "Best YouTube Downloader in 2026"
"youtube api" → "YouTube API Guide"
```

---

## Full Dataset Builder

### buildKeywordResearchData()

Build complete keyword research dataset from all CSV files.

**Input:**
```typescript
buildKeywordResearchData(
  projectName: string,
  sources: {
    semrush?: { content: string; filename: string };
    ahrefs?: { content: string; filename: string };
    gscQueries?: { content: string; filename: string };
    gscPages?: { content: string; filename: string };
  }
): KeywordResearchData
```

**Process:**

1. **Parse each source:**
   - SEMrush: `parseSEMrushCSV()`
   - Ahrefs: `parseAhrefsCSV()`
   - GSC Queries: `parseGSCQueriesCSV()`
   - GSC Pages: `parseGSCPagesCSV()`

2. **Build unified keywords:**
   - Call `buildUnifiedKeywords(semrushData, ahrefsData, gscQueries)`

3. **Build page performance:**
   - Convert GSC pages to PagePerformance objects

4. **Calculate summary:**
   - Total keywords
   - Total volume (sum of all keyword volumes)
   - Average difficulty
   - Average position (from GSC)
   - Top 5 intents (by count)
   - Top 10 SERP features (by count)

5. **Return dataset:**
   - Metadata (project name, timestamp, sources)
   - All keywords
   - All pages
   - Summary statistics

**Example output:**
```json
{
  "projectName": "notelm.ai",
  "generatedAt": "2026-02-01T12:00:00Z",
  "dataSources": [
    { "source": "semrush", "file": "google_us_youtube_匹配术语_serps_2026-02-01.csv", "recordCount": 1500 },
    { "source": "ahrefs", "file": "youtube_broad-match_us_2026-02-01.csv", "recordCount": 800 },
    { "source": "gsc", "file": "Queries.csv", "recordCount": 850 }
  ],
  "keywords": [...],
  "pages": [...],
  "summary": {
    "totalKeywords": 2000,
    "totalVolume": 15000000,
    "avgDifficulty": 42,
    "avgPosition": 18.5,
    "topIntents": [
      { "intent": "informational", "count": 1200 },
      { "intent": "commercial", "count": 500 }
    ],
    "topSerpFeatures": [
      { "feature": "AI Overview", "count": 800 },
      { "feature": "Featured snippet", "count": 300 }
    ]
  }
}
```

---

## Usage Example

### Complete Workflow

```typescript
// 1. Read CSV files
const ahrefsCSV = fs.readFileSync('data/keyword-research/semrush/youtube_broad-match_us_2026-02-01.csv', 'utf-8');
const semrushCSV = fs.readFileSync('data/keyword-research/ahrefs/google_us_youtube_匹配术语_serps_2026-02-01.csv', 'utf-8');
const gscQueriesCSV = fs.readFileSync('data/keyword-research/gsc/notelm.ai-Performance-on-Search-2026-02-01/Queries.csv', 'utf-8');
const gscPagesCSV = fs.readFileSync('data/keyword-research/gsc/notelm.ai-Performance-on-Search-2026-02-01/Pages.csv', 'utf-8');

// 2. Build unified dataset
const dataset = buildKeywordResearchData('notelm.ai', {
  ahrefs: { content: ahrefsCSV, filename: 'youtube_broad-match_us_2026-02-01.csv' },
  semrush: { content: semrushCSV, filename: 'google_us_youtube_匹配术语_serps_2026-02-01.csv' },
  gscQueries: { content: gscQueriesCSV, filename: 'Queries.csv' },
  gscPages: { content: gscPagesCSV, filename: 'Pages.csv' },
});

// 3. Find content opportunities
const opportunities = findContentOpportunities(dataset.keywords, dataset.pages);

// 4. Filter top opportunities
const topOpportunities = opportunities
  .filter(o => o.priority === 'high')
  .slice(0, 20);

// 5. Generate content plan
for (const opp of topOpportunities) {
  console.log(`${opp.keyword} - ${opp.type}`);
  console.log(`  Suggested: ${opp.suggestedContentType}`);
  console.log(`  Title: ${opp.suggestedTitle}`);
  console.log(`  Potential: ${opp.potentialTraffic} clicks/month`);
}
```
