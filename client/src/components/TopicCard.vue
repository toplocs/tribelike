<template>
  <div>
    <Card class="flex flex-row items-center gap-2 p-2 text-center">
      <span class="font-medium">
          {{ relation.type }}
        </span>
        <router-link :to="`/topic/${topic?.id}`">
          <TopicBadge :title="topic?.title" />
        </router-link>

      <div class="absolute top-1 right-1 h-6 w-6">
        <Icon :icon="relation.type" />
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/common/Card.vue';
import Icon from '@/components/common/Icon.vue';
import TopicBadge from '@/components/badges/TopicBadge.vue';

const props = defineProps({
  topic: {
    type: Object,
    required: true,
  },
  relation: {
    type: Object,
    required: false,
  }
});
</script>
