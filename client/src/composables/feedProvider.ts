import { ref, onMounted, onUnmounted, watchEffect } from 'vue';
import gun from '@/services/gun';
import { useProfile } from '@/composables/profileProvider';
import type { CommentWithVotes } from '@/types';

interface FeedState {
  feedComments: CommentWithVotes[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  currentOffset: number;
  currentMode: 'global' | 'personal';
  showCTABanner: boolean;
}

export function feedProvider() {
  const feedComments = ref<CommentWithVotes[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const hasMore = ref(true);
  const showCTABanner = ref(false);

  const pageSize = 25;
  let currentOffset = 0;
  let commentListener: any = null;
  let relationListener: any = null;
  let voteCache = new Map<string, number>();
  let userVoteCache = new Map<string, number | null>();

  const { profile } = useProfile();

  /**
   * Load aggregated vote count for a comment (with caching and timeout)
   */
  const loadVoteCounts = async (commentId: string): Promise<number> => {
    try {
      if (voteCache.has(commentId)) {
        return voteCache.get(commentId) || 0;
      }

      return new Promise((resolve) => {
        const timeoutId = setTimeout(() => {
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
            if (key.startsWith('_')) return;
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
   * Get current user's vote on a comment (with caching)
   */
  const getUserVote = async (commentId: string): Promise<number | null> => {
    try {
      if (!profile.value?.id) {
        return null;
      }

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
              (key) => !key.startsWith('_') && replies[key] !== null
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
   * Get all sphere IDs that a user has relations with
   */
  const getUserRelatedSpheres = async (profileId: string): Promise<string[]> => {
    const validRelations = ['like', 'love', 'learn', 'teach'];
    const sphereIds: string[] = [];

    return new Promise<string[]>((resolve) => {
      gun
        .get(profileId)
        .get('relations')
        .map()
        .once((relationData: any) => {
          if (!relationData || !relationData.two) return;

          if (validRelations.includes(relationData.type)) {
            if (!sphereIds.includes(relationData.two)) {
              sphereIds.push(relationData.two);
            }
          }
        });

      setTimeout(() => resolve(sphereIds), 800);
    });
  };

  /**
   * Load comments from specific sphere IDs
   */
  const loadCommentsFromSpheres = async (
    sphereIds: string[],
    limit: number
  ): Promise<CommentWithVotes[]> => {
    const allComments: CommentWithVotes[] = [];

    for (const sphereId of sphereIds) {
      await new Promise<void>((resolve) => {
        gun
          .get(`sphere/${sphereId}`)
          .get('comments')
          .map()
          .once(async (commentData: any) => {
            if (!commentData?.id) return;

            // Only include top-level comments (no replies)
            if (commentData.parentId !== null) return;

            try {
              const voteCount = await loadVoteCounts(commentData.id);
              const userVote = profile.value?.id ? await getUserVote(commentData.id) : null;
              const replyCount = await loadReplyCount(commentData.id);

              const commentWithVotes: CommentWithVotes = {
                id: commentData.id,
                text: commentData.text,
                authorId: commentData.authorId,
                sphereId: commentData.sphereId,
                parentId: commentData.parentId,
                createdAt: commentData.createdAt,
                voteCount,
                userVote,
                replyCount,
              };

              // Avoid duplicates
              const exists = allComments.find((c) => c.id === commentData.id);
              if (!exists) {
                allComments.push(commentWithVotes);
              }
            } catch (err) {
              console.error(`Failed to process comment ${commentData.id}:`, err);
            }
          });

        setTimeout(resolve, 200);
      });
    }

    return allComments;
  };

  /**
   * Load recent comments from all spheres (logged-out users)
   */
  const loadGlobalFeed = async (limit: number = pageSize) => {
    try {
      loading.value = true;
      error.value = null;
      currentOffset = 0;

      console.log('📡 Loading global feed (all comments)');

      // Get sphere IDs
      const sphereIds = await new Promise<string[]>((resolve) => {
        const ids: string[] = [];
        const maxSpheres = 50;

        gun.get('spheres').once((spheresData: any) => {
          if (!spheresData) {
            resolve([]);
            return;
          }

          Object.keys(spheresData).forEach((key) => {
            if (!key.startsWith('_') && ids.length < maxSpheres) {
              ids.push(key);
            }
          });

          resolve(ids);
        });
      });

      console.log(`Found ${sphereIds.length} spheres`);

      // Load comments from spheres
      const comments = await loadCommentsFromSpheres(sphereIds, limit * 2);

      // Sort by most recent first
      feedComments.value = comments
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);

      hasMore.value = comments.length > limit;
      showCTABanner.value = false;

      console.log(`✓ Loaded ${feedComments.value.length} global feed comments`);
    } catch (e) {
      error.value = `Failed to load global feed: ${e}`;
      console.error('Error loading global feed:', e);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Load comments from user's related spheres (logged-in users)
   */
  const loadPersonalFeed = async (profileId: string, limit: number = pageSize) => {
    try {
      loading.value = true;
      error.value = null;
      currentOffset = 0;
      showCTABanner.value = false;

      console.log('👤 Loading personal feed for profile:', profileId);

      // Get user's related sphere IDs
      const relatedSphereIds = await getUserRelatedSpheres(profileId);

      console.log(`Found ${relatedSphereIds.length} related spheres`);

      // If no relations, fallback to global feed (no CTA banner)
      if (relatedSphereIds.length === 0) {
        console.log('No related spheres found, showing global feed');
        await loadGlobalFeed(limit);
        return;
      }

      // Load comments from related spheres
      const comments = await loadCommentsFromSpheres(relatedSphereIds, limit * 2);

      // Sort by most recent first
      feedComments.value = comments
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);

      hasMore.value = comments.length > limit;

      // Show CTA banner if no comments from related spheres
      if (feedComments.value.length === 0) {
        showCTABanner.value = true;
      }

      console.log(`✓ Loaded ${feedComments.value.length} personal feed comments`);
    } catch (e) {
      error.value = `Failed to load personal feed: ${e}`;
      console.error('Error loading personal feed:', e);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Load more comments (pagination)
   */
  const loadMore = async () => {
    try {
      loading.value = true;

      if (profile.value?.id) {
        // Reload personal feed with increased offset
        currentOffset += pageSize;
        await loadPersonalFeed(profile.value.id, currentOffset + pageSize);
      } else {
        // Reload global feed with increased offset
        currentOffset += pageSize;
        await loadGlobalFeed(currentOffset + pageSize);
      }
    } catch (e) {
      error.value = `Failed to load more: ${e}`;
      console.error('Error loading more:', e);
    } finally {
      loading.value = false;
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
    if (relationListener) {
      relationListener.off();
      relationListener = null;
    }
    feedComments.value = [];
    voteCache.clear();
    userVoteCache.clear();
    error.value = null;
    currentOffset = 0;
  };

  /**
   * Lifecycle cleanup
   */
  onUnmounted(() => {
    clear();
  });

  /**
   * Watch for profile changes and reload feed
   */
  watchEffect(async () => {
    if (profile.value?.id) {
      await loadPersonalFeed(profile.value.id);
    } else {
      await loadGlobalFeed();
    }
  });

  return {
    feedComments,
    loading,
    error,
    hasMore,
    showCTABanner,
    loadGlobalFeed,
    loadPersonalFeed,
    loadMore,
    clear,
  };
}
