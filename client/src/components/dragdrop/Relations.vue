<template>
  <div class="container">
    <Draggable
      v-if="!dropped"
      data="Test"
      :groups="['topic']"
      @start="dragged = 'Test'"
    >
      <TopicBadge title="test" />
    </Draggable>
    <div>
      <Droppable
        :groups="['']"
        @drop="dropped = 'b'"
      >
        <Draggable
          v-if="dropped === 'b'"
          :groups="['b']"
          @end="dropped = null"
        />
      </Droppable>

      <Droppable
        v-for="relationKey of relationKeys"
        :id="relationKey.id"
        :groups="['topic']"
        @drop="handleDrop"
      >
        <span v-for="relation of relations">
          <Draggable
            v-if="relation.type == relationKey.id"
            :data="relation"
            :groups="['topic']"
            @start="dragged = relation.id"
          >
            <TopicBadge title="test" />
          </Draggable>
        </span>
      </Droppable>
    </div>
  </div>
</template>

//
<script setup lang="ts">
import { ref } from 'vue';
import Droppable from './Droppable.vue';
import Draggable from './Draggable.vue';
import TopicBadge from '@/components/badges/TopicBadge.vue';
import { useRelation } from '@/composables/relationProvider';

const { relationKeys } = defineProps<{
  relationKeys: string[];
}>();
const {
  relations,
  updateRelation,
  removeRelation,
  populateRelation
} = useRelation();
const dropped = ref<string | null>(null);
const dragged = ref<string | null>(null);


const handleEnd = (e) => {
  console.log(e)
}

const handleDrop = async (e: string) => {
  console.log(dragged.value)
  await updateRelation(dragged.value, e);
}
</script>