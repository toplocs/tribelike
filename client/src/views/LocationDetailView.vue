<template>
  <div v-if="access">
    <SubNav
      :initialTab="tab"
      :tabs="tabs"
    />

    <router-view />
  </div>

  <InfoView v-else />
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, computed, inject, provide, watch, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import InfoView from '@/views/location/InfoView.vue';
import SubNav from '@/components/SubNav.vue';
import defaultPluginSettings from '@/assets/pluginSettings';

const route = useRoute();
const location = inject('location');
const profile = inject('profile');
const tab = ref('');
const pluginSettings = ref([]);
const access = computed(
  () => true//profile.value?.locations.some(x => x.id == location.value?.id)
);
const tabs = computed(() => {
  const routes = defaultPluginSettings.map(plugin => {
    const settings = pluginSettings.value.find(
      x => x.pluginId == plugin.pluginId
    );
    if (settings?.active == false) return null;
    else return { value: plugin.name, href: `/location/${location.value?.id}/${plugin.path}` };
  }).filter(Boolean);

  return [
    { value: 'Info', href: `/location/${location.value?.id}` },
    { value: 'Discussions', href: `/location/${location.value?.id}/discussions` },
    ...routes,
    { value: 'Plugins', href: `/location/${location.value?.id}/plugins` },
    { value: 'Settings', href: `/location/${location.value?.id}/settings` },
  ];
});

const fetchInterest = async (id: string) => {
  try {
    const response = await axios.get(`/api/location/byId/${id}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const fetchPluginSettings = async (key: string, id: string) => {
  try {
    const response = await axios.get(`/api/plugin?key=${key}&profileId=${id}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}


watch(() => route.params.id, async (newId) => {
  location.value = await fetchInterest(newId);
});

watch(() => profile.value, async (newId) => {
  pluginSettings.value = await fetchPluginSettings(
    location.value?.id,
    profile.value?.id
  );
});

onMounted(async () => {
  location.value = await fetchInterest(route.params.id);
  pluginSettings.value = await fetchPluginSettings(
    location.value?.id,
    profile.value?.id
  );
});

onUnmounted(() => {
  location.value = null;
});

provide('tab', tab);
</script>
