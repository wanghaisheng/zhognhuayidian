# Keyword Research Skill Optimization Plan

Based on analysis of actual CSV files in `data/keyword-research/` on 2026-02-01.

## Issues Found

### 1. File Location Mismatch ⚠️

**Current state:**
- `semrush/youtube_broad-match_us_2026-02-01.csv` → Contains **Ahrefs** data
- `ahrefs/google_us_youtube_匹配术语_serps_2026-02-01.csv` → Contains **SEMrush** data

**Impact:** Files are in the wrong directories, parser will fail.

**Fix:**
```bash
cd data/keyword-research
mv semrush semrush_temp
mv ahrefs semrush
mv semrush_temp ahrefs
```

Or manually move files to correct directories.

---

### 2. Ahrefs CSV Format - New Fields

**Actual fields:**
```
Keyword, Intent, Volume, Trend, Keyword Difficulty, CPC (USD),
Competitive Density, SERP Features, Number of Results
```

**Current skill definition:** Missing 2 fields
- ✅ `Competitive Density` (0-1 scale)
- ✅ `SERP Features` (comma-separated list)

**Recommended updates:**

#### DATA-TYPES.md

Add to `AhrefsKeyword` interface:

```typescript
interface AhrefsKeyword {
  keyword: string;
  intents: SearchIntent[];
  volume: number;
  trend: number[];
  difficulty: number;
  cpc: number;
  competitiveDensity: number;        // NEW: 0-1 scale
  serpFeatures: string[];            // NEW: SERP features
  numberOfResults: number;
}
```

#### PARSING-FUNCTIONS.md

Add parsing logic:

**parseAhrefsCSV()** - Update column mapping:
- `Competitive Density` → `competitiveDensity` (parseNumber)
- `SERP Features` → `serpFeatures` (parseSerpFeatures)

**Example:**
```typescript
competitiveDensity: parseNumber(row['Competitive Density']),
serpFeatures: parseSerpFeatures(row['SERP Features']),
```

---

### 3. SEMrush CSV Format - Major Changes

**Actual export type:** SEMrush **Organic Research SERP Analysis**

This is different from Keyword Magic Tool export. Contains:
- Competitor analysis data
- Ranking URLs
- SEO metrics (DR, RD, Traffic)
- Search volume trends & forecasting

**Actual fields:**
```
Keyword, URL, Country, Difficulty, Volume, CPS, Parent Topic,
Parent Topic Volume, Last Update, Referring Domains, Domain rating,
Ahrefs Rank, Traffic, Keywords, CPC, Position, Type, Title,
Global volume, Traffic potential, Global traffic potential,
First seen, Intents, Languages, Page type, SV trend, SV Forecasting trend
```

**Current skill definition:**
```
#, Keyword, Country, Difficulty, Volume, CPC, CPS, Parent Keyword,
Last Update, SERP Features, Global volume, Traffic potential,
Global traffic potential, First seen, Intents, Languages
```

**Key differences:**

| Expected | Actual | Notes |
|----------|--------|-------|
| `#` | ❌ Missing | No rank column |
| - | `URL` | NEW: Ranking URL |
| `Parent Keyword` | `Parent Topic` | Renamed |
| - | `Parent Topic Volume` | NEW |
| `SERP Features` | ❌ Missing | Not in this export |
| - | `Referring Domains` | NEW |
| - | `Domain rating` | NEW |
| - | `Ahrefs Rank` | NEW |
| - | `Traffic` | NEW |
| - | `Keywords` | NEW |
| - | `Position` | NEW: Current rank |
| - | `Type` | NEW: Organic/Paid |
| - | `Title` | NEW: Page title |
| - | `Page type` | NEW |
| - | `SV trend` | NEW: 24-month history |
| - | `SV Forecasting trend` | NEW: 12-month forecast |

**Recommended updates:**

#### Option A: Support SERP Analysis Format (Recommended)

Create a new type for SEMrush SERP Analysis data:

