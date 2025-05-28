<template>
  <RelationProvider>
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
      :tabs="[
        { value: 'Info', href: `/topic/${route.params.id}` },
        ...routedTabs,
      ]"
    />

    <router-view />
  </RelationProvider>
</template>

<script setup lang="ts">
import { ref, computed, inject, provide, watch, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import Banner from '@/components/common/Banner.vue';
import RelationProvider from '@/components/RelationProvider.vue';
import SubNav from '@/components/SubNav.vue';
import { useProfile } from '@/composables/profileProvider';
import { useTopic } from '@/composables/topicProvider';
import { usePlugins } from '@/composables/pluginProvider';
import { relationProvider } from '@/composables/relationProvider';

const route = useRoute();
const { profile } = useProfile();
const { topic, space, setTopic } = useTopic();
const { tabs } = usePlugins();
const title = inject('title');
const settings = inject('settings');
const tab = ref('');
const routedTabs = computed(() => {
  return tabs.value.map(x => ({
    ...x,
    href: `/topic/${route.params.id}/${x.href}`
  }));
});



const switchSpace = () => {
  space.value = 'global';
  topic.value = setTopic(route.params.id);
}

watch(() => route.params.id, async (newId) => {
  space.value = 'local';
  await setTopic(newId);
  relationProvider(newId);
});

watch(() => topic.value, (newValue) => {
  title.value = newValue?.title;
});

onMounted(async () => {
  const id = route.params.id;
  space.value = 'local';
  await setTopic(id);
  console.log(topic.value);
  settings.value = `/topic/${id}/settings`;
});

onUnmounted(() => {
  topic.value = null;
});

provide('tab', tab);
relationProvider(route.params.id);
</script>
