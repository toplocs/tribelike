<template>
  <BigButton
    :title="capitalizedTitle"
    :icon="relationKey.icon || 'heart'"
    :color="relationKey.color || 'blue'"
    :isPassive="isPassive"
    @click="handleClick"
  />
</template>

//
<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import BigButton from '@/components/common/BigButton.vue';
import { useProfile } from '@/composables/profileProvider';
import { useSphere } from '@/composables/sphereProvider';
import { useRelation } from '@/composables/relationProvider';

const props = defineProps({
  relationKey: {
    type: Object,
    required: true,
  }
});
const { profile } = useProfile();
const { sphere } = useSphere();
const {
  createRelation,
  removeRelation,
  compareRelation
} = useRelation();
const isPassive = ref(false);
const capitalizedTitle = computed(() => {
  const id = props.relationKey.id || '';
  return id.charAt(0).toUpperCase() + id.slice(1);
});

watchEffect(async () => {
  if (profile.value?.id && sphere.value?.id) {
    const result = await compareRelation(
      profile.value?.id,
      props.relationKey.id,
      sphere.value?.id,
    );
    if (result) isPassive.value = true;
  }
});

const handleClick = async () => {
  try {
    const result = await compareRelation(
      profile.value?.id,
      props.relationKey.id,
      sphere.value?.id,
    );
    if (result) {
      await removeRelation(
        profile.value?.id,
        props.relationKey.id,
        sphere.value?.id
      );
      isPassive.value = false;
    } else {
      await createRelation(
        profile.value?.id,
        props.relationKey.id,
        sphere.value?.id
      );
      isPassive.value = true;
    }
  } catch (error) {
    console.error(error);
  }
}
</script>
