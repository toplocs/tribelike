<template>
  <router-link v-if="is == 'interest'" :to="`/interest/${data.id}`">
    <InterestBadge
      :id="data.id"
      :title="data.title"
      :remove="handleRemove"
    >
      <Icon :icon="relation.type" />
      –
    </InterestBadge>
  </router-link>

  <router-link v-else :to="`/locations/${data.id}`">
    <InterestBadge
      :id="data.id"
      :title="data.title"
      :remove="handleRemove"
    >
      <Icon icon="like" />
    </InterestBadge>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  HeartIcon,
  BellIcon,
} from '@heroicons/vue/24/outline';
import InterestBadge from '@/components/badges/InterestBadge.vue';
import LocationBadge from '@/components/badges/LocationBadge.vue';
import Icon from '@/components/common/Icon.vue';
import { useRelation } from '@/composables/relationProvider';

const props = defineProps({
  is: {
    type: String,
    required: true,
  },
  relation: {
    type: Object,
    required: true,
  },
});
const { removeRelation } = useRelation();
const data = computed(() => props.relation?.two);

const handleRemove = async () => {
  const result = await removeRelation(props.relation);
}


</script>