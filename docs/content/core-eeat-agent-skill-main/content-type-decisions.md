# Content Type Decision Guide

Detailed decision trees and boundary definitions for choosing the correct content type.

> **Quick Start**: See [SKILL.md](SKILL.md) for basic flowchart. Use this file for edge cases.

---

## MECE Boundary Definitions

### Content Type Boundaries

| Boundary | Type A | Type B | Key Differentiator |
|----------|--------|--------|-------------------|
| 1v1 vs N comparison | `alternative` | `best-of` | Alternative = persuade switch; Best-of = help choose |
| User story focus | `use-case` | `testimonial` | Use-case = persona benefits; Testimonial = verified results |
| FAQ placement | `faq` page | `faqs[]` field | Dedicated page vs section in other content |
| Tutorial vs review | `blog` guides | `blog` tools | Guides = how to do; Tools = what to use |

---

## Alternative vs Best-Of Decision

```
How many products are you comparing?
│
├─► 1v1 (Your Product vs 1 Competitor)
│   └─► alternative
│       Example: "NoteLM vs Otter.ai"
│       Goal: Persuade users to switch FROM competitor
│
├─► 1vN (Your Product vs 2+ Competitors)
│   └─► Decision: Primary goal?
│       ├─► Persuade switch to YOUR product? → alternative (pick primary competitor)
│       └─► Help user choose objectively? → best-of
│
└─► NvN (Multiple Products, No "Your" Product)
    └─► best-of
        Example: "Best 10 YouTube Transcript Tools"
        Goal: Help user find best option for their needs
```

**Key Triggers**:
- **Use `alternative`**: Title is "[Your Product] vs [Competitor]" or "Best [Competitor] Alternative"
- **Use `best-of`**: Title is "Best [Category] Tools" or "Top N [Tools] for [Purpose]"
- **3+ products** in fair comparison → `best-of` (even if your product is included)

| Scenario | Content Type | Reason |
|----------|--------------|--------|
| "NoteLM vs Otter.ai" | `alternative` | 1v1, persuade switch |
| "Best Otter.ai Alternatives" | `alternative` | Positioning against specific competitor |
| "Best 10 Transcription Tools" | `best-of` | Objective ranking of many |
| "NoteLM vs Otter vs Descript" | `best-of` | 3+ products, needs ranking |

---

## When Content Fits Multiple Types

**Priority Rule**: Choose based on **primary conversion goal**:

```
1. Persuade user to switch from competitor? → alternative
2. Help user decide among options? → best-of
3. Prove product works with real data? → testimonial
4. Show how persona benefits? → use-case
5. Teach a skill/process? → blog (guides)
```

---

## Blog Category Boundaries

```
QUESTION: What is the PRIMARY focus?

"How to [ACTION]"
  → Is it about using a specific tool?
      YES → tools (if comparing/reviewing tools)
      NO  → guides (if teaching a process)

"[GOAL] tips/strategies"
  → Is it about growth/monetization?
      YES → growth
      NO  → guides

"[AI FEATURE] explained"
  → ai-features

"[YEAR] statistics/trends"
  → insights
```

---

## Growth vs Guides Decision

```
Is the PRIMARY goal revenue/audience increase?
│
├─► YES → growth
│   Examples:
│   - "How to monetize YouTube videos"
│   - "10 strategies to grow your channel"
│   - "YouTube SEO tips for more views"
│
└─► NO → Is it teaching a specific skill/process?
         ├─► YES → guides
         │   Examples:
         │   - "How to edit videos in Premiere"
         │   - "How to add subtitles to YouTube"
         └─► NO → Other category
```

**Key Test**: If you removed the word "growth" from the title, would it still make sense as a how-to guide?
- "How to grow your channel" → Remove "grow" → Still makes sense as process → `growth`
- "How to download subtitles" → Not about growth → `guides`

| Edge Case | Correct Category | Reason |
|-----------|------------------|--------|
| "How to use Tool X" | `guides` | Teaching process, not reviewing |
| "Tool X vs Tool Y" | `tools` | Comparing tools |
| "Best AI tools for X" | `tools` | Reviewing multiple tools |
| "How AI summarization works" | `ai-features` | Explaining AI capability |
| "YouTube growth tips" | `growth` | Primary goal is audience increase |
| "How to grow YouTube channel" | `growth` | Revenue/audience focus |
| "YouTube analytics guide" | `guides` | Teaching tool usage, not growth strategy |

---

## When NOT to Use Each Type

| Content Type | Don't Use When |
|--------------|----------------|
| `blog` | Single product feature (use `landing`) |
| `alternative` | Comparing 3+ products (use `best-of`) |
| `best-of` | Only comparing to one competitor (use `alternative`) |
| `use-case` | Have verified customer data (use `testimonial`) |
| `testimonial` | No real customer/data (use `use-case`) |
| `faq` | Only 3-4 questions (embed as `faqs[]` field) |
| `landing` | Long educational content (use `blog`) |

---

## Content Type Migration

When content evolves, migrate to appropriate type:

| From | To | Trigger |
|------|-----|---------|
| `use-case` | `testimonial` | Get real customer verification |
| `blog` (guides) | `landing` | Becomes core product feature |
| `faq` section | `faq` page | FAQ count exceeds 10 |
| `alternative` | `best-of` | Add 3+ competitor comparisons |
| `blog` (tools) | `best-of` | Formal ranking methodology added |

**Migration Checklist**:
```
[ ] Export existing content
[ ] Create new content type file
[ ] Update internal links pointing to old URL
[ ] Set up redirect from old URL
[ ] Update sitemap
[ ] Remove old file after redirect period
```

---

## Quick Reference

| Question | Answer |
|----------|--------|
| How many products? | 1v1 → alternative, 3+ → best-of |
| Real customer data? | Yes → testimonial, No → use-case |
| FAQ count? | <5 → embed, 5-9 → either, 10+ → dedicated page |
| Primary goal? | Switch → alternative, Choose → best-of |
| Content length? | Long educational → blog, Short product → landing |
