<template>
  <div
    class="p-2 flex flex-row items-center justify-between px-4 w-full border-t border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-150 ease-in-out cursor-pointer"
  >
    <div
      @click="onClick"
    >
      <div class="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {{ plugin?.name }}
      </div>
    </div>
    <div class="flex flex-row gap-1 h-full">
      <IconButton
        v-if="isActive"
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

      <Dialog>
        <template #trigger="{ openDialog }">
          <IconButton
            tooltipText="Settings"
            :icon="Cog6ToothIcon"
            @click="openDialog"
          />
        </template>

        <template #content="{ closeDialog }">
          <PluginComponent
            :plugin="plugin"
            position="Settings"
          />
        </template>
      </Dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  CheckIcon,
  NoSymbolIcon,
  Cog6ToothIcon
} from '@heroicons/vue/24/outline';
import Title from '@/components/common/Title.vue';
import IconButton from '@/components/common/IconButton.vue';
import Dialog from '@/components/common/Dialog.vue';
import PluginComponent from '@/components/PluginComponent.vue';

const props = defineProps({
  plugin: {
    type: Object,
    required: true,
  },
});
const isActive = ref(false);

const toggleActive = async () => {
  isActive.value = !isActive.value;
}
</script>