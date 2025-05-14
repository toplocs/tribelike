import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import tailwindcss from "@tailwindcss/vite"
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import federation from '@originjs/vite-plugin-federation'
import gun from './src/services/gun'

const url = 'https://toplocs.com';

/*async function fetchPluginList() {
  return new Promise((resolve) => {
    gun.get('plugins').once((data) => {
      resolve(data || {});
    });
  });
}*/

async function fetchPluginList() {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate fetching plugin list data
      const mockData = {
        chat_plugin: 'https://example.com/chat_plugin.js',
        wiki_plugin: 'https://example.com/wiki_plugin.js',
        event_plugin: 'https://example.com/event_plugin.js',
      };

      // Resolve the promise with the mock data
      resolve(mockData);
    }, 2000); // 2 seconds delay to mimic network request
  });
}


async function createFederationRemotes() {
  const pluginList = await fetchPluginList() || [];

  const remotes = {};
  Object.entries(pluginList).forEach(([pluginName, pluginUrl]) => {
    remotes[pluginName] = `${url}:3002/assets/plugin.js`;
  });

  //return remotes;

  return {
    chat_plugin: {
      external: `
        new Promise((resolve) => {
          gun.get('plugins')
          .get('chat_plugin')
          .once(data => {
            console.log(data);
            resolve(data);
          })
        })
      `,
      externalType: 'promise'
    },
    wiki_plugin: `${url}:3002/assets/plugin.js`,
    event_plugin: `${url}:3003/assets/plugin.js`,
  };
}

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    tailwindcss(),
    federation({
      name: 'tribelike',
      remotes: await createFederationRemotes(),
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
  /*server: {
    watch: {
      ignored: ['**']
    }
  }*/
});
