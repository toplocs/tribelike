<template>
  <div className="min-h-screen flex justify-center items-center">
    <Card className="pb-10">
      <div className="mb-2 flex flex-row justify-between">
        <BackButton />
      </div>

      <div class="flex">
        <div class="w-16 h-16 flex-shrink-0 flex flex-col justify-center items-center border-2 rounded-md mr-4">
          <span class="text-2xl font-bold">{{ eventDay }}</span>
          <span class="text-sm font-medium">{{ eventMonth }}</span>
        </div>

        <div class="flex-1">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            {{ event?.title }}
          </h1>

          <p class="text-gray-700 mb-6">
            {{ event?.description }}
          </p>

          <div v-if="event?.location" class="mb-8">
            <h2 class="text-lg font-semibold text-gray-900 mb-2">
              Happening here:
            </h2>
            <router-link :to="`/locations/${event?.location.id}`">
              <LocationBadge :title="event?.location.title" />
            </router-link>
          </div>

          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-900 mb-2">
              Relevant interests:
            </h2>
            <div class="flex flex-wrap gap-2">
              <router-link
                v-for="interest in event?.interests"
                :key="interest.id"
                :to="`/interests/${interest.id}`"
              >
                <InterestBadge :title="interest.title" />
              </router-link>
            </div>
          </div>

          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-900 mb-2">
              People who already joined:
            </h2>
            <div class="flex flex-wrap gap-2">
              <ProfileImage
                v-for="profile of profiles"
                size="medium"
                :src="profile?.image"
                :tooltipText="profile?.username"
              />
            </div>
          </div>

          <div class="mt-6">
            <button class="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-150">
              Join the Event
            </button>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Card from '@/components/common/Card.vue';
import Title from '@/components/common/Title.vue';
import BackButton from '@/components/common/BackButton.vue';
import LocationBadge from '@/components/badges/LocationBadge.vue';
import InterestBadge from '@/components/badges/InterestBadge.vue';
import ProfileImage from '@/components/common/ProfileImage.vue';

import events from './service.ts';

const route = useRoute();
const event = ref(null);
const profile = inject('profile');
const eventDate = computed(() => new Date(event.value?.date));
const eventDay = computed(() => eventDate.value?.getDate());
const eventMonth = computed(() => eventDate.value?.toLocaleString('default', { month: 'short' }));

const profiles = computed(() => [profile.value, profile.value, profile.value])

const fetchEvent = async (id: string) => {
  try {
    const response = events.find(x => x.id == id);

    return response;
  } catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  event.value = await fetchEvent(route.params.id);
});
</script>
