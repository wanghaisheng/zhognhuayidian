import { EventCategory, EventAction, FunnelStage, AnalyticsEvent as IAnalyticsEvent } from './analytics/events';

// 分析追踪管理器
interface AnalyticsEvent extends IAnalyticsEvent {
  userId?: string;
  sessionId?: string;
  timestamp?: number;
}

interface AnalyticsConfig {
  gtag?: string;
  gtm?: string;
  clarity?: string;
  debug?: boolean;
}

class AnalyticsManager {
  private config: AnalyticsConfig = {};
  private isInitialized = false;

  constructor(config: AnalyticsConfig) {
    this.config = config;
  }

  // 初始化所有分析工具
  async initialize() {
    if (this.isInitialized) return;

    try {
      // 初始化 Google Analytics 4
      if (this.config.gtag) {
        await this.initializeGA4();
      }

      // 初始化 Google Tag Manager
      if (this.config.gtm) {
        await this.initializeGTM();
      }

      // 初始化 Microsoft Clarity
      if (this.config.clarity) {
        await this.initializeClarity();
      }

      this.isInitialized = true;
      this.log('Analytics initialized successfully');
    } catch (error) {
      console.error('Analytics initialization failed:', error);
    }
  }

  // Google Analytics 4 初始化
  private async initializeGA4() {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.gtag}`;
    document.head.appendChild(script);

    return new Promise<void>((resolve) => {
      script.onload = () => {
        window.dataLayer = window.dataLayer || [];
        window.gtag = function (...args: unknown[]) { window.dataLayer.push(args); };
        window.gtag('js', new Date());
        window.gtag('config', this.config.gtag!, {
          page_title: document.title,
          page_location: window.location.href,
          custom_map: { 'custom_parameter': 'device_type' }
        });
        resolve();
      };
    });
  }

  // Google Tag Manager 初始化
  private async initializeGTM() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${this.config.gtm}`;
    document.head.appendChild(script);

