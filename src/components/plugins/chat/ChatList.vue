<template>
  <div ref="container" class="flex flex-col space-y-4 p-3">
    <div v-for="(x, i) in messages" :key="i">
      <ChatMessage1 v-if="x.userId === props.user.id" :message="x" />
      <ChatMessage2 v-else :message="x" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import ChatMessage1 from './ChatMessage1.vue';
import ChatMessage2 from './ChatMessage2.vue';

const props = defineProps({
  user: Object,
  messages: Array,
});
const container = ref<HTMLElement | null>(null);

function scrollToBottom() {
  if (container.value.offsetHeight < window.innerHeight-200) return;
  setTimeout(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  }, 60);
};

watch(props, () => {
  scrollToBottom();
});

onMounted(() => {
  scrollToBottom();
});
</script>
