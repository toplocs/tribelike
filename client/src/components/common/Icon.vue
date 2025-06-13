<template>
  <HeartIcon
    v-if="icon == 'heart' || icon == 'like'"
    class="m-auto w-3 h-3"
  />
  <HeartIcon
    v-if="icon == 'love'"
    class="m-auto w-3 h-3"
  />
  <BellIcon
    v-if="icon == 'interested'"
    class="m-auto w-3 h-3"
  />
  <AcademicCapIcon
    v-if="icon == 'study' || icon == 'teaches'"
    class="m-auto w-3 h-3"
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