# CSP and Supabase Connection Fixes

## Problem Summary

The application was experiencing two main issues:

1. **Content Security Policy (CSP) blocking Supabase requests**
   - Error: "Refused to connect because it violates the document's Content Security Policy"
   - Supabase API calls to `https://djeeckseyotssuhjaeas.supabase.co` were being blocked

2. **AdSense initialization errors**
   - Error: "Only one 'enable_page_level_ads' allowed per page"
   - Multiple initialization attempts causing conflicts

## Root Causes

### CSP Issue
- The `src/lib/tracking.ts` file was setting a strict CSP policy
- The `connect-src` directive didn't include Supabase domains
- This prevented all network requests to Supabase from working

### AdSense Issue
- Page-level ads were being initialized multiple times
- No mechanism to prevent duplicate initialization
- Caused by hot reloading in development or multiple component mounts

## Fixes Applied

### 1. CSP Configuration Fix (`src/lib/tracking.ts`)

**Before:**
```typescript
meta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com https://www.googletagmanager.com https://pagead2.googlesyndication.com https://www.clarity.ms; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://www.clarity.ms;";
```

**After:**
```typescript
meta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com https://www.googletagmanager.com https://pagead2.googlesyndication.com https://www.clarity.ms; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://www.clarity.ms https://*.supabase.co;";
```

**Changes:**
- Added `https://*.supabase.co` to the `connect-src` directive
- This allows all network requests to any Supabase subdomain

### 2. AdSense Initialization Fix (`src/lib/adsense.ts`)

**Before:**
```typescript
// 初始化页面级广告（如果启用）
if (this.config.pageLevel) {
  (window.adsbygoogle = window.adsbygoogle || []).push({
    google_ad_client: this.config.client,
    enable_page_level_ads: true
  });
}
```

**After:**
```typescript
// 初始化页面级广告（如果启用且未初始化）
if (this.config.pageLevel && !document.querySelector('[data-page-level-ads]')) {
  const pageLevelMarker = document.createElement('div');
  pageLevelMarker.setAttribute('data-page-level-ads', 'true');
  pageLevelMarker.style.display = 'none';
  document.body.appendChild(pageLevelMarker);
  
  (window.adsbygoogle = window.adsbygoogle || []).push({
    google_ad_client: this.config.client,
    enable_page_level_ads: true
  });
}
```

**Changes:**
- Added a DOM marker to track if page-level ads have been initialized
- Only initialize if the marker doesn't exist
- Prevents duplicate initialization errors

## Testing

### Verify CSP Fix
1. Open browser developer tools
2. Navigate to any page that uses Supabase data (e.g., `/devices`, `/manufacturers`)
3. Check Network tab - Supabase requests should now succeed
4. Check Console - No more CSP violation errors

### Verify AdSense Fix
1. Open browser developer tools
2. Navigate between pages or refresh the page
3. Check Console - No more "Only one 'enable_page_level_ads' allowed" errors
4. AdSense should initialize cleanly

## Impact

### Positive Effects
- ✅ Supabase API calls now work correctly
- ✅ Data loading from database is functional
- ✅ AdSense initializes without errors
- ✅ No more CSP violation warnings in console

### Pages Now Working
- `/devices` - Can load device data from Supabase
- `/manufacturers` - Can load manufacturer data from Supabase
- `/devices/ct-scanners` - Category pages work
- `/devices/mri-scanners` - Category pages work
- All pages using `useSupabaseData` hooks

## Security Considerations

### CSP Changes
- Added `https://*.supabase.co` to allowed connections
- This is safe as it only allows connections to Supabase domains
- Maintains security while enabling required functionality

### Alternative Approaches
If more restrictive CSP is needed:
1. Use specific Supabase project URL instead of wildcard
2. Implement server-side proxy for Supabase requests
3. Use environment-specific CSP configurations

## Future Improvements

1. **Environment-specific CSP**: Different CSP rules for development vs production
2. **CSP Reporting**: Add CSP reporting to monitor violations
3. **AdSense Error Handling**: Better error handling for AdSense initialization failures
4. **CSP Nonce**: Implement nonce-based CSP for better security

## Related Files

- `src/lib/tracking.ts` - CSP configuration
- `src/lib/adsense.ts` - AdSense initialization
- `src/lib/supabase.ts` - Supabase client configuration
- `src/hooks/useSupabaseData.ts` - Data fetching hooks