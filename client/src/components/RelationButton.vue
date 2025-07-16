<template>
  <button
    v-if="relationKey.id !== ''"
    :class="buttonClass"
    @click.prevent="handleClick"
  >
    <div class="float-left flex flex-row gap-2">
      <Icon :icon="relationKey.icon || 'heart'" />
      {{ capitalizedTitle }}
      <Icon v-if="isActive" icon="check" />
    </div>
  </button>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import Icon from '@/components/common/Icon.vue';
import { useProfile } from '@/composables/profileProvider';
import { useSphere } from '@/composables/sphereProvider';
import { useRelation } from '@/composables/relationProvider';

const colorMap = {
  green: 'border-green-400 text-green-400 hover:bg-green-50 hover:border-green-500 hover:text-green-500',
  blue: 'border-blue-400 text-blue-400 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-500',
  red: 'border-red-400 text-red-400 hover:bg-red-50 hover:border-red-500 hover:text-red-500',
  yellow: 'border-yellow-400 text-yellow-400 hover:bg-yellow-50 hover:border-yellow-500 hover:text-yellow-500',
};

const { relationKey } = defineProps({
  relationKey: {
    type: Object,
    required: true,
  }
});

const { profile } = useProfile();
const { sphere } = useSphere();
const { createRelation, removeRelation, compareRelation } = useRelation();

const isActive = ref(false);

const capitalizedTitle = computed(() => {
  const id = relationKey.id || '';
  return id.charAt(0).toUpperCase() + id.slice(1);
});

const buttonClass = computed(() => {
  const baseClasses = 'flex flex-row gap-1 px-4 py-2 cursor-pointer rounded font-semibold transition-colors duration-200 border-1 bg-transparent';
  const colorClasses = colorMap[relationKey.color || 'blue'] || colorMap.blue;
  
  return `${baseClasses} ${colorClasses}`;
});

watchEffect(async () => {
  if (profile.value?.id && sphere.value?.id) {
    const result = await compareRelation(
      profile.value?.id,
      relationKey.id,
      sphere.value?.id,
    );
    if (result) isActive.value = true;
  }
});

const handleClick = async () => {
  try {
    const result = await compareRelation(
      profile.value?.id,
      relationKey.id,
      sphere.value?.id,
    );
    console.log(result);
    if (result) {
      await removeRelation(
        profile.value?.id,
        relationKey.id,
        sphere.value?.id
      );
      isActive.value = false;
    } else {
      await createRelation(
        profile.value?.id,
        relationKey.id,
        sphere.value?.id
      );
      isActive.value = true;
    }
  } catch (error) {
    console.error(error);
  }
}
</script>