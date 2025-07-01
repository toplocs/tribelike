<template>
  <div class="mt-4 flex flex-wrap gap-2">
    <RelationButton
      v-for="relationKey in relationKeys"
      :key="relationKey"
      :relationKey="relationKey"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import RelationButton from '@/components/RelationButton.vue';
import { profileRelations } from '@/assets/relationKeys';

const props = defineProps<{
  for: 'topic' | 'location',
}>();

const relationKeys = computed(() =>
  profileRelations.filter(x => x.accepts.includes(props.for))
);
</script>