<template>
  <Container>
    <div class="w-full">
      <div class="mb-8 flex flex-row gap-2">
        <img
          :src="profile?.image"
          alt="Avatar"
          class="w-48 h-48 rounded-full object-cover mr-10"
        />

        <Card v-if="profile?.about" class="mb-8">
          <span class="flex flex-row items-center gap-2 mb-2">
            <IconButton :icon="Cog6ToothIcon" />
          </span>
          <p v-if="profile?.about?.length">
            {{ profile?.about }}
          </p>
        </Card>
      </div>

      <div v-if="profile?.interests.length" class="mb-8">
        <div class="mt-4 flex flex-wrap gap-2">
          <router-link
            v-for="interest in profile?.interests"
            :to="`/interest/${interest.id}`"
          >
            <InterestBadge
              :key="interest.id"
              :title="interest.title"
            />
          </router-link>
        </div>
      </div>

      <div v-if="profile?.locations.length" class="mb-8">
        <div class="mt-4 flex flex-wrap gap-2">
          <router-link
            v-for="location in profile?.locations"
            :to="`/location/${location.id}`"
          >
            <LocationBadge
              :key="location.id"
              :title="location.title"
            />
          </router-link>
        </div>
      </div>

    </div>

    <Sidebar>
      <h2 class="text-lg font-semibold text-gray-900 mb-2">
        My activities:
      </h2>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="activity of profileActivity"
          :key="activity.id"
          className="w-full pb-2"
        >
          <ActivityListItem :activity="activity" />
        </span>
      </div>
    </Sidebar>

  </Container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted } from 'vue';
import {
  ChatBubbleLeftIcon,
  PencilIcon,
  Cog6ToothIcon,
} from '@heroicons/vue/24/outline';
import Sidebar from '@/components/SideBar.vue';
import Container from '@/components/common/Container.vue';
import Card from '@/components/common/Card.vue';
import Title from '@/components/common/Title.vue';
import BackButton from '@/components/common/BackButton.vue';
import ActivityListItem from '@/components/list/ActivityListItem.vue';
import Dialog from '@/components/dialog/DialogComponent.vue';
import IconButton from '@/components/common/IconButton.vue';
import LocationBadge from '@/components/badges/LocationBadge.vue';
import InterestBadge from '@/components/badges/InterestBadge.vue';

import Plugins from '@/components/plugins/Plugins.vue';

const props = defineProps({
  profile: {
    type: Object,
    required: false
  }
});

const profileActivity = ref([]);

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}


const fetchProfileActivity = async (id: string) => {
  try {
    /*const response = await axios.get(`/api/profile/activity/${id}`);

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
  profileActivity.value = await fetchProfileActivity(props.profile?.id);
});
</script>
