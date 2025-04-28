<template>
  <div class="relative w-full" ref="selectContainer">
    <input
      v-model="inputValue"
      type="text"
      :placeholder="placeholder"
      @focus="openDropdown"
      @input="onInput"
      class="w-full rounded-md border p-2 shadow-sm outline-none transition sm:text-sm border-gray-300 dark:border-gray-800 text-gray-900 dark:text-gray-50 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-950/50 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 dark:focus:ring-blue-700 dark:focus:border-blue-700"
    />

    <div
      v-if="options.length && isOpen"
      class="absolute p-2 z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg"
      id="select-options"
    >
      <InterestBadge
        v-for="option of filteredOptions"
        :title="option.title"
        :id="option.id"
        @click="selectOption(option)"
      />

      <Button
        v-if="!filteredOptions.length"
        @click="clickButton"
      >
        Create new
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import Button from '@/components/common/Button.vue';
import InterestBadge from '@/components/badges/InterestBadge.vue';

const props = defineProps({
  options: {
    type: Array,
    required: true
  },
  placeholder: {
    type: String,
    default: 'Search'
  },
});

const emit = defineEmits(['select', 'click', 'update:modelValue'])

const inputValue = ref('');
const selectedOption = ref(null);
const isOpen = ref(false);
const filteredOptions = ref([...props.options]);
const selectContainer = ref<HTMLElement | null>(null);

const openDropdown = () => {
  isOpen.value = true;
};

const closeDropdown = () => {
  isOpen.value = false;
};

const onInput = () => {
  openDropdown();
};

const selectOption = (option: Object) => {
  selectedOption.value = option;
  inputValue.value = '';
  emit('update:modelValue', option);
  emit('select', option);
  closeDropdown();
};

const handleClickOutside = (event: MouseEvent) => {
  if (selectContainer.value && !selectContainer.value.contains(event.target as Node)) {
    closeDropdown();
  }
};

const clickButton = () => {
  emit('click', inputValue.value);
  closeDropdown();
  inputValue.value = '';
};

watch(inputValue, () => {
  filteredOptions.value = props.options.filter(option => {
    return option?.title?.toLowerCase()
    .startsWith(inputValue.value?.toLowerCase())
  });
});

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>
