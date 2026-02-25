# CSV Parser Script Usage

Guide for using the keyword research CSV parser to convert SEMrush, Ahrefs, and GSC exports into unified data.

## Overview

The CSV parser script reads keyword research data from multiple sources and generates a unified JSON dataset with content opportunities.

**What it does:**
1. Reads CSV files from `data/keyword-research/` subdirectories
2. Parses and unifies data from SEMrush, Ahrefs, and GSC
3. Analyzes content opportunities
4. Generates `unified-data.json` with all processed data

---

## Directory Structure

Expected file structure:

```
data/keyword-research/
├── semrush/                    # SEMrush Keywords Explorer exports
│   └── youtube_broad-match_us_2026-02-01.csv
├── ahrefs/                     # Ahrefs SERP Analysis exports
│   └── google_us_youtube_serps_2026-02-01.csv
└── gsc/                        # Google Search Console exports
    └── notelm.ai-Performance-on-Search-2026-02-01/
        ├── Queries.csv
        ├── Pages.csv
        ├── Countries.csv
        ├── Devices.csv
        └── Search appearance.csv
```

**Notes:**
- Only `Queries.csv` and `Pages.csv` are required from GSC
- SEMrush files (in `semrush/` dir) should match pattern: `*broad-match*.csv`
- Ahrefs files (in `ahrefs/` dir) should match pattern: `*serps*.csv`
- GSC directory should match pattern: `*-Performance-on-Search-*`

---

## Usage

### Running the Script

**Option 1: Direct execution**
```bash
cd /path/to/Private
npx ts-node .claude/skills/content-generator-framework/keyword-research/parse-csv.ts
```

**Option 2: Via npm script** (if configured)
```bash
npm run parse-keywords
```

### What the Script Does

**1. File Discovery**

Searches for CSV files in expected locations:
- SEMrush (stored in `semrush/`): `data/keyword-research/semrush/*broad-match*.csv`
- Ahrefs (stored in `ahrefs/`): `data/keyword-research/ahrefs/*serps*.csv`
- GSC: `data/keyword-research/gsc/*-Performance-on-Search-*/`

**2. Data Parsing**

For each source found:
- Reads CSV file content
- Parses using appropriate parser function
- Converts to typed TypeScript objects

**3. Data Unification**

- Merges keywords from all sources
- Combines matching keywords by lowercase keyword text
- Adds source tracking (`sources: ['semrush', 'gsc']`)
- Generates slugs and metadata

**4. Opportunity Analysis**

- Calculates opportunity scores (0-100)
- Identifies quick wins (position 4-20)
- Finds content gaps (not ranking, high volume)
- Generates recommendations

**5. Output Generation**

Writes `unified-data.json` with:
- All unified keywords
- Page performance data (from GSC)
- Summary statistics
- Top 50 content opportunities

---

## Output Format

### unified-data.json

```json
{
  "projectName": "notelm.ai",
  "generatedAt": "2026-02-01T12:34:56.789Z",
  "dataSources": [
    {
      "source": "semrush",
      "file": "youtube_broad-match_us_2026-02-01.csv",
      "recordCount": 1500
    },
    {
      "source": "ahrefs",
      "file": "google_us_youtube_serps_2026-02-01.csv",
      "recordCount": 800
    },
    {
      "source": "gsc",
      "file": "Queries.csv",
      "recordCount": 850
    }
  ],
  "keywords": [
    {
      "keyword": "youtube transcript",
      "slug": "youtube-transcript",
      "volume": 74000,
      "difficulty": 45,
      "cpc": 1.23,
      "trafficPotential": 5000,
      "intents": ["informational", "commercial"],
      "primaryIntent": "informational",
      "serpFeatures": ["AI Overview", "Featured snippet"],
      "hasAIOverview": true,
      "hasFeaturedSnippet": true,
      "gscClicks": 120,
      "gscImpressions": 5000,
      "gscCtr": 2.4,
      "gscPosition": 8.5,
      "sources": ["semrush", "gsc"],
      "lastUpdated": "2026-02-01",
      "country": "us",
      "opportunityScore": 85,
      "opportunityReason": "Quick win: Position 8.5 with 5000 impressions; AI Overview SERP feature available"
    }
  ],
  "pages": [
    {
      "url": "https://www.notelm.ai/youtube-transcript-generator",
      "path": "/youtube-transcript-generator",
      "clicks": 1200,
      "impressions": 45000,
      "ctr": 2.67,
      "position": 6.2,
      "topKeywords": [],
      "lastUpdated": "2026-02-01"
    }
  ],
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
  },
  "opportunities": [
    {
      "keyword": "youtube transcript download",
      "type": "quick-win",
      "priority": "high",
      "reason": "Position 8.5 - can likely reach top 3 with optimization",
      "volume": 8100,
      "difficulty": 38,
      "currentPosition": 8.5,
      "potentialTraffic": 400,
      "existingPage": "https://www.notelm.ai/youtube-transcript-generator"
    }
  ]
}
```

---

## Script Output Example

