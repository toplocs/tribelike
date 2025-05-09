<template>
  <Card>
    <ul ref="baseList" class="flex flex-wrap gap-1">
      <li v-for="base in bases" :key="base.id">
        <TopicBadge :title="base.two?.title" />
      </li>
    </ul>
  </Card>

  <Card>
    <ul ref="likeList" class="flex flex-wrap gap-1">
      <b>Likes:</b>
      <li v-for="like in likes" :key="like.id">
        <TopicBadge :title="like.two?.title" />
      </li>
    </ul>
  </Card>
</template>

<script setup lang="ts">
import { ref, watchEffect, onMounted, onUnmounted } from 'vue';
import { useDragAndDrop } from "@formkit/drag-and-drop/vue";
import Card from '@/components/common/Card.vue';
import TopicBadge from '@/components/badges/TopicBadge.vue';
import { useProfile } from '@/composables/profileProvider';
import { useTopic } from '@/composables/topicProvider';
import { useRelation } from '@/composables/relationProvider';

const { profile } = useProfile();
const { topic, createTopic } = useTopic();
const { relations, byType, populateRelation } = useRelation();
const populated = ref([]);
const baseRelations = ref([]);
const likeRelations = ref([]);
const [baseList, bases] = useDragAndDrop(baseRelations, { group: 'baseList' });
const [likeList, likes] = useDragAndDrop(likeRelations, { group: 'likeList' });

watchEffect(async () => {
  if (!relations.value) return;
  populated.value = await Promise.all(
    relations.value.map(x => populateRelation(['profiles', 'topics'], x))
  );
  baseRelations.value = populated.value.filter(x => x.type === '');
  likeRelations.value = populated.value.filter(x => x.type === 'like');
  console.log(baseRelations.value)

  /*sortedRelations.value.teaches = populated.value.filter(x => x.type === 'teach');
  sortedRelations.value.learns = populated.value.filter(x => x.type === 'learn');
  console.log(sortedRelations.value);*/
});
</script>
