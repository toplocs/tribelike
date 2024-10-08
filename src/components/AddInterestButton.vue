<template>
  <button
    @click="subscribed ? removeInterest() : addInterest()"
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
  }
});

const profile = inject('profile');
const subscribed = computed(() => profile.value?.interests.some(x => x.id == props.interest?.id));

const addInterest = async () => {
  try {
    const response = await axios.put(`/api/interest/add`, {
      profileId: profile.value?.id,
      interestId: props.interest?.id,
    });
    if (profile.value && props.interest) {
      profile.value.interests = [
        ...profile.value.interests, props.interest
      ];
    }

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const removeInterest = async () => {
  try {
    const response = await axios.put(`/api/interest/remove`, {
      profileId: profile.value?.id,
      interestId: props.interest?.id,
    });
    if (profile.value && props.interest) {
      profile.value.interests = profile.value.interests.filter(
        x => x.id !== props.interest.id
      );
    }

    return response.data;
  } catch (error) {
    console.error(error);
  }
}
</script>
