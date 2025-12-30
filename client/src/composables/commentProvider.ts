import { ref, computed, inject, provide, onMounted, onUnmounted } from 'vue';
import gun from '@/services/gun';
import { useProfile } from '@/composables/profileProvider';
import type { Comment, Vote, CommentWithVotes } from '@/types';

const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

export function commentProvider() {
  const comments = ref<CommentWithVotes[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  let commentListener: any = null;
  let voteListener: any = null;
  const voteCache = new Map<string, number>();
  const userVoteCache = new Map<string, number | null>();

  // Call composables at the top level
  const { profile } = useProfile();

  /**
   * Create a new comment or reply
   */
  const createComment = async (
    text: string,
    sphereId: string,
    parentId: string | null = null
  ): Promise<Comment | null> => {
    try {
      error.value = null;

      if (!gun.user().is) {
        error.value = 'You must be authenticated to comment.';
        return null;
      }
      if (!profile.value?.id) {
        error.value = 'No profile selected.';
        return null;
      }

      const id = crypto.randomUUID();
      const comment: Comment = {
        id,
        text,
        authorId: profile.value.id,
        sphereId,
        parentId,
        createdAt: new Date().toISOString(),
      };

      console.log('Creating comment:', comment);

      // Store comment at primary location
      gun.get(`comment/${id}`).put(comment);

      // Add to sphere's comments (store comment ID in an object key)
      gun.get(`sphere/${sphereId}`).get('comments').get(id).put(comment);

      // If reply, add to parent's replies
      if (parentId) {
        gun.get(`comment/${parentId}`).get('replies').get(id).put(comment);
      }

      console.log('Comment created successfully');

      // Immediately add to local state for instant UI feedback
      const commentWithVotes: CommentWithVotes = {
        ...comment,
        voteCount: 0,
        userVote: null,
        replyCount: 0,
      };
      comments.value.push(commentWithVotes);
      console.log('Comment added to local state:', commentWithVotes);

      return comment;
    } catch (e) {
      error.value = `Failed to create comment: ${e}`;
      return null;
    }
  };

  /**
   * Load all comments for a sphere with real-time listening
   */
  const loadComments = async (sphereId: string) => {
    try {
      loading.value = true;
      error.value = null;

      // Clean up old listeners
      if (commentListener) {
        commentListener.off();
      }

      comments.value = [];
      voteCache.clear();
      userVoteCache.clear();

      console.log('Loading comments for sphere:', sphereId);

      // First, load existing comments from Gun.js
      const sphereComments = await new Promise<any>((resolve) => {
        gun
          .get(`sphere/${sphereId}`)
          .get('comments')
          .once((data: any) => {
            console.log('Loaded existing comments data:', data);
            resolve(data || {});
          });
      });

      // Process existing comments
      const commentPromises = Object.keys(sphereComments)
        .filter((key) => !key.startsWith('_')) // Skip Gun.js metadata
        .map(async (key) => {
          const commentId = key;
          return new Promise<void>((resolve) => {
            gun
              .get(`comment/${commentId}`)
              .once(async (data: any) => {
                if (data && data.id) {
                  console.log('Loaded comment:', data);
                  const voteCount = await loadVoteCounts(data.id);
                  const userVote = await getUserVote(data.id);
                  const replyCount = await loadReplyCount(data.id);

                  const commentWithVotes: CommentWithVotes = {
                    ...data,
                    voteCount,
                    userVote,
                    replyCount,
                  };

                  const existingIndex = comments.value.findIndex(c => c.id === data.id);
                  if (existingIndex >= 0) {
                    comments.value[existingIndex] = commentWithVotes;
                  } else {
                    comments.value.push(commentWithVotes);
                  }
                }
                resolve();
              });
          });
        });

      await Promise.all(commentPromises);

      // Then, set up listener for future changes
      console.log('Setting up listener for sphere:', sphereId);
      commentListener = gun
        .get(`sphere/${sphereId}`)
        .get('comments')
        .map()
        .on(async (data: any) => {
          console.log('Listener triggered with data:', data);

          if (!data || !data.id) {
            console.warn('Ignoring data without id:', data);
            return;
          }

          try {
            // Load full comment data
            gun
              .get(`comment/${data.id}`)
              .once(async (fullData: any) => {
                if (!fullData || !fullData.id) return;

                const voteCount = await loadVoteCounts(fullData.id);
                const userVote = await getUserVote(fullData.id);
                const replyCount = await loadReplyCount(fullData.id);

                const commentWithVotes: CommentWithVotes = {
                  ...fullData,
                  voteCount,
                  userVote,
                  replyCount,
                };

                const existingIndex = comments.value.findIndex(c => c.id === fullData.id);
                if (existingIndex >= 0) {
                  comments.value[existingIndex] = commentWithVotes;
                } else {
                  comments.value.push(commentWithVotes);
                }
              });
          } catch (e) {
            console.error(`Failed to load comment ${data.id}:`, e);
          }
        });

      loading.value = false;
      console.log('Comments loaded. Count:', comments.value.length);
    } catch (e) {
      error.value = `Failed to load comments: ${e}`;
      loading.value = false;
    }
  };

  /**
   * Vote on a comment (upvote, downvote, or remove vote)
   */
  const voteComment = async (
    commentId: string,
    value: number // 1 for upvote, -1 for downvote
  ): Promise<boolean> => {
    try {
      error.value = null;

      if (!gun.user().is) {
        error.value = 'You must be authenticated to vote.';
        return false;
      }

      if (![1, -1].includes(value)) {
        error.value = 'Vote value must be 1 (upvote) or -1 (downvote).';
        return false;
      }
      if (!profile.value?.id) {
        error.value = 'No profile selected.';
        return false;
      }

      const voteIndexKey = `vote_index/${profile.value.id}/${commentId}`;

      // Check existing vote
      return new Promise((resolve) => {
        gun.get(voteIndexKey).once((existingVote: any) => {
          if (existingVote?.id && existingVote?.value === value) {
            // Same vote clicked - remove it (toggle off)
            gun.get(`vote/${existingVote.id}`).put(null);
            gun.get(voteIndexKey).put(null);
            userVoteCache.set(commentId, null);
            resolve(true);
          } else if (existingVote?.id) {
            // Different vote - update it
            const voteId = existingVote.id;
            const updatedVote: Vote = {
              ...existingVote,
              value,
              createdAt: new Date().toISOString(),
            };
            gun.get(`vote/${voteId}`).put(updatedVote);
            userVoteCache.set(commentId, value);
            resolve(true);
          } else {
            // No existing vote - create new one
            const voteId = crypto.randomUUID();
            const vote: Vote = {
              id: voteId,
              commentId,
              profileId: profile.value.id,
              value,
              createdAt: new Date().toISOString(),
            };
            gun.get(`vote/${voteId}`).put(vote);
            gun.get(`comment/${commentId}`).get('votes').set(vote);
            gun.get(voteIndexKey).put(vote);
            userVoteCache.set(commentId, value);
            resolve(true);
          }
        });
      });
    } catch (e) {
      error.value = `Failed to vote: ${e}`;
      return false;
    }
  };

  /**
   * Load aggregated vote count for a comment
   */
  const loadVoteCounts = async (commentId: string): Promise<number> => {
    try {
      // Check cache first
      if (voteCache.has(commentId)) {
        return voteCache.get(commentId) || 0;
      }

      return new Promise((resolve) => {
        gun.get(`comment/${commentId}`).get('votes').once((votes: any) => {
          if (!votes) {
            resolve(0);
            return;
          }

          let totalVotes = 0;
          Object.keys(votes).forEach((key) => {
            const vote = votes[key];
            if (vote?.value) {
              totalVotes += vote.value;
            }
          });

          voteCache.set(commentId, totalVotes);
          resolve(totalVotes);
        });
      });
    } catch (e) {
      console.error(`Failed to load vote counts for ${commentId}:`, e);
      return 0;
    }
  };

  /**
   * Get current user's vote on a comment
   */
  const getUserVote = async (commentId: string): Promise<number | null> => {
    try {
      if (!profile.value?.id) {
        return null;
      }

      // Check cache first
      const cacheKey = `${profile.value.id}_${commentId}`;
      if (userVoteCache.has(cacheKey)) {
        return userVoteCache.get(cacheKey) || null;
      }

      return new Promise((resolve) => {
        gun
          .get(`vote_index/${profile.value!.id}/${commentId}`)
          .once((vote: any) => {
            const voteValue = vote?.value || null;
            userVoteCache.set(cacheKey, voteValue);
            resolve(voteValue);
          });
      });
    } catch (e) {
      console.error(`Failed to get user vote for ${commentId}:`, e);
      return null;
    }
  };

  /**
   * Load reply count for a comment
   */
  const loadReplyCount = async (commentId: string): Promise<number> => {
    try {
      return new Promise((resolve) => {
        gun
          .get(`comment/${commentId}`)
          .get('replies')
          .once((replies: any) => {
            if (!replies) {
              resolve(0);
              return;
            }
            const count = Object.keys(replies).filter(
              (key) => replies[key] !== null
            ).length;
            resolve(count);
          });
      });
    } catch (e) {
      console.error(`Failed to load reply count for ${commentId}:`, e);
      return 0;
    }
  };

  /**
   * Clear all listeners and reset state
   */
  const clear = () => {
    if (commentListener) {
      commentListener.off();
      commentListener = null;
    }
    if (voteListener) {
      voteListener.off();
      voteListener = null;
    }
    comments.value = [];
    voteCache.clear();
    userVoteCache.clear();
    error.value = null;
  };

  /**
   * Lifecycle cleanup
   */
  onUnmounted(() => {
    clear();
  });

  // Provide for children
  provide('comment', {
    comments,
    loading,
    error,
    createComment,
    loadComments,
    voteComment,
  });

  return {
    comments,
    loading,
    error,
    createComment,
    loadComments,
    voteComment,
  };
}

/**
 * Composable consumer
 */
export function useComment() {
  const data = inject<any>('comment');
  if (!data) {
    throw new Error('Composable must have a comment provider.');
  }
  return data;
}
