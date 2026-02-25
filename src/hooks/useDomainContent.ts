import { useTranslation } from 'react-i18next';
import { useManufacturerWithDevices, useDeviceWithManufacturer } from './useSupabaseData';
import { useMarkdownContent } from './useMarkdownContent';
import type { Manufacturer, Device } from './useSupabaseData';
import type { MarkdownContent } from '@/lib/markdown';

export const pickTextFields = (args: {
  dbTitle?: string;
  dbDescription?: string;
  fmTitle?: string;
  fmDescription?: string;
  excerpt?: string;
}) => {
  const title = args.dbTitle || args.fmTitle || '';
  const description = args.dbDescription ?? args.fmDescription ?? '';
  return { title, description, excerpt: args.excerpt };
};

export const useManufacturerDomainContent = (slug: string) => {
  const { i18n } = useTranslation();
  const lang = (i18n.language || 'en').split('-')[0];
  const { manufacturer, devices, loading, error } = useManufacturerWithDevices(slug || '');
  const { content } = useMarkdownContent('manufacturers', slug || '', lang);
  const title = (manufacturer?.name as string) || content?.frontMatter.title || '';
  const description =
    (manufacturer?.description as string) ??
    content?.frontMatter.description ??
    '';
  return {
    manufacturer: manufacturer as Manufacturer | undefined,
    devices: devices as Device[] | undefined,
    content: content as MarkdownContent | null,
    title,
    description,
    loading,
    error,
  };
};

export const useDeviceDomainContent = (slug: string) => {
  const { i18n } = useTranslation();
  const lang = (i18n.language || 'en').split('-')[0];
  const { device, manufacturer, loading, error } = useDeviceWithManufacturer(slug);
  const { content } = useMarkdownContent('devices', slug || '', lang);
  const title = (device?.name as string) || content?.frontMatter.title || '';
  const description =
    (device?.description as string) ??
    content?.frontMatter.description ??
    '';
  const mergedDevice = { ...(device as Device | undefined) } as Device | undefined;
  const fm = content?.frontMatter as unknown as { price?: { currency?: string; unit?: string; min?: number; max?: number } } | undefined;
  const price = fm?.price;
  if (mergedDevice && !mergedDevice.price_range_min && price) {
    const unit = String(price.unit || '').toLowerCase();
    const factor = unit.includes('万元') ? 10000 : 1;
    const min = typeof price.min === 'number' ? price.min * factor : undefined;
    const max = typeof price.max === 'number' ? price.max * factor : undefined;
    mergedDevice.price_range_min = typeof min === 'number' ? min : mergedDevice.price_range_min;
    mergedDevice.price_range_max = typeof max === 'number' ? max : mergedDevice.price_range_max;
    mergedDevice.price_currency = price.currency || mergedDevice.price_currency || 'CNY';
  }
  return {
    device: mergedDevice as Device | undefined,
    manufacturer: manufacturer as Manufacturer | undefined,
    content: content as MarkdownContent | null,
    title,
    description,
    loading,
    error,
  };
};

export const useComparisonDomainContent = (slug: string) => {
  const { i18n } = useTranslation();
  const lang = (i18n.language || 'en').split('-')[0];
  const { content } = useMarkdownContent('comparisons', slug || '', lang);
  const title = content?.frontMatter.title || '';
  const description = content?.frontMatter.description || '';
  const ogImage = content?.frontMatter.seo?.image || `/og/comparisons/${slug || ''}.png`;
  const keywords = content?.frontMatter.seo?.keywords || '';
  const canonical = content?.frontMatter.seo?.canonical || '';
  return {
    content: content as MarkdownContent | null,
    title,
    description,
    ogImage,
    keywords,
    canonical,
    loading: false,
    error: null,
  };
};
