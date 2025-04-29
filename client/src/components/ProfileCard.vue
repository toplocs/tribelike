<template>
  <div>
    <Card class="flex flex-row mx-4 items-center gap-2 p-3 text-center">
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

      <HeartIcon
        v-if="relation.type == 'like'"
        class="absolute top-1 right-1 h-6 w-6"
      />
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { HeartIcon } from '@heroicons/vue/24/outline';
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
