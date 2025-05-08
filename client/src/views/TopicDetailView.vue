<template>
  <div>
    <SubNav
      :initialTab="tab"
      :tabs="tabs"
    />

    <router-view />
  </div>

</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, computed, inject, provide, watch, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import InfoView from '@/views/topic/InfoView.vue';
import SubNav from '@/components/SubNav.vue';
import defaultPluginSettings from '@/assets/pluginSettings';
import { useProfile } from '@/composables/profileProvider';
import { useTopic } from '@/composables/topicProvider';
import { relationProvider } from '@/composables/relationProvider';

const route = useRoute();
const { profile } = useProfile();
const { topic, setTopic } = useTopic();
const title = inject('title');
const tab = ref('');
const pluginSettings = ref([]);
const access = computed(
  () => profile.value?.topics.some(x => x.id == topic.value?.id)
);
const tabs = computed(() => {
  const routes = defaultPluginSettings.map(plugin => {
    const settings = pluginSettings.value.find(
      x => x.pluginId == plugin.pluginId
    );
    if (settings?.active == false) return null;
    else return { value: plugin.name, href: `/topic/${topic.value?.id}/${plugin.path}` };
  }).filter(Boolean);

  return [
    { value: 'Info', href: `/topic/${topic.value?.id}` },
    { value: 'Discussions', href: `/topic/${topic.value?.id}/discussions` },
    ...routes,
    { value: 'Plugins', href: `/topic/${topic.value?.id}/plugins` },
    { value: 'Settings', href: `/topic/${topic.value?.id}/settings` },
  ];
});


const fetchPluginSettings = async (key: string, id: string) => {
  try {
    const response = await axios.get(`/api/plugin?key=${key}&profileId=${id}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}


watch(() => route.params.id, (newId) => {
  topic.value = setTopic(newId);
});

watch(() => topic.value, (newValue) => {
  title.value = newValue?.title;
});

/*
watch(() => profile.value, async (newId) => {
  pluginSettings.value = await fetchPluginSettings(
    topic.value?.id,
    profile.value?.id
  );
});
*/

onMounted(() => {
  /*topic.value = await fetchInterest(route.params.id);
  pluginSettings.value = await fetchPluginSettings(
    topic.value?.id,
    profile.value?.id
  );*/
  const id = route.params.id;
  topic.value = setTopic(id);
});

onUnmounted(() => {
  topic.value = null;
});

provide('tab', tab);
relationProvider(route.params.id);
</script>
