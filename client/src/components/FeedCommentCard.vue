<template>
  <div class="ring-1 rounded-lg p-4 bg-white dark:bg-gray-800 ring-gray-300 dark:ring-gray-700 shadow-md dark:shadow-lg hover:shadow-lg dark:hover:shadow-xl transition-shadow">
    <!-- Header with sphere context and metadata -->
    <div class="mb-3">
      <div class="flex flex-wrap items-center gap-2 mb-2">
        <router-link :to="`/sphere/${comment.sphereId}`" class="hover:opacity-80 flex-shrink-0">
          <TopicBadge v-if="sphereData?.type === 'topic'" :title="sphereData?.title || 'Topic'" />
          <LocationBadge
            v-else-if="sphereData?.type === 'location'"
            :title="sphereData?.title || 'Location'"
          />
          <BasicBadge v-else :title="sphereData?.title || 'Sphere'" />
        </router-link>
      </div>

      <!-- Author and metadata row -->
      <div class="flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
        <router-link
          :to="`/profile/${comment.authorId}`"
          class="font-semibold text-sm text-blue-600 dark:text-blue-400 hover:underline flex-shrink-0"
        >
          {{ authorData?.username || 'Anonymous' }}
        </router-link>
        <span class="flex-shrink-0">{{ relativeTime }}</span>
      </div>
    </div>

    <!-- Comment text -->
    <p class="mb-4 text-sm whitespace-pre-wrap text-gray-900 dark:text-gray-100 leading-relaxed break-words">
      {{ comment.text }}
    </p>

    <!-- Actions bar (matching CommentItem style) -->
    <div class="flex gap-4 items-center text-xs">
      <!-- Vote buttons (matching CommentItem.vue) -->
      <div class="flex items-center gap-2">
        <button
          @click="handleVote(1)"
          :class="{ 'text-green-600 font-bold': comment.userVote === 1 }"
          class="hover:text-green-600 transition px-1"
          :disabled="votingLoading"
          title="Upvote"
        >
          ↑
        </button>
        <span
          :class="{
            'text-green-600 font-bold': comment.userVote === 1,
            'text-red-600 font-bold': comment.userVote === -1,
          }"
          class="w-6 text-center text-xs"
        >
          {{ comment.voteCount }}
        </span>
        <button
          @click="handleVote(-1)"
          :class="{ 'text-red-600 font-bold': comment.userVote === -1 }"
          class="hover:text-red-600 transition px-1"
          :disabled="votingLoading"
          title="Downvote"
        >
          ↓
        </button>
      </div>

      <!-- Divider -->
      <span class="text-gray-300 dark:text-gray-600">•</span>

      <!-- Replies link -->
      <router-link
        :to="`/sphere/${comment.sphereId}#comment-${comment.id}`"
        class="hover:text-blue-600 transition text-gray-600 dark:text-gray-400"
      >
        Reply ({{ comment.replyCount }})
      </router-link>

      <!-- Loading indicator -->
      <span v-if="votingLoading" class="text-gray-500 dark:text-gray-500">Saving...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import gun from '@/services/gun';
import { useProfile } from '@/composables/profileProvider';
import Card from '@/components/common/Card.vue';
import TopicBadge from '@/components/badges/TopicBadge.vue';
import LocationBadge from '@/components/badges/LocationBadge.vue';
import BasicBadge from '@/components/badges/BasicBadge.vue';
import type { CommentWithVotes } from '@/types';

interface Props {
  comment: CommentWithVotes;
}

const props = defineProps<Props>();
const router = useRouter();
const { profile } = useProfile();

const sphereData = ref<any>(null);
const authorData = ref<any>(null);
const votingLoading = ref(false);

// Computed relative time
const relativeTime = computed(() => {
  const now = new Date();
  const commentDate = new Date(props.comment.createdAt);
  const diffMs = now.getTime() - commentDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return commentDate.toLocaleDateString();
});

// Load sphere metadata
const loadSphereData = async () => {
  try {
    gun.get(`sphere/${props.comment.sphereId}`).once((data: any) => {
      if (data) {
        sphereData.value = data;
      }
    });
  } catch (err) {
    console.error('Failed to load sphere data:', err);
  }
};

// Load author metadata
const loadAuthorData = async () => {
  try {
    gun.get(`profile/${props.comment.authorId}`).once((data: any) => {
      if (data) {
        authorData.value = data;
      }
    });
  } catch (err) {
    console.error('Failed to load author data:', err);
  }
};

// Handle voting
const handleVote = async (value: number) => {
  try {
    if (!profile.value?.id) {
      router.push('/login');
      return;
    }

    votingLoading.value = true;

    const voteIndexKey = `vote_index/${profile.value.id}/${props.comment.id}`;

    // Check existing vote
    gun.get(voteIndexKey).once((existingVote: any) => {
      if (existingVote?.id && existingVote?.value === value) {
        // Same vote clicked - remove it (toggle off)
        gun.get(`vote/${existingVote.id}`).put(null);
        gun.get(voteIndexKey).put(null);
        props.comment.userVote = null;
        // Decrement vote count
        props.comment.voteCount -= value;
      } else if (existingVote?.id) {
        // Different vote - update it
        const voteId = existingVote.id;
        const oldValue = existingVote.value;
        const updatedVote = {
          ...existingVote,
          value,
          createdAt: new Date().toISOString(),
        };
        gun.get(`vote/${voteId}`).put(updatedVote);
        props.comment.userVote = value;
        // Adjust vote count for old vote removal + new vote addition
        props.comment.voteCount = props.comment.voteCount - oldValue + value;
      } else {
        // No existing vote - create new one
        const voteId = crypto.randomUUID();
        const vote = {
          id: voteId,
          commentId: props.comment.id,
          profileId: profile.value!.id,
          value,
          createdAt: new Date().toISOString(),
        };
        gun.get(`vote/${voteId}`).put(vote);
        gun.get(`comment/${props.comment.id}`).get('votes').set(vote);
        gun.get(voteIndexKey).put(vote);
        props.comment.userVote = value;
        // Increment vote count
        props.comment.voteCount += value;
      }

      votingLoading.value = false;
    });
  } catch (err) {
    console.error('Failed to vote:', err);
    votingLoading.value = false;
  }
};

onMounted(() => {
  loadSphereData();
  loadAuthorData();
});
</script>
