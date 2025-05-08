<template>
  <div class="border-b border-gray-100 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150 ease-in-out">
    <div 
      class="flex flex-row w-full p-4 cursor-pointer"
      @click="onClick(profile)"
    >
      <img
        :src="profile.image"
        alt="Avatar"
        class="w-12 h-12 rounded-full object-cover mr-4"
      />
      <div class="flex flex-grow">
        <div class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {{ profile.username }} – {{ profile.type }}
        </div>
      </div>
    </div>
    <div class="flex flex-row mb-4">
      <div class="flex flex-wrap gap-2">
        <router-link
          v-for="interest in profile.interests"
          :key="interest.id"
          :to="`/interest/${interest.id}`"
        >
          <TopicBadge
            :key="interest.id"
            :title="interest.title"
          />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';
import { TrashIcon, Cog6ToothIcon } from '@heroicons/vue/24/outline';
import TopicBadge from '@/components/badges/TopicBadge.vue';
import Dialog from '@/components/dialog/DialogComponent.vue';
import ConfirmDialog from '@/components/dialog/ConfirmDialog.vue';

const props = defineProps({
  profile: {
    type: Object,
    required: true,
  },
  onClick: {
    type: Function,
    required: false,
  }
});
const emit = defineEmits(['updateProfiles']);

const onDelete = async (profile: Object) => {
  try {
    const response = await axios.delete(`/api/profile?profileId=${props.profile.id}`);
    emit('updateProfiles');

    return response.data;
  } catch (error) {
    console.error(error);
  }
}
</script>