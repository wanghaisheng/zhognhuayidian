# Failure Recovery Guide

What to do when batch generation goes wrong.

---

## Scenario 1: Mass Generation Failure (50+ broken articles)

**Symptoms**: Generated 50-100 articles, most have TypeScript errors

**Root Cause**: Generated without incremental validation

### ❌ Wrong Response (Wasteful)

- Regenerate all 100 articles from scratch (10+ hours)
- Enter Plan Mode to design regeneration strategy
- Use multiple agents to regenerate in parallel

**Why wrong**: Wastes tokens/time, doesn't address root cause

### ✅ Correct Response (Efficient)

**Step 1: Stop & Quarantine** (5 min)
```bash
# Move broken files to quarantine
mkdir -p src/lib/blog-posts/.broken-files
mv src/lib/blog-posts/*-broken*.ts src/lib/blog-posts/.broken-files/

# Keep only working files
npm run build  # Should succeed now
```

**Step 2: Root Cause Analysis** (10 min)
```bash
# Sample 3-5 broken files
head -60 src/lib/blog-posts/.broken-files/{file1,file2,file3}.ts

# Look for patterns:
# - Line 5: wrong import path?
# - Line 40: wrong EEAT structure?
# - Line 30: wrong field names?
```

Common patterns:
| Pattern | Fix |
|---------|-----|
| `import from './types'` | Should be `'../blog-types'` |
| `eeat: { experience: ... }` | Should be `authorInfo: DEFAULT_AUTHOR` |
| `publishedAt:` | Should be `publishDate:` |
| Content field not closed | Add closing `,` |

**Step 3: Fix One Article Perfectly** (15 min)
- Choose 1 broken article
- Fix all issues manually
- Verify: `npx tsc --noEmit src/lib/blog-posts/fixed-article.ts`
- **This becomes your new template**

**Step 4: Systematic Repair** (NOT regeneration)

**Option A: Batch sed replacements** (if errors are consistent)
```bash
# Fix import paths
sed -i "" "s|from './types'|from '../blog-types'|g" .broken-files/*.ts

# Fix field names
sed -i "" 's/publishedAt:/publishDate:/g' .broken-files/*.ts
sed -i "" 's/updatedAt:/updateDate:/g' .broken-files/*.ts

# Move fixed files back
mv .broken-files/*.ts ./
npm run build
```

**Option B: Targeted regeneration** (if content needs rewriting)
- Sort by search volume (reuse metadata)
- Regenerate top 10 articles (1 hour)
- Validate: `npm run build`
- Repeat for next 10

**Step 5: Prevention**
- Update Skills with lessons learned
- Add new anti-pattern to documentation
- Set calendar reminder to validate every 5 articles

---

## Scenario 2: EEAT Type Errors (Wrong Structure)

**Symptoms**: "Type '{ experience: ... }' is not assignable to type 'EEATEnhancement'"

**Root Cause**: Using old/incorrect EEAT structure

**Quick Fix**:
```typescript
// ❌ Wrong
eeat: {
  experience: { demonstrated: true },
  expertise: { credentials: [] },
}

// ✅ Correct
eeat: {
  authorInfo: DEFAULT_AUTHOR,
  externalCitations: [
    { title: '...', url: '...', tier: 'tier1', accessDate: '2026-02-01' }
  ],
  lastVerified: '2026-02-01',
}
```

**Bulk fix**:
```bash
# Find all files with wrong structure
grep -l "experience:" src/lib/blog-posts/*.ts

# Manual fix required - no sed pattern (structure too complex)
# Fix 1 article, use as template for rest
```

---

## Scenario 3: Unclosed Template Strings

**Symptoms**: "Expected ',', got ';'" at end of file

**Root Cause**: Content field template string never closed

