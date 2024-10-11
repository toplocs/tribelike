<template>
  <div class="p-2 border-b hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 transition duration-150 ease-in-out cursor-pointer">
    <StatusBadge :title="normalize(activity?.status)" />

    <div class="min-h-[100px] flex flex-col justify-between gap-2">
      <div v-if="activity.interests || activity.location" class="text-gray-700">
        <div class="mb-2 flex items-center">
          <div class="flex flex-wrap gap-1">
            <router-link
              v-for="interest in activity.interests"
              :key="interest.id"
              :to="`/interest/${interest.id}`"
            >
              <InterestBadge
                :key="interest.id"
                :title="interest.title"
              />
            </router-link>
          </div>
        </div>

        <p class="font-semibold dark:text-white">
          {{ activity.text }}
        </p>

        <div class="flex items-center">
          <router-link
            v-if="activity.location"
            :to="`/location/${activity.locationId}`"
            class="text-sm text-blue-500 font-medium"
          > @{{ activity.location?.name }}
          </router-link>
        </div>
      </div>

      <p class="text-xs text-gray-500 ">
        {{ formatDate(new Date(activity.date)) }}
        <router-link :to="`/profile/${activity.profileId}`">
          by {{ activity.profile?.username }}
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import StatusBadge from '@/components/badges/StatusBadge.vue';
import InterestBadge from '@/components/badges/InterestBadge.vue';

const props = defineProps({
  activity: {
    type: Object,
    required: true,
  },
});

const normalize = (text: string) => {
  if (!text) return;
  return text
  .toLowerCase()
  .replace(/_/g, " ")
  .replace(/\b\w/g, (char) => char.toUpperCase())
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
</script>