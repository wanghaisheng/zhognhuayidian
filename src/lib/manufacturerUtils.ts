import type { Manufacturer } from '@/types/manufacturer';
import { markdownContentManager } from './markdown';

export const realManufacturers: Manufacturer[] = [];

export const loadManufacturers = async (locale: string = 'en') => {
  const list = await markdownContentManager.getContentList('manufacturers', locale);
  const mapped: Manufacturer[] = list.map(item => ({
    id: item.frontMatter.slug,
    name: item.frontMatter.title,
    slug: item.frontMatter.slug,
    country: '',
    region: '',
    category: 'other',
    type: 'both',
    description: item.frontMatter.description,
    translations: {
      [locale]: {
        name: item.frontMatter.title,
        description: item.frontMatter.description
      }
    }
  }));
  realManufacturers.splice(0, realManufacturers.length, ...mapped);
  return realManufacturers;
};

export const getRealManufacturersByCategory = (category: string) => {
  return realManufacturers.filter(m => m.category === category);
};

export const getRealManufacturersByCountry = (country: string) => {
  return realManufacturers.filter(m => m.country === country);
};

export const getRealUniqueCountries = () => {
  return [...new Set(realManufacturers.map(m => m.country))].sort();
};

export const getRealUniqueCategories = () => {
  return [...new Set(realManufacturers.map(m => m.category))];
};
