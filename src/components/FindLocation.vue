<template>
  <div className="max-w-sm flex flex-row gap-2">
    <IconButton
      tooltipText="Open search field"
      :icon="MagnifyingGlassIcon"
      @click="toggleSearch"
    />

    <Search
      v-if="!hideSearch"
      placeholder="Add a location ..."
      name="selectedItem"
      :findOptions="findLocations"
      @selected="handleSelection"
    />
  </div>
  <div class="mt-4 flex flex-wrap gap-2">
    <router-link
      v-for="location in locations"
      :to="`/location/${location.id}`"
    >
      <LocationBadge
        :key="location.id"
        :title="location.title"
        :remove="() => removeLocation(location.id)"
      />
    </router-link>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject, computed } from 'vue';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid';
import LocationBadge from '../components/badges/LocationBadge.vue';
import IconButton from '../components/common/IconButton.vue';
import Search from '../components/search/Index.vue';

const profile = inject('profile');
const hideSearch = ref(true);
const locations = computed(() => profile.value?.locations || []);

const findLocations = async (title: string) => {
  try {
    const response = await axios.get(`/api/location?title=${title}`);

    return response.data
  } catch (error) {
    console.error(error);
  }
}

const toggleSearch = () => {
  hideSearch.value = !hideSearch.value;
}

const handleSelection = async (result: {
  id: string,
  title: string
}) => {
  if (locations.value.some(x => x.id === result.id)) return;
  locations.value.push(result);
  addLocation(result.id);
};

const addLocation = async (locationId: string) => {
  try {
    const response = await axios.put(`/api/location/add`, {
      profileId: profile.value?.id,
      locationId: locationId,
    });

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const removeLocation = async (locationId: string) => {
  try {
    const response = await axios.put(`/api/location/remove`, {
      profileId: profile.value?.id,
      locationId: locationId,
    });
    if (profile.value) {
      profile.value.locations = profile.value.locations.filter(
        x => x.id !== locationId,
      );
    }

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

</script>
