<template>
  <div
    v-for="relationKey of profiles"
    class="mt-4 flex flex-wrap gap-1"
  >
    <u>{{ relationKey.passive }} profile:</u>
    <span v-for="relation of populated">
      <router-link
        v-if="relation.type == relationKey.id"
        :to="`/profile/${relation.one?.id}`"
      >
        <ProfileBadge :username="relation.one?.username" />
      </router-link>
    </span>
  </div>
</template>

//
<script setup lang="ts">
import { ref, computed, watch, watchEffect } from 'vue';
import Title from '@/components/common/Title.vue';
import ProfileBadge from '@/components/badges/ProfileBadge.vue';
import { useProfile } from '@/composables/profileProvider';
import { useTopic } from '@/composables/topicProvider';
import { useRelation } from '@/composables/relationProvider';

const { profiles } = defineProps<{
  profiles: Object[];
}>();
const { profile } = useProfile();
const { relations, populateRelation } = useRelation();
const populated = ref([]);

watchEffect(async () => {
  if (!relations.value || relations.value.length === 0) return;
  populated.value = await Promise.all(
    relations.value.map(x => populateRelation(['profiles'], x))
  );
});
</script>
