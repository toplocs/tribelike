<template>
  <router-link :to="`/${path}/${relationId}`">
    <InterestBadge
      v-if="path == 'interest'"
      :title="relationTitle"
      :remove="() => removeRelation(relation)"
    />

    <LocationBadge
      v-if="path == 'location'"
      :title="relationTitle"
      :remove="() => removeRelation(relation)"
    />
  </router-link>
</template>

<script setup lang="ts">
import axios from 'axios';
import InterestBadge from '@/components/badges/InterestBadge.vue';
import LocationBadge from '@/components/badges/LocationBadge.vue';

const props = defineProps({
  is: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  relation: {
    type: Object,
    required: true,
  },
  relationId: {
    type: String,
    required: true,
  },
  relationTitle: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['removeRelation'])

const removeRelation = async (relation) => {
  try {
    const response = await axios.delete(`/api/v2/${props.is}/${props.path}s/${props.relation.id}`);
    emit('removeRelation', props.relation.id);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}


</script>