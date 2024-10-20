<template>
  <div className="max-w-sm flex flex-row gap-2">
    <IconButton
      tooltipText="Open search field"
      :icon="MagnifyingGlassIcon"
      @click="toggleSearch"
    />

    <Search
      v-if="!hideSearch"
      placeholder="Add a location ..."
      name="selectedItem"
      :findOptions="findLocations"
      @selected="handleSelection"
    />
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
    default: true,
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

const hideSearch = ref(props.hideSearch);

const findLocations = async (title: string) => {
  try {
    const response = await axios.get(`/api/location?title=${title}`);

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
  if (props.defaultLocations.some(x => x.id === result.id)) return;
  props.addLocation(result);
};
</script>
