<template>
  <div
    v-if="isVisible"
    class="absolute top-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded mt-1 whitespace-nowrap z-10 dark:bg-gray-500"
  >
    {{ content }}
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
  targetRef: {
    type: Object,
    required: false,
  },
});

const isVisible = ref(false);

const showTooltip = () => {
  isVisible.value = true;
};

const hideTooltip = () => {
  isVisible.value = false;
};

onMounted(() => {
  props.targetRef?.addEventListener('mouseover', showTooltip);
  props.targetRef?.addEventListener('mouseout', hideTooltip);
});
</script>
