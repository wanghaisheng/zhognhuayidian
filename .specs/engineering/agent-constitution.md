
# ⚖️ Engineering Spec: The Agent Constitution


**Role:** You are the **Chief Product Architect** of the Instant Ship™ Engine.
**Objective:** To modify, extend, and deploy this application while strictly adhering to its environmental constraints (Browser Sandbox + Edge Runtime).

---

## 1. The Prime Directive: "Sandbox Compatibility"
**Context:** This app often runs in environments (AI Studio, StackBlitz) where the file system is inaccessible to the runtime.

*   **❌ FORBIDDEN:** Do NOT use `fs.readFileSync`, `path.join`, or `process.cwd()` in any React Component, Hook, or Utility used by the frontend.
*   **✅ REQUIRED:** Store all static content (Docs, Blogs) in `src/data/registry-*.ts` files.
*   **mechanism:** The app hydrates an in-memory SQLite database (`sql.js`) from these static registries on boot.

---

## 2. The Navigation Protocol (ID-First)
**Context:** URLs are unstable pointers (due to i18n prefixes `/en/` or proxy mangling). IDs are absolute truth.

*   **Rule:** When creating links, **ALWAYS** pass the `prid` (Permanent Resource ID) in the state.
    ```tsx
    // ✅ Correct Pattern
    <Link 
      to={`/${lang}/docs/${slug}`} 
      state={{ prid: "1001" } as any}
    >
      Link Text
    </Link>
    ```
*   **Rule:** When resolving data in a component, check state first.
    ```tsx
    const { state } = useLocation();
    const { getDetailById } = useDocsDB();
    // Fast Track
    if (state?.prid) return getDetailById(state.prid, lang);
    ```

---

## 3. The "New Feature" Workflow (Strict Typing)
When the user asks for a new page (e.g., "Dashboard"), follow this strict sequence:

1.  **Route Creation:**
    *   Create `routes/$lang.dashboard.tsx`.
    *   Use `createFileRoute('/$lang/dashboard')`.
    *   **Type Safety:** Define `validateSearch` if URL params are needed (e.g., `?tab=settings`).
2.  **SEO Registration:**
    *   Open `site.config.ts`.
    *   Add `{ path: "/dashboard", titleKey: "dashboard.title", descriptionKey: "dashboard.desc" }` to the `routes` array.
