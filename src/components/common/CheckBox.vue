<template>
  <input
    type="checkbox"
    :name="name"
    :checked="modelValue"
    @change="onChange"
    class="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-200 focus:ring-opacity-50"
  />
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
  }
});

const emit = defineEmits()

// Emit the checkbox value on change
const onChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>
