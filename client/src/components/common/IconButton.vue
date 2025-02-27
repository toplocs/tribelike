<template>
  <button
    aria-label="Icon Button"
    ref="tooltipTarget"
    type="button"
    :class="buttonClasses"
    :disabled="disabled"
  >
    <component :is="icon" class="size-6" />

    <span v-if="counter > 0" class="absolute top-2 right-2 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
      {{ counter < 100 && counter || 99 }}
    </span>

    <Tooltip
      v-if="tooltipTarget && tooltipText"
      :targetRef="tooltipTarget"
      :content="tooltipText"
    />
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Tooltip from '@/components/common/Tooltip.vue';

const props = defineProps({
  icon: {
    type: Function,
    required: true,
  },
  tooltipText: {
    type: String,
    required: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  className: {
    type: String,
    default: '',
  },
  counter: {
    type: Number,
    default: 0,
  },
});

const tooltipTarget = ref(null);
const buttonClasses = computed(() =>
  `relative inline-flex items-center justify-center 
   bg-gray-200 dark:bg-gray-700
   text-blue-500 dark:text-blue-400 
   rounded-lg px-2 py-2 
   ${props.disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-300 dark:hover:bg-gray-600'} 
   ${props.className}`
);
</script>
