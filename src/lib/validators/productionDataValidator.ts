
// 生产数据验证工具 - 确保数据完整性和准确性
import { realDevices } from '@/lib/deviceUtils';
import { realManufacturers } from '@/lib/manufacturerUtils';
import { realMRIDevices } from '@/lib/mriUtils';
import { ValidationResult } from '@/types/validation';

export class ProductionDataValidator {
  static validate(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 验证制造商数据
    const manufacturerValidation = this.validateManufacturers();
    errors.push(...manufacturerValidation.errors);
    warnings.push(...manufacturerValidation.warnings);

    // 验证设备数据
    const deviceValidation = this.validateDevices();
    errors.push(...deviceValidation.errors);
    warnings.push(...deviceValidation.warnings);

    // 验证数据关联性
    const relationValidation = this.validateDataRelations();
    errors.push(...relationValidation.errors);
    warnings.push(...relationValidation.warnings);

    // 统计信息
    const statistics = this.generateStatistics();

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      statistics
    };
  }

  private static validateManufacturers() {
    const errors: string[] = [];
    const warnings: string[] = [];

    realManufacturers.forEach((manufacturer, index) => {
      // 必填字段验证
      if (!manufacturer.id) {
        errors.push(`制造商 ${index + 1}: 缺少ID`);
      }
      if (!manufacturer.name) {
        errors.push(`制造商 ${manufacturer.id}: 缺少名称`);
      }
      if (!manufacturer.country) {
        errors.push(`制造商 ${manufacturer.id}: 缺少国家信息`);
      }
      if (!manufacturer.website) {
        warnings.push(`制造商 ${manufacturer.id}: 缺少网站信息`);
      }

      // 数据格式验证
      if (manufacturer.website && !manufacturer.website.startsWith('http')) {
        warnings.push(`制造商 ${manufacturer.id}: 网站URL格式可能不正确`);
      }

      // 市场份额数据验证
      if (manufacturer.marketShare && !manufacturer.marketShare.includes('%')) {
        warnings.push(`制造商 ${manufacturer.id}: 市场份额格式可能不正确`);
      }
    });

    return { errors, warnings };
  }

  private static validateDevices() {
    const errors: string[] = [];
    const warnings: string[] = [];

    const allDevices = [...realDevices, ...realMRIDevices];

    allDevices.forEach((device, index) => {
      // 必填字段验证
      if (!device.id) {
        errors.push(`设备 ${index + 1}: 缺少ID`);
      }
      if (!device.name) {
        errors.push(`设备 ${device.id}: 缺少名称`);
      }
      if (!device.manufacturerId) {
        errors.push(`设备 ${device.id}: 缺少制造商ID`);
      }

      // 数据一致性验证
      const manufacturer = realManufacturers.find(m => m.id === device.manufacturerId);
      if (!manufacturer) {
        errors.push(`设备 ${device.id}: 引用的制造商ID (${device.manufacturerId}) 不存在`);
      }
    });

    return { errors, warnings };
  }

  private static validateDataRelations() {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 检查是否有制造商没有对应设备
    realManufacturers.forEach(m => {
      const hasDevices = [...realDevices, ...realMRIDevices].some(d => d.manufacturerId === m.id);
      if (!hasDevices) {
        warnings.push(`制造商 ${m.name} (${m.id}) 没有关联的设备数据`);
      }
    });

    return { errors, warnings };
  }

  private static generateStatistics() {
    const allDevices = [...realDevices, ...realMRIDevices];
    return {
      totalManufacturers: realManufacturers.length,
      totalDevices: allDevices.length,
      totalMRIDevices: realMRIDevices.length,
      chineseManufacturers: realManufacturers.filter(m => m.country === 'China').length,
      globalManufacturers: realManufacturers.filter(m => m.country !== 'China').length,
      highEndDevices: allDevices.filter(d => d.category === 'high-end').length,
      midRangeDevices: allDevices.filter(d => d.category === 'mid-range').length,
      entryLevelDevices: allDevices.filter(d => d.category === 'entry-level').length
    };
  }
}
