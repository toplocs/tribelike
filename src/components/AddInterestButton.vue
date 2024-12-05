<template>
  <button
    v-if="!subscribed && interest?.access == 1"
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
  interest: {
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
  () => props.interest.ask.includes(profile.value?.id)
);

const askAccess = async () => {
  try {
    const response = await axios.put(`/api/interest/ask`, {
      profileId: profile.value?.id,
      interestId: props.interest?.id,
    });
    props.interest.ask.push(profile.value.id);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const addLocation = async () => {
  try {
    const response = await axios.put(`/api/interest/add`, {
      profileId: profile.value?.id,
      interestId: props.interest?.id,
    });
    profile.value.interests = [
      ...profile.value.interests, props.interest
    ];

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const removeLocation = async () => {
  try {
    const response = await axios.put(`/api/interest/remove`, {
      profileId: profile.value?.id,
      interestId: props.interest?.id,
    });
    profile.value.interests = profile.value.interests.filter(
      x => x.id !== props.interest.id
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
}
</script>
