# Keyword Research Cheatsheet

Quick reference for using keyword research data in content creation.

---

## CSV File Locations

**Note:** Directory names are historical. `semrush/` contains Ahrefs data, `ahrefs/` contains SEMrush data.

```
data/keyword-research/
├── semrush/                                  # Ahrefs Keywords Explorer exports
│   └── youtube_broad-match_us_*.csv
├── ahrefs/                                   # SEMrush Organic Research exports
│   └── google_us_youtube_匹配术语_serps_*.csv
├── gsc/                                      # GSC exports
│   └── notelm.ai-Performance-on-Search-*/
│       ├── Queries.csv
│       └── Pages.csv
└── unified-data.json                         # Generated output
```

---

## SEMrush CSV Columns (SERP Analysis - stored in `ahrefs/`)

| Column | Description | Use |
|--------|-------------|-----|
| Keyword | Search term | `targetKeyword` |
| URL | Ranking competitor URL | Competitor analysis |
| Volume | Monthly US searches | `monthlySearchVolume` |
| Difficulty | 0-100 score | Priority filter |
| Position | Current SERP position | Ranking analysis |
| Domain rating | Competitor domain strength (0-100) | Difficulty assessment |
| Traffic | Estimated traffic | ROI estimation |
| Intents | "Informational,Commercial,..." | Content type selection |
| SV trend | 24-month history | Trend analysis |
| SV Forecasting trend | 12-month forecast | Planning |

---

## Ahrefs CSV Columns (stored in `semrush/`)

| Column | Description | Use |
|--------|-------------|-----|
| Keyword | Search term | `targetKeyword` |
| Volume | Monthly searches | `monthlySearchVolume` |
| Keyword Difficulty | 0-100 score | Priority filter |
| Intent | "Informational, Commercial" | Content type selection |
| Trend | 12-month pattern (0-1 scale) | Seasonality check |
| Competitive Density | 0-1 scale | PPC competition |
| SERP Features | "AI Overview,Featured snippet,..." | GEO optimization |
| Number of Results | Total SERP results | Competition level |

---

## GSC Queries.csv Columns

| Column | Description | Use |
|--------|-------------|-----|
| Top queries | Search query | Current rankings |
| Clicks | Actual clicks | Performance baseline |
| Impressions | Search appearances | Visibility potential |
| CTR | Click-through rate | Optimization target |
| Position | Avg ranking | Quick win identification |

---

## GSC Pages.csv Columns

| Column | Description | Use |
|--------|-------------|-----|
| Top pages | Full URL | Page mapping |
| Clicks | Page clicks | Top performers |
| Impressions | Page impressions | Visibility |
| CTR | Page CTR | Optimization needs |
| Position | Avg position | Content gaps |

---

## Opportunity Types

| Type | Criteria | Action |
|------|----------|--------|
| **Quick Win** | Position 4-20, high impressions | Optimize existing |
| **Content Gap** | High volume, no ranking | Create new content |
| **Low CTR** | Position 1-10, CTR <5% | Improve title/meta |
| **New Keyword** | High volume, low difficulty | Plan new content |

---

## Content Type by Intent

| Intent | Content Type |
|--------|--------------|
| Informational | `blog` (how-to, guide) |
| Commercial | `alternative`, `best-of` |
| Transactional | `landing`, tool page |
| Navigational | Improve existing pages |

---

## SERP Feature Optimization

| Feature | Content Strategy |
|---------|------------------|
| AI Overview | Clear `directAnswer`, structured content |
| Featured Snippet | Lists, tables, step-by-step |
| People Also Ask | Comprehensive FAQ section |
| Video | Video embed, VideoObject schema |

---

## Search Volume Tiers

| Tier | Monthly Volume | Investment |
|------|----------------|------------|
| Very High | 10,000+ | Pillar content |
| High | 1,000-10,000 | Standard post |
| Medium | 100-1,000 | Quick content |
| Low | <100 | Only if relevant |

---

## Priority Matrix

```
           High Volume
              │
    HIGH      │      MEDIUM
   PRIORITY   │     PRIORITY
              │
──────────────┼──────────────
              │
    MEDIUM    │       LOW
   PRIORITY   │     PRIORITY
              │
           Low Volume

   Low Difficulty → High Difficulty
```

---

## Example: Finding Keyword Data

**Goal**: Create content for "youtube transcript download"

**Step 1**: Search SEMrush CSV (in `ahrefs/` directory)
```bash
grep -i "youtube transcript download" data/keyword-research/ahrefs/*.csv
```

**Step 2**: Check GSC for current ranking
```bash
grep -i "transcript download" data/keyword-research/gsc/*/Queries.csv
```

**Step 3**: Populate content data
```typescript
{
  targetKeyword: 'youtube transcript download',
  monthlySearchVolume: 2400,
  keywords: [
    'youtube transcript download',
    'download youtube transcript',
    'youtube subtitle download',
  ],
}
```

---

## Related Keywords Pattern

Find related keywords by:

1. **Same parent keyword** (SEMrush `Parent Keyword` column)
2. **Similar volume range** (±50%)
3. **Same intent type**
4. **Word variations** (singular/plural, synonyms)

---

## Data Freshness

| Source | Update Frequency | Check Date |
|--------|------------------|------------|
| SEMrush | Monthly | Filename date |
| Ahrefs | Monthly | Filename date |
| GSC | Real-time | Export date |

Always use the most recent CSV files.
