<template>
  <div class="flex flex-wrap gap-2">
    <RelationButton
      v-for="relationKey of relationKeys"
      :relationKey="relationKey"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import RelationButton from '@/components/RelationButton.vue';
import relationKeys from '@/assets/relationKeys.ts';
</script>
