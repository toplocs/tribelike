<template>
  <h3 :class="`my-auto text-${float} text-lg text-gray-800 dark:text-gray-100 font-semibold`">
    <slot />
  </h3>
</template>

<script setup lang="ts">
const props = defineProps({
  float: {
    type: String,
    default: 'left',
    required: false,
  }
});
</script>