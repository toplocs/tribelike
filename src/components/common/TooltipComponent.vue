<template>
  <div
    class="relative"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
  >
    <div v-if="isTooltipVisible"
      class="absolute top-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded mt-1 whitespace-nowrap z-10"
    >
      {{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Props definition
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
});

const isTooltipVisible = ref(false);

const showTooltip = () => {
  isTooltipVisible.value = true;
};

const hideTooltip = () => {
  isTooltipVisible.value = false;
};
</script>
