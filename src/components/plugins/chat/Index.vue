<template>
  <Title float="center">
    Chat with {{ partner?.username }}
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
import Title from '@/components/common/TitleComponent.vue';
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
    required: true,
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
        userId: props.partner.id,
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