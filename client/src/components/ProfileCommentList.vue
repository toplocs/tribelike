<template>
  <div class="space-y-3">
    <div v-if="props.loading" class="space-y-2">
      <!-- Skeleton loaders -->
      <div v-for="i in 3" :key="i" class="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
        <div class="h-4 w-32 rounded bg-gray-300 dark:bg-gray-600 mb-2" />
        <div class="h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>

    <div v-else-if="props.comments.length === 0" class="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-4 text-centre">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        No comments yet. Start by commenting on spheres!
      </p>
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="comment in props.comments"
        :key="comment.id"
        class="rounded-lg border border-gray-200 dark:border-gray-700 p-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colours"
      >
        <!-- Comment Meta -->
        <div class="mb-2 flex flex-col gap-1">
          <div class="flex items-centre justify-between">
            <router-link
              :to="`/sphere/${comment.sphereId}`"
              class="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              View in Sphere
            </router-link>
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {{ formatRelativeDate(comment.createdAt) }}
            </span>
          </div>
        </div>

        <!-- Comment Text -->
        <p class="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-2">
          {{ comment.text }}
        </p>

        <!-- Vote Count -->
        <div class="flex items-centre gap-2 text-xs text-gray-600 dark:text-gray-400">
          <span v-if="comment.voteCount > 0" class="inline-flex items-centre gap-1">
            👍 {{ comment.voteCount }} {{ comment.voteCount === 1 ? 'vote' : 'votes' }}
          </span>
          <span v-else class="text-gray-500">No votes yet</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CommentWithVotes } from '@/types';

interface Props {
  comments: CommentWithVotes[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

/**
 * Format date as relative time (e.g., "2m ago", "5h ago")
 */
const formatRelativeDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return new Intl.DateTimeFormat('en', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return 'unknown date';
  }
};
</script>
