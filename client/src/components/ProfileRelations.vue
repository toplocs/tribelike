<template>
  <Title>{{ title || 'Base' }}:</Title>
  <div class="flex flex-wrap gap-1">
    <router-link
      v-for="relation of populated"
      :to="`/profile/${relation.one?.id}`">
      <ProfileBadge :username="relation.one?.username" />
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import Title from '@/components/common/Title.vue';
import ProfileBadge from '@/components/badges/ProfileBadge.vue';
import { useProfile } from '@/composables/profileProvider';
import { useTopic } from '@/composables/topicProvider';
import { useRelation } from '@/composables/relationProvider';

const props = defineProps({
  relationKey: {
    type: Object,
    required: true,
  }
});
const { profile } = useProfile();
const { byType, populateRelation } = useRelation();
const populated = ref([]);
const title = computed(() => {
  const value = props.relationKey.passive;
  return value.charAt(0).toUpperCase() + value.slice(1);
});

watchEffect(async () => {
  const relations = byType.value[props.relationKey.id];
  if (!relations) return;
  populated.value = await Promise.all(
    relations.map(x => populateRelation(['profiles'], x))
  );
});
</script>
