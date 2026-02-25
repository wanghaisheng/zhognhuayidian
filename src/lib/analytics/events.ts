
/**
 * Event Categories (四类归档)
 */
export enum EventCategory {
  VIEW = 'view',           // 查看：页面浏览、组件曝光
  INTERACTION = 'interaction', // 交互：点击、滚动、筛选、排序
  SUBMISSION = 'submission',   // 提交：表单提交、下载、询价
  ERROR = 'error',         // 错误：系统错误、API错误、验证失败
}

/**
 * Event Actions
 */
export enum EventAction {
  // View Actions
  VIEW_PAGE = 'view_page',
  VIEW_DEVICE = 'view_device',
  VIEW_MANUFACTURER = 'view_manufacturer',
  VIEW_COMPARISON = 'view_comparison',
  VIEW_PRICING = 'view_pricing',

  // Interaction Actions
  CLICK_BUTTON = 'click_button',
  CLICK_NAV = 'click_nav',
  FILTER_DEVICES = 'filter_devices',
  SORT_DEVICES = 'sort_devices',
  COMPARE_DEVICES = 'compare_devices',
  USE_CALCULATOR = 'use_calculator',
  
  // Submission Actions
  SUBMIT_INQUIRY = 'submit_inquiry',
  SUBMIT_CONTACT = 'submit_contact',
  DOWNLOAD_BROCHURE = 'download_brochure',
  DOWNLOAD_REPORT = 'download_report',
  
  // Error Actions
  APP_ERROR = 'app_error',
  API_ERROR = 'api_error',
  FORM_ERROR = 'form_error',
}

/**
 * Event Labels (Standardized)
 */
export enum EventLabel {
  HEADER = 'header',
  FOOTER = 'footer',
  SIDEBAR = 'sidebar',
  MAIN_CONTENT = 'main_content',
  DEVICE_LIST = 'device_list',
  DEVICE_DETAIL = 'device_detail',
}

/**
 * Base Event Interface
 */
export interface AnalyticsEvent {
  category: EventCategory;
  action: EventAction | string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
  [key: string]: unknown;
}

/**
 * Funnel Stages (埋点漏斗)
 */
export enum FunnelStage {
  AWARENESS = 'awareness',       // Landing, Listing
  INTEREST = 'interest',         // Product Detail, Content
  CONSIDERATION = 'consideration', // Comparison, Calculator
  INTENT = 'intent',             // Inquiry Form Start
  CONVERSION = 'conversion',     // Form Submit Success
}
