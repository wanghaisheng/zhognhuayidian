# 🧩 Engineering Spec: Routing Mechanics & Discovery

**Philosophy:** "The ID is the Truth, the Path is a Pointer."

## 1. The Sandbox URL Paradox
**Problem:** In AI Studio previews and Blob environments, URLs are rewritten (e.g., `blob:https://...` or `.../index.html`).
**Consequence:** Standard Regex path matching fails. `useParams()` often returns `undefined` or `*`.

## 2. The Solution: DB-Backed Routing Authority (DB-BRA)
We decouple content identity from the URL string using a **Dual-Path Resolution Strategy**.

### Path A: The Fast Track (State Hydration)
*   **Trigger**: Internal navigation (clicking `<Link>`).
*   **Mechanism**: The `<Link>` component **MUST** pass the `prid` (Permanent Resource ID) in the `state` object.
    ```tsx
    <Link to={`/${lang}/docs/${slug}`} state={{ prid: "1001" }}>
    ```
*   **Resolution**: The destination page checks `location.state.prid` first.
*   **Performance**: O(1) Lookup. Instant rendering. Immune to URL mangling.

### Path B: The Rescue Track (Greedy Dictionary Match)
*   **Trigger**: Page refresh or direct external entry.
*   **Mechanism**: When `state` is empty, the Loader scans the `window.location.href` string against the **Registry Dictionary**.
*   **Algorithm**:
    1.  Get all known slugs from the Registry.
    2.  Sort by length (Descending) to prevent partial matching (e.g., matching `core` instead of `core/plan`).
    3.  Find the first slug that exists in the current URL string.
*   **Performance**: O(n) scan. Robust fallback for any proxy environment.

## 3. Route Naming Convention
*   **Docs**: Use `[...slug]` (Splat) to capture nested paths (e.g., `core/architecture/v1`).
*   **Blog**: Use `$slug` (Variable) for flat structures.
*   **Root**: Always prefix with `$lang` to enforce internationalization context.

## 4. Component Hierarchy (The "Shadow" Fix)
To prevent parent layouts from blocking child renders:
*   **Rule**: Parent Routes (e.g., `routes/blog.tsx`) must **ONLY** contain `<Outlet />` or shared layout shells.
*   **Rule**: List Views must live in `routes/blog.index.tsx`, not the parent.
*   **Reason**: This ensures the List component physically unmounts when the Detail component (`routes/blog.$slug.tsx`) mounts.
