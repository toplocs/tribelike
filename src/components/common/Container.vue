<template>
  <div :class="computedClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps({
  className: {
    type: String,
    default: ''
  }
});

const computedClass = computed(
  () => `relative inline-flex w-full p-4 ${props.className}`
);
</script>
