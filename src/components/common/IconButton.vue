<template>
  <button 
    :class="buttonClasses"
    :disabled="disabled"
    aria-label="Icon Button"
    ref="tooltipTarget"
    @click="onClick"
  >
    <component :is="icon" class="size-6"/>

    <Tooltip
      v-if="tooltipTarget && tooltipText"
      :targetRef="tooltipTarget"
      :content="tooltipText"
    />
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Tooltip from '@/components/common/TooltipComponent.vue';

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
