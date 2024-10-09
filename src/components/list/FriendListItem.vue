<template>
  <div
    class="flex min-w-[200px] items-center p-4 w-full border-t border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-150 ease-in-out cursor-pointer"
    @click="onClick(profile)"
  >
    <img
      :src="profile?.image"
      alt="Avatar"
      class="w-8 h-8 rounded-full object-cover mr-2"
    />
    <div class="flex-1">
      <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">
        {{ profile.username }}
      </div>
    </div>

    <CheckBox label="Select the profile" name="selectProfile" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CheckBox from '@/components/common/CheckBox.vue';

const props = defineProps({
  profile: {
    type: Object,
    required: true,
  },
  onClick: {
    type: Function,
    required: false,
  }
});
</script>