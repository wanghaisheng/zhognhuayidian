# Project Data Skill Creator

Create a project-specific data skill in 7 steps.

**⭐ NEW in v2**: Added Step 0 (mandatory discovery), Step 7 (safety & validation), and batch generation safeguards.

---

## Directory Structure

```
[project]-content-data/         # In .claude/skills/
├── SKILL.md              # Entry point (⭐ with Step 0 & safety sections)
├── types.md              # Type reference (actual types in src/lib/)
├── brand.md              # Voice, CTAs, positioning
├── data/
│   ├── statistics.md     # Verified stats
│   └── citations.md      # Source library
└── examples/             # Content examples (.md format)

scripts/                        # In project root ⭐ NEW
└── validate-batch.sh     # Batch validation script

data/keyword-research/          # In project root (gitignored)
├── README.md             # Setup instructions
├── semrush/              # SEMrush CSV exports
├── ahrefs/               # Ahrefs CSV exports
└── gsc/                  # GSC CSV exports
```

> **Note**: Use `.md` files for skills to avoid TypeScript compilation errors. Actual type definitions should live in your project's `src/lib/` directory. Keyword research CSVs are stored at project root in `data/keyword-research/`.

---

## Step 0: Discover Existing Content ⚠️ MANDATORY

**This step is REQUIRED before creating any content.** It prevents 90% of type/structure errors.

### 0.1 Discover Type Definitions (5 min)

```bash
# Find actual type definition files
find src/lib -name "*-types.ts" -o -name "*-data.ts"

# Read BlogPostData structure
cat src/lib/blog-types.ts

# Read EEAT structure
cat src/lib/eeat-types.ts

# Find DEFAULT_AUTHOR and constants
grep -r "export const DEFAULT_AUTHOR" src/lib/
grep -r "export const.*_CITATIONS" src/lib/
```

### 0.2 Identify Golden Templates (3 min)

Find 2-3 working articles for EACH content type:

```bash
# List recent blog posts (sorted by modification time)
ls -lt src/lib/blog-posts/*.ts | head -10

# Find articles by category
grep -l "category: 'guides'" src/lib/blog-posts/*.ts | head -3
grep -l "category: 'tools'" src/lib/blog-posts/*.ts | head -3

# Check file sizes (golden templates are usually 15-30 KB)
ls -lh src/lib/blog-posts/*.ts | grep "K" | head -5
```

**Document your golden templates:**

| Content Type | Golden Template File | Why Good |
|--------------|---------------------|----------|
| Blog (guides) | `deepseek-v4-api-guide.ts` | Complete EEAT, 3800 words |
| Blog (tools) | `deepseek-v4-vs-chatgpt.ts` | Comparison structure |
| Blog (youtube) | `youtube-transcript-guide.ts` | YouTube-specific |
| (add others) | | |

### 0.3 Document Project Structure

| Content Type | Data Location | Type Definition | Golden Template |
|--------------|---------------|-----------------|-----------------|
| Blog posts | `src/lib/blog-posts/` | `src/lib/blog-types.ts` | `deepseek-v4-api-guide.ts` |
| Alternative pages | `src/lib/alternatives-data.ts` | `src/lib/alternative-types.ts` | (find one) |
| (add others) | | | |

### 0.4 Verify Build Works (1 min)

```bash
# Test build BEFORE starting
npm run build

# Should output: ✓ Compiled successfully
# If errors: Fix them before creating any content
```

**⚠️ DO NOT SKIP Step 0** - It saves hours of debugging later.

### Set Up Keyword Research Data

Run this single command to set up everything automatically:

```bash
# Create directories, .gitkeep files, README, and update .gitignore
mkdir -p data/keyword-research/{semrush,ahrefs,gsc} && \
touch data/keyword-research/{semrush,ahrefs,gsc}/.gitkeep && \
cat > data/keyword-research/README.md << 'EOF'
# Keyword Research Data

Store CSV exports from SEMrush, Ahrefs, and Google Search Console here.

## Directory Structure

- `semrush/` - SEMrush Keyword Magic Tool exports
- `ahrefs/` - Ahrefs Keywords Explorer exports
- `gsc/` - Google Search Console Performance exports

## How to Export

### SEMrush
1. Keyword Magic Tool → Enter seed keyword → Export CSV

### Ahrefs
1. Keywords Explorer → Matching terms → Export

### GSC
1. Performance → Set date range → Export CSV

## Usage

See `.claude/skills/content-generator-framework/keyword-research/GUIDE.md`
EOF
grep -q "keyword-research" .gitignore 2>/dev/null || cat >> .gitignore << 'EOF'

# keyword research data (large files, competitive intelligence)
/data/keyword-research/**/*.csv
EOF
echo "✓ Keyword research data directory set up"
```

