<template>
  <h3 class="mb-2">Add a relation</h3>
  <FindContext
    v-if="!searchResult"
    :context="{
      key: 'location',
      value: location,
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
    <InterestBadge
      v-if="searchResult.key == 'Interests'"
      :title="searchResult.option.title"
      :remove="() => setSearchResult(null)"
    />
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject, watch } from 'vue';
import SelectInput from '@/components/common/SelectInput.vue';
import FindContext from '@/components/search/FindContext.vue';
import LocationBadge from '@/components/badges/LocationBadge.vue';
import InterestBadge from '@/components/badges/InterestBadge.vue';
import relationKeys from '@/assets/relationKeys';

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
const location = inject('location');
const relationKey = ref('');
const searchResult = ref(null);

const addInterestRelation = async (id: String) => {
  try {
    const response = await axios.post(`/api/v2/location/interests/${location.value.id}`, {
      key: relationKey.value,
      interestId: id,
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
    const response = await axios.post(`/api/v2/location/locations/${location.value.id}`, {
      key: relationKey.value,
      otherLocationId: id,
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
    const response = await axios.post(`/api/v2/location/profiles/${location.value.id}`, {
      key: relationKey.value,
      profileId: id,
    }, {
      headers: { "Content-Type": "application/json" }
    });
    emit('update:profileRelations', [...props.profileRelations, {
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
