<template>
  <div class="comment-list space-y-0">
    <CommentItem
      v-for="comment in sortedComments"
      :key="comment.id"
      :comment="comment"
      :depth="depth"
    />

    <div v-if="sortedComments.length === 0 && depth === 0" class="py-8 text-center text-gray-500 dark:text-gray-400">
      No comments yet. Be the first to comment!
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { CommentWithVotes } from '@/types';
import CommentItem from '@/components/CommentItem.vue';

interface Props {
  comments: CommentWithVotes[];
  depth?: number;
}

const props = withDefaults(defineProps<Props>(), {
  depth: 0,
});

const sortedComments = computed(() => {
  return [...props.comments]
    .filter((c) => c.parentId === null)
    .sort((a, b) => {
      // Sort by vote count descending, then by creation date
      if (a.voteCount !== b.voteCount) {
        return b.voteCount - a.voteCount;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
});
</script>
