<template>
  <div className="min-h-screen flex justify-center items-center">
    <Card className="pb-10">
      <div className="mb-2 flex flex-row justify-between">
        <BackButton />
      </div>
      <Title>
        {{ profile?.type }} – {{ profile?.username }}
      </Title>
      <img
        :src="profile?.image"
        alt="Avatar"
        class="w-48 h-48 rounded-full object-cover mx-auto mb-8"
      />

      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-2">
          About myself:
        </h2>
        <p v-if="profile?.about">
          {{ profile?.about }}
        </p>
      </div>

      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-2">
          My interests:
        </h2>
        <div class="flex flex-wrap gap-2">
          <router-link
            v-for="interest in profile?.interests"
            :key="interest.id"
            :to="`/interests/${interest.id}`"
          >
            <InterestBadge :title="interest.title" />
          </router-link>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-2">
          My locations:
        </h2>
        <div class="flex flex-wrap gap-2">
          <router-link
            v-for="location in profile?.locations"
            :key="location.id"
            :to="`/locations/${location.id}`"
          >
            <LocationBadge :title="location.title" />
          </router-link>
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
import InterestBadge from '../components/badges/InterestBadge.vue';

const route = useRoute();
const profile = ref(null);
const myProfile = inject('profile');

const fetchProfile = async (id: string) => {
  try {
    const response = await axios.get(`/api/profile/byId/${id}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  profile.value = await fetchProfile(route.params.id);
});

watch(() => route.params.id, async (newId) => {
  if (newId) profile.value = await fetchProfile(newId);
});
</script>
