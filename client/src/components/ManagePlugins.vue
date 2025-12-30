<template>
  <h2 class="text-xl font-semibold mb-4">Manage Plugins:</h2>

  <ul v-if="plugins.length" class="mb-6 space-y-2">
    <PluginItem
      v-for="plugin in plugins"
      :key="plugin.url"
      :plugin="plugin"
      @select="selected = $event"
    />
  </ul>


  <div v-else class="text-sm text-gray-600 dark:text-gray-400 mb-6">
    No plugins found.
  </div>

</template>

//
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import PluginItem from '@/components/list/PluginItem.vue';
import PluginForm from '@/components/forms/Plugin.vue';
import gun from '@/services/gun'; 

const plugins = ref<any[]>([]);
const selected = ref(null);
const formRef = ref<HTMLElement | null>(null);

const handleChange = () => {
  fetchPlugins();
  selected.value = null;
}

const fetchPlugins = () => {
  const pluginList: any[] = [];

  gun.user()
  .get('plugins')
  .map()
  .once((data, key) => {
    if (data) {
      pluginList.push(data);
      plugins.value = [...pluginList];
    }
  });
}

watch(selected, async (newVal, oldVal) => {
  formRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

onMounted(fetchPlugins);
</script>