    // GTM noscript fallback
    const noscript = document.createElement('noscript');
    noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${this.config.gtm}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
    document.body.insertBefore(noscript, document.body.firstChild);
  }

  // Microsoft Clarity 初始化
  private async initializeClarity() {
    const script = document.createElement('script');
    script.innerHTML = `
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${this.config.clarity}");
    `;
    document.head.appendChild(script);
  }

  // 页面浏览追踪 (View)
  trackPageView(path: string, title?: string) {
    const event: AnalyticsEvent = {
      action: EventAction.VIEW_PAGE,
      category: EventCategory.VIEW,
      label: path,
      timestamp: Date.now()
    };

    this.sendEvent(event);

    // GA4 页面浏览
    if (this.config.gtag && window.gtag) {
      window.gtag('config', this.config.gtag, {
        page_path: path,
        page_title: title || document.title
      });
    }

    // GTM 页面浏览
    if (this.config.gtm && window.dataLayer) {
      window.dataLayer.push({
        event: 'virtual_page_view',
        page_path: path,
        page_title: title || document.title
      });
    }
  }

  // 设备查看追踪 (View)
  trackDeviceView(deviceId: string, deviceName: string, manufacturer: string) {
    const event: AnalyticsEvent = {
      action: EventAction.VIEW_DEVICE,
      category: EventCategory.VIEW,
      label: `${manufacturer}_${deviceName}`,
      value: 1
    };

    this.sendEvent(event);

    // GTM 产品查看事件
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'view_item',
        item_id: deviceId,
        item_name: deviceName,
        item_category: 'medical_device',
        item_brand: manufacturer,
        value: 1
      });
    }
  }

  // 询价事件追踪 (Submission)
  trackInquiry(deviceId: string, deviceName: string, inquiryType: string) {
    const event: AnalyticsEvent = {
      action: EventAction.SUBMIT_INQUIRY,
      category: EventCategory.SUBMISSION,
      label: `${inquiryType}_${deviceName}`,
      value: 1
    };

    this.sendEvent(event);

    // GTM 转化事件
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'generate_lead',
        item_id: deviceId,
        item_name: deviceName,
        lead_type: inquiryType,
        value: 1
      });
    }
  }

  // 搜索追踪 (Interaction)
  trackSearch(searchTerm: string, resultsCount: number) {
    const event: AnalyticsEvent = {
      action: 'search',
      category: EventCategory.INTERACTION,
      label: searchTerm,
      value: resultsCount
    };

    this.sendEvent(event);

    // GTM 搜索事件
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'search',
        search_term: searchTerm,
        results_count: resultsCount
      });
    }
  }

  // 下载追踪 (Submission)
  trackDownload(fileName: string, fileType: string) {
    const event: AnalyticsEvent = {
      action: EventAction.DOWNLOAD_BROCHURE,
      category: EventCategory.SUBMISSION,
      label: `${fileType}_${fileName}`
    };

    this.sendEvent(event);

    // GTM 文件下载事件
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'file_download',
        file_name: fileName,
        file_type: fileType
      });
    }
  }

  // ROI计算器追踪 (Interaction)
  trackCalculatorUsage(calculatorType: string, action: string, value?: number) {
    const event: AnalyticsEvent = {
      action: EventAction.USE_CALCULATOR,
      category: EventCategory.INTERACTION,
      label: `${calculatorType}:${action}`,
      value: value
    };

    this.sendEvent(event);

    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'calculator_usage',
        calculator_type: calculatorType,
        calculator_action: action,
        calculator_value: value
      });
    }
  }

  // 配置器事件追踪 (Interaction)
  trackConfiguratorEvent(step: string, action: string, label?: string) {
    const event: AnalyticsEvent = {
      action: action,
      category: EventCategory.INTERACTION,
      label: `${step}_${label || ''}`
    };

    this.sendEvent(event);

    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'configurator_usage',
        configurator_step: step,
        configurator_action: action,
        configurator_label: label
      });
    }
  }

  // 错误追踪 (Error)
  trackError(errorType: string, errorMessage: string) {
    const event: AnalyticsEvent = {
      action: EventAction.APP_ERROR,
      category: EventCategory.ERROR,
      label: `${errorType}: ${errorMessage}`
    };

    this.sendEvent(event);

    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'app_error',
        error_type: errorType,
        error_message: errorMessage
      });
    }
  }

  // 内容反馈追踪 (Interaction)
  trackFeedback(contentId: string, helpful: boolean) {
    const event: AnalyticsEvent = {
      action: helpful ? 'feedback_helpful' : 'feedback_not_helpful',
      category: EventCategory.INTERACTION,
      label: contentId,
      value: helpful ? 1 : 0
    };

    this.sendEvent(event);

    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'content_feedback',
        content_id: contentId,
        helpful: helpful
      });
    }
  }

  // 埋点漏斗追踪 (Funnel)
  trackFunnelStep(stage: FunnelStage, stepName: string, data?: Record<string, unknown>) {
    const event: AnalyticsEvent = {
      action: `funnel_${stage}`,
      category: EventCategory.INTERACTION, // Funnel steps are interactions usually
      label: stepName,
      ...data
    };

    this.sendEvent(event);

    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'funnel_step',
        funnel_stage: stage,
        step_name: stepName,
        ...data
      });
    }
  }

  // 通用事件发送
  private sendEvent(event: AnalyticsEvent) {
    // 添加通用属性
    const enrichedEvent = {
      ...event,
      timestamp: event.timestamp || Date.now(),
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      page_url: window.location.href,
      referrer: document.referrer
    };

    this.log('Event tracked:', enrichedEvent);

    // GA4 事件
    if (this.config.gtag && window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value
      });
    }

    // 自定义事件处理（可扩展）
    if (this.config.debug) {
      console.table(enrichedEvent);
    }
  }

  private log(message: string, data?: unknown) {
    if (this.config.debug) {
      console.log(`[Analytics] ${message}`, data);
    }
  }
}

// 全局分析实例
export const analytics = new AnalyticsManager({
  gtag: 'G-XXXXXXXXXX', // 替换为实际的 GA4 测量 ID
  gtm: 'GTM-XXXXXXX',   // 替换为实际的 GTM 容器 ID  
  clarity: 'XXXXXXXXX', // 替换为实际的 Clarity 项目 ID
  debug: process.env.NODE_ENV === 'development'
});

// TypeScript 声明
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (command: string, ...args: unknown[]) => void;
  }
}

export default analytics;