<template>
  <div
    class="flex items-center px-2 w-full border-t border-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-150 ease-in-out cursor-pointer"
  >
    <div
      class="flex-1"
      @click="onClick"
    >
      <div class="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {{ plugin?.pluginname }}
      </div>
    </div>
    <div class="flex-2 h-full p-4">
      <IconButton
        v-if="settings?.disabled"
        tooltipText="Toggle active"
        :icon="NoSymbolIcon"
        @click.stop="toggleActive"
      />
      <IconButton
        v-else
        tooltipText="Toggle inactive"
        :icon="CheckIcon"
        @click.stop="toggleActive"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CheckIcon, NoSymbolIcon } from '@heroicons/vue/24/solid';
import Title from '@/components/common/Title.vue';
import IconButton from '@/components/common/IconButton.vue';

const props = defineProps({
  plugin: {
    type: Object,
    required: true,
  },
});
const settings = computed(() => props.plugin?.profileSettings);


const toggleActive = () => {
  settings.value.disabled = !settings.value.disabled;
}
</script>
