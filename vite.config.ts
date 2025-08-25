import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      port: 8081,
    },
  },

  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    
    // PWA temporairement désactivée pour éviter les connexions Google
    // ...(mode === 'production' ? [VitePWA({
    //   registerType: 'autoUpdate',
    //   workbox: {
    //     maximumFileSizeToCacheInBytes: 30 * 1024 * 1024,
    //     globIgnores: ['**/tesseract-lang/**'],
    //     // Désactiver Google Analytics pour éviter les connexions externes
    //     skipWaiting: true,
    //     clientsClaim: true,
    //     // Exclure les modules Google
    //     exclude: [/google-analytics/, /firestore/, /gpt-engineer/],
    //     // Configuration sans Google
    //     runtimeCaching: []
    //   },
    //   manifest: {
    //     name: 'Dalil.dz - Plateforme Juridique Algérienne',
    //     short_name: 'Dalil.dz',
    //     description: 'Plateforme algérienne de veille juridique et réglementaire avec support RTL',
    //     theme_color: '#40915d',
    //     background_color: '#ffffff',
    //     display: 'standalone',
    //     orientation: 'portrait',
    //     start_url: '/',
    //     scope: '/',
    //     lang: 'fr',
    //     categories: ['legal', 'government', 'reference'],
    //     icons: [
    //       {
    //         src: '/icon-192.png',
    //         sizes: '192x192',
    //         type: 'image/png',
    //         purpose: 'any maskable'
    //       },
    //       {
    //         src: '/icon-512.png',
    //         sizes: '512x512',
    //         type: 'image/png',
    //         purpose: 'any maskable'
    //       }
    //     ]
    //   }
    // })] : [])
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "/@vite/client": path.resolve(__dirname, "@vite/client.js"),
      "@vite/client": path.resolve(__dirname, "@vite/client.js"),
    },
    dedupe: ["react", "react-dom"]
  },

  cacheDir: `.vite`,
  
  optimizeDeps: {
    force: true,
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      '@tanstack/react-query'
    ],
    exclude: ['@huggingface/transformers', 'react-day-picker', 'vite', '@vite/client']
  },

  build: {
    target: 'es2020',
    sourcemap: mode === 'development',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const afterNm = id.split('node_modules/')[1] || '';
            const parts = afterNm.split('/');
            const isScoped = parts[0]?.startsWith('@');
            const pkg = isScoped ? `${parts[0]}/${parts[1]}` : parts[0];
            if (!pkg) return undefined;
            if (pkg === 'react' || pkg === 'react-dom') return 'vendor_react';
            if (pkg === 'react-router-dom') return 'vendor_router';
            if (pkg === 'tesseract.js') return 'vendor_tesseract';
            return `vendor_${pkg.replace(/[@\\/]/g, '_')}`;
          }
        }
      }
    },
    cssCodeSplit: true,
    chunkSizeWarningLimit: 5000
  },
  
  // Configuration pour Tesseract.js et autres variables globales
  define: {
    __TESSERACT_WORKER_PATH__: JSON.stringify('/tesseract-worker.js'),
    __TESSERACT_CORE_PATH__: JSON.stringify('/tesseract-core.wasm.js'),
    __TESSERACT_LANG_PATH__: JSON.stringify('/tesseract-lang'),
    __WS_TOKEN__: JSON.stringify(''),
    __DEFINES__: '{}',
    global: 'globalThis',
    'process.env.NODE_ENV': JSON.stringify(mode === 'development' ? 'development' : 'production'),
    'import.meta.env.DEV': mode === 'development',
    'import.meta.env.PROD': mode === 'production'
  },

  esbuild: {
    target: 'es2020',
    keepNames: true
  }
}));