<template>
  <div :class="calloutClasses">
    <div class="flex items-start">
      <h4 v-if="title" class="font-semibold">{{ title }}</h4>
    </div>
    <p class="overflow-y-auto text-xs">
      <slot></slot>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    default: 'red',
    validator: (value: string) => {
      return ['red', 'green'].includes(value);
    },
  },
});

const calloutClasses = computed(() => {
  const baseClasses = "flex flex-col overflow-hidden rounded-lg border-l-4 p-4 mb-2 opacity-75";
  const colorClasses = props.color === 'red'
    ? 'bg-red-100 border-red-500 text-red-700'
    : 'bg-green-100 border-green-500 text-green-700';

  return `${baseClasses} ${colorClasses}`;
});
</script>