3.  **i18n Definition (See Protocol #7):**
    *   Open `locales/en/nav.ts` (or create a new feature file).
    *   Add the translation keys.
4.  **Navigation (Optional):**
    *   Update `routes/__root.tsx` to add the link to the Header or Footer.

---

## 4. The MD-Clean Protocol (Infrastructure)
**Context:** Config files like `.env`, `_headers`, and `_redirects` are often hidden or blocked by sandboxes.

*   **Source of Truth:** We use Markdown files in `public/` as the source.
    *   `public/headers.md` -> Becomes `_headers`
    *   `public/redirects.md` -> Becomes `_redirects`
    *   `public/env.md` -> Becomes `.env`
*   **Action:** If you need to change caching rules or redirects, edit the **Markdown (.md)** versions. The CI pipeline handles the conversion.

---

## 5. Visual Alchemy (Styling)
**Context:** We use a semantic token system to allow "Theme Hot-Swapping".

*   **❌ AVOID:** Hardcoded hex values (e.g., `#1e293b`).
*   **✅ USE:** Semantic Tailwind classes.
    *   `bg-background` (Page root)
    *   `bg-surface` (Cards/Panels)
    *   `border-border` (Dividers)
    *   `text-muted-foreground` (Secondary text)
    *   `text-primary` (Brand color)

---

## 6. Data Management (Registry vs. Database)
*   **Static Data (Docs/Blog):** 
    *   Edit `src/data/registry-*.ts`.
    *   The `useDocsDB` hook will automatically ingest these changes into the SQLite engine.
*   **Dynamic Data (User App):**
    *   Use **Lovable** to bridge to Supabase.
    *   Do not try to mock a backend in Next.js API routes (we are client-side Vite).

---

## 7. Internationalization (i18n) Protocol
**Context:** Global-first architecture. Hardcoded strings are forbidden.

*   **Structure:**
    *   `locales/en/[namespace].ts` (English Source)
    *   `locales/zh/[namespace].ts` (Chinese Mirror)
    *   `i18n.ts` (Registry - import and merge namespaces here)
*   **Implementation Rule:**
    1.  **Extract**: Never write `<p>Hello</p>` directly in JSX.
    2.  **Define**: Add `"hello": "Hello"` to `locales/en/common.ts` (or a feature-specific file).
    3.  **Use**:
        ```tsx
        import { useTranslation } from 'react-i18next';
        // ...
        const { t } = useTranslation();
        return <p>{t('common.hello')}</p>;
        ```
*   **Routing**: The current language is always available via `useParams({ from: '/$lang' })`.

---

## 8. Component & Page Architecture (Atomic Standard)
**Context:** We follow a strict "Smart Routes, Dumb Components" philosophy based on Atomic Design.

*   **Reference**: You MUST read and follow `specs/protocols/component-architecture.md`.
*   **Pages (`routes/`)**: The **Controllers**.
    *   **Responsibility**: Fetching data (`useDocsDB`), handling `useState`, defining `SEO`, and passing props.
    *   **Constraint**: No complex UI markup. Compose Organisms here.
*   **Components (`components/`)**: The **Views**.
    *   **Atoms (`ui/`)**: Base elements (Buttons, Inputs). No business logic.
    *   **Molecules/Organisms (`[feature]/`)**: Compositions.
    *   **Constraint**: NEVER fetch data directly (except for specific self-contained widgets).
    *   **Constraint**: NEVER import `routes/*`.

---

## 9. SOP Integration: From Requirement to Code
**Context:** Use the `docs/templates-sop/` knowledge base to guide your reasoning **before** writing code.

*   **Step 1: Analysis (The Brain)**
    *   *Trigger*: User asks for a complex feature (e.g., "Add a user dashboard").
    *   *Action*: Consult `docs/templates-sop/prd-to-user-story-map-sop.md`.
    *   *Output*: Breakdown the request into Actors, Goals, and specific User Stories before coding.
*   **Step 2: SEO Strategy (The Voice)**
    *   *Trigger*: Creating a new public page (Landing Page, Blog).
    *   *Action*: Consult `docs/templates-sop/keyword-research-protocol.md`.
    *   *Output*: Define 3 target keywords to inject into `site.config.ts`.
*   **Step 3: Implementation (The Hands)**
    *   Follow **Protocol #3 (New Feature Workflow)** and **#7 (i18n)** to write the code.
*   **Step 4: Quality Gate (The Shield)**
    *   *Action*: Run `npm run check-i18n` to ensure no translation keys are missing.

---

## 10. The "Lovable Handoff" Standard
**Context:** You are generating the *Frontend Shell*. The *Backend Logic* will be injected by Lovable.

*   **❌ DO NOT:**
    *   Write `fetch('/api/mock-user')` (We don't have a Node server).
    *   Hardcode `SupabaseClient` initialization with fake keys.
    *   Create complex mock data files that simulate a database.
*   **✅ DO:**
    *   Create clean, typed Interfaces for your data (e.g., `interface User { ... }`).
    *   Create **Service Hooks** (e.g., `hooks/useUser.ts`) that currently return `null` or a static placeholder, but are documented as "Ready for Lovable Injection".
    *   **Instruction to User:** "I have created the UI. Now paste `routes/dashboard.tsx` into Lovable and ask it to: 'Connect this to a real Supabase table'."

---

## 11. Agent Self-Healing Matrix (Troubleshooting)
**Context:** If you encounter errors during generation or execution, apply these fixes immediately.

| Symptom | Diagnosis | Fix Action |
| :--- | :--- | :--- |
| `Minified React error #525` | Multiple React Instances | Ensure `importmap` has `?external=react,react-dom` on ALL libraries. |
| `fs.readFileSync is not a function` | Node.js Module in Browser | Move data from `.md` files to `src/data/registry-*.ts`. |
| `useNavigate() may be used only...` | Router Context Missing | Ensure component is rendered inside `<RouterProvider>` or use `<Link>` correctly. |
| `Hydration failed` | SSR/CSR Mismatch | Wrap root render in `startTransition`. Ensure no random numbers (Math.random) in initial render. |
| `404 on Refresh` | SPA Routing | Create `public/redirects.md` with `/* /index.html 200`. |

---

**Summary:**
You are building on a **Hybrid Architecture**. Respect the Registry, Trust the ID, Clean the Config, and Localize Everything.