```
Keyword Research CSV Parser
===========================

Data directory: /Users/user/Dev/NoteLM/Private/data/keyword-research

Found SEMrush file: youtube_broad-match_us_2026-02-01.csv
Found Ahrefs file: google_us_youtube_serps_2026-02-01.csv
Found GSC directory: notelm.ai-Performance-on-Search-2026-02-01
  - Queries.csv loaded
  - Pages.csv loaded

Building unified keyword data...
Analyzing content opportunities...

Output written to: /Users/user/Dev/NoteLM/Private/data/keyword-research/unified-data.json

--- Summary ---
Total keywords: 2000
Total volume: 15,000,000
Avg difficulty: 42
Avg GSC position: 18.5
Content opportunities: 127

Top intents:
  - informational: 1200
  - commercial: 500
  - transactional: 200
  - navigational: 100

Top SERP features:
  - AI Overview: 800
  - Featured snippet: 300
  - People also ask: 250
  - Video: 180
  - Sitelinks: 150

Top 5 content opportunities:
  1. [HIGH] youtube transcript download
     Type: quick-win, Volume: 8,100
     Position 8.5 - can likely reach top 3 with optimization

  2. [HIGH] youtube summary ai
     Type: content-gap, Volume: 12,000
     High volume (12,000) keyword not currently ranking

  3. [MEDIUM] youtube video summarizer free
     Type: quick-win, Volume: 5,400
     Position 14.2 - can likely reach top 3 with optimization

  4. [HIGH] youtube to text converter
     Type: content-gap, Volume: 18,000
     High volume (18,000) keyword not currently ranking

  5. [MEDIUM] download youtube subtitle
     Type: optimize-existing, Volume: 4,500
     Low CTR (1.8%) despite good position - needs title/description optimization
```

---

## Script Implementation Reference

### Main Function Flow

```typescript
async function main() {
  // 1. Find SEMrush file
  const semrushFile = findFileInDir(SEMRUSH_DIR, /matching-terms.*\.csv$/i);

  // 2. Find Ahrefs file
  const ahrefsFile = findFileInDir(AHREFS_DIR, /broad-match.*\.csv$/i);

  // 3. Find GSC directory
  const gscDir = findGSCDir();

  // 4. Read all CSV files
  const sources = {
    semrush: semrushFile ? { content: fs.readFileSync(...), filename: ... } : undefined,
    ahrefs: ahrefsFile ? { content: fs.readFileSync(...), filename: ... } : undefined,
    gscQueries: ...,
    gscPages: ...
  };

  // 5. Build unified data
  const data = buildKeywordResearchData('notelm.ai', sources);

  // 6. Find opportunities
  const opportunities = findContentOpportunities(data.keywords, data.pages);

  // 7. Add top 50 opportunities to output
  const output = {
    ...data,
    opportunities: opportunities.slice(0, 50),
  };

  // 8. Write to JSON file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));

  // 9. Print summary
  console.log('--- Summary ---');
  console.log(`Total keywords: ${data.summary.totalKeywords}`);
  // ... more output
}
```

### File Discovery Functions

**findFileInDir()**
```typescript
function findFileInDir(dir: string, pattern: RegExp): string | null
```
- Checks if directory exists
- Reads directory contents
- Finds first file matching regex pattern
- Returns full file path or null

**findGSCDir()**
```typescript
function findGSCDir(): string | null
```
- Checks if GSC directory exists
- Finds subdirectory matching `*-Performance-on-Search-*` pattern
- Returns full directory path or null

---

## Using the Output Data

### In Content Generation

When generating content, you can reference the unified data:

```typescript
import unifiedData from '@/data/keyword-research/unified-data.json';

// Find keywords for a topic
const transcriptKeywords = unifiedData.keywords.filter(kw =>
  kw.keyword.includes('transcript') &&
  kw.volume > 1000
);

// Get top opportunities
const quickWins = unifiedData.opportunities.filter(o =>
  o.type === 'quick-win' &&
  o.priority === 'high'
);

// Check keyword data
const targetKeyword = unifiedData.keywords.find(kw =>
  kw.slug === 'youtube-transcript-generator'
);

console.log(`Volume: ${targetKeyword.volume}`);
console.log(`Difficulty: ${targetKeyword.difficulty}`);
console.log(`Current position: ${targetKeyword.gscPosition}`);
```

### In Content Planning

Use the data to plan content strategy:

```typescript
// Find content gaps (not ranking, high volume)
const contentGaps = unifiedData.opportunities.filter(o =>
  o.type === 'content-gap'
).slice(0, 20);

// Generate content plan
for (const gap of contentGaps) {
  console.log(`Create: ${gap.suggestedTitle}`);
  console.log(`Type: ${gap.suggestedContentType}`);
  console.log(`Expected traffic: ${gap.potentialTraffic} clicks/month`);
}
```

---

## Updating Data

**When to re-run the parser:**
- New SEMrush/Ahrefs export available
- Weekly GSC data update
- After major content changes
- Before planning new content batch

**Recommended schedule:**
- Weekly: Update GSC data only
- Monthly: Full update with all sources
- After launches: Update to measure impact

---

## Troubleshooting

### No data sources found

**Error:**
```
No data sources found. Please add CSV files to data/keyword-research/
```

**Solution:**
1. Check directory structure
2. Verify file naming patterns
3. Ensure at least one data source is present

### CSV parsing errors

**Error:**
```
SyntaxError: Unexpected token in JSON at position...
```

**Solution:**
1. Check CSV file encoding (should be UTF-8)
2. Remove any BOM (Byte Order Mark) characters
3. Verify CSV headers match expected format

### Missing columns

**Error:**
```
Cannot read property 'Keyword' of undefined
```

**Solution:**
1. Verify CSV export settings
2. Check column headers match expected names
3. Ensure CSV has header row

---

## Integration with Claude

When Claude needs keyword data, reference the unified data:

**Example prompts:**

> "Check unified-data.json for keywords related to 'youtube transcript'"

> "What are the top 10 quick-win opportunities from our keyword research?"

> "Find content gaps for keywords with volume > 5000"

> "Which keywords have AI Overview opportunities?"

Claude can then:
1. Read the JSON file
2. Filter/analyze the data
3. Make content recommendations
4. Generate data-driven content plans
