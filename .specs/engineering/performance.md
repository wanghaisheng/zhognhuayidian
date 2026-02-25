
# ⚡ Engineering Spec: Antigravity Performance

**Goal:** Sub-second LCP (Largest Contentful Paint) and 100/100 Lighthouse Score.

## 1. Critical Rendering Path
*   **Font Preloading**: Essential fonts (Inter) must use `<link rel="preload">` in `index.html`.
*   **Zero-JS Shell**: The basic CSS and HTML structure must render meaningful paint before the React bundle hydrates.

## 2. Perceived Performance Protocol (The "Instant" Feel)
**Objective:** The interface must respond immediately, even if data is pending.

### A. Immediate Structure Display (Shell First)
*   **Rule**: The page layout (Header, Sidebar, Main Container) must render **synchronously**.
*   **Anti-Pattern**: Do not wrap the entire page in a loading spinner. The user should see the "Room" before the "Furniture".

### B. Skeleton Screens (Skeleton UI)
*   **Requirement**: Use `shimmer-bg` skeletons for all dynamic content areas.
*   **Behavior**: Skeletons must match the dimensions of the final content to prevent CLS (Layout Shift) when data arrives.

### C. Decoupled Rendering (Render-while-Fetching)
*   **Architecture**: UI rendering and Data fetching must be parallel, not blocking.
*   **Implementation**: 
    *   Components mount immediately in a "Loading State".
    *   Data hooks (`useQuery`, `useDocsDB`) initiate fetches in the background.
    *   UI updates reactively when data settles.

## 3. Image Strategy (LazyImage)
*   **Component**: Use `<LazyImage />` for all non-hero images.
*   **CLS Prevention**: All images must have an explicit `aspect-ratio` or container dimensions to reserve space before loading.
*   **Format**: Prefer WebP/AVIF.

## 4. Caching Strategy (The 3 Layers)
**Objective:** Maximize cache hit ratios to reduce TTFB (Time to First Byte).

### A. CDN Cache (Edge Force-Static)
*   **Rule**: Treat all non-user-specific routes as **Static Assets**.
*   **Implementation**: 
    *   Assets (`js`, `css`, `images`): Cache heavily (`max-age=31536000`).
    *   HTML (`index.html`): Cache with revalidation (`s-maxage=0, must-revalidate` or specific TTL) to ensure instant updates while leveraging Edge delivery.
*   **Goal**: Offload 99% of traffic to Cloudflare Edge.

### B. File Cache (Versioning)
*   **Mechanism**: Vite build output uses content-hashing (e.g., `index.a1b2c.js`).
*   **Header**: `Cache-Control: public, max-age=31536000, immutable`.
*   **Result**: Browser never re-downloads unchanged code.

### C. Data Cache (Client-Side)
*   **Static Data**: `useDocsDB` hydrates from the Registry into in-memory SQLite. This bypasses network requests for content navigation.
*   **User Data**: `Dexie` (IndexedDB) persists user preferences (Theme, Language) locally, avoiding round-trips for configuration.

## 5. Telemetry
*   **Monitoring**: Use Microsoft Clarity to detect "Rage Clicks" and layout shifts in the wild.
*   **Silent Guard**: Tracking scripts must be wrapped in error boundaries to prevent ad-blockers from crashing the app.
