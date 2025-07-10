import { ref, inject, provide, watch, onMounted, onUnmounted } from 'vue';
import CryptoJS from 'crypto-js';
import gun from '@/services/gun';

export function pluginProvider() {
  const plugins = ref<Plugin[]>([]);
  const routes = ref<Route[]>([]);
  const slots = ref<Slot[]>([]);
  const tabs = ref<Tab[]>([]);

  const createPlugin = async (config: Object, url: string) => {
    const id = crypto.randomUUID(); //content id über die url
    const hash = CryptoJS.SHA256(email).toString(CryptoJS.enc.Hex);
    const plugin = {
      id: id,
      name: config.name,
      url: url,
      pubkey: config.pubkey,
    }

    const node = gun.get(`plugin/${id}`).put(plugin);
    config.paths.forEach(path => {
      node.get('paths').set(path);
    });
    config.slots.forEach(slot => {
      node.get('slots').set(slot);
    });
    config.tabs.forEach(tab => {
      node.get('tabs').set(tab);
    });

    gun.user().get('plugins').set(node);
    gun.get('plugins').get(id).set(node);

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


  onMounted(() => {
    gun.get('plugins')
    .map()
    .once(plugin => {
      if (plugin) {
        plugins.value?.push(plugin);
        gun.get(plugin.paths)
        .map()
        .once(data => {
          if (data) {
            routes.value?.push(data);
          }
        });

        gun.get(plugin.slots)
        .map()
        .once(data => {
          if (data) {
            const slot = { plugin: plugin, ...data };
            slots.value?.push(slot);
          }
        });

        gun.get(plugin.tabs)
        .map()
        .once(data => {
          if (data) {
            tabs.value?.push(data);
          }
        });
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