<template>
  <div class="relative">
    <div @click="toggleDropdown" class="cursor-pointer">
      <slot name="trigger" />
    </div>

    <div v-if="isOpen" :class="dropdownClass">
      <slot :closeDropdown="closeDropdown">
        <p>This is the default dropdown content.</p>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  className: {
    type: String,
    default: ''
  }
});

const isOpen = ref(false);

const dropdownClass = computed(() => 
  `absolute right-0 z-10 mt-1 ring-1 rounded-sm bg-white cursor-pointer dark:bg-gray-800 ring-gray-300 dark:ring-gray-700 shadow-md dark:shadow-lg border-transparent dark:border-gray-600 ${props.className}`
);

// Methods to toggle and close the dropdown
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const closeDropdown = () => {
  isOpen.value = false;
};
</script>