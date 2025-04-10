<template>
  <div>
    <p>Message: {{ message }}</p>
    <input v-model="newMessage" placeholder="Type a message" />
    <button @click="sendMessage">Send</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gun from '@/services/gun'

const message = ref('')
const newMessage = ref('')

const chat = gun.get('tribelike').get('chat-room') // create a 'chat-room' node

onMounted(() => {
  // Listen for new messages
  chat.on((data) => {
    if (data) {
      message.value = data.text
    }
  })
})

const sendMessage = () => {
  chat.put({ text: newMessage.value })
  newMessage.value = ''
}
</script>
