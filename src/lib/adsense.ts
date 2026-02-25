// Google AdSense 管理器
interface AdUnit {
  id: string;
  slot: string;
  size: [number, number] | 'responsive';
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  fullWidthResponsive?: boolean;
}

interface AdConfig {
  client: string;
  testMode?: boolean;
  enableLazyLoad?: boolean;
  pageLevel?: boolean;
}

class AdSenseManager {
  private config: AdConfig;
  private isInitialized = false;
  private loadedUnits = new Set<string>();

  constructor(config: AdConfig) {
    this.config = config;
  }

  // 初始化 AdSense
  async initialize() {
    if (this.isInitialized) return;

    try {
      // 加载 AdSense 脚本
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${this.config.client}`;
      script.crossOrigin = 'anonymous';
      
      // 移除不支持的 data-ad-status 属性
      // if (this.config.testMode) {
      //   script.setAttribute('data-ad-status', 'test');
      // }

      document.head.appendChild(script);

      // 等待脚本加载
      await new Promise<void>((resolve, reject) => {
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('AdSense script failed to load'));
      });

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

      this.isInitialized = true;
      console.log('AdSense initialized successfully');
    } catch (error) {
      console.error('AdSense initialization failed:', error);
    }
  }

  // 创建广告单元
  createAdUnit(containerId: string, adUnit: AdUnit): HTMLElement | null {
    if (!this.isInitialized) {
      console.warn('AdSense not initialized');
      return null;
    }

    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container ${containerId} not found`);
      return null;
    }

    // 清除现有内容
    container.innerHTML = '';

    // 创建广告元素
    const adElement = document.createElement('ins');
    adElement.className = 'adsbygoogle';
    adElement.style.display = 'block';
    adElement.setAttribute('data-ad-client', this.config.client);
    adElement.setAttribute('data-ad-slot', adUnit.slot);

    // 设置广告尺寸
    if (adUnit.size === 'responsive') {
      adElement.setAttribute('data-ad-format', 'auto');
      adElement.setAttribute('data-full-width-responsive', 
        adUnit.fullWidthResponsive ? 'true' : 'false');
    } else if (Array.isArray(adUnit.size)) {
      adElement.style.width = `${adUnit.size[0]}px`;
      adElement.style.height = `${adUnit.size[1]}px`;
    }

    // 设置广告格式
    if (adUnit.format) {
      adElement.setAttribute('data-ad-format', adUnit.format);
    }

    // 测试模式
    if (this.config.testMode) {
      adElement.setAttribute('data-adtest', 'on');
    }

    container.appendChild(adElement);

    // 推送到 AdSense
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      this.loadedUnits.add(adUnit.id);
    } catch (error) {
      console.error('Failed to load ad unit:', error);
    }

    return adElement;
  }

  // 预定义的广告单元配置
  static readonly AD_UNITS = {
    BANNER_TOP: {
      id: 'banner-top',
      slot: '1234567890',
      size: 'responsive' as const,
      format: 'auto' as const,
      fullWidthResponsive: true
    },
    BANNER_BOTTOM: {
      id: 'banner-bottom',
      slot: '0987654321',
      size: 'responsive' as const,
      format: 'auto' as const,
      fullWidthResponsive: true
    },
    SIDEBAR_RECTANGLE: {
      id: 'sidebar-rectangle',
      slot: '1122334455',
      size: [300, 250] as [number, number],
      format: 'rectangle' as const
    },
    CONTENT_INLINE: {
      id: 'content-inline',
      slot: '5544332211',
      size: 'responsive' as const,
      format: 'fluid' as const
    },
    MOBILE_BANNER: {
      id: 'mobile-banner',
      slot: '9988776655',
      size: [320, 50] as [number, number],
      format: 'horizontal' as const
    }
  };

  // 响应式广告助手
  loadResponsiveAd(containerId: string, adUnitKey: keyof typeof AdSenseManager.AD_UNITS) {
    const adUnit = AdSenseManager.AD_UNITS[adUnitKey];
    return this.createAdUnit(containerId, adUnit);
  }

  // 清除广告单元
  clearAdUnit(containerId: string) {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = '';
    }
  }

  // 刷新广告（用于动态内容）
  refreshAd(containerId: string, adUnit: AdUnit) {
    this.clearAdUnit(containerId);
    // 延迟加载新广告
    setTimeout(() => {
      this.createAdUnit(containerId, adUnit);
    }, 100);
  }

  // 检查广告屏蔽器
  async detectAdBlocker(): Promise<boolean> {
    try {
      const testAd = document.createElement('div');
      testAd.innerHTML = '&nbsp;';
      testAd.className = 'adsbox';
      testAd.style.position = 'absolute';
      testAd.style.left = '-10000px';
      testAd.style.width = '1px';
      testAd.style.height = '1px';
      
      document.body.appendChild(testAd);
      
      // 检查元素是否被隐藏
      const isBlocked = testAd.offsetHeight === 0;
      
      document.body.removeChild(testAd);
      
      return isBlocked;
    } catch {
      return false;
    }
  }

  // 获取加载状态
  getLoadedUnits() {
    return Array.from(this.loadedUnits);
  }

  // 重置
  reset() {
    this.loadedUnits.clear();
  }
}

// 全局 AdSense 实例 - 在开发环境中禁用
export const adsense = new AdSenseManager({
  client: 'ca-pub-XXXXXXXXXXXXXXXX', // 需要替换为实际的 AdSense 客户端 ID
  testMode: process.env.NODE_ENV === 'development',
  enableLazyLoad: true,
  pageLevel: false // 暂时禁用页面级广告避免重复初始化错误
});

// TypeScript 声明
declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}

export default adsense;