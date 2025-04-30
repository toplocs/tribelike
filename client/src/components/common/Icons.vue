<template>
  <button
    @click="useAction"
    class="[
      'px-4 py-2 cursor-pointer rounded font-semibold transition-colors duration-200',
      subscribed ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
    ]"
  > {{ title }}
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  }
});
const emit = defineEmits(['useAction'])

const useAction = () => {
 emit('useAction');
};
</script>
