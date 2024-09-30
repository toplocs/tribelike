<template>
  <div
    class="flex items-center p-4 w-full border-t border-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-150 ease-in-out cursor-pointer"
  >
    <img
      :src="profile.image"
      alt="Avatar"
      class="w-12 h-12 rounded-full object-cover mr-4"
      @click="onClick(profile)"
    />
    <div
      class="flex-1"
      @click="onClick(profile)"
    >
      <div class="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {{ profile.type }} – {{ profile.username }}
      </div>
      <div class="mt-4 flex flex-wrap gap-2">
        <InterestBadge
          v-for="interest in profile.interests"
          :key="interest.id"
          :title="interest.title"
        />
      </div>
    </div>
    <div class="flex-2 h-full p-4">
      <Dialog>
        <template #trigger="{ openDialog }">
          <Cog6ToothIcon
            class="w-6 h-6 text-gray-200 hover:text-gray-400"
            @click.stop="openDialog"
          />
        </template>

        <template #content="{ closeDialog }">
          <ProfileSettingsDialog
            :closeDialog="closeDialog"
            :profile="profile"
            @updateProfile="handleProfileUpdate"
          />
        </template>
      </Dialog>
    </div>
    <div class="flex-3 h-full p-4">
    <Dialog>
      <template #trigger="{ openDialog }">
        <TrashIcon
          class="w-6 h-6 text-red-200 hover:text-red-400"
          @click.stop="openDialog"
        />
      </template>

      <template #content="{ closeDialog }">
        <ConfirmDialog
          text="Do you want to delete the profile?"
          :closeDialog="(x) => {
            if (x == true) onDelete();
            closeDialog();
          }"
        />
      </template>
    </Dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';
import { TrashIcon, Cog6ToothIcon } from '@heroicons/vue/24/outline';
import InterestBadge from '@/components/badges/InterestBadge.vue';
import Dialog from '@/components/dialog/DialogComponent.vue';
import ProfileSettingsDialog from '@/components/dialog/ProfileSettingsDialog.vue';
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

const handleProfileUpdate = (response: Object) => {
  emit('updateProfiles', response);
}

const onDelete = async (profile: Object) => {
  try {
    const response = await axios.delete(`/api/profile?profileId=${props.profile.id}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}
</script>