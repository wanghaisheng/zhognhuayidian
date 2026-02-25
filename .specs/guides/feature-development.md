
# 🚀 Guide: Feature Development Protocol

**Objective**: To add a new feature (e.g., "Dashboard") to Instant Ship™ from data definition to business logic, adhering strictly to the architectural protocols.

---

## Phase 1: Definition (Schema First)
**Before coding the UI, define the data.** This prevents "Hallucinated Props" and ensures a clean handoff to the backend.

1.  **Create Type**: `src/types/dashboard.ts`
2.  **Create Mock**: `src/mocks/dashboard-stats.json`
3.  **Create Hook**: `hooks/useDashboardStats.ts` (Return the JSON with a simulated delay).

---

## Phase 2: Implementation (The Build)
**Protocol**: Adhere strictly to `specs/protocols/component-architecture.md`.

### Step A: Create the Route (The Controller)
Create the page shell. This file fetches data and orchestrates UI, but should contain minimal JSX itself.

*   **File**: `routes/$lang.dashboard.tsx`
*   **Code**:
    ```tsx
    import { createFileRoute } from '@tanstack/react-router';
    import { useDashboardStats } from '../../hooks/useDashboardStats';
    import { useTranslation } from 'react-i18next';
    import { StatsGrid } from '../../components/dashboard/StatsGrid'; // The Organism
    import { StatCardSkeleton } from '../../components/dashboard/StatCardSkeleton';

    export const Route = createFileRoute('/$lang/dashboard')({
      component: DashboardPage,
    });

    function DashboardPage() {
      const { t } = useTranslation();
      const { data, loading } = useDashboardStats(); 
      
      return (
        <div className="animate-fade-in space-y-8">
           <h1 className="text-4xl font-black">{t('dashboard.title')}</h1>
           {loading ? <StatsGrid.Skeleton /> : <StatsGrid stats={data} />}
        </div>
      );
    }
    ```

### Step B: Develop Components (The Views)
Build the UI from smallest to largest pieces (Atoms -> Molecules -> Organisms).

1.  **Atom (`components/ui/Card.tsx`)**: If needed, create a generic, reusable `Card` component.
2.  **Molecule (`components/dashboard/StatCard.tsx`)**: Create the specific card for displaying a single statistic. It only knows how to render props.
    ```tsx
    interface StatCardProps {
      label: string;
      value: string;
      icon: React.ReactNode;
    }
    // ... component implementation
    ```
3.  **Organism (`components/dashboard/StatsGrid.tsx`)**: Create the component that arranges multiple `StatCard` components.
    ```tsx
    interface StatsGridProps {
      stats: DashboardStats[];
    }
    // ... component maps over stats and renders a StatCard for each
    ```

---

## Phase 3: Registration (The Authority)
**Make the page visible to the Engine.**

1.  **SEO Config**: Open `site.config.ts`.
    *   Add: `{ path: "/dashboard", titleKey: "dashboard.title", descriptionKey: "dashboard.desc" }`
2.  **i18n Registry**: Open `locales/en/dashboard.ts` (Create it).
    *   Define: `{ "title": "My Dashboard", "desc": "..." }`
    *   **Register**: Import it in `i18n.ts` and add to `resources`.

---

## Phase 4: Verification (The Quality Gate)

1.  **Check i18n**: Run `npm run check-i18n`.
2.  **Check Build**: Run `npm run build`.
3.  **Check SEO**: Verify `dist/sitemap.xml` contains `/en/dashboard`.

---

## Phase 5: Production Handoff (The "L" Injection)
**Ready for Logic?** Once the UI is perfect using the Mock Hook:
1.  Paste the `types` and `hook` into **Lovable**.
2.  Prompt: *"Replace the JSON import in this hook with a real Supabase query matching this interface. Connect the 'Save' button to a Supabase RPC call."*
3.  Copy the generated logic back into your project.
