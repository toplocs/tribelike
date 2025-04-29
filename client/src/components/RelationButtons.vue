<template>
  <button
    v-if="!hasProfileRelation"
    @click="handleClick"
    :class="[
      'px-4 py-2 cursor-pointer rounded font-semibold transition-colors duration-200',
      subscribed ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
    ]"
  >
    Like
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useProfile } from '@/composables/profileProvider';
import { useRelation } from '@/composables/relationProvider';

const props = defineProps({//to addRelationButton???
  to: String,
});
const { profile } = useProfile();
const { relations, createRelation } = useRelation();
const hasProfileRelation = computed(() => {
  return relations.value.some(x =>
    x.one === profile.value?.id || x.two === profile.value?.id
  );
});

const handleClick = async () => {
  try {
    if (!hasProfileRelation.value) {
      const result = await createRelation(
        'likes',
        profile.value?.id,
      );
      console.log(result);
    }    
  } catch (error) {
    console.error(error);
  }
}
</script>
