<template>
  <div
    class="relative w-full flex items-center min-w-[100px] outline-none rounded-md transition duration-100 border bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
  >
    <input
      :id="id"
      :type="type"
      :name="name"
      :placeholder="placeholder"
      :disabled="disabled"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="w-full bg-transparent focus:outline-none focus:ring-0 border-none text-sm rounded-lg transition duration-100 py-2 text-gray-900 dark:text-white pr-3 pl-3 placeholder-gray-400 dark:placeholder-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  id: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    default: 'text',
  },
  name: {
    type: String,
    required: false,
  },
  placeholder: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['update:modelValue']);
</script>
