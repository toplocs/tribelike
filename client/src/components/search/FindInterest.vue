<template>
  <div className="max-w-sm flex flex-row gap-2">
    <Search
      placeholder="Add an interest ..."
      name="interests"
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
      <TopicBadge
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
import TopicBadge from '@/components/badges/TopicBadge.vue';
import IconButton from '@/components/common/IconButton.vue';
import Search from '@/components/search/Index.vue';

const props = defineProps({
  defaultInterests: {
    type: Array,
    default: [],
  },
  hideSearch: {
    type: Boolean,
    default: false,
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
const profile = inject('profile');
const hideSearch = ref(props.hideSearch);

const findInterests = async (title: string) => {
  try {
    const response = await axios.get(`/api/interest?title=${title}`);

    return {
      Interests: response.data,
    }
  } catch (error) {
    console.error(error);
  }
}

const toggleSearch = () => {
  hideSearch.value = !hideSearch.value;
}

const handleSelection = async ({ option }) => {
  if (props.defaultInterests.some(x => x.id === option.id)) return;
  profile.value.interests.push(option);
  props.addInterest(option);
};
</script>
