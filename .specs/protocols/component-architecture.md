
# 🏗️ Protocol: Component Architecture & Atomic Design

**Objective:** To maintain a scalable, maintainable codebase by strictly separating Data Logic (Routes) from UI Rendering (Components).

---

## 1. The Core Philosophy: "Smart Routes, Dumb Components"

### 🚦 Routes (`src/routes/`) are the "Controllers"
*   **Responsibility**:
    *   **Data Fetching**: Calling `useDocsDB`, `useQuery`, or Supabase hooks.
    *   **State Management**: Handling `useState` for page-level interactions.
    *   **SEO**: Defining `<SEO />` tags and metadata.
    *   **Routing**: Reading params (`useParams`) and search query (`useSearch`).
*   **Rule**: Routes should contain minimal JSX markup—mostly just composition of Components.

### 🎨 Components (`src/components/`) are the "Views"
*   **Responsibility**:
    *   **Rendering**: Pure UI based on props.
    *   **Interactivity**: Local UI state (e.g., hover, open/close dropdown).
    *   **Styling**: Encapsulating Tailwind classes.
*   **Rule**: Components should be (mostly) unaware of the global app state or data source. They expect data via props.

---

## 2. Atomic Design Adaptation

We adapt Brad Frost's Atomic Design to our folder structure:

### ⚛️ Atoms (`components/ui/`)
*   **Definition**: The smallest building blocks. Cannot be broken down further.
*   **Examples**: `Button.tsx`, `Input.tsx`, `Avatar.tsx`, `IconWrapper.tsx`.
*   **Dependencies**: Zero. Pure styling.

### 🧬 Molecules (`components/shared/` or `components/[feature]/`)
*   **Definition**: Groups of atoms functioning together.
*   **Examples**: `SearchInput.tsx` (Input + Button), `UserCard.tsx` (Avatar + Text).
*   **Dependencies**: Composed of Atoms.

### 🦠 Organisms (`components/[feature]/`)
*   **Definition**: Complex UI sections that form distinct parts of an interface.
*   **Examples**: `Hero.tsx`, `PricingTable.tsx`, `DocsSidebar.tsx`, `BlogList.tsx`.
*   **Dependencies**: Molecules and Atoms.
*   **Note**: Organisms are specific to a domain (Landing, Blog, Dashboard).

### 📄 Pages (`routes/`)
*   **Definition**: Specific instances of templates.
*   **Examples**: `routes/$lang.index.tsx` (Home), `routes/$lang.blog.$slug.tsx` (Post).
*   **Dependencies**: Organisms.

---

## 3. Directory Structure Standard

```text
src/
├── components/
│   ├── ui/                # [Atoms] Generic UI kit (shadcn-like)
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   ├── shared/            # [Molecules] Reusable across features
│   │   ├── ThemeToggle.tsx
│   │   └── LanguageSwitch.tsx
│   ├── landing/           # [Organisms] Feature: Landing Page
│   │   ├── Hero.tsx
│   │   └── Pricing.tsx
│   └── docs/              # [Organisms] Feature: Documentation
│       └── Sidebar.tsx
└── routes/                # [Pages]
    ├── $lang.index.tsx
    └── $lang.docs.tsx
```

---

## 4. Implementation Rules (The "Litmus Test")

### Rule A: The "Fetch" Test
*   **Question**: "Does this file fetch data from an API or Database?"
*   **If YES**: It belongs in `routes/` or a custom Hook (`hooks/`). It should **NOT** be in `components/`.
*   *Exception*: Global layout components like `Sidebar` fetching navigation structure, if self-contained.

### Rule B: The "Prop" Test
*   **Question**: "Can I reuse this component with different data?"
*   **If NO**: You might have hardcoded logic. Extract it to props.

### Rule C: The "Import" Test
*   **Question**: "Does a Component import a Route file?"
*   **Verdict**: **FORBIDDEN**. Dependency flow is always `Route -> Component`, never `Component -> Route`.

---

## 5. Workflow Example

**Task**: Create a "Team Members" section.

1.  **Draft Atoms**: Do we have `Avatar` and `Text`? Yes.
2.  **Build Molecule**: Create `components/team/MemberCard.tsx`.
    *   Props: `{ name, role, photoUrl }`.
3.  **Build Organism**: Create `components/team/TeamGrid.tsx`.
    *   Props: `{ members: Member[] }`.
    *   Logic: Maps over the array and renders `MemberCard`.
4.  **Assemble Page**: Create `routes/$lang.about.tsx`.
    *   Logic: `const members = useMembersDB();`
    *   Render: `<TeamGrid members={members} />`

---
*Status: Engineering Standard Active.*
