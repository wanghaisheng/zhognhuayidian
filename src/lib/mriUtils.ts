import { generateDeviceSlug } from '../utils/urlStructure';
import type { Device } from '@/types/device';
import { loadDevices, realDevices } from './deviceUtils';

export const realMRIDevices: Device[] = [];

export const loadMRIDevices = async (locale: string = 'en') => {
  await loadDevices(locale);
  const mapped = realDevices
    .filter(d => d.type === 'mri')
    .map(d => ({ ...d, slug: d.slug ?? generateDeviceSlug(d.name) }));
  realMRIDevices.splice(0, realMRIDevices.length, ...mapped);
  return realMRIDevices;
};

export const getRealMRIDevicesByManufacturer = (manufacturerId: string) => {
  return realMRIDevices.filter(d => d.manufacturerId === manufacturerId);
};

export const getRealMRIDevicesByFieldStrength = (fieldStrength: number) => {
  return realMRIDevices.filter(d => d.fieldStrength === fieldStrength);
};

export const getRealMRIDevicesByCategory = (category: string) => {
  return realMRIDevices.filter(d => d.category === category);
};

export const getMRIFieldStrengthRanges = () => {
  return {
    'low-field': '0.2T - 0.5T',
    'mid-field': '0.5T - 1.0T',
    'high-field': '1.5T - 3.0T',
    'ultra-high-field': '7.0T+'
  };
};

export const getMRIPriceRanges = () => {
  return {
    'low-field': '300-600万元',
    'mid-field': '600-1000万元',
    'high-field': '1000-2500万元',
    'ultra-high-field': '8000万元以上'
  };
};
