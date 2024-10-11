<template>
  <span v-for="notification of notifications">
    <div class="p-2 border-b hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 transition duration-150 ease-in-out cursor-pointer">
      <StatusBadge :title="normalize(notification?.status)" />

      <div class="mt-1 px-1">
        <p class="text-sm dark:text-white">
          {{ notification.text }}
        </p>
      </div>
    </div>
  </span>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted } from 'vue';
import StatusBadge from '@/components/badges/StatusBadge.vue';

const notifications = ref([]);

const normalize = (text: string) => {
  if (!text) return;
  return text
  .toLowerCase()
  .replace(/_/g, " ")
  .replace(/\b\w/g, (char) => char.toUpperCase())
}

const fetchNotifications = async (id: string) => {
  try {
    const response = await axios.get(`/api/activity`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  notifications.value = await fetchNotifications();
});
</script>