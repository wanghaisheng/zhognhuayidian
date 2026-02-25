
# 🗄️ Engineering Spec: Data Persistence & Hybrid Storage

**Constraint:** The browser sandbox (AI Studio) has no file system access (`fs` is forbidden).
**Strategy:** We implement a **Registry-First** architecture that graduates to SQL.

## 1. The 3-Tier Data Authority
Data maturity moves through three distinct phases:

### Tier 1: The Staging Registry (`src/data/registry-*.ts`)
*   **Role**: Source of Truth in Development/Sandbox.
*   **Format**: TypeScript Array exporting `RegistryItem[]`.
*   **Why**: Can be imported directly by Vite/Browser without Node.js APIs.
*   **AI Rule**: When the user says "Add a blog post", you modify `src/data/registry-blog.ts`.

### Tier 2: The In-Memory Logic Engine (SQLite WASM)
*   **Role**: Runtime Query Engine (Filtering, Search, Sorting).
*   **Mechanism**: On boot, `useDocsDB` reads Tier 1 and performs batch `INSERT` into an in-memory `sql.js` database.
*   **Schema**:
    ```sql
    CREATE TABLE resources (
      id TEXT PRIMARY KEY,
      lang TEXT,
      title TEXT,
      content TEXT, -- Full Markdown
      category TEXT,
      type TEXT     -- 'doc' | 'blog'
    );
    ```

### Tier 3: The Production Authority (Supabase)
*   **Role**: Persistent Cloud Storage (for real SaaS data).
*   **Trigger**: When the user connects Lovable.
*   **Migration**: The `id` from the Registry becomes the Primary Key in Postgres.

## 2. Critical Data Preloading (Boot Strategy)
To achieve the "Instant Open" effect:
*   **Registry Hydration**: The static content registry is bundled with the JS. It is **immediately available** upon app load. There is no "fetching" phase for Docs/Blog content.
*   **Config Preload**: User preferences (Theme, Language) are read from `localStorage`/`Dexie` synchronously during the initial render pass to prevent hydration mismatch or flickering.

## 3. Real-Time Synchronization (Live Data)
For Tier 3 (SaaS Data), we require the interface to react instantly to backend changes.
*   **Protocol**: Use **Supabase Realtime** (WebSockets).
*   **Requirement**: Any component displaying mutable shared data (e.g., Dashboard, Comments) MUST subscribe to `INSERT/UPDATE/DELETE` events on the relevant table.
*   **UX**: The UI must update automatically without requiring a page refresh.

## 4. CRUD Operations in Sandbox
Since we cannot write to disk:
*   **Create/Update**: Edit the `.ts` file source code. HMR (Hot Module Replacement) updates the app.
*   **Read**: Always use `useDocsDB().getDetailById(id)`.

## 5. Full-Text Search (FTS)
We use SQLite's `FTS5` virtual table module.
*   **Query**: `SELECT * FROM documents_fts WHERE documents_fts MATCH 'keyword'`.
*   **Benefit**: Provides production-grade search experience (ranking, highlighting) entirely in the browser.
