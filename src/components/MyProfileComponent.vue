<template>
  <Container>
    <div class="w-full">
      <div class="mb-8 flex flex-row justify-between">
        <router-link :to="`/profile/${profile?.id}/settings`">
          <IconButton :icon="Cog6ToothIcon" />
        </router-link>
      </div>

      <div class="mb-8 flex flex-row gap-2">
        <img
          :src="profile?.image"
          alt="Avatar"
          class="w-48 h-48 rounded-full object-cover mr-10"
        />

        <Card v-if="profile?.about?.length" class="mb-8">
          <p v-if="profile?.about">
            {{ profile?.about }}
          </p>
        </Card>
      </div>

      <div class="mb-8">
        <FindInterest
          :defaultInterests="profile?.interests"
          :addInterest="addInterest"
          :removeInterest="removeInterest"
        />
      </div>

      <div class="mb-8">
        <FindLocation
          :defaultLocations="profile?.locations"
          :addLocation="addLocation"
          :removeLocation="removeLocation"
        />
      </div>
    </div>

    <SideBar>
      <h2 class="text-lg font-semibold text-gray-900 mb-2 dark:text-gray-300">
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
    </SideBar>

  </Container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject, onMounted } from 'vue';
import {
  ChatBubbleLeftIcon,
  PencilIcon,
  Cog6ToothIcon,
} from '@heroicons/vue/24/outline';
import SideBar from '@/components/SideBar.vue';
import Container from '@/components/common/Container.vue';
import Card from '@/components/common/Card.vue';
import Title from '@/components/common/Title.vue';
import BackButton from '@/components/common/BackButton.vue';
import ActivityListItem from '@/components/list/ActivityListItem.vue';
import Dialog from '@/components/dialog/DialogComponent.vue';
import ProfileSettingsDialog from '@/components/dialog/ProfileSettingsDialog.vue';
import IconButton from '@/components/common/IconButton.vue';
import FindInterest from '@/components/search/FindInterest.vue';
import FindLocation from '@/components/search/FindLocation.vue';

import Plugins from '@/components/plugins/Plugins.vue';

const profile = inject('profile');
const profileActivity = ref([]);

const formatDate = (date) => {
  return new Intl.DateTimeFormat('de', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}


const fetchProfileActivity = async (id: string) => {
  try {
    const response = await axios.get(`/api/activity`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const addInterest = async (interest: Object) => {
  try {
    const response = await axios.put(`/api/interest/add`, {
      profileId: profile.value?.id,
      interestId: interest.id,
    });

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const removeInterest = async (interest: Object) => {
  try {
    const response = await axios.put(`/api/interest/remove`, {
      profileId: profile.value?.id,
      interestId: interest.id,
    });
    if (profile.value) {
      profile.value.interests = profile.value.interests.filter(
        x => x.id !== interest.id
      );
    }

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const addLocation = async (location: Object) => {
  try {
    const response = await axios.put(`/api/location/add`, {
      profileId: profile.value?.id,
      locationId: location.id,
    });

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const removeLocation = async (location: Object) => {
  try {
    const response = await axios.put(`/api/location/remove`, {
      profileId: profile.value?.id,
      locationId: location.id,
    });
    if (profile.value) {
      profile.value.locations = profile.value.locations.filter(
        x => x.id !== location.id,
      );
    }

    return response.data;
  } catch (error) {
    console.error(error);
  }
}


onMounted(async () => {
  profileActivity.value = await fetchProfileActivity(profile.value?.id);
});
</script>
