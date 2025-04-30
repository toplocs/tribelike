<template>
  <div class="space-y-2">
    <BigButton
      :title="relationKey.id"
      :icon="relationKey.icon || 'heart'"
      :color="relationKey.color || 'blue'"
      :isPassive="isPassive"
      @click="handleClick"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import BigButton from '@/components/common/BigButton.vue';
import { useProfile } from '@/composables/profileProvider';
import { useInterest } from '@/composables/interestProvider';
import { useRelation } from '@/composables/relationProvider';

const props = defineProps({
  relationKey: {
    type: Object,
    required: true,
  }
});
const { profile } = useProfile();
const { interest } = useInterest();
const { relations, compareRelation } = useRelation();
const isPassive = ref(false);

watchEffect(async () => {
  if (profile.value?.id && interest.value?.id) {
    const result = await compareRelation(
      profile.value?.id,
      interest.value?.id,
      props.relationKey.id,
    );
    if (result) isPassive.value = true;
  }
});

const handleClick = async () => {
  try {
    const result = await compareRelation(
      profile.value?.id,
      interest.value?.id
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
