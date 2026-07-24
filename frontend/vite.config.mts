import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa"

const CORAL = "#ff97b2"

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      manifestFilename: "site.webmanifest",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "icons/*.png"],
      manifest: {
        id: "/",
        name: "TechNotesGR | Πληροφορική Πανελλήνιες",
        short_name: "TechNotesGR",
        description:
          "Δωρεάν προετοιμασία Πανελληνίων Πληροφορικής: quiz, flashcards, ΑΕΠΠ, δομημένος προγραμματισμός και ασκήσεις για Γ' Λυκείου.",
        start_url: "/?source=pwa",
        scope: "/",
        display: "standalone",
        display_override: ["window-controls-overlay", "standalone"],
        orientation: "portrait-primary",
        background_color: "#fff5f8",
        theme_color: CORAL,
        lang: "el",
        dir: "ltr",
        categories: ["education", "productivity"],
        icons: [
          { src: "/icons/icon-72.png", sizes: "72x72", type: "image/png", purpose: "any" },
          { src: "/icons/icon-96.png", sizes: "96x96", type: "image/png", purpose: "any" },
          { src: "/icons/icon-128.png", sizes: "128x128", type: "image/png", purpose: "any" },
          { src: "/icons/icon-144.png", sizes: "144x144", type: "image/png", purpose: "any" },
          { src: "/icons/icon-152.png", sizes: "152x152", type: "image/png", purpose: "any" },
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/icons/icon-384.png", sizes: "384x384", type: "image/png", purpose: "any" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/icons/maskable-icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
          { src: "/icons/maskable-icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ["**/*.{js,css,html,woff2}"],
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            // Quiz/flashcard/category GET data — show cached content instantly if offline,
            // but always try the network first so students get fresh questions when online.
            urlPattern: ({ url, request }) =>
              request.method === "GET" &&
              /\/api\/(quiz|flashcards|categories)(\/|$)/.test(url.pathname),
            handler: "NetworkFirst",
            options: {
              cacheName: "api-study-data",
              networkTimeoutSeconds: 4,
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "images",
              expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/api/"),
            handler: "NetworkOnly",
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'build',
    target: 'es2022',
    sourcemap: false,
    cssCodeSplit: true,
    cssMinify: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 650,
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalized = id.split(path.sep).join('/');
          if (id.includes('node_modules')) {
            if (/\/node_modules\/(react|react-dom|react-router-dom)\//.test(normalized)) {
              return 'react_vendor';
            }
            if (normalized.includes('/node_modules/framer-motion/')) {
              return 'motion_vendor';
            }
            if (normalized.includes('/node_modules/react-markdown/')) {
              return 'md_vendor';
            }
            if (normalized.includes('/node_modules/lucide-react/')) {
              return 'lucide_vendor';
            }
            if (
              normalized.includes('/node_modules/react-pdf/') ||
              normalized.includes('/node_modules/pdfjs-dist/')
            ) {
              return 'pdf_vendor';
            }
          }

          if (
            normalized.includes('/src/data/schools.ts') ||
            normalized.includes('/src/data/schoolCoefficients2026.ts')
          ) {
            return 'school_core_data';
          }
          if (normalized.includes('/src/data/schoolCurricula')) {
            return 'school_curricula_data';
          }
          if (
            (normalized.includes('/src/data/') && normalized.endsWith('Careers.ts'))
          ) {
            return 'school_careers_data';
          }
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        // 127.0.0.1, not localhost — Node can resolve "localhost" to the IPv6 ::1
        // loopback, which uvicorn (bound to 0.0.0.0, IPv4-only) refuses.
        target: 'http://127.0.0.1:8001',
        changeOrigin: true,
        secure: false,
        timeout: 120_000,
        proxyTimeout: 120_000,
      }
    }
  }
})
