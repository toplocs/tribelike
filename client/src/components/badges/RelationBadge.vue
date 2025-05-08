<template>
  <router-link v-if="is == 'topic'" :to="`/topic/${data.id}`">
    <TopicBadge
      :id="data.id"
      :title="data.title"
      :remove="handleRemove"
    >
      <Icon :icon="relation.type" />
      –
    </TopicBadge>
  </router-link>

  <router-link v-else :to="`/locations/${data.id}`">
    <TopicBadge
      :id="data.id"
      :title="data.title"
      :remove="handleRemove"
    >
      <Icon icon="like" />
    </TopicBadge>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import TopicBadge from '@/components/badges/TopicBadge.vue';
import LocationBadge from '@/components/badges/LocationBadge.vue';
import Icon from '@/components/common/Icon.vue';
import { useRelation } from '@/composables/relationProvider';

const props = defineProps({
  is: {
    type: String,
    required: true,
  },
  relation: {
    type: Object,
    required: true,
  },
});
const { removeRelation } = useRelation();
const data = computed(() => props.relation?.two);

const handleRemove = async () => {
  const result = await removeRelation(
    props.relation?.one?.id,
    props.relation?.type,
    props.relation?.two?.id
  );
  console.log(result);
}

</script>