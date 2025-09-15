import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: false,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    },
    chunkSizeWarningLimit: 2000
  },
  server: {
    port: 3000,
    host: true
  }
});
