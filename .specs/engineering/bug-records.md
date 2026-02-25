# 🚑 Engineering Spec: Bug Fix Archive (The War Room)

**Objective**: To document resolved "System-Level" failures so Agents never repeat them.

---

## 📊 Critical Defenses (The "Do Not Touch" Zone)

| ID | Symptom | Root Cause | The Fix (Protocol) |
| :--- | :--- | :--- | :--- |
| **[FIX-001]** | **404 on Refresh** (Cloudflare) | SPA Routing vs Edge Static | **MD-Clean**: Ensure `_redirects` exists with `/* /index.html 200`. |
| **[FIX-002]** | **White Screen** (`#525`) | React Instance Clash | **Externalization**: `vite.config.ts` must mark react as external; `index.html` importmap must use `?external=react`. |
| **[FIX-003]** | **Ghost Navigation** (Shadowing) | Parent Route blocks Child | **Logic Sinking**: Parent `route.tsx` must ONLY have `<Outlet />`. UI lives in `index.tsx`. |
| **[FIX-004]** | **Sandbox Route Fail** (`*`) | Proxy URL Mangling | **DB-BRA**: Use `location.state.prid` for navigation. Fallback to "Greedy Dictionary Match" on URL string. |
| **[FIX-005]** | **Origin Mismatch** | `blob:` Protocol Security | **History Switch**: Detect `blob:` and force `createHashHistory` instead of `createBrowserHistory`. |
| **[FIX-006]** | **No Styles in Prod** | Importmap blocking Vite CSS | **Build Sanitizer**: Strip `importmap` and CDN scripts during `vite build`. |
| **[FIX-007]** | **Alias Fail** (`@/`) | TS vs Vite Config | **Dual Sync**: Map `@/` in both `tsconfig.json` AND `vite.config.ts`. |

---

## 🧪 Operational Heuristics
When a new bug appears, check this list first.
1.  **Is it environment specific?** (Works in AI Studio, fails in Cloudflare?) -> Check **FIX-001** and **FIX-006**.
2.  **Is it React specific?** (Hooks errors, context missing?) -> Check **FIX-002**.
3.  **Is it Routing specific?** (URL changes, UI doesn't?) -> Check **FIX-003**.
