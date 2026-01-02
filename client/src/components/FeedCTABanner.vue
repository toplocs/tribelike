<template>
  <div v-if="!dismissed" class="cta-banner">
    <div class="flex items-start gap-4">
      <div class="flex-1">
        <h3 class="font-semibold text-lg mb-2">No discussions yet</h3>
        <p class="text-sm text-gray-700 dark:text-gray-300 mb-3">
          Be the first to start a discussion on the topics you follow. Comments will appear here as people engage.
        </p>
      </div>
      <button @click="dismiss" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl leading-none flex-shrink-0">
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
.cta-banner {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 1px solid #3b82f6;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(59, 130, 246, 0.1);
  ring: 1px solid #3b82f6;
}

:global(.dark) .cta-banner {
  background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
  border-color: #60a5fa;
  box-shadow: 0 1px 3px rgba(96, 165, 250, 0.2);
}

:global(.dark) .cta-banner h3 {
  color: #dbeafe;
}

:global(.dark) .cta-banner p {
  color: #bfdbfe;
}
</style>
