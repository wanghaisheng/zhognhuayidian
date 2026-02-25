
# 🏗️ Engineering Spec: Core Architecture

## 1. The Tri-Pillar Ecosystem (GLC Protocol)
We utilize a zero-capex arbitrage stack:
1.  **Google AI Studio (Visual Brain)**: Generates UI/UX.
2.  **Lovable (Logic Spine)**: Injects Supabase/Stripe logic.
3.  **Cloudflare (Global Body)**: Deploys to edge.

## 2. DB-Backed Routing Authority (DB-BRA)
**Philosophy:** "The ID is the Truth, the Path is a Pointer."

### The Problem
In Proxy environments (AI Studio), URLs are mangled (`blob:...`, `.../index.html`). RegEx routing fails.

### The Solution
1.  **Registry**: TypeScript arrays (`src/data/registry-*.ts`) act as the Source of Truth.
2.  **Ingestion**: On boot, `useDocsDB` loads Registry into in-memory SQLite.
3.  **Discovery**:
    *   **Fast Track**: `location.state.prid` -> O(1) ID Lookup.
    *   **Rescue Track**: Greedy Dictionary Matching against `window.location.href` to find the longest matching slug.

## 3. Hybrid Data Strategy (Tri-Layer)
We employ a **Tri-Layer Data Architecture** to balance performance, persistence, and scale:

### Layer 1: Compute & Search (Ephemeral)
*   **Tech**: `sql.js` (WASM SQLite).
*   **Role**: Full-text search (FTS5), complex joins, and read-heavy operations on static content (Docs/Blog).
*   **Source**: Hydrated from `registry-*.ts` on boot. Re-created on every refresh.

### Layer 2: Local Persistence (Long-Term)
*   **Tech**: `dexie` (IndexedDB Wrapper).
*   **Role**: User preferences (Theme), Analytics buffering, and offline state.
*   **Trait**: **Persistent**. Survives browser refreshes and restarts. 
*   *See [Dual-DB Strategy](./discussion-dexie-vs-sqljs.md) for detailed reasoning.*

### Layer 3: Cloud Authority (Sync)
*   **Tech**: `Supabase` (PostgreSQL).
*   **Role**: Multi-user data, Authentication, and Payments (managed via Lovable).
*   **Trigger**: Injected when the user graduates from "Sandbox" to "SaaS".
