<template>
  <div class="mb-4 flex flex-wrap gap-2">
    <BigButton
      v-for="relationKey of relationKeys"
      :title="relationKey.id"
      :icon="relationKey.icon || 'heart'"
      :color="relationKey.color || 'blue'"
      @click="() => handleClick(relationKey)"
    />
  </div>

  <Search
    placeholder="Select a topic or a location ..."
    :options="options"
    @select="handleSelect"
    @click="handleClick"
  />
  <div className="my-4 flex flex-wrap gap-2">
    {{ topic?.title }} {{ type.active }}
    <TopicBadge v-if="two" :title="two.title" />
  </div>

  <ActionButton
    title="Create relation"
    @click="handleSubmit"
  />
</template>

<script setup lang="ts">
import { ref, watchEffect, onMounted, onUnmounted } from 'vue';
import TextInput from '@/components/common/TextInput.vue';
import Search from '@/components/search/Filter.vue';
import BigButton from '@/components/common/BigButton.vue';
import ActionButton from '@/components/common/ActionButton.vue';
import TopicBadge from '@/components/badges/TopicBadge.vue';
import { useProfile } from '@/composables/profileProvider';
import { useTopic } from '@/composables/topicProvider';
import { useRelation } from '@/composables/relationProvider';
import relationKeys from '@/assets/relationKeys.ts';
import gun from '@/services/gun';

const { profile } = useProfile();
const { topic, createTopic } = useTopic();
const { relations, createRelation } = useRelation();
const options = ref([]);
const type = ref(relationKeys[0]);
const two = ref(null);

const handleSelect = async (selected: Object) => {
  two.value = selected;
}

const handleClick = async (value: String) => {
  type.value = value;
}

const handleRemove = async (relation: Relation) => {
  const result = await removeRelation(relation);
}

const handleSubmit = async () => {
  const result = await createRelation(
    topic.value?.id,
    type.value?.id,
    two.value?.id,
  );
  console.log(result);
}

onMounted(async () => {
  gun.get('topics') //listener in service
  .map()
  .once((refNode, key) => {
    if (!refNode) return;
    gun.get(`topic_${key}`).once((data) => {
      if (data) options.value.push(data);
    });
  });

  /*gun.get('locations') //listener in service
  .map()
  .once((refNode, key) => {
    if (!refNode) return;
    gun.get(`topic_${key}`).once((data) => {
      if (data) options.value.push(data);
    });
  });*/
});
</script>
