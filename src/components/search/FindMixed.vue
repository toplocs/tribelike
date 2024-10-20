<template>
  <Search
    placeholder="Search for anything ..."
    name="selectedItem"
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

const router = useRouter();
const profile = inject('profile');
const hideSearch = ref(true);
const interests = computed(() => profile.value?.interests || []);

const findInterests = async (title: string) => {
  try {
    const response = await axios.get(`/api/interest?title=${title}`);
    response.data?.map(x => x.title = 'interest/'+x.title)

    return response.data
  } catch (error) {
    console.error(error);
  }
}

const findLocations = async (title: string) => {
  try {
    const response = await axios.get(`/api/location?title=${title}`);
    response.data?.map(x => x.title = 'location/'+x.title)

    return response.data
  } catch (error) {
    console.error(error);
  }
}

const findWikis = async (title: string) => {
  try {
    const response = await axios.get(`/api/plugins/wiki?title=${title}`);
    response.data?.map(x => x.title = 'wiki/'+x.title)

    return response.data
  } catch (error) {
    console.error(error);
  }
}

const findOnGithub = async (title: string) => {
  try {
    const response = await axios.get(`https://api.github.com/search/repositories?q=${title}`);
    const result = [];
    if (response.data?.items) response.data.items.length = 20;
    for (let item of response.data?.items) {
      result.push({
        title: 'github/'+item.full_name,
      });
    }

    return result;
  } catch (error) {
    console.error(error);
    return [];
  }
}

const findMixed = async (title: string) => {
  let result = [];
  const interests = await findInterests(title);
  const locations = await findLocations(title);
  const wikis = await findWikis(title);
  const github = await findOnGithub(title);
  result = [...interests, ...locations, ...wikis, ...github];

  return result;
}

const handleSelection = async (result: {
  id: string,
  title: string,
}) => {
  if (result.title?.includes('interest'))
    return router.push(`/interest/${result.id}`);
  if (result.title?.includes('location'))
    return router.push(`/location/${result.id}`);
  if (result.title?.includes('wiki'))
    return router.push(`/wiki/${result.id}`);
  else {
    const values = result.title.split('/');
    router.push(`/interest/create?title=${values[1]}?parent=${values[0]}`);
  }
}
</script>