```typescript
/**
 * SEMrush SERP Analysis (Organic Research) export
 * Different from Keyword Magic Tool export
 */
interface SEMrushSerpAnalysisKeyword {
  keyword: string;
  url: string;                     // Ranking URL
  country: CountryCode;
  difficulty: number;
  volume: number;
  cps: number;
  parentTopic: string;             // Changed from parentKeyword
  parentTopicVolume: number;       // NEW
  lastUpdate: string;

  // Competitor SEO metrics
  referringDomains: number;        // NEW
  domainRating: number;            // NEW: 0-100
  ahrefsRank: number;              // NEW
  traffic: number;                 // NEW: Estimated traffic
  keywords: number;                // NEW: Keyword count

  // Ranking data
  position: number;                // NEW: Current position
  type: 'Organic' | 'Paid';        // NEW
  title: string;                   // NEW: Page title

  // Standard fields
  cpc: number;
  globalVolume: number;
  trafficPotential: number;
  globalTrafficPotential: number;
  firstSeen: string;
  intents: SearchIntent[];
  languages: string[];
  pageType?: string;               // NEW

  // Trend data
  svTrend?: number[];              // NEW: 24-month history
  svForecastingTrend?: number[];   // NEW: 12-month forecast
}
```

#### Option B: Dual Format Support

Support both formats:

```typescript
type SEMrushKeyword = SEMrushKeywordMagic | SEMrushSerpAnalysis;

interface SEMrushKeywordMagic {
  exportType: 'keyword-magic';
  rank: number;
  keyword: string;
  // ... existing fields
}

interface SEMrushSerpAnalysis {
  exportType: 'serp-analysis';
  keyword: string;
  url: string;
  // ... SERP analysis fields
}
```

#### PARSING-FUNCTIONS.md

Add new parser:

**parseSEMrushSerpAnalysisCSV()**

```typescript
function parseSEMrushSerpAnalysisCSV(csvContent: string): SEMrushSerpAnalysisKeyword[]

Column mapping:
- Keyword → keyword
- URL → url
- Country → country (lowercase)
- Difficulty → difficulty
- Volume → volume
- CPS → cps
- Parent Topic → parentTopic
- Parent Topic Volume → parentTopicVolume
- Last Update → lastUpdate
- Referring Domains → referringDomains
- Domain rating → domainRating
- Ahrefs Rank → ahrefsRank
- Traffic → traffic
- Keywords → keywords
- CPC → cpc
- Position → position
- Type → type
- Title → title
- Global volume → globalVolume
- Traffic potential → trafficPotential
- Global traffic potential → globalTrafficPotential
- First seen → firstSeen
- Intents → intents (parseIntents)
- Languages → languages (split by comma)
- Page type → pageType
- SV trend → svTrend (parse 24-month trend)
- SV Forecasting trend → svForecastingTrend (parse 12-month forecast)
```

**parseSVTrend()** - Parse multi-month trend data

```typescript
function parseSVTrend(trendStr: string): number[]

Input: "51888, 48325, 48450, 39392, 35616, 41040, ..."
Output: [51888, 48325, 48450, ...]

Logic:
1. Split by comma
2. Parse each as integer
3. Return array
```

---

## Implementation Priority

### 🔴 Critical (Fix immediately)

1. **File location fix** - Move files to correct directories
2. **Ahrefs parser update** - Add Competitive Density and SERP Features support

### 🟡 High Priority (Implement soon)

3. **SEMrush SERP Analysis support** - Add new type and parser
4. **Update DATA-TYPES.md** - Add new interfaces
5. **Update PARSING-FUNCTIONS.md** - Document new parsers

### 🟢 Medium Priority (Nice to have)

6. **Trend visualization** - Use SV trend and forecasting data
7. **Competitor analysis** - Leverage URL, DR, RD data
8. **Enhanced opportunity scoring** - Use Position, Traffic, DR in scoring

---

## Migration Path

### Step 1: File Organization

```bash
# Correct file placement
data/keyword-research/
├── semrush/
│   └── google_us_youtube_匹配术语_serps_2026-02-01.csv  # Move here
├── ahrefs/
│   └── youtube_broad-match_us_2026-02-01.csv           # Move here
└── gsc/
    └── notelm.ai-Performance-on-Search-2026-02-01/
```

### Step 2: Update Type Definitions

