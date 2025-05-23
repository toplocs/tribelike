import { ref, inject, provide, watch, onMounted, onUnmounted } from 'vue';
import gun from '@/services/gun';

export function pluginProvider() {
  const plugins = ref<Plugin[]>([]);
  const routes = ref<Route[]>([]);
  const slots = ref<Slot[]>([]);

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
          console.log(data);
          if (data) {
            slots.value?.push(data);
          }
        });
      }
    });
  });

  onUnmounted(() => {
    plugins.value = [];
    routes.value = [];
    slots.value = [];
  });

  provide('plugin', {
    plugins,
    routes,
    slots,
  });
}

export function usePlugins() {
  const data = inject('plugin');

  if (!data) {
    throw new Error('Composable must have an plugin provider.');
  }

  return data;
}