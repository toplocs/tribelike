<template>
  <button
    @click.prevent="useAction"
    :class="[
      'flex flex-row gap-1 px-4 py-2 cursor-pointer rounded font-semibold transition-colors duration-200 text-white',
      isPassive ? 'bg-gray-700 hover:bg-gray-800' : colorMap[color] || 'bg-gray-400 hover:bg-gray-500'
    ]"
  >
    <Icon :icon="icon" />
    {{ title }}
  </button>
</template>

<script setup lang="ts">
import { HeartIcon,  AcademicCapIcon } from '@heroicons/vue/24/outline';
import Icon from '@/components/common/Icon.vue';

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
  },
  isPassive: {
    type: Boolean,
    default: false,
  }
});

const colorMap = {
  green: 'bg-green-400 hover:bg-green-500',
  blue: 'bg-blue-400 hover:bg-blue-500',
  red: 'bg-red-400 hover:bg-red-500',
  yellow: 'bg-yellow-400 hover:bg-yellow-500',
};

const emit = defineEmits(['useAction'])

const useAction = () => {
 emit('useAction');
};
</script>
