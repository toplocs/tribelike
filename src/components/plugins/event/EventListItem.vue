<template>
  <div
    class="flex items-center p-4 w-full border-t border-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-150 ease-in-out cursor-pointer"
  >
    <div class="w-16 h-16 flex-shrink-0 flex flex-col justify-center items-center border-2 rounded-md mr-4">
      <span class="text-2xl font-bold">{{ eventDay }}</span>
      <span class="text-sm font-medium">{{ eventMonth }}</span>
    </div>

    <div class="flex-1">
      <div class="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {{ event.title }}
      </div>
      <div class="text-sm text-gray-600 dark:text-gray-400">
        {{ event.description }}
      </div>
      <div class="mt-4 flex flex-wrap gap-2">
        <InterestBadge
          v-for="interest in event.interests"
          :key="interest.id"
          :title="interest.title"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import InterestBadge from '../../../components/badges/InterestBadge.vue';

const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
});

const eventDate = new Date(props.event.date);
const eventDay = eventDate.getDate();
const eventMonth = eventDate.toLocaleString('default', { month: 'short' });
</script>
