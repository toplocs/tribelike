<template>
  <router-link :to="`/${relation.to.isA}/${relation.to.id}`">
    <InterestBadge
      v-if="relation.from.isA == 'interest'"
      :title="relation.to.title"
      :remove="() => removeRelation(relation.id)"
    />

    <LocationBadge
      v-if="relation.from.isA == 'location'"
      :title="relation.to.title"
      :remove="() => removeRelation(relation.id)"
    />
  </router-link>
</template>

<script setup lang="ts">
import axios from 'axios';
import type { PropType } from 'vue';
import InterestBadge from '@/components/badges/InterestBadge.vue';
import LocationBadge from '@/components/badges/LocationBadge.vue';

const props = defineProps({
  relation: {
    type: Object as PropType<Relation>,
    required: true,
  },
});

const emit = defineEmits(['removeRelation'])

const removeRelation = async (id: string) => {
  try {
    const response = await axios.delete(`/api/v2/relation/${id}`);
    emit('removeRelation', id);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}


</script>