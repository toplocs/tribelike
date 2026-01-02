<template>
  <div :class="depthClass" class="border-l-2 border-gray-200 dark:border-gray-700 pl-4 py-3">
    <!-- Author info and timestamp -->
    <div class="flex items-center gap-2 mb-2">
      <router-link
        :to="`/profile/${comment.authorId}`"
        class="font-semibold text-sm text-blue-600 dark:text-blue-400 hover:underline"
      >
        {{ authorName }}
      </router-link>
      <span class="text-xs text-gray-500">{{ formattedTime }}</span>
    </div>

    <!-- Comment text -->
    <p class="mb-3 text-sm whitespace-pre-wrap text-gray-900 dark:text-gray-100">{{ comment.text }}</p>

    <!-- Actions row -->
    <div class="flex gap-4 items-center text-xs">
      <!-- Vote buttons -->
      <div class="flex items-center gap-2">
        <button
          @click="handleVote(1)"
          :class="{ 'text-green-600 font-bold': comment.userVote === 1 }"
          class="hover:text-green-600 transition px-1"
          :disabled="!isAuthenticated"
          title="Upvote"
        >
          ↑
        </button>
        <span class="w-4 text-center text-xs">{{ currentVoteCount }}</span>
        <button
          @click="handleVote(-1)"
          :class="{ 'text-red-600 font-bold': comment.userVote === -1 }"
          class="hover:text-red-600 transition px-1"
          :disabled="!isAuthenticated"
          title="Downvote"
        >
          ↓
        </button>
      </div>

      <!-- Divider -->
      <span class="text-gray-300 dark:text-gray-600">•</span>

      <!-- Reply button -->
      <button
        v-if="depth < 5"
        @click="showReplyForm = !showReplyForm"
        class="hover:text-blue-600 transition text-gray-600 dark:text-gray-400"
        :disabled="!isAuthenticated"
      >
        Reply ({{ comment.replyCount }})
      </button>

      <span v-if="voteError" class="text-red-500">{{ voteError }}</span>
    </div>

    <!-- Reply form -->
    <div v-if="showReplyForm && depth < 5" class="mt-4">
      <CommentForm
        :sphereId="comment.sphereId"
        :parentId="comment.id"
        placeholder="Write a reply..."
      />
    </div>

    <!-- Nested replies -->
    <div v-if="replies.length > 0" class="mt-4">
      <CommentList :comments="replies" :depth="depth + 1" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { CommentWithVotes } from '@/types';
import CommentForm from '@/components/forms/CommentForm.vue';
import CommentList from '@/components/CommentList.vue';
import { useComment } from '@/composables/commentProvider';
import { useProfile } from '@/composables/profileProvider';
import gun from '@/services/gun';

interface Props {
  comment: CommentWithVotes;
  depth?: number;
}

const props = withDefaults(defineProps<Props>(), {
  depth: 0,
});

const showReplyForm = ref(false);
const authorName = ref('Anonymous');
const voteError = ref<string | null>(null);
let replyListener: any = null;
const currentVoteCount = ref<number>(0);

const { voteComment, error: commentError } = useComment();
const { profile } = useProfile();

const isAuthenticated = computed(() => !!profile.value?.id);

const depthClass = computed(() => {
  const paddingMap: Record<number, string> = {
    0: 'ml-0',
    1: 'ml-4',
    2: 'ml-8',
    3: 'ml-12',
    4: 'ml-16',
    5: 'ml-20',
  };
  return paddingMap[Math.min(props.depth, 5)] || 'ml-0';
});

const formattedTime = computed(() => {
  const date = new Date(props.comment.createdAt);
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (secondsAgo < 60) return 'just now';
  if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}m ago`;
  if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)}h ago`;
  if (secondsAgo < 2592000) return `${Math.floor(secondsAgo / 86400)}d ago`;
  return date.toLocaleDateString();
});

const replyComments = ref<CommentWithVotes[]>([]);

const loadReplies = async () => {
  try {
    // Clean up old listener if it exists
    if (replyListener) {
      replyListener.off();
      replyListener = null;
    }

    replyComments.value = [];

    // Load replies once (not continuous listening to save memory)
    replyListener = gun
      .get(`comment/${props.comment.id}`)
      .get('replies')
      .map()
      .once((data: any) => {
        if (!data || !data.id) return;

        const replyWithVotes: CommentWithVotes = {
          id: data.id,
          text: data.text,
          authorId: data.authorId,
          sphereId: data.sphereId,
          parentId: data.parentId,
          createdAt: data.createdAt,
          voteCount: 0,
          userVote: null,
          replyCount: 0,
        };

        const existingIndex = replyComments.value.findIndex(c => c.id === data.id);
        if (existingIndex >= 0) {
          replyComments.value[existingIndex] = replyWithVotes;
        } else {
          replyComments.value.push(replyWithVotes);
        }
      });
  } catch (e) {
    console.error(`Failed to load replies for ${props.comment.id}:`, e);
  }
};

const replies = computed(() => replyComments.value);

onMounted(async () => {
  // Load author profile (one-time, not continuous)
  try {
    gun.get(`profile/${props.comment.authorId}`).once((profile: any) => {
      if (profile && profile.username) {
        authorName.value = profile.username;
      }
    });
  } catch (e) {
    console.error('Failed to load author profile:', e);
  }

  // Initialize vote count from comment props (no continuous listener needed)
  currentVoteCount.value = props.comment.voteCount;

  // Load replies for this comment
  await loadReplies();
});

onUnmounted(() => {
  if (replyListener) {
    replyListener.off();
    replyListener = null;
  }
});

const handleVote = async (value: number) => {
  if (!isAuthenticated.value) {
    voteError.value = 'You must be authenticated to vote.';
    return;
  }

  voteError.value = null;

  // Calculate immediate vote count update for optimistic feedback
  const previousVoteCount = currentVoteCount.value;
  const previousUserVote = props.comment.userVote;

  // Update vote count immediately for instant feedback
  if (previousUserVote === value) {
    // Same vote clicked - remove it (toggle off)
    currentVoteCount.value -= value;
  } else if (previousUserVote !== null) {
    // Different vote - update it
    currentVoteCount.value = currentVoteCount.value - previousUserVote + value;
  } else {
    // No existing vote - add new one
    currentVoteCount.value += value;
  }

  console.log(`📊 Vote optimistic update: ${previousVoteCount} → ${currentVoteCount.value}`);

  // Send vote to Gun.js in background
  const success = await voteComment(props.comment.id, value);

  if (!success) {
    // Revert optimistic update on failure
    currentVoteCount.value = previousVoteCount;
    voteError.value = commentError.value || 'Failed to vote.';
    console.error('Vote failed, reverted to:', previousVoteCount);
  } else {
    console.log('✓ Vote successful, count:', currentVoteCount.value);
  }
};
</script>
