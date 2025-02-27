<template>
  <div>
    <slot name="trigger" :openDialog="openDialog"></slot>

    <transition
      enter-active-class="transition-opacity duration-300 ease-out"
      leave-active-class="transition-opacity duration-300 ease-in"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 flex items-center justify-center z-50"
      >
        <div
          class="fixed inset-0 bg-black bg-opacity-50"
          @click="closeDialog"
        ></div>

        <div class="bg-white dark:bg-gray-800 w-[400px] rounded-lg shadow-lg p-4 z-50">
          <slot name="content" :closeDialog="closeDialog"></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isOpen = ref(false);

const openDialog = () => {
  isOpen.value = true;
};

const closeDialog = () => {
  isOpen.value = false;
};
</script>
