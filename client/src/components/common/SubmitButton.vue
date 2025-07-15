<template>
  <button
    type="submit"
    :class="buttonClass"
    @click="handleClick"
  >
    <div class="mx-auto flex flex-row">
      <template v-if="pending">
        Sending ...
      </template>

      <template v-else-if="check">
        Finished
      </template>
      
      <template v-else>
        <slot></slot>
      </template>

      <CheckCircleIcon
        v-if="check"
        class="m-auto ml-1 w-4 h-4"
        style="stroke-width: 2;"
      />
    </div>
  </button>
</template>

//
<script setup>
import { ref, watch, computed } from 'vue';
import { CheckCircleIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  className: {
    type: String,
    default: ''
  },
  resetTrigger: {
    type: Number,
    default: 0
  }
});
const pending = ref(false);
const check = ref(false);

const handleClick = () => {
  pending.value = true;
  setTimeout(() => {
    if (pending.value) {
      pending.value = false;
      check.value = true;
    }
  }, 2000);
};

watch(() => props.resetTrigger, () => {
  pending.value = false;
});

const buttonClass = computed(() => `cursor-pointer inline-flex justify-center px-4 py-2 text-sm font-medium border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 bg-transparent rounded-lg shadow-sm hover:bg-blue-50 dark:hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${props.className}`);
</script>