Add to `DATA-TYPES.md`:
- Enhanced `AhrefsKeyword`
- New `SEMrushSerpAnalysisKeyword`
- Union type `SEMrushKeyword`

### Step 3: Update Parsing Functions

Add to `PARSING-FUNCTIONS.md`:
- `parseSEMrushSerpAnalysisCSV()`
- `parseSVTrend()`
- Enhanced `parseAhrefsCSV()`

### Step 4: Update Unified Builder

Modify `buildUnifiedKeywords()`:
- Accept both SEMrush formats
- Extract competitor data (URL, DR, RD)
- Use Position data for opportunity analysis

### Step 5: Enhanced Opportunity Scoring

Update `calculateOpportunityScore()`:
- Factor in competitor DR (lower DR = easier to outrank)
- Use Position data (if ranking, use actual position)
- Consider Traffic potential from SEMrush

---

## New Features Enabled

### 1. Competitor Analysis

With URL, DR, RD data:
```typescript
interface CompetitorInsight {
  keyword: string;
  topCompetitor: {
    url: string;
    domainRating: number;
    referringDomains: number;
    estimatedTraffic: number;
  };
  difficulty: 'easy' | 'medium' | 'hard';  // Based on DR
  recommendation: string;
}
```

### 2. Trend-Based Opportunities

With SV trend and forecasting:
```typescript
interface TrendOpportunity {
  keyword: string;
  currentVolume: number;
  trendDirection: 'rising' | 'falling' | 'stable';
  forecastedVolume: number;  // 6 months ahead
  seasonality: 'high' | 'medium' | 'low';
  recommendation: string;
}
```

### 3. SERP Features Tracking

With SERP Features from Ahrefs:
```typescript
interface SerpOpportunity {
  keyword: string;
  serpFeatures: string[];
  hasAIOverview: boolean;
  hasFeaturedSnippet: boolean;
  hasPeopleAlsoAsk: boolean;
  hasVideoCarousel: boolean;
  recommendation: string;
}
```

---

## Backward Compatibility

To maintain compatibility with old exports:

1. **Auto-detect format** based on columns
2. **Parser selection** based on detected format
3. **Graceful fallback** if optional fields missing

```typescript
function detectSEMrushFormat(headers: string[]): 'keyword-magic' | 'serp-analysis' {
  if (headers.includes('URL') && headers.includes('Domain rating')) {
    return 'serp-analysis';
  }
  return 'keyword-magic';
}
```

---

## Testing

### Test Files Needed

1. **Ahrefs with new fields**
   - ✅ Already have: `semrush/youtube_broad-match_us_2026-02-01.csv`

2. **SEMrush SERP Analysis**
   - ✅ Already have: `ahrefs/google_us_youtube_匹配术语_serps_2026-02-01.csv`

3. **GSC exports**
   - ✅ Already have: Multiple GSC files

### Validation

1. Parse all files successfully
2. Verify field mapping correctness
3. Check unified data structure
4. Validate opportunity scoring with new data

---

## Documentation Updates

After implementation, update:

1. **DATA-TYPES.md** - New interfaces
2. **PARSING-FUNCTIONS.md** - New parsers and logic
3. **SCRIPT-USAGE.md** - New output format examples
4. **CHEATSHEET.md** - Quick reference with new fields
5. **GUIDE.md** - Usage examples with new features

---

## Questions for User

1. **Do you prefer SEMrush SERP Analysis format over Keyword Magic Tool?**
   - SERP Analysis has competitor data (DR, RD, Traffic)
   - Keyword Magic Tool has SERP Features

2. **Should we support both SEMrush formats?**
   - Auto-detect and parse both?
   - Or standardize on one format?

3. **Priority for new features?**
   - Competitor analysis?
   - Trend forecasting?
   - SERP features tracking?

4. **File naming convention preference?**
   - Keep Chinese filenames (匹配术语)?
   - Rename to English (matching-terms)?

---

## Next Steps

1. ✅ Fix file placement (swap directories)
2. 🔄 Update Ahrefs type definition
3. 🔄 Add SEMrush SERP Analysis support
4. 🔄 Update parser functions
5. 🔄 Enhance opportunity scoring
6. 🔄 Update all documentation
