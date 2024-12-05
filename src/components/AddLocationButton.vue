<template>
  <button
    v-if="!subscribed && location?.access == 1"
    @click="!asked && askAccess()"
    :class="[
      'px-4 py-2 rounded font-semibold transition-colors duration-200',
      subscribed ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
    ]"
  >
    <span>{{ asked ? 'Waiting' : 'Ask' }}</span>
  </button>

  <button
    v-else
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
  },
  subscribed: {
    type: Boolean,
    default: false,
  }
});

const profile = inject('profile');
const asked = computed(
  () => props.location.ask.includes(profile.value?.id)
);

const askAccess = async () => {
  try {
    const response = await axios.put(`/api/location/ask`, {
      profileId: profile.value?.id,
      locationId: props.location?.id,
    });
    props.location.ask.push(profile.value.id);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const addLocation = async () => {
  try {
    const response = await axios.put(`/api/location/add`, {
      profileId: profile.value?.id,
      locationId: props.location?.id,
    });
    profile.value.locations = [
      ...profile.value.locations, props.location
    ];

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
    profile.value.locations = profile.value.locations.filter(
      x => x.id !== props.location.id
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
}
</script>
