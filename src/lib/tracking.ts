// HTTPS Redirect and Security Headers
import { SITE_CONFIG } from '@/config/site';

const shouldApplyProductionPolicies = (): boolean => {
  try {
    const expectedHostname = new URL(SITE_CONFIG.url).hostname;
    const currentHostname = window.location.hostname;
    return currentHostname === expectedHostname || currentHostname === `www.${expectedHostname}`;
  } catch {
    return false;
  }
};

export const enforceHTTPS = () => {
  if (typeof window !== 'undefined') {
    // Force HTTPS in production
    if (shouldApplyProductionPolicies() && window.location.protocol === 'http:') {
      window.location.replace(window.location.href.replace('http:', 'https:'));
      return;
    }

    // 在开发环境中跳过CSP设置，避免阻止Supabase连接
    if (import.meta.env.DEV) {
      console.log('Skipping CSP in development mode to allow Supabase connections');
      return;
    }

    // Set security headers (for client-side tracking) - 仅在生产环境
    if (!shouldApplyProductionPolicies()) {
      return;
    }

    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    let supabaseOrigin = '';
    try {
      if (supabaseUrl) {
        supabaseOrigin = new URL(supabaseUrl).origin;
      }
    } catch {
      // Ignore invalid URL
    }
    meta.content =
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com https://www.googletagmanager.com https://pagead2.googlesyndication.com https://www.clarity.ms; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "img-src 'self' data: https:; " +
      "connect-src 'self' https://www.google-analytics.com https://www.clarity.ms" + (supabaseOrigin ? ` ${supabaseOrigin}` : '') + "; " +
      "frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com;";

    if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
      document.head.appendChild(meta);
    }
  }
};

// Initialize all tracking and security
export const initializeTracking = async () => {
  // Enforce HTTPS
  enforceHTTPS();

  if (typeof window === 'undefined' || !shouldApplyProductionPolicies()) {
    return;
  }

  // Initialize analytics
  try {
    const { analytics } = await import('@/lib/analytics');
    const { performanceMonitor } = await import('@/lib/performanceMonitor');

    await analytics.initialize();
    performanceMonitor.init();

    // Track initial page view
    analytics.trackPageView(window.location.pathname + window.location.search, document.title);
  } catch (error) {
    console.error('Analytics initialization failed:', error);
  }

  // Initialize AdSense
  try {
    // 在开发环境中跳过AdSense初始化避免错误
    if (import.meta.env.DEV) {
      console.log('Skipping AdSense initialization in development mode');
    } else {
      const { adsense } = await import('@/lib/adsense');
      await adsense.initialize();
    }
  } catch (error) {
    console.error('AdSense initialization failed:', error);
  }
};

export default { enforceHTTPS, initializeTracking };
