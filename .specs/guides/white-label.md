
# 🏷️ Engineering Guide: White Label & Customization

**Goal:** Transform the "Instant Ship™" scaffold into **YOUR Product**.
**Time Estimate:** 15-30 Minutes.

This guide provides a step-by-step checklist to strip the original branding, apply your identity, and prepare the architecture for your specific business logic.

## Phase 1: Brand Injection (The "Skin")

### Step 1: Global Configuration (`site.config.ts`)
This file is the "Brain" of your site's identity.
- [ ] **Change Name & Domain**: Update `name`, `domain` (your production URL).
- [ ] **Update Socials**: Replace the `author` object with your name and social links.
- [ ] **Analytics**: Clear or replace the IDs in `analytics` (or use `.env`).
- [ ] **Clean Routes**: If you don't need `/manifesto` or `/pricing`, remove them from the `routes` array.

### Step 2: Visual Identity (`tailwind.config.js`)
Change the look and feel instantly by updating the color palette.
- [ ] **Primary Color**: Locate `theme.extend.colors.primary`. Change the hex code to your brand color.
- [ ] **Fonts**: If you want to change `Inter`, update `index.html` (Google Fonts) and `font-family` in `tailwind.config.js`.

### Step 3: Text & Copy (`i18n.ts`)
This is where "Instant Ship" text lives.
- [ ] **Find & Replace**: Search for "Instant Ship" and replace with your product name.
- [ ] **Nav Links**: Update `nav` object if you changed routes in Step 1.
- [ ] **Landing Page**: Rewrite `welcome`, `audience`, and `workflow` sections to match your product's value proposition.

### Step 4: App Manifest (`public/manifest.json`)
Ensure your PWA looks like your app on mobile.
- [ ] **Update Name**: Change `name` and `short_name`.
- [ ] **Update Icons**: Replace the `picsum.photos` links with your actual logo paths (e.g., `/assets/icon-192.png`).

## Phase 2: Structural Cleanup (The "Body")

The default scaffold includes sections specific to the "100 Product Challenge". You likely want to remove them.

### Step 1: Clean the Homepage (`routes/$lang.index.tsx`)
- [ ] **Remove Components**: Delete `<FounderIdentity />`, `<ShippingRitual />`, or `<Manifesto />` if they don't fit your narrative.
- [ ] **Update Hero**: Ensure `<Hero />` is passing the correct translation keys for your new product.

### Step 2: Footer Cleanup (`routes/__root.tsx`)
- [ ] **Remove "Challenge" Link**: In the `<footer>`, remove the section linking to the "100 Product Challenge" unless you are participating.
- [ ] **Copyright**: Verify the dynamic year and brand name updates automatically (it reads from `siteConfig`).

---

## Phase 3: Adding New Features (The "Expansion")

Now that the site looks like yours, here is how to add a new functional page (e.g., a "Tools" page), following the core architecture.

### Step 1: Create Components (The Views)
Following Atomic Design, build your UI pieces first in the `components/` directory. For a "Tools" page, you might create:
*   `components/tools/ToolCard.tsx` (Molecule)
*   `components/tools/ToolsGrid.tsx` (Organism)

### Step 2: Create the Route (The Controller)
Create a file: `routes/$lang.tools.tsx`. This file will fetch data and use your components to render the UI.

```tsx
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { ToolsGrid } from '../../components/tools/ToolsGrid'; // Your Organism
import { useToolsData } from '../../hooks/useToolsData'; // Your data hook

export const Route = createFileRoute('/$lang/tools')({
  component: ToolsPage,
});

function ToolsPage() {
  const { t } = useTranslation();
  const { tools, loading } = useToolsData();

  return (
    <div className="py-20 animate-fade-in">
      <h1>{t('tools.title')}</h1>
      {loading ? <p>Loading tools...</p> : <ToolsGrid tools={tools} />}
    </div>
  );
}
```
**Note**: The route file's job is to assemble components. All complex UI logic lives inside the `components/` directory.

### Step 3: Register for SEO (`site.config.ts`)
**Crucial:** If you don't do this, the page won't have a title tag or sitemap entry.
```typescript
routes: [
  // ... existing
  { path: "/tools", titleKey: "tools.title", descriptionKey: "tools.desc" }
]
```

### Step 4: Add Translations (`i18n.ts`)
```typescript
{
  translation: {
    tools: {
      title: "AI Tools Suite",
      desc: "Powerful generators for your workflow."
    }
  }
}
```

### Step 5: Add to Navigation (`routes/__root.tsx`)
Find the `<nav>` section and add your link:
```tsx
<Link to={getLocalizedPath('/tools')} ... >
  {t('nav.tools')} // Add 'tools' to your nav.ts translation files
</Link>
```

---

## Phase 4: Launch Prep (The "Ignition")

### Step 1: Environment Variables
Create a `.env` file (locally) or configure in Cloudflare Pages:
- `VITE_GA_ID` (Your Google Analytics)
- `VITE_CLARITY_ID` (Your Clarity Project)
- `API_KEY` (Gemini API for the SEO optimizer script, optional)

### Step 2: GitHub Actions
- Ensure `github/workflows/ci-suite.yml` has write permissions enabled in your repo settings (Settings > Actions > General > Read and write permissions).

### Step 3: Build & Test
Run `npm run build`.
- Check `dist/sitemap.xml`: Does it have your new routes?
- Check `dist/index.html`: Is the title tag correct?

**🎉 You are ready. Slay the delay.**
