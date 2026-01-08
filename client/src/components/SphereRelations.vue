<template>
  <div v-if="populated.length > 0" class="space-y-4">
    <!-- Related to section -->
    <div v-if="populated.some(relation => relation.type == 'relation')" class="flex flex-col gap-2">
      <span class="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
        Related spheres
      </span>
      <div class="flex flex-wrap gap-2 pl-6">
        <router-link
          v-for="relation of populated"
          :key="relation.id"
          v-show="relation.type == 'relation'"
          :to="`/sphere/${relation.two?.id}`"
        >
          <TopicBadge
            v-if="relation.two?.type == 'topic'"
            :title="relation.two?.title"
          />
          <LocationBadge
            v-if="relation.two?.type == 'location'"
            :title="relation.two?.title"
          />
        </router-link>
      </div>
    </div>

    <div v-if="populated.some(relation => relation.type == 'relation') && (topics.some(t => populated.some(r => r.type === t.id)) || locations.some(l => populated.some(r => r.type === l.id)))" class="h-px bg-gray-200 dark:bg-gray-700" />

    <!-- Topic relations -->
    <template v-for="(relationKey, index) in topics" :key="relationKey.id">
      <div
        v-if="populated.some(relation => relation.type === relationKey.id)"
        class="flex flex-col gap-2"
      >
        <span class="text-xs font-semibold uppercase tracking-wider"
          :class="{
            'text-green-600 dark:text-green-400': relationKey.color === 'green',
            'text-blue-600 dark:text-blue-400': relationKey.color === 'blue',
          }"
        >
          {{ relationKey.active }} topic
        </span>
        <div class="flex flex-wrap gap-2 pl-6">
          <router-link
            v-for="relation in populated"
            :key="relation.id"
            v-show="relation.type === relationKey.id"
            :to="`/sphere/${relation.two?.id}`"
          >
            <TopicBadge :title="relation.two?.title" />
          </router-link>
        </div>
      </div>
      <div
        v-if="index < topics.length - 1 && populated.some(relation => relation.type === relationKey.id)"
        class="h-px bg-gray-200 dark:bg-gray-700"
      />
    </template>

    <div v-if="topics.some(t => populated.some(r => r.type === t.id)) && locations.some(l => populated.some(r => r.type === l.id))" class="h-px bg-gray-200 dark:bg-gray-700" />

    <!-- Location relations -->
    <template v-for="(relationKey, index) in locations" :key="relationKey.id">
      <div
        v-if="populated.some(relation => relation.type === relationKey.id)"
        class="flex flex-col gap-2"
      >
        <span class="text-xs font-semibold uppercase tracking-wider"
          :class="{
            'text-green-600 dark:text-green-400': relationKey.color === 'green',
            'text-blue-600 dark:text-blue-400': relationKey.color === 'blue',
          }"
        >
          {{ relationKey.active }} location
        </span>
        <div class="flex flex-wrap gap-2 pl-6">
          <router-link
            v-for="relation in populated"
            :key="relation.id"
            v-show="relation.type === relationKey.id"
            :to="`/sphere/${relation.two?.id}`"
          >
            <LocationBadge :title="relation.two?.title" />
          </router-link>
        </div>
      </div>
      <div
        v-if="index < locations.length - 1 && populated.some(relation => relation.type === relationKey.id)"
        class="h-px bg-gray-200 dark:bg-gray-700"
      />
    </template>
  </div>
</template>

//
<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import TopicBadge from '@/components/badges/TopicBadge.vue';
import LocationBadge from '@/components/badges/LocationBadge.vue';
import { useRelation } from '@/composables/relationProvider';

const { topics, locations } = defineProps<{
  topics: Object[];
  locations: Object[];
}>();
const { relations, populateRelation } = useRelation();
const populated = ref([]);

watchEffect(async () => {
  if (!relations.value || relations.value.length === 0) {
    populated.value = [];
    return;
  }
  populated.value = await Promise.all(
    relations.value.map(x => populateRelation(['spheres'], x))
  );
});
</script>
