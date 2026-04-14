import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [
    react(),
    tailwind(),
    mdx(),
  ],
  // 其他配置
  site: 'https://chinactscanner.org',
  compressHTML: true,
  build: {
    format: 'directory',
  },
  vite: {
    ssr: {
      external: ['sql.js'],
    },
    build: {
      rollupOptions: {
        external: ['sql.js'],
      },
    },
  },
});
