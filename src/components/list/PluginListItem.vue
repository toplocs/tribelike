<template>
  <div
    class="flex items-center px-4 w-full border-t border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-150 ease-in-out cursor-pointer"
  >
    <div
      class="flex-1"
      @click="onClick"
    >
      <div class="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {{ plugin?.name }}
      </div>
    </div>
    <div class="flex-2 h-full p-4">
      <IconButton
        v-if="!isActive"
        tooltipText="Toggle active"
        :icon="NoSymbolIcon"
        @click.prevent="toggleActive"
      />
      <IconButton
        v-else
        tooltipText="Toggle inactive"
        :icon="CheckIcon"
        @click.prevent="toggleActive"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, computed } from 'vue';
import { CheckIcon, NoSymbolIcon } from '@heroicons/vue/24/outline';
import Title from '@/components/common/Title.vue';
import IconButton from '@/components/common/IconButton.vue';

const props = defineProps({
  plugin: {
    type: Object,
    required: true,
  },
  profileId: {
    type: String,
    required: false,
  },
});
const isActive = ref(props.plugin.active);

const toggleActive = async () => {
  try {
    const formData = new FormData();
    isActive.value = !isActive.value;
    formData.append('pluginSettingsId', props.plugin?.id || '');
    formData.append('name', props.plugin?.name);
    formData.append('path', props.plugin?.path);
    formData.append('key', props.plugin?.key);
    formData.append('pluginId', props.plugin?.pluginId);
    formData.append('profileId', props.profileId);
    formData.append('active', isActive.value);
    const response = await axios.post(`/api/plugin/active`, formData);

    return response.data;
  } catch(e) {
    console.error(e);
  }
}
</script>
