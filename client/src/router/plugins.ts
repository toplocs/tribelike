import { defineAsyncComponent } from 'vue';
import PluginView from '@/views/PluginView.vue';
import gun from '@/services/gun';

// Validate route path pattern to prevent path-to-regexp errors
const isValidRoutePath = (path: any): boolean => {
  if (!path || typeof path !== 'string') return false;
  // Reject URLs (should be route patterns like /path or /path/:id)
  if (path.startsWith('http://') || path.startsWith('https://')) return false;
  // Reject paths with invalid characters for route patterns
  if (path.includes('?') || path.includes('#')) return false;
  return true;
};

export const addPluginRoutes = (router: any) => {
  // Defer plugin route loading to avoid startup sync load
  // Load plugin routes when first accessed via lazy-loading
  const loadPluginRoutesDeferred = async () => {
    gun.get('plugins')
    .map()
    .once(plugin => {
      if (!plugin || !plugin.paths) return;

      gun.get(plugin.paths)
      .map()
      .once(data => {
        if (!data || !data.path) return;

        // Validate route path before adding
        if (!isValidRoutePath(data.path)) {
          console.warn(`Invalid plugin route path: "${data.path}" (from plugin: ${plugin.id})`);
          return;
        }

        try {
          const route = {
            path: data.path,
            name: data.component || `plugin_${plugin.id}`,
            component: PluginView,
            props: {
              plugin: plugin,
              component: data.component,
            },
          };
          router.addRoute('sphereDetail', route);
        } catch (error) {
          console.error(`Failed to add plugin route: ${data.path}`, error);
          // Log the problematic data for debugging
          console.error('Problematic plugin data:', { plugin, data });
        }
      });
    });
  };

  // Load plugin routes after a short delay to avoid startup sync overload
  setTimeout(loadPluginRoutesDeferred, 2000);
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
