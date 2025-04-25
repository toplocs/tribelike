<template>
  <button
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
import { useProfile } from '@/composables/profileProvider';
import { useRelation } from '@/composables/relationProvider';

const props = defineProps({//to addRelationButton???
  to: String,
});
const { profile } = useProfile();
const { relations, createRelation } = useRelation();


const handleClick = async () => {
  try {
    await createRelation(
      'like',
      profile.value?.id,
      props?.to,
    );
    await createRelation(
      'likes',
      props?.to,
      profile.value?.id,
    );
    console.log(relations.value);
    
  } catch (error) {
    console.error(error);
  }
}
</script>
