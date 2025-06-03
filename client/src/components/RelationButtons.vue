<template>
  <div class="mt-4 flex flex-wrap gap-2">
    <RelationButton
      v-for="relationKey of profileToTopic"
      :relationKey="relationKey"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import RelationButton from '@/components/RelationButton.vue';
import { profileToTopic } from '@/assets/relationKeys.ts';
</script>
