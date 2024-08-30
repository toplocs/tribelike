<template>
  <div
    class="flex items-center p-4 w-full border-t border-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-150 ease-in-out cursor-pointer"
  >
    <img
      :src="avatarSrc"
      alt="Avatar"
      class="w-12 h-12 rounded-full object-cover mr-4"
    />
    <div class="flex-1">
      <div class="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {{ title }}
      </div>
      <div class="mt-4 flex flex-wrap gap-2">
        <Badge v-for="interest in interests" :key="interest.value" :title="interest.label" />
      </div>
    </div>
    <div class="flex-2 h-full p-4">
      <Cog6ToothIcon
        class="w-6 h-6 text-gray-200 hover:text-gray-400"
        @click.stop="openProfileSettings"
      />
    </div>
    <div class="flex-3 h-full p-4">
      <TrashIcon
        class="w-6 h-6 text-red-200 hover:text-red-400"
        @click.stop="openDeleteDialog"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { TrashIcon, Cog6ToothIcon } from '@heroicons/vue/24/outline';
import Badge from '../../components/common/BadgeComponent.vue';

const props = defineProps({
  avatarSrc: {
    type: String,
    required: true
  },
  id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  interests: {
    type: Array,
    required: true
  }
});

async function openProfileSettings() {
  try {
    console.log('settings'+props.id)

  } catch (error) {
    console.error(error);
  }
}

async function openDeleteDialog() {
  try {
    console.log('delete'+props.id)

  } catch (error) {
    console.error(error);
  }
}
</script>