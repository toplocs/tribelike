<template>
  <span
    class="inline-flex items-center gap-x-1 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-red-50 text-red-900 ring-red-500/30 cursor-pointer dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/30"
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
