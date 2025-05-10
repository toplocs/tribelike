<template>
  <Card>
    <Headline>Relations:</Headline>
    <ul ref="baseList" key="" class="mb-4 flex flex-wrap gap-1">
      <li v-for="base in bases" :key="base.id">
        <TopicBadge :title="base.two?.title" />
      </li>
    </ul>

    <b>Is child of:</b>
    <ul ref="childList" id="childs" class="mb-4 flex flex-wrap gap-1 min-h-[50px]">
      <li v-for="child in childs" :key="child.id">
        <TopicBadge :title="child.two?.title" />
      </li>
    </ul>

    <b>Is a:</b>
    <ul ref="categoryList" class="flex flex-wrap gap-1 min-h-[50px]">
      <li v-for="category in categorys" :key="category.id">
        <TopicBadge :title="category.two?.title" />
      </li>
    </ul>
  </Card>
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
const { relations, byType, populateRelation } = useRelation();
const populated = ref([]);
const baseRelations = ref([]);
const childRelations = ref([]);
const categoryRelations = ref([]);
const [baseList, bases] = useDragAndDrop(baseRelations, {
  group: 'relations',
  onTransfer: (e) => {
    console.log(e.targetParent.el.id, e.draggedNodes[0].data.value);
    //change relation
  },
});
const [childList, childs] = useDragAndDrop(
  childRelations, { group: 'relations' }
);
const [categoryList, categorys] = useDragAndDrop(
  categoryRelations, { group: 'relations' }
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
