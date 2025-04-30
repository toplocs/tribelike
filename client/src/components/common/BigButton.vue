<template>
  <button
    @click="useAction"
    :class="[
      `flex flex-row gap-1 px-4 py-2 cursor-pointer rounded font-semibold transition-colors duration-200`,
      subscribed ? `bg-gray-700 hover:bg-gray-800 text-white` : `bg-${color}-400 hover:bg-${color}-500 text-white`
    ]"
  >
    <HeartIcon v-if="icon == 'heart'" class="m-auto w-4 h-4" />
    <AcademicCapIcon v-if="icon == 'study'" class="m-auto w-4 h-4" />
    {{ title }}
  </button>
</template>

<script setup lang="ts">
import { HeartIcon } from '@heroicons/vue/24/outline';
import { AcademicCapIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  }
});
const emit = defineEmits(['useAction'])

const useAction = () => {
 emit('useAction');
};
</script>
