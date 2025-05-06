<template>
  <div class="flex flex-wrap gap-2">
    <BigButton
      v-for="relationKey of relationKeys"
      :title="relationKey.id"
      :icon="relationKey.icon || 'heart'"
      :color="relationKey.color || 'blue'"
      @click="handleClick"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BigButton from '@/components/common/BigButton.vue';
import gun from '@/services/gun';

const relationKeys = ref([]);

onMounted(() => {
  gun.get('#relations') //in service or provider
  .map()
  .once(data => {
    relationKeys.value.push(JSON.parse(data));
  });
})
</script>
