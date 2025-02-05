<template>
  <Search
    placeholder="Search for anything ..."
    name="mixed"
    :findOptions="findMixed"
    @selected="handleSelection"
  />
</template>

<script setup lang="ts">
import axios from 'axios';
//import { Octokit, App } from "https://esm.sh/octokit";
import { ref, inject, computed } from 'vue';
import { useRouter } from 'vue-router';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import InterestBadge from '@/components/badges/InterestBadge.vue';
import IconButton from '@/components/common/IconButton.vue';
import Search from '@/components/search/Index.vue';

const props = defineProps({
  context: { //Find profiles in this context only
    type: Object,
    required: false,
  }
});
const emit = defineEmits(['searchResult'])
const router = useRouter();
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

const findLocations = async (title: string) => {
  try {
    const response = await axios.get(`/api/location?title=${title}`);

    return response.data
  } catch (error) {
    console.error(error);
  }
}

const findMixed = async (title: string) => {
  let result = {};
  result.Interests = await findInterests(title);
  result.Locations = await findLocations(title);

  return result;
}

const handleSelection = async (result: object) => {
  emit('searchResult', result);
}
</script>
