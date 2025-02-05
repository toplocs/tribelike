<template>
  <div className="max-w-sm flex flex-row gap-2">
    <Search
      placeholder="Add an location ..."
      name="locations"
      :findOptions="findLocations"
      @selected="handleSelection"
    >
      <router-link :to="`/location/create`">
        <li class="py-2 px-4 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-100">
          Create new location
        </li>
      </router-link>
    </Search>
  </div>
  <div class="mt-4 flex flex-wrap gap-2">
    <router-link
      v-for="location in defaultLocations"
      :to="`/location/${location.id}`"
    >
      <LocationBadge
        :key="location.id"
        :title="location.title"
        :remove="() => removeLocation(location)"
      />
    </router-link>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject, computed } from 'vue';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import LocationBadge from '@/components/badges/LocationBadge.vue';
import IconButton from '@/components/common/IconButton.vue';
import Search from '@/components/search/Index.vue';

const props = defineProps({
  defaultLocations: {
    type: Array,
    default: [],
  },
  hideSearch: {
    type: Boolean,
    default: false,
  },
  addLocation: {
    type: Function,
    required: true,
  },
  removeLocation: {
    type: Function,
    required: true,
  }
});
const profile = inject('profile');
const hideSearch = ref(props.hideSearch);

const findLocations = async (title: string) => {
  try {
    const response = await axios.get(`/api/location?title=${title}`);

    return {
      Locations: response.data,
    }
  } catch (error) {
    console.error(error);
  }
}

const toggleSearch = () => {
  hideSearch.value = !hideSearch.value;
}

const handleSelection = async ({ option }) => {
  if (props.defaultLocations.some(x => x.id === option.id)) return;
  profile.value.locations.push(option);
  props.addLocation(option);
};
</script>
