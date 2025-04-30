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
import { useRelation } from '@/composables/relationProvider';
import gun from '@/services/gun';

const { relations } = useRelation();
const relationKeys = ref([]);

onMounted(() => {
  gun.get('#relations') //in service or provider
  .map()
  .once(data => {
    relationKeys.value.push(JSON.parse(data));
  });
})
</script>
