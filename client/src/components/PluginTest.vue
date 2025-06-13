<template>
  <Suspense>
    <template #default>
      <component :is="RemoteComponent" v-if="RemoteComponent" />
    </template>
    <template #fallback>
      <div>Loading remote component...</div>
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import {
  __federation_method_getRemote as getRemote,
  __federation_method_setRemote as setRemote,
  __federation_method_unwrapDefault as unwrapModule,
} from "virtual:__federation__";

import { ref, onMounted } from 'vue';

const RemoteComponent = ref(); // holds the dynamically loaded component

const loadPlugin = async () => {
  try {
    const plugin = {
      name: 'wiki-plugin',
      url: 'http://localhost:3002/assets/plugin.js',
      component: './WikiView' // <-- remote exposed component
    };

    // Register remote plugin with federation
    setRemote(plugin.name, {
      url: () => Promise.resolve(plugin.url),
      format: 'esm',
      from: 'vite'
    });

    // Get and unwrap the remote component
    const module = await getRemote(plugin.name, plugin.component);
    const component = await unwrapModule(module);

    RemoteComponent.value = component;
  } catch (e) {
    console.error('Failed to load remote plugin:', e);
  }
};

onMounted(() => {
  loadPlugin();
});
</script>
