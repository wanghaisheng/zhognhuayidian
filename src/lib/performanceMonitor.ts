import { useEffect, useState } from 'react';

// Add missing performance interfaces
interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
}

interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

interface WebVitalsMetrics {
  FCP?: number;  // First Contentful Paint
  LCP?: number;  // Largest Contentful Paint  
  FID?: number;  // First Input Delay
  CLS?: number;  // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte
}

interface PerformanceMonitorOptions {
  enableAnalytics?: boolean;
  threshold?: {
    FCP: number;
    LCP: number;
    FID: number;
    CLS: number;
    TTFB: number;
  };
}

class PerformanceMonitor {
  private metrics: WebVitalsMetrics = {};
  private options: PerformanceMonitorOptions;
  private observer?: PerformanceObserver;

  constructor(options: PerformanceMonitorOptions = {}) {
    this.options = {
      enableAnalytics: true,
      threshold: {
        FCP: 1800,  // Good: < 1.8s
        LCP: 2500,  // Good: < 2.5s
        FID: 100,   // Good: < 100ms
        CLS: 0.1,   // Good: < 0.1
        TTFB: 800   // Good: < 800ms
      },
      ...options
    };
  }

  // Initialize performance monitoring
  init() {
    if (typeof window === 'undefined') return;

    // Monitor Core Web Vitals
    this.observeWebVitals();
    
    // Monitor Navigation Timing
    this.observeNavigationTiming();
    
    // Monitor Resource Loading
    this.observeResourceTiming();
    
    // Monitor Layout Shifts
    this.observeLayoutShifts();
  }

  // Observe Web Vitals using PerformanceObserver
  private observeWebVitals() {
    // First Contentful Paint
    this.observeEntryTypes(['paint'], (entries) => {
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        this.metrics.FCP = fcpEntry.startTime;
        this.reportMetric('FCP', fcpEntry.startTime);
      }
    });

    // Largest Contentful Paint
    this.observeEntryTypes(['largest-contentful-paint'], (entries) => {
      const lcpEntry = entries[entries.length - 1];
      if (lcpEntry) {
        this.metrics.LCP = lcpEntry.startTime;
        this.reportMetric('LCP', lcpEntry.startTime);
      }
    });

    // First Input Delay
    this.observeEntryTypes(['first-input'], (entries) => {
      const fidEntry = entries[0] as PerformanceEventTiming;
      if (fidEntry && fidEntry.processingStart && fidEntry.startTime) {
        this.metrics.FID = fidEntry.processingStart - fidEntry.startTime;
        this.reportMetric('FID', this.metrics.FID);
      }
    });

