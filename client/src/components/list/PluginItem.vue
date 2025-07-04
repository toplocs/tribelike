<template>
  <li
    class="p-2 cursor-pointer border rounded bg-gray-50 dark:bg-gray-800"
    @click="$emit('select', plugin)"
  >
    <div class="flex items-center justify-between">
      <strong class="text-gray-900 dark:text-gray-100">{{ plugin.name }}</strong>
      <span
        :class="[
          'inline-block w-3 h-3 rounded-full',
          isOnline === null ? 'bg-gray-400' : isOnline ? 'bg-green-500' : 'bg-red-500'
        ]"
      ></span>
    </div>
    <p class="text-xs text-gray-500">{{ plugin.url }}</p>
  </li>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{
  plugin: {
    name: string;
    url: string;
  };
}>();
const emit = defineEmits(['select']);

const isOnline = ref<boolean | null>(null);

const checkStatus = async () => {
  isOnline.value = null;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    await fetch(props.plugin.url, {
      method: 'HEAD',
      mode: 'no-cors',
      signal: controller.signal
    });
    clearTimeout(timeout);
    isOnline.value = true;
  } catch {
    isOnline.value = false;
  }
};

onMounted(checkStatus);
watch(() => props.plugin.url, checkStatus);
</script>
