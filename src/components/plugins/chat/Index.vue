<template>
  <Title float="center">
    Chat with 
    <span v-if="partner">{{ partner?.username }}</span>
    <span v-if="!partner">the community</span>
  </Title>
  <div class="flex-1 p:2 justify-between flex flex-col min-h-[500px]">
    <ChatList
      :user="user"
      :messages="messages"
    />
    <ChatPanel
      :user="user"
      :conversation="conversation"
      :chatService="chatService"
    />
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  inject,
  computed,
  onMounted,
  onBeforeUnmount
} from 'vue';
import { useRoute } from 'vue-router';
import Title from '@/components/common/Title.vue';
import ChatService from './service';
import ChatList from './ChatList.vue';
import ChatPanel from './ChatPanel.vue';

const chatService = new ChatService();
const route = useRoute();
const conversation = ref<Object>({});
const messages = ref<Array>([]);
const session = inject('session');
const user = computed(() => session.value?.user);
const props = defineProps({
   partner: {
    type: Object,
    required: false,
   },
});

const onConnect = () => {
  console.log('Chat connected!');
}

const onDisconnect = () => {
  console.log('Chat disconnected');
}

const testResponse = async (msg: Object) => {
  if (msg.userId == user.value?.id) {
    setTimeout(() => {
      chatService.emit('message', {
        user: {
          username: 'System',
          image: '/images/default.jpeg',
        },
        userId: props.partner?.id || 0,
        chatInput: 'Hello this is an automated test response',
      });
    }, 1500);
  }
}

onMounted(() => {
  chatService.on('connect', onConnect);
  chatService.on('disconnect', onDisconnect);
  chatService.on('message', (data) => messages.value.push(data));
  chatService.on('message', async (data) => await testResponse(data));

  chatService.connect();
});

onBeforeUnmount(() => {
  chatService.off('connect', onConnect);
  chatService.off('disconnect', onDisconnect);
  chatService.off('message');

  chatService.disconnect();
});
</script>