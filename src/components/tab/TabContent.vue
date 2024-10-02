<template>
  <div v-if="isActive">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';

// Get the currently selected tab from the parent TabGroup component
const selectedTab = inject('selectedTab');
const props = defineProps({
  value: {
    type: String,
    required: true,
  },
});

// Check if this tab is the active one
const isActive = computed(() => props.value === selectedTab.value);
</script>
