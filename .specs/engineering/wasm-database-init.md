# 🗄️ Engineering Spec: WASM Database Initialization

**Objective:** Initialize `sql.js` (SQLite) in a browser-only environment (Sandbox/Edge) where native bindings are unavailable.

## 1. CDN Authority Strategy
We bypass `node_modules` resolution issues in sandboxes by loading the WASM binary from a trusted CDN.

*   **Library**: `sql.js` (v1.13.0)
*   **CDN Root**: `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/`

## 2. The Initialization Ritual (`useDocsDB.ts`)
The initialization process must strictly follow this sequence to avoid "fs module not found" errors.

### Step 1: Environment Polyfill
The `process` object must be temporarily hidden to force `sql.js` into "Browser Mode".
```typescript
const originalProcess = window.process;
window.process = undefined; // Force browser environment detection
```

### Step 2: Binary Location
We must provide a custom `locateFile` function to point the WASM loader to the CDN.
```typescript
const SQL = await initSqlJs({
  locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/${file}`
});
```

### Step 3: Environment Restoration
```typescript
window.process = originalProcess; // Restore for other libs (like React Query devtools)
```

## 3. Schema & Hydration
Upon initialization, the database is strictly **In-Memory**.
1.  **Schema**: Tables (`resources`, `routes`) are created via `db.run()`.
2.  **Hydration**: Data is batch-inserted from the static registry (`src/data/docs-registry.ts`).
3.  **Persistence**: Data is **read-only** and ephemeral. Updates require code changes (HMR).
