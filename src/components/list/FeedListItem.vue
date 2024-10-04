<template>
  <div class="p-2 border-t hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-150 ease-in-out cursor-pointer">
    <StatusBadge :title="feed?.status" />

    <div class="min-h-[100px] flex flex-col justify-between gap-2">
      <div v-if="feed.interests || feed.location" class="text-gray-700">
        <div class="flex items-center mb-2">
          <div class="mt-2 flex flex-wrap gap-2">
            <router-link
              v-for="interest in feed.interests"
              :to="`/interests/${interest.id}`"
            >
              <InterestBadge
                :key="interest.id"
                :title="interest.title"
              />
            </router-link>
          </div>
        </div>
        <Title>{{ feed.activity }}</Title>

        <div class="flex items-center">
            <a
              v-if="feed.location"
              class="text-sm text-blue-500 font-medium"
            > @{{ feed.location?.name }}
            </a>
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
import InterestBadge from '@/components/badges/InterestBadge.vue';

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