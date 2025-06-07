<template>
  <div
    ref="elementRef"
    class="droppable"
    :class="{
      'is-overed': isOvered,
      'is-allowed': isAllowed,
    }"
  >
    <p>
      {{ id }}
      <kbd
        v-for="group in groups"
        :key="group"
      >
        {{ group }}
      </kbd>
    </p>

    <slot />
  </div>
</template>
//

<script setup lang="ts">
  import { useDroppable } from '@vue-dnd-kit/core';

  const emit = defineEmits<{
    (e: 'drop'): void;
  }>();

  const { id, groups } = defineProps<{
    id: string,
    groups: string[];
  }>();

  const { elementRef, isOvered, isAllowed } = useDroppable({
    id,
    groups,
    events: {
      onDrop: (e) => emit('drop', id)
    },
  });
</script>

<style scoped>
  .droppable {
    width: 100%;
    height: 100%;
    padding: 1rem;
    border: 1px dashed rgba(62, 175, 124, 0.3);
    border-radius: 6px;
    background-color: rgba(62, 175, 124, 0.1);
  }

  .is-overed {
    background-color: rgba(62, 175, 124, 0.2);
  }

  .is-allowed {
    background-color: rgba(62, 175, 124, 0.3);
  }

  kbd {
    background-color: #fafafa;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 0.2rem 0.4rem;
    font-size: 0.8rem;
    font-weight: 500;
    color: #333;
  }
</style>