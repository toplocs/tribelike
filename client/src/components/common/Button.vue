<template>
  <button
    @click="useAction"
    class="cursor-pointer w-full inline-flex justify-center px-4 py-2 text-sm font-medium rounded-lg text-green-600 dark:text-green-300 bg-green-50 dark:bg-green-800 hover:bg-green-100 dark:hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
  > <slot />
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  href: {
    type: String,
    required: false,
  },
});
const emit = defineEmits(['useAction'])

const useAction = () => {
 if (props.href) {
  router.push(`/${props.href}`)
 }
};
</script>
