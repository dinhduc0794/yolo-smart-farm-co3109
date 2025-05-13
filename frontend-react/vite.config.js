import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Cấu hình Vite
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    host: true, 
    strictPort: true,
    port: 5173, 
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
