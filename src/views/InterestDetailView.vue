<template>
  <SubNav
    :initialTab="tab"
    :tabs="[
      { value: 'Activity', href: `/interest/${interest?.id}` },
      { value: 'Chat', href: `/interest/${interest?.id}/chat` },
      { value: 'Wiki', href: `/interest/${interest?.id}/wiki` },
      { value: 'Events', href: `/interest/${interest?.id}/events` },
      { value: 'Settings', href: `/interest/${interest?.id}/settings` },
    ]"
  />

  <router-view />

</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject, provide, watch, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import SubNav from '../components/SubNav.vue';

const route = useRoute();
const interest = inject('interest');
const tab = ref('');

const fetchInterest = async (id: string) => {
  try {
    const response = await axios.get(`/api/interest/byId/${id}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const addInterest = async () => {
  try {
    const response = await axios.put(`/api/interest/add`, {
      profileId: profile.value?.id,
      interestId: interest.value?.id,
    });
    if (profile.value && interest.value) {
      profile.value.interests = [
        ...profile.value.interests, interest.value
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
      interestId: interest.value?.id,
    });
    if (profile.value && interest.value) {
      profile.value.interests = profile.value.interests.filter(
        x => x.id !== interest.value.id
      );
    }

    return response.data;
  } catch (error) {
    console.error(error);
  }
}


watch(() => route.params.id, async (newId) => {
  if (newId) interest.value = await fetchInterest(newId);
});

onMounted(async () => {
  interest.value = await fetchInterest(route.params.id);
});

onUnmounted(() => {
  interest.value = null;
});

provide('tab', tab);
</script>
