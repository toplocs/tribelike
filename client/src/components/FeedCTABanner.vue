<template>
  <div v-if="!dismissed" class="cta-banner bg-blue-50 dark:bg-blue-950 border border-blue-300 dark:border-blue-600 rounded-lg p-6 shadow-sm dark:shadow-md">
    <div class="flex items-start gap-4">
      <div class="flex-1">
        <h3 class="font-semibold text-lg mb-2 text-blue-900 dark:text-blue-100">No discussions yet</h3>
        <p class="text-sm text-blue-800 dark:text-blue-200 mb-3">
          Be the first to start a discussion on the topics you follow. Comments will appear here as people engage.
        </p>
      </div>
      <button @click="dismiss" class="text-blue-400 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-xl leading-none flex-shrink-0">
        ✕
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const dismissed = ref(false);

const dismiss = () => {
  dismissed.value = true;
};
</script>

<style scoped>
/* Styling handled by Tailwind classes */
</style>
