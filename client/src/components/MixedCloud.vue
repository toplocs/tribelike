<template>
  <div class="mx-auto flex flex-col">
    <span class="mx-auto">
      <Search
        placeholder="Select a topic or a location ..."
        :options="options"
        @select="handleSelect"
        @click="handleClick"
      />
    </span>
    <br />

    <div class="flex flex-row flex-wrap gap-1">
      <router-link v-for="topic of topics" :to="`/topic/${topic.id}`">
        <TopicBadge :title="topic.title"/>
      </router-link>
    </div>
  </div>
</template>
//
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref, watch, watchEffect, onMounted, onUnmounted } from 'vue';
import TextInput from '@/components/common/TextInput.vue';
import Search from '@/components/search/Filter.vue';
import BigButton from '@/components/common/BigButton.vue';
import ActionButton from '@/components/common/ActionButton.vue';
import TopicBadge from '@/components/badges/TopicBadge.vue';
import gun from '@/services/gun';

const router = useRouter();
const options = ref([]);
const topics = ref([]);

const handleSelect = async (selected: Object) => {
  two.value = selected;
}

const handleClick = async (value: String) => {
  router.push(`/topic/create?title=${value}`)
}

onMounted(async () => {
  gun.get('topics') //listener in service
  .map()
  .once((refNode, key) => {
    if (!refNode) return;
    gun.get(`topic/${key}/local`).once((data) => {
      if (data) topics.value.push(data);
    });
  });
});
</script>
