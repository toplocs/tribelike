<template>
  <div class="w-[300px]">
    <Card class="flex flex-row items-center gap-2 p-3 text-center">
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

        <div
          v-if="relation && relation.type"
          class="text-sm text-gray-600"
        >
          {{ profile?.username }}
          {{ relation.type }}
          <span class="font-medium">
            {{ relation.two?.title }}
          </span>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Card from '@/components/common/Card.vue';

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