**Detection**:
```bash
# Check for closing pattern
grep -L "^\`,\$" src/lib/blog-posts/*.ts

# Should have:
#   `,
#   relatedPosts: [...]
```

**Fix**:
1. Open file in editor
2. Find content field (starts with `content: \``)
3. Ensure it ends with:
   ```
   `,
   relatedPosts: [
   ```

---

## Scenario 4: TypeScript Escaping Errors

**Symptoms**: Parsing errors in code blocks

**Root Cause**: Backticks not escaped in template strings

**Fix Rules**:
```typescript
// Inline code
// Before: Use the `fetch()` API
// After: Use the \`fetch()\` API

// Code blocks
// Before: ```javascript
// After: \`\`\`javascript

// Template strings in code
// Before: `https://api.example.com/${id}`
// After: \`https://api.example.com/\${id}\`
```

**Bulk fix**:
```bash
# No automated fix - escaping patterns are context-dependent
# Fix 1 article, use as reference
```

---

## Scenario 5: Field Name Mismatches

**Symptoms**: TypeScript errors on publishedAt, updatedAt, readingTime

**Root Cause**: Used wrong field names from memory

**Quick Reference**:
| ❌ Wrong | ✅ Correct |
|----------|-----------|
| `publishedAt:` | `publishDate:` |
| `updatedAt:` | `updateDate:` |
| `readingTime: "10 min"` | `readTime: 10` |
| `author: { name: '...' }` | `author: 'NoteLM Team'` |

**Bulk fix**:
```bash
# Fix field names
sed -i "" 's/publishedAt:/publishDate:/g' src/lib/blog-posts/*.ts
sed -i "" 's/updatedAt:/updateDate:/g' src/lib/blog-posts/*.ts

# readTime requires manual fix (string → number)
grep -l "readingTime:" src/lib/blog-posts/*.ts
```

---

## Decision Matrix: Regenerate vs Repair

| Condition | Action | Time | When to Use |
|-----------|--------|------|-------------|
| <10 broken articles | 🔧 Repair manually | 1-2 hours | Fastest for small numbers |
| 10-30 broken, consistent errors | 🔧 Repair with sed | 2-3 hours | Pattern is clear |
| 10-30 broken, inconsistent errors | 🔄 Regenerate | 3-4 hours | Content needs rewriting |
| 30-50 broken | 🔄 Regenerate top priority | 4-5 hours | Focus on high-value |
| 50+ broken | 🔧 Repair patterns + regenerate | 5-8 hours | Hybrid approach |

**Key principle**: Repair is faster than regeneration when errors are consistent.

---

## Recovery Workflow Template

```markdown
### Recovery Plan for [N] Broken Articles

**1. Quarantine** (5 min)
- [ ] Moved broken files to .broken-files/
- [ ] Build succeeds with working files only

**2. Root Cause** (10 min)
- [ ] Sampled 3-5 files
- [ ] Identified pattern: [description]
- [ ] Error type: [EEAT/Field Names/Escaping/Other]

**3. Fix Template** (15 min)
- [ ] Fixed 1 article perfectly
- [ ] Verified compiles: `npx tsc --noEmit ...`
- [ ] Saved as new template

**4. Systematic Repair**
- [ ] Option A: sed replacements (if consistent)
- [ ] Option B: Regenerate (if inconsistent)
- [ ] Fixed [X] articles
- [ ] Build succeeds: `npm run build`

**5. Prevention**
- [ ] Documented failure in Skills
- [ ] Updated workflow
- [ ] Set validation reminders

**Time**: [actual] vs [estimated]
**Lessons**: [what learned]
```

---

## Prevention Checklist

After recovery, update your workflow:

- [ ] Add batch size limit to generation prompts (max 10)
- [ ] Set timer for validation (every 30 min)
- [ ] Create validation script (`validate-batch.sh`)
- [ ] Document the failure pattern in this file
- [ ] Share lessons learned with team

---

## Common Error Patterns Reference

### Import Errors
```typescript
// ❌ Wrong
import { BlogPostData } from './types';
import { BlogPostData } from './blog-types';

// ✅ Correct
import { BlogPostData } from '../blog-types';
import { DEFAULT_AUTHOR } from '../eeat-types';
```

### EEAT Structure Errors
```typescript
// ❌ Wrong - Old structure
eeat: {
  experience: { demonstrated: true, description: '...' },
  expertise: { credentials: [...] },
  authoritativeness: { signals: [...] },
  trustworthiness: { factors: [...] }
}

// ✅ Correct - New structure
eeat: {
  authorInfo: DEFAULT_AUTHOR,
  externalCitations: [
    { title: '...', url: '...', tier: 'tier1', accessDate: '2026-02-01' }
  ],
  lastVerified: '2026-02-01',
  dataDisclaimer: 'Optional disclaimer text'
}
```

### Field Name Errors
```typescript
// ❌ Wrong
publishedAt: '2026-01-01',
updatedAt: '2026-01-01',
readingTime: '10 min read',
author: { name: 'NoteLM Team', role: 'Content Team' }

// ✅ Correct
publishDate: '2026-01-01',
updateDate: '2026-01-01',
readTime: 10,
author: 'NoteLM Team'
```

---

## When to Give Up on Recovery

If recovery is taking longer than regeneration, switch strategies:

**Give up on repair if**:
- Spent >4 hours on sed/manual fixes
- Errors are too inconsistent for patterns
- Content quality is poor (need to rewrite anyway)

**Switch to regeneration if**:
- Can reuse metadata (slug, title, keywords)
- Have working template now
- Can prioritize by search volume

---

## Related Files

- [batch-generation-safety.md](batch-generation-safety.md) - Prevention strategies
- [quality-gates.md](quality-gates.md) - Validation checkpoints
- [quality-technical.md](quality-technical.md) - Technical validation rules
