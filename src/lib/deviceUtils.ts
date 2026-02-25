import { generateDeviceSlug } from '../utils/urlStructure';
import type { Device } from '@/types/device';
import { markdownContentManager } from './markdown';

export const realDevices: Device[] = [];

export const loadDevices = async (locale: string = 'en') => {
  const list = await markdownContentManager.getContentList('devices', locale);
  const mapped: Device[] = list.map(item => ({
    id: item.frontMatter.slug,
    name: item.frontMatter.title,
    slug: item.frontMatter.slug ?? generateDeviceSlug(item.frontMatter.title),
    manufacturerId: '',
    manufacturerName: '',
    brand: undefined,
    type: (item.frontMatter.tags || []).some((t: string) => t.toLowerCase().includes('mri')) ? 'mri' : 'ct',
    description: item.frontMatter.description,
    category: item.frontMatter.category as Device['category'],
    translations: {
      [locale]: {
        name: item.frontMatter.title,
        description: item.frontMatter.description
      }
    }
  }));
  realDevices.splice(0, realDevices.length, ...mapped);
  return realDevices;
};

export const getRealDevicesByBrand = (brand: string) => {
  return realDevices.filter(d => d.brand === brand);
};

export const getRealDevicesByCategory = (category: string) => {
  const normalized = category.toLowerCase();
  return realDevices.filter(d => 
    d.category === category || 
    d.type === normalized || 
    d.type?.toLowerCase() === normalized
  );
};

export const getRealUniqueBrands = () => {
  return [...new Set(realDevices.map(d => d.brand))].sort();
};

export const getRealUniqueCategories = () => {
  return [...new Set(realDevices.map(d => d.category))];
};
