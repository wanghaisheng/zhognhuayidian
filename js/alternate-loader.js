// alternate-loader.js
// 动态为多语言站点添加 <link rel="alternate" hreflang=...> 标签，支持 config.json 及自动检测
(async function() {
  async function fetchUrlsJson() {
    try {
      const res = await fetch('/scripts/urls.json');
      if (!res.ok) return { defaultLang: 'en', langs: [], urls: [] };
      return await res.json();
    } catch (e) { return { defaultLang: 'en', langs: [], urls: [] }; }
  }

  function getBaseUrl(cfg) {
    if (cfg && cfg.baseUrl) return cfg.baseUrl.replace(/\/$/, '');
    return window.location.origin;
  }

  function getPageInfo() {
    var path = window.location.pathname.replace(/\/+/g, '/');
    var match = path.match(/^\/(\w{2})(?:[\/-]|$)/); // 如 /zh/app/home.html
    var lang = match ? match[1] : 'en';
    return { lang, path };
  }

  // 动态添加 alternate 标签
  function addAlternateLinks(baseUrl, pageInfo, urls, langs, defaultLang) {
    // 清理已有 alternate 标签，防止重复
    document.querySelectorAll('link[rel="alternate"]').forEach(el => el.remove());
    // x-default
    var defaultHref = baseUrl + pageInfo.path.replace(/^\/(en|zh|fr|es|de|ja|ko|pt|ru|it|nl|pl|tr|id|da|nb|th|tw)/, '');
    var defaultLink = document.createElement('link');
    defaultLink.rel = 'alternate';
    defaultLink.setAttribute('hreflang', 'x-default');
    defaultLink.href = defaultHref;
    document.head.appendChild(defaultLink);
    // 其它语言
    langs.forEach(function(lang) {
      var prefix = lang === defaultLang ? '' : `/${lang}`;
      var path = prefix + pageInfo.path.replace(/^\/(en|zh|fr|es|de|ja|ko|pt|ru|it|nl|pl|tr|id|da|nb|th|tw)/, '');
      path = path.replace(/\/+/g, '/');
      var exists = Array.isArray(urls) ? urls.some(u => u.endsWith(path)) : false;
      if (exists) {
        var href = baseUrl + path;
        // 扩展 hreflang 规则，支持 pollo.html 的所有语言
        var hreflangMap = {
          zh: 'zh-CN', 'zh-Hant-TW': 'zh-Hant-TW', en: 'en', es: 'es-ES', fr: 'fr-FR', pt: 'pt-PT', it: 'it-IT', ja: 'ja-JP', th: 'th-TH', pl: 'pl-PL', ko: 'ko-KR', de: 'de-DE', ru: 'ru-RU', da: 'da-DK', nb: 'nb-NO', nl: 'nl-NL', id: 'id-ID', tr: 'tr-TR'
        };
        var hreflang = hreflangMap[lang] || lang;
        var link = document.createElement('link');
        link.rel = 'alternate';
        link.setAttribute('hreflang', hreflang);
        link.href = href;
        document.head.appendChild(link);
      }
    });
  }

  // 主流程
  fetch('/scripts/config.json').then(function(r) { return r.json(); }).then(async function(cfg) {
    var baseUrl = getBaseUrl(cfg);
    var pageInfo = getPageInfo();
    var urlsData = await fetchUrlsJson();
    var urls = urlsData.urls || [];
    var langs = urlsData.langs || ['en'];
    var defaultLang = urlsData.defaultLang || 'en';
    addAlternateLinks(baseUrl, pageInfo, urls, langs, defaultLang);
  });
})();
