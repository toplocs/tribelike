<template>
  <div class="relative" ref="selectContainer">
    <input
      v-model="inputValue"
      type="text"
      :name="name"
      :placeholder="placeholder"
      @focus="openDropdown"
      @input="onInput"
      class="w-full rounded-md border px-3 py-2 shadow-sm outline-none transition sm:text-sm border-gray-300 dark:border-gray-800 text-gray-900 dark:text-gray-50 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-950/50 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 dark:focus:ring-blue-700 dark:focus:border-blue-700"
    />
    <button class="absolute inset-y-0 right-0 flex gap-2 items-center pr-2">
      <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
    </button>

    <div
      v-if="isOpen"
      class="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg"
      id="select-options"
    >
      <ul class="max-h-60 overflow-y-auto">
        <li
          v-for="option in filteredOptions"
          :key="option.value"
          @click="selectOption(option)"
          class="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          {{ option.label }}
        </li>
        <li v-if="filteredOptions.length === 0" class="px-4 py-2 text-gray-500">
          Keine Suchergebnisse
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  options: {
    type: Array as () => { value: string; label: string }[],
    required: true
  },
  placeholder: {
    type: String,
    default: 'Search'
  },
  name: {
    type: String,
    required: true
  },
  modelValue: {
    type: [String, Object],
    default: ''
  },
});

const inputValue = ref('');
const selectedOption = ref(null);
const isOpen = ref(false);
const selectContainer = ref<HTMLElement | null>(null);
const emit = defineEmits<{
  (event: 'update:modelValue', value: { value: string; label: string } | string): void;
  (event: 'selected', value: { value: string; label: string }): void;
}>();

const filteredOptions = computed(() => {
  if (inputValue.value.length < 3) return [];
  return props.options.filter(option => 
    option.label.toLowerCase().includes(inputValue.value.toLowerCase())
  );
});

const openDropdown = () => {
  isOpen.value = true;
};

const closeDropdown = () => {
  isOpen.value = false;
};

const onInput = () => {
  openDropdown();
};

const selectOption = (option: {
  value: string;
  label: string
}) => {
  selectedOption.value = option;
  inputValue.value = option.label;
  emit('update:modelValue', option);
  emit('selected', option);
  closeDropdown();
};

const handleClickOutside = (event: MouseEvent) => {
  if (selectContainer.value && !selectContainer.value.contains(event.target as Node)) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>