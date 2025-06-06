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
import { profileToTopic, profileToLocation } from '@/assets/relationKeys';

const props = defineProps<{
  for: 'topic' | 'location',
}>();

const relationMap = {
  topic: profileToTopic,
  location: profileToLocation,
};

const relationKeys = computed(() => relationMap[props.for] || []);
</script>
