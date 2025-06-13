<template>
  <div class="flex flex-wrap gap-1">
    <u>related to:</u>
    <span v-for="relation of populated">
      <router-link
        v-if="relation.type == 'relation'"
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
    </span>
  </div>

  <Divider />

  <template v-for="relationKey in topics" :key="relationKey.id">
    <div
      v-if="populated.some(relation => relation.type === relationKey.id)"
      class="mt-4 flex flex-wrap gap-1"
    >
      <u>{{ relationKey.active }} topic:</u>
      <span
        v-for="relation in populated"
        :key="relation.id"
      >
        <router-link
          v-if="relation.type === relationKey.id"
          :to="`/sphere/${relation.two?.id}`"
        >
          <TopicBadge :title="relation.two?.title" />
        </router-link>
      </span>
    </div>
  </template>


  <Divider />

  <template v-for="relationKey in locations" :key="relationKey.id">
    <div
      v-if="populated.some(relation => relation.type === relationKey.id)"
      class="mt-4 flex flex-wrap gap-1"
    >
      <u>{{ relationKey.active }} location:</u>
      <span
        v-for="relation in populated"
        :key="relation.id"
      >
        <router-link
          v-if="relation.type === relationKey.id"
          :to="`/sphere/${relation.two?.id}`"
        >
          <LocationBadge :title="relation.two?.title" />
        </router-link>
      </span>
    </div>
  </template>


</template>

//
<script setup lang="ts">
import { ref, computed, watch, watchEffect } from 'vue';
import Title from '@/components/common/Title.vue';
import Divider from '@/components/common/Divider.vue';
import TopicBadge from '@/components/badges/TopicBadge.vue';
import LocationBadge from '@/components/badges/LocationBadge.vue';
import { useProfile } from '@/composables/profileProvider';
import { useTopic } from '@/composables/topicProvider';
import { useRelation } from '@/composables/relationProvider';

const { topics, locations } = defineProps<{
  topics: Object[];
  locations: Object[];
}>();
const { profile } = useProfile();
const { relations, populateRelation } = useRelation();
const populated = ref([]);

watchEffect(async () => {
  if (!relations.value || relations.value.length === 0) return;
  populated.value = await Promise.all(
    relations.value.map(x => populateRelation(['spheres'], x))
  );
});
</script>
