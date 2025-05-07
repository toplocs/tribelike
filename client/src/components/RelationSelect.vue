<template>
  <input
    type="hidden"
    name="relationId"
    :value="selected.id"
  >

  <div class="flex flex-wrap gap-2">
    <BigButton
      v-for="relationKey of relationKeys"
      :title="relationKey.id"
      :icon="relationKey.icon || 'heart'"
      :color="relationKey.color || 'blue'"
      @click="() => handleClick(relationKey)"
    />
  </div>

  <span>
    {{ profile?.username }} {{ selected.active }}
  </span>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BigButton from '@/components/common/BigButton.vue';
import { useProfile } from '@/composables/profileProvider';
import gun from '@/services/gun';

const { profile } = useProfile();
const selected = ref({ active: 'likes' });
const relationKeys = ref([]);

const handleClick = (relationKey: Object) => {
  selected.value = relationKey;
}

onMounted(() => {
  gun.get('#relations') //in service or provider
  .map()
  .once(data => {
    relationKeys.value.push(JSON.parse(data));
  });
})
</script>
