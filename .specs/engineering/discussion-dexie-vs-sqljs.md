
# 🏛️ Architecture Decision: Dual-Database Strategy (Dexie vs. SQL.js)

**Context:** The dependency tree contains both `dexie` and `sql.js`.
**Question:** Is this redundant? Why do we need two frontend database technologies?

## 1. The Verdict
**No, they are not redundant.** They serve two fundamentally different architectural roles within the Instant Ship™ engine.

*   **Dexie.js** = **Persistence Layer** (The Hard Drive)
*   **SQL.js** = **Compute & Query Layer** (The RAM / CPU)

## 2. Dexie.js (IndexedDB Wrapper)
*   **Role**: **Long-Term Storage**.
*   **Mechanism**: Wraps the browser's native IndexedDB. Data is stored on the user's physical disk.
*   **Lifecycle**: **Persistent**. Data survives page reloads, browser restarts, and computer reboots.
*   **Critical Use Cases**:
    *   **User Preferences**: Storing Theme (Dark/Light), Language preference.
    *   **Analytics Logs**: Caching telemetry events (`db.logs`) when offline before syncing to the cloud.
    *   **Auth State**: Persisting session tokens (if not using cookies).
*   **Why not SQL.js here?**: SQL.js (WASM) does not natively persist to disk in a standard browser environment without complex filesystem handles (OPFS), which are still experimental/complex for simple key-value storage.

## 3. SQL.js (SQLite WASM)
*   **Role**: **High-Performance Search Engine**.
*   **Mechanism**: Runs a complete SQLite engine in the browser's **Memory (RAM)**.
*   **Lifecycle**: **Ephemeral**. The database is re-created (hydrated) from the Static Registry (`src/data/registry-*.ts`) every time the app boots.
*   **Critical Use Cases**:
    *   **Full-Text Search (FTS5)**: Implementing "Algolia-like" search for Docs and Blogs (`SELECT * FROM docs_fts WHERE content MATCH 'react'`).
    *   **Complex Relations**: Performing `JOIN` operations between `Routes` and `Resources` tables.
*   **Why not Dexie here?**: IndexedDB is a NoSQL store. It is terrible at full-text search (fuzzy matching) and complex relational queries. Implementing a search engine on top of Dexie is slow and heavy compared to SQLite's native FTS5 module.

## 4. Summary Matrix

| Feature | Dexie (IndexedDB) | SQL.js (SQLite) |
| :--- | :--- | :--- |
| **Storage Location** | Disk (Persistent) | RAM (Ephemeral) |
| **Query Power** | Low (Key-Value / Simple Index) | High (Full SQL / FTS5 / Joins) |
| **Data Source** | User Generated | Static Registry / Build Artifacts |
| **If Removed...** | User loses settings on refresh. | Search bar breaks; 404s on refresh. |

---
*Status: Architecture Active. Both libraries are mandatory.*
