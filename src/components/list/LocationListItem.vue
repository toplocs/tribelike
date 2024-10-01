<template>
  <div>
    <StatusBadge :title="feed.status" />

    <div class="min-h-[100px] flex flex-col justify-between gap-2">
      <div v-if="feed.interest || feed.location" class="text-gray-700">
        <div class="flex items-center mb-2">
          <span v-if="feed.interest" class="text-sm font-medium">
            {{ feed.interest?.title }}
          </span>
        </div>

        <div class="flex items-center">
          <router-link>
            <a
              v-if="feed.location"
              class="text-sm text-blue-500 font-medium"
            > @{{ feed.location?.name }}
            </a>
          </router-link>
        </div>
      </div>

      <p class="text-xs text-gray-500 ">
        {{ formatDate(feed.date) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Title from '@/components/common/TitleComponent.vue';
import StatusBadge from '@/components/badges/StatusBadge.vue';

const props = defineProps({
  feed: {
    type: Object,
    required: true,
  },
});

const formatDate = (date) => {
  return new Intl.DateTimeFormat('de', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
</script>

<style scoped>
/* Optional: Custom styles can be added here if needed */
</style>