Then manually download CSVs into the appropriate folders. See `keyword-research/GUIDE.md` for export instructions.

---

## Step 1: SKILL.md

Fill in and save as `SKILL.md`:

```markdown
# [PROJECT] Content Data

**Requires**: `content-generator-framework` skill

---

## ⚠️ MANDATORY: Step 0 - Discover Before Creating

**Complete BEFORE generating any content:**

### Read Type Definitions (5 min)
```bash
cat src/lib/blog-types.ts       # BlogPostData interface
cat src/lib/eeat-types.ts       # EEAT structure
```

### Identify Golden Templates (3 min)

| Content Type | Golden Template | Location | Use For |
|--------------|----------------|----------|---------|
| Blog (guides) | `[filename].ts` | `src/lib/blog-posts/` | Technical tutorials |
| Blog (tools) | `[filename].ts` | `src/lib/blog-posts/` | Comparisons |
| Blog (youtube) | `[filename].ts` | `src/lib/blog-posts/` | YouTube-specific |

**How to use golden templates:**
1. Open the file: `cat src/lib/blog-posts/[golden-template].ts`
2. Copy the ENTIRE structure
3. Only change: slug, title, keywords, content
4. Keep: imports, EEAT format, field order

### Verify Build (1 min)
```bash
npm run build  # Must succeed before starting
```

**See**: [content-generator-framework/framework/batch-generation-safety.md](../content-generator-framework/framework/batch-generation-safety.md)

---

## Products

| Product | Slug | Tagline |
|---------|------|---------|
| [Name] | [slug] | [tagline] |

## Competitors

| Competitor | Pricing URL | Our Advantage |
|------------|-------------|---------------|
| [Name] | [url] | [advantage] |

## Default Author

From `src/lib/eeat-types.ts`:

\`\`\`typescript
export const DEFAULT_AUTHOR = {
  name: '[Team Name]',
  bio: '[One sentence]',
  credentials: ['[Cred 1]', '[Cred 2]']
};
\`\`\`
```

---

## Step 2: types.md

Create a type reference document (actual types live in `src/lib/`):

```markdown
# [PROJECT] Type Definitions

Reference for types used in content generation.

## Actual Type Locations

| Type | Location |
|------|----------|
| `BlogPostData` | `src/lib/blog-types.ts` |
| `EEATEnhancement` | `src/lib/eeat-types.ts` |
| `DEFAULT_AUTHOR` | `src/lib/eeat-types.ts` |

## Project-Specific Types

### Winner Type
\`\`\`typescript
type [Project]Winner = 'competitor' | '[product]' | 'tie';
\`\`\`

### Blog Categories
\`\`\`typescript
type [Project]Category = 'guides' | 'tools' | '[custom-category]';
\`\`\`

## Default Author

From `src/lib/eeat-types.ts`:
\`\`\`typescript
export const DEFAULT_AUTHOR = {
  name: '[Team Name]',
  bio: '[Description]',
  credentials: ['[Cred 1]', '[Cred 2]']
};
\`\`\`
```

---

## Step 3: brand.md

```markdown
# [PROJECT] Brand

## Voice

| Attribute | Do | Don't |
|-----------|-----|-------|
| Helpful | "Here's how..." | "You might try..." |
| Specific | "2-5 seconds" | "Very fast" |
| Fair | "X excels at..." | "X is bad" |

## Key Differentiators

| Point | Description | Proof |
|-------|-------------|-------|
| [Diff 1] | [Description] | [Evidence] |
| [Diff 2] | [Description] | [Evidence] |

## CTAs

| Context | Text | Link |
|---------|------|------|
| Blog end | "Try [Product] Free" | /[product] |
| Comparison | "Get Started" | /[product] |

## Competitor: [Name]

| Aspect | Them | Us |
|--------|------|-----|
| Strength | [Their strength] | [Our approach] |
| Weakness | [Their limit] | [Our advantage] |
| Best For | [Their user] | [Our user] |
```

---

