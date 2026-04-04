import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
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
        manualChunks: {
          react_vendor: ['react', 'react-dom', 'react-router-dom'],
          motion_vendor: ['framer-motion'],
          md_vendor: ['react-markdown'],
          supabase_vendor: ['@supabase/supabase-js'],
          lucide_vendor: ['lucide-react'],
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        secure: false,
        timeout: 120_000,
        proxyTimeout: 120_000,
      }
    }
  }
})