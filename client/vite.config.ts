import axios from 'axios';
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import tailwindcss from "@tailwindcss/vite"
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import federation from '@originjs/vite-plugin-federation'
import gun from './src/services/gun'

const url = 'http://localhost';

/*async function fetchPluginList() {
  return new Promise((resolve) => {
    gun.get('plugins').on((data) => {
      resolve(data || {});
    });
  });
}*/

async function fetchPluginList() {
  try {
    const response = await axios.get(`${url}:3000/api/v2/plugins`);
    console.log(response.data)
    
    return response.data;
  } catch (error) {
    console.error('Error fetching plugin list:', error);
    throw error;
  }
}


async function createFederationRemotes() {
  const pluginList = await fetchPluginList() || [];

  const remotes = {};
  Object.entries(pluginList).forEach(([pluginName, pluginUrl]) => {
    remotes[pluginName] = `${url}:3002/assets/plugin.js`;
  });

  //return remotes;

  return {
    chat_plugin: `${url}:3001/assets/plugin.js`,
    //wiki_plugin: `${url}:3002/assets/plugin.js`,
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
      shared: ['vue'],
      remotes: [],
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
