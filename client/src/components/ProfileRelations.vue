<template>
  <div v-if="populated.length > 0" class="space-y-4">
    <template v-for="(relationKey, index) of profiles" :key="relationKey.id">
      <div
        v-if="populated.some(relation => relation.type === relationKey.id)"
        class="flex flex-col gap-2"
      >
        <div class="flex items-center gap-2"
          :class="{
            'text-green-600 dark:text-green-400': relationKey.color === 'green',
            'text-red-600 dark:text-red-400': relationKey.color === 'red',
            'text-blue-600 dark:text-blue-400': relationKey.color === 'blue',
            'text-yellow-600 dark:text-yellow-400': relationKey.color === 'yellow',
          }"
        >
          <Icon :icon="relationKey.icon" />
          <span class="text-xs font-semibold uppercase tracking-wider">
            {{ relationKey.passive }}
          </span>
        </div>
        <div class="flex flex-wrap gap-2 pl-6">
          <router-link
            v-for="relation of populated"
            :key="relation.id"
            v-show="relation.type == relationKey.id"
            :to="`/profile/${relation.one?.id}`"
          >
            <ProfileBadge
              :username="relation.one?.username"
              :image="relation.one?.image"
            />
          </router-link>
        </div>
      </div>
      <div
        v-if="index < profiles.length - 1 && populated.some(relation => relation.type === relationKey.id)"
        class="h-px bg-gray-200 dark:bg-gray-700"
      />
    </template>
  </div>
</template>

//
<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import Icon from '@/components/common/Icon.vue';
import ProfileBadge from '@/components/badges/ProfileBadge.vue';
import { useRelation } from '@/composables/relationProvider';

const { profiles } = defineProps<{
  profiles: Object[];
}>();
const { relations, populateRelation } = useRelation();
const populated = ref([]);

watchEffect(async () => {
  if (!relations.value || relations.value.length === 0) {
    populated.value = [];
    return;
  }
  populated.value = await Promise.all(
    relations.value.map(x => populateRelation(['profiles'], x))
  );
});
</script>
