import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export interface Stats {
  totalDevices: number;
  totalManufacturers: number;
  totalArticles: number;
  totalCountries: number;
}

export async function fetchStats(lang: string): Promise<Stats> {
  try {
    const [devices, manufacturers, articles, countries] = await Promise.all([
      supabase.from('devices').select('*', { count: 'exact', head: true }),
      supabase.from('manufacturers').select('*', { count: 'exact', head: true }),
      supabase.from('articles').select('*', { count: 'exact', head: true }),
      supabase.from('manufacturers').select('country'),
    ]);

    if (devices.error) throw devices.error;
    if (manufacturers.error) throw manufacturers.error;
    if (articles.error) throw articles.error;
    if (countries.error) throw countries.error;

    const uniqueCountries = new Set(countries.data?.map(m => m.country).filter(Boolean)).size;

    return {
      totalDevices: devices.count || 0,
      totalManufacturers: manufacturers.count || 0,
      totalArticles: articles.count || 0,
      totalCountries: uniqueCountries,
    };
  } catch (_err) {
    const map = import.meta.glob('/src/data/snapshots/**/content/stats/global.json');
    const p = `/src/data/snapshots/${lang}/content/stats/global.json`;
    const loader = map[p] || map['/src/data/snapshots/en/content/stats/global.json'];
    if (loader) {
      const mod = await loader();
      const data = (mod as { default?: unknown })?.default ?? mod;
      const m = (data as { metrics?: Partial<Stats> }).metrics || {};
      return {
        totalDevices: Number(m.totalDevices ?? 0),
        totalManufacturers: Number(m.totalManufacturers ?? 0),
        totalArticles: Number(m.totalArticles ?? 0),
        totalCountries: Number(m.totalCountries ?? 0),
      };
    }
    return {
      totalDevices: 0,
      totalManufacturers: 0,
      totalArticles: 0,
      totalCountries: 0,
    };
  }
}

export const useStats = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const q = useQuery({
    queryKey: ['stats', 'global', lang],
    queryFn: () => fetchStats(lang),
    staleTime: 5 * 60_000,
  });

  const data: Stats = q.data || {
    totalDevices: 0,
    totalManufacturers: 0,
    totalArticles: 0,
    totalCountries: 0,
  };
  return { stats: data, loading: q.isLoading, error: (q.error as Error) || null };
};
