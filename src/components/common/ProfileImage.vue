<template>
  <div
    class="relative inline-block"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
  >
    <img
      :src="src"
      :alt="tooltipText"
      width="50"
      height="50"
      :class="sizeClass"
      class="rounded-full object-cover border-2"
    />
    <div
      v-if="isTooltipVisible"
      class="absolute top-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded mt-1 whitespace-nowrap z-10"
    >
      {{ tooltipText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  size: {
    type: String as () => 'large' | 'medium' | 'small',
    default: 'medium',
  },
  tooltipText: {
    type: String,
    required: false,
  },
});

const getSizeClasses = (size: string): string => {
  const sizes: { [key: string]: string } = {
    large: 'w-30 h-30',
    medium: 'w-20 h-20',
    small: 'w-10 h-10',
  };
  return sizes[size];
};

const isTooltipVisible = ref(false);
const sizeClass = computed(() => getSizeClasses(props.size))

const showTooltip = () => {
  isTooltipVisible.value = true;
};

const hideTooltip = () => {
  isTooltipVisible.value = false;
};
</script>
