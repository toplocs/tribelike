<template>
  <Suspense>
    <template #default>
      <component
        v-if="RemoteComponent"
        :is="RemoteComponent"
        :parentId="route.params?.id"
        :query="route.query"
      />
      <div v-else>
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
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  plugin: Object,
  position: String,
});
const route = useRoute();
const RemoteComponent = ref();

const loadPlugin = async () => {
  try {
    const plugin = props.plugin;
    if (plugin) {
      setRemote(plugin.name, {
        url: () => Promise.resolve(plugin.url),
        format: 'esm',
        from: 'vite'
      });

      const module = await getRemote(plugin.name, `./${props.position}`);
      const component = await unwrapModule(module);

      RemoteComponent.value = component;
    }
  } catch (e) {
    console.error('Failed to load remote plugin:', e);

  }
};

onMounted(async () => {
  await loadPlugin();
});
</script>
