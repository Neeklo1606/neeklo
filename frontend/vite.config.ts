import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Все ассеты и чанки в билде будут с путём /frontend/assets/... (чтобы не конфликтовать с public/assets/)
  base: '/frontend/',
  server: {
    host: "::",
    port: 8080,
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 8080,
      clientPort: 8080,
    },
    // Отключаем автоматическое обновление для статических файлов
    watch: {
      ignored: ['**/node_modules/**', '**/.git/**'],
    },
    proxy: {
      '/admin': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        ws: false, // Отключаем WebSocket для /admin (это HTML страница)
        rewrite: (path) => path,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Сохраняем оригинальный host для правильной работы Laravel
            proxyReq.setHeader('Host', '127.0.0.1:8000');
            // Убеждаемся, что это обычный HTTP запрос
            proxyReq.removeHeader('upgrade');
            proxyReq.removeHeader('connection');
            proxyReq.setHeader('Connection', 'close');
          });
          proxy.on('error', (err, req, res) => {
            // Игнорируем ошибки WebSocket для /admin
            if (req.url?.includes('/admin')) {
              return;
            }
          });
        },
      },
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        ws: false, // API не использует WebSocket
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Убеждаемся, что это обычный HTTP запрос
            proxyReq.removeHeader('upgrade');
            proxyReq.removeHeader('connection');
          });
        },
      },
      '/storage': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        ws: false, // Статические файлы, WebSocket не нужен
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            proxyReq.removeHeader('upgrade');
            proxyReq.removeHeader('connection');
            proxyReq.setHeader('Connection', 'close');
          });
        },
      },
      '/build': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        ws: false, // Статические файлы, WebSocket не нужен
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Убеждаемся, что это обычный HTTP запрос
            proxyReq.removeHeader('upgrade');
            proxyReq.removeHeader('connection');
            proxyReq.setHeader('Connection', 'close');
          });
        },
      },
      '/favicon.ico': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        ws: false,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Убеждаемся, что это обычный HTTP запрос, не WebSocket
            proxyReq.removeHeader('upgrade');
            proxyReq.removeHeader('connection');
            proxyReq.setHeader('Connection', 'close');
          });
          proxy.on('error', (err, req, res) => {
            // Игнорируем ошибки WebSocket для статических файлов
            if (req.url?.includes('favicon.ico')) {
              return;
            }
          });
        },
      },
      '/manifest.webmanifest': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        ws: false,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            proxyReq.removeHeader('upgrade');
            proxyReq.removeHeader('connection');
            proxyReq.setHeader('Connection', 'close');
          });
        },
      },
      // Проксирование для Laravel Vite ресурсов (только для админки, не для React)
      // Убираем прокси для /resources и /node_modules - они не нужны для React приложения
      // React Vite сам обрабатывает свои зависимости через /node_modules/.vite/deps/
    },
  },
  plugins: [
    react(), 
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'robots.txt'],
      injectManifest: false,
      strategies: 'generateSW',
      manifest: {
        name: 'Neeklo Studio — Digital-студия',
        short_name: 'Neeklo',
        description: 'AI-разработка, веб-продукты и автоматизация для вашего бизнеса',
        theme_color: '#0a0a0a',
        background_color: '#0a0a0a',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        lang: 'ru',
        categories: ['business', 'productivity'],
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/, /^\/supabase/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 7
              }
            }
          },
          {
            urlPattern: /\.(?:mp4|webm)$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'videos-cache',
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 3
              }
            }
          }
        ],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: '../public/frontend',
    emptyOutDir: true,
    minify: 'esbuild',
    target: 'es2020',
    rollupOptions: {
      output: {
        // Add hash to filenames for cache busting
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'motion-vendor': ['framer-motion'],
          'ui-vendor': ['lucide-react', '@radix-ui/react-slot', '@radix-ui/react-tooltip'],
          'query-vendor': ['@tanstack/react-query'],
          // Group product pages together for faster loading
          'products': [
            './src/pages/products/Website.tsx',
            './src/pages/products/TelegramBot.tsx', 
            './src/pages/products/AIAgent.tsx',
            './src/pages/products/AIVideo.tsx',
            './src/pages/products/MiniApp.tsx',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 500,
    cssCodeSplit: true,
    sourcemap: false,
    assetsInlineLimit: 4096,
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      'framer-motion',
      '@tanstack/react-query',
      'lucide-react',
    ],
  },
  css: {
    devSourcemap: false,
  },
}));
