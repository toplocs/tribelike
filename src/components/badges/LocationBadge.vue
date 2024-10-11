<template>
  <span
    class="inline-flex items-center gap-x-1 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-orange-50 text-orange-900 ring-orange-500/30 cursor-pointer dark:bg-orange-400/10 dark:text-orange-400 dark:ring-orange-400/30"
  >
    <component
      :is="MapPinIcon"
      class="w-4 h-4 text-orange-900 dark:text-orange-400"
    />
    <span>{{ title }}</span>
    <XMarkIcon
      v-if="remove"
      @click.prevent="remove"
      class="w-4 h-4"
    />
  </span>
</template>

<script setup lang="ts">
import { MapPinIcon, XMarkIcon } from '@heroicons/vue/24/outline';

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
