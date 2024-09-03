<template>
  <button
    @click="goBack"
    class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-transparent rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
  >
    <ArrowLeftIcon class="w-4 h-4 mr-1" />
    Zurück
  </button>
</template>

<script setup lang="ts">
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import { useRouter } from 'vue-router';

const props = defineProps({
  href: {
    type: String,
    default: '/'
  }
});
const router = useRouter();

const goBack = () => {
  router.push(props.href);
};
</script>
