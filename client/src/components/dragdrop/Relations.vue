<template>
  <div class="space-y-2">
    <Droppable
      id="relation"
      title="Related to"
      :groups="['topic', 'location']"
      @drop="handleDrop"
      class="flex flex-row flex-wrap gap-1 items-center cursor-pointer"
    >
      <span v-for="relation of populated">
        <Draggable
          v-if="relation.type == 'relation'"
          :data="relation"
          :groups="[relation.two?.type]"
          @start="dragged = relation"
        >
          <TopicBadge
            v-if="relation.two?.type == 'topic'"
            :title="relation.two?.title"
            :remove="() => handleRemove(relation)"
          />
          <LocationBadge
            v-if="relation.two?.type == 'location'"
            :title="relation.two?.title"
            :remove="() => handleRemove(relation)"
          />
        </Draggable>
      </span>
    </Droppable>

    <Droppable
      v-for="relationKey of topicToTopic"
      :id="relationKey.id"
      :title="`${relationKey.active} topic`"
      :groups="['topic']"
      @drop="handleDrop"
      class="flex flex-row flex-wrap gap-1 items-center cursor-pointer"
    >
      <span v-for="relation of populated">
        <Draggable
          v-if="relation.type == relationKey.id"
          :data="relation"
          :groups="['topic']"
          @start="dragged = relation"
        >
          <TopicBadge
            :title="relation.two?.title"
            :remove="() => handleRemove(relation)"
          />
        </Draggable>
      </span>
    </Droppable>

    <Droppable
      v-for="relationKey of topicToLocation"
      :id="relationKey.id"
      :title="`${relationKey.active} location`"
      :groups="['location']"
      @drop="handleDrop"
      class="flex flex-row flex-wrap gap-1 cursor-pointer"
    >
      <span v-for="relation of populated">
        <Draggable
          v-if="relation.type == relationKey.id"
          :data="relation"
          :groups="['location']"
          @start="dragged = relation"
        >
          <LocationBadge
            :title="relation.two?.title"
            :remove="() => handleRemove(relation)"
          />
        </Draggable>
      </span>
    </Droppable>
  </div>
</template>

//
<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import Droppable from './Droppable.vue';
import Draggable from './Draggable.vue';
import TopicBadge from '@/components/badges/TopicBadge.vue';
import LocationBadge from '@/components/badges/LocationBadge.vue';
import { useRelation } from '@/composables/relationProvider';
import { topicToTopic, topicToLocation } from '@/assets/relationKeys';

const { relationKeys } = defineProps<{
  sphere: string;
  relationKeys: string[];
}>();
const {
  relations,
  updateRelation,
  removeRelation,
  populateRelation
} = useRelation();
const dropped = ref<string | null>(null);
const dragged = ref<Relation | null>(null);
const populated = ref([]);

const handleDrop = async (e: string) => {
  const changes = dragged.value?.type === e ? false: true;
  if (changes) await updateRelation(dragged.value?.id, e);
}

const handleRemove = async (relation: Object) => {
  await removeRelation(
    relation?.one?.id,
    relation?.type,
    relation?.two?.id
  );
}

watchEffect(async () => {
  if (!relations.value || relations.value.length === 0) return;
  populated.value = await Promise.all(
    relations.value.map(x => populateRelation(['spheres'], x))
  );
});
</script>