<template>
  <router-link
    :to="page?.href"
    class="flex items-center p-2 w-full border-t border-gray-100 hover:bg-blue-50 text-blue-500 dark:hover:bg-gray-800 transition duration-150 ease-in-out cursor-pointer"
  >
    {{ page?.title }}
  </router-link>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  page: {
    type: Object,
    required: true,
  },
});
</script>