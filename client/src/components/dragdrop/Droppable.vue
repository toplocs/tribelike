<template>
  <div
    ref="elementRef"
    class="px-2 py-4 bg-gray-50 border border-dashed border-gray-300 rounded-sm "
    :class="{
      'is-overed': isOvered,
      'bg-green-100 border-green-300': isAllowed,
    }"
  >
    <u v-if="title" class="text-sm">
      {{ capitalized }}:
    </u>

    <slot />
  </div>
</template>
//

<script setup lang="ts">
import { computed } from 'vue';
import { useDroppable } from '@vue-dnd-kit/core';

const emit = defineEmits<{
  (e: 'drop'): void;
}>();

const { title, id, groups } = defineProps<{
  id: string,
  title: string,
  groups: string[];
}>();

const capitalized = computed(() => {
  if (!title) return '';
  return title.charAt(0).toUpperCase() + title.slice(1);
});

const { elementRef, isOvered, isAllowed } = useDroppable({
  id,
  groups,
  events: {
    onDrop: (e) => emit('drop', id)
  },
});
</script>