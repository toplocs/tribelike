<template>
  <Suspense>
    <template #default>
      <component
        v-if="RemoteComponent"
        :is="RemoteComponent"
        :parentId="route.params?.id"
        :query="route.query"
      />
      <div v-else class="h-[80vh] flex justify-center items-center">
       <i class="text-sm text-gray-400">
          {{plugin.name}} is not available
        </i>
      </div>
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
} from 'virtual:__federation__';
import { ref, inject, watchEffect, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  plugin: Object,
  component: String,
});
const route = useRoute();
const tab = inject('tab');
const RemoteComponent = ref();


const loadPlugin = async () => {
  try {
    const plugin = props.plugin;

    setRemote(plugin.name, {
      url: () => Promise.resolve(plugin.url),
      format: 'esm',
      from: 'vite'
    });

    const module = await getRemote(plugin.name, `./${props.component}`);
    const component = await unwrapModule(module);

    RemoteComponent.value = component;
  } catch (e) {
    console.error('Failed to load remote plugin:', e);
  }
};

watchEffect(async () => {
  await loadPlugin();
});

onMounted(async () => {
  await loadPlugin();
  tab.value = props.plugin?.name;
});
</script>
