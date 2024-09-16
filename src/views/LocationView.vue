<template>
  <div className="min-h-screen flex justify-center items-center">
    <Card className="space-y-2">
      <div className="mb-2 flex flex-row justify-between">
        <BackButton href="/locations" />
        <button
          v-if="subscribed"
          @click="removeLocation"
          class="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-transparent rounded-lg hover:bg-red-50 dark:hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
        > Deabonnieren
        </button>
        <button
          v-if="!subscribed"
          @click="addLocation"
          class="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-transparent rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        > Abonnieren
        </button>
      </div>

      <Title>{{ location?.title }}</Title>

      <span v-if="location?.parent">
        Übergeordneter Ort:
        <router-link :to="`/locations/${location.parent?.id}`">
         <LocationBadge :title="location.parent?.title" />
        </router-link>
      </span>

      <Map
        height="200"
        :locked="true"
        :defaultLocation="[
          Number(yCoordinate),
          Number(xCoordinate)
        ]"
      />

      <Title>Personen an diesem Ort:</Title>
      <div className="flex flex-row gap-2">
        <div v-for="suggestion of people">
          <ProfileImage
            :src="suggestion.image"
            :tooltipText="suggestion.username"
          />
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
import ProfileImage from '../components/common/ProfileImage.vue';
import Map from '../components/MapComponent.vue';

const route = useRoute();
const location = ref(null);
const profile = inject('profile');
const yCoordinate = computed(() => location.value?.yCoordinate || '0');
const xCoordinate = computed(() => location.value?.xCoordinate || '0');
const subscribed = computed(() => profile.value?.locations.some(x => x.id == location.value?.id));
const people = computed(() => location.value?.profiles.filter(x => x.id !== profile.value?.id));

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
    console.log(profile.value)
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

onMounted(async () => {
  location.value = await fetchLocation(route.params.id);
});

watch(() => route.params.id, async (newId) => {
  if (newId) location.value = await fetchLocation(newId);
});
</script>
