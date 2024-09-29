<template>
  <div className="min-h-screen flex justify-center items-center">
    <Card className="pb-10">
      <Title float="center">
        My locations:
      </Title>

      <div className="flex flex-row gap-2">
        <Search
          placeholder="Search for a location ..."
          name="selectedItem"
          :findOptions="findLocations"
          @selected="handleSelection"
        />
        <Dialog>
          <template #trigger="{ openDialog }">
            <IconButton
              :icon="PlusIcon"
              @click="openDialog"
            />
          </template>

          <template #content="{ closeDialog }">
            <LocationDialog
              :closeDialog="(x) => {
                handleSelection(x);
                closeDialog();
              }"
            />
          </template>
        </Dialog>
      </div>
      <div class="mt-4 flex flex-wrap gap-2">
        <router-link
          v-for="location in locations"
          :to="`/locations/${location.id}`"
        >
          <LocationBadge
            :key="location.id"
            :title="location.title"
          />
        </router-link>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject, computed } from 'vue';
import { useRoute } from 'vue-router';
import { PlusIcon } from '@heroicons/vue/24/outline';
import Card from '../components/common/CardComponent.vue';
import Title from '../components/common/TitleComponent.vue';
import LocationBadge from '../components/badges/LocationBadge.vue';
import IconButton from '../components/common/IconButton.vue';
import Dialog from '../components/dialog/DialogComponent.vue';
import LocationDialog from '../components/dialog/LocationDialog.vue';
import Search from '../components/search/SearchComponent.vue';

const profile = inject('profile');
const locations = computed(() => profile.value?.locations || []);

const findLocations = async (title: string) => {
  try {
    const response = await axios.get(`/api/location?title=${title}`);

    return response.data
  } catch (error) {
    console.error(error);
  }
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
</script>
