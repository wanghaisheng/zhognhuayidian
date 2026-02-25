import { defineConfig, ViteDevServer, Connect } from "vite";
import react from "@vitejs/plugin-react-swc";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";
import type { IncomingMessage, ServerResponse } from "http";

// https://vitejs.dev/config/
export default defineConfig(({ mode, isSsrBuild }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: ['..'] // Allow serving files from one level up to include content directory if needed
    }
  },
  publicDir: 'public', // Default is 'public'
  ssr: {
    noExternal: [],
    optimizeDeps: {
      include: ['@tanstack/react-router/ssr/server']
    }
  },
  define: {
    'process.env.STREAMING_SSR': JSON.stringify(process.env.STREAMING_SSR || '0'),
  },
  build: isSsrBuild ? {
    ssr: true,
    outDir: 'dist/server',
    emitAssets: true,
    copyPublicDir: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/entry-server.tsx'),
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  } : {
    outDir: 'dist/client',
    emitAssets: true,
    copyPublicDir: true,
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        manualChunks: {
          react: ["react", "react-dom"],
          router: ["@tanstack/react-router"],
          supabase: ["@supabase/supabase-js"],
          charts: ["recharts"],
          radix: [
            "@radix-ui/react-dialog",
            "@radix-ui/react-tabs",
            "@radix-ui/react-toast",
            "@radix-ui/react-select",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-dropdown-menu"
          ]
        }
      }
    }
  },
  plugins: [
    TanStackRouterVite({
      autoCodeSplitting: true
    }),
    react(),
    mode === 'development' &&
    componentTagger(),
    {
      name: 'serve-root-content',
      configureServer(server: ViteDevServer) {
        server.middlewares.use('/content', (
          req: IncomingMessage, 
          res: ServerResponse, 
          next: Connect.NextFunction
        ) => {
          const url = req.url;
          if (!url) return next();
          
          // Avoid directory traversal
          const safeUrl = path.normalize(url).replace(/^(\.\.[/\\])+/, '');
          const filePath = path.join(__dirname, 'content', safeUrl);
          
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            // Simple mime type handling
            const ext = path.extname(filePath).toLowerCase();
            let contentType = 'text/plain';
            if (ext === '.md') contentType = 'text/markdown';
            if (ext === '.json') contentType = 'application/json';
            if (ext === '.png') contentType = 'image/png';
            if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
            
            res.setHeader('Content-Type', contentType);
            const stream = fs.createReadStream(filePath);
            stream.pipe(res);
            return;
          }
          next();
        });
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
