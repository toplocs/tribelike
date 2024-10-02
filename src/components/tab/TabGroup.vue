<template>
  <div class="w-full">
    <div class="flex border-b space-x-4" role="tablist" aria-orientation="horizontal">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        :class="[
          'flex whitespace-nowrap truncate max-w-xs outline-none -mb-px px-2 py-2 transition duration-100',
          tab.value === selectedTab
            ? 'border-b-2 border-blue-500 text-blue-600'
            : 'border-transparent hover:border-b-2 hover:border-gray-300 text-gray-500 hover:text-gray-700',
        ]"
        @click="selectTab(tab.value)"
        role="tab"
        type="button"
        :aria-selected="tab.value === selectedTab"
        :tabindex="tab.value === selectedTab ? 0 : -1"
      >
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <!-- Render the selected tab content -->
    <div class="mt-4">
      <slot :selected-tab="selectedTab" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue';

const props = defineProps({
  initialTab: {
    type: String,
    default: '',
  },
  tabs: {
    type: Array as () => Array<{ label: string; value: string }>,
    required: true,
  },
});

// Reactive state for selected tab
const selectedTab = ref(props.initialTab || props.tabs[0]?.value);

// Method to switch tabs
const selectTab = (tabValue: string) => {
  selectedTab.value = tabValue;
};

// Provide the current tab to child components
provide('selectedTab', selectedTab);
</script>
