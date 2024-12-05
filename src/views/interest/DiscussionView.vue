<template>
  <Container>
    <div class="w-full">
      <Card v-for="discussion of discussions">
        <DiscussionListItem
          :discussion="discussion"
        />
      </Card>

      <Card v-if="!discussions.length">
        There are no discussions at the moment.
      </Card>
    </div>
      
    <Sidebar>
      <div className="min-w-[200px]" />
    </Sidebar>

  </Container>
</template>

<script setup lang="ts">
import { ref, inject, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Card from '@/components/common/Card.vue';
import Container from '@/components/common/Container.vue';
import DiscussionListItem from '@/components/list/DiscussionListItem.vue';
import Sidebar from '@/components/SideBar.vue';

const route = useRoute();
const interest = inject('interest');
const profile = inject('profile');
const tab = inject('tab');
const discussions = computed(() => interest.value?.discussions || []);

onMounted(() => {
  tab.value = 'Discussions';
});
</script>
