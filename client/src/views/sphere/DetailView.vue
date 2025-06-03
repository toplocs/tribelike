<template>
  <RelationProvider>
    <Banner v-if="space == 'local'">
      You are viewing the local version of {{ sphere?.title }}.
      <b
        class="p-2 cursor-pointer"
        @click="switchSpace"
      > Switch to global
      </b>
    </Banner>

    <SubNav
      :initialTab="tab"
      :tabs="[
        { value: 'Info', href: `/sphere/${route.params.id}` },
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
import { useSphere } from '@/composables/sphereProvider';
import { usePlugins } from '@/composables/pluginProvider';
import { relationProvider } from '@/composables/relationProvider';

const route = useRoute();
const { profile } = useProfile();
const { sphere, space, setSphere } = useSphere();
const { tabs } = usePlugins();
const title = inject('title');
const settings = inject('settings');
const tab = ref('');
const routedTabs = computed(() => {
  return tabs.value.map(x => ({
    ...x,
    href: `/sphere/${route.params.id}/${x.href}`
  }));
});



const switchSpace = () => {
  space.value = 'global';
  sphere.value = setSphere(route.params.id);
}

watch(() => route.params.id, async (newId) => {
  space.value = 'local';
  await setSphere(newId);
  relationProvider(newId);
  settings.value = `/sphere/${newId}/settings`;
});

watch(() => sphere.value, (newValue) => {
  title.value = newValue?.title;
});

onMounted(async () => {
  const id = route.params.id;
  space.value = 'local';
  await setSphere(id);
  settings.value = `/sphere/${id}/settings`;
});

onUnmounted(() => {
  sphere.value = null;
});

provide('tab', tab);
relationProvider(route.params.id);
</script>
