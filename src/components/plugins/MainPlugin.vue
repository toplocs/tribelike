<template>
	<slot />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const props = defineProps({
	key: {
		type: String,
		required: true,
	}
});
const ChatPlugin = defineAsyncComponent(() => import('chat_plugin/Main'));
const ChatSidebar = defineAsyncComponent(() => import('chat_plugin/Sidebar'));
</script>y