<template>
  <Suspense>
    <template #default>
      <component
        v-if="RemoteComponent"
        :is="RemoteComponent"
        :parentId="route.params?.id"
      />
    </template>
    <template #fallback>
      <div>Loading remote component...</div>
    </template>
  </Suspense>
</template>

//
<script setup lang="ts">
import {
  __federation_method_getRemote as getRemote,
  __federation_method_setRemote as setRemote,
  __federation_method_unwrapDefault as unwrapModule,
} from "virtual:__federation__";
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  name: String,
  url: String,
  component: String,
});
const route = useRoute();
const RemoteComponent = ref();


const loadPlugin = async () => {
  try {
    const plugin = {
      ...props,
      component: './WikiView',
    };
    console.log(plugin);

    setRemote(plugin.name, {
      url: () => Promise.resolve(plugin.url),
      format: 'esm',
      from: 'vite'
    });

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
