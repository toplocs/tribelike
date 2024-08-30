<template>
  <div class="relative" ref="selectContainer">
    <!-- Hidden input to hold the selected value -->
    <input type="hidden" :name="name" :value="selectedOption.value" />

    <button
      type="button"
      aria-controls="select-options"
      aria-expanded="isOpen.toString()"
      aria-autocomplete="none"
      @click="toggleDropdown"
      class="group flex w-full items-center justify-between gap-2 truncate rounded-md border px-3 py-2 shadow-sm outline-none transition sm:text-sm border-gray-300 dark:border-gray-800 text-gray-900 dark:text-gray-50 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-950/50 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 dark:focus:ring-blue-700 dark:focus:border-blue-700"
    >
      <span class="truncate">
        {{ selectedOption.label || placeholder }}
      </span>
      <ChevronDownIcon class="w-4 h-4" />
    </button>
    <div
      v-if="isOpen"
      class="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg"
      id="select-options"
    >
      <ul class="max-h-60 overflow-y-auto">
        <li
          v-for="option in options"
          :key="option.value"
          @click="selectOption(option)"
          class="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          {{ option.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { ChevronDownIcon } from '@heroicons/vue/24/outline';

// Props definition
const props = defineProps({
  options: {
    type: Array,
    required: true
  },
  placeholder: {
    type: String,
    default: 'Select'
  },
  defaultValue: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    required: true
  }
});

const selectedOption = ref(props.options[props.defaultValue]);
const isOpen = ref(false);
const selectContainer = ref(null);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectOption = (option) => {
  selectedOption.value = option;
  isOpen.value = false;
};

const handleClickOutside = (event) => {
  if (selectContainer.value && !selectContainer.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});
onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});

watch(() => props.defaultValue, (newValue) => {
  selectedOption.value = newValue;
});
</script>
