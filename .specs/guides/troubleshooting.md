# 🛠️ Engineering Guide: Troubleshooting & Debugging

This guide covers the most frequent technical hurdles encountered when developing with the **Instant Ship™** scaffold.

## 0. 🚑 Operational Protocol: Leveraging the Bug Matrix
**Goal:** Locate and fix issues using our "Captured Ghost" archives before debugging from scratch.

We maintain a strict log of resolved technical debts in **`specs/engineering/bug-records.md`** (if available) or check the common patterns below.

## 1. The "White Screen of Death" (React Error #525)
**Symptoms**: The console shows `Error #525` or mentions a `Suspense` mismatch.
**Cause**: This is almost always caused by "Multiple React Instance Clash." If a library (like TanStack or i18next) pulls in its own version of React instead of using the host instance, the React Dispatcher breaks.
**Fix**: 
1. Check `index.html` importmap. Ensure every library has `?external=react,react-dom` appended.
2. Verify all React-related imports use the exact same version (e.g., `19.2.3`).

## 2. "process is not defined"
**Symptoms**: App crashes immediately with a ReferenceError.
**Cause**: Modern libraries often check `process.env.NODE_ENV` which doesn't exist in the browser.
**Fix**: Ensure the process shim is present in the `<head>` of your `index.html`:
```html
<script>window.process = { env: { NODE_ENV: 'development' } };</script>
```

## 3. 404 on Page Refresh (Cloudflare)
**Symptoms**: Navigating works fine, but refreshing a URL like `/blog` returns a Cloudflare 404.
**Cause**: Single Page Apps (SPA) need the server to redirect all paths to `index.html`.
**Fix**: Ensure `public/_redirects` contains `/* /index.html 200`.

## 4. Routing Fails in AI Studio / Sandbox
**Symptoms**: Clicking a link does nothing or throws an Origin/Security error.
**Cause**: Security policies on `blob:` or `usercontent.goog` domains block `pushState`.
**Fix**: The scaffold automatically switches to `HashHistory` in these environments. If you are forcing a history type, check `isSandbox` logic in `index.tsx`.
