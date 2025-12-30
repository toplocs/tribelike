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

    return new Promise<Comment>((resolve, reject) => {
      try {
        // 1. Store comment at primary location: comment/{id}
        // Use round-trip write: put() then once() to ensure persistence to storage
        console.log('Saving comment to Gun.js at:', `comment/${id}`);
        gun
          .get(`comment/${id}`)
          .put(comment)
          .once(() => {
            // Verify data is persisted by reading it back
            console.log('✓ Comment persisted to Gun.js:', id);

            // 2. Add comment data to sphere's comment index
            console.log('Adding comment to sphere index:', `sphere/${sphereId}/comments/${id}`);
            gun
              .get(`sphere/${sphereId}`)
              .get('comments')
              .get(id)
              .put(comment)
              .once(() => {
                console.log('✓ Comment added to sphere index:', sphereId);

                // 3. If reply, add to parent's replies
                if (parentId) {
                  console.log('Adding reply to parent:', `comment/${parentId}/replies/${id}`);
                  gun
                    .get(`comment/${parentId}`)
                    .get('replies')
                    .get(id)
                    .put(comment)
                    .once(() => {
                      console.log('✓ Reply added to parent:', parentId);
                      addCommentToLocalState(comment);
                      resolve(comment);
                    });
                } else {
                  addCommentToLocalState(comment);
                  resolve(comment);
                }
              });
          });
      } catch (err) {
        console.error('Error creating comment:', err);
        error.value = `Failed to create comment: ${err}`;
        reject(err);
      }
    });
  };

  /**
   * Helper to add comment to local state
   */
  const addCommentToLocalState = (comment: Comment) => {
    const commentWithVotes: CommentWithVotes = {
      ...comment,
      voteCount: 0,
      userVote: null,
      replyCount: 0,
    };
    comments.value.push(commentWithVotes);
    console.log('✓ Comment added to local state:', commentWithVotes);

    // Debug: Check if data is in localStorage
    checkStorageDebug(comment.id);
  };

  /**
   * Debug function to verify data is in localStorage
   */
  const checkStorageDebug = (commentId: string) => {
    console.log('🔍 Checking localStorage for comment:', commentId);
    const allKeys = Object.keys(localStorage);
    console.log('📦 Total localStorage keys:', allKeys.length);

    const relevantKeys = allKeys.filter(k => k.includes(commentId) || k.includes('comment'));
    if (relevantKeys.length > 0) {
      console.log('✓ Found relevant keys in localStorage:', relevantKeys);
      relevantKeys.forEach(key => {
        const value = localStorage.getItem(key);
        console.log(`  ${key}:`, value ? JSON.parse(value) : 'null');
      });
    } else {
      console.warn('⚠️ No relevant keys found in localStorage');
      console.log('Sample localStorage keys:', allKeys.slice(0, 5));
    }

                // 3. If reply, add to parent's replies
                if (parentId) {
                  console.log('Adding reply to parent:', `comment/${parentId}/replies/${id}`);
                  gun
                    .get(`comment/${parentId}`)
                    .get('replies')
                    .get(id)
                    .put(comment)
                    .once(() => {
                      console.log('✓ Reply added to parent:', parentId);
                      addCommentToLocalState(comment);
                      resolve(comment);
                    });
                } else {
                  addCommentToLocalState(comment);
                  resolve(comment);
                }
              });
          });
      } catch (err) {
        console.error('Error creating comment:', err);
        error.value = `Failed to create comment: ${err}`;
        reject(err);
      }
    });
  };

  /**
   * Helper to add comment to local state
   */
  const addCommentToLocalState = (comment: Comment) => {
    const commentWithVotes: CommentWithVotes = {
      ...comment,
      voteCount: 0,
      userVote: null,
      replyCount: 0,
    };
    comments.value.push(commentWithVotes);
    console.log('✓ Comment added to local state:', commentWithVotes);

    // Debug: Check if data is in localStorage
    checkStorageDebug(comment.id);
  };

  /**
   * Debug function to verify data is in localStorage
   */
  const checkStorageDebug = (commentId: string) => {
    console.log('🔍 Checking localStorage for comment:', commentId);
    const allKeys = Object.keys(localStorage);
    console.log('📦 Total localStorage keys:', allKeys.length);

    const relevantKeys = allKeys.filter(k => k.includes(commentId) || k.includes('comment'));
    if (relevantKeys.length > 0) {
      console.log('✓ Found relevant keys in localStorage:', relevantKeys);
      relevantKeys.forEach(key => {
        const value = localStorage.getItem(key);
        console.log(`  ${key}:`, value ? JSON.parse(value) : 'null');
      });
    } else {
      console.warn('⚠️ No relevant keys found in localStorage');
      console.log('Sample localStorage keys:', allKeys.slice(0, 5));
    }
  };

  /**
   * Load all comments for a sphere with real-time listening
   */
  const loadComments = async (sphereId: string) => {
    try {
      loading.value = true;
      error.value = null;

      // Clean up old listeners completely
      if (commentListener) {
        commentListener.off();
        commentListener = null;
      }

      comments.value = [];
      voteCache.clear();
      userVoteCache.clear();

      console.log('📂 Loading comments for sphere:', sphereId);
      console.log('🔍 Querying Gun.js at: sphere/' + sphereId + '/comments');

      // Wait for initial comments to load before setting loading to false
      const initialLoadPromise = new Promise<void>((resolveInitialLoad) => {
        let hasInitialized = false;
        let commentCount = 0;

        // Use .map().on() for real-time updates, but limit scope
        commentListener = gun
          .get(`sphere/${sphereId}`)
          .get('comments')
          .map()
          .on(async (commentData: any) => {
            if (!commentData || !commentData.id) {
              return;
            }

            try {
              // Clean Gun.js metadata before processing
              const cleanComment = {
                id: commentData.id,
                text: commentData.text,
                authorId: commentData.authorId,
                sphereId: commentData.sphereId,
                parentId: commentData.parentId,
                createdAt: commentData.createdAt,
              };

              // Load vote counts and user's vote for this comment
              const voteCount = await loadVoteCounts(cleanComment.id);
              const userVote = await getUserVote(cleanComment.id);
              const replyCount = await loadReplyCount(cleanComment.id);

              const commentWithVotes: CommentWithVotes = {
                ...cleanComment,
                voteCount,
                userVote,
                replyCount,
              };

              // Check if already in local state, update or add
              const existingIndex = comments.value.findIndex(c => c.id === cleanComment.id);
              if (existingIndex >= 0) {
                comments.value[existingIndex] = commentWithVotes;
              } else {
                comments.value.push(commentWithVotes);
                commentCount++;
              }

              // Mark initial load as complete after first batch of comments
              if (!hasInitialized && commentCount >= 1) {
                hasInitialized = true;
                console.log('📚 Initial comments loaded, count:', commentCount);
                resolveInitialLoad();
              }
            } catch (err) {
              console.error(`Failed to load comment ${commentData.id}:`, err);
            }
          });

        // Resolve after timeout in case there are no comments
        setTimeout(() => {
          if (!hasInitialized) {
            hasInitialized = true;
            console.log('📚 Timeout reached, no comments found');
            resolveInitialLoad();
          }
        }, 1000);
      });

      // Wait for initial load before hiding spinner
      await initialLoadPromise;
      loading.value = false;
      console.log('📚 Comments loaded. Count:', comments.value.length);
    } catch (e) {
      error.value = `Failed to load comments: ${e}`;
      loading.value = false;
      console.error('Error loading comments:', e);
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
   * Load aggregated vote count for a comment (one-time read, not continuous)
   */
  const loadVoteCounts = async (commentId: string): Promise<number> => {
    try {
      // Check cache first
      if (voteCache.has(commentId)) {
        return voteCache.get(commentId) || 0;
      }

      return new Promise((resolve) => {
        const timeoutId = setTimeout(() => {
          // Timeout after 500ms to prevent hanging
          resolve(0);
        }, 500);

        gun.get(`comment/${commentId}`).get('votes').once((votes: any) => {
          clearTimeout(timeoutId);

          if (!votes) {
            voteCache.set(commentId, 0);
            resolve(0);
            return;
          }

          let totalVotes = 0;
          Object.keys(votes).forEach((key) => {
            if (key.startsWith('_')) return; // Skip Gun.js metadata
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
