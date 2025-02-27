<template>
  <RemotePlugin
    room="Test"
    :user="{
      username: 'Yannik',
      userId: 1,
      image: 'images/default.jpeg'
    }"
  />
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from "vue";
import { loadPlugin } from "./utils/plugin-loader";

const ChatPlugin = defineAsyncComponent(() => import('chat_plugin/Plugin'));
console.log(RemotePlugin);
</script>
