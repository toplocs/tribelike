<template>
  <Search
    placeholder="Search for anything ..."
    name="mixed"
    :findOptions="findMixed"
    @selected="handleSelection"
  />
</template>

//
<script setup lang="ts">
import { ref, inject, computed } from 'vue';
import { useRouter } from 'vue-router';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import TopicBadge from '@/components/badges/TopicBadge.vue';
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

const handleSelection = async (result: {
  id: string,
  title: string,
}) => {
  if (result.key == 'Interests')
    return router.push(`/interest/${result.option?.id}`);
  if (result.key == 'Locations')
    return router.push(`/location/${result.option?.id}`);
}
</script>
