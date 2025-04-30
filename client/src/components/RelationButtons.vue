<template>
  <div class="space-y-2">
    <BigButton
      title="Like"
      icon="heart"
      color="green"
      @click="handleClick"
    />

    <BigButton
      title="Studying"
      icon="study"
      color="blue"
      @click="handleClick"
    />

    <BigButton
      title="Studying"
      icon="study"
      color="red"
      @click="handleClick"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BigButton from '@/components/common/BigButton.vue';
import { useProfile } from '@/composables/profileProvider';
import { useRelation } from '@/composables/relationProvider';

const { profile } = useProfile();
const { relations, createRelation } = useRelation(); //provide profile relations for children 
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
