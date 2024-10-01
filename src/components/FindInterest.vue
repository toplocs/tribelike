<template>
  <div className="max-w-sm flex flex-row gap-2">
    <IconButton
      tooltipText="Open search field"
      :icon="MagnifyingGlassIcon"
      @click="toggleSearch"
    />

    <Search
      v-if="!hideSearch"
      placeholder="Add an interest ..."
      name="selectedItem"
      :findOptions="findInterests"
      @selected="handleSelection"
    />
  </div>
  <div class="mt-4 flex flex-wrap gap-2">
    <router-link
      v-for="interest in interests"
      :to="`/interests/${interest.id}`"
    >
      <InterestBadge
        :key="interest.id"
        :title="interest.title"
      />
    </router-link>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject, computed } from 'vue';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid';
import InterestBadge from '../components/badges/InterestBadge.vue';
import IconButton from '../components/common/IconButton.vue';
import Search from '../components/search/SearchComponent.vue';

const profile = inject('profile');
const hideSearch = ref(true);
const interests = computed(() => profile.value?.interests || []);

const findInterests = async (title: string) => {
  try {
    const response = await axios.get(`/api/interest?title=${title}`);

    return response.data
  } catch (error) {
    console.error(error);
  }
}

const toggleSearch = () => {
  hideSearch.value = !hideSearch.value;
}

const handleSelection = async (result: {
  id: string,
  title: string
}) => {
  if (interests.value.some(x => x.id === result.id)) return;
  interests.value.push(result);
  addInterest(result.id);
};

const addInterest = async (interestId: string) => {
  try {
    const response = await axios.put(`/api/interest/add`, {
      profileId: profile.value?.id,
      interestId: interestId,
    });

    return response.data;
  } catch (error) {
    console.error(error);
  }
}
</script>
