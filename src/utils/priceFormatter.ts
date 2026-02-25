import { useTranslation } from 'react-i18next';
import i18n from '@/lib/i18n';

/**
 * 价格格式化工具
 */
export const formatPriceRange = (
  minPrice: number, 
  maxPrice: number, 
  locale: string = 'en',
  t?: (key: string) => string
): string => {
  // Fallback to i18n.t if t is not provided
  const translate = t || i18n.t;
  
  if (locale === 'zh') {
    // 中文：转换为万元
    const minWan = (minPrice / 10000).toFixed(0);
    const maxWan = (maxPrice / 10000).toFixed(0);
    const unit = translate('common.price.units.wan');
    const currency = translate('common.price.units.yuan');
    return `${currency}${minWan}-${maxWan}${unit}`;
  } else {
    // 英文：保持原始数值，使用千分位分隔符
    const formatNumber = (num: number) => {
      return new Intl.NumberFormat('en-US').format(num);
    };
    return `$${formatNumber(minPrice)}-${formatNumber(maxPrice)}`;
  }
};

/**
 * 单个价格格式化
 */
export const formatPrice = (
  price: number, 
  locale: string = 'en',
  t?: (key: string) => string
): string => {
  // Fallback to i18n.t if t is not provided
  const translate = t || i18n.t;
  
  if (locale === 'zh') {
    const wan = (price / 10000).toFixed(0);
    const unit = translate('common.price.units.wan');
    const currency = translate('common.price.units.yuan');
    return `${currency}${wan}${unit}`;
  } else {
    return `$${new Intl.NumberFormat('en-US').format(price)}`;
  }
};

/**
 * React Hook版本的价格格式化
 */
export const usePriceFormatter = () => {
  const { i18n, t } = useTranslation();
  const currentLocale = i18n.language;

  return {
    formatPriceRange: (minPrice: number, maxPrice: number) => 
      formatPriceRange(minPrice, maxPrice, currentLocale, t),
    formatPrice: (price: number) => 
      formatPrice(price, currentLocale, t),
    currentLocale
  };
};

/**
 * 价格范围标签格式化（用于筛选器等）
 */
export const formatPriceRangeLabel = (
  minPrice: number, 
  maxPrice: number, 
  locale: string = 'en',
  t?: (key: string) => string
): string => {
  // Fallback to i18n.t if t is not provided
  const translate = t || i18n.t;
  
  if (locale === 'zh') {
    const minWan = (minPrice / 10000).toFixed(0);
    const maxWan = (maxPrice / 10000).toFixed(0);
    const unit = translate('common.price.units.wanyuan');
    return `${minWan}-${maxWan}${unit}`;
  } else {
    const formatNumber = (num: number) => {
      if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
      } else if (num >= 1000) {
        return `${(num / 1000).toFixed(0)}K`;
      }
      return num.toString();
    };
    return `$${formatNumber(minPrice)}-${formatNumber(maxPrice)}`;
  }
};
