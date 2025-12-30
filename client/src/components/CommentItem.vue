<template>
  <div :class="depthClass" class="mb-4">
    <Card class="p-4">
      <!-- Author info and timestamp -->
      <div class="flex items-center gap-2 mb-2">
        <span class="font-semibold text-sm">{{ authorName }}</span>
        <span class="text-xs text-gray-500">{{ formattedTime }}</span>
      </div>

      <!-- Comment text -->
      <p class="mb-3 text-sm whitespace-pre-wrap">{{ comment.text }}</p>

      <!-- Actions row -->
      <div class="flex gap-4 items-center text-xs">
        <!-- Vote buttons -->
        <div class="flex items-center gap-1 bg-gray-100 dark:bg-slate-700 rounded px-2 py-1">
          <button
            @click="handleVote(1)"
            :class="{ 'text-green-600 font-bold': comment.userVote === 1 }"
            class="hover:text-green-600 transition"
            :disabled="!isAuthenticated"
          >
            ↑
          </button>
          <span class="w-6 text-center">{{ comment.voteCount }}</span>
          <button
            @click="handleVote(-1)"
            :class="{ 'text-red-600 font-bold': comment.userVote === -1 }"
            class="hover:text-red-600 transition"
            :disabled="!isAuthenticated"
          >
            ↓
          </button>
        </div>

        <!-- Reply button -->
        <button
          v-if="depth < 5"
          @click="showReplyForm = !showReplyForm"
          class="hover:text-blue-600 transition"
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
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { CommentWithVotes } from '@/types';
import Card from '@/components/common/Card.vue';
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
    }

    replyComments.value = [];

    // Load replies for this comment
    replyListener = gun
      .get(`comment/${props.comment.id}`)
      .get('replies')
      .map()
      .on((data: any) => {
        if (!data || !data.id) return;

        const existingIndex = replyComments.value.findIndex(c => c.id === data.id);
        const replyWithVotes: CommentWithVotes = {
          ...data,
          voteCount: 0, // Will be updated as votes come in
          userVote: null,
          replyCount: 0,
        };

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
  // Load author profile
  try {
    const authorProfile = await gun.lookup('profile', props.comment.authorId);
    if (authorProfile && authorProfile.name) {
      authorName.value = authorProfile.name;
    }
  } catch (e) {
    console.error('Failed to load author profile:', e);
  }

  // Load replies for this comment
  await loadReplies();
});

onUnmounted(() => {
  if (replyListener) {
    replyListener.off();
  }
});

const handleVote = async (value: number) => {
  if (!isAuthenticated.value) {
    voteError.value = 'You must be authenticated to vote.';
    return;
  }

  voteError.value = null;
  const success = await voteComment(props.comment.id, value);

  if (!success) {
    voteError.value = commentError.value || 'Failed to vote.';
  }
};
</script>
