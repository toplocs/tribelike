<template>
  <span v-if="!bases.length">
    Drag and drop relations
  </span>
  <ul ref="baseList" key="" class="mb-4 flex flex-wrap gap-1 min-h-[50px]">
    <li v-for="base in bases" :key="base.id">
      <TopicBadge
        :title="base.two?.title"
        :remove="() => handleRemove(base)"
      />
    </li>
  </ul>

  <b>Is child of:</b>
  <ul ref="childList" id="child" class="mb-4 flex flex-wrap gap-1 min-h-[50px]">
    <li v-for="child in children" :key="child.id">
      <TopicBadge
        :title="child.two?.title"
        :remove="() => handleRemove(child)"
      />
    </li>
  </ul>

  <b>Is a:</b>
  <ul ref="categoryList" id="category" class="flex flex-wrap gap-1 min-h-[50px]">
    <li v-for="category in categorys" :key="category.id">
      <TopicBadge
        :title="category.two?.title"
        :remove="() => handleRemove(category)"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref, watchEffect, onMounted, onUnmounted } from 'vue';
import { useDragAndDrop } from "@formkit/drag-and-drop/vue";
import Card from '@/components/common/Card.vue';
import Headline from '@/components/common/Headline.vue';
import TopicBadge from '@/components/badges/TopicBadge.vue';
import { useProfile } from '@/composables/profileProvider';
import { useTopic } from '@/composables/topicProvider';
import { useRelation } from '@/composables/relationProvider';

const { profile } = useProfile();
const { topic, createTopic } = useTopic();
const {
  relations,
  updateRelation,
  removeRelation,
  populateRelation
} = useRelation();
const populated = ref([]);
const baseRelations = ref([]);
const childRelations = ref([]);
const categoryRelations = ref([]);

const handleDragEnd = async (e) => {
  const newType = e.parent.el.id;
  const relation = e.draggedNodes[0].data.value;
  await updateRelation(relation.id, newType);
}

const handleRemove = async (relation: Relation) => {
  const result = await removeRelation(
    relation.one?.id,
    relation.type,
    relation.two?.id,
  );
}

const [baseList, bases] = useDragAndDrop(
  baseRelations, {
    group: 'relations',
    onDragend: handleDragEnd,
  }
);
const [childList, children] = useDragAndDrop(
  childRelations, {
    group: 'relations',
    onDragend: handleDragEnd,
  }
);
const [categoryList, categorys] = useDragAndDrop(
  categoryRelations, {
    group: 'relations',
    onDragend: handleDragEnd,
  }
);

watchEffect(async () => {
  if (!relations.value) return;
  populated.value = await Promise.all(
    relations.value.map(x => populateRelation(['profiles', 'topics'], x))
  );
  baseRelations.value = populated.value.filter(x => x.type === '');
  childRelations.value = populated.value.filter(x => x.type === 'child');
  categoryRelations.value = populated.value.filter(x => x.type === 'category');

  /*sortedRelations.value.teaches = populated.value.filter(x => x.type === 'teach');
  sortedRelations.value.categorys = populated.value.filter(x => x.type === 'category');
  console.log(sortedRelations.value);*/
});
</script>
