<template>
  <Container>
    <div class="w-full">
      <div className="mb-2 flex flex-row justify-between">
        <button
          v-if="subscribed"
          @click="removeInterest"
          class="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-transparent rounded-lg hover:bg-red-50 dark:hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
        > Remove
        </button>
        <button
          v-if="!subscribed"
          @click="addInterest"
          class="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-transparent rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        > Add
        </button>
      </div>


      <div>
        <Title>This is happening:</Title>
        <div
          v-for="feed of interestFeed"
          :key="feed.id"
          className="w-full"
        >
          <FeedListItem :feed="feed" />
        </div>
      </div>
      
    </div>

    <Sidebar>
      <div className="pb-4">
        <Title>Other people at this interest:</Title>
        <div className="flex flex-row gap-2">
          <div v-for="suggestion of people">
            <router-link :to="`/profiles/${suggestion.id}`">
              <ProfileImage
                :src="suggestion.image"
                :tooltipText="suggestion.username"
                size="small"
              />
            </router-link>
          </div>
        </div>
      </div>
    </Sidebar>

  </Container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject, computed, watchEffect, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Container from '@/components/common/ContainerComponent.vue';
import Sidebar from '@/components/SideBar.vue';
import Title from '@/components/common/TitleComponent.vue';
import ProfileImage from '@/components/common/ProfileImage.vue';
import FeedListItem from '@/components/list/FeedListItem.vue';

const route = useRoute();
const interest = inject('interest');
const profile = inject('profile');
const tab = inject('tab');
const interestFeed = ref([]);
const people = computed(() => interest.value?.profiles.filter(x => x.id !== profile.value?.id));

const fetchInterestFeed = async (id: string) => {
  try {
    /*const response = await axios.get(`/api/interest/${id}/activity`);

    return response.data;*/
    return [
      {
        id: "1",
        profileId: "profile-1",
        activity: "Felix joined Ponta do sol",
        status: "CURRENTLY_AT",
        date: new Date(),
        interests: [...profile.value?.interests],
        locationId: "location-1",
        location: {
          id: "location-1",
          name: "New York City",
        },
      },
      {
        id: "2",
        profileId: "profile-2",
        activity: "Working",
        status: "FAVOURITE",
        date: new Date(),
        locationId: "location-2",
        location: {
          id: "location-2",
          name: "Paris",
        },
      },
      {
        id: "3",
        profileId: "profile-3",
        activity: "Working",
        status: "GOING_NEXT",
        date: new Date(),
        interests: [...profile.value?.interests],
        locationId: "location-3",
        location: {
          id: "location-3",
          name: "Yosemite National Park",
        },
      },
      {
        id: "4",
        profileId: "profile-4",
        activity: "Working",
        status: "CURRENTLY_AT",
        date: new Date(),
        interests: [...profile.value?.interests],
        locationId: "location-4",
        location: {
          id: "location-4",
          name: "Bali",
        },
      },
      {
        id: "5",
        profileId: "profile-5",
        activity: "Working",
        status: "FAVOURITE",
        date: new Date(),
        interests: [...profile.value?.interests],
        locationId: "location-5",
        location: {
          id: "location-5",
          name: "Tokyo",
        },
      },
    ]
  } catch (error) {
    console.error(error);
  }
}

watchEffect(async () => {
  interestFeed.value = await fetchInterestFeed(interest.value.id);
});

onMounted(() => {
  tab.value = 'Activity';
});
</script>
