import { defineAsyncComponent } from 'vue';
import PluginView from '@/views/PluginView.vue';
import gun from '@/services/gun'

export const getPluginRoutes = async () => {
  const gunData = await new Promise((resolve) => {
    gun.get('plugins').once((pluginRefs) => {
      if (!pluginRefs) return resolve([]);

      const keys = Object.keys(pluginRefs);
      const results: any[] = [];

      let remaining = keys.length;
      if (remaining === 0) return resolve(results);

      keys.forEach((key) => {
        gun.get(key).once((pluginData) => {
          if (pluginData) {
            results.push({ soul: key, ...pluginData });
          }
          remaining--;
          if (remaining === 0) resolve(results);
        });
      });
    });
  });

  const pluginRoutes = Object.entries(gunData || {}).map(([key, plugin]) => ({
    path: /*plugin.path ||*/ 'wiki', //update accordingly
    name: `${plugin.name}View`,
    component: PluginView,
    props: plugin,
    /*component: () => defineAsyncComponent({
      loader: () => import('wiki_plugin/WikiView'),
      errorComponent: ErrorView,
    })*/
  }));

  return pluginRoutes;
}

