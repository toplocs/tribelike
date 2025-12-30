import { ref, inject, provide, watch, onMounted, onUnmounted } from 'vue';
import CryptoJS from 'crypto-js';
import gun from '@/services/gun';
import { waitForGunReady } from '@/utils/gunReady';

export function pluginProvider() {
  const plugins = ref<Plugin[]>([]);
  const routes = ref<Route[]>([]);
  const slots = ref<Slot[]>([]);
  const tabs = ref<Tab[]>([]);
  
  const createPlugin = async (config, url) => {
    const id = crypto.randomUUID();
    const hash = CryptoJS.SHA256(config.author).toString(CryptoJS.enc.Hex);

    const plugin = {
      id: id,
      name: config.name,
      author: config.author,
      description: config.description,
      url: url,
      version: config.version,
      hash: hash
    };

    const node = gun.get(`plugin/${id}`).put(plugin);

    config.slots?.forEach(slot => node.get('slots').set(slot));
    config.paths?.forEach(path => node.get('paths').set(path));
    config.tabs?.forEach(tab => node.get('tabs').set(tab));


    gun.user().get('plugins').set(node);
    gun.get('plugins').set(node);

    return node;
  }

  const removePlugin = async (pluginId: string) => {
    const node = gun.get(`plugin/${pluginId}`);

    node.get('paths').map().once((path, key) => {
      node.get('paths').get(key).put(null);
    });

    node.get('slots').map().once((slot, key) => {
      node.get('slots').get(key).put(null);
    });

    node.get('tabs').map().once((tab, key) => {
      node.get('tabs').get(key).put(null);
    });

    gun.user().get('plugins').unset(node);
    gun.get('plugins').get(pluginId).unset(node);

    node.put(null);
  }


  const loadPluginData = (plugin: Plugin) => {
    // Defer loading of nested plugin data - only load when accessed
    gun.get(`plugin/${plugin.id}`)
    .get('paths')
    .map()
    .once(data => {
      if (data) {
        routes.value?.push(data);
      }
    });

    gun.get(`plugin/${plugin.id}`)
    .get('slots')
    .map()
    .once(data => {
      if (data) {
        const slot = { plugin: plugin, ...data };
        slots.value?.push(slot);
      }
    });

    gun.get(`plugin/${plugin.id}`)
    .get('tabs')
    .map()
    .once(data => {
      if (data) {
        tabs.value?.push(data);
      }
    });
  }

  onMounted(async () => {
    // Wait for Gun to be ready before loading plugins
    await waitForGunReady();

    gun.get('plugins')
    .map()
    .once(plugin => {
      if (plugin) {
        plugins.value?.push(plugin);
        // Defer loading nested data
        loadPluginData(plugin);
      }
    });
  });

  onUnmounted(() => {
    plugins.value = [];
    routes.value = [];
    slots.value = [];
    tabs.value = [];
  });

  provide('plugin', {
    plugins,
    routes,
    slots,
    tabs,
    createPlugin,
    removePlugin,
  });
}

export function usePlugins() {
  const data = inject('plugin');

  if (!data) {
    throw new Error('Composable must have an plugin provider.');
  }

  return data;
}