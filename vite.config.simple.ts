import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Simple Vite config for deployment
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2015',
    rollupOptions: {
      external: [],
      output: {
        format: 'es'
      }
    }
  }
});
