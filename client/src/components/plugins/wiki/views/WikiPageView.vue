<template>
  <Container>
    <div class="w-full">
      <Plugins>
        <div className="mt-4">
          <WikiPlugin :wiki="wiki" />
        </div>
      </Plugins>
      
    </div>

    <Sidebar>
      <div className="mb-4 min-w-[200px]">
        <Title>Wiki pages:</Title>
        <WikiListItem
          v-for="page of wikiPages"
          :key="page.id"
          :title="page.title"
          :href="`/wiki/${page.id}`"
        />
        <WikiListItem
          title="Create a new Page"
          href="/wiki/create"
        />
      </div>
    </Sidebar>

  </Container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject, watchEffect, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Container from '@/components/common/Container.vue';
import Sidebar from '@/components/SideBar.vue';
import Title from '@/components/common/Title.vue';

import Plugins from '@/components/plugins/Plugins.vue';
import WikiPlugin from '@/components/plugins/wiki/Index.vue';
import WikiListItem from '@/components/plugins/wiki/WikiListItem.vue';

const route = useRoute();
const profile = inject('profile');
const wiki = ref(null);
const wikiPages = ref([]);

const fetchWikiPages = async () => {
  try {
    const response = await axios.get(`/api/plugins/wiki`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const fetchWikiById = async (id: String) => {
  try {
    const response = await axios.get(`/api/plugins/wiki/byId/${id}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

watchEffect(async () => {
  wiki.value = await fetchWikiById(route.params.id);
});

onMounted(async () => {
  wikiPages.value = await fetchWikiPages();
  wiki.value = await fetchWikiById(route.params.id);
});
</script>
