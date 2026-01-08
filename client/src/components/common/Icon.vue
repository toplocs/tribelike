<template>
  <StarIcon
    v-if="icon == 'like'"
    class="m-auto w-4 h-4"
  />
  <HeartIcon
    v-if="icon == 'heart'"
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
  <SparklesIcon
    v-if="icon == 'teaches'"
    class="m-auto w-4 h-4"
  />
  <CheckCircleIcon
    v-if="icon == 'check'"
    class="m-auto w-4 h-4"
  />
  <HomeIcon
    v-if="icon == 'house'"
    class="m-auto w-4 h-4"
  />
  <ArrowSmallRightIcon
    v-if="icon == 'shoe'"
    class="m-auto w-4 h-4"
  />
</template>

<script setup lang="ts">
import {
  HeartIcon,
  BellIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  HomeIcon,
  ArrowSmallRightIcon,
  StarIcon,
  SparklesIcon,
} from '@heroicons/vue/24/outline';

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
});
</script>