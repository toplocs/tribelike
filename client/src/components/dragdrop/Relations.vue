<template>
  <div class="space-y-2" :id="version" :key="version">
    <Droppable
      id="relation"
      title="related to"
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
      v-for="relationKey of relationKeys"
      :id="relationKey.id"
      :title="`${relationKey.active}`"
      :groups="relationKey.accepts"
      @drop="handleDrop"
      class="flex flex-row flex-wrap gap-1 items-center cursor-pointer"
    >
      <span v-for="relation of populated">
        <Draggable
          v-if="relation.type == relationKey.id"
          :data="relation"
          :groups="[relation.two?.type]"
          @start="dragged = relation"
        >
         {{ relation.two?.type }}, {{ relationKey.id }}
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
  </div>
</template>

//
<script setup lang="ts">
import { ref, watchEffect, onMounted } from 'vue';
import Droppable from './Droppable.vue';
import Draggable from './Draggable.vue';
import TopicBadge from '@/components/badges/TopicBadge.vue';
import LocationBadge from '@/components/badges/LocationBadge.vue';
import { useRelation } from '@/composables/relationProvider';

const { relationKeys } = defineProps<{
  relationKeys: Object[];
}>();
const {
  relations,
  updateRelation,
  removeRelation,
  populateRelation
} = useRelation();
const dragged = ref<Relation | null>(null);
const populated = ref([]);
const version = ref(0);

const handleDrop = async (e: string) => {
  const changes = dragged.value?.type === e ? false: true;
  console.log(changes);
  if (changes) await updateRelation(dragged.value?.id, e);
  dragged.value = null;
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
  version.value += 1;
});
</script>