<template>
  <span
    class="inline-flex items-center gap-x-1 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-blue-200 text-blue-900 ring-blue-800/30 cursor-pointer dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30"
  >
    <UserIcon class="w-4 h-4" />

    <span>{{ username }}</span>
  </span>
</template>

<script setup lang="ts">
import { UserIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  username: {
    type: String,
    required: true,
  },
});
</script>
