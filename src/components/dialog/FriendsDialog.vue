<template>
  <span v-if="partner">
    <Chat :partner="partner" />
  </span>

  <span v-if="!partner">
    <Title float="center">
      A list of your friends:
    </Title>
    <ChatListItem
      v-for="user of users" :key="user.id"
      :user="user"
      :onClick="openChat"
    />
  </span>

</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, watch, onMounted } from 'vue';
import Title from '../../components/common/TitleComponent.vue';
import Chat from '../../components/plugins/chat/Index.vue';
import ChatListItem from  '../../components/list/ChatListItem.vue';

const props = defineProps({
  closeDialog: {
    type: Function,
    required: true,
  },
});

const users = ref([]);
const partner = ref(null);

const openChat = (user: Object) => {
  partner.value = user;
}

const fetchUsers = async () => {
  try {
    const response = await axios.get(`/api/user`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  users.value = await fetchUsers();
});
</script>
