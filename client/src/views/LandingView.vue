<template>
  <div className="min-h-screen flex flex-col justify-center">
    <div class="my-4">
      <h1 class="text-center uppercase tracking-wide text-sm dark:text-white">
        <p class="text-lg font-bold">
          Welcome {{ profile?.username || 'Stranger' }}.
        </p><br />
        Communities, Activities, Interests and Locations. Worldwide!
      </h1>
    </div>

    <Container v-if="false">
      <div className="mx-auto max-w-lg w-full flex flex-col gap-2">
        <FindMixed />

        <div class="flex flex-wrap gap-2">
          <router-link
            v-for="interest in interests"
            :to="`/interest/${interest.id}`"
          >
            <TopicBadge
              :key="interest.id"
              :title="interest.title"
            />
          </router-link>
          <router-link
            v-for="location in locations"
            :to="`/location/${location.id}`"
          >
            <LocationBadge
              :key="location.id"
              :title="location.title"
            />
          </router-link>
        </div>
      </div>
    </Container>

    <Container>
      <GunTest />
    </Container>

      <Container>
      <PluginTest />
    </Container>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Container from '@/components/common/Container.vue';
import TopicBadge from '@/components/badges/TopicBadge.vue';
import LocationBadge from '@/components/badges/LocationBadge.vue';
import FindMixed from '@/components/search/FindMixed.vue';
import GunTest from '@/components/GunTest.vue';
import PluginTest from '@/components/PluginTest.vue';

const router = useRouter();
const profile = inject('profile');
const interests = ref([]);
const locations = ref([]);

const findInterests = async (title: string) => {
  try {
    const response = await axios.get(`/api/interest?title=${title}`);

    return response.data
  } catch (error) {
    console.error(error);
  }
}

const findLocations = async (title: string) => {
  try {
    const response = await axios.get(`/api/location?title=${title}`);

    return response.data
  } catch (error) {
    console.error(error);
  }
}


const handleInterestSelection = async (result: {
  id: string,
}) => {
  router.push(`/interest/${result.id}`)
};

const handleLocationSelection = async (result: {
  id: string,
}) => {
  router.push(`/location/${result.id}`)
};

onMounted(async () => {
  interests.value = await findInterests('');
  locations.value = await findLocations('');
});
</script>
