<template>
  <div class="w-[200px]">
    <Card class="flex flex-row">
      <router-link>
        <img
          alt="Avatar"
          className="w-[60px] h-[60px] rounded-full mx-auto"
          :src="profile.image"
          @click=""
        />
      </router-link>
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