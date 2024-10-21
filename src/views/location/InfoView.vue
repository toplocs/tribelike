<template>
  <Container>
    <div class="w-full">
      <div>
        <div
          v-for="activity of locationActivity"
          :key="activity.id"
          className="w-full"
        >
          <ActivityListItem :activity="activity" />
        </div>
      </div>
      
    </div>

    <Sidebar>
      <div className="py-4 border-t dark:border-gray-700">
        <Map
          height="200"
          :zoom="7"
          :locked="true"
          :defaultLocation="[
            Number(yCoordinate),
            Number(xCoordinate)
          ]"
        />
      </div>

      <div className="py-4 border-t dark:border-gray-700">
        <AddLocationButton :location="location" />
      </div>

      <div className="py-4 border-t dark:border-gray-700">
        <Title>Other people at this location:</Title>
        <div className="flex flex-row gap-2">
          <div v-for="suggestion of people">
            <router-link :to="`/profile/${suggestion.id}`">
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
import Container from '@/components/common/Container.vue';
import Title from '@/components/common/Title.vue';
import Sidebar from '@/components/SideBar.vue';
import Map from '@/components/MapComponent.vue';
import LocationBadge from '@/components/badges/LocationBadge.vue';
import ProfileImage from '@/components/common/ProfileImage.vue';
import ActivityListItem from '@/components/list/ActivityListItem.vue';
import AddLocationButton from '@/components/AddLocationButton.vue';

const route = useRoute();
const locationActivity = ref([]);
const location = inject('location');
const profile = inject('profile');
const tab = inject('tab');
const yCoordinate = computed(() => location.value?.yCoordinate || '0');
const xCoordinate = computed(() => location.value?.xCoordinate || '0');
const people = computed(() => location.value?.profiles.filter(x => x.id !== profile.value?.id));

const fetchLocationActivity = async (id: string) => {
  try {
    const response = await axios.get(`/api/activity`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

watchEffect(async () => {
  locationActivity.value = await fetchLocationActivity(location.value?.id);
});

onMounted(() => {
  tab.value = 'Info';
});
</script>
