
# 🏗️ Engineering Standards (Protocol v1.0)

## 1. Environment Compatibility (The "Sandbox Rule")
*   **Constraint**: This app runs in browser sandboxes (AI Studio) and Edge runtimes.
*   **Rule**: NEVER use `fs`, `path`, or Node.js built-ins in `src/`.
*   **Rule**: `import` paths must use explicit relative paths or the configured `@/` alias.

## 2. React 19 & Architecture
*   **Version**: React 19.2.3.
*   **Rendering**: Root render MUST be wrapped in `startTransition`.
*   **Component Structure**:
    *   **Pages (`routes/`)**: Handle Data Fetching, SEO Metadata, and Layout.
    *   **Components (`components/`)**: Pure UI. Receive data via Props.
*   **Routing**: TanStack Router.
    *   Use `createFileRoute`.
    *   Use `validateSearch` for query params.
    *   **Links**: Always pass `state={{ prid: ... }}` if the target is a database resource.

## 3. Styling (Visual Alchemy)
*   **System**: Tailwind CSS.
*   **Constraint**: NO hardcoded Hex codes (e.g., `#fff`).
*   **Tokens**: Use Semantic Tokens only.
    *   `bg-background` / `text-foreground` (Base)
    *   `bg-surface` / `border-border` (Containers)
    *   `text-primary` / `bg-primary` (Action/Brand)
    *   `text-muted` / `text-muted-foreground` (Secondary)

## 4. Internationalization (i18n)
*   **Rule**: No hardcoded text in JSX.
*   **Flow**:
    1.  Add key to `locales/en/[feature].ts`.
    2.  Add key to `locales/zh/[feature].ts`.
    3.  Use `const { t } = useTranslation('[feature]')`.

## 5. Component Architecture (Atomic Design)
*   **Mandate**: All UI development MUST follow the Atomic Design principles defined in `specs/protocols/component-architecture.md`.
*   **Structure**:
    *   `components/ui` (Atoms)
    *   `components/shared` (Molecules)
    *   `components/[feature]` (Organisms)
    *   `routes/` (Pages/Controllers)
*   **Rule**: Do not invent new folder structures. Stick to this hierarchy.
*   **Rule**: "Smart Routes, Dumb Components". Routes handle logic; Components handle rendering.
