<template>
  <div
    class="flex items-center p-4 w-full border-t border-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-150 ease-in-out cursor-pointer"
    @click="onClick(user)"
  >
    <img
      src="/images/default.jpeg"
      alt="Avatar"
      class="w-12 h-12 rounded-full object-cover mr-4"
    />
    <div class="flex-1">
      <div class="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {{ user.username }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  onClick: {
    type: Function,
    required: false,
  }
});
</script>