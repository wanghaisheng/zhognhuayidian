// 数据验证和质量检查系统
import { 
  StandardizedManufacturer, 
  StandardizedDevice, 
  StandardizedCustomer,
  StandardizedMarketAnalysis,
  ValidationResult 
} from '../types/standardized';
import i18n from '@/lib/i18n';

// 通用验证规则
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isValidDate = (date: string): boolean => {
  return !isNaN(Date.parse(date));
};

// 制造商数据验证
export const validateManufacturer = (data: Partial<StandardizedManufacturer>): ValidationResult => {
  const errors: ValidationResult['errors'] = [];
  const warnings: ValidationResult['warnings'] = [];

  // 必填字段检查
  if (!data.id) errors.push({ field: 'id', message: i18n.t('dataValidator.manufacturerIdRequired'), severity: 'error' });
  if (!data.name) errors.push({ field: 'name', message: i18n.t('dataValidator.manufacturerNameRequired'), severity: 'error' });
  if (!data.country) errors.push({ field: 'country', message: i18n.t('dataValidator.countryRequired'), severity: 'error' });
  if (!data.region) errors.push({ field: 'region', message: i18n.t('dataValidator.regionRequired'), severity: 'error' });

  // 数据格式检查
  if (data.website && !isValidUrl(data.website)) {
    errors.push({ field: 'website', message: i18n.t('dataValidator.invalidWebsiteUrl'), severity: 'error' });
  }

  if (data.contact_info?.email && !isValidEmail(data.contact_info.email)) {
    errors.push({ field: 'contact_info.email', message: i18n.t('dataValidator.invalidEmail'), severity: 'error' });
  }

  if (data.market_share !== undefined && (data.market_share < 0 || data.market_share > 100)) {
    errors.push({ field: 'market_share', message: i18n.t('dataValidator.marketShareRange'), severity: 'error' });
  }

  if (data.founded_year && (data.founded_year < 1800 || data.founded_year > new Date().getFullYear())) {
    warnings.push({ 
      field: 'founded_year', 
      message: i18n.t('dataValidator.foundedYearError'), 
      suggestion: i18n.t('dataValidator.checkFoundedYear') 
    });
  }

  // 数据完整性检查
  if (!data.product_lines || data.product_lines.length === 0) {
    warnings.push({ 
      field: 'product_lines', 
      message: i18n.t('dataValidator.noProductLines'), 
      suggestion: i18n.t('dataValidator.addProductLinesSuggestion') 
    });
  }

  if (!data.technical_advantages || data.technical_advantages.length === 0) {
    warnings.push({ 
      field: 'technical_advantages', 
      message: i18n.t('dataValidator.missingTechAdvantages'), 
      suggestion: i18n.t('dataValidator.addTechAdvantagesSuggestion') 
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// 设备数据验证
export const validateDevice = (data: Partial<StandardizedDevice>): ValidationResult => {
  const errors: ValidationResult['errors'] = [];
  const warnings: ValidationResult['warnings'] = [];

  // 必填字段检查
  if (!data.id) errors.push({ field: 'id', message: i18n.t('dataValidator.deviceIdRequired'), severity: 'error' });
  if (!data.name) errors.push({ field: 'name', message: i18n.t('dataValidator.deviceNameRequired'), severity: 'error' });
  if (!data.manufacturer_id) errors.push({ field: 'manufacturer_id', message: i18n.t('dataValidator.manufacturerIdRequired'), severity: 'error' });
  if (!data.type) errors.push({ field: 'type', message: i18n.t('dataValidator.deviceTypeRequired'), severity: 'error' });
  if (!data.category) errors.push({ field: 'category', message: i18n.t('dataValidator.deviceCategoryRequired'), severity: 'error' });

  // 价格验证
  if (data.price_range) {
    if (data.price_range.min < 0) {
      errors.push({ field: 'price_range.min', message: i18n.t('dataValidator.minPriceNegative'), severity: 'error' });
    }
    if (data.price_range.max < 0) {
      errors.push({ field: 'price_range.max', message: i18n.t('dataValidator.maxPriceNegative'), severity: 'error' });
    }
    if (data.price_range.min > data.price_range.max) {
      errors.push({ field: 'price_range', message: i18n.t('dataValidator.minPriceGreaterThanMax'), severity: 'error' });
    }
  } else {
    warnings.push({ 
      field: 'price_range', 
      message: i18n.t('dataValidator.missingPriceInfo'), 
      suggestion: i18n.t('dataValidator.addPriceInfoSuggestion') 
    });
  }

  // 规格验证
  if (data.type === 'CT' && data.specifications) {
    if (!data.specifications.detector_rows) {
      warnings.push({ 
        field: 'specifications.detector_rows', 
        message: i18n.t('dataValidator.missingDetectorRows'), 
        suggestion: i18n.t('dataValidator.addDetectorRowsSuggestion') 
      });
    }
  }

  if (data.type === 'MRI' && data.specifications) {
    if (!data.specifications.field_strength) {
      warnings.push({ 
        field: 'specifications.field_strength', 
        message: i18n.t('dataValidator.missingFieldStrength'), 
        suggestion: i18n.t('dataValidator.addFieldStrengthSuggestion') 
      });
    }
  }

  // 发布年份验证
  if (data.release_year && (data.release_year < 1970 || data.release_year > new Date().getFullYear() + 2)) {
    errors.push({ field: 'release_year', message: i18n.t('dataValidator.invalidReleaseYear'), severity: 'error' });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// 客户数据验证
export const validateCustomer = (data: Partial<StandardizedCustomer>): ValidationResult => {
  const errors: ValidationResult['errors'] = [];
  const warnings: ValidationResult['warnings'] = [];

  // 必填字段检查
  if (!data.id) errors.push({ field: 'id', message: i18n.t('dataValidator.customerIdRequired'), severity: 'error' });
  if (!data.hospital_name) errors.push({ field: 'hospital_name', message: i18n.t('dataValidator.hospitalNameRequired'), severity: 'error' });
  if (!data.location) errors.push({ field: 'location', message: i18n.t('dataValidator.locationRequired'), severity: 'error' });
  if (!data.hospital_type) errors.push({ field: 'hospital_type', message: i18n.t('dataValidator.hospitalTypeRequired'), severity: 'error' });

  // 位置信息验证
  if (data.location) {
    if (!data.location.country) errors.push({ field: 'location.country', message: i18n.t('dataValidator.countryRequired'), severity: 'error' });
    if (!data.location.city) errors.push({ field: 'location.city', message: i18n.t('dataValidator.cityRequired'), severity: 'error' });
    
    if (data.location.coordinates) {
      const [lng, lat] = data.location.coordinates;
      if (lng < -180 || lng > 180) {
        errors.push({ field: 'location.coordinates', message: i18n.t('dataValidator.invalidLongitude'), severity: 'error' });
      }
      if (lat < -90 || lat > 90) {
        errors.push({ field: 'location.coordinates', message: i18n.t('dataValidator.invalidLatitude'), severity: 'error' });
      }
    }
  }

  // 采购历史验证
  if (data.purchased_devices) {
    data.purchased_devices.forEach((purchase, index) => {
      if (!purchase.device_id) {
        errors.push({ 
          field: `purchased_devices[${index}].device_id`, 
          message: i18n.t('dataValidator.deviceIdRequired'), 
          severity: 'error' 
        });
      }
      if (!purchase.purchase_date || !isValidDate(purchase.purchase_date)) {
        errors.push({ 
          field: `purchased_devices[${index}].purchase_date`, 
          message: i18n.t('dataValidator.invalidPurchaseDate'), 
          severity: 'error' 
        });
      }
      if (purchase.quantity <= 0) {
        errors.push({ 
          field: `purchased_devices[${index}].quantity`, 
          message: i18n.t('dataValidator.invalidPurchaseQuantity'), 
          severity: 'error' 
        });
      }
    });
  } else {
    warnings.push({ 
      field: 'purchased_devices', 
      message: i18n.t('dataValidator.missingPurchaseHistory'), 
      suggestion: i18n.t('dataValidator.addPurchaseHistorySuggestion') 
    });
  }

  // 床位数验证
  if (data.bed_count !== undefined && data.bed_count <= 0) {
    errors.push({ field: 'bed_count', message: i18n.t('dataValidator.invalidBedCount'), severity: 'error' });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// 批量验证
export const validateBatch = <T>(
  items: T[], 
  validator: (item: T) => ValidationResult
): { valid: T[]; invalid: Array<{ item: T; validation: ValidationResult }> } => {
  const valid: T[] = [];
  const invalid: Array<{ item: T; validation: ValidationResult }> = [];

  items.forEach(item => {
    const validation = validator(item);
    if (validation.isValid) {
      valid.push(item);
    } else {
      invalid.push({ item, validation });
    }
  });

  return { valid, invalid };
};

// 数据质量报告生成
export const generateQualityReport = (validationResults: ValidationResult[]) => {
  const totalItems = validationResults.length;
  const validItems = validationResults.filter(r => r.isValid).length;
  const invalidItems = totalItems - validItems;
  
  const allErrors = validationResults.flatMap(r => r.errors);
  const allWarnings = validationResults.flatMap(r => r.warnings);
  
  const errorsByField = allErrors.reduce((acc, error) => {
    acc[error.field] = (acc[error.field] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const warningsByField = allWarnings.reduce((acc, warning) => {
    acc[warning.field] = (acc[warning.field] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    summary: {
      total: totalItems,
      valid: validItems,
      invalid: invalidItems,
      validationRate: Math.round((validItems / totalItems) * 100),
    },
    errors: {
      total: allErrors.length,
      byField: errorsByField,
      mostCommon: Object.entries(errorsByField)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([field, count]) => ({ field, count }))
    },
    warnings: {
      total: allWarnings.length,
      byField: warningsByField,
      mostCommon: Object.entries(warningsByField)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([field, count]) => ({ field, count }))
    },
    recommendations: generateRecommendations(errorsByField, warningsByField)
  };
};

// 改进建议生成
const generateRecommendations = (
  errors: Record<string, number>, 
  warnings: Record<string, number>
): string[] => {
  const recommendations: string[] = [];
  
  // 基于错误统计的建议
  const topErrors = Object.entries(errors).sort(([,a], [,b]) => b - a).slice(0, 3);
  topErrors.forEach(([field, count]) => {
    recommendations.push(i18n.t('dataValidator.fixPriorityErrors', { field, count }));
  });

  // 基于警告统计的建议
  const topWarnings = Object.entries(warnings).sort(([,a], [,b]) => b - a).slice(0, 3);
  topWarnings.forEach(([field, count]) => {
    recommendations.push(i18n.t('dataValidator.improveWarnings', { field, count }));
  });

  return recommendations;
};