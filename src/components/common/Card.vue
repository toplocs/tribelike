<template>
  <div :class="cardClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps({
  className: {
    type: String,
    default: ''
  }
});

const cardClass = computed(() => `relative w-full text-left ring-1 rounded-lg p-6 bg-white dark:bg-gray-800 ring-gray-300 dark:ring-gray-700 shadow-md dark:shadow-lg border-transparent dark:border-gray-600 dark:text-white ${props.className}
`);
</script>
