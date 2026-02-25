export const common = {
  // General
  skipToContent: '跳转到主要内容',
  overview: '概览',
  noDataAvailable: '暂无数据',

  // Abbreviations
  ct: 'CT',
  mri: 'MRI',

  // Basic actions
  viewAll: '查看全部',
  viewDetails: '查看详情',
  total: '总计',
  backToDevices: '返回设备列表',
  backToManufacturers: '返回制造商列表',
  backToBlog: '返回博客',

  // Navigation items - MOVED TO data/navigation.ts and data/footer.ts
  
  // Filtering and sorting
  all: '全部',
  filters: '筛选',
  sortBy: '排序',
  clearFilters: '清除筛选',
  name: '名称',

  // Status messages
  loading: '加载中...',
  error: '错误',
  errorMessages: {
    markdownProcess: 'Markdown 处理错误',
    importItemFailed: '导入内容项失败: {{error}}',
    jsonParseFailed: 'JSON 解析失败: {{error}}'
  },
  noImageAvailable: '暂无图片',

  // Image related
  image: {
    unknownError: '未知错误',
    compressionFailed: '压缩失败',
    loadFailed: '加载图片失败',
    unsupportedFormat: '请上传支持的图片格式',
    partialUnsupported: '部分文件格式不支持'
  },

  // Not found messages
  pageNotFound: '页面未找到',
  pageNotFoundDescription: '抱歉，您访问的页面不存在。',
  returnHome: '返回首页',
  deviceNotFound: '设备未找到',
  deviceNotFoundDescription: '抱歉，您查找的设备不存在或已被移除。',
  manufacturerNotFound: '制造商未找到',
  manufacturerNotFoundDescription: '抱歉，您查找的制造商不存在或已被移除。',
  articleNotFound: '文章未找到',
  articleNotFoundDescription: '抱歉，您查找的文章不存在或已被移除。',
  contentNotFound: '内容未找到',
  contentNotFoundDescription: '抱歉，您查找的内容不存在或已被移除。',

  // Navigation
  home: '首页',
  learn: '学习中心',
  search: '搜索',
  backToLearn: '返回学习中心',
  backToHome: '返回首页',
  backToHistory: '返回发展史',
  readMore: '阅读更多',
  relatedArticles: '相关文章',
  referencesCitations: '参考与引用',
  availableLanguages: '可用语言',
  writtenBy: '作者',
  byAuthor: '作者：{{name}}',
  reviewedBy: '由 {{name}} 审阅',
  minRead: '{{minutes}} 分钟阅读',
  publishedOn: '发布于 {{date}}',
  updatedOn: '更新于 {{date}}',
  changeRegion: '切换地区',
  selectYourRegion: '选择您的地区',
  chooseLanguageRegionDesc: '选择语言和地区，以查看适配您位置的内容',
  noReviewsYet: '暂无评论',

  // Footer
  allRightsReserved: '版权所有。',
  icpNumber: 'ICP备案号',
  miitRecord: '工信部备案',

  // Units
  tenThousandYuan: '万元',

  // Structured Data
  ctScanner: 'CT扫描仪',
  mriSystem: 'MRI系统',
  customerService: '客户服务',
  usedEquipment: '二手设备',
  refurbishedEquipment: '翻新设备',
  industryAnalysis: '行业分析',
  verifiedSupplier: '认证供应商',
  
  // Price Units
  price: {
    units: {
      wan: '万',
      wanyuan: '万元',
      yuan: '元'
    }
  },

  // SEO
  siteDescription: '专业的CT扫描仪和MRI设备信息平台，提供设备对比、制造商信息、市场分析和采购指南。',
  orgDescription: '专业的医学影像设备信息与咨询服务平台',
  manufacturerDesc: '{{name}} - 专业的医学影像设备制造商',

  // SEO Report
  seoReport: {
    fixCritical: '优先修复高严重级别问题',
    canonical: '实现 canonical URL 规范化',
    hreflang: '添加 hreflang 标签',
    gsc: '定期监控 Google Search Console',
    speed: '优化页面加载速度',
    quality: '提升内容质量与独特性',
    summary: '发现 {{issues}} 个 SEO 问题，其中 {{critical}} 个为高优先级',
    contentTooShort: '内容过短（{{length}} 字，建议不少于 {{min}}）',
    addMoreContent: '增加更有价值的内容',
    tooManyRepeated: '重复词过多',
    reduceRepetition: '减少重复，增加词汇多样性',
    tooFewSentences: '句子数量过少',
    addMoreDetails: '补充更详细的描述',
    missingType: '缺少 @type 字段',
    productMissingName: '产品缺少名称字段',
    productMissingDesc: '产品缺少描述字段',
    orgMissingName: '机构缺少名称字段',
    articleMissingHeadline: '文章缺少 headline 字段',
    articleMissingAuthor: '文章缺少 author 字段',
    duplicateTitle: '标题重复：“{{title}}”',
    createUniqueTitle: '为每个页面创建唯一标题',
    duplicateDesc: '描述重复：“{{desc}}...”',
    createUniqueDesc: '为每个页面创建唯一描述',
    invalidStructuredData: '结构化数据必须是有效对象',
    missingContext: '缺少 @context 字段',
    missingTitle: '页面缺少 title 标签',
    addTitle: '添加具有描述性的页面标题',
    shortTitle: '页面标题过短（{{length}} 字）',
    titleLengthSuggestion: '建议标题长度 30-60 字符',
    titleMaxLengthSuggestion: '标题应不超过 60 个字符',
    longTitle: '页面标题过长（{{length}} 字）',
    missingDesc: '页面缺少 meta description',
    addDesc: '添加页面描述',
    shortDesc: '页面描述过短（{{length}} 字）',
    descLengthSuggestion: '建议描述长度 120-160 字符',
    longDesc: '页面描述过长（{{length}} 字）',
    missingCanonical: '页面缺少 canonical 标签',
    addCanonical: '添加 canonical URL 以避免重复内容',
    missingHreflang: '页面缺少 hreflang 标签',
    addHreflang: '添加多语言链接标签',
    noindexFound: '页面被标记为 noindex',
    checkIndex: '检查页面是否应被索引',
    missingStructuredData: '页面缺少结构化数据',
    addSchema: '添加 Schema.org 结构化数据以提升搜索结果',
    invalidSchemaValidation: '结构化数据 {{index}} 校验失败：{{errors}}',
    fixSchema: '修复结构化数据格式错误',
    malformedSchema: '结构化数据 {{index}} 格式不正确',
    checkJson: '检查 JSON 格式',
    missingH1: '页面缺少 H1 标签',
    addH1: '添加主标题（H1）',
    multipleH1: '页面存在 {{count}} 个 H1 标签',
    oneH1: '建议每页仅有一个 H1 标签',
    thinContent: '页面内容过少（{{count}} 个词）',
    addContent: '增加更有价值的内容（建议 300+ 词）',
    missingAlt: '{{count}} 张图片缺少 alt 属性',
    addAlt: '为所有图片添加描述性的 alt 文本',
    slowLoading: '页面加载时间过长（{{time}} 秒）',
    optimizeSpeed: '优化页面速度，建议 3 秒以内',
    insufficientLinks: '内部链接过少（{{count}}）',
    addInternalLinks: '为相关页面添加内部链接',
    missingNofollow: '外链缺少 nofollow 属性',
    addNofollow: '为外链添加 rel="nofollow"',
    reportTitle: '📊 SEO 检查报告\n',
    reportPage: '🔗 页面：{{url}}\n',
    reportScore: '📈 得分：{{score}}/100\n',
    reportTime: '⏰ 检查时间：{{time}}\n',
    reportIssues: '⚠️  发现问题：\n',
    reportSuggestion: '      💡 建议：{{suggestion}}\n',
    reportNoIssues: '✅ 未发现问题\n',
    reportSummary: '📋 汇总\n',
    reportCheckedPages: '• 检查页面数：{{count}}\n',
    reportAvgScore: '• 平均得分：{{score}}/100\n',
    reportCriticalIssues: '• 严重问题数：{{count}}\n',
    noResults: '暂无 SEO 检查结果'
  },
 
  // 通用术语（用于 hooks）
  country: '国家',
  id: 'ID',
  '-vs-': '对比',
  // Breadcrumb and general navigation labels
  resources: '资源中心',
  controls: {
    toggleMenu: '切换菜单',
    previous: '上一页',
    next: '下一页',
    more: '更多',
    close: '关闭',
    previousSlide: '上一张',
    nextSlide: '下一张',
    morePages: '更多页面',
    toggleSidebar: '切换侧栏'
  }
};
