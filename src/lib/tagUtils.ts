
import { realManufacturers } from './manufacturerUtils';
import { realDevices } from './deviceUtils';
import { realMRIDevices } from './mriUtils';
import { Tag } from '@/types/tag';

const allDevices = [...realDevices, ...realMRIDevices];

// 从制造商数据中提取标签
const extractManufacturerTags = (): Tag[] => {
  const tags: Tag[] = [];

  // 国家标签
  const countries = [...new Set(realManufacturers.map(m => m.country))];
  countries.forEach(country => {
    const count = realManufacturers.filter(m => m.country === country).length;
    tags.push({
      id: `country-${country.toLowerCase().replace(/\s+/g, '-')}`,
      name: country,
      category: 'country',
      count,
      description: `来自${country}的制造商`
    });
  });

  // 技术优势标签
  const techAdvantages = realManufacturers.flatMap(m => {
    if (Array.isArray(m.technicalAdvantages)) return m.technicalAdvantages;
    if (typeof m.technicalAdvantages === 'string') return m.technicalAdvantages.split(/[,，]/).map(s => s.trim());
    return [];
  });
  const uniqueTechAdvantages = [...new Set(techAdvantages.filter(t => t.length > 0))];
  uniqueTechAdvantages.forEach(tech => {
    const count = realManufacturers.filter(m => {
      const adv = m.technicalAdvantages;
      if (Array.isArray(adv)) return adv.includes(tech);
      if (typeof adv === 'string') return adv.includes(tech);
      return false;
    }).length;
    if (count >= 2) { // Only keep tags that appear at least twice for better organization
      tags.push({
        id: `tech-${tech.toLowerCase().replace(/\s+/g, '-').substring(0, 30)}`,
        name: tech,
        category: 'technology',
        count,
        description: `具有${tech}技术的制造商`
      });
    }
  });

  return tags;
};

// 从设备和品牌数据中提取标签
const extractBrandTags = (): Tag[] => {
  const tags: Tag[] = [];

  // 市场定位标签 (基于制造商类别映射)
  const categories = [...new Set(realManufacturers.map(m => m.category))];
  categories.forEach(category => {
    const count = realManufacturers.filter(m => m.category === category).length;
    const categoryName = category === 'major' ? '头部品牌' :
      category === 'notable' ? '著名品牌' : '新锐品牌';
    tags.push({
      id: `position-${category}`,
      name: categoryName,
      category: 'market_position',
      count,
      description: `${categoryName}定位的品牌`
    });
  });

  // 产品类型标签
  const productTypes = ['CT', 'MRI'];
  productTypes.forEach(type => {
    const count = allDevices.filter(d => d.type.toLowerCase() === type.toLowerCase()).length;
    tags.push({
      id: `type-${type.toLowerCase()}`,
      name: `${type}设备`,
      category: 'product_type',
      count,
      description: `${type}相关产品`
    });
  });

  return tags;
};

export const allTags = [
  ...extractManufacturerTags(),
  ...extractBrandTags()
];

export const getTagsByCategory = (category: string) => {
  return allTags.filter(tag => tag.category === category);
};
