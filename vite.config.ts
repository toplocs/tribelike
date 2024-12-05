import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import federation from '@originjs/vite-plugin-federation'

const url = 'localhost';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    federation({
        name: 'tribelike',
        remotes: {
            chat_plugin: `//${url}:3001/assets/plugin.js`,
            wiki_plugin: `//${url}:3002/assets/plugin.js`,
            event_plugin: `//${url}:3003/assets/plugin.js`,
        },
        shared: ['vue']
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    target: 'esnext',
    outDir: './server/src/views'
  },
})
