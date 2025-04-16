<template>
  <button
    @click="likeInterest"
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
import { useInterest } from '@/composables/interestProvider';

const props = defineProps({

});
const { profile, like, getProfile } = useProfile();
const { interest } = useInterest();

const likeInterest = async () => {
  try {
    console.log(interest.value);
    const result = await like('interest', interest.value);
    const test = await getProfile(profile.value.id);
    console.log(test);
    console.log(result);

  } catch (error) {
    console.error(error);
  }
}
</script>
