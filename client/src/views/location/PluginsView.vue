<template>
  <div class="min-h-screen">
    <Card className="mx-auto mt-10 max-w-lg px-0">
      <div className="pb-4">
        <Title float="center">
          A list of all available plugins:
        </Title>
      </div>

      <ul
        v-for="plugin in plugins"
        :key="plugin.id"
      >
        <PluginListItem
          :plugin="plugin"
          :profileId="profile?.id"
        />
      </ul>
    </Card>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject, computed, watchEffect, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Card from '@/components/common/Card.vue';
import Title from '@/components/common/Title.vue';
import PluginListItem from '@/components/list/PluginListItem.vue';
import defaultPluginSettings from '@/assets/pluginSettings';

const router = useRouter();
const session = inject('session');
const location = inject('location');
const profile = inject('profile');
const tab = inject('tab');
const pluginSettings = ref([]);
const plugins = computed(() => 
  defaultPluginSettings.map(plugin => ({
    key: location.value?.id,
    ...plugin,
    ...pluginSettings.value.find(
      x => x.pluginId == plugin.pluginId
    ),
  }))
);

/*const fetchPlugins = async () => {
  try {
    const response = await axios.get(`/api/plugin`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}*/

const fetchPluginSettings = async (key: string, id: string) => {
  try {
    const response = await axios.get(`/api/plugin?key=${key}&profileId=${id}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

watchEffect(async() => {
  pluginSettings.value = await fetchPluginSettings(
    location.value?.id,
    profile.value?.id
  );
})

onMounted(async () => {
  //plugins.value = await fetchPlugins();
  tab.value = 'Plugins';
});
</script>
