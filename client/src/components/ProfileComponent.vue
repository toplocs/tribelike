<template>
  <Container>
    <div class="w-full">
      <div class="mb-8 flex flex-row justify-between">
        <img
          :src="profile?.image"
          alt="Avatar"
          class="w-48 h-48 rounded-full object-cover mr-10"
        />
      </div>

      <div class="mb-8 flex flex-row gap-2">
        <Card v-if="profile?.about?.length" class="mb-8">
          <p v-if="profile?.about">
            {{ profile?.about }}
          </p>
        </Card>
      </div>

      <div v-if="profile?.interests.length" class="mb-8">
        <div class="mt-4 flex flex-wrap gap-2">
          <Card>
            <router-link
              v-for="interest in profile?.interests"
              :to="`/interest/${interest.id}`"
            >
              <InterestBadge
                :key="interest.id"
                :title="interest.title"
              />
            </router-link>
          </Card>
        </div>
      </div>

      <div v-if="profile?.locations.length" class="mb-8">
        <div class="mt-4 flex flex-wrap gap-2">
          <Card>
            <router-link
              v-for="location in profile?.locations"
              :to="`/location/${location.id}`"
            >
              <LocationBadge
                :key="location.id"
                :title="location.title"
              />
            </router-link>
          </Card>
        </div>
      </div>
      <div class="mb-8 flex flex-row justify-between">
        <div class="mt-4 flex flex-wrap gap-2">
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

    <SideBar>
    </SideBar>

  </Container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject, onMounted, defineAsyncComponent } from 'vue';
import Sidebar from '@/components/SideBar.vue';
import Container from '@/components/common/Container.vue';
import Card from '@/components/common/Card.vue';
import Title from '@/components/common/Title.vue';
import BackButton from '@/components/common/BackButton.vue';
import ActivityListItem from '@/components/list/ActivityListItem.vue';
import IconButton from '@/components/common/IconButton.vue';
import LocationBadge from '@/components/badges/LocationBadge.vue';
import InterestBadge from '@/components/badges/InterestBadge.vue';
import SideBar from '@/components/SideBar.vue';

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
    ]
  } catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  profileActivity.value = await fetchProfileActivity(props.profile?.id);
});
</script>
