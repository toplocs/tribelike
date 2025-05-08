<template>
  <BigButton
    :title="relationKey.id"
    :icon="relationKey.icon || 'heart'"
    :color="relationKey.color || 'blue'"
    :isPassive="isPassive"
    @click="handleClick"
  />
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import BigButton from '@/components/common/BigButton.vue';
import { useProfile } from '@/composables/profileProvider';
import { useTopic } from '@/composables/topicProvider';
import { useRelation } from '@/composables/relationProvider';

const props = defineProps({
  relationKey: {
    type: Object,
    required: true,
  }
});
const { profile } = useProfile();
const { topic } = useTopic();
const {
  createRelation,
  removeRelation,
  compareRelation
} = useRelation();
const isPassive = ref(false);

watchEffect(async () => {
  if (profile.value?.id && topic.value?.id) {
    const result = await compareRelation(
      profile.value?.id,
      props.relationKey.id,
      topic.value?.id,
    );
    if (result) isPassive.value = true;
  }
});

const handleClick = async () => {
  try {
    const result = await compareRelation(
      profile.value?.id,
      props.relationKey.id,
      topic.value?.id,
    );
    if (result) {
      await removeRelation(
        profile.value?.id,
        props.relationKey.id,
        topic.value?.id
      );
      isPassive.value = false;
    } else {
      await createRelation(
        profile.value?.id,
        props.relationKey.id,
        topic.value?.id
      );
      isPassive.value = true;
    }
  } catch (error) {
    console.error(error);
  }
}
</script>
