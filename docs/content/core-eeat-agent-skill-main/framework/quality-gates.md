# Quality Gates - Mandatory Validation Checkpoints

Quality Gates are **mandatory checkpoints** that MUST pass before proceeding.

---

## Gate 1: Pre-Generation (MUST PASS)

**Trigger**: Before generating any content

**Checks**:
- [ ] Read actual type definitions from `src/lib/` (not examples)
- [ ] Identified golden template for this content type
- [ ] Batch size ≤ 10 articles
- [ ] Build command tested: `npm run build` succeeds

**If failed**: ❌ Do NOT proceed with generation

**Time**: 5-10 minutes

**Why critical**: 90% of failures happen because type definitions weren't read

---

## Gate 2: Per-Article (DURING Generation)

**Trigger**: After generating EACH article

**Checks**:
```bash
# Quick compile check
npx tsc --noEmit src/lib/blog-posts/new-article.ts
```

**If failed**: ❌ Fix immediately before generating next article

**Time**: 30 seconds per article

**Why critical**: Catches syntax errors before they compound

**Skip condition**: Only skip for articles 2-5 in batch IF article 1 passed

---

## Gate 3: Per-Batch (AFTER 5-10 articles)

**Trigger**: After completing a batch

**Checks**:
```bash
# Full build
npm run build

# Pattern checks
grep "eeat:" src/lib/blog-posts/batch-*.ts  # Should use authorInfo
grep "publishDate:" src/lib/blog-posts/batch-*.ts  # Should exist (not publishedAt)

# Structure check
grep -c "^\`,\$" src/lib/blog-posts/batch-*.ts  # Content field should close
```

**Error Threshold**:
- 0-1 errors: ✅ Continue
- 2 errors: ⚠️ Review pattern
- 3+ errors: 🚨 STOP, fix template

**If failed**: ❌ Fix all errors before next batch

**Time**: 5 minutes

**Why critical**: Prevents error accumulation across batches

---

## Gate 4: Integration (BEFORE moving to next batch)

**Trigger**: After batch validation passes

**Checks**:
- [ ] Updated `index.ts` with new imports
- [ ] Added to appropriate `DAY_X_POSTS` array
- [ ] `npm run build` succeeds with new articles
- [ ] Spot-checked 1-2 articles manually

**If failed**: ❌ Fix integration before Batch N+1

**Time**: 5 minutes

**Why critical**: Ensures new articles are properly integrated

---

## Emergency Brake Conditions

These conditions trigger IMMEDIATE STOP:

| Condition | Severity | Action |
|-----------|----------|--------|
| Build errors increased from Batch N-1 | 🚨 Critical | STOP, diagnose root cause |
| Same error in >3 articles | 🚨 Critical | STOP, fix template |
| EEAT type errors | 🔴 High | STOP, read type definitions |
| Unclosed template strings | 🔴 High | STOP, fix escaping |
| publishedAt/updatedAt detected | 🟡 Medium | Fix before next article |

**Resume Condition**: Only after root cause fixed and 1 perfect article created as new template

---

## Quality Gate Enforcement

### How to Use

1. **Print this checklist** or keep in separate window
2. **Check off each gate** as you complete it
3. **Don't skip gates** - each takes <10 min but saves hours later

### Batch Workflow with Gates

```
START
  ↓
Gate 1: Pre-Generation ✓
  ↓
Generate Article 1
  ↓
Gate 2: Per-Article ✓
  ↓
Generate Articles 2-10
  ↓
Gate 3: Per-Batch ✓
  ↓
Gate 4: Integration ✓
  ↓
Next Batch or DONE
```

### Automation (Optional)

Create validation script:

```bash
#!/bin/bash
# validate-batch.sh

echo "Gate 3: Per-Batch Validation"

# Build check
echo "Running build..."
npm run build || { echo "❌ Build failed"; exit 1; }

# Pattern checks
echo "Checking EEAT structure..."
grep -L "authorInfo:" src/lib/blog-posts/DAY_*.ts && echo "⚠️ Missing authorInfo"

echo "Checking field names..."
grep -l "publishedAt:" src/lib/blog-posts/DAY_*.ts && echo "❌ Wrong field: publishedAt"

echo "✅ Batch validation passed"
```

Usage: `./validate-batch.sh` after each batch

---

## Gate Checklist Template

Copy for each batch:

```markdown
### Batch [N] - Quality Gates

**Gate 1: Pre-Generation**
- [ ] Read src/lib/blog-types.ts
- [ ] Read src/lib/eeat-types.ts
- [ ] Golden template: [filename]
- [ ] Batch size: [5/10]
- [ ] Build test: ✅

**Gate 2: Per-Article** (first article only)
- [ ] Article 1 compiles: `npx tsc --noEmit src/lib/blog-posts/[file].ts`

**Gate 3: Per-Batch**
- [ ] `npm run build` passed
- [ ] EEAT check: authorInfo present
- [ ] Field check: publishDate present
- [ ] Structure check: content fields closed
- [ ] Errors: [0/1/2/3+]

**Gate 4: Integration**
- [ ] Updated index.ts
- [ ] Added to DAY_[X]_POSTS
- [ ] Build with integration: ✅
- [ ] Spot-checked: [2] articles

**Status**: ✅ PASS / ⚠️ REVIEW / 🚨 STOP
```

---

## Frequently Asked Questions

### Can I skip Gate 2 for all articles?

No for article 1, Yes for articles 2-10 IF article 1 passed. This assumes you're using the same template structure.

### What if Gate 3 finds 1 error?

Fix it and continue. 1 error is acceptable and often a typo.

### What if I'm experienced and want to generate 20 articles?

**Don't.** Experience doesn't prevent template errors. Max 15 articles even for experts.

### Can I run gates in parallel?

No. Gates are sequential by design. Skipping ahead causes errors to compound.

### How long do all 4 gates take?

- Gate 1: 5-10 min (one-time per session)
- Gate 2: 30 sec × 1 article = 30 sec
- Gate 3: 5 min per batch
- Gate 4: 5 min per batch

**Total per batch**: ~10-15 min overhead
**ROI**: Saves 1-3 hours of debugging per batch

---

## Related Files

- [batch-generation-safety.md](batch-generation-safety.md) - Batch size and safety rules
- [failure-recovery.md](failure-recovery.md) - What to do when gates fail
- [quality-technical.md](quality-technical.md) - Technical validation details
