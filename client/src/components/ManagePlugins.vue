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

  <PluginForm :selected="selected" @plugin-added="fetchPlugins" />
</template>

//
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PluginItem from '@/components/list/PluginItem.vue';
import PluginForm from '@/components/forms/Plugin.vue';
import gun from '@/services/gun'; 

const plugins = ref<any[]>([]);
const selected = ref(null);

const fetchPlugins = () => {
  const pluginList: any[] = [];

  gun.get('plugins')
  .map()
  .once((data) => {
    if (data?.url) {
      pluginList.push(data);
      plugins.value = [...pluginList];
    }
  });
}

onMounted(fetchPlugins);
</script>