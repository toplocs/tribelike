<template>
  <router-link :to="`/interest/${interest.id}`">
    <InterestBadge
      :id="interest.id"
      :title="interest.title"
      :remove="handleRemove"
    >
      <HeartIcon
        v-if="relation.type == 'like'"
        class="w-4 h-4"
      />
      <BellIcon
        v-if="relation.type == 'interested'"
        class="w-4 h-4"
      />
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
import { useRelation } from '@/composables/relationProvider';

const props = defineProps({
  relation: {
    type: Object,
    required: true,
  },
});
const { removeRelation } = useRelation();
const interest = computed(() => props.relation?.two);

const handleRemove = async () => {
  const result = await removeRelation(props.relation);
}


</script>