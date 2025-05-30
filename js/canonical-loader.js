// 动态加载 canonical 链接，支持多语言和 config.json baseUrl
(async function() {
  async function fetchUrlsJson() {
    try {
      const res = await fetch('/scripts/urls.json');
      if (!res.ok) return { defaultLang: 'en', langs: [], urls: [] };
      return await res.json();
    } catch (e) { return { defaultLang: 'en', langs: [], urls: [] }; }
  }

  function getCleanPath() {
    var path = window.location.pathname;
    return path.replace(/\/+/g, '/');
  }

  function setCanonical(baseUrl, urls) {
    var cleanPath = getCleanPath();
    // 只为存在于urls.json的页面生成canonical
    var exists = urls.some(u => u.endsWith(cleanPath));
    if (!exists) return;
    var canonicalHref = baseUrl.replace(/\/$/, '') + cleanPath;
    var canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalHref;
  }

  // 主流程
  fetch('/scripts/config.json').then(function(r) { return r.json(); }).then(async function(cfg) {
    var baseUrl = cfg.baseUrl || window.location.origin;
    var { urls } = await fetchUrlsJson();
    setCanonical(baseUrl, urls);
  });
})();
