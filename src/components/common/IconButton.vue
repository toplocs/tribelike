<template>
  <button
    @click="onClick"
    class="inline-flex items-center px-4 py-2 text-sm font-medium bg-blue-50 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
  >
    <icon class="w-5 h-5" />
  </button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const props = defineProps({
  onClick: {
    type: Function,
    required: false,
  },
  icon: {
    type: Function,
    required: true,
  }
});
const router = useRouter();

const href = () => {
  router.push(props.href);
};
</script>
