---
id: 1305
category: core
title: "New Product Migration Protocol"
desc: "The Master SOP: How to migrate a raw idea into the Instant Ship™ engine, combining Engineering and Marketing protocols."
---

# 🚀 New Product Migration Protocol: From Zero to Global Authority

**Objective:** To systematically migrate a new product requirement into the **Instant Ship™** ecosystem.
**Philosophy:** This protocol merges the **G+L+C Engineering Stack** with the **Marketing SOPs** to ensure you don't just ship code, but ship a market-ready asset.

---

## Phase 1: Strategic Reconnaissance (Marketing SOP Module A)
**Stop! Do not touch the code yet.** Before you prompt the AI, you must define the target.

1.  **Execute Keyword Research Protocol**:
    *   Open `./keyword-research-protocol.md`.
    *   Identify 3 **Seed Keywords** (e.g., "AI Resume Builder").
    *   Identify the **Search Intent** (e.g., "Transactional - Users want to download a PDF").
2.  **Define the Identity**:
    *   Based on `./ads-critique-*.md`, define your "Founder Story".
    *   *Why are you building this? What is the villain (The Mainstream Trap)?*

**Output:** A 1-page "Content Brief" defining the Product Name, Domain, and Core Value Proposition.

---

## Phase 2: The Clean Slate (White Labeling)
**Goal:** Prepare the Instant Ship vessel for your new cargo.

1.  **Global Config (`site.config.ts`)**:
    *   Update `name`, `domain`, and `description`.
    *   **Crucial:** Inject the keywords identified in Phase 1 into the `translations.en.keywords` field.
2.  **Visual Alchemy (`tailwind.config.js`)**:
    *   Upload a mood board image to Google AI Studio.
    *   Prompt: *"Extract the semantic color palette from this image for a Tailwind config."*
    *   Replace `theme.extend.colors.primary` with your new brand color.
3.  **Clean the Routes**:
    *   Remove demo components from `routes/$lang.index.tsx` (Keep `Hero` structure, strip content).
    *   Update `i18n.ts` with your new product copy.

---

## Phase 3: The "Vision" Injection (Google AI Studio)
**Goal:** Generate the UI Shell (The "G" in GLC).

1.  **The Prompt**:
    *   Upload your UI sketch or reference screenshot to **Google AI Studio**.
    *   **System Instruction:** *"You are an expert React 19 Architect. Output a responsive component using Tailwind CSS. Use `bg-primary`, `bg-surface` semantic tokens. Do not use hardcoded hex values."*
2.  **The File Creation**:
    *   Create `routes/$lang.feature-name.tsx`.
    *   Paste the Gemini-generated code.
    *   Wrap it in the Instant Ship Layout structure.

---

## Phase 4: The "Logic" Injection (Lovable)
**Goal:** Breathe life into the shell (The "L" in GLC).

1.  **The Handoff**:
    *   Copy your new `feature-name.tsx` content.
    *   Paste it into **Lovable**.
2.  **Natural Language Backend**:
    *   *Prompt:* "Connect this form to a Supabase table named 'submissions'."
    *   *Prompt:* "Add a Stripe checkout button for a $19 one-time payment."
3.  **The Reverse Sync**:
    *   Lovable will generate the `supabaseClient` hooks and API calls.
    *   **Manual Step:** Copy the *logic hooks* back into your local Instant Ship project (e.g., `hooks/useSupabase.ts`).
    *   *Note:* Ensure you set up the environment variables (`VITE_SUPABASE_URL`, etc.) in `.env` (and `env.md` for safety).

---

## Phase 5: Authority & SEO Injection (SOP Modules B & E)
**Goal:** Ensure the new product is visible to AI and Humans.

1.  **Register the Route**:
    *   Add your new route path to `site.config.ts` -> `routes` array.
    *   This triggers the automatic generation of `sitemap.xml` and `robots.txt`.
2.  **GEO Optimization**:
    *   Run `node scripts/ai-seo-optimizer.mjs`.
    *   This updates `llms.txt` to include your new feature's context for AI crawlers.
3.  **Content Calendar**:
    *   Use `./content-calendar-template.md`.
    *   Plan 3 "Money Pages" (e.g., "Alternative to X") to support the launch.

---

## Phase 6: The "Launch" Ritual (Cloudflare)
**Goal:** Global Distribution (The "C" in GLC).

1.  **Pre-Flight Check**:
    *   Run `npm run check-i18n` (No missing translation keys).
    *   Run `npm run build` (Ensure no type errors).
2.  **Push to Git**:
    *   `git push origin main`.
3.  **Verify**:
    *   Check Cloudflare Pages dashboard for build success.
    *   Verify Analytics (GA4/Clarity) are receiving data.

---

**Summary:**
You have moved from a Keyword (Phase 1) -> to a Visual (Phase 3) -> to a Logic (Phase 4) -> to a Global Asset (Phase 6).
**Slay the delay.**