<template>
  <div className="text-center min-h-[80vh]">
    Loading plugin ...
  </div>
</template>

<script setup>
import { watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PluginView from '@/views/PluginView.vue';
import { usePlugins } from '@/composables/pluginProvider';
import gun from '@/services/gun';

const route = useRoute();
const router = useRouter();
const { routes } = usePlugins();

watch(routes.value, (newValue) => {
  const pluginPath = route.params.pluginPath;
  const exists = newValue.find(x => x.path === pluginPath[0]);

  if (exists) router.replace(route.fullPath)
});

</script>
