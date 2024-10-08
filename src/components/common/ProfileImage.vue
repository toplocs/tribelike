<template>
  <div
    class="relative"
    ref="tooltipTarget"
  >
    <img
      :src="src"
      :alt="tooltipText"
      width="50"
      height="50"
      :class="sizeClass"
      class="rounded-full object-cover border-2"
    />

    <Tooltip
      v-if="tooltipTarget && tooltipText"
      :targetRef="tooltipTarget"
      :content="tooltipText"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Tooltip from '@/components/common/Tooltip.vue';

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

const tooltipTarget = ref(null);

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
