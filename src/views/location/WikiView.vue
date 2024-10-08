<template>
  <Container>
    <div class="w-full">
      <Plugins>
        <div className="mt-4">
          <WikiPlugin />
        </div>
      </Plugins>
      
    </div>

    <Sidebar>
      <div className="mb-4 border-b min-w-[200px]">
        <Title>Wiki pages:</Title>
        <WikiListItem
          v-for="page of wikiPages"
          :key="page.id"
          :page="page"
        />
      </div>
    </Sidebar>

  </Container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { inject, onMounted } from 'vue';
import Container from '@/components/common/Container.vue';
import Sidebar from '@/components/SideBar.vue';
import Title from '@/components/common/Title.vue';

import Plugins from '@/components/plugins/Plugins.vue';
import WikiPlugin from '@/components/plugins/wiki/Index.vue';
import WikiListItem from '@/components/plugins/wiki/WikiListItem.vue';

const location = inject('location');
const profile = inject('profile');
const tab = inject('tab');

const wikiPages = [
  { id: 1, title: 'Page 1', href: `/location/${location?.id}/wiki/1` },
  { id: 2, title: 'Page 2', href: `/location/${location?.id}/wiki/2` },
  { id: 3, title: 'Page 3', href: `/location/${location?.id}/wiki/3` },
];

onMounted(() => {
  tab.value = 'Wiki';
});
</script>
