<template>
  <span class="mb-2 flex flex-row gap-2">
    <Search
      placeholder="Select a topic or a location ..."
      :options="options"
      @select="handleSelect"
      @click="handleClick"
    />
  </span>
  <!--
  <span v-if="two">
    {{ topic?.title }} is related to <TopicBadge :title="two?.title"/>
  </span>
  -->
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref, watch, watchEffect, onMounted, onUnmounted } from 'vue';
import TextInput from '@/components/common/TextInput.vue';
import Search from '@/components/search/Filter.vue';
import BigButton from '@/components/common/BigButton.vue';
import ActionButton from '@/components/common/ActionButton.vue';
import TopicBadge from '@/components/badges/TopicBadge.vue';
import { useProfile } from '@/composables/profileProvider';
import { useTopic } from '@/composables/topicProvider';
import { useRelation } from '@/composables/relationProvider';
import { topicToTopic } from '@/assets/relationKeys.ts';
import gun from '@/services/gun';

const router = useRouter();
const { profile } = useProfile();
const { topic, createTopic } = useTopic();
const { relations, createRelation } = useRelation();
const options = ref([]);
const type = ref('');
const two = ref(null);

const handleSelect = async (selected: Object) => {
  two.value = selected;
}

const handleClick = async (value: String) => {
  router.push(`/topic/create?title=${value}`)
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
}

watch(() => two.value, async () => {
  if (two.value) {
    const result = await createRelation(
      topic.value?.id,
      type.value,
      two.value?.id,
    );
  }
});

onMounted(async () => {
  gun.get('topics') //listener in service
  .map()
  .once((refNode, key) => {
    if (!refNode) return;
    gun.get(`topic/${key}/local`).once((data) => {
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
