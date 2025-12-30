<template>
  <div class="comment-list">
    <div v-if="sortedComments.length === 0" class="text-center py-8 text-gray-500">
      No comments yet. Be the first to comment!
    </div>

    <CommentItem
      v-for="comment in sortedComments"
      :key="comment.id"
      :comment="comment"
      :depth="depth"
    />
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
