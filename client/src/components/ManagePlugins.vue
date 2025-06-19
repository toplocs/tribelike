<template>
  <h2 class="text-xl font-semibold mb-4">Manage Plugins</h2>

  <ul v-if="plugins.length" class="mb-6 space-y-2">
    <li
      v-for="plugin in plugins"
      :key="plugin.url"
      class="p-2 border rounded bg-gray-50 dark:bg-gray-800"
    >
      <strong>{{ plugin.name }}</strong>
      <p class="text-xs text-gray-500">{{ plugin.url }}</p>
    </li>
  </ul>
  <div v-else class="text-sm text-gray-600 dark:text-gray-400 mb-6">
    No plugins found.
  </div>

  <PluginForm @plugin-added="fetchPlugins" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PluginForm from '@/components/forms/Plugin.vue';
import gun from '@/services/gun'; 

const plugins = ref<any[]>([]);

const fetchPlugins = () => {
  const pluginList: any[] = [];

  gun.get('plugins').map().once((data: any) => {
    if (data?.url) {
      pluginList.push(data);
      plugins.value = [...pluginList];
    }
  });
}

onMounted(fetchPlugins);
</script>
