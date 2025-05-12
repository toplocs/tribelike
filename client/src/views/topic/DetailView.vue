<template>
  <div>
    <Banner v-if="space == 'local'">
      You are viewing the local version of {{ topic?.title }}.
      <b
        class="p-2 cursor-pointer"
        @click="switchSpace"
      > Switch to global
      </b>
    </Banner>

    <SubNav
      :initialTab="tab"
      :tabs="tabs"
    />

    <router-view />
  </div>

</template>

<script setup lang="ts">
import { ref, computed, inject, provide, watch, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import Banner from '@/components/common/Banner.vue';
import SubNav from '@/components/SubNav.vue';
import { useProfile } from '@/composables/profileProvider';
import { useTopic } from '@/composables/topicProvider';
import { relationProvider } from '@/composables/relationProvider';
import defaultPluginSettings from '@/assets/pluginSettings';

const route = useRoute();
const { profile } = useProfile();
const { topic, space, setTopic } = useTopic();
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

const switchSpace = () => {
  space.value = 'global';
  topic.value = setTopic(route.params.id);
}


const fetchPluginSettings = async (key: string, id: string) => {

}


watch(() => route.params.id, (newId) => {
  space.value = 'local';
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
  space.value = 'local';
  topic.value = setTopic(id); //change?!
});

onUnmounted(() => {
  topic.value = null;
});

provide('tab', tab);
relationProvider(route.params.id);
</script>
