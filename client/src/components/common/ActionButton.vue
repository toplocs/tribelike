<template>
  <button
    @click="useAction"
    class="w-full cursor-pointer inline-flex justify-center px-4 py-2 text-sm font-medium rounded-lg text-green-600 dark:text-green-300 bg-green-50 dark:bg-green-800 hover:bg-green-100 dark:hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
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
