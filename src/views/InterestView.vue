<template>
  <div className="min-h-screen flex justify-center items-center">
    <Card className="pb-10">
      <div className="mb-2 flex flex-row justify-between">
        <BackButton href="/main" />
        <button
          v-if="subscribed"
          @click="removeInterest"
          class="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-transparent rounded-lg hover:bg-red-50 dark:hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
        > Deabonnieren
        </button>
        <button
          v-if="!subscribed"
          @click="addInterest"
          class="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-transparent rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        > Abonnieren
        </button>
      </div>
      <Title>
        {{ interest?.title }}
      </Title>
      <span v-if="interest?.parent">
        Übergeordnete Interesse:
        <router-link :to="`/interests/${interest.parent?.id}`">
         <Badge :title="interest.parent?.title" />
        </router-link>
      </span>
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
import Badge from '../components/common/BadgeComponent.vue';

const route = useRoute();
const interest = ref(null);
const profile = inject('profile');
const subscribed = computed(() => 
  profile.value?.interests.some(x => x.id == interest.value?.id)
);

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
      profile.value.interests = [...profile.value.interests, interest.value];
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
    if (!res.ok) throw new Error(response);
    if (profile.value && interest.value) {
      profile.value.interests = profile.value.interests.filter(x => x.id !== interest.value.id);
    }

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  interest.value = await fetchInterest(route.params.id);
});

watch(() => route.params.id, async (newId) => {
  if (newId) interest.value = await fetchInterest(newId);
});
</script>
