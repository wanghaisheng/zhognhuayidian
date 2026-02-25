# Quality Checklist

Content type checklists for quality verification.

> **Related Files**:
> - [quality-technical.md](quality-technical.md) - TypeScript validation and reference tables
> - [content-operations.md](content-operations.md) - Lifecycle, KPIs, common mistakes

---

## Quick Check (All Content Types)

### CORE Required

- [ ] **C01** First paragraph answers title promise in <150 words
- [ ] **O01** Heading hierarchy H1→H2→H3, no skipping
- [ ] **R01** All data has units
- [ ] **E01** At least 1 unique value point

### EEAT Required

- [ ] **Experience** Has first-person test narrative
- [ ] **Authority** At least 1 tier1/tier2 citation
- [ ] **Trust** Has lastVerified date

### SEO Required

- [ ] title length < 60 characters
- [ ] metaDescription length < 160 characters
- [ ] keywords array has 5-10 keywords
- [ ] keyTakeaways has 5-7 points

---

## Content Type Specific Checklists

### Blog Post - How-To Guide

```
[ ] CORE
    [ ] C01 First-screen answer (method name + steps overview)
    [ ] C10 Conclusion loop (summary + next steps)
    [ ] O04 Bullet lists (Features/Limitations)
    [ ] O05 Key Takeaways (5-7 items)
    [ ] O06 Step numbers (1-2-3)
    [ ] R01 Precise data (time, percentage, price)
    [ ] R02 Source attribution (statistics)
    [ ] E04 Practical tools (checklist/template)

[ ] EEAT
    [ ] E01 First person ("We tested...", "I found...")
    [ ] E05 Pain points (Limitations section)
    [ ] A01 Authoritative citations (official docs)
    [ ] T04 Update date (updateDate)

[ ] Structure
    [ ] Method count matches title
    [ ] Each method has: Steps, Features, Limitations, Best For
    [ ] Has method comparison table
    [ ] FAQ 5-8 questions

[ ] Internal Links
    [ ] relatedPosts 3-5
    [ ] relatedTools 1-3
    [ ] relatedUseCases 1-3
```

### Blog Post - Tool Comparison

```
[ ] CORE
    [ ] C01 First-screen answer (best choice + test scale)
    [ ] O05 Quick Comparison table
    [ ] R01 Precise test data (accuracy%, speed in seconds)
    [ ] R02 Pricing data cites source
    [ ] E02 Original test data

[ ] EEAT
    [ ] E02 Methodology explanation
    [ ] E03 Testing duration/sample size
    [ ] A03 Pricing cites official source
    [ ] T05 Fair analysis (pros/cons for each tool)

[ ] Structure
    [ ] How We Tested section
    [ ] Each tool has: What We Tested, Results, Features, Pricing, Limitations
    [ ] Selection guide table (Your Need → Best Choice)
    [ ] FAQ 8-10 questions

[ ] Pricing Verification
    [ ] pricingLastVerified date
    [ ] Pricing source URL
    [ ] PRICING_DISCLAIMER
```

### Alternative Page (Comparison)

```
[ ] CORE
    [ ] C01 DirectAnswer one-sentence summary
    [ ] O05 Quick Comparison table (10-15 rows)
    [ ] R02 Competitor pricing cites source
    [ ] E01 Unique value (why choose your product)

[ ] EEAT
    [ ] T05 Fair analysis (acknowledge 3 competitor strengths)
    [ ] A03 Competitor pricing cites official source
    [ ] T03 Interest disclosure (if own product)

[ ] Structure
    [ ] 4 reasons to choose (reasons)
    [ ] competitorPros (3 items)
    [ ] competitorCons (3 items)
    [ ] Decision framework (who should choose what)
    [ ] Pricing comparison table
    [ ] FAQ 6-8 questions
    [ ] Verdict conclusion

[ ] Fairness
    [ ] No disparaging language
    [ ] Competitor strengths described accurately
    [ ] winner labels are reasonable
```

### Use Case Page

```
[ ] CORE
    [ ] C01 Tagline directly states value
    [ ] O05 Benefits with statistics
    [ ] R02 Statistics cite sources

[ ] EEAT
    [ ] E04 Specific scenario descriptions
    [ ] A02 industryStats from authoritative sources
    [ ] T01 testimonial is real or marked as example

[ ] Structure
    [ ] benefits 5-7 items (with statistic)
    [ ] features 4-6 items
    [ ] steps 3-5 items
    [ ] testimonial (if available)
    [ ] faqs 5-7 items
    [ ] industryStats (if available)

[ ] Internal Links
    [ ] relatedProducts
    [ ] relatedTools
    [ ] relatedUseCases (similar)
```

### FAQ Page

```
[ ] CORE
    [ ] C01 Introduction directly states topic
    [ ] C03 Term definitions (if needed)

[ ] EEAT
    [ ] A01 Answers cite authoritative sources (if applicable)

[ ] Structure
    [ ] 6-10 FAQs
    [ ] Each answer 2-4 sentences
    [ ] relatedArticles
    [ ] relatedLink (internal links in FAQ)
```

### Best-Of Listicle

```
[ ] CORE
    [ ] C01 First-screen answer (who is #1)
    [ ] O03 Clear ranking order
    [ ] R01 Precise ratings/data
    [ ] E02 Selection criteria explained

[ ] EEAT
    [ ] E02 Testing methodology
    [ ] A03 Pricing from official sources
    [ ] T05 isOwnProduct marks own product

[ ] Structure
    [ ] 5-10 tools in list
    [ ] Each has: rank, rating, pros, cons, bestFor
    [ ] selectionCriteria
    [ ] comparisonTable
    [ ] faqs 5-8 items
    [ ] authorNote (if available)
```

### Landing Page

```
[ ] CORE
    [ ] C01 Hero tagline states core value
    [ ] O05 Features with icons
    [ ] R01 Specific capabilities stated

[ ] EEAT
    [ ] E01 "Built for" context
    [ ] T01 What it does clearly stated

[ ] Structure
    [ ] features 4-6 items
    [ ] steps (how it works) 3-5 items
    [ ] faqs 4-6 items
    [ ] CTA buttons

[ ] Internal Links
    [ ] relatedTools
    [ ] relatedUseCases
```

### Testimonial Page

```
[ ] CORE
    [ ] C01 Results headline with data
    [ ] O05 beforeAfter metrics
    [ ] R01 Precise results data

[ ] EEAT
    [ ] E01 Real usage story
    [ ] T01 User verification status
    [ ] T06 lastVerified date

[ ] Structure
    [ ] user (name, role, company, isVerified)
    [ ] story narrative
    [ ] beforeAfter (3-5 metrics)
    [ ] quote (highlighted testimonial)
    [ ] faqs 3-5 items

[ ] Verification
    [ ] lastVerified date
    [ ] Verifiable user (if isVerified: true)
```

---

## Checklist Usage Guide

### When to Use

1. **Content Generation**: Run checklist after generating first draft
2. **Content Review**: Verify all items before publishing
3. **Content Update**: Re-verify after major edits

### Priority Order

If time-constrained, prioritize in this order:

1. **Critical**: C01 (first paragraph answer), O01 (heading hierarchy)
2. **High**: R01 (data units), EEAT citations, SEO fields
3. **Medium**: Structure requirements, internal links
4. **Low**: Optional enhancements

### Validation Command

```bash
# TypeScript compilation check
npm run build

# If using a linter
npm run lint
```
