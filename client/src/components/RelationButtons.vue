<template>
  <div class="space-y-2">
    <BigButton
      title="Like"
      icon="heart"
      color="green"
      :isPassive="true"
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
import { useInterest } from '@/composables/interestProvider';
import { relationProvider, useRelation } from '@/composables/relationProvider';

const { profile } = useProfile();
const { interest } = useInterest();
const { relations, compareRelation } = useRelation();

const handleClick = async () => {
  try {
    const result = await compareRelation(
      profile.value?.id,
      interest.value.id
    );
    console.log(result);

    /*if (!hasProfileRelation.value) {
      const result = await createRelation(
        'likes',
        profile.value?.id,
      );
      console.log(result);
    } */   
  } catch (error) {
    console.error(error);
  }
}
</script>
