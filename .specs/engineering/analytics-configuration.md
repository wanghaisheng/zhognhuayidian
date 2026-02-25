# 📊 Engineering Spec: Analytics & Telemetry Configuration

**Objective:** Enable zero-latency tracking for Google Analytics 4 (GA4) and Microsoft Clarity without blocking the main thread or causing hydration errors.

## 1. Configuration Strategy (The Source of Truth)
Analytics IDs are managed via `site.config.ts`, which acts as the bridge between Environment Variables and the Runtime.

### Environment Variables
For security and separation of concerns (Dev vs Prod), we rely on Vite-injected variables:
*   `VITE_GA_ID`: Google Analytics Measurement ID (Format: `G-XXXXXXXXXX`).
*   `VITE_CLARITY_ID`: Microsoft Clarity Project ID (Format: `10-char string`).
*   `VITE_ADSENSE_ID`: Google AdSense Publisher ID (Optional).

### Site Config Map
```typescript
// site.config.ts
export const siteConfig = {
  analytics: {
    googleAnalyticsId: import.meta.env.VITE_GA_ID || "", 
    microsoftClarityId: import.meta.env.VITE_CLARITY_ID || "",
  }
};
```

## 2. The Silent Guard Component (`Analytics.tsx`)
We utilize a dedicated `Analytics` component (`components/Analytics.tsx`) that mounts once at the root level.

### Key Engineering Features:
1.  **Hydration Safe**: Uses `useEffect` to ensure scripts only inject on the client-side, preventing SSR mismatch.
2.  **Silent Guard**: The global `window.addEventListener('error')` in `index.html` prevents the app from crashing if AdBlockers intercept the tracking scripts.
3.  **Deduplication**: Checks for existing script tags (`id="ga-script"`) to prevent double-counting events during hot-reloads (HMR).

## 3. Verification Protocol
To verify installation:
1.  **Build**: Run `npm run build`.
2.  **Inspect**: Check the `<head>` of the generated HTML.
3.  **Network**: Look for requests to `google-analytics.com` (collect) and `clarity.ms` (collect).
