<template>
  <HeartIcon
    v-if="icon == 'like'"
    class="w-4 h-4"
  />
  <HeartIcon
    v-if="icon == 'likes'"
    class="m-auto w-4 h-4"
  />
  <BellIcon
    v-if="icon == 'interested'"
    class="m-auto w-4 h-4"
  />
  <AcademicCapIcon
    v-if="icon == 'study'"
    class="m-auto w-4 h-4"
  />
</template>

<script setup lang="ts">
import {
  HeartIcon,
  BellIcon,
  AcademicCapIcon,
} from '@heroicons/vue/24/outline';

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
});
</script>