<template>
  <span
    class="inline-flex items-center gap-x-1 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-blue-50 text-blue-900 ring-blue-500/30 cursor-pointer dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30"
  >
    <span>{{ title }}</span>
    <XMarkIcon
      v-if="remove"
      @click.prevent="remove"
      class="w-4 h-4"
    />
  </span>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  remove: {
    type: Function,
    required: false,
  },
});
</script>
