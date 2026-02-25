// 中华医典SEO配置
// 针对中医古籍、传统医学和相关研究的关键词优化

import { SITE_CONFIG } from '@/config/site';

export const TCM_SEO_CONFIG: Record<string, {
  title: string;
  description: string;
  keywords: string[];
  hreflang: string;
  structuredData?: object;
}> = {
  // 古籍库页面
  '/library/': {
    title: '中医古籍库 | 1000+部古代医学典籍 | 中华医典',
    description: '浏览1000+部中医古籍，包括《黄帝内经》、《伤寒杂病论》、《本草纲目》等经典著作。支持分类检索、全文搜索和学术研究。',
    keywords: ['中医古籍', '古代医学', '黄帝内经', '伤寒杂病论', '本草纲目', '中医经典', '传统医学'],
    hreflang: 'zh-CN',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "中医古籍库",
      "description": "收录中国历代医学古籍1000部，涵盖医经、本草、方书、针灸等各个领域",
      "url": `${SITE_CONFIG.url}/library`
    }
  },

  '/library/medical-classics/': {
    title: '医经类古籍 | 中医理论基础 | 中华医典',
    description: '医经类古籍收录《黄帝内经》、《难经》等中医理论奠基著作，包含阴阳五行、脏腑经络、病因病机等核心理论。',
    keywords: ['医经', '黄帝内经', '难经', '中医理论', '阴阳五行', '脏腑经络'],
    hreflang: 'zh-CN'
  },

  '/library/materia-medica/': {
    title: '本草类古籍 | 中药学经典 | 中华医典',
    description: '本草类古籍收录《神农本草经》、《本草纲目》等中药学经典，包含药材性味、功效主治、配伍禁忌等内容。',
    keywords: ['本草', '神农本草经', '本草纲目', '中药学', '药材', '性味归经'],
    hreflang: 'zh-CN'
  },

  '/library/prescriptions/': {
    title: '方书类古籍 | 中医方剂大全 | 中华医典',
    description: '方书类古籍收录《伤寒杂病论》、《金匮要略》等方剂经典，包含经方、时方、验方等各类方剂。',
    keywords: ['方书', '伤寒杂病论', '金匮要略', '中医方剂', '经方', '时方'],
    hreflang: 'zh-CN'
  },

  // 智能检索页面
  '/search/': {
    title: '智能检索 | AI驱动的中医文献搜索 | 中华医典',
    description: 'AI驱动的中医文献智能检索系统，支持古籍全文搜索、方剂配伍查询、症状辨证检索、药材功效搜索。',
    keywords: ['中医检索', '古籍搜索', '方剂查询', '症状检索', '药材搜索', 'AI搜索'],
    hreflang: 'zh-CN',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "中医智能检索系统",
      "description": "基于AI技术的中医文献智能检索平台",
      "url": `${SITE_CONFIG.url}/search`
    }
  },

  '/search/books/': {
    title: '古籍检索 | 全文搜索中医经典 | 中华医典',
    description: '古籍全文检索功能，支持关键词搜索、语义检索、引文检索，快速定位相关医学典籍内容。',
    keywords: ['古籍检索', '全文搜索', '中医经典', '文献检索', '语义搜索'],
    hreflang: 'zh-CN'
  },

  '/search/prescriptions/': {
    title: '方剂检索 | 中药方剂数据库 | 中华医典',
    description: '方剂检索功能，支持按症状、药材、功效搜索方剂，提供方剂组成、用法用量、禁忌等信息。',
    keywords: ['方剂检索', '中药方剂', '经方搜索', '方剂数据库', '配伍禁忌'],
    hreflang: 'zh-CN'
  },

  '/search/symptoms/': {
    title: '症状检索 | 中医辨证论治 | 中华医典',
    description: '症状检索功能，根据症状表现推荐相应方剂和治法，支持中医辨证论治的智能化查询。',
    keywords: ['症状检索', '辨证论治', '中医诊断', '症状分析', '治法推荐'],
    hreflang: 'zh-CN'
  },

  '/search/herbs/': {
    title: '药材检索 | 中药数据库 | 中华医典',
    description: '药材检索功能，提供药材性味归经、功效主治、用法用量、配伍禁忌等详细信息。',
    keywords: ['药材检索', '中药数据库', '性味归经', '功效主治', '配伍禁忌'],
    hreflang: 'zh-CN'
  },

  // 学术研究页面
  '/research/': {
    title: '学术研究 | 中医现代化研究 | 中华医典',
    description: '中医学术研究平台，收录基于古籍的现代研究论文，涵盖数据挖掘、现代药理、临床研究等领域。',
    keywords: ['中医研究', '学术论文', '数据挖掘', '现代药理', '临床研究', '中医现代化'],
    hreflang: 'zh-CN',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ScholarlyArticle",
      "name": "中医学术研究",
      "description": "基于中医古籍的现代化学术研究平台",
      "url": `${SITE_CONFIG.url}/research`
    }
  },

  '/research/papers/': {
    title: '研究论文 | 中医学术文献 | 中华医典',
    description: '中医研究论文库，收录基于古籍理论的现代学术研究，包括实验研究、临床观察、文献综述等。',
    keywords: ['中医论文', '学术文献', '实验研究', '临床观察', '文献综述'],
    hreflang: 'zh-CN'
  },

  '/research/institutions/': {
    title: '研究机构 | 中医科研院所 | 中华医典',
    description: '中医研究机构介绍，收录国内外知名中医科研院所、大学、医院的研究方向和成果。',
    keywords: ['中医机构', '科研院所', '中医药大学', '中医院', '研究中心'],
    hreflang: 'zh-CN'
  },

  '/research/trends/': {
    title: '研究趋势 | 中医发展前沿 | 中华医典',
    description: '中医研究趋势分析，展示中医现代化、国际化的发展方向和热点研究领域。',
    keywords: ['中医趋势', '发展前沿', '中医现代化', '国际化', '研究热点'],
    hreflang: 'zh-CN'
  },

  // 关于我们页面
  '/about/': {
    title: '关于我们 | 中华医典项目介绍',
    description: '中华医典项目介绍，了解我们的使命愿景、团队背景、技术架构和发展规划。',
    keywords: ['中华医典', '项目介绍', '使命愿景', '团队介绍', '中医数字化'],
    hreflang: 'zh-CN',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "中华医典",
      "description": "传承中医智慧，弘扬中华文化",
      "url": SITE_CONFIG.url
    }
  },

  // 首页
  '/': {
    title: '中华医典 - 中医古籍与传统医学 | 传承中医智慧',
    description: '中华医典收录中国历代医学古籍1000部，卷帙上万，4亿字，为中医研究和传承提供数字化平台。探索中医智慧，弘扬中华文化。',
    keywords: ['中华医典', '中医古籍', '传统医学', '中医智慧', '中华文化', '中医数字化'],
    hreflang: 'zh-CN',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "中华医典",
      "url": SITE_CONFIG.url,
      "description": "传承中医智慧，弘扬中华文化",
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${SITE_CONFIG.url}/search?query={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    }
  }
};

const normalizePathname = (pathname: string) => {
  return pathname.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
};

// 获取TCM SEO配置的辅助函数
export const getTCMSEOConfig = (pathname: string) => {
  const normalized = normalizePathname(pathname);
  return (
    TCM_SEO_CONFIG[normalized] ||
    (normalized !== '/' ? TCM_SEO_CONFIG[`${normalized}/`] : null) ||
    null
  );
};

// 检查是否应该使用TCM SEO配置
export const shouldUseTCMSEO = (language: string, pathname: string) => {
  return language === 'zh' && getTCMSEOConfig(pathname) !== null;
};
