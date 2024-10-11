<template>
  <div class="relative" ref="selectContainer">
    <input
      type="hidden"
      :name="name"
      :value="selectedOption"
    >

    <button
      type="button"
      aria-controls="select-options"
      aria-expanded="isOpen.toString()"
      aria-autocomplete="none"
      @click="toggleDropdown"
      class="group flex w-full items-center justify-between gap-2 truncate rounded-md border px-3 py-2 shadow-sm outline-none transition sm:text-sm border-gray-300 dark:border-gray-800 text-gray-900 dark:text-gray-50 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-900/50 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 dark:focus:ring-blue-700 dark:focus:border-blue-700"
    >
      <span>
        {{ options.find(x => x.id === selectedOption)?.label || placeholder }}
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
          :key="option.id"
          @click="selectOption(option.id)"
          class="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          {{ option.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watchEffect } from 'vue';
import { ChevronDownIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  options: {
    type: Array,
    required: true
  },
  placeholder: {
    type: String,
    default: 'Select'
  },
  name: {
    type: String,
    required: true
  },
  modelValue: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);
const isOpen = ref(false);
const selectedOption = ref(null);
const selectContainer = ref(null);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectOption = (optionId: string) => {
  emit('update:modelValue', optionId);
  selectedOption.value = optionId;
  isOpen.value = false;
};

const handleClickOutside = (event) => {
  if (selectContainer.value && !selectContainer.value.contains(event.target)) {
    isOpen.value = false;
  }
};

watchEffect(() => {
  selectedOption.value = props.modelValue;
});

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>
