import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: '/template-web-game/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'],
        },
      },
    },
  },
});
