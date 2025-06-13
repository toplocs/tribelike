<template>
  <span
    class="inline-flex items-center gap-x-1 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-green-200 text-green-900 ring-green-800/30 cursor-pointer dark:bg-green-400/10 dark:text-green-400 dark:ring-green-400/30"
  >
    <slot />

    <span>{{ title }}</span>
    
    <XMarkIcon
      v-if="remove"
      @click.prevent="() => remove()"
      class="w-3 h-3"
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
