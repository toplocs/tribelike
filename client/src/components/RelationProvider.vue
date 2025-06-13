<template>
  <div :id="route.params.id">
   <slot />
  </div>
</template>

<script setup lang="ts">
import { relationProvider } from '@/composables/relationProvider';
import { useRoute } from 'vue-router';

const route = useRoute();
relationProvider(route.params.id);
</script>
