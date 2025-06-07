<template>
  <div
    ref="elementRef"
    class="draggable"
    :class="{ 'is-dragging': isDragging }"
    @pointerdown="handleDragStart"
  >
    <slot />
  </div>
</template>
//

<script setup lang="ts">
  import { useDraggable } from '@vue-dnd-kit/core';

  const { data, groups } = defineProps<{
    data: string,
    groups: string[];
  }>();

  const emit = defineEmits<{
    (e: 'start'): void;
    (e: 'end'): void;
  }>();

  const { elementRef, isDragging, handleDragStart } = useDraggable({
    data,
    groups,
    events: {
      onStart: () => emit('start', data),
      onEnd: () => emit('end', data),
    },
  });
</script>