## Step 4: data/statistics.md

```markdown
# Statistics

> Update schedule: See `framework/content-operations.md`

## [Category] Stats

\`\`\`typescript
export const [CATEGORY]_STATS = {
  [statName]: {
    value: '[Number with units]',
    source: '[Source]',
    sourceUrl: '[URL]',
    verified: 'YYYY-MM-DD'
  }
} as const;
\`\`\`

## Usage

\`\`\`typescript
import { MARKET_STATS } from './statistics';
// → `${MARKET_STATS.stat.value} (Source: ${MARKET_STATS.stat.source})`
\`\`\`
```

---

## Step 5: data/citations.md

```markdown
# Citations

> Requirements: See `framework/quality-technical.md`

## Tier Definitions

| Tier | Type | Use For |
|------|------|---------|
| tier1 | Official docs, pricing | Features, pricing |
| tier2 | Industry reports | Trends, market data |
| tier3 | Community | User experiences |

## Official (tier1)

\`\`\`typescript
export const OFFICIAL = {
  [name]: {
    title: '[Title]',
    url: '[URL]',
    tier: 'tier1' as const,
    accessDate: 'YYYY-MM-DD'
  }
} as const;
\`\`\`

## Competitor Pricing (tier1)

\`\`\`typescript
export const PRICING = {
  [competitor]: {
    title: '[Competitor] Pricing',
    url: '[URL]',
    tier: 'tier1' as const,
    accessDate: 'YYYY-MM-DD',
    plans: { free: '$0', pro: '$X/mo' }
  }
} as const;
\`\`\`

## Industry (tier2)

\`\`\`typescript
export const INDUSTRY = {
  [name]: {
    title: '[Title]',
    url: '[URL]',
    tier: 'tier2' as const
  }
} as const;
\`\`\`
```

---

## Step 6: Create First Example

Create `examples/blog/guide-example.md`:

```markdown
# Blog Post Example: Guide Category

Reference for creating blog posts.

## File Location

Create actual posts in: `src/lib/blog-posts/[slug].ts`

## Imports

\`\`\`typescript
import { BlogPostData } from '../blog-types';
import { DEFAULT_AUTHOR, YOUTUBE_CITATIONS } from '../eeat-types';
\`\`\`

## Required Fields

\`\`\`typescript
export const myBlogPost: BlogPostData = {
  slug: 'example-post',
  category: 'guides',
  title: 'Example Title [2026]',
  excerpt: 'Description...',
  metaDescription: 'SEO description...',
  keywords: ['keyword1', 'keyword2'],
  targetKeyword: 'primary keyword',
  publishDate: '2026-01-31',
  updateDate: '2026-01-31',
  readTime: 7,
  author: 'Team Name',
  content: \`Full markdown content...\`,
  relatedPosts: ['related-post-1'],
  // ... see existing posts for full structure
};
\`\`\`

## Reference

See existing posts in `src/lib/blog-posts/` for complete examples.
```

> **Important**: Example should reference actual project code structure. See existing blog posts for complete field list and content patterns.

---

## Step 7: Safety & Validation Setup ⭐ NEW

Add validation tools and error checks to your project skill.

### 7.1 Create Validation Script

Create `scripts/validate-batch.sh` in your project:

```bash
#!/bin/bash
# validate-batch.sh
# Run after each batch of content generation

echo "🔍 Batch Validation Started..."

# Gate 1: Build check
echo "1. Running build..."
npm run build || { echo "❌ Build failed"; exit 1; }

# Gate 2: EEAT structure check
echo "2. Checking EEAT structure..."
wrong_eeat=$(grep -l "experience:" src/lib/blog-posts/*.ts 2>/dev/null)
if [ ! -z "$wrong_eeat" ]; then
    echo "❌ Wrong EEAT structure found in:"
    echo "$wrong_eeat"
    exit 1
fi

# Gate 3: Field name check
echo "3. Checking field names..."
wrong_fields=$(grep -l "publishedAt:\|updatedAt:\|readingTime:" src/lib/blog-posts/*.ts 2>/dev/null)
if [ ! -z "$wrong_fields" ]; then
    echo "❌ Wrong field names found in:"
    echo "$wrong_fields"
    exit 1
fi

# Gate 4: Import path check
echo "4. Checking import paths..."
wrong_imports=$(grep -l "from './types'" src/lib/blog-posts/*.ts 2>/dev/null)
if [ ! -z "$wrong_imports" ]; then
    echo "❌ Wrong import paths found in:"
    echo "$wrong_imports"
    exit 1
fi

# Gate 5: Content field closure check
echo "5. Checking content field closures..."
unclosed=$(grep -L "^\`,\$" src/lib/blog-posts/*.ts 2>/dev/null)
if [ ! -z "$unclosed" ]; then
    echo "⚠️ Potentially unclosed content fields in:"
    echo "$unclosed"
fi

echo "✅ Batch validation passed!"
```

