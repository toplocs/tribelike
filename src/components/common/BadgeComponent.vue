<template>
  <span
    class="inline-flex items-center gap-x-1 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-blue-50 text-blue-900 ring-blue-500/30 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30"
  >
    <component :is="icon" class="w-4 h-4 text-blue-900 dark:text-blue-400" v-if="icon" />
    <span>{{ title }}</span>
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  icon?: any;
}>();
</script>
