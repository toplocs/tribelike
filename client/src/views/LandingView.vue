<template>
  <div className="min-h-screen flex flex-col justify-center">
    <div class="my-4 mx-auto max-w-md">
      <h1 class="text-center uppercase tracking-wide text-sm dark:text-white">
        <p class="text-lg font-bold">
          Welcome {{ profile?.username || 'Stranger' }}.
        </p><br />
        Communities, Topics and Locations. Worldwide!
      </h1>
    </div>

    <Container>
      <MixedCloud />
    </Container>
  </div>
</template>

<script setup lang="ts">
import Container from '@/components/common/Container.vue';
import MixedCloud from '@/components/MixedCloud.vue';
</script>
