<template>
  <span
    class="inline-flex items-center gap-x-1 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-red-50 text-red-900 ring-red-500/30 cursor-pointer dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/30"
  >
    <span>{{ title }}</span>
    <XMarkIcon v-if="remove" @click="remove(title)" class="w-4 h-4 cursor-pointer" />
  </span>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>
