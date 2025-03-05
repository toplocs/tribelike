<template>
  <button
    type="submit"
    :disabled="pending"
    :class="buttonClass"
  >
    <template v-if="pending">
      Sending ...
    </template>
    <template v-else>
      <slot></slot>
    </template>
  </button>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  className: {
    type: String,
    default: ''
  }
});

const pending = ref(false);

const simulatePendingStatus = () => {
  pending.value = true;
  setTimeout(() => {
    pending.value = false;
  }, 2000);
};

watch(pending, (newValue) => {
  if (newValue) {
    simulatePendingStatus();
  }
});

const buttonClass = computed(() => `inline-flex justify-center px-4 py-2 text-sm font-medium border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 bg-transparent rounded-lg shadow-sm hover:bg-blue-50 dark:hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${props.className}
`);
</script>