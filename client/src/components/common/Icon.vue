<template>
  <HeartIcon
    v-if="icon == 'heart' || icon == 'like'"
    class="m-auto w-4 h-4"
  />
  <HeartIcon
    v-if="icon == 'love'"
    class="m-auto w-4 h-4"
  />
  <BellIcon
    v-if="icon == 'interested'"
    class="m-auto w-4 h-4"
  />
  <AcademicCapIcon
    v-if="icon == 'study' || icon == 'teaches'"
    class="m-auto w-4 h-4"
  />
  <CheckCircleIcon
    v-if="icon == 'check'"
    class="m-auto w-4 h-4"
  />
</template>

<script setup lang="ts">
import {
  HeartIcon,
  BellIcon,
  AcademicCapIcon,
  CheckCircleIcon,
} from '@heroicons/vue/24/outline';

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
});
</script>