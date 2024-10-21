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
    >
      <router-link :to="`/interest/create`">
        <li class="py-2 px-4 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-100">
          Create new interest
        </li>
      </router-link>
    </Search>
  </div>
  <div class="mt-4 flex flex-wrap gap-2">
    <router-link
      v-for="interest in defaultInterests"
      :to="`/interest/${interest.id}`"
    >
      <InterestBadge
        :key="interest.id"
        :title="interest.title"
        :remove="() => removeInterest(interest)"
      />
    </router-link>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject, computed } from 'vue';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import InterestBadge from '@/components/badges/InterestBadge.vue';
import IconButton from '@/components/common/IconButton.vue';
import Search from '@/components/search/Index.vue';

const props = defineProps({
  defaultInterests: {
    type: Array,
    default: [],
  },
  hideSearch: {
    type: Boolean,
    default: true,
  },
  addInterest: {
    type: Function,
    required: true,
  },
  removeInterest: {
    type: Function,
    required: true,
  }
});

const hideSearch = ref(props.hideSearch);

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
  if (props.defaultInterests.some(x => x.id === result.id)) return;
  props.addInterest(result);
};
</script>
