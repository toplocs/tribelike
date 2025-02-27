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
import { ref, inject, computed, watchEffect } from 'vue';

const props = defineProps({
  name: {
    type: String,
    default: ''
  },
  className: {
    type: String,
    default: ''
  }
});

const isOpen = ref(false);
const dropdown = inject('dropdown');
const dropdownClass = computed(() => 
  `absolute right-0 max-h-80 overflow-y-auto z-10 mt-1 ring-1 rounded-sm bg-white cursor-pointer dark:bg-gray-800 ring-gray-300 dark:ring-gray-700 shadow-md dark:shadow-lg border-transparent dark:border-gray-600 dark:text-white ${props.className}`
);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  dropdown.value = props.name;
};

const closeDropdown = () => {
  isOpen.value = false;
};

watchEffect(() => {
  if (dropdown.value != props.name) closeDropdown();
});
</script>