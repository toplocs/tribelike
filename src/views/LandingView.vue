<template>
  <div className="min-h-screen flex flex-col justify-center">
    <div class="my-4">
      <p class="text-center uppercase tracking-wide text-lg">
        Welcome Stranger. Explore TOPLOCS
      </p>
    </div>


    <Container>
      <div class="mx-auto max-w-lg w-full">
       <Map height="300" :zoom="5" />
      </div>
    </Container>

    <Container>
      <div className="mx-auto max-w-lg w-full flex flex-col gap-2">
        <Search
          placeholder="Search for locations"
          name="selectedItem"
          :findOptions="findLocations"
          @selected="handleLocationSelection"
        />
        <div class="flex flex-wrap gap-2">
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
      <div className="mx-auto max-w-lg w-full flex flex-col gap-2">
        <Search
          placeholder="Search for interests"
          name="selectedItem"
          :findOptions="findInterests"
          @selected="handleInterestSelection"
        />
        <div class="flex flex-wrap gap-2">
          <router-link
            v-for="interest in interests"
            :to="`/interest/${interest.id}`"
          >
            <InterestBadge
              :key="interest.id"
              :title="interest.title"
            />
          </router-link>
        </div>
      </div>
    </Container>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Container from '@/components/common/ContainerComponent.vue';
import Title from '@/components/common/TitleComponent.vue';
import InterestBadge from '@/components/badges/InterestBadge.vue';
import LocationBadge from '@/components/badges/LocationBadge.vue';
import Search from '@/components/search/Index.vue';
import Map from '@/components/MapComponent.vue';

const router = useRouter();
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