    // Cumulative Layout Shift
    this.observeLayoutShifts();
  }

  // Observe Navigation Timing
  private observeNavigationTiming() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.metrics.TTFB = navigation.responseStart - navigation.requestStart;
        this.reportMetric('TTFB', this.metrics.TTFB);
      }
    });
  }

  // Observe Resource Loading Performance
  private observeResourceTiming() {
    this.observeEntryTypes(['resource'], (entries) => {
      entries.forEach(entry => {
        const resource = entry as PerformanceResourceTiming;
        // Log slow resources
        if (resource.duration > 1000) {
          console.warn(`Slow resource detected: ${resource.name} (${resource.duration.toFixed(2)}ms)`);
        }
      });
    });
  }

  // Observe Layout Shifts
  private observeLayoutShifts() {
    let clsValue = 0;
    let sessionValue = 0;
    let sessionEntries: PerformanceEntry[] = [];

    this.observeEntryTypes(['layout-shift'], (entries) => {
      for (const entry of entries) {
        const layoutShift = entry as LayoutShift;
        // Only count layout shifts without recent user input
        if (!layoutShift.hadRecentInput) {
          const firstSessionEntry = sessionEntries[0];
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

          // If the entry occurred less than 1 second after the previous entry and
          // less than 5 seconds after the first entry in the session, include it
          if (sessionValue &&
              entry.startTime - lastSessionEntry.startTime < 1000 &&
              entry.startTime - firstSessionEntry.startTime < 5000) {
            sessionValue += layoutShift.value;
            sessionEntries.push(entry);
          } else {
            sessionValue = layoutShift.value;
            sessionEntries = [entry];
          }

          // Update the CLS value if the current session value is larger
          if (sessionValue > clsValue) {
            clsValue = sessionValue;
            this.metrics.CLS = clsValue;
            this.reportMetric('CLS', clsValue);
          }
        }
      }
    });
  }

  // Generic observer for performance entries
  private observeEntryTypes(types: string[], callback: (entries: PerformanceEntry[]) => void) {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      
      types.forEach(type => {
        try {
          observer.observe({ type, buffered: true });
        } catch (e) {
          // Type not supported
          console.warn(`Performance observer type '${type}' not supported`);
        }
      });
    } catch (e) {
      console.warn('PerformanceObserver not supported');
    }
  }

  // Report metric to analytics
  private reportMetric(name: string, value: number) {
    const threshold = this.options.threshold![name as keyof typeof this.options.threshold];
    const rating = value <= threshold ? 'good' : value <= threshold * 1.5 ? 'needs-improvement' : 'poor';
    
    console.log(`Performance Metric - ${name}: ${value.toFixed(2)} (${rating})`);

    // Send to analytics if enabled
    if (this.options.enableAnalytics && window.gtag) {
      window.gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: name,
        value: Math.round(value),
        custom_map: { metric_rating: rating }
      });
    }

    // Send to custom analytics
    this.sendToAnalytics(name, value, rating);
  }

  // Send metrics to custom analytics endpoint
  private sendToAnalytics(metric: string, value: number, rating: string) {
    // Custom analytics implementation
    if (typeof window !== 'undefined' && 'navigator' in window && 'sendBeacon' in navigator) {
      const data = JSON.stringify({
        metric,
        value,
        rating,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      });

      // In production, replace with your analytics endpoint
      navigator.sendBeacon('/api/analytics/performance', data);
    }
  }

  // Get current metrics
  getMetrics(): WebVitalsMetrics {
    return { ...this.metrics };
  }

  // Get performance score (0-100)
  getPerformanceScore(): number {
    const { FCP, LCP, FID, CLS, TTFB } = this.metrics;
    const thresholds = this.options.threshold!;
    
    let score = 0;
    let count = 0;

    if (FCP) {
      score += FCP <= thresholds.FCP ? 100 : Math.max(0, 100 - ((FCP - thresholds.FCP) / thresholds.FCP) * 100);
      count++;
    }
    
    if (LCP) {
      score += LCP <= thresholds.LCP ? 100 : Math.max(0, 100 - ((LCP - thresholds.LCP) / thresholds.LCP) * 100);
      count++;
    }
    
    if (FID) {
      score += FID <= thresholds.FID ? 100 : Math.max(0, 100 - ((FID - thresholds.FID) / thresholds.FID) * 100);
      count++;
    }
    
    if (CLS) {
      score += CLS <= thresholds.CLS ? 100 : Math.max(0, 100 - ((CLS - thresholds.CLS) / thresholds.CLS) * 500);
      count++;
    }
    
    if (TTFB) {
      score += TTFB <= thresholds.TTFB ? 100 : Math.max(0, 100 - ((TTFB - thresholds.TTFB) / thresholds.TTFB) * 100);
      count++;
    }

    return count > 0 ? Math.round(score / count) : 0;
  }

  // Cleanup
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// React Hook for performance monitoring
export const usePerformanceMonitor = (options?: PerformanceMonitorOptions) => {
  const [metrics, setMetrics] = useState<WebVitalsMetrics>({});
  const [score, setScore] = useState<number>(0);
  const [monitor] = useState(() => new PerformanceMonitor(options));

  useEffect(() => {
    monitor.init();

    // Update metrics periodically
    const interval = setInterval(() => {
      setMetrics(monitor.getMetrics());
      setScore(monitor.getPerformanceScore());
    }, 1000);

    return () => {
      clearInterval(interval);
      monitor.destroy();
    };
  }, [monitor]);

  return { metrics, score };
};

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

export default PerformanceMonitor;