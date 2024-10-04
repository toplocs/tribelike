<template>
  <SubNav
    :initialTab="tab"
    :tabs="[
      { value: 'Activity', href: `/location/${location?.id}` },
      { value: 'Chat', href: `/location/${location?.id}/chat` },
      { value: 'Wiki', href: `/location/${location?.id}/wiki` },
      { value: 'Events', href: `/location/${location?.id}/events` },
      { value: 'Settings', href: `/location/${location?.id}/settings` },
    ]"
  />

  <router-view />

</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, provide, inject, watch, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import SubNav from '@/components/SubNav.vue';

const route = useRoute();
const location = inject('location');
const tab = ref('');

const fetchLocation = async (id: string) => {
  try {
    const response = await axios.get(`/api/location/byId/${id}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const addLocation = async () => {
  try {
    const response = await axios.put(`/api/location/add`, {
      profileId: profile.value?.id,
      locationId: location.value?.id,
    });
    if (profile.value && location.value) {
      profile.value.locations = [
        ...profile.value.locations, location.value
      ];
    }

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const removeLocation = async () => {
  try {
    const response = await axios.put(`/api/location/remove`, {
      profileId: profile.value?.id,
      locationId: location.value?.id,
    });
    if (profile.value && location.value) {
      profile.value.locations = profile.value.locations.filter(
        x => x.id !== location.value.id
      );
    }

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

watch(() => route.params.id, async (newId) => {
  console.log(newId)
  if (newId) location.value = await fetchLocation(newId);
});

onMounted(async () => {
  location.value = await fetchLocation(route.params.id);
});

onUnmounted(() => {
  location.value = null;
});

provide('tab', tab);
</script>
