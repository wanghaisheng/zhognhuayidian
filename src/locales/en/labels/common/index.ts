export const common = {
  // General
  skipToContent: 'Skip to main content',
  overview: 'Overview',
  noDataAvailable: 'No Data Available',

  // Abbreviations
  ct: 'CT',
  mri: 'MRI',

  // Basic actions
  viewAll: 'View All',
  viewDetails: 'View Details',
  total: 'Total',
  backToDevices: 'Back to Devices',
  backToManufacturers: 'Back to Manufacturers',
  backToBlog: 'Back to Blog',

  // Navigation items - MOVED TO data/navigation.ts and data/footer.ts
  
  // Filtering and sorting
  all: 'All',
  filters: 'Filters',
  sortBy: 'Sort By',
  clearFilters: 'Clear Filters',
  name: 'Name',

  // Status messages
  loading: 'Loading...',
  error: 'Error',
  errorMessages: {
    markdownProcess: 'Markdown processing error',
    importItemFailed: 'Failed to import content item: {{error}}',
    jsonParseFailed: 'JSON parse failed: {{error}}'
  },
  noImageAvailable: 'No image available',

  // Image related
  image: {
    unknownError: 'Unknown error',
    compressionFailed: 'Compression failed',
    loadFailed: 'Failed to load image',
    unsupportedFormat: 'Please upload supported image formats',
    partialUnsupported: 'Some files are not supported'
  },

  // Not found messages
  pageNotFound: 'Page Not Found',
  pageNotFoundDescription: 'Oops! The page you are looking for does not exist.',
  returnHome: 'Return to Home',
  deviceNotFound: 'Device Not Found',
  deviceNotFoundDescription: 'Sorry, the device you are looking for does not exist or has been removed.',
  manufacturerNotFound: 'Manufacturer Not Found',
  manufacturerNotFoundDescription: 'Sorry, the manufacturer you are looking for does not exist or has been removed.',
  articleNotFound: 'Article Not Found',
  articleNotFoundDescription: 'Sorry, the article you are looking for does not exist or has been removed.',
  contentNotFound: 'Content Not Found',
  contentNotFoundDescription: 'Sorry, the content you are looking for does not exist or has been removed.',

  // Navigation
  home: 'Home',
  learn: 'Learn',
  search: 'Search',
  resources: 'Resources',
  backToLearn: 'Back to Learning Center',
  backToHome: 'Back to Home',
  backToHistory: 'Back to History',
  readMore: 'Read More',
  relatedArticles: 'Related Articles',
  referencesCitations: 'References & Citations',
  availableLanguages: 'Available Languages',
  writtenBy: 'Written By',
  byAuthor: 'By {{name}}',
  reviewedBy: 'Reviewed by {{name}}',
  minRead: '{{minutes}} min read',
  publishedOn: 'Published {{date}}',
  updatedOn: 'Updated {{date}}',
  changeRegion: 'Change Region',
  selectYourRegion: 'Select Your Region',
  chooseLanguageRegionDesc: 'Choose a language and region to see content for your location',
  noReviewsYet: 'No reviews available yet',

  // Footer
  allRightsReserved: 'All rights reserved.',
  icpNumber: 'ICP Registration Number',
  miitRecord: 'MIIT Record',

  // Units
  tenThousandYuan: '10k CNY',

  // Structured Data
  ctScanner: 'CT Scanner',
  mriSystem: 'MRI System',
  customerService: 'Customer Service',
  usedEquipment: 'Used Equipment',
  refurbishedEquipment: 'Refurbished Equipment',
  industryAnalysis: 'Industry Analysis',
  verifiedSupplier: 'Verified Supplier',
  
  // Price Units
  price: {
    units: {
      wan: '10k',
      wanyuan: '10k CNY',
      yuan: '$'
    }
  },

  // SEO
  siteDescription: 'Professional CT scanner and MRI equipment information platform, providing equipment comparison, manufacturer information, market analysis, and purchasing guides.',
  orgDescription: 'Professional medical imaging equipment information and consulting service platform',
  manufacturerDesc: '{{name}} - Professional medical imaging equipment manufacturer',

  // SEO Report
  seoReport: {
    fixCritical: 'Prioritize fixing high severity issues',
    canonical: 'Implement canonical URL standardization',
    hreflang: 'Add hreflang tags',
    gsc: 'Monitor Google Search Console regularly',
    speed: 'Optimize page load speed',
    quality: 'Improve content quality and uniqueness',
    summary: 'Found {{issues}} SEO issues, with {{critical}} high priority',

    // Content Analysis
    contentTooShort: 'Content too short ({{length}} chars, recommended {{min}})',
    addMoreContent: 'Add more valuable content',
    tooManyRepeated: 'Too many repeated words',
    reduceRepetition: 'Reduce repetition, increase vocabulary diversity',
    tooFewSentences: 'Too few sentences',
    addMoreDetails: 'Add more detailed descriptions',
    
    // Structured Data Validation
    missingType: 'Missing @type field',
    productMissingName: 'Product missing name field',
    productMissingDesc: 'Product missing description field',
    orgMissingName: 'Organization missing name field',
    articleMissingHeadline: 'Article missing headline field',
    articleMissingAuthor: 'Article missing author field',

    // SEO Monitor
    duplicateTitle: 'Duplicate title: "{{title}}"',
    createUniqueTitle: 'Create unique title for each page',
    duplicateDesc: 'Duplicate description: "{{desc}}..."',
    createUniqueDesc: 'Create unique description for each page',
    invalidStructuredData: 'Structured data must be a valid object',
    missingContext: 'Missing @context field',
    
    missingTitle: 'Page missing title tag',
    addTitle: 'Add descriptive page title',
    shortTitle: 'Page title too short ({{length}} chars)',
    titleLengthSuggestion: 'Recommended title length 30-60 chars',
    titleMaxLengthSuggestion: 'Title should be within 60 characters',
    longTitle: 'Page title too long ({{length}} chars)',
    missingDesc: 'Page missing meta description',
    addDesc: 'Add page description',
    shortDesc: 'Page description too short ({{length}} chars)',
    descLengthSuggestion: 'Recommended description length 120-160 chars',
    longDesc: 'Page description too long ({{length}} chars)',
    missingCanonical: 'Page missing canonical tag',
    addCanonical: 'Add canonical URL to avoid duplicate content',
    missingHreflang: 'Page missing hreflang tags',
    addHreflang: 'Add multilingual link tags',
    noindexFound: 'Page marked as noindex',
    checkIndex: 'Check if page should be indexed',
    missingStructuredData: 'Page missing structured data',
    addSchema: 'Add Schema.org structured data to improve search results',
    invalidSchemaValidation: 'Structured data {{index}} validation failed: {{errors}}',
    fixSchema: 'Fix structured data format errors',
    malformedSchema: 'Structured data {{index}} malformed',
    checkJson: 'Check JSON format',
    missingH1: 'Page missing H1 tag',
    addH1: 'Add main heading (H1) tag',
    multipleH1: 'Page has {{count}} H1 tags',
    oneH1: 'Recommended one H1 tag per page',
    thinContent: 'Page content too thin ({{count}} words)',
    addContent: 'Add more valuable content (recommended 300+ words)',
    missingAlt: '{{count}} images missing alt attribute',
    addAlt: 'Add descriptive alt text for all images',
    slowLoading: 'Page load time too long ({{time}}s)',
    optimizeSpeed: 'Optimize page load speed, recommend under 3s',
    insufficientLinks: 'Too few internal links ({{count}})',
    addInternalLinks: 'Add internal links to related pages',
    missingNofollow: 'External links missing nofollow attribute',
    addNofollow: 'Add rel="nofollow" to external links',
    
    // SEO Report Text
    reportTitle: '📊 SEO Check Report\n',
    reportPage: '🔗 Page: {{url}}\n',
    reportScore: '📈 Score: {{score}}/100\n',
    reportTime: '⏰ Check Time: {{time}}\n',
    reportIssues: '⚠️  Issues Found:\n',
    reportSuggestion: '      💡 Suggestion: {{suggestion}}\n',
    reportNoIssues: '✅ No issues found\n',
    reportSummary: '📋 Summary\n',
    reportCheckedPages: '• Pages Checked: {{count}}\n',
    reportAvgScore: '• Average Score: {{score}}/100\n',
    reportCriticalIssues: '• Critical Issues: {{count}}\n',
    noResults: 'No SEO check results'
  }
  ,
  // Generic terms used in hooks
  country: 'Country',
  id: 'ID',
  '-vs-': 'vs'
,
  controls: {
    toggleMenu: 'Toggle menu',
    previous: 'Previous',
    next: 'Next',
    more: 'More',
    close: 'Close',
    previousSlide: 'Previous slide',
    nextSlide: 'Next slide',
    morePages: 'More pages',
    toggleSidebar: 'Toggle Sidebar'
  }
};
