<template>
  <div className="text-center min-h-[80vh]">
    Loading plugin ...
  </div>
</template>

<script setup>
import { onMounted} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PluginView from '@/views/PluginView.vue';
import gun from '@/services/gun';

const route = useRoute()
const router = useRouter()

onMounted(() => {
  const pluginPath = route.params.pluginPath;

  gun.get('plugins')
  .map()
  .once(plugin => {
    if (plugin && plugin.paths) {
      gun.get(plugin.paths)
      .map()
      .once(data => {
        if (data) {
          if (data.path === pluginPath[0]) {
            gun.get('plugins').map().off();
            gun.get(plugin.paths).map().off();

            router.replace(route.fullPath)
          }
        }
      });
    }
  });
});
</script>
