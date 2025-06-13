<template>
  <div>
    <Card class="flex flex-row items-center gap-2 p-2 text-center">
      <router-link :to="`/profile/${profile?.id}`">
        <img
          alt="Avatar"
          class="w-[60px] h-[60px] rounded-full mx-auto"
          :src="profile?.image"
        />
      </router-link>

      <div>
        <div class="text-base font-semibold">
          {{ profile?.username }}
        </div>
        <span class="font-medium">
          {{ relation.type }}
        </span>
      </div>

      <div class="absolute top-1 right-1 h-6 w-6">
        <Icon :icon="relation.type" />
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/common/Card.vue';
import Icon from '@/components/common/Icon.vue';

const props = defineProps({
  profile: {
    type: Object,
    required: true,
  },
  relation: {
    type: Object,
    required: false,
  }
});
</script>
