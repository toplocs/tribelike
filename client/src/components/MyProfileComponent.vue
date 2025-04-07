<template>
  <div class="w-full">
    <div class="mb-8 flex flex-row gap-2">
      <img
        :src="profile?.image"
        alt="Avatar"
        class="w-48 h-48 rounded-full object-cover mr-10"
      />

      <div class="flex-grow"></div>

      <router-link :to="`/profile/${profile?.id}/settings`">
        <IconButton :icon="Cog6ToothIcon" class="mb-8"/>
      </router-link>
    </div>

    <div>
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

    <div class="mb-8">
      <div class="flex flex-wrap gap-2">
        <span
          v-for="activity of profileActivity"
          :key="activity.id"
          className="w-full pb-2"
        >
          <ActivityListItem :activity="activity" />
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Cog6ToothIcon } from '@heroicons/vue/24/outline';

import Container from '@/components/common/Container.vue';
import Card from '@/components/common/Card.vue';
import IconButton from '@/components/common/IconButton.vue';
import ActivityListItem from '@/components/list/ActivityListItem.vue';
import FindInterest from '@/components/search/FindInterest.vue';
import FindLocation from '@/components/search/FindLocation.vue';

const router = useRouter();
const profiles = ref([]);
const profileActivity = ref([]);

const props = defineProps({
  profile: {
    type: Object,
    required: true
  }
});

/*const fetchProfileActivity = async (id: string) => {
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
      profileId: props.profile.id,
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
      profileId: props.profile.id,
      interestId: interest.id,
    });
    if (props.profile) {
      props.profile.interests = props.profile.interests.filter(
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
      profileId: props.profile.id,
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
      profileId: props.profile.id,
      locationId: location.id,
    });
    if (props.profile) {
      props.profile.locations = props.profile.locations.filter(
        x => x.id !== location.id,
      );
    }

    return response.data;
  } catch (error) {
    console.error(error);
  }
}*/


onMounted(async () => {

});
</script>
