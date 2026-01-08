<template>
  <div className="min-h-[80vh] flex flex-col">
    <div class="my-4 mx-auto max-w-md">
      <h1 class="text-center uppercase tracking-wide text-sm dark:text-white">
        <p class="text-lg font-bold">
          Welcome {{ profile?.username || 'Stranger' }}.
        </p><br />
        Communities, Topics and Locations. Worldwide!
      </h1>
    </div>

    <Container className="flex-1">
      <FeedView />
    </Container>
  </div>
</template>

<script setup lang="ts">
import Container from '@/components/common/Container.vue';
import FeedView from '@/views/FeedView.vue';
import { useProfile } from '@/composables/profileProvider';

const { profile } = useProfile();
</script>
