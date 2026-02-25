# Batch Generation Safety Protocol

## ⚠️ CRITICAL RULES

1. **Maximum Batch Size**: 10 articles (5 for first-time users)
2. **Mandatory Validation**: Run `npm run build` after EACH batch
3. **Error Threshold**: If >2 articles fail, STOP immediately
4. **Template First**: ALWAYS copy from working article, NEVER write from scratch

---

## Why Batch Generation Fails

### Common Anti-Patterns

| ❌ Anti-Pattern | Result | ✅ Prevention |
|----------------|--------|---------------|
| Generate 50+ articles at once | 90% failure rate | Max 10 per batch |
| Skip validation until end | Errors compound unseen | Validate per batch |
| Write from memory | Type/field name errors | Copy-paste template |
| Trust the first draft | EEAT structure wrong | Read type definitions first |

### Real-World Example

**Scenario**: Generate 110 articles without validation

- Generated: 110 articles (10 hours)
- Discovered: 236 broken files (1 hour debugging)
- Fixed: 6+ hours of error correction
- **Total waste**: 7 hours

**Better approach**: 5 articles → validate → 5 more

- Generated: 5 articles (30 min)
- Validated: Found 2 errors (5 min)
- Fixed: Pattern error in template (15 min)
- Continued: 105 articles error-free (9 hours)
- **Total time**: 10 hours (saved 7 hours)

---

## Pre-Flight Checklist (MANDATORY)

Before generating ANY content:

- [ ] **Read actual type definitions** from project's `src/lib/`
  ```bash
  cat src/lib/blog-types.ts       # BlogPostData interface
  cat src/lib/eeat-types.ts       # EEAT structure
  ```

- [ ] **Identify golden template** - find 1-2 working articles in same category
  ```bash
  # List recent working articles
  ls -lt src/lib/blog-posts/*.ts | head -5

  # Read a golden template
  cat src/lib/blog-posts/deepseek-v4-api-guide.ts
  ```

- [ ] **Copy template structure** - don't write from scratch
  - Keep: imports, export structure, EEAT format, field order
  - Change: slug, title, keywords, content only

- [ ] **Test build command**
  ```bash
  npm run build  # Should succeed before starting
  ```

- [ ] **Set batch size** - 5 articles (beginner) or 10 articles (experienced)

---

## Generation Workflow

### Batch Loop (Repeat for each batch)

```bash
# 1. Generate 5-10 articles
# Use existing article as template, only change:
# - slug, title, keywords, content
# Keep structure identical to template

# 2. Validate IMMEDIATELY (< 5 min after generation)
npm run build

# 3. Spot check (1-2 articles)
# - EEAT structure: authorInfo (not experience/expertise)
# - Field names: publishDate, updateDate, readTime
# - Backticks escaped in code blocks

# 4. Fix errors NOW
# Don't defer to next batch
# If same error in >2 articles, STOP and fix template
```

### Error Thresholds

| Errors in Batch | Action |
|----------------|--------|
| 0-1 errors | ✅ Continue to next batch |
| 2 errors | ⚠️ Review and fix pattern |
| 3+ errors | 🚨 STOP - template is wrong |

### Validation Commands

```bash
# Per-article validation (30 sec)
npx tsc --noEmit src/lib/blog-posts/new-article.ts

# Per-batch validation (5 min)
npm run build

# Pattern checks
grep "eeat:" src/lib/blog-posts/batch-*.ts  # Should use authorInfo
grep "publishDate:" src/lib/blog-posts/batch-*.ts  # Not publishedAt
```

---

## Emergency Stop Conditions

🚨 **STOP ALL GENERATION IF**:
- Same TypeScript error appears in >2 articles
- EEAT type errors (wrong structure)
- Build time suddenly increases (>30 sec)
- Field name errors (publishedAt/updatedAt detected)

**Recovery Protocol**:
1. Move broken files to `.broken-files/` directory
2. Keep 1 broken file for analysis
3. Fix root cause (wrong template/structure)
4. Create 1 perfect article
5. Resume with batch size = 3 (reduced)

---

## ROI Calculation

### Cost of Skipping Safety Protocol

- Generate 100 articles without validation: **10 hours**
- Discover 90 are broken: **0.5 hours debugging**
- Fix or regenerate 90 articles: **15 hours**
- **Total**: 25.5 hours

### Cost of Following Safety Protocol

- Read type definitions: **5 min**
- Generate Batch 1 (10 articles): **1 hour**
- Validate + fix: **15 min**
- Generate Batches 2-10: **9 hours**
- **Total**: 10.5 hours

**Savings**: 15 hours (60% time reduction)

---

## Checklist Template

Copy this for each batch:

```markdown
### Batch [N] Checklist

**Pre-flight**:
- [ ] Read type definitions (5 min)
- [ ] Identified golden template
- [ ] Test build succeeds

**Generation**:
- [ ] Generated [X] articles
- [ ] Used template, changed content only

**Validation**:
- [ ] `npm run build` passed
- [ ] Spot-checked 1-2 articles
- [ ] EEAT structure correct
- [ ] Field names correct

**Errors**: [0/1/2/3+]
- [ ] If 0-1: Continue
- [ ] If 2: Fixed pattern
- [ ] If 3+: STOPPED, fixed template

**Next**: Batch [N+1] or DONE
```

---

## Related Files

- [quality-gates.md](quality-gates.md) - Mandatory validation checkpoints
- [failure-recovery.md](failure-recovery.md) - What to do when things go wrong
- [quality-technical.md](quality-technical.md) - TypeScript validation rules
