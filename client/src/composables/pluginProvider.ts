import { ref, inject, provide, watch, onMounted, onUnmounted } from 'vue';
import gun from '@/services/gun';

export function pluginProvider() {
  const plugins = ref<Plugin[]>([]);
  const routes = ref<Route[]>([]);
  const slots = ref<Slot[]>([]);
  const tabs = ref<Tab[]>([]);

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
            const exists = slots.value.some(x => x.slot === data.slot);
            const slot = { plugin: plugin, ...data };
            if (!exists) slots.value?.push(slot);
          }
        });

        gun.get(plugin.tabs)
        .map()
        .once(data => {
          if (data && data.value) {
            const exists = tabs.value.some(x => x.value === data.value);
            if (!exists) tabs.value?.push(data);
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
  });
}

export function usePlugins() {
  const data = inject('plugin');

  if (!data) {
    throw new Error('Composable must have an plugin provider.');
  }

  return data;
}