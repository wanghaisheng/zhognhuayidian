# Content Operations

Content lifecycle management, performance metrics, and common mistakes reference.

> **Related Files**:
> - [quality-checklist.md](quality-checklist.md) - Content type checklists
> - [quality-technical.md](quality-technical.md) - TypeScript validation

---

## Content Lifecycle Management

### Lifecycle Stages

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  Draft  │ →  │ Review  │ →  │  Live   │ →  │ Update  │ →  │ Archive │
└─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘
```

### Update Schedule

| Content Type | Review Frequency | Update Triggers |
|--------------|------------------|-----------------|
| `alternative` | Monthly | Competitor pricing changes |
| `best-of` | Monthly | Tool updates, new entrants |
| `blog` (guides) | Quarterly | Process changes |
| `blog` (tools) | Monthly | Tool updates |
| `blog` (insights) | Annual | New data available |
| `use-case` | Quarterly | Industry stat updates |
| `testimonial` | Annual | Verify still accurate |
| `faq` | Quarterly | Common question changes |
| `landing` | As needed | Feature updates |

### Update vs Archive Decision

```
Is the content still accurate?
├─ YES → Keep live, update lastVerified
│
└─ NO  → Can it be updated?
         ├─ YES (minor) → Update content, update updateDate
         ├─ YES (major) → Consider rewrite or new content
         └─ NO  → Archive
                 - Add "archived" notice
                 - Redirect to current content
                 - Remove from sitemap
```

---

## Performance Metrics (KPIs)

### Metrics by Content Type

| Content Type | Primary KPI | Secondary KPIs |
|--------------|-------------|----------------|
| `blog` | Organic traffic | Time on page, Scroll depth |
| `alternative` | Conversion to product | Comparison table engagement |
| `best-of` | Affiliate clicks | Time on page |
| `use-case` | Lead generation | CTA clicks |
| `testimonial` | Trust signals | Social shares |
| `faq` | Rich snippet appearances | Reduced support tickets |
| `landing` | Signups/conversions | Bounce rate |

### Target Benchmarks

| Metric | Poor | Average | Good | Excellent |
|--------|------|---------|------|-----------|
| Bounce rate | >70% | 50-70% | 30-50% | <30% |
| Time on page | <1m | 1-2m | 2-4m | >4m |
| Scroll depth | <25% | 25-50% | 50-75% | >75% |
| CTR (SERP) | <1% | 1-3% | 3-5% | >5% |
| Conversion | <0.5% | 0.5-2% | 2-5% | >5% |

### Tracking Setup

| Metric | How to Track | Tool |
|--------|--------------|------|
| Organic traffic | Google Search Console | GSC |
| Bounce rate | Google Analytics events | GA4 |
| Time on page | Engagement time | GA4 |
| Scroll depth | Custom scroll events | GA4 |
| Rich snippets | Appearance reports | GSC |
| Conversions | Goal tracking | GA4 |

---

## Common Mistakes Library

### Content Structure Mistakes

| Mistake | Example | Fix |
|---------|---------|-----|
| **Burying the answer** | 3 paragraphs of intro before answer | Lead with direct answer in first paragraph |
| **Clickbait title** | "You Won't Believe..." | Match title promise to content |
| **Skipping heading levels** | H1 → H3 | Use H1 → H2 → H3 hierarchy |
| **Wall of text** | 10-sentence paragraph | Max 3-5 sentences per paragraph |
| **No Key Takeaways** | Long article, no summary | Add 5-7 Key Takeaways after intro |

### Data & Citation Mistakes

| Mistake | Example | Fix |
|---------|---------|-----|
| **Vague numbers** | "very fast" | Use "2-5 seconds" |
| **Unsourced stats** | "95% of users..." | Add "(Source: [Name])" |
| **Outdated pricing** | Last year's prices | Verify and add pricingLastVerified |
| **Broken links** | 404 citations | Verify all URLs before publish |
| **tier3 only citations** | Only Reddit sources | Add tier1/tier2 authoritative sources |

### SEO Mistakes

| Mistake | Example | Fix |
|---------|---------|-----|
| **Title too long** | 80 characters | Keep under 60 characters |
| **Duplicate meta** | Same description on all pages | Unique description per page |
| **Missing keywords** | Target keyword not in H1 | Include in title, H1, first paragraph |
| **No internal links** | Orphan page | Add 3-5 relatedPosts |
| **No FAQ schema** | FAQ section without markup | Add FAQSchema component |

### Content Type Selection Mistakes

| Mistake | Why It's Wrong | Correct Approach |
|---------|----------------|------------------|
| Using `alternative` for 5 tools | Too many for 1v1 format | Use `best-of` |
| Using `testimonial` without verification | Damages trust | Use `use-case` or get verification |
| Using `blog` for product features | Wrong intent | Use `landing` |
| Creating `faq` page with 3 questions | Too thin | Embed as faqs[] field |
| Using `use-case` with real customer data | Underutilizes proof | Upgrade to `testimonial` |

### Process Mistakes

| Mistake | Impact | Prevention |
|---------|--------|------------|
| No lastVerified date | Content appears outdated | Always set and update |
| Empty relatedPosts | Poor internal linking | Minimum 2-3 related items |
| Publishing without checklist | Quality issues | Run quality-checklist.md |
| Copying competitor content | No unique value | Add original data/perspective |
| Ignoring search intent | High bounce rate | Match content to user goal |

---

## Quality Improvement Process

### Weekly Review

```
[ ] Check top 10 pages for accuracy
[ ] Verify pricing data still current
[ ] Check for broken internal links
[ ] Review search console for new queries
```

### Monthly Audit

```
[ ] Full content inventory review
[ ] Update all pricingLastVerified dates
[ ] Check competitor content changes
[ ] Update statistics with latest data
[ ] Review underperforming content
```

### Quarterly Strategy

```
[ ] Content gap analysis
[ ] Keyword opportunity review
[ ] Content consolidation (merge thin content)
[ ] Archive outdated content
[ ] Plan new content based on trends
```

---

## Content Handoff Checklist

Before marking content as "Ready for Review":

```
[ ] All TypeScript compiles without errors
[ ] All required fields populated
[ ] All optional fields either populated or omitted (not empty arrays)
[ ] All dates in YYYY-MM-DD format
[ ] All slugs lowercase with hyphens only
[ ] title < 60 characters
[ ] metaDescription < 160 characters
[ ] keyTakeaways 5-7 items
[ ] faqs count matches content type requirement
[ ] At least 1 tier1/tier2 citation (if required)
[ ] relatedPosts 2-5 items
[ ] Post-generation checklist added as comment
```

---

## Recovery Procedures

### Content Type Correction

If wrong content type was used:

1. Export existing content data
2. Map fields to correct type (see `COMPONENT-MAPPING.md`)
3. Create new file with correct type
4. Set up redirect from old URL
5. Remove old file after redirect period

### Quality Issue Remediation

If content fails quality review:

| Issue Severity | Response | Timeline |
|----------------|----------|----------|
| Critical (factual error) | Immediate fix | Same day |
| High (missing citations) | Priority fix | 24 hours |
| Medium (formatting issues) | Scheduled fix | 1 week |
| Low (style preferences) | Batch fix | Next update cycle |
