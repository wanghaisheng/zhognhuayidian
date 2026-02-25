import { Manufacturer } from '@/types/manufacturer';
import { EnhancedManufacturer, IntegratedMetadata } from '@/types/analysis';

/**
 * 增强版制造商数据转换工具
 * 将原始制造商数据转换为包含额外分析字段的增强格式
 */
export const getEnhancedManufacturers = (manufacturers: Manufacturer[]): EnhancedManufacturer[] => {
  return manufacturers.map(m => ({
    ...m,
    globalPresence: m.region ? [m.region] : [],
    certifications: ['NMPA', 'ISO 13485'],
    keyProducts: Array.isArray(m.productFeatures) 
      ? m.productFeatures 
      : (m.productFeatures ? [m.productFeatures] : []),
    competitiveAdvantage: Array.isArray(m.technicalAdvantages) 
      ? m.technicalAdvantages 
      : (m.technicalAdvantages ? [m.technicalAdvantages] : [])
  }));
};

/**
 * 整合数据元数据生成器
 */
export const generateIntegratedMetadata = (
  manufacturerCount: number, 
  deviceCount: number,
  source: string = 'Enhanced integration from docs/data.json and market research'
): IntegratedMetadata => {
  return {
    lastUpdated: new Date().toISOString().split('T')[0], // 动态获取当前日期或保持固定
    version: '2.0.0',
    dataSource: source,
    totalManufacturers: manufacturerCount,
    totalDevices: deviceCount
  };
};
