<template>
  <span
    class="inline-flex items-center gap-2 whitespace-nowrap rounded-full px-2.5 py-1.5 text-xs font-medium border border-gray-200 bg-white text-gray-700 cursor-pointer dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 transition-all hover:border-gray-300 dark:hover:border-gray-600"
  >
    <img
      v-if="image"
      :src="image"
      :alt="username"
      class="w-4 h-4 rounded-full object-cover flex-shrink-0"
    />
    <UserIcon
      v-else
      class="w-4 h-4 flex-shrink-0 text-gray-400"
    />

    <span>{{ username || 'Anonym' }}</span>
  </span>
</template>

<script setup lang="ts">
import { UserIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  username: {
    type: String,
  },
  image: {
    type: String,
  },
});
</script>
