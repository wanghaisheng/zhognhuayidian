# Keyword Research Data Guide

Use keyword research data from SEMrush, Ahrefs, and Google Search Console to inform content creation.

---

## Quick Reference

| File | Purpose |
|------|---------|
| `types.ts` | TypeScript type definitions |
| `parsers.ts` | CSV parsing utilities |
| `GUIDE.md` | This guide (detailed) |
| `CHEATSHEET.md` | Quick reference (condensed) |

---

## Supported Data Sources

**Note:** Directory names are historical. `semrush/` contains Ahrefs data, `ahrefs/` contains SEMrush data.

### 1. SEMrush (SERP Analysis Export - stored in `ahrefs/`)

Export path: **Organic Research > SERP Analysis > Export > CSV**

| Field | Use |
|-------|-----|
| Keyword | Target keyword |
| URL | Ranking competitor URL |
| Difficulty | 0-100 score |
| Volume | Monthly search volume |
| Position | Current SERP position |
| Domain rating | Competitor domain strength |
| Traffic | Estimated traffic |
| Referring Domains | Backlink count |
| Intents | Informational/Commercial/Transactional |
| SV trend | 24-month search volume history |
| SV Forecasting trend | 12-month forecasted trend |

**File naming**: `google_us_youtube_匹配术语_serps_YYYY-MM-DD.csv`

### 2. Ahrefs (Broad Match Export - stored in `semrush/`)

Export path: **Keywords Explorer > Matching terms > Export**

| Field | Use |
|-------|-----|
| Keyword | Target keyword |
| Intent | Search intent classification |
| Volume | Monthly search volume |
| Keyword Difficulty | 0-100 score |
| CPC | Commercial value |
| Competitive Density | 0-1 PPC competition scale |
| SERP Features | AI Overview, Featured Snippet opportunities |
| Trend | 12-month volume trend (0-1 scale) |

**File naming**: `youtube_broad-match_us_YYYY-MM-DD.csv`

### 3. Google Search Console (Performance Export)

Export path: **Performance > Export > CSV**

| File | Contains |
|------|----------|
| Queries.csv | Actual search queries, clicks, impressions, CTR, position |
| Pages.csv | Page-level performance metrics |
| Countries.csv | Geographic breakdown |
| Devices.csv | Device type breakdown |
| Search appearance.csv | Rich result types |

**Directory naming**: `{domain}-Performance-on-Search-YYYY-MM-DD/`

---

## Using Keyword Data for Content

### Step 1: Load Data

When creating content, reference keyword research data:

```
Read the keyword research CSV files to find:
- Target keyword and search volume
- Keyword difficulty
- SERP features available
- Current ranking position (from GSC)
```

### Step 2: Set Content Fields

Use data to populate content fields:

```typescript
// From keyword research
targetKeyword: 'youtube transcript generator',
monthlySearchVolume: 8100,  // From SEMrush/Ahrefs
keywords: [                  // Related keywords
  'youtube transcript generator',
  'youtube transcript download',
  'youtube caption extractor',
  ...
],
```

### Step 3: Identify Opportunities

Look for these patterns:

| Pattern | Opportunity | Priority |
|---------|-------------|----------|
| Position 4-20 + high impressions | Quick win (optimize existing) | High |
| High volume + low difficulty + no ranking | Content gap (new content) | High |
| Position 1-10 + low CTR | Title/meta optimization | Medium |
| High volume + high difficulty | Long-term content investment | Low |

---

## Content Type Selection by Intent

| Primary Intent | Recommended Type |
|----------------|------------------|
| Informational | `blog` (guides, tutorials) |
| Commercial | `alternative`, `best-of` |
| Transactional | `landing`, `tool` page |
| Navigational | Improve existing pages |

---

## SERP Feature Optimization

| SERP Feature | Content Strategy |
|--------------|------------------|
| AI Overview | Add `directAnswer` field, clear structure |
| Featured Snippet | Bulleted lists, tables, step-by-step |
| People Also Ask | Add comprehensive FAQ section |
| Video | Add video embed or video schema |
| Top Stories | Fresh content, news angle |

---

## Quick Win Identification

A "quick win" keyword has:

1. **Position 4-20** in GSC
2. **High impressions** (100+ per period)
3. **Moderate-to-high volume** (500+)
4. **Moderate difficulty** (<60)

Action: Optimize existing page content, title, meta description.

---

## Content Gap Identification

A "content gap" keyword has:

1. **No current ranking** (not in GSC data)
2. **High volume** (1000+)
3. **Moderate difficulty** (<50)
4. **Relevant to product**

Action: Create new targeted content.

---

## CSV File Locations

Store CSV files in `data/keyword-research/` by export type (note: directory names are historical):

```
data/keyword-research/
├── semrush/                          # Ahrefs Keywords Explorer exports
│   └── youtube_broad-match_us_2026-02-01.csv
├── ahrefs/                           # SEMrush Organic Research exports
│   └── google_us_youtube_匹配术语_serps_2026-02-01.csv
├── gsc/                              # Google Search Console exports
│   └── notelm.ai-Performance-on-Search-2026-02-01/
│       ├── Queries.csv
│       ├── Pages.csv
│       ├── Countries.csv
│       ├── Devices.csv
│       └── Search appearance.csv
└── unified-data.json                 # Generated output
```

> **Note**: CSV files are gitignored (large files, competitive data).

---

## Example: Finding Target Keyword Data

When creating a blog post about "youtube transcript download":

1. **Search SEMrush data** for exact match:
   ```
   Keyword: youtube transcript download
   Volume: 2,400
   Difficulty: 35
   SERP Features: Featured snippet, People also ask
   Intent: Informational, Transactional
   ```

2. **Check GSC data** for current performance:
   ```
   Query: youtube transcript download
   Clicks: 12
   Impressions: 890
   Position: 15.3
   ```

3. **Populate content data**:
   ```typescript
   {
     targetKeyword: 'youtube transcript download',
     monthlySearchVolume: 2400,
     // Current position 15 = Quick win opportunity
   }
   ```

---

## Related Keywords Extraction

For `relatedPosts` and `keywords` fields, find related terms:

1. **Same parent keyword** (SEMrush)
2. **Similar intents**
3. **Overlapping SERP features**
4. **GSC queries to same page**

Example for "youtube transcript":
```typescript
keywords: [
  'youtube transcript download',      // Exact match
  'youtube transcript generator',     // Related
  'youtube caption extractor',        // Synonym
  'download youtube subtitles',       // Alternative phrasing
  'youtube video transcript',         // Variation
],
```

---

## Monthly Search Volume Tiers

| Tier | Volume | Content Investment |
|------|--------|-------------------|
| Very High | 10,000+ | Major pillar content |
| High | 1,000-10,000 | Standard blog post |
| Medium | 100-1,000 | Quick content or FAQ |
| Low | <100 | Only if highly relevant |

---

## Validation Checklist

Before creating content, verify:

- [ ] Target keyword has volume data
- [ ] Difficulty is reasonable (<70 for new sites)
- [ ] Intent matches content type
- [ ] No existing content ranks well for this keyword
- [ ] SERP features are achievable
- [ ] Keyword is relevant to product/service
