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

    // Store comment at primary location: comment/{id}
    console.log('Saving comment to Gun.js at:', `comment/${id}`);
    gun.get(`comment/${id}`).put(comment);

    // Add to sphere's comment index at: sphere/{sphereId}/comments/{id}
    console.log('Adding comment to sphere index:', `sphere/${sphereId}/comments/${id}`);
    gun
      .get(`sphere/${sphereId}`)
      .get('comments')
      .get(id)
      .put(comment);

    // If reply, add to parent's replies: comment/{parentId}/replies/{id}
    if (parentId) {
      console.log('Adding reply to parent:', `comment/${parentId}/replies/${id}`);
      gun
        .get(`comment/${parentId}`)
        .get('replies')
        .get(id)
        .put(comment);
    }

    console.log('Comment saved to Gun.js:', comment);

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

      // Load comment IDs from Gun.js at: sphere/{sphereId}/comments
      const sphereCommentIndex = await new Promise<any>((resolve) => {
        console.log('Querying Gun.js for comment index at:', `sphere/${sphereId}/comments`);
        gun
          .get(`sphere/${sphereId}`)
          .get('comments')
          .once((data: any) => {
            console.log('Retrieved comment index from Gun.js:', data);
            resolve(data || {});
          });
      });

      // Extract comment IDs (filter out Gun.js metadata keys starting with '_')
      const commentIds = Object.keys(sphereCommentIndex).filter((key) => !key.startsWith('_'));
      console.log(`Found ${commentIds.length} comments in sphere ${sphereId}:`, commentIds);

      // Load full comment data for each ID
      const commentPromises = commentIds.map((commentId) => {
        return new Promise<void>((resolve) => {
          console.log(`Loading comment data from Gun.js at: comment/${commentId}`);
          gun
            .get(`comment/${commentId}`)
            .once(async (commentData: any) => {
              console.log(`Retrieved comment from Gun.js:`, commentId, commentData);

              if (!commentData || !commentData.id) {
                console.warn(`Comment data missing or invalid for ${commentId}:`, commentData);
                resolve();
                return;
              }

              // Load vote counts and user's vote
              const voteCount = await loadVoteCounts(commentData.id);
              const userVote = await getUserVote(commentData.id);
              const replyCount = await loadReplyCount(commentData.id);

              const commentWithVotes: CommentWithVotes = {
                ...commentData,
                voteCount,
                userVote,
                replyCount,
              };

              // Check if already in local state, update or add
              const existingIndex = comments.value.findIndex(c => c.id === commentData.id);
              if (existingIndex >= 0) {
                comments.value[existingIndex] = commentWithVotes;
              } else {
                comments.value.push(commentWithVotes);
              }

              console.log(`Added comment to local state:`, commentWithVotes);
              resolve();
            });
        });
      });

      console.log(`Loading ${commentPromises.length} comments...`);
      await Promise.all(commentPromises);
      console.log(`Finished loading comments. Total in state: ${comments.value.length}`);

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
