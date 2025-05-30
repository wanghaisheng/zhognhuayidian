// 动态加载多语言 ld+json 结构化数据脚本
(function() {
  function getCurrentLang() {
    return (
      (window.i18nInstance && window.i18nInstance.currentLang) ||
      localStorage.getItem('lang') ||
      document.documentElement.lang ||
      'zh'
    );
  }

  async function fetchUrlsJson() {
    try {
      const res = await fetch('/scripts/urls.json');
      if (!res.ok) return { defaultLang: 'en', langs: [], urls: [] };
      return await res.json();
    } catch (e) { return { defaultLang: 'en', langs: [], urls: [] }; }
  }

  function getLdjsonTypes() {
    // 可根据实际需求调整要加载的类型
    // 根据 config.json 的 apptype 和页面类型，动态返回需要加载的 ld+json 类型
    // 基础类型，通常所有页面都需要
    let types = ['WebSite', 'Organization', 'BreadcrumbList'];

    // 从全局配置或页面元数据中获取 apptype
    // 此处为示例，实际项目中需要更完善的 apptype 获取机制
    const appConfig = window.ldJsonConfig || {};
    const apptype = appConfig.apptype || 'app'; // 默认为 'app'
    const pageType = appConfig.pageType || ''; // 页面类型，例如 'blog', 'product', 'faq'

    switch (apptype) {
        case 'app':
            types.push('SoftwareApplication', 'Review');
            break;
        case 'game':
            types.push('GameApplication', 'Review');
            break;
        case 'product':
            types.push('Product', 'Review');
            break;
        case 'blog':
            types.push('Article', 'Review');
            if (pageType === 'faq') { // 博文内嵌FAQ
                types.push('FAQPage');
            }
            break;
        case 'faq':
            types.push('FAQPage');
            break;
        default:
            // 默认情况下，可以只加载基础类型
            break;
    }

    // 如果页面本身就是特定类型，也加入
    if (pageType && !types.includes(pageType.charAt(0).toUpperCase() + pageType.slice(1) + 'Page') && pageType !== 'blog') {
        if (pageType === 'article' || pageType === 'product' || pageType === 'faq') {
             types.push(pageType.charAt(0).toUpperCase() + pageType.slice(1));
        } else if (pageType === 'faqpage') {
            types.push('FAQPage');
        }
    }

    // 去重
    return [...new Set(types)];
  }

  async function loadAndInjectLdjson() {
    var lang = getCurrentLang();
    var { urls } = await fetchUrlsJson();
    // 找到当前页面的绝对路径（含多语言前缀）
    var pagePath = window.location.pathname;
    // 只为 urls.json 中存在的页面注入
    var exists = urls.some(u => u.endsWith(pagePath));
    if (!exists) return;
    // 自动推导 ldjson 目录（去掉末尾.html，适配 index.html 和其它页面）
    var ldjsonBase = pagePath.replace(/\.html$/, '').replace(/\/+$/, '');
    // 兼容 / 和 /index.html
    if (ldjsonBase === '' || ldjsonBase === '/') {
      ldjsonBase = '/index';
    }
    // 目录格式：/scripts/ldjson/{lang}{ldjsonBase}/
    var base = `/scripts/ldjson/${lang}${ldjsonBase}/`;
    var types = getLdjsonTypes();

    // 移除已注入的 ld+json
    document.querySelectorAll('script[type="application/ld+json"].dynamic-ldjson').forEach(function(el) {
      el.parentNode.removeChild(el);
    });
    
    types.forEach(function(type) {
      fetch(base + type + '.json')
        .then(function(res) { if (!res.ok) throw 0; return res.json(); })
        .then(function(data) {
          var script = document.createElement('script');
          script.type = 'application/ld+json';
          script.className = 'dynamic-ldjson';
          script.textContent = JSON.stringify(data, null, 2);
          document.head.appendChild(script);
        })
        .catch(function() { /* 不存在可忽略 */ });
    });
  }

  document.addEventListener('DOMContentLoaded', loadAndInjectLdjson);
  window.addEventListener('languageChanged', function() {
    setTimeout(loadAndInjectLdjson, 200);
  });
  window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'switch-lang' && event.data.lang) {
      setTimeout(loadAndInjectLdjson, 200);
    }
  });
})();
