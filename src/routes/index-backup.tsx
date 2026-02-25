import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { buildPageHead } from '@/utils/seo';
import i18n from '@/lib/i18n';
import { Suspense, lazy } from 'react';
import { PageLoader } from '@/components/molecules/LazyComponents';
import { getLanguageFromPath } from '@/utils/multilingualRoutes';
import { fetchStats } from '@/hooks/useStats';

export const Route = createFileRoute('/index-backup')({
  component: () => (
    <div style={{ 
      padding: '50px', 
      background: 'blue', 
      color: 'white', 
      fontSize: '24px',
      fontWeight: 'bold',
      minHeight: '200vh',
      position: 'relative',
      zIndex: 99999,
      marginTop: '100px'
    }}>
      <h1>测试页面</h1>
      <p>如果你能看到这个蓝色背景的页面，说明路由工作正常</p>
      <p>当前时间: {new Date().toLocaleString()}</p>
      <div style={{ 
        background: 'yellow', 
        color: 'black', 
        padding: '20px',
        margin: '20px 0',
        border: '5px solid red'
      }}>
        这是一个黄色方块，应该非常明显
      </div>
    </div>
  ),
  head: () => buildPageHead('/', i18n.language),
  loader: async ({ context, location }) => {
    const { queryClient } = context as { queryClient: import('@tanstack/react-query').QueryClient };
    const locale = getLanguageFromPath((location as { pathname?: string } | undefined)?.pathname || '/') || 'en';
    await queryClient.ensureQueryData({
      queryKey: ['stats', 'global', locale],
      queryFn: () => fetchStats(locale),
      staleTime: 5 * 60_000,
    });
  },
});

// 中华医典特色路由
export const LibraryRoute = createFileRoute('/library')({
  component: () => import('./library').then(mod => <mod.default />)
});

export const ResearchRoute = createFileRoute('/research')({
  component: () => import('./research').then(mod => <mod.default />)
});

export const SearchRoute = createFileRoute('/search')({
  component: () => import('./search').then(mod => <mod.default />)
});
