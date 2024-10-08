<template>
  <button
    @click="subscribed ? removeLocation() : addLocation()"
    :class="[
      'px-4 py-2 rounded font-semibold transition-colors duration-200',
      subscribed ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
    ]"
  >
    {{ subscribed ? 'Remove' : 'Add' }}
  </button>
</template>

<script setup lang="ts">
import axios from 'axios';
import { inject, computed } from 'vue';

const props = defineProps({
  location: {
    type: Object,
    required: true,
  }
});

const profile = inject('profile');
const subscribed = computed(() => profile.value?.locations.some(x => x.id == props.location?.id));

const addLocation = async () => {
  try {
    const response = await axios.put(`/api/location/add`, {
      profileId: profile.value?.id,
      locationId: props.location?.id,
    });
    if (profile.value && props.location) {
      profile.value.locations = [
        ...profile.value.locations, props.location
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
      locationId: props.location?.id,
    });
    if (profile.value && props.location) {
      profile.value.locations = profile.value.locations.filter(
        x => x.id !== props.location.id
      );
    }

    return response.data;
  } catch (error) {
    console.error(error);
  }
}
</script>
