import { useEffect, useState } from 'react';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { MarkdownContent, markdownContentManager } from '../lib/markdown';
declare global {
  interface Window {
    __TANSTACK_ROUTER_CONTEXT__?: {
      markdownContent?: {
        category: string;
        slug: string;
        locale: string;
        content?: MarkdownContent;
      };
    };
  }
}

export const useMarkdownContent = (category: string, slug: string, locale: string = 'en') => {
  const { data } = useSuspenseQuery({
    queryKey: ['markdown', category, slug, locale],
    queryFn: async () => markdownContentManager.getContent(category, slug, locale),
  });
  return { content: data as MarkdownContent | null, loading: false, error: null };
};

export const useMarkdownContentList = (category: string, locale: string = 'en') => {
  const { data } = useSuspenseQuery({
    queryKey: ['markdown', category, 'list', locale],
    queryFn: async () => markdownContentManager.getContentList(category, locale),
    enabled: Boolean(category),
  });
  return {
    contents: (data || []) as MarkdownContent[],
    loading: false,
    error: null,
  };
};

export const useMarkdownSearch = (query: string, category?: string, locale: string = 'en') => {
  const [debounced, setDebounced] = useState(query);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(t);
  }, [query]);
  const enabled = debounced.trim().length > 0;
  const { data, isFetching, error } = useQuery({
    queryKey: ['markdown', 'search', debounced, category || 'all', locale],
    queryFn: async () => markdownContentManager.searchContent(debounced, category, locale),
    enabled,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
  return {
    results: (enabled ? (data || []) : []) as MarkdownContent[],
    loading: isFetching,
    error: error ? (error instanceof Error ? error.message : String(error)) : null,
  };
};
