<template>
  <h3 class="mb-2">Add a relation</h3>
  <FindContext
    v-if="!searchResult"
    :context="{
      key: 'interest',
      value: interest,
    }"
    @searchResult="setSearchResult"
  />
  <div
    v-if="searchResult"
    class="mb-2 py-2 flex flex-row w-full gap-4 border-b"
  >
    <SelectInput
      name="relationKey"
      placeholder="Select a relation"
      :options="relationKeys"
      v-model="relationKey"
    />
    <LocationBadge
      v-if="searchResult.key == 'Locations'"
      :title="searchResult.option.title"
      :remove="() => setSearchResult(null)"
    />
    <TopicBadge
      v-if="searchResult.key == 'Interests'"
      :title="searchResult.option.title"
      :remove="() => setSearchResult(null)"
    />
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject, watch, computed } from 'vue';
import SelectInput from '@/components/common/SelectInput.vue';
import FindContext from '@/components/search/FindContext.vue';
import LocationBadge from '@/components/badges/LocationBadge.vue';
import TopicBadge from '@/components/badges/TopicBadge.vue';

const defaultRelationKeys = [];

const props = defineProps({
  interestRelations: Array,
  locationRelations: Array,
  profileRelations: Array,
});
const emit = defineEmits([
  'update:interestRelations',
  'update:locationRelations',
  'update:profileRelations'
]);
const interest = inject('interest');
const relationKey = ref('');
const searchResult = ref(null);

const relationKeys = computed(() => {
  console.log(searchResult.value);
  console.log(defaultRelationKeys.interestToInterest);
  if (searchResult.value) {
    if (searchResult.value.key == 'Interests') {
      return defaultRelationKeys.interestToInterest;
    } else if (searchResult.value.key == 'Locations') {
      return defaultRelationKeys.locationToInterest;
    }
  }
  return [];
});

const addInterestRelation = async (id: String) => {
  try {
    const response = await axios.post(`/api/v2/interest/interests/${interest.value.id}`, {
      key: relationKey.value,
      otherInterestId: id,
    }, {
      headers: { "Content-Type": "application/json" }
    });
    emit('update:interestRelations', [
      ...props.interestRelations,
      response.data,
    ]);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}


const addLocationRelation = async (id: String) => {
  try {
    const response = await axios.post(`/api/v2/interest/locations/${interest.value.id}`, {
      key: relationKey.value,
      locationId: id,
    }, {
      headers: { "Content-Type": "application/json" }
    });
    emit('update:locationRelations', [
      ...props.locationRelations,
      response.data,
    ]);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const addProfileRelation = async (id: String) => {
  try {
    const response = await axios.post(`/api/v2/interest/profiles/${interest.value.id}`, {
      key: relationKey.value,
      profileId: id,
    }, {
      headers: { "Content-Type": "application/json" }
    });
    emit('update:interestRelations', [...props.profileRelations, {
      title: id,
    }]);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const setSearchResult = (result: object) => {
  searchResult.value = result;
}

watch(relationKey, () => {
  const { key, option } = searchResult.value;
  if (key == 'Interests') {
    addInterestRelation(option.id);
  } else if (key == 'Locations') {
    addLocationRelation(option.id);
  } else if (key == 'Profiles') {
    addProfileRelation(option.id);
  }
  setSearchResult(null);
});
</script>