Make executable:
```bash
chmod +x scripts/validate-batch.sh
```

Usage:
```bash
# After generating each batch
./scripts/validate-batch.sh
```

### 7.2 Add Common Error Checks to SKILL.md

Add this section to your project's `SKILL.md`:

```markdown
## Common Errors & Quick Fixes

Run these checks if build fails:

### Check 1: EEAT Structure
```bash
# Find files with wrong EEAT structure
grep -l "experience:" src/lib/blog-posts/*.ts

# Should use: authorInfo, externalCitations, lastVerified
# NOT: experience, expertise, authoritativeness, trustworthiness
\`\`\`

### Check 2: Field Names
```bash
# Find wrong field names
grep -l "publishedAt:\|updatedAt:\|readingTime:" src/lib/blog-posts/*.ts

# Should be: publishDate, updateDate, readTime
\`\`\`

### Check 3: Import Paths
```bash
# Find wrong import paths
grep -l "from './types'" src/lib/blog-posts/*.ts

# Should be: from '../blog-types', from '../eeat-types'
\`\`\`

### Quick Fix Commands
```bash
# Fix field names (bulk)
sed -i "" 's/publishedAt:/publishDate:/g' src/lib/blog-posts/*.ts
sed -i "" 's/updatedAt:/updateDate:/g' src/lib/blog-posts/*.ts

# Fix import paths (bulk)
sed -i "" "s|from './types'|from '../blog-types'|g" src/lib/blog-posts/*.ts
\`\`\`

**See**: [content-generator-framework/framework/failure-recovery.md](../content-generator-framework/framework/failure-recovery.md)
```

### 7.3 Add Batch Generation Reminder

Add this to your `SKILL.md` at the top, right after "Requires":

```markdown
## 🚨 Before Generating Content

**MANDATORY**: Read these first
- [batch-generation-safety.md](../content-generator-framework/framework/batch-generation-safety.md)
- [quality-gates.md](../content-generator-framework/framework/quality-gates.md)

**Quick rules:**
- Max batch size: 10 articles
- Validate after EACH batch: `npm run build`
- Use golden templates: DON'T write from scratch
- If >2 errors in batch: STOP, fix template

**If errors**: [failure-recovery.md](../content-generator-framework/framework/failure-recovery.md)
```

---

## Validation Checklist

```
[ ] Step 0 completed - existing content discovered ⚠️ MANDATORY
[ ] Golden templates identified (at least 2)
[ ] Keyword research data directory created (data/keyword-research/)
[ ] CSV files added to .gitignore
[ ] SKILL.md - products, competitors, author, Step 0 section ⭐ NEW
[ ] SKILL.md - Safety reminder section added ⭐ NEW
[ ] SKILL.md - Common errors section added ⭐ NEW
[ ] types.md - type reference with actual locations
[ ] brand.md - voice, differentiators, CTAs, positioning
[ ] data/statistics.md - at least 3 verified stats
[ ] data/citations.md - tier1 and tier2 sources
[ ] examples/ - at least 1 complete example (.md format)
[ ] scripts/validate-batch.sh created and executable ⭐ NEW
[ ] All dates YYYY-MM-DD
[ ] All URLs verified
[ ] All files are .md (no .ts in skills directory)
```

---

## Optional: Content Planning

Add `planning.md` for content calendar:

```markdown
# Content Plan

## Queue

| Priority | Title | Type | Keyword | Status |
|----------|-------|------|---------|--------|
| P1 | [Title] | blog | [keyword] | Planned |

## Status: Idea → Planned → Draft → Review → Published
```

---

## Optional: Multilingual

| Priority | Fields | Notes |
|----------|--------|-------|
| Must | title, metaDescription, content | SEO-critical |
| Should | faqs, tagline | UX |
| Research | keywords | Per locale |
| Keep | dates, URLs, citations | Universal |
