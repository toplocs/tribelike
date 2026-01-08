import axios from 'axios';
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import tailwindcss from "@tailwindcss/vite"
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  base: process.env.BASE_PATH || '/',
  envDir: '..', // Read .env from root directory (monorepo setup)
  plugins: [
    vue(),
    vueJsx(),
    tailwindcss(),
    federation({
      name: 'tribelike',
      shared: ['vue', 'tailwindcss'],
      remotes: {
        test: { //DO NOT REMOVE
          external: '',
          format: 'var',
        },
      },
    } as any)
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    middlewareMode: false,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  },
  build: {
    target: 'esnext',
    outDir: '../server/src/views'
  },
});
