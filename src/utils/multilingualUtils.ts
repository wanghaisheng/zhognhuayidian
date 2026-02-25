import { useTranslation } from 'react-i18next';

/**
 * 多语言工具函数
 */

/**
 * 获取当前语言环境
 */
export const useCurrentLocale = () => {
  const { i18n } = useTranslation();
  return i18n.language;
};

/**
 * 检查是否为中文环境
 */
export const useIsChineseLocale = () => {
  const { i18n } = useTranslation();
  return i18n.language === 'zh';
};

/**
 * 根据语言环境返回不同的值
 */
export const useLocalizedValue = <T>(zhValue: T, enValue: T): T => {
  const { i18n } = useTranslation();
  return i18n.language === 'zh' ? zhValue : enValue;
};

/**
 * 格式化日期（根据语言环境）
 */
export const formatLocalizedDate = (date: Date, locale?: string): string => {
  const currentLocale = locale || 'en';
  
  if (currentLocale === 'zh') {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
};

/**
 * 获取本地化的数字格式
 */
export const formatLocalizedNumber = (number: number, locale?: string): string => {
  const currentLocale = locale || 'en';
  
  if (currentLocale === 'zh') {
    return number.toLocaleString('zh-CN');
  } else {
    return number.toLocaleString('en-US');
  }
};

/**
 * 获取本地化的百分比格式
 */
export const formatLocalizedPercentage = (value: number, locale?: string): string => {
  const currentLocale = locale || 'en';
  
  if (currentLocale === 'zh') {
    return `${value}%`;
  } else {
    return `${value}%`;
  }
};

/**
 * 状态标签的多语言映射
 */
export const getLocalizedStatusLabel = (status: string, locale?: string) => {
  const currentLocale = locale || 'en';
  
  const statusLabels = {
    zh: {
      pending: '待处理',
      contacted: '已联系',
      converted: '已转化',
      closed: '已关闭',
      active: '活跃',
      inactive: '非活跃',
      success: '成功',
      failed: '失败',
      processing: '处理中',
      completed: '已完成',
      cancelled: '已取消'
    },
    en: {
      pending: 'Pending',
      contacted: 'Contacted',
      converted: 'Converted',
      closed: 'Closed',
      active: 'Active',
      inactive: 'Inactive',
      success: 'Success',
      failed: 'Failed',
      processing: 'Processing',
      completed: 'Completed',
      cancelled: 'Cancelled'
    }
  };

  return statusLabels[currentLocale as keyof typeof statusLabels]?.[status as keyof typeof statusLabels.zh] || status;
};

/**
 * 设备类型的多语言映射
 */
export const getLocalizedDeviceType = (deviceType: string, locale?: string) => {
  const currentLocale = locale || 'en';
  
  const deviceTypes = {
    zh: {
      'ct': 'CT扫描仪',
      'mri': 'MRI扫描仪',
      'xray': 'X光机',
      'ultrasound': '超声设备',
      'mammography': '乳腺机',
      'angiography': '血管造影机'
    },
    en: {
      'ct': 'CT Scanner',
      'mri': 'MRI Scanner',
      'xray': 'X-ray Machine',
      'ultrasound': 'Ultrasound Equipment',
      'mammography': 'Mammography System',
      'angiography': 'Angiography System'
    }
  };

  return deviceTypes[currentLocale as keyof typeof deviceTypes]?.[deviceType as keyof typeof deviceTypes.zh] || deviceType;
};

/**
 * 技术规格的多语言映射
 */
export const getLocalizedTechSpec = (spec: string, locale?: string) => {
  const currentLocale = locale || 'en';
  
  const techSpecs = {
    zh: {
      'Single detector': '单探测器',
      'Multiple detectors (linear)': '多探测器（线性）',
      'Rotating detector array': '旋转探测器阵列',
      'Fixed ring detectors': '固定环形探测器',
      'Translate-rotate': '平移-旋转',
      'Rotate only': '仅旋转',
      'Rotating X-ray tube': '旋转X射线管',
      'Basic imaging': '基础成像',
      'General purpose': '通用',
      'Cardiac imaging': '心脏成像',
      'Advanced cardiac': '高级心脏成像',
      'Whole organ': '全器官',
      'Volume scanning': '容积扫描',
      'Standard': '标准',
      'Fast': '快速',
      'Very Fast': '很快',
      'Ultra Fast': '超快',
      'Instantaneous': '瞬时',
      'Historical': '历史',
      'Current Standard': '当前标准',
      'Specialized': '专用'
    },
    en: {
      '单探测器': 'Single detector',
      '多探测器（线性）': 'Multiple detectors (linear)',
      '旋转探测器阵列': 'Rotating detector array',
      '固定环形探测器': 'Fixed ring detectors',
      '平移-旋转': 'Translate-rotate',
      '仅旋转': 'Rotate only',
      '旋转X射线管': 'Rotating X-ray tube',
      '基础成像': 'Basic imaging',
      '通用': 'General purpose',
      '心脏成像': 'Cardiac imaging',
      '高级心脏成像': 'Advanced cardiac',
      '全器官': 'Whole organ',
      '容积扫描': 'Volume scanning',
      '标准': 'Standard',
      '快速': 'Fast',
      '很快': 'Very Fast',
      '超快': 'Ultra Fast',
      '瞬时': 'Instantaneous',
      '历史': 'Historical',
      '当前标准': 'Current Standard',
      '专用': 'Specialized'
    }
  };

  return techSpecs[currentLocale as keyof typeof techSpecs]?.[spec as keyof typeof techSpecs.zh] || spec;
};