<template>
  <div class="px-2 w-full">
    <div
      class="flex border-b space-x-4"
      role="tablist"
      aria-orientation="horizontal"
    >
      <router-link
        v-for="tab in tabs"
        :to="tab.href"
        :key="tab.value"
      >
        <button
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
        > {{ tab.value }}
        </button>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  initialTab: {
    type: String,
    default: '',
  },
  tabs: {
    type: Array,
    required: true,
  },
});

const selectedTab = ref(props.initialTab);

const selectTab = (tabValue: string) => {
  selectedTab.value = tabValue;
};

watch(() => props.initialTab, (value) => {
  selectedTab.value = value;
})
</script>
