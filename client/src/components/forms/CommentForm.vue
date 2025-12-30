<template>
  <form @submit.prevent="handleSubmit" class="mb-4">
    <div class="flex flex-col gap-2">
      <textarea
        v-model="commentText"
        :placeholder="placeholder"
        class="w-full p-2 border rounded-md dark:bg-slate-800 dark:text-white dark:border-slate-700"
        rows="3"
        :disabled="!isAuthenticated || isSubmitting"
      />
      <div class="flex gap-2 items-center">
        <button
          type="submit"
          :disabled="!commentText.trim() || isSubmitting || !isAuthenticated"
          class="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600"
        >
          {{ isSubmitting ? 'Posting...' : (parentId ? 'Reply' : 'Comment') }}
        </button>
        <span v-if="error" class="text-red-500 text-sm">{{ error }}</span>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useComment } from '@/composables/commentProvider';
import { useProfile } from '@/composables/profileProvider';

interface Props {
  sphereId: string;
  parentId?: string | null;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  parentId: null,
  placeholder: 'Write a comment...',
});

const commentText = ref('');
const isSubmitting = ref(false);
const localError = ref<string | null>(null);

const { createComment, error: providerError } = useComment();
const { profile } = useProfile();

const isAuthenticated = computed(() => !!profile.value?.id);

const error = computed(() => localError.value || providerError.value);

const handleSubmit = async () => {
  if (!commentText.value.trim()) return;
  if (!isAuthenticated.value) {
    localError.value = 'You must be authenticated to comment.';
    return;
  }

  console.log('Submitting comment:', { text: commentText.value, sphereId: props.sphereId, parentId: props.parentId });

  isSubmitting.value = true;
  localError.value = null;

  const result = await createComment(
    commentText.value,
    props.sphereId,
    props.parentId || null
  );

  console.log('Comment creation result:', result);

  if (result) {
    console.log('Comment created successfully, clearing form');
    commentText.value = '';
    localError.value = null;
  } else {
    localError.value = providerError.value || 'Failed to post comment.';
    console.error('Comment creation failed:', providerError.value);
  }

  isSubmitting.value = false;
};
</script>
