<template>
  <div className="min-h-screen flex justify-center items-center">
    <Card className="pb-10">
      <div className="mb-2 flex flex-row justify-between">
        <BackButton />
      </div>
      <Title>
        {{ profile?.type }} – {{ profile?.username }}
      </Title>
      <img
        :src="profile?.image"
        alt="Avatar"
        class="w-48 h-48 rounded-full object-cover mx-auto mb-8"
      />

      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-2">
          About myself:
        </h2>
        <p v-if="profile?.about">
          {{ profile?.about }}
        </p>
      </div>

      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-2">
          My interests:
        </h2>
        <div class="flex flex-wrap gap-2">
          <router-link
            v-for="interest in profile?.interests"
            :key="interest.id"
            :to="`/interests/${interest.id}`"
          >
            <InterestBadge :title="interest.title" />
          </router-link>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-2">
          My locations:
        </h2>
        <div class="flex flex-wrap gap-2">
          <router-link
            v-for="location in profile?.locations"
            :key="location.id"
            :to="`/locations/${location.id}`"
          >
            <LocationBadge :title="location.title" />
          </router-link>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-2">
          My activities:
        </h2>
        <div class="flex flex-row flex-wrap gap-4">
          <Card
            v-for="feed of profileFeed"
            :key="feed.id"
            class="max-w-48"
          >
            <FeedListItem :feed="feed" />
          </Card>
        </div>
      </div>

    </Card>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Card from '../components/common/CardComponent.vue';
import Title from '../components/common/TitleComponent.vue';
import BackButton from '../components/common/BackButton.vue';
import LocationBadge from '../components/badges/LocationBadge.vue';
import InterestBadge from '../components/badges/InterestBadge.vue';
import FeedListItem from '../components/list/FeedListItem.vue';

const route = useRoute();
const profile = ref(null);
const profileFeed = ref([]);
const myProfile = inject('profile');

const formatDate = (date) => {
  return new Intl.DateTimeFormat('de', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

const fetchProfile = async (id: string) => {
  try {
    const response = await axios.get(`/api/profile/byId/${id}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const fetchProfileFeed = async (id: string) => {
  try {
    /*const response = await axios.get(`/api/profile/feed/${id}`);

    return response.data;*/
    return [
      {
        id: "1",
        profileId: "profile-1",
        activity: "Working",
        status: "CURRENTLY_AT",
        date: new Date(),
        interestId: "interest-1",
        interest: {
          id: "interest-1",
          title: "Photography",
        },
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

onMounted(async () => {
  profile.value = await fetchProfile(route.params.id);
  profileFeed.value = await fetchProfileFeed(route.params.id);
});

watch(() => route.params.id, async (newId) => {
  if (newId) profile.value = await fetchProfile(newId);
});
</script>
