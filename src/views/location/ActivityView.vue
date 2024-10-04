<template>
  <Container>
    <div class="w-full">
      <div className="mb-2 flex flex-row justify-between">
        <button
          v-if="subscribed"
          @click="removeLocation"
          class="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-transparent rounded-lg hover:bg-red-50 dark:hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
        > Remove
        </button>
        <button
          v-if="!subscribed"
          @click="addLocation"
          class="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-transparent rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        > Add
        </button>
      </div>


      <div>
        <Title>This is happening:</Title>
        <div
          v-for="feed of locationFeed"
          :key="feed.id"
          className="w-full"
        >
          <FeedListItem :feed="feed" />
        </div>
      </div>
      
    </div>

    <Sidebar>
      <div className="mb-4 border-b">
        <Title>Map:</Title>
        <Map
          height="200"
          :locked="true"
          :defaultLocation="[
            Number(yCoordinate),
            Number(xCoordinate)
          ]"
        />
      </div>

      <div className="pb-4">
        <Title>Other people at this location:</Title>
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
import Title from '@/components/common/TitleComponent.vue';
import Sidebar from '@/components/SideBar.vue';
import Map from '@/components/MapComponent.vue';
import LocationBadge from '@/components/badges/LocationBadge.vue';
import ProfileImage from '@/components/common/ProfileImage.vue';
import FeedListItem from '@/components/list/FeedListItem.vue';

const route = useRoute();
const locationFeed = ref([]);
const location = inject('location');
const profile = inject('profile');
const tab = inject('tab');
const yCoordinate = computed(() => location.value?.yCoordinate || '0');
const xCoordinate = computed(() => location.value?.xCoordinate || '0');
const subscribed = computed(() => profile.value?.locations.some(x => x.id == location.value?.id));
const people = computed(() => location.value?.profiles.filter(x => x.id !== profile.value?.id));

const fetchLocationFeed = async (id: string) => {
  try {
    /*const response = await axios.get(`/api/location/${id}/activity`);

    return response.data;*/
    return [
      {
        id: "1",
        profileId: "profile-1",
        activity: "Felix joined Ponta do sol",
        status: "CURRENTLY_AT",
        date: new Date(),
        interestId: "interest-1",
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
        interestId: "interest-3",
        interest: {
          id: "interest-3",
          title: "Rock Climbing",
        },
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
        interestId: "interest-4",
        interest: {
          id: "interest-4",
          title: "Writing",
        },
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
        interestId: "interest-5",
        interest: {
          id: "interest-5",
          title: "Video Editing",
        },
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
  locationFeed.value = await fetchLocationFeed(location.value.id);
});

onMounted(() => {
  tab.value = 'Activity';
});
</script>
