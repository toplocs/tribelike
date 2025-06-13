import { defineAsyncComponent } from 'vue';
import PluginView from '@/views/PluginView.vue';
import gun from '@/services/gun';

export const addPluginRoutes = (router: any) => { //sync loading
  gun.get('plugins')
  .map()
  .once(plugin => {
    if (plugin && plugin.paths) {
      gun.get(plugin.paths)
      .map()
      .once(data => {
        if (data && data.path) {
          const route = {
            path: data.path,
            name: data.component,
            component: PluginView,
            props: {
              plugin: plugin,
              component: data.component,
            },
          }
          router.addRoute('sphereDetail', route);
        }
      });
    }
  });
}

/*export const getPluginRoutes = async () => { //async loading
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
    path: plugin.path,
    name: `${plugin.name}View`,
    component: PluginView,
    props: plugin,
    component: () => defineAsyncComponent({
      loader: () => import('wiki_plugin/WikiView'),
      errorComponent: ErrorView,
    })
  }));

  return pluginRoutes;
}
*/
