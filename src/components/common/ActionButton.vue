<template>
  <button
    @click="useAction"
    class="w-full inline-flex justify-center px-4 py-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 rounded-lg hover:bg-green-100 dark:hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
  > {{ title }}
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true
  },
});
const emit = defineEmits(['useAction'])

const useAction = () => {
 emit('useAction');
};
</script>
